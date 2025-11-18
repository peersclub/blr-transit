import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all vehicles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const available = searchParams.get('available');
    const type = searchParams.get('type');

    const where: any = {};

    if (search) {
      where.OR = [
        { registrationNo: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (available !== null && available !== undefined) {
      where.isAvailable = available === 'true';
    }

    if (type && type !== 'all') {
      where.type = type;
    }

    const vehicles = await prisma.vehicle.findMany({
      where,
      include: {
        driverAssignments: {
          where: { isActive: true },
          include: {
            driver: true,
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

    // Calculate stats for each vehicle
    const vehiclesWithStats = vehicles.map((vehicle: any) => ({
      ...vehicle,
      upcomingTrips: vehicle.trips.length,
      assignedDriver: vehicle.driverAssignments[0]?.driver || null,
    }));

    return NextResponse.json({ success: true, data: vehiclesWithStats });
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch vehicles' },
      { status: 500 }
    );
  }
}

// POST create new vehicle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const vehicle = await prisma.vehicle.create({
      data: {
        registrationNo: body.registrationNo,
        type: body.type,
        make: body.make,
        model: body.model,
        year: parseInt(body.year),
        color: body.color,
        capacity: parseInt(body.capacity),
        rcDoc: body.rcDoc,
        insuranceDoc: body.insuranceDoc,
        insuranceExpiry: new Date(body.insuranceExpiry),
        fitnessDoc: body.fitnessDoc,
        fitnessExpiry: body.fitnessExpiry ? new Date(body.fitnessExpiry) : null,
        permitDoc: body.permitDoc,
        permitExpiry: body.permitExpiry ? new Date(body.permitExpiry) : null,
        fuelType: body.fuelType,
        mileage: body.mileage ? parseFloat(body.mileage) : null,
      },
    });

    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error) {
    console.error('Error creating vehicle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}

// PATCH update vehicle
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { vehicleId, ...updateData } = body;

    // Convert date fields if present
    if (updateData.insuranceExpiry) {
      updateData.insuranceExpiry = new Date(updateData.insuranceExpiry);
    }
    if (updateData.fitnessExpiry) {
      updateData.fitnessExpiry = new Date(updateData.fitnessExpiry);
    }
    if (updateData.permitExpiry) {
      updateData.permitExpiry = new Date(updateData.permitExpiry);
    }

    // Convert number fields
    if (updateData.year) updateData.year = parseInt(updateData.year);
    if (updateData.capacity) updateData.capacity = parseInt(updateData.capacity);
    if (updateData.mileage) updateData.mileage = parseFloat(updateData.mileage);
    if (updateData.totalKm) updateData.totalKm = parseFloat(updateData.totalKm);

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}
