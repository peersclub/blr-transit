/**
 * Socket.io Server Configuration
 * ===============================
 * Real-time WebSocket server for BLR Transit
 *
 * Features:
 * - Driver location tracking
 * - Trip status updates
 * - Passenger notifications
 * - ETA calculations
 */

import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

// Types for real-time events
export interface DriverLocation {
  driverId: string;
  tripId: string;
  latitude: number;
  longitude: number;
  heading: number; // Direction in degrees
  speed: number; // km/h
  timestamp: Date;
}

export interface TripUpdate {
  tripId: string;
  status: 'SCHEDULED' | 'BOARDING' | 'IN_TRANSIT' | 'ARRIVING' | 'COMPLETED' | 'CANCELLED';
  currentStop?: string;
  nextStop?: string;
  eta?: number; // minutes
  delay?: number; // minutes
  occupancy: number; // percentage
  message?: string;
}

export interface PassengerNotification {
  tripId: string;
  userId: string;
  type: 'DRIVER_ARRIVING' | 'TRIP_STARTED' | 'APPROACHING_STOP' | 'DELAY' | 'CANCELLED';
  title: string;
  message: string;
  timestamp: Date;
}

// Connected clients tracking
const connectedDrivers = new Map<string, string>(); // driverId -> socketId
const connectedPassengers = new Map<string, Set<string>>(); // tripId -> Set of socketIds
const tripSubscriptions = new Map<string, Set<string>>(); // tripId -> Set of socketIds watching

let io: SocketIOServer | null = null;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // ==================== DRIVER EVENTS ====================

    // Driver connects and registers
    socket.on('driver:connect', (driverId: string, tripId: string) => {
      connectedDrivers.set(driverId, socket.id);
      socket.join(`trip:${tripId}`);
      socket.join(`driver:${driverId}`);

      console.log(`[Socket] Driver ${driverId} connected for trip ${tripId}`);

      // Notify passengers that driver is online
      io?.to(`trip:${tripId}`).emit('driver:online', {
        driverId,
        tripId,
        timestamp: new Date(),
      });
    });

    // Driver sends location update
    socket.on('driver:location', (location: DriverLocation) => {
      // Broadcast to all passengers watching this trip
      io?.to(`trip:${location.tripId}`).emit('location:update', location);

      // Calculate and broadcast ETA updates
      const eta = calculateETA(location);
      if (eta) {
        io?.to(`trip:${location.tripId}`).emit('eta:update', {
          tripId: location.tripId,
          eta,
          timestamp: new Date(),
        });
      }
    });

    // Driver updates trip status
    socket.on('driver:tripUpdate', (update: TripUpdate) => {
      io?.to(`trip:${update.tripId}`).emit('trip:statusUpdate', update);

      // Send push notification for important updates
      if (['BOARDING', 'IN_TRANSIT', 'ARRIVING'].includes(update.status)) {
        notifyPassengers(update);
      }
    });

    // ==================== PASSENGER EVENTS ====================

    // Passenger subscribes to trip updates
    socket.on('passenger:subscribe', (tripId: string, userId: string) => {
      socket.join(`trip:${tripId}`);
      socket.join(`user:${userId}`);

      // Track subscription
      if (!tripSubscriptions.has(tripId)) {
        tripSubscriptions.set(tripId, new Set());
      }
      tripSubscriptions.get(tripId)?.add(socket.id);

      console.log(`[Socket] Passenger ${userId} subscribed to trip ${tripId}`);

      // Send current trip status
      socket.emit('trip:currentStatus', {
        tripId,
        subscribed: true,
        timestamp: new Date(),
      });
    });

    // Passenger unsubscribes from trip
    socket.on('passenger:unsubscribe', (tripId: string) => {
      socket.leave(`trip:${tripId}`);
      tripSubscriptions.get(tripId)?.delete(socket.id);
    });

    // ==================== ADMIN EVENTS ====================

    // Admin monitors all trips
    socket.on('admin:monitorAll', () => {
      socket.join('admin:dashboard');
      console.log(`[Socket] Admin connected to dashboard`);
    });

    // ==================== DISCONNECT ====================

    socket.on('disconnect', () => {
      // Clean up driver connection
      for (const [driverId, socketId] of Array.from(connectedDrivers.entries())) {
        if (socketId === socket.id) {
          connectedDrivers.delete(driverId);
          console.log(`[Socket] Driver ${driverId} disconnected`);
          break;
        }
      }

      // Clean up trip subscriptions
      for (const [tripId, sockets] of Array.from(tripSubscriptions.entries())) {
        sockets.delete(socket.id);
      }

      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

// Calculate ETA based on driver location and route
function calculateETA(location: DriverLocation): number | null {
  // This would integrate with a routing API in production
  // For now, estimate based on speed and typical distances
  const avgRemainingDistance = 5; // km (placeholder)
  const avgSpeed = location.speed > 0 ? location.speed : 20; // km/h

  return Math.round((avgRemainingDistance / avgSpeed) * 60); // minutes
}

// Send notifications to passengers
function notifyPassengers(update: TripUpdate) {
  const notifications: Record<string, { title: string; message: string }> = {
    BOARDING: {
      title: 'Boarding Started',
      message: `Your shuttle for trip ${update.tripId} has started boarding at ${update.currentStop}`,
    },
    IN_TRANSIT: {
      title: 'Trip Started',
      message: `Your shuttle is now on the way. ETA: ${update.eta} minutes`,
    },
    ARRIVING: {
      title: 'Arriving Soon',
      message: `Your shuttle is arriving at ${update.nextStop} in ${update.eta} minutes`,
    },
  };

  const notification = notifications[update.status];
  if (notification && io) {
    io.to(`trip:${update.tripId}`).emit('notification', {
      tripId: update.tripId,
      type: update.status,
      ...notification,
      timestamp: new Date(),
    });
  }
}

// Export functions for use in API routes
export function getIO(): SocketIOServer | null {
  return io;
}

export function emitToTrip(tripId: string, event: string, data: any) {
  io?.to(`trip:${tripId}`).emit(event, data);
}

export function emitToDriver(driverId: string, event: string, data: any) {
  io?.to(`driver:${driverId}`).emit(event, data);
}

export function emitToUser(userId: string, event: string, data: any) {
  io?.to(`user:${userId}`).emit(event, data);
}

export function emitToAdmins(event: string, data: any) {
  io?.to('admin:dashboard').emit(event, data);
}

export function getConnectedDrivers(): string[] {
  return Array.from(connectedDrivers.keys());
}

export function getTripSubscriberCount(tripId: string): number {
  return tripSubscriptions.get(tripId)?.size || 0;
}
