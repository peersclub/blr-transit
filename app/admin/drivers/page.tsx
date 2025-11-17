'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  MapPin,
  CreditCard,
  Calendar,
  Star,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  RefreshCw,
  Loader2,
  Bus,
  TrendingUp,
  Award
} from 'lucide-react';
import { api, useApi } from '@/lib/api';
import AddDriverForm from '@/components/AddDriverForm';

interface Driver {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseExpiry: string;
  licenseDoc: string;
  aadharNumber: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  bloodGroup: string | null;
  totalTrips: number;
  rating: number;
  isAvailable: boolean;
  upcomingTrips: number;
  assignedVehicle: {
    id: string;
    registrationNo: string;
    type: string;
    make: string;
    model: string;
  } | null;
}

export default function DriversPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddDriverOpen, setIsAddDriverOpen] = useState(false);

  const { data: drivers, loading, error, refetch } = useApi<Driver[]>(
    () => api.get('/api/admin/drivers', {
      params: {
        search: searchQuery || undefined,
        available: filterStatus === 'all' ? undefined : filterStatus === 'available'
      }
    }),
    [searchQuery, filterStatus, refreshKey]
  );

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400';
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-400';
    if (rating >= 4.0) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Driver Management
            </h1>
            <p className="text-gray-400 mt-2">Manage and monitor all drivers</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 border border-white/10"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={() => setIsAddDriverOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Driver
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by license, city, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Drivers</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-red-400 font-semibold">Failed to load drivers</h3>
              <p className="text-red-300/70 text-sm mt-1">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Drivers Grid */}
      {!loading && !error && drivers && (
        <>
          {drivers.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No drivers found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {drivers.map((driver) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{driver.licenseNumber}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(driver.isAvailable)}`}>
                              {driver.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Total Trips</span>
                        </div>
                        <div className="text-2xl font-bold">{driver.totalTrips}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <Star className="w-4 h-4" />
                          <span>Rating</span>
                        </div>
                        <div className={`text-2xl font-bold ${getRatingColor(driver.rating)}`}>
                          {driver.rating.toFixed(1)}
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{driver.city}, {driver.state}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <CreditCard className="w-4 h-4" />
                        <span>Aadhar: {driver.aadharNumber}</span>
                      </div>
                      {driver.bloodGroup && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <Award className="w-4 h-4" />
                          <span>Blood Group: {driver.bloodGroup}</span>
                        </div>
                      )}
                      {driver.assignedVehicle && (
                        <div className="flex items-center gap-2 text-blue-400">
                          <Bus className="w-4 h-4" />
                          <span className="truncate">
                            {driver.assignedVehicle.registrationNo} • {driver.assignedVehicle.type}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* License Expiry */}
                    <div className="bg-white/5 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">License Expiry</span>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-white">
                            {new Date(driver.licenseExpiry).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Upcoming Trips */}
                    <div className="bg-blue-500/10 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Upcoming Trips</span>
                        <span className="text-blue-400 font-semibold">{driver.upcomingTrips}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-sm text-blue-400">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Total Drivers</div>
                    <div className="text-3xl font-bold">{drivers.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Available Drivers</div>
                    <div className="text-3xl font-bold text-green-400">
                      {drivers.filter(d => d.isAvailable).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Average Rating</div>
                    <div className="text-3xl font-bold text-yellow-400">
                      {drivers.length > 0
                        ? (drivers.reduce((sum, d) => sum + d.rating, 0) / drivers.length).toFixed(1)
                        : '0.0'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Add Driver Modal */}
      <AddDriverForm
        isOpen={isAddDriverOpen}
        onClose={() => setIsAddDriverOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
