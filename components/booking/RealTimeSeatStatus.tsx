'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  RefreshCw
} from 'lucide-react';

interface SeatUpdate {
  routeId: string;
  availableSeats: number;
  totalSeats: number;
  timestamp: Date;
  trend: 'increasing' | 'decreasing' | 'stable';
  bookingSpeed: 'slow' | 'moderate' | 'fast';
}

interface RealTimeSeatStatusProps {
  routeId: string;
  initialAvailable: number;
  totalSeats: number;
  onSeatUpdate?: (update: SeatUpdate) => void;
}

export default function RealTimeSeatStatus({
  routeId,
  initialAvailable,
  totalSeats,
  onSeatUpdate
}: RealTimeSeatStatusProps) {
  const [availableSeats, setAvailableSeats] = useState(initialAvailable);
  const [trend, setTrend] = useState<'increasing' | 'decreasing' | 'stable'>('stable');
  const [bookingSpeed, setBookingSpeed] = useState<'slow' | 'moderate' | 'fast'>('slow');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isUpdating, setIsUpdating] = useState(false);
  const [recentChanges, setRecentChanges] = useState<number[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsUpdating(true);

      // Simulate seat bookings with realistic patterns
      const timeOfDay = new Date().getHours();
      const isPeakHour = (timeOfDay >= 7 && timeOfDay <= 9) || (timeOfDay >= 17 && timeOfDay <= 19);

      // Higher booking probability during peak hours
      const bookingProbability = isPeakHour ? 0.7 : 0.3;

      if (Math.random() < bookingProbability && availableSeats > 0) {
        const seatsBooked = Math.min(
          Math.floor(Math.random() * 2) + 1, // Book 1-2 seats at a time
          availableSeats
        );

        setAvailableSeats(prev => {
          const newValue = Math.max(0, prev - seatsBooked);

          // Track recent changes for trend analysis
          setRecentChanges(changes => [...changes.slice(-4), prev - newValue]);

          // Update trend based on recent changes
          const totalChange = recentChanges.reduce((sum, change) => sum + change, 0);
          if (totalChange > 3) {
            setTrend('decreasing');
            setBookingSpeed('fast');
          } else if (totalChange > 0) {
            setTrend('decreasing');
            setBookingSpeed('moderate');
          } else {
            setTrend('stable');
            setBookingSpeed('slow');
          }

          // Trigger callback if provided
          if (onSeatUpdate) {
            onSeatUpdate({
              routeId,
              availableSeats: newValue,
              totalSeats,
              timestamp: new Date(),
              trend: trend,
              bookingSpeed: bookingSpeed
            });
          }

          return newValue;
        });
      }

      setLastUpdate(new Date());
      setTimeout(() => setIsUpdating(false), 500);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [routeId, availableSeats, totalSeats, onSeatUpdate, recentChanges, trend, bookingSpeed]);

  const occupancyPercentage = ((totalSeats - availableSeats) / totalSeats) * 100;
  const isAlmostFull = availableSeats <= 3 && availableSeats > 0;
  const isFull = availableSeats === 0;

  const getStatusColor = () => {
    if (isFull) return 'text-red-500';
    if (isAlmostFull) return 'text-orange-500';
    if (availableSeats < totalSeats / 2) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusBg = () => {
    if (isFull) return 'bg-red-500/10';
    if (isAlmostFull) return 'bg-orange-500/10';
    if (availableSeats < totalSeats / 2) return 'bg-yellow-500/10';
    return 'bg-green-500/10';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {/* Header with live indicator */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Users className="w-5 h-5 text-white" />
            <AnimatePresence>
              {isUpdating && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                />
              )}
            </AnimatePresence>
          </div>
          <h3 className="text-white font-semibold">Live Seat Availability</h3>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-green-500" />
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      {/* Seat count display */}
      <div className="text-center mb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={availableSeats}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-block"
          >
            <span className={`text-4xl font-bold ${getStatusColor()}`}>
              {availableSeats}
            </span>
            <span className="text-gray-400 text-lg ml-2">/ {totalSeats}</span>
          </motion.div>
        </AnimatePresence>
        <p className="text-sm text-gray-400 mt-1">seats available</p>
      </div>

      {/* Visual seat map */}
      <div className="grid grid-cols-6 gap-1 mb-4">
        {[...Array(totalSeats)].map((_, index) => {
          const isOccupied = index >= availableSeats;
          return (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`h-6 rounded ${
                isOccupied
                  ? 'bg-red-500/30 border border-red-500/50'
                  : 'bg-green-500/30 border border-green-500/50'
              }`}
            />
          );
        })}
      </div>

      {/* Occupancy bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Occupancy</span>
          <span>{occupancyPercentage.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              isFull ? 'bg-red-500' :
              isAlmostFull ? 'bg-orange-500' :
              occupancyPercentage > 50 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${occupancyPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Status messages */}
      <AnimatePresence mode="wait">
        {isFull ? (
          <motion.div
            key="full"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-400">This bus is fully booked</span>
          </motion.div>
        ) : isAlmostFull ? (
          <motion.div
            key="almost"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg"
          >
            <AlertCircle className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-400">Only {availableSeats} seats left! Book now</span>
          </motion.div>
        ) : bookingSpeed === 'fast' ? (
          <motion.div
            key="fast"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
          >
            <TrendingDown className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-400">Seats filling up quickly</span>
          </motion.div>
        ) : (
          <motion.div
            key="available"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-400">Seats available</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last update time */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Updated {lastUpdate.toLocaleTimeString()}</span>
        </div>
        <button
          onClick={() => setIsUpdating(true)}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Booking speed indicator */}
      {!isFull && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-400">Booking speed:</span>
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full ${
              bookingSpeed === 'slow' ? 'bg-green-500' : 'bg-gray-600'
            }`} />
            <div className={`w-2 h-2 rounded-full ${
              bookingSpeed === 'moderate' ? 'bg-yellow-500' : 'bg-gray-600'
            }`} />
            <div className={`w-2 h-2 rounded-full ${
              bookingSpeed === 'fast' ? 'bg-red-500' : 'bg-gray-600'
            }`} />
          </div>
          <span className={`text-xs ${
            bookingSpeed === 'fast' ? 'text-red-400' :
            bookingSpeed === 'moderate' ? 'text-yellow-400' :
            'text-green-400'
          }`}>
            {bookingSpeed}
          </span>
        </div>
      )}
    </div>
  );
}