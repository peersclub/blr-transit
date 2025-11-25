import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Real cost calculation constants based on Bangalore shuttle industry data (2024-2025)
// Sources: MoveInSync reports, BMTC data, industry analysis
const COST_CONSTANTS = {
  // Fuel costs (₹/km) - based on diesel prices ~₹90/L and vehicle mileage
  FUEL_COST_PER_KM: {
    FORCE_URBANIA: 7.2,      // 12.5 km/L mileage
    FORCE_TRAVELLER: 8.3,    // 10.8 km/L mileage
    URBANIA_EXECUTIVE: 6.8,  // 13.2 km/L mileage
    MINI_BUS: 9.5,           // 9.5 km/L mileage
  },

  // Driver cost per trip (based on ₹30,000/month salary, ~160 trips/month)
  DRIVER_COST_PER_TRIP: 188,

  // Maintenance cost (₹/km) - varies by vehicle age and type
  MAINTENANCE_COST_PER_KM: {
    FORCE_URBANIA: 2.5,
    FORCE_TRAVELLER: 3.0,
    URBANIA_EXECUTIVE: 2.8,
    MINI_BUS: 3.5,
  },

  // Fixed daily costs per vehicle (insurance, permits, depreciation, parking)
  FIXED_DAILY_COST: {
    FORCE_URBANIA: 450,
    FORCE_TRAVELLER: 520,
    URBANIA_EXECUTIVE: 580,
    MINI_BUS: 620,
  },

  // Platform/overhead cost percentage
  PLATFORM_OVERHEAD_PERCENT: 8,
};

// Calculate actual trip cost based on vehicle type and route distance
function calculateTripCost(
  vehicleType: string,
  routeDistance: number,
  isRoundTrip: boolean = true
): { fuelCost: number; driverCost: number; maintenanceCost: number; fixedCost: number; totalCost: number } {
  const distance = isRoundTrip ? routeDistance * 2 : routeDistance;
  const type = vehicleType as keyof typeof COST_CONSTANTS.FUEL_COST_PER_KM;

  const fuelCostPerKm = COST_CONSTANTS.FUEL_COST_PER_KM[type] || 8.0;
  const maintenanceCostPerKm = COST_CONSTANTS.MAINTENANCE_COST_PER_KM[type] || 3.0;
  const fixedDailyCost = COST_CONSTANTS.FIXED_DAILY_COST[type] || 500;

  const fuelCost = distance * fuelCostPerKm;
  const driverCost = COST_CONSTANTS.DRIVER_COST_PER_TRIP;
  const maintenanceCost = distance * maintenanceCostPerKm;
  // Allocate fixed daily cost across 4 trips per day average
  const fixedCost = fixedDailyCost / 4;

  const totalCost = fuelCost + driverCost + maintenanceCost + fixedCost;

  return {
    fuelCost: Math.round(fuelCost),
    driverCost: Math.round(driverCost),
    maintenanceCost: Math.round(maintenanceCost),
    fixedCost: Math.round(fixedCost),
    totalCost: Math.round(totalCost),
  };
}

// Calculate profit margin based on revenue and costs
function calculateProfitMargin(revenue: number, cost: number): number {
  if (revenue <= 0) return 0;
  return Math.round(((revenue - cost) / revenue) * 100 * 10) / 10;
}

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
      (sum: number, tr: any) => sum + tr.totalCost,
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

    // Calculate route-specific costs and profit margins
    const routeRevenue = Array.from(routePerformance.entries()).map(([routeId, perf]: [string, any]) => {
      // Get route details to calculate costs
      const routeTrips = trips.filter((t: any) => t.route.id === routeId);
      let routeTotalCost = 0;

      routeTrips.forEach((trip: any) => {
        const tripCost = calculateTripCost(
          trip.vehicle.type,
          trip.route.distance || 15 // Default 15km if not set
        );
        routeTotalCost += tripCost.totalCost;
      });

      // Add platform overhead
      routeTotalCost += routeTotalCost * (COST_CONSTANTS.PLATFORM_OVERHEAD_PERCENT / 100);

      return {
        ...perf,
        avgOccupancy: perf.totalSeats > 0 ? (perf.bookedSeats / perf.totalSeats) * 100 : 0,
        totalCost: Math.round(routeTotalCost),
        profitMargin: calculateProfitMargin(perf.revenue, routeTotalCost),
      };
    });

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
        (b: any) => new Date(b.createdAt) >= date && new Date(b.createdAt) < nextDate
      );

      const dayRevenue = {
        date: date.toISOString().split('T')[0],
        ticketRevenue: dayBookings.reduce((sum: number, b: any) => sum + b.baseAmount - b.discountAmount, 0),
        parkingRevenue: dayBookings.reduce((sum: number, b: any) => sum + (b.parkingBooking?.parkingFee || 0), 0),
        homePickupRevenue: dayBookings.reduce((sum: number, b: any) => sum + b.homePickupCharge, 0),
        totalRevenue: 0,
        totalCost: 0,
        netProfit: 0,
        trips: trips.filter(
          (t: any) => new Date(t.departureTime) >= date && new Date(t.departureTime) < nextDate
        ).length,
        passengers: dayBookings.reduce((sum: number, b: any) => sum + b.numberOfSeats, 0),
      };

      dayRevenue.totalRevenue =
        dayRevenue.ticketRevenue + dayRevenue.parkingRevenue + dayRevenue.homePickupRevenue;

      // Calculate actual costs based on trips that day
      const dayTrips = trips.filter(
        (t: any) => new Date(t.departureTime) >= date && new Date(t.departureTime) < nextDate
      );

      let dayCost = 0;
      dayTrips.forEach((trip: any) => {
        const tripCost = calculateTripCost(
          trip.vehicle.type,
          trip.route.distance || 15
        );
        dayCost += tripCost.totalCost;
      });

      // Add platform overhead
      dayCost += dayCost * (COST_CONSTANTS.PLATFORM_OVERHEAD_PERCENT / 100);

      dayRevenue.totalCost = Math.round(dayCost);
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
        totalPassengers: bookings.reduce((sum: number, b: any) => sum + b.numberOfSeats, 0),
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