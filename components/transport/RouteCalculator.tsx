'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Clock,
  IndianRupee,
  Car,
  Train,
  Bus,
  Bike,
  Users,
  Leaf,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import {
  generateTransportOptions,
  getRouteDistance,
  calculateMonthlyCommuteCost,
  getRecommendation,
  type TransportModeOption
} from '@/lib/data/transportationRoutes';
import { residentialAreas, itHubs } from '@/lib/data/bangaloreLocations';

type UserPreference = 'cost' | 'time' | 'comfort' | 'eco';

export default function RouteCalculator() {
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [isPeakHour, setIsPeakHour] = useState<boolean>(true);
  const [userPreference, setUserPreference] = useState<UserPreference>('cost');
  const [transportOptions, setTransportOptions] = useState<TransportModeOption[]>([]);
  const [distance, setDistance] = useState<number>(0);
  const [showResults, setShowResults] = useState<boolean>(false);

  const allLocations = [
    ...residentialAreas.map(area => ({ name: area.name, type: 'residential' as const })),
    ...itHubs.map(hub => ({ name: hub.name, type: 'it-hub' as const }))
  ].sort((a, b) => a.name.localeCompare(b.name));

  const residentialLocationNames = residentialAreas.map(area => area.name).sort();
  const itHubNames = itHubs.map(hub => hub.name).sort();

  useEffect(() => {
    if (fromLocation && toLocation && fromLocation !== toLocation) {
      const dist = getRouteDistance(fromLocation, toLocation);
      setDistance(dist);
      const options = generateTransportOptions(fromLocation, toLocation, dist, isPeakHour);
      setTransportOptions(options);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [fromLocation, toLocation, isPeakHour]);

  const getModeIcon = (type: string) => {
    switch (type) {
      case 'bus':
        return <Bus className="w-5 h-5" />;
      case 'metro':
        return <Train className="w-5 h-5" />;
      case 'cab':
        return <Car className="w-5 h-5" />;
      case 'auto':
        return <Car className="w-5 h-5" />;
      case 'bike':
        return <Bike className="w-5 h-5" />;
      case 'shuttle':
        return <Users className="w-5 h-5" />;
      case 'personal':
        return <Car className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getModeColor = (type: string) => {
    switch (type) {
      case 'bus':
        return 'bg-green-500';
      case 'metro':
        return 'bg-purple-500';
      case 'cab':
        return 'bg-yellow-500';
      case 'auto':
        return 'bg-orange-500';
      case 'bike':
        return 'bg-blue-500';
      case 'shuttle':
        return 'bg-indigo-500';
      case 'personal':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const recommendedOption = showResults
    ? getRecommendation(transportOptions, userPreference)
    : null;

  return (
    <div className="bg-gray-900 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 sm:mb-6">Route & Cost Calculator</h2>

      {/* Route Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <label className="block text-gray-400 mb-2 text-xs sm:text-sm">From (Residential)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 sm:w-5 h-4 sm:h-5" />
            <select
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:border-tech-purple focus:outline-none"
            >
              <option value="">Select starting location</option>
              <optgroup label="Residential Areas">
                {residentialLocationNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-400 mb-2 text-xs sm:text-sm">To (IT Hub)</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 sm:w-5 h-4 sm:h-5" />
            <select
              value={toLocation}
              onChange={(e) => setToLocation(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base text-white focus:border-tech-purple focus:outline-none"
            >
              <option value="">Select destination</option>
              <optgroup label="IT Hubs">
                {itHubNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-3 sm:mb-4">
          <label className="flex items-center gap-2 text-sm sm:text-base text-white">
            <input
              type="checkbox"
              checked={isPeakHour}
              onChange={(e) => setIsPeakHour(e.target.checked)}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-tech-purple focus:ring-tech-purple"
            />
            <span>Peak Hour (8-10 AM, 6-8 PM)</span>
          </label>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {(['cost', 'time', 'comfort', 'eco'] as UserPreference[]).map(pref => (
            <button
              key={pref}
              onClick={() => setUserPreference(pref)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                userPreference === pref
                  ? 'bg-tech-purple text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {pref === 'cost' && '💰 Lowest Cost'}
              {pref === 'time' && '⚡ Fastest'}
              {pref === 'comfort' && '🛋️ Most Comfortable'}
              {pref === 'eco' && '🌱 Eco-Friendly'}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Route Info */}
          <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                <div className="flex items-center gap-2">
                  <MapPin className="text-tech-purple w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base text-white font-medium">{fromLocation}</span>
                </div>
                <span className="text-gray-500 hidden sm:inline">→</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 sm:hidden ml-6">↓</span>
                  <span className="text-sm sm:text-base text-white font-medium">{toLocation}</span>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-gray-400 text-xs sm:text-sm">Distance</span>
                <p className="text-white font-bold text-lg sm:text-xl">{distance} km</p>
              </div>
            </div>
          </div>

          {/* Recommended Option */}
          {recommendedOption && (
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="text-tech-purple" />
                Recommended based on your preference ({userPreference})
              </h3>
              <div className="bg-gradient-to-r from-tech-purple/20 to-bangalore-blue/20 border border-tech-purple rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getModeColor(recommendedOption.mode.type)} text-white`}>
                      {getModeIcon(recommendedOption.mode.type)}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{recommendedOption.mode.name}</h4>
                      <p className="text-gray-400 text-sm mt-1">{recommendedOption.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-xl">₹{recommendedOption.cost}</p>
                    <p className="text-gray-400 text-sm">{formatTime(recommendedOption.time)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Transport Options */}
          <h3 className="text-white font-semibold mb-3">All Transport Options</h3>
          <div className="grid gap-3">
            {transportOptions.map((option, index) => {
              const isRecommended = recommendedOption &&
                option.mode.name === recommendedOption.mode.name;
              const monthlyTotal = option.mode.type === 'shuttle'
                ? option.mode.baseFare
                : calculateMonthlyCommuteCost(option.cost);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gray-800 rounded-xl p-4 border ${
                    isRecommended ? 'border-tech-purple' : 'border-gray-700'
                  } hover:border-gray-600 transition-colors`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getModeColor(option.mode.type)} text-white`}>
                        {getModeIcon(option.mode.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white font-semibold">{option.mode.name}</h4>
                          {isRecommended && (
                            <span className="px-2 py-0.5 bg-tech-purple text-white text-xs rounded-full">
                              Best for {userPreference}
                            </span>
                          )}
                        </div>

                        {/* Mode characteristics */}
                        <div className="flex gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500 text-xs">Comfort:</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                    i < option.mode.comfort ? 'bg-yellow-500' : 'bg-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Leaf className="w-3 h-3 text-green-500" />
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1.5 h-1.5 rounded-full mx-0.5 ${
                                    i < option.mode.environmental ? 'bg-green-500' : 'bg-gray-700'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {option.notes && (
                          <p className="text-gray-400 text-sm mt-2 flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            {option.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <IndianRupee className="w-4 h-4 text-gray-400" />
                        <p className="text-white font-bold text-xl">{option.cost}</p>
                      </div>
                      <div className="flex items-center gap-2 justify-end mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <p className="text-gray-400 text-sm">{formatTime(option.time)}</p>
                      </div>
                      <p className="text-gray-500 text-xs mt-2">
                        Monthly: ₹{monthlyTotal.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Additional info for transfers */}
                  {option.transfers && option.transfers > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-gray-400 text-xs">
                        {option.transfers} transfer{option.transfers > 1 ? 's' : ''} required
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Summary Stats */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-4">
            <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Cheapest</p>
              <p className="text-white font-bold text-sm sm:text-xl">
                ₹{Math.min(...transportOptions.map(o => o.cost))}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {transportOptions.find(o => o.cost === Math.min(...transportOptions.map(opt => opt.cost)))?.mode.name}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Fastest</p>
              <p className="text-white font-bold text-sm sm:text-xl">
                {formatTime(Math.min(...transportOptions.map(o => o.time)))}
              </p>
              <p className="text-gray-500 text-xs mt-1 hidden sm:block">
                {transportOptions.find(o => o.time === Math.min(...transportOptions.map(opt => opt.time)))?.mode.name}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center">
              <p className="text-gray-400 text-xs sm:text-sm mb-1">Eco-Friendly</p>
              <p className="text-green-400 font-bold text-sm sm:text-xl">
                {transportOptions.find(o => o.mode.environmental === Math.max(...transportOptions.map(opt => opt.mode.environmental)))?.mode.name}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                <Leaf className="w-3 h-3 inline mr-1" />
                Lowest emissions
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}