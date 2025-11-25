'use client';

/**
 * Live Tracking Map Component
 * ============================
 * Real-time map showing driver locations with animated markers
 */

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, DivIcon, LatLngExpression } from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useDriverLocation, useTripUpdates } from '@/hooks/useSocket';
import { Bus, MapPin, Clock, Users, Navigation, Wifi, WifiOff } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface LiveTrackingMapProps {
  tripId: string;
  userId?: string;
  pickupPoints?: Array<{
    name: string;
    latitude: number;
    longitude: number;
    type: 'pickup' | 'dropoff' | 'stop';
  }>;
  routePath?: Array<[number, number]>;
  className?: string;
}

// Custom animated marker that follows the driver
function AnimatedDriverMarker({
  position,
  heading,
  isOnline,
}: {
  position: [number, number];
  heading: number;
  isOnline: boolean;
}) {
  const map = useMap();
  const markerRef = useRef<any>(null);

  // Smoothly animate marker position
  useEffect(() => {
    if (markerRef.current) {
      const marker = markerRef.current;
      const currentLatLng = marker.getLatLng();
      const targetLatLng = { lat: position[0], lng: position[1] };

      // Smooth animation
      const duration = 1000; // ms
      const startTime = Date.now();
      const startLat = currentLatLng.lat;
      const startLng = currentLatLng.lng;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3);

        const newLat = startLat + (targetLatLng.lat - startLat) * eased;
        const newLng = startLng + (targetLatLng.lng - startLng) * eased;

        marker.setLatLng([newLat, newLng]);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    }
  }, [position]);

  // Create custom bus icon with rotation
  const busIcon = new DivIcon({
    className: 'custom-driver-marker',
    html: `
      <div class="relative">
        <div class="absolute -inset-2 ${isOnline ? 'bg-green-500' : 'bg-gray-500'} rounded-full opacity-30 animate-ping"></div>
        <div class="relative w-10 h-10 ${isOnline ? 'bg-green-500' : 'bg-gray-500'} rounded-full flex items-center justify-center shadow-lg transform" style="transform: rotate(${heading}deg)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6v6"></path>
            <path d="M15 6v6"></path>
            <path d="M2 12h19.6"></path>
            <path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"></path>
            <circle cx="7" cy="18" r="2"></circle>
            <path d="M9 18h5"></path>
            <circle cx="16" cy="18" r="2"></circle>
          </svg>
        </div>
        <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
          <div class="w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-${isOnline ? 'green' : 'gray'}-500"></div>
        </div>
      </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50],
  });

  return (
    <Marker ref={markerRef} position={position} icon={busIcon}>
      <Popup>
        <div className="text-center">
          <strong>Shuttle</strong>
          <br />
          {isOnline ? (
            <span className="text-green-600">● Live</span>
          ) : (
            <span className="text-gray-500">● Offline</span>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

// Pickup point marker
function PickupMarker({
  position,
  name,
  type,
}: {
  position: [number, number];
  name: string;
  type: 'pickup' | 'dropoff' | 'stop';
}) {
  const colors = {
    pickup: 'bg-blue-500',
    dropoff: 'bg-red-500',
    stop: 'bg-yellow-500',
  };

  const pickupIcon = new DivIcon({
    className: 'custom-pickup-marker',
    html: `
      <div class="w-6 h-6 ${colors[type]} rounded-full flex items-center justify-center shadow-md border-2 border-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        </svg>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });

  return (
    <Marker position={position} icon={pickupIcon}>
      <Popup>
        <div className="text-center">
          <strong>{name}</strong>
          <br />
          <span className="text-sm text-gray-600 capitalize">{type}</span>
        </div>
      </Popup>
    </Marker>
  );
}

// Map bounds auto-fit
function MapBoundsUpdater({ bounds }: { bounds: LatLngExpression[] }) {
  const map = useMap();

  useEffect(() => {
    if (bounds.length > 0) {
      map.fitBounds(bounds as any, { padding: [50, 50] });
    }
  }, [map, bounds]);

  return null;
}

export default function LiveTrackingMap({
  tripId,
  userId,
  pickupPoints = [],
  routePath = [],
  className = '',
}: LiveTrackingMapProps) {
  const { location, eta, isDriverOnline } = useDriverLocation(tripId);
  const { tripStatus, notifications } = useTripUpdates(tripId, userId);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<any>(null);

  // Bangalore center as default
  const defaultCenter: [number, number] = [12.9716, 77.5946];

  // Driver position (use default if not available)
  const driverPosition: [number, number] = location
    ? [location.latitude, location.longitude]
    : defaultCenter;

  // Show notifications when they arrive
  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[notifications.length - 1];
      setCurrentNotification(latest);
      setShowNotification(true);

      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  // Calculate bounds for map
  const allPoints: [number, number][] = [
    driverPosition,
    ...pickupPoints.map((p) => [p.latitude, p.longitude] as [number, number]),
  ];

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      {/* Connection Status Badge */}
      <div className="absolute top-4 right-4 z-[1000]">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            isDriverOnline
              ? 'bg-green-500/90 text-white'
              : 'bg-gray-500/90 text-white'
          }`}
        >
          {isDriverOnline ? (
            <>
              <Wifi className="w-4 h-4" />
              Live Tracking
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4" />
              Waiting for driver...
            </>
          )}
        </motion.div>
      </div>

      {/* ETA Badge */}
      {eta && (
        <div className="absolute top-4 left-4 z-[1000]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur rounded-xl shadow-lg"
          >
            <Clock className="w-5 h-5 text-tech-purple" />
            <div>
              <p className="text-xs text-gray-500">Arriving in</p>
              <p className="text-lg font-bold text-gray-900">{eta} min</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Trip Status Badge */}
      {tripStatus && (
        <div className="absolute bottom-4 left-4 z-[1000]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-2 bg-white/95 backdrop-blur rounded-xl shadow-lg"
          >
            <div
              className={`w-3 h-3 rounded-full ${
                tripStatus.status === 'IN_TRANSIT'
                  ? 'bg-green-500 animate-pulse'
                  : tripStatus.status === 'BOARDING'
                  ? 'bg-yellow-500'
                  : 'bg-gray-400'
              }`}
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {tripStatus.status.replace('_', ' ')}
              </p>
              {tripStatus.currentStop && (
                <p className="text-xs text-gray-500">
                  at {tripStatus.currentStop}
                </p>
              )}
            </div>
            {tripStatus.occupancy > 0 && (
              <div className="flex items-center gap-1 ml-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span className="text-sm">{tripStatus.occupancy}%</span>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Notification Toast */}
      <AnimatePresence>
        {showNotification && currentNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 z-[1000]"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-tech-purple text-white rounded-xl shadow-lg">
              <Bus className="w-5 h-5" />
              <div>
                <p className="font-medium">{currentNotification.title}</p>
                <p className="text-sm opacity-90">{currentNotification.message}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map */}
      <MapContainer
        center={driverPosition}
        zoom={14}
        style={{ height: '100%', minHeight: '400px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Route Path */}
        {routePath.length > 0 && (
          <Polyline
            positions={routePath}
            pathOptions={{
              color: '#6B46C1',
              weight: 4,
              opacity: 0.7,
              dashArray: '10, 10',
            }}
          />
        )}

        {/* Pickup Points */}
        {pickupPoints.map((point, index) => (
          <PickupMarker
            key={index}
            position={[point.latitude, point.longitude]}
            name={point.name}
            type={point.type}
          />
        ))}

        {/* Driver Marker */}
        <AnimatedDriverMarker
          position={driverPosition}
          heading={location?.heading || 0}
          isOnline={isDriverOnline}
        />

        {/* Auto-fit bounds */}
        <MapBoundsUpdater bounds={allPoints} />
      </MapContainer>

      {/* Custom CSS for markers */}
      <style jsx global>{`
        .custom-driver-marker,
        .custom-pickup-marker {
          background: transparent !important;
          border: none !important;
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}
