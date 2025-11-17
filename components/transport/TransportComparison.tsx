'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Clock,
  IndianRupee,
  Leaf,
  Star,
  Users,
  ChevronRight
} from 'lucide-react';
import { transportModes } from '@/lib/data/transportationRoutes';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <p className="text-gray-800 font-semibold">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-gray-600 text-sm">
            {entry.name}: <span className="font-bold" style={{ color: entry.color }}>
              {typeof entry.value === 'number'
                ? entry.name.includes('₹')
                  ? `₹${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()
                : entry.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function TransportComparison() {
  const [selectedRoute, setSelectedRoute] = useState<'short' | 'medium' | 'long'>('medium');
  const [comparisonData, setComparisonData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);

  const routes = useMemo(() => ({
    short: { distance: 5, name: 'Short (5km)', example: 'Koramangala → HSR' },
    medium: { distance: 15, name: 'Medium (15km)', example: 'HSR → Electronic City' },
    long: { distance: 25, name: 'Long (25km)', example: 'Whitefield → Manyata' }
  }), []);

  useEffect(() => {
    const route = routes[selectedRoute];
    const distance = route.distance;

    // Calculate costs for different transport modes
    const modes = [
      {
        name: 'BMTC Bus',
        mode: transportModes.bmtcOrdinary,
        color: '#10b981'
      },
      {
        name: 'Metro',
        mode: transportModes.metro,
        color: '#8b5cf6'
      },
      {
        name: 'Ola/Uber',
        mode: transportModes.olaPrime,
        color: '#f59e0b'
      },
      {
        name: 'Auto',
        mode: transportModes.auto,
        color: '#ef4444'
      },
      {
        name: 'Company Shuttle',
        mode: transportModes.companyShuttle,
        color: '#6366f1'
      },
      {
        name: 'Personal Car',
        mode: transportModes.personal,
        color: '#64748b'
      }
    ];

    // Comparison data
    const comparison = modes.map(({ name, mode, color }) => {
      const baseCost = mode.baseFare || 0;
      const perKmCost = (mode.perKmRate || 0) * distance;
      const dailyCost = Math.min(baseCost + perKmCost, mode.maxFare || 999999);
      const time = Math.round((distance / mode.avgSpeed) * 60 + 10); // Add average waiting time

      return {
        name,
        'Daily Cost (₹)': Math.round(dailyCost),
        'Travel Time (min)': time,
        'Comfort Rating': mode.comfort,
        'Eco Score': mode.environmental,
        color
      };
    });

    // Monthly cost data
    const monthly = modes.map(({ name, mode, color }) => {
      const baseCost = mode.baseFare || 0;
      const perKmCost = (mode.perKmRate || 0) * distance;
      let monthlyCost;

      if (mode.type === 'shuttle') {
        monthlyCost = mode.baseFare; // Already monthly
      } else {
        const dailyCost = Math.min(baseCost + perKmCost, mode.maxFare || 999999);
        monthlyCost = dailyCost * 22 * 2; // 22 working days, round trip
      }

      return {
        name,
        'Monthly Cost': Math.round(monthlyCost),
        color
      };
    });

    // Radar chart data for multi-dimensional comparison
    const radar = [
      {
        metric: 'Cost Efficiency',
        BMTC: 5,
        Metro: 4,
        Cab: 2,
        Auto: 2,
        Shuttle: 4,
        Personal: 1
      },
      {
        metric: 'Speed',
        BMTC: 2,
        Metro: 5,
        Cab: 3,
        Auto: 3,
        Shuttle: 3,
        Personal: 3
      },
      {
        metric: 'Comfort',
        BMTC: 2,
        Metro: 5,
        Cab: 4,
        Auto: 2,
        Shuttle: 4,
        Personal: 5
      },
      {
        metric: 'Availability',
        BMTC: 4,
        Metro: 4,
        Cab: 5,
        Auto: 5,
        Shuttle: 3,
        Personal: 5
      },
      {
        metric: 'Eco-Friendly',
        BMTC: 4,
        Metro: 5,
        Cab: 2,
        Auto: 3,
        Shuttle: 4,
        Personal: 1
      }
    ];

    setComparisonData(comparison);
    setMonthlyData(monthly);
    setRadarData(radar);
  }, [selectedRoute, routes]);

  return (
    <div className="bg-gray-900 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4">Transport Mode Comparison</h2>
        <p className="text-sm sm:text-base text-gray-400">Compare cost, time, and comfort across different transport options</p>
      </div>

      {/* Route Selection */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
        {(Object.keys(routes) as Array<keyof typeof routes>).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedRoute(key)}
            className={`px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all ${
              selectedRoute === key
                ? 'bg-gradient-to-r from-tech-purple to-bangalore-blue text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <div className="text-left">
              <div className="text-sm sm:text-base font-semibold">{routes[key].name}</div>
              <div className="text-xs opacity-75 mt-0.5 sm:mt-1 hidden sm:block">{routes[key].example}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Cost vs Time Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
          <TrendingUp className="text-tech-purple w-5 h-5" />
          <span className="text-base sm:text-xl">Daily Cost vs Travel Time</span>
        </h3>
        <div className="bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-4">
          <ResponsiveContainer width="100%" height={250} className="sm:h-[350px]">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis yAxisId="left" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar yAxisId="left" dataKey="Daily Cost (₹)" fill="#8b5cf6" radius={[8, 8, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
              <Bar yAxisId="right" dataKey="Travel Time (min)" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Monthly Cost Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <IndianRupee className="text-green-500" />
          Monthly Commute Cost
        </h3>
        <div className="bg-gray-800 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis dataKey="name" type="category" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Monthly Cost" fill="#10b981" radius={[0, 8, 8, 0]}>
                {monthlyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Multi-dimensional Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="text-yellow-500" />
          Multi-Factor Analysis
        </h3>
        <div className="bg-gray-800 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="metric" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <PolarRadiusAxis angle={90} domain={[0, 5]} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <Radar name="BMTC" dataKey="BMTC" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Radar name="Metro" dataKey="Metro" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              <Radar name="Cab" dataKey="Cab" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
              <Radar name="Auto" dataKey="Auto" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
              <Radar name="Shuttle" dataKey="Shuttle" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-green-500/30"
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <IndianRupee className="text-green-400 w-6 sm:w-8 h-6 sm:h-8" />
            <h4 className="text-white text-sm sm:text-base font-semibold">Most Economical</h4>
          </div>
          <p className="text-white text-lg sm:text-2xl font-bold mb-1 sm:mb-2">BMTC Bus</p>
          <p className="text-gray-300 text-xs sm:text-sm">Save up to 85% compared to cabs</p>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-green-500/30">
            <p className="text-gray-400 text-xs">Monthly saving vs. cab: ₹8,000+</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-6 border border-purple-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Clock className="text-purple-400 w-8 h-8" />
            <h4 className="text-white font-semibold">Fastest Option</h4>
          </div>
          <p className="text-white text-2xl font-bold mb-2">Namma Metro</p>
          <p className="text-gray-300 text-sm">50% faster during peak hours</p>
          <div className="mt-4 pt-4 border-t border-purple-500/30">
            <p className="text-gray-400 text-xs">Time saved monthly: 20+ hours</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-6 border border-blue-500/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <Leaf className="text-blue-400 w-8 h-8" />
            <h4 className="text-white font-semibold">Most Sustainable</h4>
          </div>
          <p className="text-white text-2xl font-bold mb-2">Public Transport</p>
          <p className="text-gray-300 text-sm">80% lower carbon footprint</p>
          <div className="mt-4 pt-4 border-t border-blue-500/30">
            <p className="text-gray-400 text-xs">CO₂ saved yearly: 2.4 tons</p>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 bg-gradient-to-r from-tech-purple to-bangalore-blue rounded-xl p-6 text-center"
      >
        <h3 className="text-white text-xl font-bold mb-2">Ready to Make the Switch?</h3>
        <p className="text-white/90 mb-4">Join thousands of Bangaloreans choosing smarter commutes</p>
        <button className="px-6 py-3 bg-white text-tech-purple font-semibold rounded-lg hover:scale-105 transition-transform inline-flex items-center gap-2">
          Calculate Your Route <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}