'use client';

/**
 * Enhanced Data Visualization Section
 * ====================================
 * Interactive charts with animations, geographic visualization, and rich interactions
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  Area, AreaChart, ComposedChart
} from 'recharts';
import {
  trafficStats, vehicleData, timeDistribution,
  techParks, emissionData, routeOptimization,
  infrastructureProjects, shuttleMarket, successModels,
  infrastructureData
} from '@/lib/data/trafficData';
import DataSources from '@/components/ui/DataSources';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import {
  TrendingUp, TrendingDown, Car, Bike, Bus, Train,
  Clock, Fuel, TreePine, Wind, Heart, MapPin
} from 'lucide-react';

// Dynamic import for map (avoid SSR issues)
const TechParkMap = dynamic(
  () => import('@/components/ui/TechParkMap'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] bg-gray-800 rounded-2xl flex items-center justify-center">
        <p className="text-gray-400">Loading map...</p>
      </div>
    ),
  }
);

export default function DataVisualization() {
  const [selectedMetric, setSelectedMetric] = useState('statistics');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Enhanced vehicle growth data with YoY comparison
  const vehicleGrowthData = [
    { year: '2020', cars: 2.0, twoWheelers: 6.7, total: 8.7, yoyGrowth: 8.5 },
    { year: '2021', cars: 2.15, twoWheelers: 7.0, total: 9.15, yoyGrowth: 5.2 },
    { year: '2022', cars: 2.25, twoWheelers: 7.4, total: 9.65, yoyGrowth: 5.5 },
    { year: '2023', cars: 2.35, twoWheelers: 7.8, total: 10.15, yoyGrowth: 5.2 },
    { year: '2024', cars: 2.45, twoWheelers: 8.1, total: 10.55, yoyGrowth: 3.9 },
    { year: '2025', cars: 2.55, twoWheelers: 8.3, total: 10.85, yoyGrowth: 2.8 },
  ];

  // Modal split data for donut chart
  const modalSplitData = [
    { name: 'Two Wheelers', value: 57.5, color: '#f97316', icon: Bike },
    { name: 'Cars', value: 30.4, color: '#6B46C1', icon: Car },
    { name: 'Buses (BMTC)', value: 6.8, color: '#22c55e', icon: Bus },
    { name: 'Metro', value: 3.2, color: '#0066CC', icon: Train },
    { name: 'Others', value: 2.1, color: '#64748b', icon: Car },
  ];

  // Tech park data for pie chart
  const techParkPieData = techParks.map(park => ({
    name: park.name,
    value: park.employees,
    companies: park.companies,
  }));

  const COLORS = ['#6B46C1', '#003366', '#0066CC', '#4B0082', '#764ba2'];

  // Route optimization radar data
  const radarData = routeOptimization.majorCorridors.map(corridor => ({
    route: corridor.name.split(' - ')[0],
    current: corridor.currentTime,
    optimized: corridor.optimizedTime,
    savings: corridor.currentTime - corridor.optimizedTime,
  }));

  // Enhanced tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900 p-4 rounded-xl shadow-2xl border border-gray-700"
        >
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-400">{entry.name}:</span>
              <span className="font-bold text-white">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </span>
            </p>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  // Stat card component with animation
  const StatCard = ({
    label,
    value,
    suffix = '',
    prefix = '',
    color,
    icon: Icon,
    trend,
    trendValue,
    delay = 0,
  }: {
    label: string;
    value: number;
    suffix?: string;
    prefix?: string;
    color: string;
    icon?: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    delay?: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className={`p-5 rounded-xl bg-gradient-to-br ${color} border border-white/10 cursor-pointer transition-shadow hover:shadow-xl hover:shadow-${color.split('-')[1]}-500/20`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-300 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold text-white">
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              duration={1.5}
            />
          </p>
        </div>
        {Icon && (
          <div className="p-2 bg-white/10 rounded-lg">
            <Icon className="w-5 h-5 text-white/80" />
          </div>
        )}
      </div>
      {trend && trendValue && (
        <div className={`flex items-center gap-1 mt-2 text-sm ${trend === 'up' ? 'text-red-300' : 'text-green-300'}`}>
          {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{trendValue}</span>
        </div>
      )}
    </motion.div>
  );

  // Animated progress bar component
  const AnimatedBar = ({
    label,
    value,
    maxValue,
    color,
    suffix = '',
    delay = 0,
  }: {
    label: string;
    value: number;
    maxValue: number;
    color: string;
    suffix?: string;
    delay?: number;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-300">{label}</span>
        <span className="text-xl font-bold text-white">
          <AnimatedCounter value={value} suffix={suffix} duration={1.5} />
        </span>
      </div>
      <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / maxValue) * 100}%` }}
          transition={{ duration: 1.5, delay, ease: 'easeOut' }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
    </div>
  );

  return (
    <section id="data" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">The Data</span> Tells the Story
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-time statistics revealing the magnitude of Bangalore&apos;s traffic crisis
            and the potential impact of our solution
          </p>
        </motion.div>

        {/* Metric Selector with Icons */}
        <div className="flex justify-center mb-12">
          <div className="glass-effect rounded-full p-2 flex gap-2 flex-wrap justify-center">
            {[
              { key: 'statistics', label: 'Statistics', icon: '📊' },
              { key: 'time', label: 'Time', icon: '⏱️' },
              { key: 'vehicles', label: 'Vehicles', icon: '🚗' },
              { key: 'emissions', label: 'Emissions', icon: '🌱' },
              { key: 'routes', label: 'Routes', icon: '🛣️' },
              { key: 'geography', label: 'Geography', icon: '🗺️' },
            ].map((metric) => (
              <motion.button
                key={metric.key}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedMetric(metric.key)}
                className={`px-5 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 ${
                  selectedMetric === metric.key
                    ? 'bg-gradient-to-r from-tech-purple to-bangalore-blue text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{metric.icon}</span>
                <span className="hidden sm:inline">{metric.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Charts Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMetric}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* ==================== STATISTICS TAB ==================== */}
            {selectedMetric === 'statistics' && (
              <>
                {/* Key Metrics Grid */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                    <span className="text-3xl">🚨</span> 2024-2025 Traffic Crisis
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      label="Annual Economic Loss"
                      value={20000}
                      prefix="₹"
                      suffix=" Cr"
                      color="from-red-500/20 to-red-600/10"
                      icon={TrendingDown}
                      trend="up"
                      trendValue="vs ₹19,725 Cr in 2023"
                      delay={0}
                    />
                    <StatCard
                      label="Time for 10km"
                      value={34}
                      suffix=" min"
                      color="from-orange-500/20 to-orange-600/10"
                      icon={Clock}
                      trend="up"
                      trendValue="+50 sec vs 2023"
                      delay={0.1}
                    />
                    <StatCard
                      label="Hours Lost/Year"
                      value={132}
                      suffix=" hrs"
                      color="from-yellow-500/20 to-yellow-600/10"
                      icon={Clock}
                      delay={0.2}
                    />
                    <StatCard
                      label="Global Traffic Rank"
                      value={3}
                      prefix="#"
                      suffix=" Worst"
                      color="from-purple-500/20 to-purple-600/10"
                      delay={0.3}
                    />
                  </div>
                </motion.div>

                {/* Solution Impact */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                    <span className="text-3xl">✨</span> Solution Impact
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <StatCard
                      label="Time Saved Daily"
                      value={45}
                      suffix=" min"
                      color="from-green-500/20 to-green-600/10"
                      icon={Clock}
                      delay={0}
                    />
                    <StatCard
                      label="Target Commuters"
                      value={300000}
                      color="from-blue-500/20 to-blue-600/10"
                      delay={0.1}
                    />
                    <StatCard
                      label="Shuttles Required"
                      value={2000}
                      color="from-indigo-500/20 to-indigo-600/10"
                      icon={Bus}
                      delay={0.2}
                    />
                    <StatCard
                      label="CO₂ Reduction"
                      value={37}
                      suffix="%"
                      color="from-teal-500/20 to-teal-600/10"
                      icon={TreePine}
                      delay={0.3}
                    />
                  </div>
                </motion.div>

                {/* Modal Split Donut Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-effect rounded-3xl p-8 lg:col-span-2"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                    <span className="text-3xl">🚦</span> Modal Split - How Bangalore Commutes
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={modalSplitData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          onMouseEnter={(_, index) => setHoveredItem(modalSplitData[index].name)}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {modalSplitData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              opacity={hoveredItem === null || hoveredItem === entry.name ? 1 : 0.4}
                              style={{ transition: 'opacity 0.3s' }}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-4">
                      {modalSplitData.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredItem(item.name)}
                            onMouseLeave={() => setHoveredItem(null)}
                            className={`flex items-center gap-4 p-3 rounded-xl transition-all cursor-pointer ${
                              hoveredItem === item.name ? 'bg-gray-800 scale-105' : 'hover:bg-gray-800/50'
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${item.color}30` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: item.color }} />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-medium">{item.name}</p>
                              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-1">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${item.value}%` }}
                                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: item.color }}
                                />
                              </div>
                            </div>
                            <span className="text-xl font-bold text-white">{item.value}%</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* ==================== TIME TAB ==================== */}
            {selectedMetric === 'time' && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-white">Peak Hour Congestion</h3>
                  <p className="text-gray-400 text-sm mb-6">Congestion index by hour (higher = worse)</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={timeDistribution}>
                      <defs>
                        <linearGradient id="colorCongestion" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                          <stop offset="50%" stopColor="#f97316" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#eab308" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="congestion"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorCongestion)"
                        name="Congestion %"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-white">Average Speed by Hour</h3>
                  <p className="text-gray-400 text-sm mb-6">km/h throughout the day</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={timeDistribution}>
                      <defs>
                        <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="hour" stroke="#888" fontSize={12} />
                      <YAxis stroke="#888" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="avgSpeed"
                        fill="url(#colorSpeed)"
                        stroke="#22c55e"
                        strokeWidth={2}
                        name="Avg Speed (km/h)"
                      />
                      <Line
                        type="monotone"
                        dataKey="optimal"
                        stroke="#6B46C1"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Target Speed"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Peak Hours Summary Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-effect rounded-3xl p-8 lg:col-span-2"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white">Peak Hour Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-red-500/10 rounded-xl text-center">
                      <p className="text-gray-400 text-sm">Morning Peak</p>
                      <p className="text-2xl font-bold text-red-400">8-10 AM</p>
                      <p className="text-sm text-gray-500 mt-1">95% congestion</p>
                    </div>
                    <div className="p-4 bg-orange-500/10 rounded-xl text-center">
                      <p className="text-gray-400 text-sm">Evening Peak</p>
                      <p className="text-2xl font-bold text-orange-400">6-8 PM</p>
                      <p className="text-sm text-gray-500 mt-1">90% congestion</p>
                    </div>
                    <div className="p-4 bg-green-500/10 rounded-xl text-center">
                      <p className="text-gray-400 text-sm">Best Time</p>
                      <p className="text-2xl font-bold text-green-400">5-6 AM</p>
                      <p className="text-sm text-gray-500 mt-1">55 km/h avg</p>
                    </div>
                    <div className="p-4 bg-purple-500/10 rounded-xl text-center">
                      <p className="text-gray-400 text-sm">Worst Record</p>
                      <p className="text-2xl font-bold text-purple-400">Oct 5, 2024</p>
                      <p className="text-sm text-gray-500 mt-1">58% congestion</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* ==================== VEHICLES TAB ==================== */}
            {selectedMetric === 'vehicles' && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-white">Vehicle Growth (Millions)</h3>
                  <p className="text-gray-400 text-sm mb-6">Cars vs Two-Wheelers (2020-2025)</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={vehicleGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="year" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ color: '#888' }} />
                      <Bar dataKey="cars" fill="#6B46C1" name="Cars (M)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="twoWheelers" fill="#f97316" name="Two Wheelers (M)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-white">Year-over-Year Growth</h3>
                  <p className="text-gray-400 text-sm mb-6">Vehicle registration growth rate (%)</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={vehicleGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="year" stroke="#888" />
                      <YAxis stroke="#888" domain={[0, 10]} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="yoyGrowth"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ fill: '#22c55e', r: 6 }}
                        activeDot={{ r: 8, fill: '#22c55e' }}
                        name="YoY Growth %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </motion.div>

                {/* Vehicle Stats Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-effect rounded-3xl p-8 lg:col-span-2"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white">2025 Vehicle Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-4">
                      <AnimatedBar
                        label="Total Registered"
                        value={12.3}
                        maxValue={15}
                        color="bg-gradient-to-r from-purple-500 to-purple-400"
                        suffix="M"
                        delay={0}
                      />
                    </div>
                    <div className="space-y-4">
                      <AnimatedBar
                        label="New Cars (FY25)"
                        value={145}
                        maxValue={200}
                        color="bg-gradient-to-r from-blue-500 to-blue-400"
                        suffix="K"
                        delay={0.1}
                      />
                    </div>
                    <div className="space-y-4">
                      <AnimatedBar
                        label="New 2W (FY25)"
                        value={468}
                        maxValue={500}
                        color="bg-gradient-to-r from-orange-500 to-orange-400"
                        suffix="K"
                        delay={0.2}
                      />
                    </div>
                    <div className="space-y-4">
                      <AnimatedBar
                        label="BMTC Buses"
                        value={6340}
                        maxValue={10000}
                        color="bg-gradient-to-r from-green-500 to-green-400"
                        delay={0.3}
                      />
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-red-400" />
                      <div>
                        <p className="text-white font-semibold">The Imbalance Problem</p>
                        <p className="text-gray-400 text-sm">
                          Vehicle growth: <span className="text-red-400 font-bold">12%/year</span> vs
                          Road growth: <span className="text-green-400 font-bold">7%/year</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* ==================== EMISSIONS TAB ==================== */}
            {selectedMetric === 'emissions' && (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white">
                    Daily CO₂ Emissions (tons)
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Current System</span>
                        <span className="text-2xl font-bold text-red-400">
                          <AnimatedCounter value={15000} suffix=" tons" />
                        </span>
                      </div>
                      <div className="w-full h-12 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-red-600 to-red-400 flex items-center justify-end pr-4"
                        >
                          <span className="text-white text-sm font-semibold">100%</span>
                        </motion.div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">With Bus System</span>
                        <span className="text-2xl font-bold text-green-400">
                          <AnimatedCounter value={9500} suffix=" tons" />
                        </span>
                      </div>
                      <div className="w-full h-12 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '63%' }}
                          transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-end pr-4"
                        >
                          <span className="text-white text-sm font-semibold">63%</span>
                        </motion.div>
                      </div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                      className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-transparent rounded-2xl border border-green-500/20"
                    >
                      <div className="text-center">
                        <p className="text-5xl font-bold text-green-400 mb-2">
                          <AnimatedCounter value={37} suffix="%" duration={2} />
                        </p>
                        <p className="text-lg text-gray-300">Emission Reduction</p>
                        <p className="text-sm text-gray-400 mt-2">
                          Saving <span className="font-bold text-white">5,500 tons</span> of CO₂ daily
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white">
                    Environmental Benefits
                  </h3>
                  <div className="space-y-4">
                    {[
                      { icon: TreePine, value: '2.5M', label: 'Trees', desc: 'Annual absorption equivalent', color: 'green' },
                      { icon: Wind, value: '+45', label: 'Days', desc: 'Additional clean air days/year', color: 'blue' },
                      { icon: Fuel, value: '15M', label: 'Liters', desc: 'Fuel saved annually', color: 'yellow' },
                      { icon: Heart, value: '30%', label: 'Less', desc: 'Respiratory issues in IT zones', color: 'purple' },
                      { icon: Car, value: '75K', label: 'Cars', desc: 'Off the road daily', color: 'red' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className={`p-4 bg-gradient-to-r from-${item.color}-500/10 to-transparent rounded-xl cursor-pointer transition-all`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 bg-${item.color}-500/20 rounded-xl`}>
                            <item.icon className={`w-6 h-6 text-${item.color}-400`} />
                          </div>
                          <div>
                            <p className={`text-2xl font-bold text-${item.color}-400`}>
                              {item.value} {item.label}
                            </p>
                            <p className="text-sm text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}

            {/* ==================== ROUTES TAB ==================== */}
            {selectedMetric === 'routes' && (
              <>
                <motion.div
                  initial={{ opacity: 0, rotate: -5 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-white">Route Time Optimization</h3>
                  <p className="text-gray-400 text-sm mb-6">Current vs Optimized travel times (minutes)</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#444" />
                      <PolarAngleAxis dataKey="route" stroke="#888" fontSize={11} />
                      <PolarRadiusAxis stroke="#888" fontSize={10} />
                      <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Optimized"
                        dataKey="optimized"
                        stroke="#22c55e"
                        fill="#22c55e"
                        fillOpacity={0.3}
                      />
                      <Legend wrapperStyle={{ color: '#888' }} />
                      <Tooltip content={<CustomTooltip />} />
                    </RadarChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, rotate: 5 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  className="glass-effect rounded-3xl p-8"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white">Infrastructure Projects</h3>
                  <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2">
                    {infrastructureProjects.map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-gradient-to-r from-gray-800 to-transparent rounded-xl cursor-pointer"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-white">{project.name}</p>
                            <p className="text-sm text-gray-400">{project.type}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-tech-purple">
                              {project.completionPercentage}%
                            </p>
                            <p className="text-xs text-gray-500">{project.status}</p>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${project.completionPercentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            className="bg-gradient-to-r from-tech-purple to-bangalore-blue h-2 rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Time Savings Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-effect rounded-3xl p-8 lg:col-span-2"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white">Projected Time Savings</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-b from-green-500/10 to-transparent rounded-2xl">
                      <p className="text-4xl font-bold text-green-400">
                        <AnimatedCounter value={45} suffix=" min" />
                      </p>
                      <p className="text-gray-400 mt-2">Average per trip</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-b from-blue-500/10 to-transparent rounded-2xl">
                      <p className="text-4xl font-bold text-blue-400">
                        <AnimatedCounter value={20} suffix=" hrs" />
                      </p>
                      <p className="text-gray-400 mt-2">Monthly per commuter</p>
                    </div>
                    <div className="text-center p-6 bg-gradient-to-b from-purple-500/10 to-transparent rounded-2xl">
                      <p className="text-4xl font-bold text-purple-400">
                        <AnimatedCounter value={15} suffix="%" />
                      </p>
                      <p className="text-gray-400 mt-2">Productivity increase</p>
                    </div>
                  </div>
                </motion.div>
              </>
            )}

            {/* ==================== GEOGRAPHY TAB ==================== */}
            {selectedMetric === 'geography' && (
              <>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-effect rounded-3xl p-8 lg:col-span-2"
                >
                  <h3 className="text-2xl font-semibold mb-2 text-white flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-tech-purple" />
                    IT Corridor Heatmap
                  </h3>
                  <p className="text-gray-400 text-sm mb-6">
                    Interactive map showing tech parks and major IT corridors in Bangalore
                  </p>
                  <TechParkMap
                    techParks={techParks}
                    className="h-[450px] rounded-xl overflow-hidden"
                  />
                </motion.div>

                {/* Tech Park Cards */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-effect rounded-3xl p-8 lg:col-span-2"
                >
                  <h3 className="text-2xl font-semibold mb-6 text-white">Major IT Hubs</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {techParks.slice(0, 6).map((park, index) => (
                      <motion.div
                        key={park.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="p-5 bg-gradient-to-br from-gray-800/80 to-gray-900/50 rounded-xl border border-gray-700/50 cursor-pointer hover:border-tech-purple/50 transition-all"
                      >
                        <h4 className="text-lg font-semibold text-white mb-3">{park.name}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Companies</span>
                            <span className="text-white font-medium">{park.companies}+</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400 text-sm">Employees</span>
                            <span className="text-tech-purple font-bold">
                              {(park.employees / 1000).toFixed(0)}K
                            </span>
                          </div>
                          {park.area && (
                            <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Area</span>
                              <span className="text-white font-medium">{park.area} acres</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Data Sources */}
        <DataSources />
      </div>
    </section>
  );
}
