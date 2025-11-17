'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import Modal from './Modal';

interface AddParkingSpaceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PickupPoint {
  id: string;
  name: string;
  address: string;
}

export default function AddParkingSpaceForm({ isOpen, onClose, onSuccess }: AddParkingSpaceFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);

  const [formData, setFormData] = useState({
    pickupPointId: '',
    spaceNumber: '',
    floor: '',
    section: '',
    type: 'Standard',
  });

  const parkingTypes = ['Compact', 'Standard', 'Large'];

  useEffect(() => {
    if (isOpen) {
      // Fetch pickup points
      api.get('/api/pickup-points').then((response) => {
        if (response.success) {
          setPickupPoints(response.data);
        }
      });
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.pickupPointId) {
      setError('Pickup point is required');
      return false;
    }
    if (!formData.spaceNumber) {
      setError('Space number is required');
      return false;
    }
    if (!formData.type) {
      setError('Parking type is required');
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
      const response = await api.post('/api/admin/parking', formData);

      if (response.success) {
        onSuccess();
        setFormData({
          pickupPointId: '',
          spaceNumber: '',
          floor: '',
          section: '',
          type: 'Standard',
        });
        onClose();
      } else {
        setError(response.message || 'Failed to add parking space');
      }
    } catch (err) {
      setError('An error occurred while adding the parking space');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Parking Space">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Pickup Point *
          </label>
          <select
            name="pickupPointId"
            value={formData.pickupPointId}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            required
          >
            <option value="">Select Pickup Point</option>
            {pickupPoints.map((point) => (
              <option key={point.id} value={point.id}>
                {point.name} - {point.address}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Space Number *
            </label>
            <input
              type="text"
              name="spaceNumber"
              value={formData.spaceNumber}
              onChange={handleChange}
              placeholder="P101"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              required
            >
              {parkingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Floor (Optional)
            </label>
            <input
              type="text"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              placeholder="Ground Floor"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Section (Optional)
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              placeholder="Section A"
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
              'Add Parking Space'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
