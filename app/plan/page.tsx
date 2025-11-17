'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ParkRideBooking from '@/components/booking/ParkRideBooking';
import VehicleSelector from '@/components/booking/VehicleSelector';
import RouteSchedule from '@/components/booking/RouteSchedule';
import { Home, ChevronLeft, Car, Bus, MapPin, Clock, Users, Shield } from 'lucide-react';

export default function PlanPage() {
  const [activeView, setActiveView] = useState<'booking' | 'schedule' | 'vehicles'>('booking');

  const features = [
    {
      icon: <Car className="w-6 h-6" />,
      title: 'Park Your Vehicle',
      description: 'Secure parking at hub locations'
    },
    {
      icon: <Bus className="w-6 h-6" />,
      title: 'Premium Buses',
      description: 'AC Urbania & Force Motors vehicles'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Safe & Comfortable',
      description: 'Professional drivers, GPS tracked'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Time Efficient',
      description: 'HOV lanes, fixed schedules'
    }
  ];

  const stats = [
    { label: 'Active Routes', value: '12', color: 'from-blue-500/20 to-blue-600/20' },
    { label: 'Daily Commuters', value: '850+', color: 'from-green-500/20 to-green-600/20' },
    { label: 'Parking Spots', value: '2000', color: 'from-purple-500/20 to-purple-600/20' },
    { label: 'CO₂ Saved', value: '12 tons', color: 'from-orange-500/20 to-orange-600/20' }
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>

            <div className="flex items-center gap-2">
              <Bus className="w-6 h-6 text-tech-purple" />
              <span className="font-bold text-white text-lg sm:text-xl">Park & Ride</span>
            </div>

            <Link
              href="/"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5 text-gray-400 hover:text-white" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-gradient">Smart Park & Ride</span>{' '}
              <span className="text-white">Office Commute</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Drive to our parking hubs, park securely, and take a premium AC bus to your office.
              Save time, reduce stress, and travel comfortably.
            </p>
          </motion.div>

          {/* Key Features */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800 hover:border-tech-purple transition-colors"
              >
                <div className="text-tech-purple mb-2">{feature.icon}</div>
                <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* View Tabs */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 flex gap-1">
              {[
                { id: 'booking', label: 'Book Now', icon: <Users className="w-4 h-4" /> },
                { id: 'schedule', label: 'Schedule', icon: <Clock className="w-4 h-4" /> },
                { id: 'vehicles', label: 'Our Fleet', icon: <Bus className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id as any)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all ${
                    activeView === tab.id
                      ? 'bg-gradient-to-r from-tech-purple to-bangalore-blue text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {tab.icon}
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <motion.div
            key={activeView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeView === 'booking' && <ParkRideBooking />}
            {activeView === 'schedule' && <RouteSchedule />}
            {activeView === 'vehicles' && <VehicleSelector />}
          </motion.div>

          {/* Statistics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 border border-gray-700/50`}
              >
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-gray-800 mt-12 sm:mt-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ready to simplify your commute?</h3>
            <p className="text-gray-400 mb-4">Join 850+ professionals already using Park & Ride</p>
            <button
              onClick={() => setActiveView('booking')}
              className="px-6 py-3 bg-gradient-to-r from-tech-purple to-bangalore-blue text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              Book Your Seat Now
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}