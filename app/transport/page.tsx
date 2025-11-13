'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import RouteCalculator from '@/components/transport/RouteCalculator';
import TransportComparison from '@/components/transport/TransportComparison';
import { Calculator, BarChart3, Home, ChevronLeft } from 'lucide-react';

export default function TransportPage() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'comparison'>('calculator');

  const tabs = [
    {
      id: 'calculator' as const,
      label: 'Calculator',
      icon: <Calculator className="w-4 h-4 md:w-5 md:h-5" />,
      description: 'Calculate cost & time'
    },
    {
      id: 'comparison' as const,
      label: 'Compare',
      icon: <BarChart3 className="w-4 h-4 md:w-5 md:h-5" />,
      description: 'Compare all modes'
    }
  ];

  return (
    <main className="min-h-screen bg-black">
      {/* Mobile-friendly Header */}
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            {/* Back Button */}
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Link>

            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">🚌</span>
              <span className="font-bold text-white text-lg sm:text-xl">BLR Transit</span>
            </div>

            {/* Home Button */}
            <Link
              href="/"
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5 text-gray-400 hover:text-white" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="text-gradient">Smart Transport</span>{' '}
            <span className="text-white">Calculator</span>
          </h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Find the most efficient way to commute in Bangalore
          </p>
        </motion.div>

        {/* Mobile-Optimized Tab Navigation */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 flex gap-1 sm:gap-2 w-full sm:w-auto max-w-md">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-initial px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-tech-purple to-bangalore-blue text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
                  {tab.icon}
                  <div className="text-left">
                    <div className="font-semibold text-sm sm:text-base">{tab.label}</div>
                    <div className="text-xs opacity-75 hidden lg:block">{tab.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'calculator' && <RouteCalculator />}
          {activeTab === 'comparison' && <TransportComparison />}
        </motion.div>

        {/* Mobile-Optimized Statistics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
        >
          {[
            { label: 'Daily Commuters', value: '1M+', icon: '🚌', color: 'from-green-500/20 to-green-600/20' },
            { label: 'Avg. Time', value: '90 min', icon: '⏱️', color: 'from-orange-500/20 to-orange-600/20' },
            { label: 'Monthly Save', value: '₹8K', icon: '💰', color: 'from-blue-500/20 to-blue-600/20' },
            { label: 'CO₂ Cut', value: '37%', icon: '🌱', color: 'from-purple-500/20 to-purple-600/20' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-3 sm:p-4 border border-gray-700/50 hover:scale-105 transition-transform`}
            >
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{stat.icon}</div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Mobile-Optimized Footer */}
      <footer className="border-t border-gray-800 mt-12 sm:mt-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-400">
              © 2025 BLR Transit | Built with ❤️ for Bangalore
            </p>
            <Link
              href="/"
              className="inline-block mt-4 px-4 sm:px-6 py-2 bg-gradient-to-r from-tech-purple to-bangalore-blue text-white rounded-full text-sm sm:text-base font-medium hover:opacity-90 transition-opacity"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}