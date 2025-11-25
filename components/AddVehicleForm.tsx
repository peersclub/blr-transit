'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import Modal from './Modal';

interface AddVehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddVehicleForm({ isOpen, onClose, onSuccess }: AddVehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    registrationNo: '',
    type: '',
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    color: '',
    capacity: '',
    insuranceExpiry: '',
    fitnessExpiry: '',
    permitExpiry: '',
    fuelType: '',
    mileage: '',
    rcDoc: '', // Will be set after document upload
    insuranceDoc: '', // Will be set after document upload
    fitnessDoc: '',
    permitDoc: '',
  });

  const vehicleTypes = [
    { value: 'FORCE_URBANIA', label: 'Force Urbania' },
    { value: 'FORCE_TRAVELLER', label: 'Force Traveller' },
    { value: 'URBANIA_EXECUTIVE', label: 'Urbania Executive' },
    { value: 'MINI_BUS', label: 'Mini Bus' },
  ];

  const fuelTypes = ['Diesel', 'Petrol', 'CNG', 'Electric', 'Hybrid'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.registrationNo) {
      setError('Registration number is required');
      return false;
    }
    if (!formData.type) {
      setError('Vehicle type is required');
      return false;
    }
    if (!formData.make || !formData.model) {
      setError('Make and model are required');
      return false;
    }
    const year = parseInt(formData.year);
    if (!year || year < 1990 || year > new Date().getFullYear() + 1) {
      setError('Valid year is required (1990 - ' + (new Date().getFullYear() + 1) + ')');
      return false;
    }
    if (!formData.color) {
      setError('Color is required');
      return false;
    }
    const capacity = parseInt(formData.capacity);
    if (!capacity || capacity < 1 || capacity > 50) {
      setError('Capacity must be between 1 and 50');
      return false;
    }
    if (!formData.insuranceExpiry) {
      setError('Insurance expiry date is required');
      return false;
    }
    if (!formData.fuelType) {
      setError('Fuel type is required');
      return false;
    }
    if (formData.mileage && (parseFloat(formData.mileage) < 0 || parseFloat(formData.mileage) > 50)) {
      setError('Mileage must be between 0 and 50 km/l');
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
      const response = await api.post('/api/admin/vehicles', formData);

      if (response.success) {
        onSuccess();
        setFormData({
          registrationNo: '',
          type: '',
          make: '',
          model: '',
          year: new Date().getFullYear().toString(),
          color: '',
          capacity: '',
          insuranceExpiry: '',
          fitnessExpiry: '',
          permitExpiry: '',
          fuelType: '',
          mileage: '',
          rcDoc: '', // Will be set after document upload
          insuranceDoc: '', // Will be set after document upload
          fitnessDoc: '',
          permitDoc: '',
        });
        onClose();
      } else {
        setError(response.message || 'Failed to add vehicle');
      }
    } catch (err) {
      setError('An error occurred while adding the vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Vehicle">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Registration and Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Registration No *
            </label>
            <input
              type="text"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              placeholder="KA01AB1234"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors uppercase"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Vehicle Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select Type</option>
              {vehicleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Make and Model */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Make *
            </label>
            <input
              type="text"
              name="make"
              value={formData.make}
              onChange={handleChange}
              placeholder="Force Motors"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Model *
            </label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              placeholder="Urbania"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        {/* Year, Color, Capacity */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Year *
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1990"
              max={new Date().getFullYear() + 1}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Color *
            </label>
            <input
              type="text"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="White"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="17"
              min="1"
              max="50"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
        </div>

        {/* Fuel Type and Mileage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Fuel Type *
            </label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            >
              <option value="">Select Fuel Type</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Mileage (km/l)
            </label>
            <input
              type="number"
              name="mileage"
              value={formData.mileage}
              onChange={handleChange}
              placeholder="12.5"
              step="0.1"
              min="0"
              max="50"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Insurance Expiry */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Insurance Expiry *
          </label>
          <input
            type="date"
            name="insuranceExpiry"
            value={formData.insuranceExpiry}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>

        {/* Fitness and Permit Expiry (Optional) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Fitness Expiry (Optional)
            </label>
            <input
              type="date"
              name="fitnessExpiry"
              value={formData.fitnessExpiry}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Permit Expiry (Optional)
            </label>
            <input
              type="date"
              name="permitExpiry"
              value={formData.permitExpiry}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
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
                Adding...
              </>
            ) : (
              'Add Vehicle'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
