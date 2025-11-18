import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET all drivers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const available = searchParams.get('available');

    const where: any = {};

    if (search) {
      where.OR = [
        { licenseNumber: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (available !== null && available !== undefined) {
      where.isAvailable = available === 'true';
    }

    const drivers = await prisma.driver.findMany({
      where,
      include: {
        vehicleAssignments: {
          where: { isActive: true },
          include: {
            vehicle: true,
          },
        },
        trips: {
          where: {
            departureTime: {
              gte: new Date(),
            },
          },
          take: 5,
          orderBy: {
            departureTime: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Calculate stats for each driver
    const driversWithStats = drivers.map((driver: any) => ({
      ...driver,
      upcomingTrips: driver.trips.length,
      assignedVehicle: driver.vehicleAssignments[0]?.vehicle || null,
    }));

    return NextResponse.json({ success: true, data: driversWithStats });
  } catch (error) {
    console.error('Error fetching drivers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch drivers' },
      { status: 500 }
    );
  }
}

// POST create new driver
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          { phone: body.phone }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email or phone already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user and driver in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email: body.email,
          phone: body.phone,
          phoneVerified: body.phoneVerified || false,
          password: hashedPassword,
          firstName: body.firstName,
          lastName: body.lastName,
          role: body.role || 'DRIVER',
        },
      });

      // Create driver
      const driver = await tx.driver.create({
        data: {
          userId: user.id,
          licenseNumber: body.licenseNumber,
          licenseExpiry: new Date(body.licenseExpiry),
          licenseDoc: body.licenseDoc,
          aadharNumber: body.aadharNumber,
          aadharDoc: body.aadharDoc,
          panNumber: body.panNumber,
          address: body.address,
          city: body.city,
          state: body.state,
          pincode: body.pincode,
          bloodGroup: body.bloodGroup,
        }
      });

      return driver;
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating driver:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create driver' },
      { status: 500 }
    );
  }
}

// PATCH update driver
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, ...updateData } = body;

    // Convert date fields if present
    if (updateData.licenseExpiry) {
      updateData.licenseExpiry = new Date(updateData.licenseExpiry);
    }

    const driver = await prisma.driver.update({
      where: { id: driverId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: driver });
  } catch (error) {
    console.error('Error updating driver:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update driver' },
      { status: 500 }
    );
  }
}
