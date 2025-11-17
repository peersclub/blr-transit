'use client';

import { motion } from 'framer-motion';
import {
  Users,
  Wifi,
  Zap,
  Wind,
  Music,
  Shield,
  Phone,
  MapPin,
  Star,
  CheckCircle
} from 'lucide-react';

export default function VehicleSelector() {
  const vehicles = [
    {
      id: 'urbania-premium',
      name: 'Force Urbania Premium',
      category: 'Premium',
      capacity: 13,
      image: '/urbania.jpg', // Would need actual images
      rating: 4.8,
      trips: 1250,
      features: [
        { icon: <Wind className="w-4 h-4" />, name: 'Premium AC' },
        { icon: <Wifi className="w-4 h-4" />, name: 'High-Speed WiFi' },
        { icon: <Zap className="w-4 h-4" />, name: 'USB Charging' },
        { icon: <Users className="w-4 h-4" />, name: 'Reclining Seats' },
        { icon: <Music className="w-4 h-4" />, name: 'Entertainment System' },
        { icon: <Shield className="w-4 h-4" />, name: 'GPS Tracked' }
      ],
      specifications: {
        'Seating Capacity': '13 passengers',
        'Luggage Space': 'Ample boot space',
        'AC Type': '2-zone climate control',
        'Safety': 'ABS, Airbags, GPS',
        'Comfort': 'Premium cushioned seats',
        'Driver': 'Professional, 5+ years exp'
      },
      availableRoutes: 8,
      priceRange: '₹80-120 per seat'
    },
    {
      id: 'force-traveller',
      name: 'Force Traveller Deluxe',
      category: 'Standard',
      capacity: 17,
      rating: 4.6,
      trips: 2340,
      features: [
        { icon: <Wind className="w-4 h-4" />, name: 'AC' },
        { icon: <Users className="w-4 h-4" />, name: 'Pushback Seats' },
        { icon: <Music className="w-4 h-4" />, name: 'Music System' },
        { icon: <Phone className="w-4 h-4" />, name: 'Emergency Contact' },
        { icon: <Shield className="w-4 h-4" />, name: 'First Aid' },
        { icon: <MapPin className="w-4 h-4" />, name: 'Live Tracking' }
      ],
      specifications: {
        'Seating Capacity': '17 passengers',
        'Luggage Space': 'Overhead racks',
        'AC Type': 'Central AC',
        'Safety': 'Speed governor, GPS',
        'Comfort': 'Cushioned seats',
        'Driver': 'Trained, verified'
      },
      availableRoutes: 12,
      priceRange: '₹70-100 per seat'
    },
    {
      id: 'urbania-executive',
      name: 'Urbania Executive',
      category: 'Luxury',
      capacity: 10,
      rating: 4.9,
      trips: 650,
      features: [
        { icon: <Wind className="w-4 h-4" />, name: 'Premium AC' },
        { icon: <Wifi className="w-4 h-4" />, name: '5G WiFi' },
        { icon: <Zap className="w-4 h-4" />, name: 'Power Outlets' },
        { icon: <Users className="w-4 h-4" />, name: 'Business Seats' },
        { icon: <Shield className="w-4 h-4" />, name: 'Privacy Glass' },
        { icon: <Music className="w-4 h-4" />, name: 'Noise Cancellation' }
      ],
      specifications: {
        'Seating Capacity': '10 executives',
        'Luggage Space': 'Dedicated compartment',
        'AC Type': '3-zone climate',
        'Safety': 'Advanced safety suite',
        'Comfort': 'Leather reclining seats',
        'Driver': 'Executive chauffeur'
      },
      availableRoutes: 4,
      priceRange: '₹150-200 per seat'
    }
  ];

  const benefits = [
    {
      title: 'Professional Drivers',
      description: 'All drivers are professionally trained with 5+ years of experience',
      icon: <Users className="w-5 h-5" />
    },
    {
      title: 'GPS Tracked',
      description: 'Real-time tracking for safety and family peace of mind',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      title: 'Regular Sanitization',
      description: 'Vehicles sanitized after every trip for your safety',
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support for any assistance',
      icon: <Phone className="w-5 h-5" />
    }
  ];

  return (
    <div className="space-y-8">
      {/* Fleet Overview */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Our Fleet</h2>
        <p className="text-gray-400 mb-6">
          Premium vehicles designed for comfort and safety during your daily commute
        </p>

        <div className="grid gap-6">
          {vehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Vehicle Image Placeholder */}
                  <div className="lg:w-1/3">
                    <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                      <Bus className="w-16 h-16 text-gray-600" />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-white font-semibold">{vehicle.rating}</span>
                        <span className="text-gray-400 text-sm">({vehicle.trips} trips)</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        vehicle.category === 'Luxury'
                          ? 'bg-purple-500/20 text-purple-400'
                          : vehicle.category === 'Premium'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        {vehicle.category}
                      </span>
                    </div>
                  </div>

                  {/* Vehicle Details */}
                  <div className="lg:w-2/3 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{vehicle.name}</h3>
                      <p className="text-tech-purple font-semibold">{vehicle.priceRange}</p>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">Features</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {vehicle.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <span className="text-tech-purple">{feature.icon}</span>
                            <span className="text-gray-300">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div>
                      <h4 className="text-sm text-gray-400 mb-2">Specifications</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(vehicle.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-500">{key}:</span>
                            <span className="text-gray-300">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                      <div className="text-sm">
                        <span className="text-gray-400">Available on </span>
                        <span className="text-white font-semibold">{vehicle.availableRoutes} routes</span>
                      </div>
                      <button className="px-4 py-2 bg-tech-purple text-white rounded-lg text-sm font-semibold hover:bg-tech-purple/90 transition-colors">
                        Book This Vehicle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold text-white mb-6">Why Choose Our Fleet?</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-800 rounded-lg p-4"
            >
              <div className="text-tech-purple mb-3">{benefit.icon}</div>
              <h4 className="text-white font-semibold mb-1">{benefit.title}</h4>
              <p className="text-gray-400 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Safety Standards */}
      <div className="mt-12 bg-green-500/10 border border-green-500/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Safety First</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>All vehicles undergo daily safety checks</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Drivers verified through police verification</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Comprehensive insurance coverage for all passengers</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Emergency SOS button in mobile app</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Bus import at the top
import { Bus } from 'lucide-react';