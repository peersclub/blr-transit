'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Bus,
  Calendar,
  Clock,
  Users,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { api, useApi } from '@/lib/api';
import ScheduleTripForm from '@/components/ScheduleTripForm';

interface Trip {
  id: string;
  tripCode: string;
  route: {
    id: string;
    name: string;
    from: string;
    to: string;
  };
  vehicle: {
    id: string;
    registrationNo: string;
    type: string;
  };
  driver: {
    id: string;
    licenseNumber: string;
    rating: number;
  };
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  status: string;
  _count?: {
    bookings: number;
  };
}

export default function TripsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [isScheduleTripOpen, setIsScheduleTripOpen] = useState(false);

  // Fetch trips from API
  const { data: trips, loading, error, refetch } = useApi<Trip[]>(
    () => api.getTrips({
      date: selectedDate,
      status: filterStatus !== 'all' ? filterStatus.toUpperCase() : undefined
    }),
    [selectedDate, filterStatus, refreshKey]
  );

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      SCHEDULED: { color: 'text-blue-500 bg-blue-500/10', icon: Clock, label: 'Scheduled' },
      BOARDING: { color: 'text-yellow-500 bg-yellow-500/10', icon: Users, label: 'Boarding' },
      DEPARTED: { color: 'text-purple-500 bg-purple-500/10', icon: Bus, label: 'Departed' },
      ARRIVED: { color: 'text-green-500 bg-green-500/10', icon: CheckCircle, label: 'Arrived' },
      CANCELLED: { color: 'text-red-500 bg-red-500/10', icon: XCircle, label: 'Cancelled' },
    };

    const config = statusConfig[status] || statusConfig.SCHEDULED;
    const Icon = config.icon;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color} flex items-center gap-1 w-fit`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getOccupancyColor = (available: number, total: number) => {
    const booked = total - available;
    const percentage = (booked / total) * 100;
    if (percentage === 100) return 'text-red-500';
    if (percentage >= 80) return 'text-orange-500';
    if (percentage >= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const calculateRevenue = (trip: Trip) => {
    // Base price per seat (can be fetched from route in future)
    const pricePerSeat = 300;
    const bookedSeats = trip.totalSeats - trip.availableSeats;
    return bookedSeats * pricePerSeat;
  };

  const filteredTrips = trips?.filter((trip: Trip) => {
    const matchesSearch =
      trip.tripCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehicle.registrationNo.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  }) || [];

  const handleUpdateStatus = async (tripId: string, newStatus: string) => {
    try {
      await api.updateTripStatus({ tripId, status: newStatus });
      refetch();
    } catch (error) {
      console.error('Error updating trip status:', error);
    }
  };

  // Calculate summary stats
  const todayRevenue = filteredTrips.reduce((sum: number, trip: any) => sum + calculateRevenue(trip), 0);
  const totalPassengers = filteredTrips.reduce(
    (sum: number, trip: any) => sum + (trip.totalSeats - trip.availableSeats),
    0
  );
  const avgOccupancy = filteredTrips.length > 0
    ? (totalPassengers / filteredTrips.reduce((sum: number, trip: any) => sum + trip.totalSeats, 0)) * 100
    : 0;
  const onTimeRate = 94; // This could be calculated from actual data

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-tech-purple animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg font-semibold mb-2">Failed to load trips</p>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-tech-purple text-white rounded-lg hover:bg-tech-purple/90 transition-colors mx-auto"
          >
            <RefreshCw className="w-5 h-5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-white">
                BLR Transit Admin
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/admin"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/trips"
                className="text-white px-3 py-2 rounded-md text-sm font-medium bg-gray-800"
              >
                Trips
              </Link>
              <Link
                href="/admin/drivers"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Drivers
              </Link>
              <Link
                href="/admin/vehicles"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Vehicles
              </Link>
              <Link
                href="/admin/parking"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Parking
              </Link>
              <Link
                href="/admin/revenue"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Revenue
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Trip Management</h2>
            <p className="text-gray-400 mt-1">Manage and monitor all trips</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button
              onClick={() => setIsScheduleTripOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-tech-purple text-white rounded-lg hover:bg-tech-purple/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Schedule New Trip
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-tech-purple"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-tech-purple"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-tech-purple appearance-none"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="boarding">Boarding</option>
                <option value="departed">Departed</option>
                <option value="arrived">Arrived</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-around bg-gray-800 rounded-lg px-4 py-2">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{filteredTrips.length}</p>
                <p className="text-xs text-gray-400">Total Trips</p>
              </div>
              <div className="h-8 w-px bg-gray-700" />
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">
                  {filteredTrips.filter((t: any) => t.status === 'ARRIVED').length}
                </p>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trips Table */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Trip Code
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Occupancy
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredTrips.map((trip) => (
                  <motion.tr
                    key={trip.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-mono font-semibold">
                        {trip.tripCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {trip.route.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trip.vehicle.registrationNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {trip.driver.licenseNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <p className="text-white">{formatTime(trip.departureTime)}</p>
                        <p className="text-gray-500 text-xs">{formatTime(trip.arrivalTime)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-tech-purple h-2 rounded-full"
                            style={{
                              width: `${((trip.totalSeats - trip.availableSeats) / trip.totalSeats) * 100}%`
                            }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${getOccupancyColor(trip.availableSeats, trip.totalSeats)}`}>
                          {trip.totalSeats - trip.availableSeats}/{trip.totalSeats}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(trip.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-green-500 font-semibold">
                        ₹{calculateRevenue(trip).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-1 hover:bg-gray-700 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Revenue</p>
                <p className="text-2xl font-bold text-white">₹{todayRevenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Passengers</p>
                <p className="text-2xl font-bold text-white">{totalPassengers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Occupancy</p>
                <p className="text-2xl font-bold text-white">{avgOccupancy.toFixed(0)}%</p>
              </div>
              <Bus className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">On-Time Rate</p>
                <p className="text-2xl font-bold text-white">{onTimeRate}%</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Trip Modal */}
      <ScheduleTripForm
        isOpen={isScheduleTripOpen}
        onClose={() => setIsScheduleTripOpen(false)}
        onSuccess={() => setRefreshKey(prev => prev + 1)}
      />
    </div>
  );
}