import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendBookingConfirmation } from '@/lib/services/sms.service';

// GET bookings (admin or user-specific)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const tripId = searchParams.get('tripId');
    const status = searchParams.get('status');

    const where: any = {};

    if (userId) {
      where.userId = userId;
    }

    if (tripId) {
      where.tripId = tripId;
    }

    if (status) {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            company: {
              select: {
                name: true,
                discountPercent: true,
              },
            },
          },
        },
        trip: {
          include: {
            route: true,
            vehicle: true,
            driver: true,
          },
        },
        pickupPoint: true,
        payment: true,
        parkingBooking: {
          include: {
            parkingSpace: true,
            userVehicle: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Generate unique booking code
    const bookingCode = `BLR${Date.now().toString().slice(-6)}`;

    // Start a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Get trip details
      const trip = await tx.trip.findUnique({
        where: { id: body.tripId },
        include: {
          route: true,
        },
      });

      if (!trip) {
        throw new Error('Trip not found');
      }

      // Check seat availability
      const existingBookings = await tx.booking.count({
        where: {
          tripId: body.tripId,
          status: {
            not: 'CANCELLED',
          },
        },
      });

      if (existingBookings + body.numberOfSeats > trip.totalSeats) {
        throw new Error('Not enough seats available');
      }

      // Calculate pricing
      const user = await tx.user.findUnique({
        where: { id: body.userId },
        include: { company: true },
      });

      let baseAmount = trip.route.basePrice * body.numberOfSeats;
      let discountAmount = 0;

      if (user?.company?.discountPercent) {
        discountAmount = (baseAmount * user.company.discountPercent) / 100;
      }

      const taxAmount = (baseAmount - discountAmount) * 0.18; // 18% GST
      const totalAmount =
        baseAmount - discountAmount + taxAmount + (body.homePickupCharge || 0) + (body.parkingFee || 0);

      // Create booking
      const booking = await tx.booking.create({
        data: {
          bookingCode,
          userId: body.userId,
          tripId: body.tripId,
          pickupPointId: body.pickupPointId,
          pickupTime: new Date(body.pickupTime),
          seatNumbers: body.seatNumbers,
          numberOfSeats: body.numberOfSeats,
          homePickup: body.homePickup || false,
          homePickupAddress: body.homePickupAddress,
          homePickupType: body.homePickupType,
          homePickupCharge: body.homePickupCharge || 0,
          baseAmount,
          discountAmount,
          taxAmount,
          totalAmount,
          status: 'PENDING',
        },
      });

      // Create parking booking if applicable
      if (body.userVehicleId && body.parkingSpaceId) {
        await tx.parkingBooking.create({
          data: {
            bookingId: booking.id,
            userVehicleId: body.userVehicleId,
            parkingSpaceId: body.parkingSpaceId,
            parkingFee: body.parkingFee || 50,
            status: 'RESERVED',
          },
        });

        // Update parking space status
        await tx.parkingSpace.update({
          where: { id: body.parkingSpaceId },
          data: { status: 'RESERVED' },
        });
      }

      // Update trip available seats
      await tx.trip.update({
        where: { id: body.tripId },
        data: {
          availableSeats: {
            decrement: body.numberOfSeats,
          },
        },
      });

      return booking;
    });

    // Send SMS confirmation
    const user = await prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (user) {
      const trip = await prisma.trip.findUnique({
        where: { id: body.tripId },
        include: { route: true },
      });

      if (trip) {
        await sendBookingConfirmation(
          user.phone,
          bookingCode,
          trip.route.name,
          trip.departureTime.toLocaleTimeString()
        );
      }
    }

    // Fetch complete booking details
    const completeBooking = await prisma.booking.findUnique({
      where: { id: result.id },
      include: {
        user: true,
        trip: {
          include: {
            route: true,
            vehicle: true,
            driver: true,
          },
        },
        pickupPoint: true,
        parkingBooking: {
          include: {
            parkingSpace: true,
            userVehicle: true,
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: completeBooking, bookingCode },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create booking',
      },
      { status: 500 }
    );
  }
}

// PATCH cancel booking
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, cancellationReason } = body;

    const booking = await prisma.$transaction(async (tx: any) => {
      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date(),
          cancellationReason,
        },
        include: {
          parkingBooking: true,
        },
      });

      // Release parking space if applicable
      if (updatedBooking.parkingBooking) {
        await tx.parkingSpace.update({
          where: { id: updatedBooking.parkingBooking.parkingSpaceId },
          data: { status: 'AVAILABLE' },
        });

        await tx.parkingBooking.update({
          where: { id: updatedBooking.parkingBooking.id },
          data: { status: 'CANCELLED' },
        });
      }

      // Update trip available seats
      await tx.trip.update({
        where: { id: updatedBooking.tripId },
        data: {
          availableSeats: {
            increment: updatedBooking.numberOfSeats,
          },
        },
      });

      return updatedBooking;
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}