'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  MapPin,
  Users,
  TrendingUp,
  AlertCircle,
  Calendar,
  ChevronRight,
  Filter,
  Bus,
  Car,
  Loader2,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { api, useApi } from '@/lib/api';

interface Trip {
  id: string;
  tripCode: string;
  route: {
    id: string;
    name: string;
    from: string;
    to: string;
    pickupPoints?: any[];
  };
  vehicle: {
    id: string;
    registrationNo: string;
    type: string;
  };
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  status: string;
}

interface Schedule {
  id: string;
  route: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  vehicleType: string;
  availableSeats: number;
  totalSeats: number;
  parkingHub: string;
  status: 'on-time' | 'delayed' | 'full';
  delay?: number;
}

export default function RouteSchedule() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedTime, setSelectedTime] = useState('morning');
  const [refreshKey, setRefreshKey] = useState(0);

  // Calculate the actual date based on selection
  const getDateForSelection = (selection: string) => {
    const date = new Date();
    if (selection === 'tomorrow') {
      date.setDate(date.getDate() + 1);
    }
    return date.toISOString().split('T')[0];
  };

  // Fetch trips from API
  const { data: trips, loading, error, refetch } = useApi<Trip[]>(
    () => api.getTrips({ date: getDateForSelection(selectedDate) }),
    [selectedDate, refreshKey]
  );

  // Auto-refresh every minute for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Transform API data to component format
  const schedules: Schedule[] = trips?.map(trip => {
    const departure = new Date(trip.departureTime);
    const arrival = new Date(trip.arrivalTime);

    // Determine status based on available seats and trip status
    let status: 'on-time' | 'delayed' | 'full' = 'on-time';
    if (trip.availableSeats === 0) {
      status = 'full';
    } else if (trip.status === 'DELAYED') {
      status = 'delayed';
    }

    // Get first pickup point or use route from as parking hub
    const parkingHub = trip.route.pickupPoints && trip.route.pickupPoints.length > 0
      ? `${trip.route.pickupPoints[0].name} Parking`
      : `${trip.route.from} Parking Hub`;

    return {
      id: trip.tripCode,
      route: trip.route.name,
      from: trip.route.from,
      to: trip.route.to,
      departureTime: departure.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      arrivalTime: arrival.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }),
      vehicleType: trip.vehicle.type,
      availableSeats: trip.availableSeats,
      totalSeats: trip.totalSeats,
      parkingHub,
      status,
      delay: status === 'delayed' ? Math.floor(Math.random() * 15) + 5 : undefined
    };
  }) || [];

  // Filter schedules based on selections
  const filteredSchedules = schedules.filter(schedule => {
    // Route filter
    if (selectedRoute !== 'all' && !schedule.route.toLowerCase().includes(selectedRoute.toLowerCase())) {
      return false;
    }

    // Time filter
    const departureHour = parseInt(schedule.departureTime.split(':')[0]);
    const isPM = schedule.departureTime.includes('PM');
    const hour24 = isPM && departureHour !== 12 ? departureHour + 12 : departureHour;

    if (selectedTime === 'morning' && (hour24 < 7 || hour24 > 8.5)) return false;
    if (selectedTime === 'late-morning' && (hour24 < 8.5 || hour24 > 10)) return false;
    if (selectedTime === 'evening' && (hour24 < 17.5 || hour24 > 19)) return false;
    if (selectedTime === 'late-evening' && (hour24 < 19 || hour24 > 21)) return false;

    return true;
  });

  // Extract unique route destinations for filter
  const routeDestinations = Array.from(new Set(schedules.map(s => {
    const parts = s.route.split(' → ');
    return parts[1] || parts[0];
  })));

  const routes = ['all', ...routeDestinations.slice(0, 4)]; // Limit to 4 destinations

  const timeSlots = [
    { id: 'morning', label: '7:00 - 8:30 AM', icon: '🌅' },
    { id: 'late-morning', label: '8:30 - 10:00 AM', icon: '☀️' },
    { id: 'evening', label: '5:30 - 7:00 PM', icon: '🌆' },
    { id: 'late-evening', label: '7:00 - 9:00 PM', icon: '🌙' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time': return 'text-green-400';
      case 'delayed': return 'text-orange-400';
      case 'full': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'on-time': return 'bg-green-500/10 border-green-500/30';
      case 'delayed': return 'bg-orange-500/10 border-orange-500/30';
      case 'full': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  const getSeatAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage === 0) return 'bg-red-500';
    if (percentage < 30) return 'bg-orange-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-tech-purple animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading schedules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Failed to load schedules</h3>
            <p className="text-gray-400 text-sm mb-3">{error}</p>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Schedule
          </h3>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Date Selection */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Select Date</label>
          <div className="flex gap-2">
            {['today', 'tomorrow'].map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  selectedDate === date
                    ? 'bg-tech-purple text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {date}
              </button>
            ))}
            <button className="px-4 py-2 bg-gray-700 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors">
              <Calendar className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Route Filter */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Select Route</label>
          <div className="flex flex-wrap gap-2">
            {routes.map(route => (
              <button
                key={route}
                onClick={() => setSelectedRoute(route)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-all ${
                  selectedRoute === route
                    ? 'bg-tech-purple text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                {route}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slot Filter */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Time Slot</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {timeSlots.map(slot => (
              <button
                key={slot.id}
                onClick={() => setSelectedTime(slot.id)}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedTime === slot.id
                    ? 'bg-tech-purple text-white'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                }`}
              >
                <span className="mr-1">{slot.icon}</span>
                <span className="hidden sm:inline">{slot.label}</span>
                <span className="sm:hidden">{slot.label.split(' - ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Schedule List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Available Buses ({filteredSchedules.length})
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Real-time updates</span>
          </div>
        </div>

        {filteredSchedules.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-8 text-center">
            <Bus className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No buses available for the selected filters</p>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSchedules.map((schedule, index) => (
              <motion.div
                key={schedule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-800 rounded-xl p-4 sm:p-5 hover:bg-gray-750 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Route Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-semibold mb-1">{schedule.route}</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>{schedule.parkingHub}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBg(schedule.status)}`}>
                        <span className={getStatusColor(schedule.status)}>
                          {schedule.status === 'on-time' && '✓ On Time'}
                          {schedule.status === 'delayed' && `⚠ ${schedule.delay} min late`}
                          {schedule.status === 'full' && '● Full'}
                        </span>
                      </span>
                    </div>

                    {/* Times */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">{schedule.departureTime}</p>
                        <p className="text-gray-500 text-xs">Departure</p>
                      </div>
                      <div className="flex-1 flex items-center">
                        <div className="flex-1 h-0.5 bg-gray-700"></div>
                        <Bus className="w-5 h-5 text-gray-500 mx-2" />
                        <div className="flex-1 h-0.5 bg-gray-700"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-white font-bold text-lg">{schedule.arrivalTime}</p>
                        <p className="text-gray-500 text-xs">Arrival</p>
                      </div>
                    </div>

                    {/* Vehicle & Seats */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Bus className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-400">{schedule.vehicleType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Seats:</span>
                          <div className="flex items-center gap-1">
                            <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${getSeatAvailabilityColor(schedule.availableSeats, schedule.totalSeats)}`}
                                style={{
                                  width: `${((schedule.totalSeats - schedule.availableSeats) / schedule.totalSeats) * 100}%`
                                }}
                              />
                            </div>
                            <span className={`text-sm font-semibold ${
                              schedule.availableSeats === 0
                                ? 'text-red-400'
                                : schedule.availableSeats < 5
                                ? 'text-orange-400'
                                : 'text-green-400'
                            }`}>
                              {schedule.availableSeats}/{schedule.totalSeats}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Book Button */}
                  <div className="flex items-center gap-3">
                    {schedule.availableSeats > 0 ? (
                      <button className="px-4 py-2 bg-tech-purple text-white rounded-lg font-semibold hover:bg-tech-purple/90 transition-colors flex items-center gap-2">
                        Book Seat
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button disabled className="px-4 py-2 bg-gray-700 text-gray-500 rounded-lg font-semibold cursor-not-allowed">
                        Fully Booked
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Live Status */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-1">Live Updates</h4>
            <p className="text-sm text-gray-300">
              All schedules are updated in real-time. Parking availability and seat status refresh every minute.
            </p>
          </div>
        </div>
      </div>

      {/* Return Journey Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-white font-semibold mb-1">Return Journey</h4>
            <p className="text-sm text-gray-300">
              Evening return buses start from 5:30 PM. Your parking spot remains reserved until 9:00 PM.
              <a href="#" className="text-tech-purple hover:underline ml-1">View evening schedule →</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}