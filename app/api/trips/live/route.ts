import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// Mark this route as dynamic (no static generation)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Server-Sent Events endpoint for real-time trip updates
export async function GET(request: NextRequest) {
  // Set up SSE headers
  const encoder = new TextEncoder();

  const customReadable = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: 'connected', message: 'Live updates connected' })}\n\n`)
      );

      // Function to send trip updates
      const sendUpdate = async () => {
        try {
          // Get all active trips with real-time data
          const trips = await prisma.trip.findMany({
            where: {
              status: {
                in: ['SCHEDULED', 'BOARDING', 'DEPARTED', 'IN_TRANSIT']
              },
              departureTime: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
                lte: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24 hours
              }
            },
            include: {
              route: true,
              vehicle: true,
              driver: true,
              bookings: {
                where: {
                  status: {
                    not: 'CANCELLED'
                  }
                }
              }
            },
            orderBy: {
              departureTime: 'asc'
            },
            take: 50 // Limit to avoid too much data
          });

          // Calculate live seat availability
          const tripsWithAvailability = trips.map((trip: any) => {
            const bookedSeats = trip.bookings.reduce(
              (sum: number, booking: any) => sum + booking.numberOfSeats,
              0
            );

            return {
              id: trip.id,
              tripCode: trip.tripCode,
              routeName: trip.route.name,
              vehicleNo: trip.vehicle.registrationNo,
              driverName: `${trip.driver.licenseNumber}`,
              departureTime: trip.departureTime,
              status: trip.status,
              totalSeats: trip.totalSeats,
              bookedSeats,
              availableSeats: trip.totalSeats - bookedSeats,
              occupancyPercent: Math.round((bookedSeats / trip.totalSeats) * 100),
              lastUpdated: new Date().toISOString()
            };
          });

          // Send update
          const data = {
            type: 'update',
            timestamp: new Date().toISOString(),
            trips: tripsWithAvailability
          };

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch (error) {
          console.error('Error fetching trip updates:', error);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'error', message: 'Failed to fetch updates' })}\n\n`)
          );
        }
      };

      // Send initial update
      await sendUpdate();

      // Set up interval for periodic updates (every 10 seconds)
      const interval = setInterval(sendUpdate, 10000);

      // Cleanup function
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
