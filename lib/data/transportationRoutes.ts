// Comprehensive Transportation Routes and Pricing Data for Bangalore

export interface TransportMode {
  type: 'bus' | 'metro' | 'cab' | 'auto' | 'shuttle' | 'bike' | 'personal';
  name: string;
  baseFare: number;
  perKmRate?: number;
  surgeMultiplier?: number;
  minFare?: number;
  maxFare?: number;
  avgSpeed: number; // km/h during peak hours
  comfort: number; // 1-5 rating
  availability: number; // 1-5 rating
  environmental: number; // 1-5 rating (5 being most eco-friendly)
}

export interface RouteOption {
  from: string;
  to: string;
  distance: number; // km
  modes: TransportModeOption[];
}

export interface TransportModeOption {
  mode: TransportMode;
  cost: number;
  time: number; // minutes
  transfers?: number;
  route?: string[];
  peakHourTime?: number;
  offPeakTime?: number;
  notes?: string;
}

// Transport modes with Bangalore-specific data
export const transportModes: Record<string, TransportMode> = {
  bmtcOrdinary: {
    type: 'bus',
    name: 'BMTC Ordinary',
    baseFare: 5,
    perKmRate: 1.33,
    maxFare: 22,
    avgSpeed: 12,
    comfort: 2,
    availability: 4,
    environmental: 4
  },
  bmtcAC: {
    type: 'bus',
    name: 'BMTC Volvo AC',
    baseFare: 15,
    perKmRate: 1.67,
    maxFare: 60,
    avgSpeed: 15,
    comfort: 4,
    availability: 3,
    environmental: 3
  },
  metro: {
    type: 'metro',
    name: 'Namma Metro',
    baseFare: 10,
    perKmRate: 2,
    maxFare: 60,
    avgSpeed: 35,
    comfort: 5,
    availability: 4,
    environmental: 5
  },
  olaMini: {
    type: 'cab',
    name: 'Ola Mini',
    baseFare: 30,
    perKmRate: 9,
    minFare: 60,
    avgSpeed: 18,
    comfort: 3,
    availability: 5,
    environmental: 2
  },
  olaPrime: {
    type: 'cab',
    name: 'Ola Prime',
    baseFare: 60,
    perKmRate: 14,
    minFare: 100,
    avgSpeed: 20,
    comfort: 4,
    availability: 5,
    environmental: 2
  },
  uberGo: {
    type: 'cab',
    name: 'Uber Go',
    baseFare: 32,
    perKmRate: 9.5,
    minFare: 65,
    avgSpeed: 18,
    comfort: 3,
    availability: 5,
    environmental: 2
  },
  uberPremier: {
    type: 'cab',
    name: 'Uber Premier',
    baseFare: 55,
    perKmRate: 15,
    minFare: 100,
    avgSpeed: 20,
    comfort: 4,
    availability: 5,
    environmental: 2
  },
  auto: {
    type: 'auto',
    name: 'Auto Rickshaw',
    baseFare: 30,
    perKmRate: 15,
    minFare: 30,
    avgSpeed: 15,
    comfort: 2,
    availability: 5,
    environmental: 3
  },
  rapido: {
    type: 'bike',
    name: 'Rapido Bike',
    baseFare: 15,
    perKmRate: 5,
    minFare: 25,
    avgSpeed: 25,
    comfort: 2,
    availability: 4,
    environmental: 3
  },
  companyShuttle: {
    type: 'shuttle',
    name: 'Company Shuttle',
    baseFare: 2500, // Monthly
    avgSpeed: 20,
    comfort: 4,
    availability: 3,
    environmental: 4
  },
  personal: {
    type: 'personal',
    name: 'Personal Vehicle',
    perKmRate: 8, // Fuel + maintenance
    avgSpeed: 17,
    comfort: 5,
    availability: 5,
    environmental: 1
  }
};

// Calculate transport cost based on distance and mode
export function calculateTransportCost(
  distance: number,
  mode: TransportMode,
  isPeakHour: boolean = true,
  isMonthly: boolean = false
): number {
  if (mode.type === 'shuttle' && isMonthly) {
    return mode.baseFare;
  }

  let cost = mode.baseFare || 0;

  if (mode.perKmRate) {
    cost += distance * mode.perKmRate;
  }

  // Apply surge pricing for cabs during peak hours
  if (mode.type === 'cab' && isPeakHour) {
    cost *= mode.surgeMultiplier || 1.5;
  }

  // Apply minimum and maximum fares
  if (mode.minFare) {
    cost = Math.max(cost, mode.minFare);
  }
  if (mode.maxFare) {
    cost = Math.min(cost, mode.maxFare);
  }

  return Math.round(cost);
}

// Calculate travel time based on distance and mode
export function calculateTravelTime(
  distance: number,
  mode: TransportMode,
  isPeakHour: boolean = true
): number {
  const speed = isPeakHour ? mode.avgSpeed * 0.8 : mode.avgSpeed;
  const baseTime = (distance / speed) * 60; // Convert to minutes

  // Add waiting/boarding time based on mode
  let additionalTime = 0;
  switch (mode.type) {
    case 'bus':
      additionalTime = 10; // Average waiting time
      break;
    case 'metro':
      additionalTime = 5; // Station access + waiting
      break;
    case 'cab':
      additionalTime = isPeakHour ? 8 : 5; // Booking + arrival time
      break;
    case 'auto':
      additionalTime = 5; // Negotiation + boarding
      break;
    case 'bike':
      additionalTime = 3; // Quick pickup
      break;
    case 'shuttle':
      additionalTime = 15; // Multiple pickups
      break;
    case 'personal':
      additionalTime = 5; // Parking time
      break;
  }

  return Math.round(baseTime + additionalTime);
}

// Pre-defined routes with actual Bangalore data
export const popularRoutes: RouteOption[] = [
  {
    from: 'HSR Layout',
    to: 'Electronic City',
    distance: 12,
    modes: []
  },
  {
    from: 'Whitefield',
    to: 'Manyata Tech Park',
    distance: 25,
    modes: []
  },
  {
    from: 'Koramangala',
    to: 'Whitefield',
    distance: 18,
    modes: []
  },
  {
    from: 'JP Nagar',
    to: 'Outer Ring Road',
    distance: 8,
    modes: []
  },
  {
    from: 'Indiranagar',
    to: 'Electronic City',
    distance: 20,
    modes: []
  },
  {
    from: 'Marathahalli',
    to: 'Manyata Tech Park',
    distance: 19,
    modes: []
  },
  {
    from: 'BTM Layout',
    to: 'Whitefield',
    distance: 17,
    modes: []
  },
  {
    from: 'Jayanagar',
    to: 'Electronic City',
    distance: 14,
    modes: []
  },
  {
    from: 'Sarjapur Road',
    to: 'Outer Ring Road',
    distance: 10,
    modes: []
  },
  {
    from: 'Bellandur',
    to: 'Manyata Tech Park',
    distance: 22,
    modes: []
  }
];

// Generate transport options for a route
export function generateTransportOptions(
  from: string,
  to: string,
  distance: number,
  isPeakHour: boolean = true
): TransportModeOption[] {
  const options: TransportModeOption[] = [];

  // BMTC Bus options
  options.push({
    mode: transportModes.bmtcOrdinary,
    cost: calculateTransportCost(distance, transportModes.bmtcOrdinary, isPeakHour),
    time: calculateTravelTime(distance, transportModes.bmtcOrdinary, isPeakHour),
    transfers: distance > 15 ? 1 : 0,
    notes: 'Most economical, frequent service'
  });

  options.push({
    mode: transportModes.bmtcAC,
    cost: calculateTransportCost(distance, transportModes.bmtcAC, isPeakHour),
    time: calculateTravelTime(distance, transportModes.bmtcAC, isPeakHour),
    transfers: 0,
    notes: 'Comfortable, direct routes to IT hubs'
  });

  // Metro (only for routes with connectivity)
  const metroRoutes = ['Electronic City', 'Whitefield', 'JP Nagar', 'Jayanagar', 'Indiranagar'];
  if (metroRoutes.some(location => from.includes(location) || to.includes(location))) {
    options.push({
      mode: transportModes.metro,
      cost: calculateTransportCost(distance * 0.7, transportModes.metro, isPeakHour), // Metro routes are more direct
      time: calculateTravelTime(distance * 0.7, transportModes.metro, isPeakHour),
      transfers: 1,
      notes: 'Fastest during peak hours, requires last-mile connectivity'
    });
  }

  // Cab options
  options.push({
    mode: transportModes.olaMini,
    cost: calculateTransportCost(distance, transportModes.olaMini, isPeakHour),
    time: calculateTravelTime(distance, transportModes.olaMini, isPeakHour),
    transfers: 0,
    notes: isPeakHour ? 'Surge pricing active (1.5x)' : 'Regular pricing'
  });

  options.push({
    mode: transportModes.uberPremier,
    cost: calculateTransportCost(distance, transportModes.uberPremier, isPeakHour),
    time: calculateTravelTime(distance, transportModes.uberPremier, isPeakHour),
    transfers: 0,
    notes: 'Premium comfort, faster routes'
  });

  // Auto rickshaw
  options.push({
    mode: transportModes.auto,
    cost: calculateTransportCost(distance, transportModes.auto, isPeakHour),
    time: calculateTravelTime(distance, transportModes.auto, isPeakHour),
    transfers: 0,
    notes: distance > 12 ? 'May refuse long distances' : 'Quick for short distances'
  });

  // Bike taxi (for shorter distances)
  if (distance <= 15) {
    options.push({
      mode: transportModes.rapido,
      cost: calculateTransportCost(distance, transportModes.rapido, isPeakHour),
      time: calculateTravelTime(distance, transportModes.rapido, isPeakHour),
      transfers: 0,
      notes: 'Fastest in traffic, not for everyone'
    });
  }

  // Company shuttle (monthly option)
  options.push({
    mode: transportModes.companyShuttle,
    cost: transportModes.companyShuttle.baseFare / 22, // Per day cost
    time: calculateTravelTime(distance * 1.3, transportModes.companyShuttle, isPeakHour), // Accounts for multiple pickups
    transfers: 0,
    notes: `Monthly: ₹${transportModes.companyShuttle.baseFare}`
  });

  // Personal vehicle
  options.push({
    mode: transportModes.personal,
    cost: calculateTransportCost(distance, transportModes.personal, isPeakHour) + 50, // Add parking cost
    time: calculateTravelTime(distance, transportModes.personal, isPeakHour),
    transfers: 0,
    notes: 'Includes fuel, parking (₹50), excludes EMI/maintenance'
  });

  return options.sort((a, b) => a.cost - b.cost);
}

// Get route distance between two locations
export function getRouteDistance(from: string, to: string): number {
  // This would ideally use a real routing API
  // For now, using pre-calculated distances
  const route = popularRoutes.find(
    r => (r.from === from && r.to === to) || (r.from === to && r.to === from)
  );

  if (route) {
    return route.distance;
  }

  // Default calculation based on approximate coordinates
  // This is a simplified calculation for demo purposes
  const distances: Record<string, Record<string, number>> = {
    'HSR Layout': {
      'Electronic City': 12,
      'Whitefield': 20,
      'Manyata Tech Park': 24,
      'Outer Ring Road': 8,
      'Koramangala': 4
    },
    'Koramangala': {
      'Electronic City': 15,
      'Whitefield': 18,
      'Manyata Tech Park': 22,
      'Outer Ring Road': 6,
      'HSR Layout': 4
    },
    'Marathahalli': {
      'Electronic City': 18,
      'Whitefield': 8,
      'Manyata Tech Park': 19,
      'Outer Ring Road': 3,
      'Koramangala': 6
    },
    'Indiranagar': {
      'Electronic City': 20,
      'Whitefield': 15,
      'Manyata Tech Park': 18,
      'Outer Ring Road': 10,
      'Koramangala': 6
    },
    'JP Nagar': {
      'Electronic City': 10,
      'Whitefield': 25,
      'Manyata Tech Park': 28,
      'Outer Ring Road': 8,
      'Koramangala': 8
    },
    'BTM Layout': {
      'Electronic City': 14,
      'Whitefield': 17,
      'Manyata Tech Park': 23,
      'Outer Ring Road': 7,
      'Koramangala': 3
    },
    'Jayanagar': {
      'Electronic City': 14,
      'Whitefield': 22,
      'Manyata Tech Park': 26,
      'Outer Ring Road': 10,
      'Koramangala': 5
    },
    'Bellandur': {
      'Electronic City': 15,
      'Whitefield': 10,
      'Manyata Tech Park': 22,
      'Outer Ring Road': 4,
      'Koramangala': 5
    },
    'Sarjapur Road': {
      'Electronic City': 8,
      'Whitefield': 12,
      'Manyata Tech Park': 25,
      'Outer Ring Road': 10,
      'Koramangala': 7
    }
  };

  if (distances[from] && distances[from][to]) {
    return distances[from][to];
  }
  if (distances[to] && distances[to][from]) {
    return distances[to][from];
  }

  // Default fallback distance
  return 15;
}

// Calculate monthly commute cost
export function calculateMonthlyCommuteCost(
  dailyCost: number,
  workingDays: number = 22
): number {
  return dailyCost * workingDays * 2; // Round trip
}

// Get recommendation based on user preferences
export function getRecommendation(
  options: TransportModeOption[],
  preference: 'cost' | 'time' | 'comfort' | 'eco'
): TransportModeOption {
  let sorted = [...options];

  switch (preference) {
    case 'cost':
      sorted.sort((a, b) => a.cost - b.cost);
      break;
    case 'time':
      sorted.sort((a, b) => a.time - b.time);
      break;
    case 'comfort':
      sorted.sort((a, b) => b.mode.comfort - a.mode.comfort);
      break;
    case 'eco':
      sorted.sort((a, b) => b.mode.environmental - a.mode.environmental);
      break;
  }

  return sorted[0];
}