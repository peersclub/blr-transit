'use client';

import { useLiveTrips } from '@/hooks/useLiveTrips';
import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Users, Clock, Activity, Wifi, WifiOff } from 'lucide-react';

export default function RealTimeTripMonitor() {
  const { trips, isConnected, error, lastUpdate } = useLiveTrips();

  const getOccupancyColor = (percent: number) => {
    if (percent >= 90) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (percent >= 70) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (percent >= 50) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    return 'text-green-400 bg-green-500/10 border-green-500/20';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'BOARDING':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'DEPARTED':
      case 'IN_TRANSIT':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with connection status */}
      <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-tech-purple" />
          <div>
            <h3 className="text-lg font-semibold text-white">Live Trip Monitor</h3>
            <p className="text-sm text-gray-400">
              {lastUpdate ? `Last updated: ${new Date(lastUpdate).toLocaleTimeString()}` : 'Connecting...'}
            </p>
          </div>
        </div>

        {/* Connection indicator */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <>
              <Wifi className="w-5 h-5 text-green-400" />
              <span className="text-sm text-green-400 font-medium">Live</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 bg-green-400 rounded-full"
              />
            </>
          ) : (
            <>
              <WifiOff className="w-5 h-5 text-red-400" />
              <span className="text-sm text-red-400 font-medium">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
        >
          <p className="text-red-400 text-sm">{error}</p>
        </motion.div>
      )}

      {/* Trip cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {trips.map((trip) => (
            <motion.div
              key={trip.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-5 hover:border-tech-purple transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Bus className="w-4 h-4 text-tech-purple" />
                    <span className="font-mono text-white font-semibold">{trip.tripCode}</span>
                  </div>
                  <p className="text-sm text-gray-400">{trip.routeName}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(trip.status)}`}
                >
                  {trip.status}
                </span>
              </div>

              {/* Vehicle & Time */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Bus className="w-4 h-4" />
                  <span>{trip.vehicleNo}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(trip.departureTime).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Seat availability */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">Seats</span>
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {trip.bookedSeats}/{trip.totalSeats}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${trip.occupancyPercent}%` }}
                    transition={{ duration: 0.5 }}
                    className={`h-full ${
                      trip.occupancyPercent >= 90
                        ? 'bg-red-500'
                        : trip.occupancyPercent >= 70
                        ? 'bg-orange-500'
                        : trip.occupancyPercent >= 50
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                </div>

                {/* Availability badge */}
                <div className={`flex items-center justify-between p-2 rounded-lg border ${getOccupancyColor(trip.occupancyPercent)}`}>
                  <span className="text-xs font-medium">Available</span>
                  <span className="text-lg font-bold">{trip.availableSeats}</span>
                </div>
              </div>

              {/* Last updated timestamp */}
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-500 text-right">
                  Updated {new Date(trip.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No trips message */}
      {trips.length === 0 && isConnected && !error && (
        <div className="text-center py-12 text-gray-400">
          <Bus className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No active trips at the moment</p>
        </div>
      )}
    </div>
  );
}
