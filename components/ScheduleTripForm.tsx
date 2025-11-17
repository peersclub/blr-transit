'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import Modal from './Modal';

interface ScheduleTripFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  distance: number;
}

interface Vehicle {
  id: string;
  registrationNo: string;
  type: string;
  capacity: number;
  status: string;
}

interface Driver {
  id: string;
  licenseNumber: string;
  user: {
    firstName: string;
    lastName: string;
  };
  status: string;
}

export default function ScheduleTripForm({ isOpen, onClose, onSuccess }: ScheduleTripFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);

  const [formData, setFormData] = useState({
    routeId: '',
    vehicleId: '',
    driverId: '',
    departureTime: '',
    estimatedArrival: '',
    totalSeats: '',
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch routes, vehicles, and drivers
      Promise.all([
        api.get('/api/routes'),
        api.get('/api/admin/vehicles', { params: { status: 'AVAILABLE' } }),
        api.get('/api/admin/drivers', { params: { status: 'AVAILABLE' } })
      ]).then(([routesRes, vehiclesRes, driversRes]) => {
        if (routesRes.success) setRoutes(routesRes.data);
        if (vehiclesRes.success) setVehicles(vehiclesRes.data);
        if (driversRes.success) setDrivers(driversRes.data);
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');

    // Auto-fill total seats when vehicle is selected
    if (name === 'vehicleId' && value) {
      const selectedVehicle = vehicles.find(v => v.id === value);
      if (selectedVehicle) {
        setFormData(prev => ({ ...prev, totalSeats: selectedVehicle.capacity.toString() }));
      }
    }

    // Auto-calculate estimated arrival when route and departure are set
    if (name === 'routeId' && value && formData.departureTime) {
      const selectedRoute = routes.find(r => r.id === value);
      if (selectedRoute) {
        const departure = new Date(formData.departureTime);
        // Assume average speed of 40 km/h in Bangalore traffic
        const travelTimeHours = selectedRoute.distance / 40;
        const arrival = new Date(departure.getTime() + travelTimeHours * 60 * 60 * 1000);
        setFormData(prev => ({
          ...prev,
          estimatedArrival: arrival.toISOString().slice(0, 16)
        }));
      }
    }

    if (name === 'departureTime' && value && formData.routeId) {
      const selectedRoute = routes.find(r => r.id === formData.routeId);
      if (selectedRoute) {
        const departure = new Date(value);
        const travelTimeHours = selectedRoute.distance / 40;
        const arrival = new Date(departure.getTime() + travelTimeHours * 60 * 60 * 1000);
        setFormData(prev => ({
          ...prev,
          estimatedArrival: arrival.toISOString().slice(0, 16)
        }));
      }
    }
  };

  const validateForm = () => {
    if (!formData.routeId) {
      setError('Route is required');
      return false;
    }
    if (!formData.vehicleId) {
      setError('Vehicle is required');
      return false;
    }
    if (!formData.driverId) {
      setError('Driver is required');
      return false;
    }
    if (!formData.departureTime) {
      setError('Departure time is required');
      return false;
    }
    if (!formData.estimatedArrival) {
      setError('Estimated arrival time is required');
      return false;
    }

    const departure = new Date(formData.departureTime);
    const arrival = new Date(formData.estimatedArrival);
    const now = new Date();

    if (departure < now) {
      setError('Departure time must be in the future');
      return false;
    }

    if (arrival <= departure) {
      setError('Arrival time must be after departure time');
      return false;
    }

    const totalSeats = parseInt(formData.totalSeats);
    if (!totalSeats || totalSeats < 1 || totalSeats > 50) {
      setError('Total seats must be between 1 and 50');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/trips', {
        routeId: formData.routeId,
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        departureTime: formData.departureTime,
        estimatedArrival: formData.estimatedArrival,
        totalSeats: parseInt(formData.totalSeats),
      });

      if (response.success) {
        onSuccess();
        setFormData({
          routeId: '',
          vehicleId: '',
          driverId: '',
          departureTime: '',
          estimatedArrival: '',
          totalSeats: '',
        });
        onClose();
      } else {
        setError(response.message || 'Failed to schedule trip');
      }
    } catch (err) {
      setError('An error occurred while scheduling the trip');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum datetime (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Schedule New Trip">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Route *
          </label>
          <select
            name="routeId"
            value={formData.routeId}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            required
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.name} ({route.from} → {route.to}) - {route.distance}km
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Vehicle *
            </label>
            <select
              name="vehicleId"
              value={formData.vehicleId}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select Vehicle</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registrationNo} - {vehicle.type} ({vehicle.capacity} seats)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Driver *
            </label>
            <select
              name="driverId"
              value={formData.driverId}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select Driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.user.firstName} {driver.user.lastName} - {driver.licenseNumber}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Departure Time *
            </label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              min={getMinDateTime()}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Estimated Arrival *
            </label>
            <input
              type="datetime-local"
              name="estimatedArrival"
              value={formData.estimatedArrival}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Total Seats *
          </label>
          <input
            type="number"
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleChange}
            placeholder="Auto-filled from vehicle"
            min="1"
            max="50"
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Seats are auto-filled when you select a vehicle
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              'Schedule Trip'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
