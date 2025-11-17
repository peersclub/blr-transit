import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all parking spaces
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const pickupPointId = searchParams.get('pickupPointId');

    const where: any = {};

    if (search) {
      where.OR = [
        { spaceNumber: { contains: search, mode: 'insensitive' } },
        { floor: { contains: search, mode: 'insensitive' } },
        { section: { contains: search, mode: 'insensitive' } },
        { pickupPoint: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && status !== 'all') {
      where.status = status;
    }

    if (pickupPointId && pickupPointId !== 'all') {
      where.pickupPointId = pickupPointId;
    }

    const parkingSpaces = await prisma.parkingSpace.findMany({
      where,
      include: {
        pickupPoint: true,
        parkingBookings: {
          where: {
            status: {
              in: ['RESERVED', 'CHECKED_IN'],
            },
          },
          include: {
            booking: {
              include: {
                user: true,
              },
            },
            userVehicle: true,
          },
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: [
        { pickupPoint: { name: 'asc' } },
        { spaceNumber: 'asc' },
      ],
    });

    // Add current booking info
    const spacesWithDetails = parkingSpaces.map((space) => ({
      ...space,
      currentBooking: space.parkingBookings[0] || null,
    }));

    return NextResponse.json({ success: true, data: spacesWithDetails });
  } catch (error) {
    console.error('Error fetching parking spaces:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch parking spaces' },
      { status: 500 }
    );
  }
}

// POST create new parking space
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      pickupPointId,
      spaceNumber,
      floor,
      section,
      type,
    } = body;

    const parkingSpace = await prisma.parkingSpace.create({
      data: {
        pickupPointId,
        spaceNumber,
        floor,
        section,
        type,
      },
      include: {
        pickupPoint: true,
      },
    });

    return NextResponse.json({ success: true, data: parkingSpace });
  } catch (error) {
    console.error('Error creating parking space:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create parking space' },
      { status: 500 }
    );
  }
}

// PATCH update parking space
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { parkingSpaceId, ...updateData } = body;

    const parkingSpace = await prisma.parkingSpace.update({
      where: { id: parkingSpaceId },
      data: updateData,
      include: {
        pickupPoint: true,
      },
    });

    return NextResponse.json({ success: true, data: parkingSpace });
  } catch (error) {
    console.error('Error updating parking space:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update parking space' },
      { status: 500 }
    );
  }
}
