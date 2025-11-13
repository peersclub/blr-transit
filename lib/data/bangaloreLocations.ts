// Comprehensive Bangalore Location Data with Residential Areas and IT Hubs

export interface Location {
  name: string;
  type: 'residential' | 'it-hub' | 'mixed';
  coordinates: { lat: number; lng: number };
  population?: number;
  employees?: number;
  density?: number; // people per sq km
  avgRent?: number; // in INR
  // Additional residential data
  vehicles?: number;
  apartments?: number;
  professionCategories?: {
    IT: number;
    Finance: number;
    Healthcare: number;
    Manufacturing: number;
    Others: number;
  };
  // Additional IT hub data
  majorCompanies?: string[];
  biggestEmployer?: { name: string; employees: number };
  servicesUsed?: {
    name: string;
    users: number;
    type: 'shuttle' | 'carpool' | 'food' | 'other';
  }[];
  parkingSpaces?: number;
  busRoutes?: number;
}

export interface CommuterFlow {
  from: string;
  to: string;
  dailyCommuters: number;
  avgTravelTime: number; // in minutes
  distance: number; // in km
  congestionLevel: 'low' | 'medium' | 'high' | 'severe';
}

// Major Residential Areas in Bangalore
export const residentialAreas: Location[] = [
  // South Bangalore
  {
    name: 'Jayanagar',
    type: 'residential',
    coordinates: { lat: 12.9250, lng: 77.5938 },
    population: 180000,
    density: 12500,
    avgRent: 25000,
    vehicles: 85000,
    apartments: 42000,
    professionCategories: {
      IT: 35,
      Finance: 20,
      Healthcare: 15,
      Manufacturing: 10,
      Others: 20,
    },
  },
  {
    name: 'BTM Layout',
    type: 'residential',
    coordinates: { lat: 12.9165, lng: 77.6101 },
    population: 150000,
    density: 14000,
    avgRent: 22000,
    vehicles: 72000,
    apartments: 35000,
    professionCategories: {
      IT: 55,
      Finance: 15,
      Healthcare: 10,
      Manufacturing: 5,
      Others: 15,
    },
  },
  {
    name: 'HSR Layout',
    type: 'residential',
    coordinates: { lat: 12.9081, lng: 77.6476 },
    population: 120000,
    density: 13500,
    avgRent: 28000,
    vehicles: 68000,
    apartments: 28000,
    professionCategories: {
      IT: 65,
      Finance: 12,
      Healthcare: 8,
      Manufacturing: 3,
      Others: 12,
    },
  },
  {
    name: 'Koramangala',
    type: 'mixed',
    coordinates: { lat: 12.9352, lng: 77.6245 },
    population: 140000,
    density: 15000,
    avgRent: 35000,
  },
  {
    name: 'Banashankari',
    type: 'residential',
    coordinates: { lat: 12.9255, lng: 77.5468 },
    population: 165000,
    density: 11000,
    avgRent: 20000,
  },
  {
    name: 'JP Nagar',
    type: 'residential',
    coordinates: { lat: 12.9100, lng: 77.5850 },
    population: 110000,
    density: 10500,
    avgRent: 24000,
  },

  // East Bangalore
  {
    name: 'Indiranagar',
    type: 'mixed',
    coordinates: { lat: 12.9716, lng: 77.6412 },
    population: 95000,
    density: 11500,
    avgRent: 40000,
  },
  {
    name: 'Marathahalli',
    type: 'mixed',
    coordinates: { lat: 12.9562, lng: 77.7019 },
    population: 185000,
    density: 16000,
    avgRent: 26000,
  },
  {
    name: 'Bellandur',
    type: 'mixed',
    coordinates: { lat: 12.9250, lng: 77.6762 },
    population: 170000,
    density: 14500,
    avgRent: 30000,
  },
  {
    name: 'Sarjapur Road',
    type: 'mixed',
    coordinates: { lat: 12.9010, lng: 77.6850 },
    population: 135000,
    density: 12000,
    avgRent: 32000,
  },
  {
    name: 'Brookefield',
    type: 'residential',
    coordinates: { lat: 12.9698, lng: 77.7197 },
    population: 75000,
    density: 10000,
    avgRent: 28000,
  },
  {
    name: 'Kundalahalli',
    type: 'residential',
    coordinates: { lat: 12.9698, lng: 77.7156 },
    population: 65000,
    density: 11000,
    avgRent: 25000,
  },

  // North Bangalore
  {
    name: 'Hebbal',
    type: 'mixed',
    coordinates: { lat: 13.0358, lng: 77.5970 },
    population: 125000,
    density: 9500,
    avgRent: 26000,
  },
  {
    name: 'Yelahanka',
    type: 'residential',
    coordinates: { lat: 13.1007, lng: 77.5963 },
    population: 115000,
    density: 7500,
    avgRent: 18000,
  },
  {
    name: 'Thanisandra',
    type: 'residential',
    coordinates: { lat: 13.0580, lng: 77.6200 },
    population: 85000,
    density: 9000,
    avgRent: 22000,
  },
  {
    name: 'Hennur',
    type: 'residential',
    coordinates: { lat: 13.0295, lng: 77.6337 },
    population: 70000,
    density: 8500,
    avgRent: 19000,
  },
  {
    name: 'RT Nagar',
    type: 'residential',
    coordinates: { lat: 13.0195, lng: 77.5968 },
    population: 90000,
    density: 10000,
    avgRent: 21000,
  },

  // West Bangalore
  {
    name: 'Malleshwaram',
    type: 'residential',
    coordinates: { lat: 13.0120, lng: 77.5710 },
    population: 105000,
    density: 12000,
    avgRent: 27000,
  },
  {
    name: 'Rajajinagar',
    type: 'residential',
    coordinates: { lat: 12.9925, lng: 77.5530 },
    population: 115000,
    density: 11500,
    avgRent: 23000,
  },
  {
    name: 'Basaveshwaranagar',
    type: 'residential',
    coordinates: { lat: 12.9940, lng: 77.5390 },
    population: 95000,
    density: 10500,
    avgRent: 20000,
  },
  {
    name: 'Vijayanagar',
    type: 'residential',
    coordinates: { lat: 12.9706, lng: 77.5362 },
    population: 130000,
    density: 13000,
    avgRent: 19000,
  },
];

// IT Hubs and Tech Parks (Updated 2024-2025 Research Data)
export const itHubs: Location[] = [
  {
    name: 'Outer Ring Road',
    type: 'it-hub',
    coordinates: { lat: 12.9536, lng: 77.6396 },
    employees: 640000,  // 640,000 daily corridor commuters (32% of IT revenue)
    density: 25000,
    majorCompanies: ['Microsoft', 'Amazon', 'Google', 'Intel', 'SAP', 'Adobe', 'Samsung', 'VMware', 'Cisco', 'JP Morgan'],
    biggestEmployer: { name: 'Amazon', employees: 45000 },
    servicesUsed: [
      { name: 'MoveInSync', users: 180000, type: 'shuttle' },
      { name: 'Ola Corporate', users: 85000, type: 'shuttle' },
      { name: 'Uber for Business', users: 65000, type: 'shuttle' },
      { name: 'BMTC Vajra', users: 120000, type: 'shuttle' },
      { name: 'Quick Ride', users: 45000, type: 'carpool' },
    ],
    parkingSpaces: 85000,
    busRoutes: 156,
  },
  {
    name: 'Manyata Tech Park',
    type: 'it-hub',
    coordinates: { lat: 13.0452, lng: 77.6201 },
    employees: 150000,  // 150,000+ professionals (largest single campus)
    density: 20000,
    majorCompanies: ['IBM', 'Cognizant', 'Nokia', 'Philips', 'Fidelity', 'L&T Infotech', 'Cerner', 'Concentrix'],
    biggestEmployer: { name: 'Cognizant', employees: 35000 },
    servicesUsed: [
      { name: 'MoveInSync', users: 45000, type: 'shuttle' },
      { name: 'Scoop Carpool', users: 8000, type: 'carpool' },
      { name: 'Ola Corporate', users: 15000, type: 'shuttle' },
      { name: 'BMTC Special Services', users: 25000, type: 'shuttle' },
      { name: 'Food Courts (3)', users: 120000, type: 'food' },
    ],
    parkingSpaces: 12000,
    busRoutes: 42,
  },
  {
    name: 'Electronic City',
    type: 'it-hub',
    coordinates: { lat: 12.8456, lng: 77.6603 },
    employees: 100000,  // 100,000 daily workers across 200 companies
    density: 18000,
    majorCompanies: ['Infosys', 'Wipro', 'HCL', 'Biocon', 'HP', 'Siemens', 'Continental', 'Bosch'],
    biggestEmployer: { name: 'Infosys', employees: 25000 },
    servicesUsed: [
      { name: 'MoveInSync', users: 35000, type: 'shuttle' },
      { name: 'Company Buses', users: 28000, type: 'shuttle' },
      { name: 'BMTC Volvo', users: 15000, type: 'shuttle' },
      { name: 'Ola Share', users: 8000, type: 'carpool' },
      { name: 'Food Courts (5)', users: 85000, type: 'food' },
    ],
    parkingSpaces: 18000,
    busRoutes: 68,
  },
  {
    name: 'Whitefield',
    type: 'it-hub',
    coordinates: { lat: 12.9698, lng: 77.7500 },
    employees: 80000,  // Across ITPB, Bagmane and 16+ tech parks
    density: 16500,
    majorCompanies: ['Accenture', 'Capgemini', 'GE', 'Huawei', 'Qualcomm', 'ARM', 'NetApp', 'Schneider Electric'],
    biggestEmployer: { name: 'Accenture', employees: 12000 },
    servicesUsed: [
      { name: 'MoveInSync', users: 25000, type: 'shuttle' },
      { name: 'Zipgo', users: 8000, type: 'shuttle' },
      { name: 'BMTC AC Buses', users: 12000, type: 'shuttle' },
      { name: 'Shuttl', users: 6000, type: 'shuttle' },
      { name: 'Forum Mall', users: 65000, type: 'food' },
    ],
    parkingSpaces: 15000,
    busRoutes: 52,
  },
  {
    name: 'Bagmane Tech Park',
    type: 'it-hub',
    coordinates: { lat: 12.9793, lng: 77.6951 },
    employees: 45000,  // HP, Oracle, Boeing, Volvo, Dell, Cisco
    density: 14000,
    majorCompanies: ['HP', 'Oracle', 'Boeing', 'Volvo', 'Dell', 'Cisco', 'EY', 'Texas Instruments'],
    biggestEmployer: { name: 'HP', employees: 9000 },
    servicesUsed: [
      { name: 'MoveInSync', users: 15000, type: 'shuttle' },
      { name: 'Company Shuttles', users: 12000, type: 'shuttle' },
      { name: 'BMTC Services', users: 8000, type: 'shuttle' },
      { name: 'Quick Ride', users: 3000, type: 'carpool' },
      { name: 'Food Court', users: 38000, type: 'food' },
    ],
    parkingSpaces: 7500,
    busRoutes: 28,
  },
  {
    name: 'Embassy Tech Village',
    type: 'it-hub',
    coordinates: { lat: 12.9856, lng: 77.6646 },
    employees: 40000,  // KPMG, Cisco, Sony, Xiaomi on 80-84 acres
    density: 15500,
    majorCompanies: ['KPMG', 'Cisco', 'Sony', 'Xiaomi', 'Morgan Stanley', 'ANZ', 'Convergys', 'CGI'],
    biggestEmployer: { name: 'Cisco', employees: 8000 },
    servicesUsed: [
      { name: 'MoveInSync', users: 13000, type: 'shuttle' },
      { name: 'Ola Corporate', users: 7000, type: 'shuttle' },
      { name: 'BMTC Vajra', users: 5500, type: 'shuttle' },
      { name: 'Scoop', users: 2500, type: 'carpool' },
      { name: 'ETV Food Courts', users: 35000, type: 'food' },
    ],
    parkingSpaces: 6500,
    busRoutes: 24,
  },
  {
    name: 'ITPB (International Tech Park)',
    type: 'it-hub',
    coordinates: { lat: 12.9577, lng: 77.7356 },
    employees: 35000,  // Oracle, TCS, Vodafone, General Motors
    density: 13500,
    majorCompanies: ['Oracle', 'TCS', 'Vodafone', 'General Motors', 'Mu Sigma', 'Societe Generale', 'Avaya'],
    biggestEmployer: { name: 'TCS', employees: 8500 },
    servicesUsed: [
      { name: 'MoveInSync', users: 12000, type: 'shuttle' },
      { name: 'Quick Ride', users: 3500, type: 'carpool' },
      { name: 'BMTC Volvo', users: 5000, type: 'shuttle' },
      { name: 'Company Cabs', users: 8000, type: 'shuttle' },
      { name: 'Food Court', users: 28000, type: 'food' },
    ],
    parkingSpaces: 4500,
    busRoutes: 18,
  },
  {
    name: 'RMZ Ecospace',
    type: 'it-hub',
    coordinates: { lat: 12.9215, lng: 77.6873 },
    employees: 16000,  // Intel, SAP, Capgemini, KPMG on 25 acres
    density: 14500,
    majorCompanies: ['Intel', 'SAP', 'Capgemini', 'KPMG', 'Wells Fargo', 'Ericsson', 'Nokia Networks'],
    biggestEmployer: { name: 'Intel', employees: 4500 },
    servicesUsed: [
      { name: 'MoveInSync', users: 5500, type: 'shuttle' },
      { name: 'Company Buses', users: 4000, type: 'shuttle' },
      { name: 'BMTC Volvo', users: 2500, type: 'shuttle' },
      { name: 'Uber Pool', users: 1500, type: 'carpool' },
      { name: 'Food Courts (2)', users: 14000, type: 'food' },
    ],
    parkingSpaces: 3200,
    busRoutes: 15,
  },
  {
    name: 'Prestige Tech Park',
    type: 'it-hub',
    coordinates: { lat: 12.9362, lng: 77.6910 },
    employees: 40000,
    density: 13000,
    majorCompanies: ['JP Morgan Chase', 'Citi', 'UBS', 'Tesco', 'Honeywell', 'Deloitte', 'PwC', 'Barclays'],
    biggestEmployer: { name: 'JP Morgan Chase', employees: 10000 },
    servicesUsed: [
      { name: 'MoveInSync', users: 14000, type: 'shuttle' },
      { name: 'Corporate Shuttles', users: 8000, type: 'shuttle' },
      { name: 'BMTC Special', users: 6000, type: 'shuttle' },
      { name: 'Carpooling', users: 3500, type: 'carpool' },
      { name: 'Food Courts & Cafes', users: 34000, type: 'food' },
    ],
    parkingSpaces: 6800,
    busRoutes: 32,
  },
  {
    name: 'Cessna Business Park',
    type: 'it-hub',
    coordinates: { lat: 12.9365, lng: 77.6958 },
    employees: 30000,  // Cisco, Walmart, TCS, Goldman Sachs - 3M sq ft
    density: 14000,
    majorCompanies: ['Cisco', 'Walmart Labs', 'TCS', 'Goldman Sachs', 'LinkedIn', 'Novartis', 'Applied Materials'],
    biggestEmployer: { name: 'Walmart Labs', employees: 7000 },
    servicesUsed: [
      { name: 'MoveInSync', users: 10000, type: 'shuttle' },
      { name: 'Ola for Business', users: 5000, type: 'shuttle' },
      { name: 'BMTC AC', users: 4500, type: 'shuttle' },
      { name: 'Quick Ride', users: 2000, type: 'carpool' },
      { name: 'Cessna Food Court', users: 26000, type: 'food' },
    ],
    parkingSpaces: 5000,
    busRoutes: 22,
  },
  {
    name: 'ITPL (International Tech Park)',
    type: 'it-hub',
    coordinates: { lat: 12.9854, lng: 77.7363 },
    employees: 85000,
    density: 16000,
    majorCompanies: ['Mindtree', 'L&T Technology', 'Infineon', 'NTT Data', 'Mphasis', 'iGate', 'Samsung R&D', 'LG Soft'],
    biggestEmployer: { name: 'Mindtree', employees: 15000 },
    servicesUsed: [
      { name: 'MoveInSync', users: 28000, type: 'shuttle' },
      { name: 'Corporate Transport', users: 18000, type: 'shuttle' },
      { name: 'BMTC Vajra', users: 10000, type: 'shuttle' },
      { name: 'Shared Cabs', users: 6000, type: 'carpool' },
      { name: 'Park Square Mall', users: 70000, type: 'food' },
    ],
    parkingSpaces: 10000,
    busRoutes: 48,
  },
];

// Commuter Flow Data (Origin-Destination Matrix)
export const commuterFlows: CommuterFlow[] = [
  // To Electronic City
  {
    from: 'BTM Layout',
    to: 'Electronic City',
    dailyCommuters: 25000,
    avgTravelTime: 45,
    distance: 15,
    congestionLevel: 'high',
  },
  {
    from: 'HSR Layout',
    to: 'Electronic City',
    dailyCommuters: 20000,
    avgTravelTime: 35,
    distance: 12,
    congestionLevel: 'high',
  },
  {
    from: 'Jayanagar',
    to: 'Electronic City',
    dailyCommuters: 18000,
    avgTravelTime: 50,
    distance: 18,
    congestionLevel: 'severe',
  },
  {
    from: 'Koramangala',
    to: 'Electronic City',
    dailyCommuters: 22000,
    avgTravelTime: 40,
    distance: 14,
    congestionLevel: 'high',
  },
  {
    from: 'Banashankari',
    to: 'Electronic City',
    dailyCommuters: 15000,
    avgTravelTime: 55,
    distance: 20,
    congestionLevel: 'severe',
  },
  {
    from: 'JP Nagar',
    to: 'Electronic City',
    dailyCommuters: 12000,
    avgTravelTime: 45,
    distance: 16,
    congestionLevel: 'high',
  },
  {
    from: 'Sarjapur Road',
    to: 'Electronic City',
    dailyCommuters: 10000,
    avgTravelTime: 25,
    distance: 8,
    congestionLevel: 'medium',
  },

  // To Whitefield
  {
    from: 'Marathahalli',
    to: 'Whitefield',
    dailyCommuters: 30000,
    avgTravelTime: 30,
    distance: 8,
    congestionLevel: 'high',
  },
  {
    from: 'Indiranagar',
    to: 'Whitefield',
    dailyCommuters: 15000,
    avgTravelTime: 45,
    distance: 16,
    congestionLevel: 'severe',
  },
  {
    from: 'Brookefield',
    to: 'Whitefield',
    dailyCommuters: 12000,
    avgTravelTime: 15,
    distance: 4,
    congestionLevel: 'low',
  },
  {
    from: 'Kundalahalli',
    to: 'Whitefield',
    dailyCommuters: 18000,
    avgTravelTime: 20,
    distance: 5,
    congestionLevel: 'medium',
  },
  {
    from: 'Bellandur',
    to: 'Whitefield',
    dailyCommuters: 20000,
    avgTravelTime: 35,
    distance: 10,
    congestionLevel: 'high',
  },
  {
    from: 'HSR Layout',
    to: 'Whitefield',
    dailyCommuters: 14000,
    avgTravelTime: 50,
    distance: 18,
    congestionLevel: 'severe',
  },
  {
    from: 'Koramangala',
    to: 'Whitefield',
    dailyCommuters: 16000,
    avgTravelTime: 45,
    distance: 15,
    congestionLevel: 'high',
  },

  // To Outer Ring Road
  {
    from: 'Marathahalli',
    to: 'Outer Ring Road',
    dailyCommuters: 35000,
    avgTravelTime: 20,
    distance: 3,
    congestionLevel: 'high',
  },
  {
    from: 'Bellandur',
    to: 'Outer Ring Road',
    dailyCommuters: 28000,
    avgTravelTime: 25,
    distance: 5,
    congestionLevel: 'high',
  },
  {
    from: 'Koramangala',
    to: 'Outer Ring Road',
    dailyCommuters: 25000,
    avgTravelTime: 30,
    distance: 6,
    congestionLevel: 'severe',
  },
  {
    from: 'HSR Layout',
    to: 'Outer Ring Road',
    dailyCommuters: 22000,
    avgTravelTime: 35,
    distance: 8,
    congestionLevel: 'high',
  },
  {
    from: 'BTM Layout',
    to: 'Outer Ring Road',
    dailyCommuters: 18000,
    avgTravelTime: 40,
    distance: 9,
    congestionLevel: 'severe',
  },
  {
    from: 'Indiranagar',
    to: 'Outer Ring Road',
    dailyCommuters: 16000,
    avgTravelTime: 30,
    distance: 7,
    congestionLevel: 'high',
  },
  {
    from: 'Sarjapur Road',
    to: 'Outer Ring Road',
    dailyCommuters: 20000,
    avgTravelTime: 30,
    distance: 7,
    congestionLevel: 'high',
  },

  // To Manyata Tech Park
  {
    from: 'Hebbal',
    to: 'Manyata Tech Park',
    dailyCommuters: 25000,
    avgTravelTime: 20,
    distance: 4,
    congestionLevel: 'medium',
  },
  {
    from: 'Thanisandra',
    to: 'Manyata Tech Park',
    dailyCommuters: 22000,
    avgTravelTime: 15,
    distance: 3,
    congestionLevel: 'low',
  },
  {
    from: 'Yelahanka',
    to: 'Manyata Tech Park',
    dailyCommuters: 18000,
    avgTravelTime: 25,
    distance: 8,
    congestionLevel: 'medium',
  },
  {
    from: 'RT Nagar',
    to: 'Manyata Tech Park',
    dailyCommuters: 15000,
    avgTravelTime: 30,
    distance: 7,
    congestionLevel: 'high',
  },
  {
    from: 'Hennur',
    to: 'Manyata Tech Park',
    dailyCommuters: 12000,
    avgTravelTime: 20,
    distance: 5,
    congestionLevel: 'medium',
  },
  {
    from: 'Malleshwaram',
    to: 'Manyata Tech Park',
    dailyCommuters: 10000,
    avgTravelTime: 40,
    distance: 10,
    congestionLevel: 'high',
  },
  {
    from: 'Indiranagar',
    to: 'Manyata Tech Park',
    dailyCommuters: 8000,
    avgTravelTime: 50,
    distance: 12,
    congestionLevel: 'severe',
  },

  // Cross-connections to other tech parks
  {
    from: 'Marathahalli',
    to: 'Bagmane Tech Park',
    dailyCommuters: 15000,
    avgTravelTime: 15,
    distance: 3,
    congestionLevel: 'medium',
  },
  {
    from: 'Bellandur',
    to: 'RMZ Ecospace',
    dailyCommuters: 18000,
    avgTravelTime: 20,
    distance: 4,
    congestionLevel: 'medium',
  },
  {
    from: 'Koramangala',
    to: 'Embassy Tech Village',
    dailyCommuters: 12000,
    avgTravelTime: 35,
    distance: 8,
    congestionLevel: 'high',
  },
  {
    from: 'Brookefield',
    to: 'ITPL',
    dailyCommuters: 14000,
    avgTravelTime: 20,
    distance: 5,
    congestionLevel: 'medium',
  },
];

// Major Road Networks
export const majorRoads = [
  // Highways
  { name: 'NH-44 (Bellary Road)', type: 'highway', congestion: 'severe' },
  { name: 'NH-75 (Hosur Road)', type: 'highway', congestion: 'severe' },
  { name: 'NH-48 (Tumkur Road)', type: 'highway', congestion: 'high' },
  { name: 'NH-648 (Mysore Road)', type: 'highway', congestion: 'high' },

  // Major Roads
  { name: 'Outer Ring Road', type: 'major', congestion: 'severe' },
  { name: 'Intermediate Ring Road', type: 'major', congestion: 'high' },
  { name: 'Inner Ring Road', type: 'major', congestion: 'high' },
  { name: 'Sarjapur Road', type: 'major', congestion: 'severe' },
  { name: 'Bannerghatta Road', type: 'major', congestion: 'high' },
  { name: 'Old Airport Road', type: 'major', congestion: 'high' },
];

// Helper function to get all commuter flows for a specific IT hub
export function getFlowsToHub(hubName: string): CommuterFlow[] {
  return commuterFlows.filter(flow => flow.to === hubName);
}

// Helper function to calculate traffic density for heat map
export function calculateTrafficDensity(lat: number, lng: number): number {
  let density = 0;

  // Check proximity to IT hubs (higher density)
  itHubs.forEach(hub => {
    const distance = Math.sqrt(
      Math.pow((hub.coordinates.lat - lat) * 111, 2) +
      Math.pow((hub.coordinates.lng - lng) * 111, 2)
    );
    if (distance < 5) {
      density += (5 - distance) * 20;
    }
  });

  // Check proximity to residential areas (medium density)
  residentialAreas.forEach(area => {
    const distance = Math.sqrt(
      Math.pow((area.coordinates.lat - lat) * 111, 2) +
      Math.pow((area.coordinates.lng - lng) * 111, 2)
    );
    if (distance < 3) {
      density += (3 - distance) * 10;
    }
  });

  // Add density along commuter flows
  commuterFlows.forEach(flow => {
    const fromArea = [...residentialAreas, ...itHubs].find(loc => loc.name === flow.from);
    const toArea = [...residentialAreas, ...itHubs].find(loc => loc.name === flow.to);

    if (fromArea && toArea) {
      // Simple linear interpolation along the route
      const routeLat = (fromArea.coordinates.lat + toArea.coordinates.lat) / 2;
      const routeLng = (fromArea.coordinates.lng + toArea.coordinates.lng) / 2;
      const distance = Math.sqrt(
        Math.pow((routeLat - lat) * 111, 2) +
        Math.pow((routeLng - lng) * 111, 2)
      );

      if (distance < 2) {
        density += (2 - distance) * (flow.dailyCommuters / 1000);
      }
    }
  });

  return Math.min(100, density); // Cap at 100
}