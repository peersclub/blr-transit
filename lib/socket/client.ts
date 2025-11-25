/**
 * Socket.io Client Configuration
 * ================================
 * Client-side WebSocket connection for real-time features
 */

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export interface SocketConfig {
  url?: string;
  autoConnect?: boolean;
}

export function getSocket(config?: SocketConfig): Socket {
  if (!socket) {
    const url = config?.url || process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

    socket = io(url, {
      autoConnect: config?.autoConnect ?? false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    });

    // Connection event handlers
    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log('[Socket] Reconnected after', attemptNumber, 'attempts');
    });

    socket.on('reconnect_error', (error) => {
      console.error('[Socket] Reconnection error:', error.message);
    });
  }

  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function isSocketConnected(): boolean {
  return socket?.connected ?? false;
}

// Typed event emitters for drivers
export const driverEvents = {
  connect: (driverId: string, tripId: string) => {
    getSocket().emit('driver:connect', driverId, tripId);
  },

  updateLocation: (location: {
    driverId: string;
    tripId: string;
    latitude: number;
    longitude: number;
    heading: number;
    speed: number;
  }) => {
    getSocket().emit('driver:location', {
      ...location,
      timestamp: new Date(),
    });
  },

  updateTripStatus: (update: {
    tripId: string;
    status: string;
    currentStop?: string;
    nextStop?: string;
    eta?: number;
    delay?: number;
    occupancy: number;
    message?: string;
  }) => {
    getSocket().emit('driver:tripUpdate', update);
  },
};

// Typed event emitters for passengers
export const passengerEvents = {
  subscribe: (tripId: string, userId: string) => {
    getSocket().emit('passenger:subscribe', tripId, userId);
  },

  unsubscribe: (tripId: string) => {
    getSocket().emit('passenger:unsubscribe', tripId);
  },
};

// Typed event emitters for admins
export const adminEvents = {
  monitorAll: () => {
    getSocket().emit('admin:monitorAll');
  },
};

// Cleanup function for component unmounting
export function cleanupSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
