import { useState, useEffect, useCallback, useRef } from 'react';

export interface LiveTrip {
  id: string;
  tripCode: string;
  routeName: string;
  vehicleNo: string;
  driverName: string;
  departureTime: string;
  status: string;
  totalSeats: number;
  bookedSeats: number;
  availableSeats: number;
  occupancyPercent: number;
  lastUpdated: string;
}

interface LiveTripsData {
  type: string;
  timestamp?: string;
  trips?: LiveTrip[];
  message?: string;
}

export function useLiveTrips() {
  const [trips, setTrips] = useState<LiveTrip[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // Create new EventSource connection
      const eventSource = new EventSource('/api/trips/live');
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('✅ Live trips connection established');
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const data: LiveTripsData = JSON.parse(event.data);

          if (data.type === 'connected') {
            console.log('📡 Connected to live updates:', data.message);
          } else if (data.type === 'update' && data.trips) {
            setTrips(data.trips);
            setLastUpdate(data.timestamp || new Date().toISOString());
          } else if (data.type === 'error') {
            setError(data.message || 'Unknown error');
          }
        } catch (err) {
          console.error('Error parsing SSE data:', err);
          setError('Failed to parse update data');
        }
      };

      eventSource.onerror = (err) => {
        console.error('❌ EventSource error:', err);
        setIsConnected(false);
        setError('Connection lost. Reconnecting...');

        // Attempt to reconnect after 5 seconds
        setTimeout(() => {
          if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
            connect();
          }
        }, 5000);
      };
    } catch (err) {
      console.error('Failed to create EventSource:', err);
      setError('Failed to establish connection');
    }
  }, []);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    trips,
    isConnected,
    error,
    lastUpdate,
    connect,
    disconnect,
  };
}
