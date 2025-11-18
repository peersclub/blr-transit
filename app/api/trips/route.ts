import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all trips or filter by date/route
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const routeId = searchParams.get('routeId');
    const status = searchParams.get('status');

    const where: any = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where.departureTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (routeId) {
      where.routeId = routeId;
    }

    if (status) {
      where.status = status;
    }

    const trips = await prisma.trip.findMany({
      where,
      include: {
        route: true,
        vehicle: true,
        driver: true,
        bookings: {
          where: {
            status: {
              not: 'CANCELLED',
            },
          },
        },
        tripRevenue: true,
      },
      orderBy: {
        departureTime: 'asc',
      },
    });

    // Calculate available seats for each trip
    const tripsWithAvailability = trips.map((trip: any) => {
      const bookedSeats = trip.bookings.reduce(
        (sum: number, booking: any) => sum + booking.numberOfSeats,
        0
      );
      return {
        ...trip,
        bookedSeats,
        availableSeats: trip.totalSeats - bookedSeats,
      };
    });

    return NextResponse.json({ success: true, data: tripsWithAvailability });
  } catch (error) {
    console.error('Error fetching trips:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch trips' },
      { status: 500 }
    );
  }
}

// POST create new trip
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate unique trip code
    const tripCode = `TRP${Date.now().toString().slice(-6)}`;

    const trip = await prisma.trip.create({
      data: {
        tripCode,
        routeId: body.routeId,
        vehicleId: body.vehicleId,
        driverId: body.driverId,
        departureTime: new Date(body.departureTime),
        estimatedArrival: new Date(body.estimatedArrival),
        totalSeats: body.totalSeats,
        availableSeats: body.totalSeats,
        status: 'SCHEDULED',
      },
      include: {
        route: true,
        vehicle: true,
        driver: true,
      },
    });

    return NextResponse.json({ success: true, data: trip }, { status: 201 });
  } catch (error) {
    console.error('Error creating trip:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create trip' },
      { status: 500 }
    );
  }
}

// PATCH update trip status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { tripId, status, actualDeparture, actualArrival } = body;

    const updateData: any = { status };

    if (actualDeparture) {
      updateData.actualDeparture = new Date(actualDeparture);
    }

    if (actualArrival) {
      updateData.actualArrival = new Date(actualArrival);
    }

    const trip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData,
      include: {
        route: true,
        vehicle: true,
        driver: true,
      },
    });

    return NextResponse.json({ success: true, data: trip });
  } catch (error) {
    console.error('Error updating trip:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update trip' },
      { status: 500 }
    );
  }
}