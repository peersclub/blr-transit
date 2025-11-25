'use client';

/**
 * Real-time Socket Hooks
 * =======================
 * React hooks for WebSocket functionality
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  getSocket,
  connectSocket,
  disconnectSocket,
  isSocketConnected,
  driverEvents,
  passengerEvents,
  adminEvents,
} from '@/lib/socket/client';
import type { Socket } from 'socket.io-client';

// ==================== useSocket Hook ====================
export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = getSocket();
    const socket = socketRef.current;

    const handleConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleError = (error: Error) => {
      setConnectionError(error.message);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleError);

    // Connect if not already connected
    if (!socket.connected) {
      connectSocket();
    } else {
      setIsConnected(true);
    }

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleError);
    };
  }, []);

  const connect = useCallback(() => {
    connectSocket();
  }, []);

  const disconnect = useCallback(() => {
    disconnectSocket();
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    connect,
    disconnect,
  };
}

// ==================== useDriverLocation Hook ====================
interface DriverLocation {
  driverId: string;
  tripId: string;
  latitude: number;
  longitude: number;
  heading: number;
  speed: number;
  timestamp: Date;
}

export function useDriverLocation(tripId: string) {
  const [location, setLocation] = useState<DriverLocation | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [isDriverOnline, setIsDriverOnline] = useState(false);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !tripId) return;

    const handleLocationUpdate = (data: DriverLocation) => {
      if (data.tripId === tripId) {
        setLocation(data);
      }
    };

    const handleEtaUpdate = (data: { tripId: string; eta: number }) => {
      if (data.tripId === tripId) {
        setEta(data.eta);
      }
    };

    const handleDriverOnline = (data: { tripId: string }) => {
      if (data.tripId === tripId) {
        setIsDriverOnline(true);
      }
    };

    const handleDriverOffline = (data: { tripId: string }) => {
      if (data.tripId === tripId) {
        setIsDriverOnline(false);
      }
    };

    socket.on('location:update', handleLocationUpdate);
    socket.on('eta:update', handleEtaUpdate);
    socket.on('driver:online', handleDriverOnline);
    socket.on('driver:offline', handleDriverOffline);

    return () => {
      socket.off('location:update', handleLocationUpdate);
      socket.off('eta:update', handleEtaUpdate);
      socket.off('driver:online', handleDriverOnline);
      socket.off('driver:offline', handleDriverOffline);
    };
  }, [socket, isConnected, tripId]);

  return { location, eta, isDriverOnline };
}

// ==================== useTripUpdates Hook ====================
interface TripStatus {
  tripId: string;
  status: string;
  currentStop?: string;
  nextStop?: string;
  eta?: number;
  delay?: number;
  occupancy: number;
  message?: string;
}

export function useTripUpdates(tripId: string, userId?: string) {
  const [tripStatus, setTripStatus] = useState<TripStatus | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !tripId) return;

    // Subscribe to trip updates
    if (userId) {
      passengerEvents.subscribe(tripId, userId);
    }

    const handleStatusUpdate = (data: TripStatus) => {
      if (data.tripId === tripId) {
        setTripStatus(data);
      }
    };

    const handleNotification = (data: any) => {
      if (data.tripId === tripId) {
        setNotifications((prev) => [...prev, data]);
      }
    };

    socket.on('trip:statusUpdate', handleStatusUpdate);
    socket.on('notification', handleNotification);

    return () => {
      passengerEvents.unsubscribe(tripId);
      socket.off('trip:statusUpdate', handleStatusUpdate);
      socket.off('notification', handleNotification);
    };
  }, [socket, isConnected, tripId, userId]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return { tripStatus, notifications, clearNotifications };
}

// ==================== useDriverTracking Hook (for drivers) ====================
export function useDriverTracking(driverId: string, tripId: string) {
  const { socket, isConnected } = useSocket();
  const watchIdRef = useRef<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const startTracking = useCallback(() => {
    if (!socket || !isConnected) return;

    // Register driver with server
    driverEvents.connect(driverId, tripId);

    // Start geolocation watching
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            driverId,
            tripId,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading || 0,
            speed: (position.coords.speed || 0) * 3.6, // Convert m/s to km/h
          };

          driverEvents.updateLocation(location);
          setLastUpdate(new Date());
        },
        (error) => {
          console.error('[Tracking] Geolocation error:', error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        }
      );

      setIsTracking(true);
    }
  }, [socket, isConnected, driverId, tripId]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  const updateTripStatus = useCallback(
    (status: string, options?: Partial<TripStatus>) => {
      driverEvents.updateTripStatus({
        tripId,
        status,
        occupancy: 0,
        ...options,
      });
    },
    [tripId]
  );

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    isTracking,
    lastUpdate,
    startTracking,
    stopTracking,
    updateTripStatus,
  };
}

// ==================== useAdminDashboard Hook ====================
export function useAdminDashboard() {
  const [activeTrips, setActiveTrips] = useState<Map<string, any>>(new Map());
  const [onlineDrivers, setOnlineDrivers] = useState<string[]>([]);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Register as admin
    adminEvents.monitorAll();

    const handleLocationUpdate = (data: DriverLocation) => {
      setActiveTrips((prev) => {
        const updated = new Map(prev);
        updated.set(data.tripId, {
          ...updated.get(data.tripId),
          location: data,
          lastUpdate: new Date(),
        });
        return updated;
      });
    };

    const handleTripUpdate = (data: TripStatus) => {
      setActiveTrips((prev) => {
        const updated = new Map(prev);
        updated.set(data.tripId, {
          ...updated.get(data.tripId),
          status: data,
          lastUpdate: new Date(),
        });
        return updated;
      });
    };

    const handleDriverOnline = (data: { driverId: string }) => {
      setOnlineDrivers((prev) => Array.from(new Set([...prev, data.driverId])));
    };

    const handleDriverOffline = (data: { driverId: string }) => {
      setOnlineDrivers((prev) => prev.filter((id) => id !== data.driverId));
    };

    socket.on('location:update', handleLocationUpdate);
    socket.on('trip:statusUpdate', handleTripUpdate);
    socket.on('driver:online', handleDriverOnline);
    socket.on('driver:offline', handleDriverOffline);

    return () => {
      socket.off('location:update', handleLocationUpdate);
      socket.off('trip:statusUpdate', handleTripUpdate);
      socket.off('driver:online', handleDriverOnline);
      socket.off('driver:offline', handleDriverOffline);
    };
  }, [socket, isConnected]);

  return { activeTrips, onlineDrivers };
}
