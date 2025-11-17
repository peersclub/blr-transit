// Comprehensive pickup points data for Bangalore

export interface PickupPoint {
  id: string;
  name: string;
  type: 'parking-hub' | 'bus-stop' | 'metro-station' | 'home-pickup-zone';
  address: string;
  landmark: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  facilities: string[];
  parkingAvailable: boolean;
  parkingSpots?: number;
  availableSpots?: number;
  routes: string[];
  timings: {
    morning: string[];
    evening: string[];
  };
  homePickupRadius?: number; // in km
}

// Calculate distance between two points using Haversine formula
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export const pickupPoints: PickupPoint[] = [
  // HSR Layout Area
  {
    id: 'hsr-central',
    name: 'HSR Central Mall',
    type: 'parking-hub',
    address: '27th Main Rd, 1st Sector, HSR Layout',
    landmark: 'Near HSR BDA Complex',
    coordinates: { lat: 12.9081, lng: 77.6476 },
    facilities: ['Parking', 'Security', 'Waiting Area', 'Restroom'],
    parkingAvailable: true,
    parkingSpots: 150,
    availableSpots: 45,
    routes: ['hsr-ecity', 'hsr-whitefield'],
    timings: {
      morning: ['6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM'],
      evening: ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM']
    }
  },
  {
    id: 'hsr-27th-main',
    name: 'HSR 27th Main Bus Stop',
    type: 'bus-stop',
    address: '27th Main Road, HSR Layout',
    landmark: 'Near Shobha Apartment',
    coordinates: { lat: 12.9116, lng: 77.6389 },
    facilities: ['Bus Shelter', 'Seating'],
    parkingAvailable: false,
    routes: ['hsr-ecity', 'hsr-whitefield'],
    timings: {
      morning: ['6:45 AM', '7:15 AM', '7:45 AM', '8:15 AM', '8:45 AM'],
      evening: ['5:45 PM', '6:15 PM', '6:45 PM', '7:15 PM', '7:45 PM']
    }
  },
  {
    id: 'hsr-home-zone',
    name: 'HSR Layout Home Pickup Zone',
    type: 'home-pickup-zone',
    address: 'HSR Layout Sectors 1-7',
    landmark: 'Entire HSR Layout',
    coordinates: { lat: 12.9141, lng: 77.6380 },
    facilities: ['Door-to-door pickup'],
    parkingAvailable: false,
    routes: ['hsr-ecity', 'hsr-whitefield'],
    timings: {
      morning: ['6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM'],
      evening: ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM']
    },
    homePickupRadius: 3
  },

  // BTM Layout Area
  {
    id: 'btm-complex',
    name: 'BTM Complex',
    type: 'parking-hub',
    address: '16th Main Road, BTM 2nd Stage',
    landmark: 'Near Udupi Garden',
    coordinates: { lat: 12.9165, lng: 77.6101 },
    facilities: ['Parking', 'Security', 'Coffee Shop', 'Restroom'],
    parkingAvailable: true,
    parkingSpots: 100,
    availableSpots: 23,
    routes: ['btm-ecity', 'btm-whitefield'],
    timings: {
      morning: ['6:30 AM', '7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM'],
      evening: ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM']
    }
  },
  {
    id: 'silk-board',
    name: 'Silk Board Junction',
    type: 'bus-stop',
    address: 'Hosur Road, Silk Board',
    landmark: 'Under Silk Board Flyover',
    coordinates: { lat: 12.9175, lng: 77.6226 },
    facilities: ['Bus Shelter'],
    parkingAvailable: false,
    routes: ['btm-ecity', 'btm-whitefield', 'hsr-ecity'],
    timings: {
      morning: ['6:45 AM', '7:15 AM', '7:45 AM', '8:15 AM'],
      evening: ['5:45 PM', '6:15 PM', '6:45 PM', '7:15 PM']
    }
  },

  // Koramangala Area
  {
    id: 'forum-mall',
    name: 'Forum Mall Koramangala',
    type: 'parking-hub',
    address: 'Hosur Road, Koramangala',
    landmark: 'Forum Mall Main Entrance',
    coordinates: { lat: 12.9352, lng: 77.6125 },
    facilities: ['Parking', 'Security', 'Food Court', 'Restroom', 'ATM'],
    parkingAvailable: true,
    parkingSpots: 200,
    availableSpots: 67,
    routes: ['kormangala-whitefield', 'koramangala-manyata'],
    timings: {
      morning: ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM', '9:00 AM'],
      evening: ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM']
    }
  },
  {
    id: 'sony-signal',
    name: 'Sony Signal',
    type: 'parking-hub',
    address: 'Koramangala Industrial Layout',
    landmark: 'Near Sony World Junction',
    coordinates: { lat: 12.9270, lng: 77.6348 },
    facilities: ['Parking', 'Security', 'Waiting Area'],
    parkingAvailable: true,
    parkingSpots: 80,
    availableSpots: 12,
    routes: ['koramangala-whitefield', 'koramangala-orr'],
    timings: {
      morning: ['7:15 AM', '7:45 AM', '8:15 AM', '8:45 AM'],
      evening: ['5:45 PM', '6:15 PM', '6:45 PM', '7:15 PM']
    }
  },
  {
    id: 'koramangala-home',
    name: 'Koramangala Home Pickup',
    type: 'home-pickup-zone',
    address: 'Koramangala 1st-8th Block',
    landmark: 'Entire Koramangala',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    facilities: ['Door-to-door pickup', 'App tracking'],
    parkingAvailable: false,
    routes: ['koramangala-whitefield', 'koramangala-manyata', 'koramangala-orr'],
    timings: {
      morning: ['6:45 AM', '7:15 AM', '7:45 AM', '8:15 AM'],
      evening: ['5:45 PM', '6:15 PM', '6:45 PM', '7:15 PM']
    },
    homePickupRadius: 2.5
  },

  // JP Nagar Area
  {
    id: 'jp-metro',
    name: 'JP Nagar Metro Station',
    type: 'metro-station',
    address: 'Bannerghatta Main Road, JP Nagar',
    landmark: 'JP Nagar Metro Station',
    coordinates: { lat: 12.9067, lng: 77.5857 },
    facilities: ['Metro Parking', 'Security', 'Waiting Area', 'Restroom'],
    parkingAvailable: true,
    parkingSpots: 120,
    availableSpots: 34,
    routes: ['jpnagar-manyata', 'jpnagar-whitefield'],
    timings: {
      morning: ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM'],
      evening: ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM']
    }
  },
  {
    id: 'banashankari',
    name: 'Banashankari Bus Stand',
    type: 'parking-hub',
    address: 'Banashankari 2nd Stage',
    landmark: 'Near BDA Complex',
    coordinates: { lat: 12.9255, lng: 77.5468 },
    facilities: ['Parking', 'Bus Terminal', 'Food Stalls'],
    parkingAvailable: true,
    parkingSpots: 90,
    availableSpots: 28,
    routes: ['jpnagar-manyata', 'banashankari-orr'],
    timings: {
      morning: ['6:45 AM', '7:15 AM', '7:45 AM', '8:15 AM'],
      evening: ['5:45 PM', '6:15 PM', '6:45 PM', '7:15 PM']
    }
  },

  // Indiranagar Area
  {
    id: 'indiranagar-metro',
    name: 'Indiranagar Metro Station',
    type: 'metro-station',
    address: 'CMH Road, Indiranagar',
    landmark: 'Indiranagar Metro',
    coordinates: { lat: 12.9784, lng: 77.6408 },
    facilities: ['Metro Parking', 'Security', 'Shops', 'Restroom'],
    parkingAvailable: true,
    parkingSpots: 100,
    availableSpots: 21,
    routes: ['indiranagar-orr', 'indiranagar-whitefield'],
    timings: {
      morning: ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM'],
      evening: ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM']
    }
  },
  {
    id: '100ft-road',
    name: '100 Feet Road',
    type: 'bus-stop',
    address: '100 Feet Road, Indiranagar',
    landmark: 'Near KFC',
    coordinates: { lat: 12.9718, lng: 77.6405 },
    facilities: ['Bus Stop', 'Street Parking'],
    parkingAvailable: true,
    parkingSpots: 60,
    availableSpots: 8,
    routes: ['indiranagar-orr', 'indiranagar-manyata'],
    timings: {
      morning: ['7:15 AM', '7:45 AM', '8:15 AM'],
      evening: ['5:45 PM', '6:15 PM', '6:45 PM']
    }
  },

  // Marathahalli Area
  {
    id: 'marathahalli-bridge',
    name: 'Marathahalli Bridge',
    type: 'bus-stop',
    address: 'Outer Ring Road, Marathahalli',
    landmark: 'Under Marathahalli Bridge',
    coordinates: { lat: 12.9562, lng: 77.7019 },
    facilities: ['Bus Shelter', 'Auto Stand'],
    parkingAvailable: false,
    routes: ['marathahalli-manyata', 'marathahalli-ecity'],
    timings: {
      morning: ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM'],
      evening: ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM']
    }
  },
  {
    id: 'marathahalli-home',
    name: 'Marathahalli Home Pickup',
    type: 'home-pickup-zone',
    address: 'Marathahalli, Kadubeesanahalli',
    landmark: 'Marathahalli Area',
    coordinates: { lat: 12.9599, lng: 77.6998 },
    facilities: ['Door pickup', 'Bike/Car options'],
    parkingAvailable: false,
    routes: ['marathahalli-manyata', 'marathahalli-ecity', 'marathahalli-whitefield'],
    timings: {
      morning: ['7:00 AM', '7:30 AM', '8:00 AM'],
      evening: ['6:00 PM', '6:30 PM', '7:00 PM']
    },
    homePickupRadius: 2
  },

  // Bellandur Area
  {
    id: 'bellandur-lake',
    name: 'Bellandur Lake Parking',
    type: 'parking-hub',
    address: 'Bellandur Main Road',
    landmark: 'Near Bellandur Lake',
    coordinates: { lat: 12.9260, lng: 77.6762 },
    facilities: ['Parking', 'Security', 'Waiting Area'],
    parkingAvailable: true,
    parkingSpots: 80,
    availableSpots: 30,
    routes: ['bellandur-whitefield', 'bellandur-orr'],
    timings: {
      morning: ['7:15 AM', '7:45 AM', '8:15 AM'],
      evening: ['5:45 PM', '6:15 PM', '6:45 PM']
    }
  },

  // Sarjapur Road
  {
    id: 'sarjapur-main',
    name: 'Sarjapur Main Road',
    type: 'bus-stop',
    address: 'Sarjapur Main Road',
    landmark: 'Near Total Mall',
    coordinates: { lat: 12.9081, lng: 77.6850 },
    facilities: ['Bus Stop', 'Auto Stand'],
    parkingAvailable: false,
    routes: ['sarjapur-orr', 'sarjapur-whitefield'],
    timings: {
      morning: ['7:00 AM', '7:30 AM', '8:00 AM', '8:30 AM'],
      evening: ['5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM']
    }
  }
];

// Get pickup points for a specific route
export function getPickupPointsForRoute(routeId: string): PickupPoint[] {
  return pickupPoints.filter(point =>
    point.routes.some(route => route.includes(routeId.split('-')[0]) || route.includes(routeId.split('-')[1]))
  );
}

// Get nearest pickup points based on user location
export function getNearestPickupPoints(userLat: number, userLng: number, limit: number = 5): (PickupPoint & { distance: number })[] {
  const pointsWithDistance = pickupPoints.map(point => ({
    ...point,
    distance: calculateDistance(userLat, userLng, point.coordinates.lat, point.coordinates.lng)
  }));

  return pointsWithDistance
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

// Check if user is within home pickup radius
export function isInHomePickupZone(userLat: number, userLng: number): PickupPoint | null {
  const homePickupZones = pickupPoints.filter(point => point.type === 'home-pickup-zone');

  for (const zone of homePickupZones) {
    const distance = calculateDistance(userLat, userLng, zone.coordinates.lat, zone.coordinates.lng);
    if (zone.homePickupRadius && distance <= zone.homePickupRadius) {
      return zone;
    }
  }

  return null;
}

// Get available parking hubs
export function getAvailableParkingHubs(): PickupPoint[] {
  return pickupPoints.filter(point =>
    point.parkingAvailable &&
    point.availableSpots &&
    point.availableSpots > 0
  );
}

// Get pickup points by type
export function getPickupPointsByType(type: PickupPoint['type']): PickupPoint[] {
  return pickupPoints.filter(point => point.type === type);
}