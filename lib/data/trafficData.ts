// Comprehensive Bangalore Traffic Data (2024-2025 Latest Research)
// Sources: TomTom Traffic Index 2024, B.PAC Commuter Study, BMTC Reports, Namma Metro Data
// Last Updated: November 2025

export const trafficStats = {
  globalRank: 3,  // 3rd worst globally (TomTom 2024)
  avgSpeed: 17.6, // km/h average speed
  peakHourSpeed: 15.5, // km/h morning rush
  eveningPeakSpeed: 14.3, // km/h evening rush (41:59 min for 10km)
  timeFor10km: 34.17, // minutes average (50 seconds worse than 2023)
  annualHoursLost: 132, // hours stuck in traffic per driver
  trafficCongestionIndex: 42.33,
  congestionLevel: 38, // percentage (4% increase from 2023)
  dailyCommuteTime: "7%", // of day
  monetaryCost: 20000, // ₹20,000 crores annually (2024 estimate)
  dailyFuelWaste: 2.8, // million liters
  worstDay: "October 5, 2024", // 39:21 min for 10km at 58% congestion
};

// Data source citations for transparency
export const dataSources = {
  trafficIndex: {
    name: 'TomTom Traffic Index 2024',
    url: 'https://www.tomtom.com/traffic-index/',
    metrics: ['globalRank', 'avgSpeed', 'congestionLevel', 'timeFor10km'],
  },
  commuterStudy: {
    name: 'B.PAC Bengaluru Commuter Study',
    url: 'https://bpac.in/bengaluru-commuter-study/',
    metrics: ['modalSplit', 'personalVehicleUsage'],
    sampleSize: 3855,
  },
  metro: {
    name: 'Namma Metro / BMRCL Official Data',
    url: 'https://en.wikipedia.org/wiki/Namma_Metro',
    metrics: ['metroDailyRidership', 'metroLength', 'metroStations'],
  },
  bmtc: {
    name: 'BMTC Official Reports',
    url: 'https://mybmtc.karnataka.gov.in/',
    metrics: ['busFleet', 'busRidership'],
  },
  moveInSync: {
    name: 'MoveInSync Company Data (Tracxn)',
    url: 'https://tracxn.com/d/companies/moveinsync/',
    metrics: ['corporateShuttleMarket', 'dailyEmployeesServed'],
  },
  mordorIntelligence: {
    name: 'Corporate Employee Transportation Service Market Report 2024',
    url: 'https://www.mordorintelligence.com/industry-reports/corporate-employee-transportation-service-market',
    metrics: ['globalMarketSize', 'marketGrowth'],
  },
};

export const vehicleData = {
  totalRegistered: 12300000, // 12.3 crore registrations by April 2025
  totalVehicles: 11800000, // 11.8 million vehicles in Bangalore
  cars: {
    2020: 2000000,
    2025: 2550000,
    newAdditions2025: 145000, // 1.45 lakh new cars in FY 2024-25
  },
  twoWheelers: {
    2020: 6700000,
    2025: 8300000,
    newAdditions2025: 468000, // 4.68 lakh new two-wheelers
  },
  buses: 6340, // BMTC fleet size
  busPercentage: 0.05,
  annualGrowth: 12, // percentage vehicle growth
  roadGrowth: 7, // percentage road network growth
  modalSplit: {
    personalVehicles: 60, // 30.4% cars + 27.1% two-wheelers
    publicTransport: 30,
    targetPublicTransport: 70, // 2030 target
  },
};

export const infrastructureData = {
  roadDensity: 8.2, // km per sq km
  delhiRoadDensity: 21.6, // for comparison
  metroStations: 83, // As of Aug 2025 (before Yellow Line additions)
  metroLength: 96.1, // km operational (before Yellow Line)
  metroDailyRidership: 636000, // March 2024 average (Source: BMRCL)
  metroRecordRidership: 1048000, // August 11, 2025 - highest ever after Yellow Line launch
  bmtcDailyRidership: 3580000, // 35.8 lakh daily (Source: BMTC)
  bmtcFleetSize: 6340, // Total BMTC buses
  yellowLineInaugurated: '2025-08-10', // Electronic City connectivity
};

export const itSectorData = {
  totalWorkers: 800000,
  itWorkers: 400000,
  bpoWorkers: 400000,
  annualCostToIndustry: 6500000000, // USD
  targetAdoption: 0.3, // 30% for bus service
  potentialCommuters: 240000,
};

export const busServiceProjections = {
  phases: [
    {
      phase: 1,
      duration: "Months 1-3",
      buses: 100,
      routes: 5,
      targetEmployees: 10000,
      companies: 10,
    },
    {
      phase: 2,
      duration: "Months 4-6",
      buses: 500,
      routes: 25,
      targetEmployees: 50000,
      companies: 50,
    },
    {
      phase: 3,
      duration: "Months 7-12",
      buses: 2000,
      routes: 100,
      targetEmployees: 200000,
      companies: 200,
    },
  ],
  financials: {
    monthlyRevenue: 700000000, // INR
    operationalCost: 500000000, // INR
    profitMargin: 28.5, // percentage
    avgFareAC: 3500, // INR per month
    avgFareRegular: 1750, // INR per month
  },
};

export const techParks = [
  {
    name: "Manyata Tech Park",
    companies: 100,  // Including IBM, Cognizant, Target, Microsoft, Fidelity
    employees: 150000,  // 150,000+ professionals (largest in Bangalore)
    area: 300,  // acres
    coordinates: { lat: 13.0452, lng: 77.6201 },
    rentPerSqFt: 137,  // ₹100-175 average
  },
  {
    name: "Electronic City",
    companies: 200,  // Including Infosys, Wipro, TCS, HCL main campuses
    employees: 100000,  // Daily workers
    area: 800,  // acres
    coordinates: { lat: 12.8456, lng: 77.6603 },
    rentPerSqFt: 45,  // Below $1/sq ft/month
  },
  {
    name: "Whitefield",
    companies: 150,  // ITPB, Bagmane Tech Park, etc.
    employees: 80000,  // Across 16+ tech parks
    area: 250,  // approximate
    coordinates: { lat: 12.9698, lng: 77.7500 },
    rentPerSqFt: 125,  // Highest rates
  },
  {
    name: "Outer Ring Road",
    companies: 200,  // Embassy Tech Village, RMZ Ecospace, Cessna
    employees: 640000,  // Daily corridor commuters (32% of IT revenue)
    annualRevenue: 22,  // billion USD
    coordinates: { lat: 12.9536, lng: 77.6396 },
    rentPerSqFt: 85,
  },
  {
    name: "Koramangala",
    companies: 300,
    employees: 50000,
    coordinates: { lat: 12.9352, lng: 77.6245 },
    rentPerSqFt: 95,
  },
];

export const timeDistribution = [
  { hour: "5:00", traffic: 10, optimal: 10, congestion: 10, avgSpeed: 55 },
  { hour: "6:00", traffic: 20, optimal: 15, congestion: 20, avgSpeed: 45 },
  { hour: "7:00", traffic: 45, optimal: 25, congestion: 45, avgSpeed: 32 },
  { hour: "8:00", traffic: 85, optimal: 35, congestion: 85, avgSpeed: 18 },
  { hour: "9:00", traffic: 95, optimal: 40, congestion: 95, avgSpeed: 15 },
  { hour: "10:00", traffic: 75, optimal: 35, congestion: 75, avgSpeed: 22 },
  { hour: "11:00", traffic: 50, optimal: 30, congestion: 50, avgSpeed: 30 },
  { hour: "12:00", traffic: 55, optimal: 30, congestion: 55, avgSpeed: 28 },
  { hour: "13:00", traffic: 60, optimal: 32, congestion: 60, avgSpeed: 26 },
  { hour: "14:00", traffic: 50, optimal: 30, congestion: 50, avgSpeed: 30 },
  { hour: "15:00", traffic: 55, optimal: 32, congestion: 55, avgSpeed: 28 },
  { hour: "16:00", traffic: 65, optimal: 35, congestion: 65, avgSpeed: 24 },
  { hour: "17:00", traffic: 80, optimal: 38, congestion: 80, avgSpeed: 20 },
  { hour: "18:00", traffic: 90, optimal: 40, congestion: 90, avgSpeed: 16 },
  { hour: "19:00", traffic: 95, optimal: 42, congestion: 95, avgSpeed: 14 },
  { hour: "20:00", traffic: 85, optimal: 38, congestion: 85, avgSpeed: 18 },
  { hour: "21:00", traffic: 60, optimal: 30, congestion: 60, avgSpeed: 26 },
  { hour: "22:00", traffic: 35, optimal: 25, congestion: 35, avgSpeed: 38 },
  { hour: "23:00", traffic: 20, optimal: 18, congestion: 20, avgSpeed: 48 },
  { hour: "0:00", traffic: 15, optimal: 12, congestion: 15, avgSpeed: 52 },
];

// Verified corporate shuttle providers operating in Bangalore (2024-2025)
// Sources: Tracxn, Crunchbase, Company LinkedIn, B.PAC Study
export const successModels = [
  {
    name: "MoveInSync",
    type: "Platform Service",
    vehicles: 7200,  // 7,200+ vehicles including 925 EVs (Verified: Tracxn Nov 2024)
    evVehicles: 925, // Electric vehicles in fleet
    companies: 400,  // 400+ clients (Verified: Company LinkedIn)
    fortune500Clients: 97, // Fortune 500 companies served
    dailyRiders: 1000000,  // 1M+ daily users (Verified: Tracxn - EBITDA positive)
    annualRevenue: 438,  // ₹438 Cr as of Mar 31, 2024 (Verified: Tracxn)
    valuation: 1010, // ₹1,010 Cr as of Feb 2024 (Verified: Tracxn)
    costReduction: 20,  // Guaranteed 20%+ cost reduction
    description: "World's largest employee commute platform, EBITDA positive",
    perUserCost: 280,  // ₹280/user/month for SaaS
    source: "https://tracxn.com/d/companies/moveinsync/",
  },
  {
    name: "ORRCA Initiative",
    type: "Corporate Partnership",
    buses: 33,  // WiFi-enabled Volvo AC buses
    companies: 24,  // IT companies on Outer Ring Road
    dailyRiders: 15000,
    peakHours: "8-10 AM, 5-7 PM",
    description: "Outer Ring Road Companies Association - BMTC partnership",
    source: "B.PAC Commuter Study",
  },
  {
    name: "Routematic",
    type: "Managed Service",
    vehicles: 1000,  // Including 200+ EVs
    evVehicles: 200,
    companies: 200,  // Including Infosys, Flipkart, HCL
    cities: 23,
    dailyRiders: 75000,
    description: "SuperApp platform with shift transport and EV fleet",
    source: "Company website",
  },
];

export const emissionData = {
  currentDailyEmissions: 15000, // tons CO2
  projectedWithBuses: 9500, // tons CO2
  reductionPercentage: 37,
  carsReplacedDaily: 80000,
  fuelSavedMonthly: 12000000, // liters
};

export const routeOptimization = {
  majorCorridors: [
    { name: "Electronic City - MG Road", currentTime: 90, optimizedTime: 45 },
    { name: "Whitefield - Koramangala", currentTime: 75, optimizedTime: 35 },
    { name: "Marathahalli - Manyata", currentTime: 85, optimizedTime: 40 },
    { name: "HSR Layout - Outer Ring Road", currentTime: 60, optimizedTime: 30 },
    { name: "Jayanagar - Electronic City", currentTime: 70, optimizedTime: 35 },
  ],
  timeSavings: {
    average: 45, // minutes per trip
    monthly: 20, // hours saved per commuter
    productivity: 15, // percentage increase
  },
};

// New: Infrastructure Projects Timeline
export const infrastructureProjectsData = {
  metro: {
    currentLength: 96.1, // km operational
    phase2B: { completion: 2026, length: 37, route: "KR Puram to Airport" },
    phase3: { completion: 2027, length: 44.65, cost: 15611 }, // ₹15,611 crores
    phase3A: { completion: 2028, length: 35, route: "Hebbal-Sarjapura" },
    dailyRidership: 636000, // March 2024 average
    recordRidership: 1048000, // August 11, 2025
  },
  tunnels: {
    hebbalSilkBoard: {
      length: 18, // km
      cost: 40000, // ₹40,000 crores
      timeReduction: "90 to 20 minutes",
      completion: 2031
    },
    airportConnectivity: {
      cost: 16500, // ₹16,500 crores
      timeSavings: 30, // minutes
      completion: 2028
    },
  },
  ringRoads: {
    satelliteTown: { length: 280.8, completion: 2027 },
    peripheral: { length: 74, lanes: 8, completion: 2027 },
  },
};

// Array format for visualization
export const infrastructureProjects = [
  {
    name: 'Metro Phase 2B',
    type: 'Metro Rail',
    completionPercentage: 65,
    status: 'Under Construction',
    completion: 2026,
    details: 'KR Puram to Airport (37 km)'
  },
  {
    name: 'Metro Phase 3',
    type: 'Metro Rail',
    completionPercentage: 30,
    status: 'Planning',
    completion: 2027,
    details: '44.65 km, ₹15,611 crores'
  },
  {
    name: 'Hebbal-Silk Board Tunnel',
    type: 'Tunnel Infrastructure',
    completionPercentage: 15,
    status: 'Early Phase',
    completion: 2031,
    details: '18 km tunnel, 90 to 20 min reduction'
  },
  {
    name: 'Airport Connectivity Tunnel',
    type: 'Tunnel Infrastructure',
    completionPercentage: 25,
    status: 'Planning',
    completion: 2028,
    details: '30 min time savings, ₹16,500 crores'
  },
  {
    name: 'Satellite Town Ring Road',
    type: 'Road Infrastructure',
    completionPercentage: 45,
    status: 'Under Construction',
    completion: 2027,
    details: '280.8 km ring road'
  },
  {
    name: 'Peripheral Ring Road',
    type: 'Road Infrastructure',
    completionPercentage: 55,
    status: 'Under Construction',
    completion: 2027,
    details: '74 km, 8 lanes'
  }
];

// Corporate Shuttle Market Analysis (2024-2025)
// Source: Mordor Intelligence Corporate Employee Transportation Service Market Report
export const shuttleMarket = {
  globalSize: 38.03, // billion USD in 2024 (Verified: Mordor Intelligence)
  projected2025: 40.18, // billion USD in 2025
  projectedSize: 52.11, // billion USD by 2030 (Verified: Mordor Intelligence)
  cagr: 5.34, // CAGR 2025-2030 (Verified)
  asiaPacificGrowth: "highest", // Asia Pacific fastest growing region
  indiaGrowth: 8.2, // CAGR percentage for India
  itBpmEmployees: 4500000, // 4.5M IT/BPM employees in India
  officeSpace: {
    current: 700, // million sq ft
    projected2030: 1200, // million sq ft
  },
  marketShare: {
    outsourced: 58, // percentage (fastest growing segment)
    vehicleTypes: {
      vans: 47, // percentage (most popular)
      buses: 6, // percentage growth rate
    },
  },
  source: "https://www.mordorintelligence.com/industry-reports/corporate-employee-transportation-service-market",
};