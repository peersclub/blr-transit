import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET dashboard metrics
export async function GET(request: NextRequest) {
  try {
    // Get date ranges
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Fetch all metrics in parallel
    const [
      totalUsers,
      newUsersThisWeek,
      activeBookings,
      totalTripsToday,
      totalDrivers,
      availableVehicles,
      todayRevenue,
      weekRevenue,
      recentBookings,
      occupancyData,
    ] = await Promise.all([
      // Total users
      prisma.user.count({
        where: { isActive: true },
      }),

      // New users this week
      prisma.user.count({
        where: {
          createdAt: { gte: lastWeek },
        },
      }),

      // Active bookings (pending, confirmed, in-transit)
      prisma.booking.count({
        where: {
          status: {
            in: ['PENDING', 'CONFIRMED', 'IN_TRANSIT'],
          },
        },
      }),

      // Total trips today
      prisma.trip.count({
        where: {
          departureTime: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),

      // Total active drivers
      prisma.driver.count({
        where: { isAvailable: true },
      }),

      // Available vehicles
      prisma.vehicle.count({
        where: {
          isActive: true,
          isAvailable: true,
        },
      }),

      // Today's revenue
      prisma.booking.aggregate({
        where: {
          status: {
            not: 'CANCELLED',
          },
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // This week's revenue
      prisma.booking.aggregate({
        where: {
          status: {
            not: 'CANCELLED',
          },
          createdAt: {
            gte: lastWeek,
          },
        },
        _sum: {
          totalAmount: true,
        },
      }),

      // Recent bookings
      prisma.booking.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          trip: {
            include: {
              route: true,
            },
          },
        },
      }),

      // Fleet occupancy data
      prisma.trip.findMany({
        where: {
          departureTime: {
            gte: today,
            lt: tomorrow,
          },
        },
        select: {
          totalSeats: true,
          availableSeats: true,
        },
      }),
    ]);

    // Calculate occupancy rate
    let totalSeats = 0;
    let bookedSeats = 0;

    occupancyData.forEach((trip: { totalSeats: number; availableSeats: number }) => {
      totalSeats += trip.totalSeats;
      bookedSeats += trip.totalSeats - trip.availableSeats;
    });

    const occupancyRate = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;

    // Calculate growth percentages
    const lastWeekStart = new Date(lastWeek);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const previousWeekRevenue = await prisma.booking.aggregate({
      where: {
        status: {
          not: 'CANCELLED',
        },
        createdAt: {
          gte: lastWeekStart,
          lt: lastWeek,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    const revenueGrowth =
      previousWeekRevenue._sum.totalAmount && weekRevenue._sum.totalAmount
        ? ((weekRevenue._sum.totalAmount - previousWeekRevenue._sum.totalAmount) /
            previousWeekRevenue._sum.totalAmount) *
          100
        : 0;

    // Get daily revenue for the past 7 days
    const dailyRevenue = await Promise.all(
      Array.from({ length: 7 }, async (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - (6 - i));
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const revenue = await prisma.booking.aggregate({
          where: {
            status: {
              not: 'CANCELLED',
            },
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
          _sum: {
            totalAmount: true,
          },
        });

        return {
          date: date.toISOString().split('T')[0],
          amount: revenue._sum.totalAmount || 0,
        };
      })
    );

    const metrics = {
      totalUsers,
      newUsersThisWeek,
      userGrowth: newUsersThisWeek > 0 ? (newUsersThisWeek / totalUsers) * 100 : 0,
      activeBookings,
      totalTripsToday,
      totalRevenue: weekRevenue._sum.totalAmount || 0,
      todayRevenue: todayRevenue._sum.totalAmount || 0,
      revenueGrowth,
      totalDrivers,
      availableVehicles,
      occupancyRate,
      recentBookings: recentBookings.map((booking: any) => ({
        id: booking.id,
        bookingCode: booking.bookingCode,
        userName: `${booking.user.firstName} ${booking.user.lastName}`,
        route: booking.trip.route.name,
        time: booking.trip.departureTime.toLocaleTimeString(),
        status: booking.status.toLowerCase(),
      })),
      dailyRevenue,
    };

    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}