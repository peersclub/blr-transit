import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET revenue analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'week'; // day, week, month, year

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
    }

    // Fetch revenue data
    const [bookings, trips, tripRevenues] = await Promise.all([
      // Get all bookings in range
      prisma.booking.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: {
            not: 'CANCELLED',
          },
        },
        include: {
          trip: {
            include: {
              route: true,
              vehicle: true,
            },
          },
          parkingBooking: true,
        },
      }),

      // Get trips in range
      prisma.trip.findMany({
        where: {
          departureTime: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          route: true,
          vehicle: true,
          tripRevenue: true,
        },
      }),

      // Get trip revenues
      prisma.tripRevenue.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          trip: {
            include: {
              route: true,
            },
          },
        },
      }),
    ]);

    // Calculate revenue breakdown
    let ticketRevenue = 0;
    let parkingRevenue = 0;
    let homePickupRevenue = 0;

    bookings.forEach((booking: any) => {
      ticketRevenue += booking.baseAmount - booking.discountAmount;
      homePickupRevenue += booking.homePickupCharge;
      if (booking.parkingBooking) {
        parkingRevenue += booking.parkingBooking.parkingFee;
      }
    });

    const totalRevenue = ticketRevenue + parkingRevenue + homePickupRevenue;

    // Calculate costs
    const totalCosts = tripRevenues.reduce(
      (sum, tr) => sum + tr.totalCost,
      0
    );

    const netProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    // Route performance
    const routePerformance = new Map();

    trips.forEach((trip: any) => {
      const routeId = trip.route.id;
      if (!routePerformance.has(routeId)) {
        routePerformance.set(routeId, {
          route: trip.route.name,
          revenue: 0,
          trips: 0,
          totalSeats: 0,
          bookedSeats: 0,
        });
      }

      const perf = routePerformance.get(routeId);
      perf.trips += 1;
      perf.totalSeats += trip.totalSeats;
      perf.bookedSeats += trip.totalSeats - trip.availableSeats;

      if (trip.tripRevenue) {
        perf.revenue += trip.tripRevenue.totalRevenue;
      }
    });

    const routeRevenue = Array.from(routePerformance.values()).map((perf: any) => ({
      ...perf,
      avgOccupancy: perf.totalSeats > 0 ? (perf.bookedSeats / perf.totalSeats) * 100 : 0,
      profitMargin: 35, // Placeholder - calculate based on actual costs
    }));

    // Vehicle performance
    const vehiclePerformance = new Map();

    trips.forEach((trip: any) => {
      const vehicleId = trip.vehicle.id;
      if (!vehiclePerformance.has(vehicleId)) {
        vehiclePerformance.set(vehicleId, {
          vehicle: trip.vehicle.registrationNo,
          type: trip.vehicle.type,
          revenue: 0,
          trips: 0,
          fuelCost: 0,
          maintenanceCost: 0,
        });
      }

      const perf = vehiclePerformance.get(vehicleId);
      perf.trips += 1;

      if (trip.tripRevenue) {
        perf.revenue += trip.tripRevenue.totalRevenue;
        perf.fuelCost += trip.tripRevenue.fuelCost;
        perf.maintenanceCost += trip.tripRevenue.maintenanceCost;
      }
    });

    const vehicleRevenue = Array.from(vehiclePerformance.values()).map((perf: any) => ({
      ...perf,
      profitability: perf.revenue - perf.fuelCost - perf.maintenanceCost,
    }));

    // Daily revenue data
    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayBookings = bookings.filter(
        (b) => new Date(b.createdAt) >= date && new Date(b.createdAt) < nextDate
      );

      const dayRevenue = {
        date: date.toISOString().split('T')[0],
        ticketRevenue: dayBookings.reduce((sum, b) => sum + b.baseAmount - b.discountAmount, 0),
        parkingRevenue: dayBookings.reduce((sum, b) => sum + (b.parkingBooking?.parkingFee || 0), 0),
        homePickupRevenue: dayBookings.reduce((sum, b) => sum + b.homePickupCharge, 0),
        totalRevenue: 0,
        totalCost: 0,
        netProfit: 0,
        trips: trips.filter(
          (t) => new Date(t.departureTime) >= date && new Date(t.departureTime) < nextDate
        ).length,
        passengers: dayBookings.reduce((sum, b) => sum + b.numberOfSeats, 0),
      };

      dayRevenue.totalRevenue =
        dayRevenue.ticketRevenue + dayRevenue.parkingRevenue + dayRevenue.homePickupRevenue;
      dayRevenue.totalCost = dayRevenue.totalRevenue * 0.5; // Placeholder - 50% cost ratio
      dayRevenue.netProfit = dayRevenue.totalRevenue - dayRevenue.totalCost;

      dailyData.push(dayRevenue);
    }

    const response = {
      summary: {
        totalRevenue,
        ticketRevenue,
        parkingRevenue,
        homePickupRevenue,
        totalCosts,
        netProfit,
        profitMargin,
        totalTrips: trips.length,
        totalBookings: bookings.length,
        totalPassengers: bookings.reduce((sum, b) => sum + b.numberOfSeats, 0),
      },
      revenueBreakdown: {
        tickets: ticketRevenue,
        parking: parkingRevenue,
        homePickup: homePickupRevenue,
      },
      dailyData: dailyData.reverse(),
      routeRevenue,
      vehicleRevenue,
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch revenue analytics' },
      { status: 500 }
    );
  }
}