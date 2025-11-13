'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Area, AreaChart
} from 'recharts';
import {
  trafficStats, vehicleData, timeDistribution,
  techParks, emissionData, routeOptimization,
  infrastructureProjects, shuttleMarket, successModels
} from '@/lib/data/trafficData';

export default function DataVisualization() {
  const [selectedMetric, setSelectedMetric] = useState('statistics');

  // Prepare data for vehicle growth chart
  const vehicleGrowthData = [
    { year: '2020', cars: vehicleData.cars[2020] / 1000000, twoWheelers: vehicleData.twoWheelers[2020] / 1000000 },
    { year: '2021', cars: 2.15, twoWheelers: 7.0 },
    { year: '2022', cars: 2.25, twoWheelers: 7.4 },
    { year: '2023', cars: 2.35, twoWheelers: 7.8 },
    { year: '2024', cars: 2.45, twoWheelers: 8.1 },
    { year: '2025', cars: vehicleData.cars[2025] / 1000000, twoWheelers: vehicleData.twoWheelers[2025] / 1000000 },
  ];

  // Tech park employee distribution
  const techParkPieData = techParks.map(park => ({
    name: park.name,
    value: park.employees,
    companies: park.companies,
  }));

  // Colors for pie chart
  const COLORS = ['#6B46C1', '#003366', '#0066CC', '#4B0082', '#764ba2'];

  // Emission reduction data
  const emissionComparisonData = [
    { category: 'Current', emissions: emissionData.currentDailyEmissions, color: '#FF4444' },
    { category: 'With Bus System', emissions: emissionData.projectedWithBuses, color: '#44FF44' },
  ];

  // Route optimization radar data
  const radarData = routeOptimization.majorCorridors.map(corridor => ({
    route: corridor.name.split(' - ')[0],
    current: corridor.currentTime,
    optimized: corridor.optimizedTime,
  }));

  // Custom tooltip with better contrast
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-800 font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-600 text-sm">
              {entry.name}: <span className="font-bold" style={{ color: entry.color }}>{
                typeof entry.value === 'number' ?
                  entry.value.toLocaleString() :
                  entry.value
              }</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
            Real-time statistics revealing the magnitude of Bangalore&apos;s traffic crisis and the potential impact of our solution
          </p>
        </motion.div>

        {/* Metric Selector */}
        <div className="flex justify-center mb-12">
          <div className="glass-effect rounded-full p-2 flex gap-2 flex-wrap justify-center">
            {['statistics', 'time', 'vehicles', 'emissions', 'routes'].map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedMetric === metric
                    ? 'bg-gradient-to-r from-tech-purple to-bangalore-blue text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 2024-2025 Key Statistics */}
          {selectedMetric === 'statistics' && (
            <>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">2024-2025 Traffic Crisis</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-red-500/10 rounded-xl">
                    <span className="text-gray-300">Annual Economic Loss</span>
                    <span className="text-2xl font-bold text-red-400">₹20,000 Cr</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-orange-500/10 rounded-xl">
                    <span className="text-gray-300">Time for 10km Journey</span>
                    <span className="text-2xl font-bold text-orange-400">34 minutes</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-xl">
                    <span className="text-gray-300">Hours Lost Per Year</span>
                    <span className="text-2xl font-bold text-yellow-400">243 hours</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-purple-500/10 rounded-xl">
                    <span className="text-gray-300">Global Traffic Rank</span>
                    <span className="text-2xl font-bold text-purple-400">#3 Worst</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">Solution Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-500/10 rounded-xl">
                    <span className="text-gray-300">Time Saved Daily</span>
                    <span className="text-2xl font-bold text-green-400">45 min/person</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-blue-500/10 rounded-xl">
                    <span className="text-gray-300">Target Commuters</span>
                    <span className="text-2xl font-bold text-blue-400">300,000</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-indigo-500/10 rounded-xl">
                    <span className="text-gray-300">Buses Required</span>
                    <span className="text-2xl font-bold text-indigo-400">2,000</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-teal-500/10 rounded-xl">
                    <span className="text-gray-300">CO₂ Reduction</span>
                    <span className="text-2xl font-bold text-teal-400">37% less</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* Peak Hour Time Distribution */}
          {selectedMetric === 'time' && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">Peak Hour Analysis</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={timeDistribution}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="hour" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="congestion"
                      stroke="#ef4444"
                      fillOpacity={1}
                      fill="url(#colorTraffic)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">Speed by Time of Day</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="hour" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="avgSpeed"
                      stroke="#22c55e"
                      strokeWidth={3}
                      dot={{ fill: '#22c55e', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </>
          )}

          {/* Vehicle Growth */}
          {selectedMetric === 'vehicles' && (
            <>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">Vehicle Growth (Millions)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={vehicleGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="year" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#888' }} />
                    <Bar dataKey="cars" fill="#6B46C1" name="Cars" />
                    <Bar dataKey="twoWheelers" fill="#003366" name="Two Wheelers" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">IT Workforce Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={techParkPieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {techParkPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </>
          )}

          {/* Emissions Chart - Clean 2-Column Design */}
          {selectedMetric === 'emissions' && (
            <>
              {/* Left Column - Main Comparison */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">
                  Daily CO₂ Emissions (tons)
                </h3>

                {/* Visual Comparison Bars */}
                <div className="space-y-6">
                  {/* Current Emissions */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Current System</span>
                      <span className="text-2xl font-bold text-red-400">15,000 tons</span>
                    </div>
                    <div className="w-full h-12 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-red-500 to-red-400 flex items-center justify-end pr-4"
                      >
                        <span className="text-white text-sm font-semibold">100%</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* With Bus System */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">With Bus System</span>
                      <span className="text-2xl font-bold text-green-400">9,500 tons</span>
                    </div>
                    <div className="w-full h-12 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '63%' }}
                        transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 flex items-center justify-end pr-4"
                      >
                        <span className="text-white text-sm font-semibold">63%</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Reduction Highlight */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-transparent rounded-2xl border border-green-500/20"
                  >
                    <div className="text-center">
                      <p className="text-5xl font-bold text-green-400 mb-2">37%</p>
                      <p className="text-lg text-gray-300">Emission Reduction</p>
                      <p className="text-sm text-gray-400 mt-2">
                        Saving <span className="font-bold text-white">5,500 tons</span> of CO₂ daily
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Column - Environmental Impact Cards */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">
                  Environmental Benefits
                </h3>

                <div className="space-y-4">
                  {/* Trees Equivalent */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">🌳</span>
                      <div>
                        <p className="text-2xl font-bold text-green-400">2.5M Trees</p>
                        <p className="text-sm text-gray-400">Annual absorption equivalent</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Clean Air Days */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">☁️</span>
                      <div>
                        <p className="text-2xl font-bold text-blue-400">+45 Days</p>
                        <p className="text-sm text-gray-400">Additional clean air days/year</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Fuel Saved */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">⛽</span>
                      <div>
                        <p className="text-2xl font-bold text-yellow-400">15M Liters</p>
                        <p className="text-sm text-gray-400">Fuel saved annually</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Health Impact */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">❤️</span>
                      <div>
                        <p className="text-2xl font-bold text-purple-400">30% Less</p>
                        <p className="text-sm text-gray-400">Respiratory issues in IT zones</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Cars Off Road */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="p-4 bg-gradient-to-r from-red-500/10 to-transparent rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">🚗</span>
                      <div>
                        <p className="text-2xl font-bold text-red-400">75,000</p>
                        <p className="text-sm text-gray-400">Cars off the road daily</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}

          {/* Route Optimization */}
          {selectedMetric === 'routes' && (
            <>
              <motion.div
                initial={{ opacity: 0, rotate: -5 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">Route Time Optimization</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#444" />
                    <PolarAngleAxis dataKey="route" stroke="#888" />
                    <PolarRadiusAxis stroke="#888" />
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
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, rotate: 5 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5 }}
                className="glass-effect rounded-3xl p-8"
              >
                <h3 className="text-2xl font-semibold mb-6 text-white">Infrastructure Projects</h3>
                <div className="space-y-4">
                  {infrastructureProjects.map((project, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-gray-800 to-transparent rounded-xl"
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
            </>
          )}
        </div>

        {/* Data Sources */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Data Sources: TomTom Traffic Index 2024, BMTC Reports, BBMP Traffic Studies, MoveInSync Analytics
          </p>
        </motion.div>
      </div>
    </section>
  );
}