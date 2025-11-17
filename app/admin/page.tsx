'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Bus,
  MapPin,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  Car,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { api, useApi } from '@/lib/api';

interface DashboardMetrics {
  totalUsers: number;
  newUsersThisWeek: number;
  userGrowth: number;
  activeBookings: number;
  totalTripsToday: number;
  totalRevenue: number;
  todayRevenue: number;
  revenueGrowth: number;
  totalDrivers: number;
  availableVehicles: number;
  occupancyRate: number;
  recentBookings: Array<{
    id: string;
    bookingCode: string;
    userName: string;
    route: string;
    time: string;
    status: string;
  }>;
  dailyRevenue: Array<{
    date: string;
    amount: number;
  }>;
}

export default function AdminDashboard() {
  const { data: metrics, loading, error, refetch } = useApi<DashboardMetrics>(
    () => api.getDashboardMetrics(),
    []
  );

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  const metricCards = metrics ? [
    {
      title: 'Total Users',
      value: metrics.totalUsers.toLocaleString(),
      icon: Users,
      change: `+${metrics.userGrowth.toFixed(1)}%`,
      changeType: metrics.userGrowth > 0 ? 'positive' : 'neutral',
      bgColor: 'bg-blue-500/10',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Active Bookings',
      value: metrics.activeBookings.toString(),
      icon: Package,
      change: 'Live',
      changeType: 'positive',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-500',
    },
    {
      title: 'Total Trips Today',
      value: metrics.totalTripsToday.toString(),
      icon: Bus,
      change: 'Today',
      changeType: 'neutral',
      bgColor: 'bg-purple-500/10',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Revenue (₹)',
      value: `₹${(metrics.todayRevenue / 1000).toFixed(1)}K`,
      icon: DollarSign,
      change: `+${metrics.revenueGrowth.toFixed(1)}%`,
      changeType: metrics.revenueGrowth > 0 ? 'positive' : metrics.revenueGrowth < 0 ? 'negative' : 'neutral',
      bgColor: 'bg-yellow-500/10',
      iconColor: 'text-yellow-500',
    },
    {
      title: 'Active Drivers',
      value: metrics.totalDrivers.toString(),
      icon: Users,
      change: 'Available',
      changeType: 'neutral',
      bgColor: 'bg-indigo-500/10',
      iconColor: 'text-indigo-500',
    },
    {
      title: 'Available Vehicles',
      value: metrics.availableVehicles.toString(),
      icon: Car,
      change: 'Ready',
      changeType: 'positive',
      bgColor: 'bg-green-500/10',
      iconColor: 'text-green-500',
    },
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500 bg-green-500/10';
      case 'in_transit':
      case 'in-transit':
        return 'text-blue-500 bg-blue-500/10';
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'cancelled':
        return 'text-red-500 bg-red-500/10';
      default:
        return 'text-gray-500 bg-gray-500/10';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-12 h-12 text-tech-purple" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-tech-purple text-white rounded-lg hover:bg-tech-purple/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">BLR Transit Admin</h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/admin"
                className="text-white px-3 py-2 rounded-md text-sm font-medium bg-gray-800"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/trips"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
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
              <Link
                href="/admin/users"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Users
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
            <p className="text-gray-400 mt-1">
              Monitor and manage your transit operations
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <AnimatePresence>
            {metricCards.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-800"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{metric.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {metric.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <span
                        className={`text-sm ${
                          metric.changeType === 'positive'
                            ? 'text-green-500'
                            : metric.changeType === 'negative'
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        {metric.change}
                      </span>
                      <span className="text-gray-500 text-xs ml-2">
                        {metric.changeType === 'positive' || metric.changeType === 'negative'
                          ? 'vs last week'
                          : ''}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                    <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Occupancy Chart */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Fleet Occupancy Rate
            </h3>
            <div className="flex items-center justify-center h-48">
              <div className="relative">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-gray-700"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                    animate={{
                      strokeDashoffset: `${
                        2 * Math.PI * 70 * (1 - metrics.occupancyRate / 100)
                      }`,
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="text-tech-purple"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.p
                      className="text-3xl font-bold text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {metrics.occupancyRate.toFixed(0)}%
                    </motion.p>
                    <p className="text-sm text-gray-400">Occupancy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Revenue Trend (7 Days)
            </h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {metrics.dailyRevenue.map((day, index) => {
                const maxRevenue = Math.max(...metrics.dailyRevenue.map(d => d.amount));
                const height = maxRevenue > 0 ? (day.amount / maxRevenue) * 150 : 0;

                return (
                  <motion.div
                    key={day.date}
                    className="flex-1 flex flex-col items-center"
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="w-full bg-tech-purple rounded-t"
                      initial={{ height: 0 }}
                      animate={{ height: `${height}px` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date(day.date).toLocaleDateString('en', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Recent Bookings</h3>
              <Link
                href="/admin/bookings"
                className="text-sm text-tech-purple hover:text-tech-purple/80"
              >
                View all →
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                <AnimatePresence>
                  {metrics.recentBookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-white">
                        {booking.bookingCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {booking.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {booking.route}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {booking.time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-tech-purple hover:text-tech-purple/80">
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Link
            href="/admin/trips/create"
            className="bg-tech-purple text-white rounded-lg p-4 text-center hover:bg-tech-purple/90 transition-colors"
          >
            <Bus className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-semibold">Schedule Trip</span>
          </Link>
          <Link
            href="/admin/drivers/add"
            className="bg-gray-800 text-white rounded-lg p-4 text-center hover:bg-gray-700 transition-colors"
          >
            <Users className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-semibold">Add Driver</span>
          </Link>
          <Link
            href="/admin/vehicles/add"
            className="bg-gray-800 text-white rounded-lg p-4 text-center hover:bg-gray-700 transition-colors"
          >
            <Car className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-semibold">Add Vehicle</span>
          </Link>
          <Link
            href="/admin/reports"
            className="bg-gray-800 text-white rounded-lg p-4 text-center hover:bg-gray-700 transition-colors"
          >
            <TrendingUp className="w-6 h-6 mx-auto mb-2" />
            <span className="text-sm font-semibold">Generate Report</span>
          </Link>
        </div>
      </main>
    </div>
  );
}