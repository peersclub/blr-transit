'use client';

/**
 * Driver Tracking Panel
 * ======================
 * UI for drivers to share location and update trip status
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDriverTracking } from '@/hooks/useSocket';
import {
  Navigation,
  Play,
  Pause,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Radio,
} from 'lucide-react';

interface DriverTrackingPanelProps {
  driverId: string;
  tripId: string;
  tripDetails?: {
    routeName: string;
    startPoint: string;
    endPoint: string;
    scheduledTime: string;
    totalSeats: number;
    bookedSeats: number;
  };
  stops?: Array<{
    name: string;
    estimatedTime: string;
    completed?: boolean;
  }>;
}

const tripStatuses = [
  { value: 'SCHEDULED', label: 'Scheduled', icon: Clock, color: 'gray' },
  { value: 'BOARDING', label: 'Boarding', icon: Users, color: 'yellow' },
  { value: 'IN_TRANSIT', label: 'In Transit', icon: Navigation, color: 'green' },
  { value: 'ARRIVING', label: 'Arriving', icon: MapPin, color: 'blue' },
  { value: 'COMPLETED', label: 'Completed', icon: CheckCircle, color: 'green' },
  { value: 'CANCELLED', label: 'Cancelled', icon: AlertCircle, color: 'red' },
];

export default function DriverTrackingPanel({
  driverId,
  tripId,
  tripDetails,
  stops = [],
}: DriverTrackingPanelProps) {
  const {
    isTracking,
    lastUpdate,
    startTracking,
    stopTracking,
    updateTripStatus,
  } = useDriverTracking(driverId, tripId);

  const [currentStatus, setCurrentStatus] = useState('SCHEDULED');
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [occupancy, setOccupancy] = useState(0);

  const handleStatusChange = (status: string) => {
    setCurrentStatus(status);
    updateTripStatus(status, {
      currentStop: stops[currentStopIndex]?.name,
      nextStop: stops[currentStopIndex + 1]?.name,
      occupancy,
    });
  };

  const handleStopComplete = () => {
    if (currentStopIndex < stops.length - 1) {
      setCurrentStopIndex(currentStopIndex + 1);
      updateTripStatus(currentStatus, {
        currentStop: stops[currentStopIndex + 1]?.name,
        nextStop: stops[currentStopIndex + 2]?.name,
        occupancy,
      });
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Driver Panel</h3>
          <p className="text-gray-400 text-sm">Trip: {tripId}</p>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            isTracking ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
          }`}
        >
          <Radio className={`w-4 h-4 ${isTracking ? 'animate-pulse' : ''}`} />
          {isTracking ? 'Broadcasting' : 'Offline'}
        </div>
      </div>

      {/* Trip Details */}
      {tripDetails && (
        <div className="bg-gray-800 rounded-xl p-4 space-y-3">
          <h4 className="font-semibold text-white">{tripDetails.routeName}</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">From</p>
              <p className="text-white">{tripDetails.startPoint}</p>
            </div>
            <div>
              <p className="text-gray-500">To</p>
              <p className="text-white">{tripDetails.endPoint}</p>
            </div>
            <div>
              <p className="text-gray-500">Scheduled</p>
              <p className="text-white">{tripDetails.scheduledTime}</p>
            </div>
            <div>
              <p className="text-gray-500">Passengers</p>
              <p className="text-white">
                {tripDetails.bookedSeats} / {tripDetails.totalSeats}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Toggle */}
      <div className="flex gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isTracking ? stopTracking : startTracking}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-colors ${
            isTracking
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isTracking ? (
            <>
              <Pause className="w-5 h-5" />
              Stop Tracking
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Tracking
            </>
          )}
        </motion.button>
      </div>

      {lastUpdate && (
        <p className="text-center text-gray-500 text-sm">
          Last update: {lastUpdate.toLocaleTimeString()}
        </p>
      )}

      {/* Status Selector */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-400">Trip Status</h4>
        <div className="grid grid-cols-3 gap-2">
          {tripStatuses.map((status) => {
            const Icon = status.icon;
            const isActive = currentStatus === status.value;
            return (
              <motion.button
                key={status.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStatusChange(status.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-colors ${
                  isActive
                    ? `bg-${status.color}-500/20 border-2 border-${status.color}-500 text-${status.color}-400`
                    : 'bg-gray-800 border-2 border-transparent text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{status.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Occupancy Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-400">Occupancy</h4>
          <span className="text-white font-semibold">{occupancy}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={occupancy}
          onChange={(e) => setOccupancy(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-tech-purple"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Empty</span>
          <span>Half</span>
          <span>Full</span>
        </div>
      </div>

      {/* Stops Progress */}
      {stops.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-400">Route Progress</h4>
          <div className="space-y-2">
            {stops.map((stop, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  index < currentStopIndex
                    ? 'bg-green-500/10 border border-green-500/30'
                    : index === currentStopIndex
                    ? 'bg-tech-purple/10 border border-tech-purple/30'
                    : 'bg-gray-800'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index < currentStopIndex
                      ? 'bg-green-500 text-white'
                      : index === currentStopIndex
                      ? 'bg-tech-purple text-white'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {index < currentStopIndex ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      index <= currentStopIndex ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {stop.name}
                  </p>
                  <p className="text-xs text-gray-500">{stop.estimatedTime}</p>
                </div>
                {index === currentStopIndex && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStopComplete}
                    className="px-3 py-1.5 bg-tech-purple text-white text-sm rounded-lg"
                  >
                    Complete
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
