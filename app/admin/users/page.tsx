'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Shield
} from 'lucide-react';
import { api, useApi } from '@/lib/api';
import AddUserForm from '@/components/AddUserForm';

interface UserType {
  id: string;
  email: string;
  phone: string;
  phoneVerified: boolean;
  firstName: string;
  lastName: string;
  employeeId: string | null;
  role: string;
  isActive: boolean;
  company: {
    id: string;
    name: string;
  } | null;
  totalBookings: number;
  createdAt: string;
}

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  const { data: users, loading, error, refetch } = useApi<UserType[]>(
    () => api.get('/api/admin/users', {
      params: {
        search: searchQuery || undefined,
        role: filterRole === 'all' ? undefined : filterRole,
        status: filterStatus === 'all' ? undefined : filterStatus
      }
    }),
    [searchQuery, filterRole, filterStatus, refreshKey]
  );

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'USER': 'bg-blue-500/20 text-blue-400',
      'DRIVER': 'bg-purple-500/20 text-purple-400',
      'ADMIN': 'bg-orange-500/20 text-orange-400',
      'SUPER_ADMIN': 'bg-red-500/20 text-red-400',
    };
    return colors[role] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-gray-400 mt-2">Manage platform users and permissions</p>
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
              onClick={() => setIsAddUserOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-4 h-4" />
              Add User
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
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>
          </div>

          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="USER">User</option>
            <option value="DRIVER">Driver</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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
              <h3 className="text-red-400 font-semibold">Failed to load users</h3>
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

      {/* Users Grid */}
      {!loading && !error && users && (
        <>
          {users.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No users found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Company</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Bookings</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold">{user.firstName} {user.lastName}</div>
                              {user.employeeId && (
                                <div className="text-xs text-gray-400">ID: {user.employeeId}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="truncate max-w-[200px]">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <span>{user.phone}</span>
                              {user.phoneVerified && (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.company ? (
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400">{user.company.name}</span>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4 text-gray-400" />
                            <span className="font-semibold">{user.totalBookings}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.isActive ? (
                            <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs bg-gray-500/20 text-gray-400">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-blue-400">
                              <Edit className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="mt-8 bg-white/5 rounded-lg p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Total Users</div>
                    <div className="text-3xl font-bold">{users.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Active Users</div>
                    <div className="text-3xl font-bold text-green-400">
                      {users.filter(u => u.isActive).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Corporate Users</div>
                    <div className="text-3xl font-bold text-blue-400">
                      {users.filter(u => u.company).length}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-2">Total Bookings</div>
                    <div className="text-3xl font-bold text-purple-400">
                      {users.reduce((sum, u) => sum + u.totalBookings, 0)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Add User Modal */}
      <AddUserForm
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onSuccess={handleRefresh}
      />
    </div>
  );
}
