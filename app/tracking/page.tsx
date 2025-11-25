'use client';

/**
 * Live Tracking Demo Page
 * ========================
 * Demonstrates real-time tracking features
 */

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useSocket } from '@/hooks/useSocket';
import { NotificationProvider, useNotifications } from '@/components/tracking/NotificationToast';
import DriverTrackingPanel from '@/components/tracking/DriverTrackingPanel';
import {
  Map,
  Bus,
  User,
  Radio,
  Wifi,
  WifiOff,
  Play,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

// Dynamic import for map (avoid SSR issues with Leaflet)
const LiveTrackingMap = dynamic(
  () => import('@/components/tracking/LiveTrackingMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-gray-800 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gray-500 animate-spin mx-auto mb-2" />
          <p className="text-gray-400">Loading map...</p>
        </div>
      </div>
    ),
  }
);

// Demo data
const demoTrip = {
  tripId: 'DEMO-TRIP-001',
  driverId: 'DEMO-DRIVER-001',
  routeName: 'Whitefield → Electronic City',
  startPoint: 'Whitefield ITPL',
  endPoint: 'Electronic City Phase 1',
  scheduledTime: '8:30 AM',
  totalSeats: 17,
  bookedSeats: 12,
};

const demoStops = [
  { name: 'Whitefield ITPL', estimatedTime: '8:30 AM' },
  { name: 'Marathahalli Bridge', estimatedTime: '8:50 AM' },
  { name: 'Silk Board Junction', estimatedTime: '9:15 AM' },
  { name: 'HSR Layout BDA', estimatedTime: '9:30 AM' },
  { name: 'Electronic City Phase 1', estimatedTime: '9:50 AM' },
];

const demoPickupPoints = [
  { name: 'Whitefield ITPL', latitude: 12.9854, longitude: 77.7363, type: 'pickup' as const },
  { name: 'Marathahalli Bridge', latitude: 12.9562, longitude: 77.7019, type: 'stop' as const },
  { name: 'Silk Board Junction', latitude: 12.9175, longitude: 77.6226, type: 'stop' as const },
  { name: 'HSR Layout BDA', latitude: 12.9116, longitude: 77.6389, type: 'stop' as const },
  { name: 'Electronic City', latitude: 12.8456, longitude: 77.6603, type: 'dropoff' as const },
];

function TrackingContent() {
  const { isConnected, connectionError } = useSocket();
  const { addNotification } = useNotifications();
  const [viewMode, setViewMode] = useState<'passenger' | 'driver'>('passenger');
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate driver movement for demo
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      addNotification({
        type: 'trip',
        title: 'Driver Update',
        message: 'Shuttle is approaching next stop',
        tripId: demoTrip.tripId,
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [isSimulating, addNotification]);

  const startSimulation = () => {
    setIsSimulating(true);
    addNotification({
      type: 'success',
      title: 'Simulation Started',
      message: 'Driver tracking simulation is now active',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl font-bold text-gradient">
                BLR Transit
              </Link>
              <span className="text-gray-500">|</span>
              <span className="text-white font-medium">Live Tracking</span>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                  isConnected
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    Connected
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    {connectionError || 'Disconnected'}
                  </>
                )}
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('passenger')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'passenger'
                      ? 'bg-tech-purple text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  Passenger
                </button>
                <button
                  onClick={() => setViewMode('driver')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    viewMode === 'driver'
                      ? 'bg-tech-purple text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Bus className="w-4 h-4" />
                  Driver
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Demo Notice */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-yellow-400 font-medium">Demo Mode</p>
              <p className="text-sm text-yellow-300/70">
                This is a demonstration of real-time tracking. Connect the WebSocket server for live data.
              </p>
            </div>
            {!isSimulating && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startSimulation}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-medium rounded-lg"
              >
                <Play className="w-4 h-4" />
                Start Demo
              </motion.button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Map className="w-5 h-5 text-tech-purple" />
                {viewMode === 'passenger' ? 'Track Your Shuttle' : 'Broadcast Location'}
              </h2>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl overflow-hidden border border-gray-800"
            >
              <LiveTrackingMap
                tripId={demoTrip.tripId}
                userId="demo-user"
                pickupPoints={demoPickupPoints}
                className="h-[500px]"
              />
            </motion.div>

            {/* Trip Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Trip Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Route</p>
                  <p className="text-white font-medium">{demoTrip.routeName}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Departure</p>
                  <p className="text-white font-medium">{demoTrip.scheduledTime}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Passengers</p>
                  <p className="text-white font-medium">
                    {demoTrip.bookedSeats}/{demoTrip.totalSeats}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <p className="text-green-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    In Transit
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {viewMode === 'driver' ? (
              <DriverTrackingPanel
                driverId={demoTrip.driverId}
                tripId={demoTrip.tripId}
                tripDetails={{
                  routeName: demoTrip.routeName,
                  startPoint: demoTrip.startPoint,
                  endPoint: demoTrip.endPoint,
                  scheduledTime: demoTrip.scheduledTime,
                  totalSeats: demoTrip.totalSeats,
                  bookedSeats: demoTrip.bookedSeats,
                }}
                stops={demoStops}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-900 rounded-2xl p-6 space-y-6"
              >
                <h3 className="text-xl font-bold text-white">Your Trip</h3>

                {/* ETA Card */}
                <div className="bg-gradient-to-r from-tech-purple/20 to-bangalore-blue/20 rounded-xl p-4">
                  <p className="text-gray-400 text-sm">Estimated Arrival</p>
                  <p className="text-3xl font-bold text-white">12 min</p>
                  <p className="text-gray-400 text-sm mt-1">at Electronic City Phase 1</p>
                </div>

                {/* Stops List */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-400">Route Stops</h4>
                  {demoStops.map((stop, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-xl ${
                        index === 2 ? 'bg-tech-purple/10 border border-tech-purple/30' : 'bg-gray-800'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index < 2
                            ? 'bg-green-500 text-white'
                            : index === 2
                            ? 'bg-tech-purple text-white'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {index < 2 ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className={index <= 2 ? 'text-white' : 'text-gray-500'}>
                          {stop.name}
                        </p>
                        <p className="text-xs text-gray-500">{stop.estimatedTime}</p>
                      </div>
                      {index === 2 && (
                        <span className="text-xs text-tech-purple font-medium">Current</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors">
                    Contact Driver
                  </button>
                  <button className="flex-1 py-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-colors">
                    Cancel Trip
                  </button>
                </div>
              </motion.div>
            )}

            {/* How It Works */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-3">How Real-Time Works</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-start gap-2">
                  <span className="text-tech-purple">•</span>
                  WebSocket connection for instant updates
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tech-purple">•</span>
                  GPS tracking updates every 5 seconds
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tech-purple">•</span>
                  Push notifications for status changes
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tech-purple">•</span>
                  Live ETA calculations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <NotificationProvider>
      <TrackingContent />
    </NotificationProvider>
  );
}
