'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { trafficStats } from '@/lib/data/trafficData';

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Global Rank', value: `#${trafficStats.globalRank}`, suffix: '3rd Worst Traffic' },
    { label: 'Annual Hours Lost', value: trafficStats.annualHoursLost, suffix: 'Per Driver' },
    { label: 'Economic Impact', value: `₹${(trafficStats.monetaryCost/1000).toFixed(0)}K Cr`, suffix: 'Annual Loss (2024)' },
    { label: 'Average Speed', value: `${trafficStats.avgSpeed}`, suffix: 'km/h (17.6)' },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 min-h-screen flex flex-col justify-between">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="pt-20 px-8 text-center"
        >
          <h1 className="text-7xl md:text-8xl font-bold mb-6">
            <span className="text-gradient">Bangalore's</span>
            <br />
            <span className="text-white">Traffic Crisis</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Every day, 11.8 million vehicles battle for space on roads growing at just 7% while vehicles grow at 12%.
            With ₹20,000 crores lost annually, it's time for a revolutionary solution.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="inline-block"
          >
            <button
              onClick={() => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-tech-purple to-bangalore-blue text-white font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-xl hover:shadow-2xl"
            >
              Discover the Solution
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="pb-20"
        >
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  className="glass-effect rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
                  style={{
                    transform: `translateY(${scrollY * 0.05 * (index + 1)}px)`,
                  }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wide">
                    {stat.label}
                  </div>
                  <div className="text-xs text-tech-purple mt-1">
                    {stat.suffix}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}