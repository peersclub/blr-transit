'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Car,
  Home,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  Search,
  IndianRupee,
  Shield,
  Bike,
  Bus,
  TrainFront
} from 'lucide-react';

interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  landmark: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'parking-hub' | 'bus-stop' | 'metro-station' | 'home-pickup-zone';
  parkingAvailable: boolean;
  parkingCapacity?: number;
  parkingRate?: number;
  homePickupRadius?: number;
  routes?: string[];
}

interface BookingData {
  userType: 'with-vehicle' | 'without-vehicle' | '';
  pickupType: 'parking-hub' | 'bus-stop' | 'home-pickup' | '';
  pickupPoint: PickupPoint | null;
  route: string;
  date: string;
  time: string;
  seats: number;
  vehicleNumber?: string;
  homePickupMode?: 'car' | 'bike';
  userDetails: {
    name: string;
    phone: string;
    email: string;
    company: string;
  };
}

// Hardcoded data
const HARDCODED_PICKUP_POINTS: PickupPoint[] = [
  {
    id: '1',
    name: 'Electronic City Parking Hub',
    address: 'Electronic City Phase 1',
    landmark: 'Near Infosys Gate',
    coordinates: { lat: 12.8456, lng: 77.6603 },
    type: 'parking-hub',
    parkingAvailable: true,
    parkingCapacity: 150,
    parkingRate: 20,
    routes: ['EC to Whitefield', 'EC to MG Road']
  },
  {
    id: '2',
    name: 'Silk Board Bus Stop',
    address: 'Silk Board Junction',
    landmark: 'Near Silk Board Signal',
    coordinates: { lat: 12.9177, lng: 77.6238 },
    type: 'bus-stop',
    parkingAvailable: false,
    routes: ['Silk Board to Marathahalli', 'Silk Board to Koramangala']
  },
  {
    id: '3',
    name: 'Whitefield Metro Station',
    address: 'Whitefield Main Road',
    landmark: 'Phoenix Marketcity',
    coordinates: { lat: 12.9698, lng: 77.7499 },
    type: 'metro-station',
    parkingAvailable: false,
    routes: ['Whitefield to MG Road', 'Whitefield to Indiranagar']
  },
  {
    id: '4',
    name: 'HSR Layout Home Pickup Zone',
    address: 'HSR Layout Sector 1',
    landmark: '27th Main Road',
    coordinates: { lat: 12.9121, lng: 77.6446 },
    type: 'home-pickup-zone',
    parkingAvailable: false,
    homePickupRadius: 2,
    routes: ['HSR to ORR', 'HSR to BTM']
  },
  {
    id: '5',
    name: 'Koramangala Parking Hub',
    address: '80 Feet Road, Koramangala',
    landmark: 'Forum Mall',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    type: 'parking-hub',
    parkingAvailable: true,
    parkingCapacity: 200,
    parkingRate: 20,
    routes: ['Koramangala to Indiranagar', 'Koramangala to MG Road']
  }
];

const HARDCODED_ROUTES = [
  { id: '1', name: 'Electronic City to Whitefield', destinations: ['Whitefield', 'ITPL'] },
  { id: '2', name: 'Koramangala to MG Road', destinations: ['MG Road', 'Indiranagar'] },
  { id: '3', name: 'HSR Layout to ORR', destinations: ['Outer Ring Road', 'Marathahalli'] },
  { id: '4', name: 'Silk Board to Marathahalli', destinations: ['Marathahalli', 'Brookefield'] }
];

export default function EnhancedBooking() {
  const [step, setStep] = useState(0); // 0: User Type, 1: Pickup Selection, 2: Route & Time, 3: Details
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyPoints, setNearbyPoints] = useState<(PickupPoint & { distance: number })[]>([]);
  const [homePickupZone, setHomePickupZone] = useState<PickupPoint | null>(null);
  const [filteredPoints, setFilteredPoints] = useState<(PickupPoint & { distance?: number })[]>([]);

  const [bookingData, setBookingData] = useState<BookingData>({
    userType: '',
    pickupType: '',
    pickupPoint: null,
    route: '',
    date: '',
    time: '',
    seats: 1,
    userDetails: {
      name: '',
      phone: '',
      email: '',
      company: ''
    }
  });

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get nearest pickup points
  const getNearestPickupPoints = (lat: number, lng: number, maxDistance: number = 10) => {
    return HARDCODED_PICKUP_POINTS
      .map(point => ({
        ...point,
        distance: calculateDistance(lat, lng, point.coordinates.lat, point.coordinates.lng)
      }))
      .filter(point => point.distance <= maxDistance)
      .sort((a, b) => a.distance - b.distance);
  };

  // Check if location is in home pickup zone
  const isInHomePickupZone = (lat: number, lng: number): PickupPoint | null => {
    const homePickupZones = HARDCODED_PICKUP_POINTS.filter(p => p.type === 'home-pickup-zone');

    for (const zone of homePickupZones) {
      const distance = calculateDistance(lat, lng, zone.coordinates.lat, zone.coordinates.lng);
      const radius = zone.homePickupRadius || 2; // Default 2km radius

      if (distance <= radius) {
        return zone;
      }
    }

    return null;
  };

  // Detect user location
  const detectLocation = () => {
    setLocationLoading(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Get nearest pickup points
          const nearby = getNearestPickupPoints(latitude, longitude, 10);
          setNearbyPoints(nearby);

          // Check if in home pickup zone
          const zone = isInHomePickupZone(latitude, longitude);
          setHomePickupZone(zone);

          setLocationLoading(false);
        },
        (error) => {
          console.error('Location error:', error);
          setLocationLoading(false);
        }
      );
    }
  };

  // Filter pickup points based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = HARDCODED_PICKUP_POINTS
        .filter(point =>
          point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          point.landmark.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(point => {
          if (userLocation) {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              point.coordinates.lat,
              point.coordinates.lng
            );
            return { ...point, distance };
          }
          return point;
        });

      setFilteredPoints(filtered);
    } else if (nearbyPoints.length > 0) {
      setFilteredPoints(nearbyPoints);
    } else {
      setFilteredPoints(HARDCODED_PICKUP_POINTS.slice(0, 10));
    }
  }, [searchQuery, nearbyPoints, userLocation]);

  // Filter points based on user type
  const getAvailablePickupPoints = () => {
    let points = filteredPoints;

    if (bookingData.userType === 'with-vehicle') {
      // Show only parking hubs
      points = points.filter(p => p.parkingAvailable);
    } else if (bookingData.userType === 'without-vehicle') {
      // Show bus stops, metro stations, and home pickup zones
      points = points.filter(p => !p.parkingAvailable || p.type === 'home-pickup-zone');
    }

    return points;
  };

  const getPickupTypeLabel = (type: string) => {
    switch (type) {
      case 'parking-hub': return { icon: <Car className="w-4 h-4" />, label: 'Parking Hub' };
      case 'bus-stop': return { icon: <Bus className="w-4 h-4" />, label: 'Bus Stop' };
      case 'metro-station': return { icon: <TrainFront className="w-4 h-4" />, label: 'Metro Station' };
      case 'home-pickup-zone': return { icon: <Home className="w-4 h-4" />, label: 'Home Pickup' };
      default: return { icon: <MapPin className="w-4 h-4" />, label: 'Pickup Point' };
    }
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return '';
    if (distance < 1) return `${Math.round(distance * 1000)}m away`;
    return `${distance.toFixed(1)} km away`;
  };

  return (
    <div className="bg-gray-900 rounded-xl p-4 sm:p-6 lg:p-8">
      {/* Progress Indicator */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {['Transport Mode', 'Pickup Point', 'Schedule', 'Details'].map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step > index
                    ? 'bg-green-500 text-white'
                    : step === index
                    ? 'bg-tech-purple text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {step > index ? <CheckCircle className="w-5 h-5" /> : index + 1}
              </div>
              {index < 3 && (
                <div className={`w-8 sm:w-16 lg:w-24 h-0.5 ${
                  step > index ? 'bg-green-500' : 'bg-gray-700'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 0: User Type Selection */}
      {step === 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">How will you reach the pickup point?</h3>
            <p className="text-gray-400">Choose your preferred mode of transport</p>
          </div>

          {/* Location Detection */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-tech-purple" />
                <span className="text-white font-medium">Your Location</span>
              </div>
              <button
                onClick={detectLocation}
                disabled={locationLoading}
                className="px-4 py-2 bg-tech-purple text-white rounded-lg text-sm font-medium hover:bg-tech-purple/90 transition-colors disabled:opacity-50"
              >
                {locationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Detect Location'
                )}
              </button>
            </div>

            {userLocation && (
              <div className="text-sm text-gray-400">
                Location detected • {nearbyPoints.length} pickup points nearby
                {homePickupZone && (
                  <span className="block mt-1 text-green-400">
                    ✓ Home pickup available in your area ({homePickupZone.name})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Transport Mode Options */}
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setBookingData({ ...bookingData, userType: 'with-vehicle' });
                setStep(1);
              }}
              className="cursor-pointer"
            >
              <div className="bg-gray-800 border-2 border-gray-700 hover:border-tech-purple rounded-xl p-6 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Car className="w-8 h-8 text-tech-purple" />
                  <span className="text-xs bg-tech-purple/20 text-tech-purple px-2 py-1 rounded-full">
                    Save on Fuel
                  </span>
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">I have my own vehicle</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Drive to a nearby parking hub and take the bus to your office
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Secure parking included</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Reserved parking spot</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>₹20/hour parking rate</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setBookingData({ ...bookingData, userType: 'without-vehicle' });
                setStep(1);
              }}
              className="cursor-pointer"
            >
              <div className="bg-gray-800 border-2 border-gray-700 hover:border-tech-purple rounded-xl p-6 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <Home className="w-8 h-8 text-tech-purple" />
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Door-to-Door
                  </span>
                </div>
                <h4 className="text-white font-semibold text-lg mb-2">I'll be picked up</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Get picked up from home or walk to a nearby bus stop
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Home pickup available</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Multiple pickup points</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>₹50 for home pickup</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Step 1: Pickup Point Selection */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {bookingData.userType === 'with-vehicle'
                ? 'Choose your parking hub'
                : 'Choose your pickup point'}
            </h3>
            <p className="text-gray-400">
              {bookingData.userType === 'with-vehicle'
                ? 'Select a convenient parking location near your home'
                : 'Select where you\'d like to board the bus'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location, area, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-tech-purple"
            />
          </div>

          {/* Pickup Points List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getAvailablePickupPoints().map((point) => {
              const typeInfo = getPickupTypeLabel(point.type);
              return (
                <motion.div
                  key={point.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => {
                    setBookingData({
                      ...bookingData,
                      pickupPoint: point,
                      pickupType: point.type === 'home-pickup-zone' ? 'home-pickup' :
                                   point.parkingAvailable ? 'parking-hub' : 'bus-stop'
                    });
                    setStep(2);
                  }}
                  className="bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-tech-purple rounded-lg p-4 cursor-pointer transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        point.parkingAvailable ? 'bg-blue-500/20 text-blue-400' :
                        point.type === 'home-pickup-zone' ? 'bg-green-500/20 text-green-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {typeInfo.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{point.name}</h4>
                        <p className="text-sm text-gray-400 mt-1">{point.address}</p>
                        {point.landmark && (
                          <p className="text-xs text-gray-500 mt-1">Near {point.landmark}</p>
                        )}
                        {point.parkingAvailable && (
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span>• {point.parkingCapacity} spots</span>
                            <span>• ₹{point.parkingRate}/hour</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {typeInfo.label}
                      </span>
                      {point.distance !== undefined && (
                        <p className="text-sm text-tech-purple mt-2 font-medium">
                          {formatDistance(point.distance)}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <button
            onClick={() => setStep(0)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back
          </button>
        </motion.div>
      )}

      {/* Step 2: Route & Schedule Selection */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Select your route & schedule</h3>
            <p className="text-gray-400">Choose your destination and preferred timing</p>
          </div>

          {/* Selected Pickup Point */}
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-tech-purple" />
              <div>
                <p className="text-white font-medium">{bookingData.pickupPoint?.name}</p>
                <p className="text-sm text-gray-400">{bookingData.pickupPoint?.address}</p>
              </div>
            </div>
          </div>

          {/* Route Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Select Destination</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {HARDCODED_ROUTES.map((route) => (
                <div
                  key={route.id}
                  onClick={() => setBookingData({ ...bookingData, route: route.name })}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    bookingData.route === route.name
                      ? 'bg-tech-purple/20 border-tech-purple'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <h4 className="text-white font-semibold">{route.name}</h4>
                  <p className="text-sm text-gray-400 mt-1">To: {route.destinations.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Travel Date</label>
              <input
                type="date"
                value={bookingData.date}
                onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-tech-purple"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Preferred Time</label>
              <select
                value={bookingData.time}
                onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-tech-purple"
              >
                <option value="">Select time</option>
                <option value="7:00 AM">7:00 AM</option>
                <option value="7:30 AM">7:30 AM</option>
                <option value="8:00 AM">8:00 AM</option>
                <option value="8:30 AM">8:30 AM</option>
                <option value="9:00 AM">9:00 AM</option>
              </select>
            </div>
          </div>

          {/* Number of Seats */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Number of Seats</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setBookingData({ ...bookingData, seats: Math.max(1, bookingData.seats - 1) })}
                className="w-10 h-10 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                -
              </button>
              <span className="text-xl font-bold text-white w-8 text-center">{bookingData.seats}</span>
              <button
                onClick={() => setBookingData({ ...bookingData, seats: Math.min(4, bookingData.seats + 1) })}
                className="w-10 h-10 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                +
              </button>
              <span className="text-sm text-gray-400">Max 4 seats per booking</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!bookingData.route || !bookingData.date || !bookingData.time}
              className="flex-1 px-4 py-2 bg-tech-purple text-white rounded-lg hover:bg-tech-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}

      {/* Step 3: User Details */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Complete your booking</h3>
            <p className="text-gray-400">Enter your details to confirm your seat</p>
          </div>

          {/* Booking Summary */}
          <div className="bg-gray-800 rounded-lg p-4 space-y-3">
            <h4 className="text-white font-semibold mb-3">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Route</span>
                <span className="text-white">{bookingData.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pickup Point</span>
                <span className="text-white">{bookingData.pickupPoint?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date & Time</span>
                <span className="text-white">{bookingData.date} at {bookingData.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Seats</span>
                <span className="text-white">{bookingData.seats}</span>
              </div>
              <div className="border-t border-gray-700 pt-2 flex justify-between">
                <span className="text-gray-400">Total Amount</span>
                <span className="text-white font-bold">₹{bookingData.seats * 300}</span>
              </div>
            </div>
          </div>

          {/* User Details Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                value={bookingData.userDetails.name}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  userDetails: { ...bookingData.userDetails, name: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-tech-purple"
                placeholder="Enter your name"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={bookingData.userDetails.phone}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    userDetails: { ...bookingData.userDetails, phone: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-tech-purple"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                <input
                  type="email"
                  value={bookingData.userDetails.email}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    userDetails: { ...bookingData.userDetails, email: e.target.value }
                  })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-tech-purple"
                  placeholder="email@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Company / Corporate ID</label>
              <input
                type="text"
                value={bookingData.userDetails.company}
                onChange={(e) => setBookingData({
                  ...bookingData,
                  userDetails: { ...bookingData.userDetails, company: e.target.value }
                })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-tech-purple"
                placeholder="Enter your company name or ID"
              />
            </div>

            {bookingData.userType === 'with-vehicle' && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Vehicle Number</label>
                <input
                  type="text"
                  value={bookingData.vehicleNumber}
                  onChange={(e) => setBookingData({ ...bookingData, vehicleNumber: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-tech-purple"
                  placeholder="KA-01-AB-1234"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
            <button
              className="flex-1 px-4 py-2 bg-tech-purple text-white rounded-lg hover:bg-tech-purple/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={!bookingData.userDetails.name || !bookingData.userDetails.phone}
            >
              <Shield className="w-5 h-5" />
              Confirm Booking
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
