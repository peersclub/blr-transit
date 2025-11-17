'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ParkingSquare,
  MapPin,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  Car,
  User,
  Clock,
  Building2
} from 'lucide-react';
import { api, useApi } from '@/lib/api';
import AddParkingSpaceForm from '@/components/AddParkingSpaceForm';

interface ParkingSpace {
  id: string;
  pickupPointId: string;
  spaceNumber: string;
  floor: string | null;
  section: string | null;
  type: string;
  status: string;
  pickupPoint: {
    id: string;
    name: string;
    address: string;
  };
  currentBooking: {
    id: string;
    status: string;
    checkInTime: string | null;
    checkOutTime: string | null;
    parkingFee: number;
    userVehicle: {
      registrationNo: string;
      make: string;
      model: string;
    };
    booking: {
      user: {
        firstName: string;
        lastName: string;
        phone: string;
      };
    };
  } | null;
}

export default function ParkingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPickupPoint, setFilterPickupPoint] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddParkingSpaceOpen, setIsAddParkingSpaceOpen] = useState(false);

  const { data: parkingSpaces, loading, error, refetch } = useApi<ParkingSpace[]>(
    () => api.get('/api/admin/parking', {
      params: {
        search: searchQuery || undefined,
        status: filterStatus === 'all' ? undefined : filterStatus,
        pickupPointId: filterPickupPoint === 'all' ? undefined : filterPickupPoint
      }
    }),
    [searchQuery, filterStatus, filterPickupPoint, refreshKey]
  );

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'AVAILABLE': 'bg-green-500/20 text-green-400',
      'OCCUPIED': 'bg-red-500/20 text-red-400',
      'RESERVED': 'bg-yellow-500/20 text-yellow-400',
      'MAINTENANCE': 'bg-gray-500/20 text-gray-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Compact': 'bg-blue-500/20 text-blue-400',
      'Standard': 'bg-purple-500/20 text-purple-400',
      'Large': 'bg-orange-500/20 text-orange-400',
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400';
  };

  // Get unique pickup points for filter
  const pickupPoints = parkingSpaces
    ? Array.from(new Set(parkingSpaces.map(s => JSON.stringify({
        id: s.pickupPoint.id,
        name: s.pickupPoint.name
      })))).map(s => JSON.parse(s))
    : [];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Parking Management
            </h1>
            <p className="text-gray-400 mt-2">Monitor and manage parking spaces</p>
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
              onClick={() => setIsAddParkingSpaceOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Parking Space
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
                placeholder="Search by space number, floor, section, or location..."
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
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="RESERVED">Reserved</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>

          <select
            value={filterPickupPoint}
            onChange={(e) => setFilterPickupPoint(e.target.value)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Locations</option>
            {pickupPoints.map((point) => (
              <option key={point.id} value={point.id}>{point.name}</option>
            ))}
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
              <h3 className="text-red-400 font-semibold">Failed to load parking spaces</h3>
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

      {/* Parking Spaces Grid */}
      {!loading && !error && parkingSpaces && (
        <>
          {parkingSpaces.length === 0 ? (
            <div className="text-center py-20">
              <ParkingSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No parking spaces found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {parkingSpaces.map((space) => (
                  <motion.div
                    key={space.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          space.status === 'AVAILABLE' ? 'bg-green-500/20' :
                          space.status === 'OCCUPIED' ? 'bg-red-500/20' :
                          space.status === 'RESERVED' ? 'bg-yellow-500/20' :
                          'bg-gray-500/20'
                        }`}>
                          <ParkingSquare className={`w-6 h-6 ${
                            space.status === 'AVAILABLE' ? 'text-green-400' :
                            space.status === 'OCCUPIED' ? 'text-red-400' :
                            space.status === 'RESERVED' ? 'text-yellow-400' :
                            'text-gray-400'
                          }`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Space {space.spaceNumber}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(space.status)}`}>
                            {space.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-white font-medium">{space.pickupPoint.name}</span>
                      </div>
                      {space.floor && (
                        <div className="text-sm text-gray-400">
                          Floor: {space.floor} {space.section && `• Section: ${space.section}`}
                        </div>
                      )}
                    </div>

                    {/* Type */}
                    <div className="mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getTypeColor(space.type)}`}>
                        {space.type}
                      </span>
                    </div>

                    {/* Current Booking Info */}
                    {space.currentBooking ? (
                      <div className="bg-blue-500/10 rounded-lg p-3 mb-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Car className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-semibold">
                            {space.currentBooking.userVehicle.registrationNo}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <User className="w-4 h-4" />
                          <span>
                            {space.currentBooking.booking.user.firstName} {space.currentBooking.booking.user.lastName}
                          </span>
                        </div>
                        {space.currentBooking.checkInTime && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>
                              {new Date(space.currentBooking.checkInTime).toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className="text-sm font-semibold text-green-400">
                          ₹{space.currentBooking.parkingFee.toFixed(2)}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white/5 rounded-lg p-3 mb-4 text-center text-gray-400 text-sm">
                        No active booking
                      </div>
                    )}

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
                    <div className="text-gray-400 text-sm mb-2">Total Spaces</div>
                    <div className="text-3xl font-bold">{parkingSpaces.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Available</div>
                    <div className="text-3xl font-bold text-green-400">
                      {parkingSpaces.filter(s => s.status === 'AVAILABLE').length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Occupied</div>
                    <div className="text-3xl font-bold text-red-400">
                      {parkingSpaces.filter(s => s.status === 'OCCUPIED').length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Reserved</div>
                    <div className="text-3xl font-bold text-yellow-400">
                      {parkingSpaces.filter(s => s.status === 'RESERVED').length}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Add Parking Space Modal */}
      <AddParkingSpaceForm
        isOpen={isAddParkingSpaceOpen}
        onClose={() => setIsAddParkingSpaceOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
