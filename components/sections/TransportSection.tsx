'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import RouteCalculator from '@/components/transport/RouteCalculator';
import TransportComparison from '@/components/transport/TransportComparison';
import { Calculator, BarChart3, MapPin, TrendingUp } from 'lucide-react';

export default function TransportSection() {
  const [activeTab, setActiveTab] = useState<'calculator' | 'comparison'>('calculator');

  const tabs = [
    {
      id: 'calculator' as const,
      label: 'Route Calculator',
      icon: <Calculator className="w-5 h-5" />,
      description: 'Calculate cost & time for your daily commute'
    },
    {
      id: 'comparison' as const,
      label: 'Mode Comparison',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Compare all transport options side by side'
    }
  ];

  return (
    <section id="transport" className="py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-4">
            <span className="text-gradient">Smart Transport</span> Calculator
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Discover the most efficient way to commute in Bangalore. Compare costs, time, and comfort across all transport modes.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-tech-purple to-bangalore-blue text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab.icon}
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-75 hidden md:block">{tab.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
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

        {/* Key Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Daily Commuters', value: '1M+', icon: '🚌', color: 'from-green-500/20 to-green-600/20' },
            { label: 'Avg. Commute Time', value: '90 min', icon: '⏱️', color: 'from-orange-500/20 to-orange-600/20' },
            { label: 'Monthly Savings', value: '₹8,000', icon: '💰', color: 'from-blue-500/20 to-blue-600/20' },
            { label: 'CO₂ Reduction', value: '37%', icon: '🌱', color: 'from-purple-500/20 to-purple-600/20' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 border border-gray-700/50 hover:scale-105 transition-transform`}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gray-800/50 backdrop-blur-sm rounded-full">
            <TrendingUp className="w-5 h-5 text-tech-purple" />
            <span className="text-gray-300">
              Switch to public transport and save <span className="text-white font-bold">₹96,000</span> yearly
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}