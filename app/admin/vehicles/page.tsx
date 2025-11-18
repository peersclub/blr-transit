'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bus,
  Calendar,
  Fuel,
  Gauge,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  RefreshCw,
  Loader2,
  User,
  TrendingUp,
  Wrench,
  Shield
} from 'lucide-react';
import { api, useApi } from '@/lib/api';
import AddVehicleForm from '@/components/AddVehicleForm';

interface Vehicle {
  id: string;
  registrationNo: string;
  type: string;
  make: string;
  model: string;
  year: number;
  color: string;
  capacity: number;
  insuranceExpiry: string;
  fitnessExpiry: string | null;
  isActive: boolean;
  isAvailable: boolean;
  totalKm: number;
  fuelType: string;
  mileage: number | null;
  upcomingTrips: number;
  assignedDriver: {
    id: string;
    licenseNumber: string;
    rating: number;
  } | null;
}

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);

  const { data: vehicles, loading, error, refetch } = useApi<Vehicle[]>(
    () => api.get('/api/admin/vehicles', {
      params: {
        search: searchQuery || undefined,
        available: filterStatus === 'all' ? undefined : filterStatus === 'available',
        type: filterType === 'all' ? undefined : filterType
      }
    }),
    [searchQuery, filterStatus, filterType, refreshKey]
  );

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'FORCE_URBANIA': 'bg-blue-500/20 text-blue-400',
      'FORCE_TRAVELLER': 'bg-purple-500/20 text-purple-400',
      'URBANIA_EXECUTIVE': 'bg-pink-500/20 text-pink-400',
      'MINI_BUS': 'bg-orange-500/20 text-orange-400',
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  const isExpiringSoon = (date: string | null) => {
    if (!date) return false;
    const daysUntilExpiry = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (date: string | null) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Vehicle Management
            </h1>
            <p className="text-gray-400 mt-2">Monitor and manage fleet vehicles</p>
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
              onClick={() => setIsAddVehicleOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Vehicle
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
                placeholder="Search by registration, make, or model..."
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
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="FORCE_URBANIA">Force Urbania</option>
            <option value="FORCE_TRAVELLER">Force Traveller</option>
            <option value="URBANIA_EXECUTIVE">Urbania Executive</option>
            <option value="MINI_BUS">Mini Bus</option>
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
              <h3 className="text-red-400 font-semibold">Failed to load vehicles</h3>
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

      {/* Vehicles Grid */}
      {!loading && !error && vehicles && (
        <>
          {vehicles.length === 0 ? (
            <div className="text-center py-20">
              <Bus className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No vehicles found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {vehicles.map((vehicle) => (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <Bus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{vehicle.registrationNo}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(vehicle.isAvailable)}`}>
                              {vehicle.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle Info */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getTypeColor(vehicle.type)}`}>
                        {vehicle.type.replace(/_/g, ' ')}
                      </span>
                      <div className="mt-3 text-gray-400 text-sm">
                        {vehicle.make} {vehicle.model} • {vehicle.year} • {vehicle.color}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <Gauge className="w-4 h-4" />
                          <span>Capacity</span>
                        </div>
                        <div className="text-2xl font-bold">{vehicle.capacity}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>Total KM</span>
                        </div>
                        <div className="text-2xl font-bold">{vehicle.totalKm.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Fuel & Mileage */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                          <Fuel className="w-4 h-4" />
                          <span>Fuel Type</span>
                        </div>
                        <div className="text-white font-semibold">{vehicle.fuelType}</div>
                      </div>
                      {vehicle.mileage && (
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="text-sm text-gray-400 mb-1">Mileage</div>
                          <div className="text-white font-semibold">{vehicle.mileage} km/l</div>
                        </div>
                      )}
                    </div>

                    {/* Documents Status */}
                    <div className="space-y-2 mb-4">
                      <div className={`flex items-center justify-between p-2 rounded ${
                        isExpired(vehicle.insuranceExpiry) ? 'bg-red-500/20' :
                        isExpiringSoon(vehicle.insuranceExpiry) ? 'bg-yellow-500/20' :
                        'bg-green-500/20'
                      }`}>
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4" />
                          <span>Insurance</span>
                        </div>
                        <span className="text-xs">
                          {new Date(vehicle.insuranceExpiry).toLocaleDateString()}
                        </span>
                      </div>
                      {vehicle.fitnessExpiry && (
                        <div className={`flex items-center justify-between p-2 rounded ${
                          isExpired(vehicle.fitnessExpiry) ? 'bg-red-500/20' :
                          isExpiringSoon(vehicle.fitnessExpiry) ? 'bg-yellow-500/20' :
                          'bg-green-500/20'
                        }`}>
                          <div className="flex items-center gap-2 text-sm">
                            <Wrench className="w-4 h-4" />
                            <span>Fitness</span>
                          </div>
                          <span className="text-xs">
                            {new Date(vehicle.fitnessExpiry).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Assigned Driver */}
                    {vehicle.assignedDriver && (
                      <div className="bg-blue-500/10 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-400">Driver</span>
                          </div>
                          <span className="text-blue-400 font-semibold">
                            {vehicle.assignedDriver.licenseNumber}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Upcoming Trips */}
                    <div className="bg-purple-500/10 rounded-lg p-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Upcoming Trips</span>
                        <span className="text-purple-400 font-semibold">{vehicle.upcomingTrips}</span>
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Total Vehicles</div>
                    <div className="text-3xl font-bold">{vehicles.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Available</div>
                    <div className="text-3xl font-bold text-green-400">
                      {vehicles.filter((v: any) => v.isAvailable).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Total Capacity</div>
                    <div className="text-3xl font-bold text-blue-400">
                      {vehicles.reduce((sum: number, v: any) => sum + v.capacity, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Avg Mileage</div>
                    <div className="text-3xl font-bold text-yellow-400">
                      {vehicles.filter((v: any) => v.mileage).length > 0
                        ? (vehicles.reduce((sum: number, v: any) => sum + (v.mileage || 0), 0) /
                           vehicles.filter((v: any) => v.mileage).length).toFixed(1)
                        : '0.0'
                      } km/l
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Add Vehicle Modal */}
      <AddVehicleForm
        isOpen={isAddVehicleOpen}
        onClose={() => setIsAddVehicleOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
