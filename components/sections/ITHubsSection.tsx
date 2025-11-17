'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, Treemap, Sankey
} from 'recharts';
import {
  majorITParks, otherTechParks, demographics, salaryData,
  transportConnectivity, employeeGrowthData, trafficHeatmapData,
  aggregateStats, itHubsOverview, sustainabilityFeatures,
  futureDevelopments, officeStandards
} from '@/lib/data/itHubsData';

interface TabButtonProps {
  id: string;
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ id, label, icon, active, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
      active
        ? 'bg-gradient-to-r from-tech-purple to-bangalore-blue text-white shadow-lg'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span className="hidden md:inline">{label}</span>
  </motion.button>
);

export default function ITHubsSection() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPark, setSelectedPark] = useState(majorITParks[0]);
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);
  const [animatedNumbers, setAnimatedNumbers] = useState({
    workforce: 0,
    companies: 0,
    area: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedNumbers({
        workforce: Math.floor(aggregateStats.totalITWorkforce * progress),
        companies: Math.floor(aggregateStats.totalCompanies * progress),
        area: Math.floor(aggregateStats.totalArea * progress),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🏢' },
    { id: 'parks', label: 'Tech Parks', icon: '🏗️' },
    { id: 'companies', label: 'Companies', icon: '🏛️' },
    { id: 'workforce', label: 'Workforce', icon: '👥' },
    { id: 'salaries', label: 'Salaries', icon: '💰' },
    { id: 'transport', label: 'Transport', icon: '🚌' },
    { id: 'housing', label: 'Housing', icon: '🏠' },
    { id: 'future', label: 'Future', icon: '🚀' },
  ];

  // Custom Tooltip with glass effect
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect bg-black/80 p-3 rounded-lg shadow-xl border border-white/20">
          <p className="text-white font-semibold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-gray-300 text-sm">
              {entry.name}: <span className="font-bold text-white">
                {typeof entry.value === 'number'
                  ? entry.value.toLocaleString('en-IN')
                  : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Colors for charts
  const COLORS = ['#6B46C1', '#003366', '#0066CC', '#4B0082', '#764ba2', '#22c55e', '#ef4444', '#f59e0b'];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-effect rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">👥</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Total IT Workforce</p>
                    <p className="text-3xl font-bold text-gradient">
                      {animatedNumbers.workforce.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-tech-purple to-bangalore-blue"
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-effect rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">🏢</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Active Companies</p>
                    <p className="text-3xl font-bold text-gradient">
                      {itHubsOverview.activeCompanies.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-green-500 to-teal-400"
                  />
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="glass-effect rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">💰</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Annual IT Exports</p>
                    <p className="text-3xl font-bold text-gradient">
                      ${itHubsOverview.annualExports}B
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 2, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-yellow-500 to-orange-400"
                  />
                </div>
              </motion.div>
            </div>

            {/* Growth Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Workforce Growth by Tech Park
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={employeeGrowthData}>
                    <defs>
                      <linearGradient id="colorEC" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6B46C1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6B46C1" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorMTP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#003366" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#003366" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorWF" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0066CC" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0066CC" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="year" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="electronicCity" stackId="1" stroke="#6B46C1" fill="url(#colorEC)" />
                    <Area type="monotone" dataKey="manyata" stackId="1" stroke="#003366" fill="url(#colorMTP)" />
                    <Area type="monotone" dataKey="whitefield" stackId="1" stroke="#0066CC" fill="url(#colorWF)" />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Industry Growth Projections
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Expected Value by 2025</span>
                      <span className="text-2xl font-bold text-purple-400">
                        ${itHubsOverview.expectedValueBy2025}B
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Annual Growth Rate</span>
                      <span className="text-2xl font-bold text-green-400">
                        {itHubsOverview.annualGrowthRate}%
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">New Jobs Monthly</span>
                      <span className="text-2xl font-bold text-blue-400">
                        {itHubsOverview.newJobsMonthly.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Engineering Graduates/Year</span>
                      <span className="text-2xl font-bold text-yellow-400">
                        {itHubsOverview.engineeringGraduatesAnnually.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'parks':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Park Selector */}
            <div className="flex gap-4 flex-wrap">
              {majorITParks.map((park) => (
                <motion.button
                  key={park.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedPark(park)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    selectedPark.id === park.id
                      ? 'bg-gradient-to-r from-tech-purple to-bangalore-blue text-white'
                      : 'glass-effect text-gray-300 hover:text-white'
                  }`}
                >
                  {park.name}
                </motion.button>
              ))}
            </div>

            {/* Selected Park Details */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Park Info Card */}
                <div className="glass-effect rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-tech-purple to-bangalore-blue rounded-xl flex items-center justify-center text-2xl">
                      🏢
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{selectedPark.name}</h3>
                      <p className="text-gray-400">Established {selectedPark.established}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">Total Area</p>
                      <p className="text-xl font-bold text-white">{selectedPark.area} acres</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">Daily Workforce</p>
                      <p className="text-xl font-bold text-white">
                        {selectedPark.dailyWorkforce.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">Companies</p>
                      <p className="text-xl font-bold text-white">{selectedPark.companies}+</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-sm text-gray-400">Distance</p>
                      <p className="text-xl font-bold text-white">{selectedPark.distance} km</p>
                    </div>
                  </div>

                  {selectedPark.zones && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Zones</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedPark.zones.map((zone, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gradient-to-r from-tech-purple/20 to-bangalore-blue/20 rounded-full text-sm text-white"
                          >
                            {zone}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Major Companies */}
                <div className="glass-effect rounded-2xl p-6">
                  <h4 className="text-xl font-semibold mb-4 text-white">Major Companies</h4>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                    {selectedPark.majorCompanies.map((company, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        onHoverStart={() => setHoveredCompany(company.name)}
                        onHoverEnd={() => setHoveredCompany(null)}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-white">{company.name}</p>
                            <p className="text-sm text-gray-400">{company.focus}</p>
                          </div>
                          {hoveredCompany === company.name && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="ml-2"
                            >
                              <span className="text-xs px-2 py-1 bg-tech-purple/30 rounded-full text-white">
                                {company.employees}
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Traffic Heatmap */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">
                Traffic Congestion Heatmap (% Peak Capacity)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficHeatmapData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="electronicCity" stroke="#6B46C1" strokeWidth={2} />
                  <Line type="monotone" dataKey="manyata" stroke="#003366" strokeWidth={2} />
                  <Line type="monotone" dataKey="whitefield" stroke="#0066CC" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </motion.div>
        );

      case 'companies':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Company Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {majorITParks.flatMap(park =>
                park.majorCompanies.map((company, idx) => (
                  <motion.div
                    key={`${park.id}-${idx}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="glass-effect rounded-xl p-4 border border-white/10 hover:border-tech-purple/50 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-white">{company.name}</h4>
                      <span className="text-xs px-2 py-1 bg-bangalore-blue/30 rounded-full">
                        {park.name.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{company.focus}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">👥</span>
                      <span className="text-xs text-gray-300">{company.employees}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        );

      case 'workforce':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Demographics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Distribution */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Age Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Below 25', value: demographics.ageDistribution.below25 },
                        { name: '25-35', value: demographics.ageDistribution['25-35'] },
                        { name: 'Above 35', value: demographics.ageDistribution.above35 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${percent}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 text-center">
                  <p className="text-gray-400">Average Age</p>
                  <p className="text-2xl font-bold text-gradient">
                    {demographics.ageDistribution.averageAge} years
                  </p>
                </div>
              </motion.div>

              {/* Gender Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Gender Distribution</h3>
                <div className="space-y-4">
                  {Object.entries(demographics.genderDistribution).map(([sector, data], idx) => (
                    <div key={sector} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400 capitalize">
                          {sector.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-gray-400">
                          {data.male}% M / {data.female}% F
                        </span>
                      </div>
                      <div className="flex h-6 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.male}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className="bg-gradient-to-r from-blue-500 to-blue-400"
                        />
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${data.female}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 + 0.05 }}
                          className="bg-gradient-to-r from-pink-500 to-pink-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Additional Demographics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-xl p-4"
              >
                <p className="text-sm text-gray-400 mb-2">Male Unmarried</p>
                <p className="text-2xl font-bold text-blue-400">
                  {demographics.maritalStatus.maleUnmarried}%
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-xl p-4"
              >
                <p className="text-sm text-gray-400 mb-2">Female Unmarried</p>
                <p className="text-2xl font-bold text-pink-400">
                  {demographics.maritalStatus.femaleUnmarried}%
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-xl p-4"
              >
                <p className="text-sm text-gray-400 mb-2">Male Professional Degree</p>
                <p className="text-2xl font-bold text-green-400">
                  {demographics.education.maleProfessionalDegree}%
                </p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-effect rounded-xl p-4"
              >
                <p className="text-sm text-gray-400 mb-2">Female Professional Degree</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {demographics.education.femaleProfessionalDegree}%
                </p>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'salaries':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Salary by Company */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">
                Average Salaries by Company (₹ per annum)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salaryData.companyAverages}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="company" stroke="#888" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#888" tickFormatter={(value) => `₹${(value/100000).toFixed(1)}L`} />
                  <Tooltip
                    content={<CustomTooltip />}
                    formatter={(value: any) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Bar dataKey="average" fill="url(#salaryGradient)">
                    <defs>
                      <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.3} />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Salary by Experience */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">Salary by Experience</h3>
                <div className="space-y-3">
                  {salaryData.byExperience.map((exp, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">{exp.years} years</span>
                        <span className="text-xl font-bold text-green-400">
                          ₹{(exp.average / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(exp.average / 2000000) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-green-500 to-green-400"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Software Developer Levels
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Entry Level</p>
                    <p className="text-xl font-bold text-blue-400">
                      ₹{(salaryData.softwareDevelopers.entryLevel.min / 100000).toFixed(1)}L -
                      ₹{(salaryData.softwareDevelopers.entryLevel.max / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Mid Level</p>
                    <p className="text-xl font-bold text-purple-400">
                      ₹{(salaryData.softwareDevelopers.midLevel.min / 100000).toFixed(0)}L -
                      ₹{(salaryData.softwareDevelopers.midLevel.max / 100000).toFixed(0)}L
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Senior Level</p>
                    <p className="text-xl font-bold text-yellow-400">
                      ₹{(salaryData.softwareDevelopers.seniorLevel.min / 100000).toFixed(0)}L -
                      ₹{(salaryData.softwareDevelopers.seniorLevel.max / 100000).toFixed(1)}L
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Average</p>
                    <p className="text-2xl font-bold text-green-400">
                      ₹{(salaryData.softwareDevelopers.average / 100000).toFixed(1)}L
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        );

      case 'transport':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Metro Lines */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">Metro Connectivity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-tech-purple mb-3">Existing Lines</h4>
                  {transportConnectivity.metroLines.existing.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-3 bg-white/5 rounded-lg mb-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                        <div>
                          <p className="font-semibold text-white">{line.line}</p>
                          <p className="text-sm text-gray-400">
                            {line.station} {line.serves && `• Serves ${line.serves}`}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-bangalore-blue mb-3">
                    Upcoming 2025
                  </h4>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg"
                  >
                    <p className="font-semibold text-white">
                      {transportConnectivity.metroLines.upcoming2025.line}
                    </p>
                    <p className="text-sm text-gray-400">
                      {transportConnectivity.metroLines.upcoming2025.station}
                    </p>
                    <p className="text-xs text-yellow-400 mt-1">
                      ⚠️ {transportConnectivity.metroLines.upcoming2025.note}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Bus Routes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {Object.entries(transportConnectivity.bmtcRoutes).map(([area, data], idx) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-effect rounded-xl p-4"
                >
                  <h4 className="font-semibold text-white mb-3 capitalize">
                    {area.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  {'routes' in data && data.routes && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {data.routes.slice(0, 3).map((route, routeIdx) => (
                        <span
                          key={routeIdx}
                          className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300"
                        >
                          {route}
                        </span>
                      ))}
                      {data.routes.length > 3 && (
                        <span className="px-2 py-1 bg-gray-500/20 rounded text-xs text-gray-300">
                          +{data.routes.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  {'airport' in data && data.airport && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-400">Airport Routes</p>
                      <div className="flex gap-1 mt-1">
                        {data.airport.map((route, routeIdx) => (
                          <span
                            key={routeIdx}
                            className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-300"
                          >
                            ✈️ {route}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 'housing':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Rent Ranges by Area */}
            {majorITParks.map((park, parkIdx) => (
              <motion.div
                key={park.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: parkIdx * 0.1 }}
                className="glass-effect rounded-2xl p-6"
              >
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Near {park.name}
                </h3>

                {/* Residential Areas */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {park.residentialAreas.map((area, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gradient-to-r from-tech-purple/20 to-bangalore-blue/20 rounded-full text-sm text-white"
                    >
                      📍 {area}
                    </span>
                  ))}
                </div>

                {/* Rent Ranges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(park.rentRanges).map(([type, range], idx) => (
                    <motion.div
                      key={type}
                      whileHover={{ scale: 1.05 }}
                      className="p-4 bg-white/5 rounded-lg"
                    >
                      <p className="text-sm text-gray-400 mb-2">{type}</p>
                      <p className="text-lg font-bold text-gradient">
                        ₹{(range.min / 1000).toFixed(0)}k - ₹{(range.max / 1000).toFixed(0)}k
                      </p>
                      <div className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${((range.max - range.min) / range.max) * 100}%` }}
                          transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        );

      case 'future':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Expansion Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">Expansion Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {futureDevelopments.expansionPlans.map((plan, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-gradient-to-br from-tech-purple/20 to-bangalore-blue/20 rounded-xl"
                  >
                    <div className="text-2xl mb-2">🚀</div>
                    <h4 className="font-bold text-white mb-2">{plan.project}</h4>
                    <p className="text-sm text-gray-300">{plan.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Infrastructure Upgrades */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">
                Infrastructure Upgrades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {futureDevelopments.infrastructureUpgrades.map((upgrade, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                  >
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">{upgrade}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sustainability Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-effect rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-4 text-white">
                Green Initiatives & Smart Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-lg text-green-400 mb-3">Green Initiatives</h4>
                  {sustainabilityFeatures.greenInitiatives.map((item, idx) => (
                    <div key={idx} className="p-3 bg-green-500/10 rounded-lg mb-2">
                      <p className="text-sm font-semibold text-white">{item.park}</p>
                      <p className="text-xs text-gray-400">{item.initiative}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-lg text-blue-400 mb-3">Smart City Features</h4>
                  {sustainabilityFeatures.smartCityFeatures.map((feature, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-2 p-2 bg-blue-500/10 rounded-lg mb-2"
                    >
                      <span className="text-blue-400">→</span>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-gradient">Bangalore IT Hubs</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Comprehensive data on tech parks, companies, workforce, and infrastructure
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-2 flex-wrap justify-center mb-12 glass-effect rounded-2xl p-3">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              {...tab}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>

        {/* Data Source Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500">
            Data Sources: Government of Karnataka IT reports, Company annual reports, NASSCOM,
            KIADB, BMTC, Real estate market reports (2024-2025)
          </p>
        </motion.div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6B46C1, #003366);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #7C3AED, #0066CC);
        }
      `}</style>
    </section>
  );
}