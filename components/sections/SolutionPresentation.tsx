'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { busServiceProjections, successModels, itSectorData } from '@/lib/data/trafficData';

// Dynamically import components
const BangaloreMapOSM = dynamic(() => import('@/components/map/BangaloreMapOSM'), {
  ssr: false,
  loading: () => <div className="w-full h-[700px] bg-gray-900 animate-pulse rounded-3xl" />,
});

export default function SolutionPresentation() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: 'Smart Route Optimization',
      icon: '🗺️',
      description: 'AI-powered routing based on real-time traffic data and demand patterns',
      details: [
        'Dynamic route adjustment during peak hours',
        'Predictive modeling for optimal bus deployment',
        'Integration with existing Metro feeder routes',
        'Priority lanes on major corridors',
      ],
    },
    {
      title: 'Premium Comfort',
      icon: '🚌',
      description: 'AC buses with guaranteed seating and modern amenities',
      details: [
        'WiFi-enabled buses for productivity',
        'Comfortable reclining seats',
        'Air conditioning and air purification',
        'Real-time entertainment systems',
      ],
    },
    {
      title: 'Technology Integration',
      icon: '📱',
      description: 'Seamless booking and tracking through mobile app',
      details: [
        'Real-time GPS tracking',
        'Mobile ticketing and passes',
        'Seat reservation system',
        'Integration with corporate IDs',
      ],
    },
    {
      title: 'Safety First',
      icon: '🛡️',
      description: 'Comprehensive safety features for peace of mind',
      details: [
        'CCTV surveillance in all buses',
        'Women\'s safety features',
        'Emergency SOS buttons',
        'Professional trained drivers',
      ],
    },
  ];

  const implementationPhases = busServiceProjections.phases.map((phase) => ({
    ...phase,
    icon: phase.phase === 1 ? '🚀' : phase.phase === 2 ? '📈' : '🎯',
  }));

  return (
    <section id="solution" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            The <span className="text-gradient">Solution</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive special bus system designed specifically for Bangalore's
            office commuters, combining comfort, technology, and efficiency
          </p>
        </motion.div>

        {/* Real Bangalore Map with Traffic Analysis */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <div className="glass-effect rounded-3xl p-8">
            <h3 className="text-2xl font-semibold mb-6 text-white">
              Real-Time Bangalore Traffic Map & Commuter Flow Analysis
            </h3>
            <BangaloreMapOSM />
            <p className="text-sm text-gray-400 mt-4 text-center">
              Interactive map showing actual Bangalore roads, IT hubs, and residential areas. Click on IT hub markers to visualize commuter traffic flows.
            </p>
          </div>
        </motion.div>


        {/* Key Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-semibold mb-8 text-center">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setActiveFeature(index)}
                className={`glass-effect rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  activeFeature === index ? 'scale-105 border-2 border-tech-purple' : ''
                }`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-400 mb-4">{feature.description}</p>
                {activeFeature === index && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2"
                  >
                    {feature.details.map((detail, i) => (
                      <li key={i} className="text-xs text-gray-300 flex items-start">
                        <span className="text-green-400 mr-2">✓</span>
                        {detail}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Success Models */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-semibold mb-8 text-center">
            Proven Success Models
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successModels.map((model, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="glass-effect rounded-2xl p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-semibold text-white">{model.name}</h4>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{model.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-2xl font-bold text-tech-purple">
                      {model.buses || model.vehicles || model.routes}
                    </p>
                    <p className="text-xs text-gray-500">
                      {model.buses ? 'Buses' : model.vehicles ? 'Vehicles' : 'Routes'}
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-bangalore-blue">
                      {(model.dailyRiders / 1000).toFixed(0)}K
                    </p>
                    <p className="text-xs text-gray-500">Daily Riders</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Implementation Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-semibold mb-8 text-center">
            Implementation Roadmap
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-tech-purple to-bangalore-blue" />

            {/* Phase cards */}
            <div className="space-y-12">
              {implementationPhases.map((phase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                    <div className="glass-effect rounded-2xl p-6 inline-block">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl">{phase.icon}</span>
                        <div>
                          <h4 className="text-xl font-semibold text-white">
                            Phase {phase.phase}
                          </h4>
                          <p className="text-sm text-gray-400">{phase.duration}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-tech-purple">{phase.buses}</p>
                          <p className="text-xs text-gray-500">Buses</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-bangalore-blue">
                            {(phase.targetEmployees / 1000).toFixed(0)}K
                          </p>
                          <p className="text-xs text-gray-500">Commuters</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Financial Projections */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="glass-effect rounded-3xl p-8"
        >
          <h3 className="text-3xl font-semibold mb-8 text-center">
            Financial Viability
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-gradient mb-2">
                ₹{(busServiceProjections.financials.monthlyRevenue / 10000000).toFixed(0)} Cr
              </p>
              <p className="text-gray-400">Monthly Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400 mb-2">
                {busServiceProjections.financials.profitMargin}%
              </p>
              <p className="text-gray-400">Profit Margin</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-400 mb-2">
                {itSectorData.targetAdoption * 100}%
              </p>
              <p className="text-gray-400">Target Adoption</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-white">Pricing Strategy</p>
                <p className="text-sm text-gray-400 mt-1">
                  AC Buses: ₹{busServiceProjections.financials.avgFareAC}/month
                  • Regular: ₹{busServiceProjections.financials.avgFareRegular}/month
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-400">60% Cheaper</p>
                <p className="text-xs text-gray-400">than personal vehicle costs</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}