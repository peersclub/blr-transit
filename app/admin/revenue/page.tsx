'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  ChevronUp,
  ChevronDown,
  Bus,
  Users,
  MapPin,
  Car,
  Home,
  PieChart,
  BarChart,
  Activity,
  RefreshCw,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { api, useApi } from '@/lib/api';

interface RevenueData {
  date: string;
  ticketRevenue: number;
  parkingRevenue: number;
  homePickupRevenue: number;
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  trips: number;
  passengers: number;
}

interface RouteRevenue {
  route: string;
  revenue: number;
  trips: number;
  avgOccupancy: number;
  profitMargin: number;
}

interface VehicleRevenue {
  vehicle: string;
  type: string;
  revenue: number;
  trips: number;
  fuelCost: number;
  maintenanceCost: number;
  profitability: number;
}

interface RevenueAnalytics {
  summary: {
    totalRevenue: number;
    ticketRevenue: number;
    parkingRevenue: number;
    homePickupRevenue: number;
    totalCosts: number;
    netProfit: number;
    profitMargin: number;
    totalTrips: number;
    totalBookings: number;
    totalPassengers: number;
  };
  revenueBreakdown: {
    tickets: number;
    parking: number;
    homePickup: number;
  };
  dailyData: RevenueData[];
  routeRevenue: RouteRevenue[];
  vehicleRevenue: VehicleRevenue[];
}

export default function RevenueAnalytics() {
  const [dateRange, setDateRange] = useState('week');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch revenue analytics from API
  const { data: analytics, loading, error, refetch } = useApi<RevenueAnalytics>(
    () => api.getRevenueAnalytics(dateRange as 'day' | 'week' | 'month' | 'year'),
    [dateRange, refreshKey]
  );

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Calculate growth percentages (placeholder values for now)
  const revenueGrowth = 15.3;
  const profitGrowth = 12.8;
  const marginChange = -2.1;
  const passengerGrowth = 18.5;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-tech-purple animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading revenue analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-lg font-semibold mb-2">Failed to load analytics</p>
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

  if (!analytics) {
    return null;
  }

  const { summary, revenueBreakdown, dailyData, routeRevenue, vehicleRevenue } = analytics;

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
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Trips
              </Link>
              <Link
                href="/admin/revenue"
                className="text-white px-3 py-2 rounded-md text-sm font-medium bg-gray-800"
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
            <h2 className="text-2xl font-bold text-white">Revenue Analytics</h2>
            <p className="text-gray-400 mt-1">
              Track and analyze your business performance
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <div className="flex items-center bg-gray-900 rounded-lg border border-gray-800">
              {['day', 'week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 text-sm capitalize transition-colors ${
                    dateRange === range
                      ? 'bg-tech-purple text-white'
                      : 'text-gray-400 hover:text-white'
                  } ${range === 'day' ? 'rounded-l-lg' : ''} ${
                    range === 'year' ? 'rounded-r-lg' : ''
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ₹{(summary.totalRevenue / 1000).toFixed(1)}K
                </p>
                <div className="flex items-center mt-2 text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+{revenueGrowth}% vs last period</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Net Profit</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ₹{(summary.netProfit / 1000).toFixed(1)}K
                </p>
                <div className="flex items-center mt-2 text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+{profitGrowth}% vs last period</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Profit Margin</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {summary.profitMargin.toFixed(1)}%
                </p>
                <div className="flex items-center mt-2 text-yellow-500">
                  <ChevronDown className="w-4 h-4 mr-1" />
                  <span className="text-sm">{marginChange}% vs last period</span>
                </div>
              </div>
              <PieChart className="w-8 h-8 text-yellow-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-xl p-6 border border-gray-800"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Passengers</p>
                <p className="text-3xl font-bold text-white">{summary.totalPassengers}</p>
                <div className="flex items-center mt-2 text-green-500">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+{passengerGrowth}% vs last period</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue by Source */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-6">Revenue by Source</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-300">Ticket Sales</span>
                  </div>
                  <span className="text-white font-semibold">
                    ₹{(revenueBreakdown.tickets / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{
                      width: `${
                        summary.totalRevenue > 0
                          ? (revenueBreakdown.tickets / summary.totalRevenue) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-green-500" />
                    <span className="text-gray-300">Parking Fees</span>
                  </div>
                  <span className="text-white font-semibold">
                    ₹{(revenueBreakdown.parking / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        summary.totalRevenue > 0
                          ? (revenueBreakdown.parking / summary.totalRevenue) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-300">Home Pickup</span>
                  </div>
                  <span className="text-white font-semibold">
                    ₹{(revenueBreakdown.homePickup / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${
                        summary.totalRevenue > 0
                          ? (revenueBreakdown.homePickup / summary.totalRevenue) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Daily Revenue Trend */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-6">Daily Revenue Trend</h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {dailyData.map((day, index) => {
                const maxRevenue = Math.max(...dailyData.map(d => d.totalRevenue));
                const scale = maxRevenue > 0 ? 180 / maxRevenue : 0;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div className="w-full space-y-1">
                      <div
                        className="w-full bg-purple-500 rounded-t"
                        style={{
                          height: `${day.homePickupRevenue * scale}px`,
                        }}
                      />
                      <div
                        className="w-full bg-green-500"
                        style={{
                          height: `${day.parkingRevenue * scale}px`,
                        }}
                      />
                      <div
                        className="w-full bg-blue-500 rounded-b"
                        style={{
                          height: `${day.ticketRevenue * scale}px`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date(day.date).toLocaleDateString('en', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-xs text-gray-400">Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span className="text-xs text-gray-400">Parking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded" />
                <span className="text-xs text-gray-400">Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route Performance */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h3 className="text-lg font-semibold text-white mb-6">Route Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Route
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Revenue
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Trips
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Avg Occupancy
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Profit Margin
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {routeRevenue.map((route, index) => (
                  <tr key={index} className="hover:bg-gray-800/50">
                    <td className="px-4 py-4 text-sm text-white">{route.route}</td>
                    <td className="px-4 py-4 text-sm text-green-500 font-semibold">
                      ₹{(route.revenue / 1000).toFixed(1)}K
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-300">{route.trips}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-tech-purple h-2 rounded-full"
                            style={{ width: `${route.avgOccupancy}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-300">
                          {route.avgOccupancy.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm font-semibold ${
                        route.profitMargin >= 40 ? 'text-green-500' :
                        route.profitMargin >= 30 ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {route.profitMargin}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Performance */}
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-6">Vehicle Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vehicleRevenue.map((vehicle, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-white font-semibold">{vehicle.vehicle}</p>
                    <p className="text-sm text-gray-400">{vehicle.type}</p>
                  </div>
                  <Bus className="w-6 h-6 text-tech-purple" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Revenue</span>
                    <span className="text-green-500 font-semibold">
                      ₹{(vehicle.revenue / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Trips</span>
                    <span className="text-white">{vehicle.trips}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Fuel Cost</span>
                    <span className="text-red-400">
                      -₹{(vehicle.fuelCost / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Maintenance</span>
                    <span className="text-red-400">
                      -₹{(vehicle.maintenanceCost / 1000).toFixed(1)}K
                    </span>
                  </div>
                  <div className="border-t border-gray-700 mt-2 pt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Net Profit</span>
                      <span className="text-white font-bold">
                        ₹{(vehicle.profitability / 1000).toFixed(1)}K
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}