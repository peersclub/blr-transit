import { PrismaClient, UserRole, VehicleType, VerificationStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (in reverse order of dependencies)
  console.log('🗑️  Clearing existing data...');
  await prisma.booking.deleteMany();
  await prisma.tripRevenue.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.pickupPoint.deleteMany();
  await prisma.route.deleteMany();
  await prisma.driverVehicle.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  // 1. Create Companies
  console.log('🏢 Creating companies...');
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'Infosys Technologies',
        corporateId: 'INFY001',
        domain: 'infosys.com',
        address: 'Electronic City, Hosur Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560100',
        contactPerson: 'Rajesh Kumar',
        contactEmail: 'rajesh.kumar@infosys.com',
        contactPhone: '+91-9876543210',
        gstNumber: '29AACFB1234F1Z5',
        discountPercent: 15,
      },
    }),
    prisma.company.create({
      data: {
        name: 'Wipro Limited',
        corporateId: 'WIPR001',
        domain: 'wipro.com',
        address: 'Sarjapur Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560035',
        contactPerson: 'Priya Sharma',
        contactEmail: 'priya.sharma@wipro.com',
        contactPhone: '+91-9876543211',
        gstNumber: '29AACFW1234F1Z6',
        discountPercent: 12,
      },
    }),
  ]);

  // 2. Create Users (Admin, Corporate, Regular)
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@blrtransit.com',
      phone: '+91-9999999999',
      phoneVerified: true,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      verificationStatus: VerificationStatus.VERIFIED,
      verifiedAt: new Date(),
    },
  });

  const driverUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ramesh.driver@blrtransit.com',
        phone: '+91-9876501111',
        phoneVerified: true,
        password: hashedPassword,
        firstName: 'Ramesh',
        lastName: 'Kumar',
        role: UserRole.DRIVER,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'suresh.driver@blrtransit.com',
        phone: '+91-9876502222',
        phoneVerified: true,
        password: hashedPassword,
        firstName: 'Suresh',
        lastName: 'Reddy',
        role: UserRole.DRIVER,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'vijay.driver@blrtransit.com',
        phone: '+91-9876503333',
        phoneVerified: true,
        password: hashedPassword,
        firstName: 'Vijay',
        lastName: 'Singh',
        role: UserRole.DRIVER,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'prakash.driver@blrtransit.com',
        phone: '+91-9876504444',
        phoneVerified: true,
        password: hashedPassword,
        firstName: 'Prakash',
        lastName: 'Naik',
        role: UserRole.DRIVER,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
      },
    }),
  ]);

  const regularUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'anita.patel@infosys.com',
        phone: '+91-9876505555',
        phoneVerified: true,
        password: hashedPassword,
        firstName: 'Anita',
        lastName: 'Patel',
        employeeId: 'INFY12345',
        companyId: companies[0].id,
        role: UserRole.USER,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
        homeAddress: 'Whitefield, Bangalore',
        homeLatitude: 12.9698,
        homeLongitude: 77.7500,
      },
    }),
    prisma.user.create({
      data: {
        email: 'rahul.mehta@wipro.com',
        phone: '+91-9876506666',
        phoneVerified: true,
        password: hashedPassword,
        firstName: 'Rahul',
        lastName: 'Mehta',
        employeeId: 'WIPR67890',
        companyId: companies[1].id,
        role: UserRole.USER,
        verificationStatus: VerificationStatus.VERIFIED,
        verifiedAt: new Date(),
        homeAddress: 'Koramangala, Bangalore',
        homeLatitude: 12.9352,
        homeLongitude: 77.6245,
      },
    }),
  ]);

  // 3. Create Drivers
  console.log('🚗 Creating drivers...');
  const drivers = await Promise.all([
    prisma.driver.create({
      data: {
        userId: driverUsers[0].id,
        licenseNumber: 'KA01DL12345678',
        licenseExpiry: new Date('2026-12-31'),
        licenseDoc: '/uploads/licenses/ramesh_license.pdf',
        aadharNumber: '1234-5678-9012',
        aadharDoc: '/uploads/aadhar/ramesh_aadhar.pdf',
        panNumber: 'ABCDE1234F',
        address: '123, MG Road, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        bloodGroup: 'O+',
        totalTrips: 245,
        rating: 4.8,
        isAvailable: true,
      },
    }),
    prisma.driver.create({
      data: {
        userId: driverUsers[1].id,
        licenseNumber: 'KA02DL87654321',
        licenseExpiry: new Date('2027-06-30'),
        licenseDoc: '/uploads/licenses/suresh_license.pdf',
        aadharNumber: '2345-6789-0123',
        aadharDoc: '/uploads/aadhar/suresh_aadhar.pdf',
        panNumber: 'FGHIJ5678K',
        address: '456, Brigade Road, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        bloodGroup: 'A+',
        totalTrips: 189,
        rating: 4.6,
        isAvailable: true,
      },
    }),
    prisma.driver.create({
      data: {
        userId: driverUsers[2].id,
        licenseNumber: 'KA03DL11223344',
        licenseExpiry: new Date('2026-09-15'),
        licenseDoc: '/uploads/licenses/vijay_license.pdf',
        aadharNumber: '3456-7890-1234',
        aadharDoc: '/uploads/aadhar/vijay_aadhar.pdf',
        panNumber: 'KLMNO9012P',
        address: '789, Indiranagar, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
        bloodGroup: 'B+',
        totalTrips: 312,
        rating: 4.9,
        isAvailable: true,
      },
    }),
    prisma.driver.create({
      data: {
        userId: driverUsers[3].id,
        licenseNumber: 'KA04DL55667788',
        licenseExpiry: new Date('2027-03-20'),
        licenseDoc: '/uploads/licenses/prakash_license.pdf',
        aadharNumber: '4567-8901-2345',
        aadharDoc: '/uploads/aadhar/prakash_aadhar.pdf',
        address: '321, Koramangala, Bangalore',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        bloodGroup: 'AB+',
        totalTrips: 156,
        rating: 4.7,
        isAvailable: true,
      },
    }),
  ]);

  // 4. Create Vehicles
  console.log('🚌 Creating vehicles...');
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        registrationNo: 'KA01AB1234',
        type: VehicleType.FORCE_URBANIA,
        make: 'Force Motors',
        model: 'Urbania 17-Seater',
        year: 2023,
        color: 'White',
        capacity: 17,
        rcDoc: '/uploads/rc/vehicle1_rc.pdf',
        insuranceDoc: '/uploads/insurance/vehicle1_insurance.pdf',
        insuranceExpiry: new Date('2025-12-31'),
        fitnessDoc: '/uploads/fitness/vehicle1_fitness.pdf',
        fitnessExpiry: new Date('2025-06-30'),
        permitDoc: '/uploads/permit/vehicle1_permit.pdf',
        permitExpiry: new Date('2025-12-31'),
        isActive: true,
        isAvailable: true,
        lastService: new Date('2024-10-15'),
        nextService: new Date('2025-01-15'),
        totalKm: 45000,
        fuelType: 'Diesel',
        mileage: 12.5,
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNo: 'KA02CD5678',
        type: VehicleType.FORCE_TRAVELLER,
        make: 'Force Motors',
        model: 'Traveller 26-Seater',
        year: 2022,
        color: 'Silver',
        capacity: 26,
        rcDoc: '/uploads/rc/vehicle2_rc.pdf',
        insuranceDoc: '/uploads/insurance/vehicle2_insurance.pdf',
        insuranceExpiry: new Date('2025-08-31'),
        fitnessDoc: '/uploads/fitness/vehicle2_fitness.pdf',
        fitnessExpiry: new Date('2025-04-30'),
        isActive: true,
        isAvailable: true,
        lastService: new Date('2024-09-20'),
        nextService: new Date('2024-12-20'),
        totalKm: 67000,
        fuelType: 'Diesel',
        mileage: 10.8,
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNo: 'KA03EF9012',
        type: VehicleType.URBANIA_EXECUTIVE,
        make: 'Force Motors',
        model: 'Urbania Executive 13-Seater',
        year: 2024,
        color: 'Black',
        capacity: 13,
        rcDoc: '/uploads/rc/vehicle3_rc.pdf',
        insuranceDoc: '/uploads/insurance/vehicle3_insurance.pdf',
        insuranceExpiry: new Date('2026-02-28'),
        fitnessDoc: '/uploads/fitness/vehicle3_fitness.pdf',
        fitnessExpiry: new Date('2026-01-31'),
        isActive: true,
        isAvailable: true,
        lastService: new Date('2024-11-01'),
        nextService: new Date('2025-02-01'),
        totalKm: 12000,
        fuelType: 'Diesel',
        mileage: 13.2,
      },
    }),
    prisma.vehicle.create({
      data: {
        registrationNo: 'KA04GH3456',
        type: VehicleType.MINI_BUS,
        make: 'Tata Motors',
        model: 'Starbus 32-Seater',
        year: 2021,
        color: 'Blue',
        capacity: 32,
        rcDoc: '/uploads/rc/vehicle4_rc.pdf',
        insuranceDoc: '/uploads/insurance/vehicle4_insurance.pdf',
        insuranceExpiry: new Date('2025-05-31'),
        isActive: true,
        isAvailable: true,
        lastService: new Date('2024-08-10'),
        nextService: new Date('2024-11-10'),
        totalKm: 89000,
        fuelType: 'Diesel',
        mileage: 9.5,
      },
    }),
  ]);

  // 5. Create Driver-Vehicle Assignments
  console.log('🔗 Creating driver-vehicle assignments...');
  await Promise.all([
    prisma.driverVehicle.create({
      data: {
        driverId: drivers[0].id,
        vehicleId: vehicles[0].id,
        isActive: true,
      },
    }),
    prisma.driverVehicle.create({
      data: {
        driverId: drivers[1].id,
        vehicleId: vehicles[1].id,
        isActive: true,
      },
    }),
    prisma.driverVehicle.create({
      data: {
        driverId: drivers[2].id,
        vehicleId: vehicles[2].id,
        isActive: true,
      },
    }),
    prisma.driverVehicle.create({
      data: {
        driverId: drivers[3].id,
        vehicleId: vehicles[3].id,
        isActive: true,
      },
    }),
  ]);

  // 6. Create Routes (Popular Bangalore routes)
  console.log('🗺️  Creating routes...');
  const routes = await Promise.all([
    prisma.route.create({
      data: {
        name: 'Whitefield to MG Road',
        code: 'RT001',
        startPoint: 'Whitefield',
        endPoint: 'MG Road',
        distance: 18.5,
        estimatedTime: 55,
        stops: JSON.stringify([
          { name: 'Whitefield', lat: 12.9698, lng: 77.7500, order: 1 },
          { name: 'Marathahalli', lat: 12.9591, lng: 77.6974, order: 2 },
          { name: 'HAL', lat: 12.9611, lng: 77.6387, order: 3 },
          { name: 'Indiranagar', lat: 12.9716, lng: 77.6412, order: 4 },
          { name: 'MG Road', lat: 12.9716, lng: 77.5946, order: 5 },
        ]),
        basePrice: 80,
        pricePerKm: 4.5,
        surgeMultiplier: 1.0,
        isActive: true,
      },
    }),
    prisma.route.create({
      data: {
        name: 'Electronic City to Koramangala',
        code: 'RT002',
        startPoint: 'Electronic City',
        endPoint: 'Koramangala',
        distance: 14.2,
        estimatedTime: 45,
        stops: JSON.stringify([
          { name: 'Electronic City', lat: 12.8456, lng: 77.6603, order: 1 },
          { name: 'Bommanahalli', lat: 12.9065, lng: 77.6296, order: 2 },
          { name: 'HSR Layout', lat: 12.9121, lng: 77.6446, order: 3 },
          { name: 'Koramangala', lat: 12.9352, lng: 77.6245, order: 4 },
        ]),
        basePrice: 65,
        pricePerKm: 4.0,
        surgeMultiplier: 1.0,
        isActive: true,
      },
    }),
    prisma.route.create({
      data: {
        name: 'Yelahanka to Hebbal',
        code: 'RT003',
        startPoint: 'Yelahanka',
        endPoint: 'Hebbal',
        distance: 12.8,
        estimatedTime: 40,
        stops: JSON.stringify([
          { name: 'Yelahanka', lat: 13.1007, lng: 77.5963, order: 1 },
          { name: 'Jakkur', lat: 13.0782, lng: 77.5993, order: 2 },
          { name: 'Hebbal', lat: 13.0358, lng: 77.5970, order: 3 },
        ]),
        basePrice: 55,
        pricePerKm: 3.8,
        surgeMultiplier: 1.0,
        isActive: true,
      },
    }),
    prisma.route.create({
      data: {
        name: 'Banashankari to Jayanagar',
        code: 'RT004',
        startPoint: 'Banashankari',
        endPoint: 'Jayanagar',
        distance: 8.5,
        estimatedTime: 30,
        stops: JSON.stringify([
          { name: 'Banashankari', lat: 12.9250, lng: 77.5487, order: 1 },
          { name: 'JP Nagar', lat: 12.9081, lng: 77.5851, order: 2 },
          { name: 'Jayanagar', lat: 12.9250, lng: 77.5838, order: 3 },
        ]),
        basePrice: 45,
        pricePerKm: 3.5,
        surgeMultiplier: 1.0,
        isActive: true,
      },
    }),
  ]);

  // 7. Create Pickup Points for each route
  console.log('📍 Creating pickup points...');
  // Route 1: Whitefield to MG Road
  await Promise.all([
    prisma.pickupPoint.create({
      data: {
        routeId: routes[0].id,
        name: 'Whitefield ITPL Main Gate',
        address: 'ITPL Main Gate, Whitefield',
        landmark: 'Opposite to Forum Value Mall',
        latitude: 12.9698,
        longitude: 77.7500,
        type: 'parking-hub',
        hasParkingHub: true,
        parkingCapacity: 50,
        hasWaitingArea: true,
        hasSecurity: true,
        morningSlots: JSON.stringify(['06:00', '07:00', '08:00', '09:00']),
        eveningSlots: JSON.stringify(['17:00', '18:00', '19:00', '20:00']),
        isActive: true,
      },
    }),
    prisma.pickupPoint.create({
      data: {
        routeId: routes[0].id,
        name: 'Marathahalli Bridge',
        address: 'Marathahalli Outer Ring Road',
        landmark: 'Near Marathahalli Bridge',
        latitude: 12.9591,
        longitude: 77.6974,
        type: 'bus-stop',
        hasParkingHub: false,
        hasWaitingArea: true,
        hasSecurity: false,
        morningSlots: JSON.stringify(['06:15', '07:15', '08:15', '09:15']),
        eveningSlots: JSON.stringify(['17:15', '18:15', '19:15', '20:15']),
        isActive: true,
      },
    }),
    prisma.pickupPoint.create({
      data: {
        routeId: routes[0].id,
        name: 'Indiranagar Metro Station',
        address: 'Indiranagar 100ft Road',
        landmark: 'Indiranagar Metro Station Exit A',
        latitude: 12.9716,
        longitude: 77.6412,
        type: 'metro-station',
        hasParkingHub: true,
        parkingCapacity: 30,
        hasWaitingArea: true,
        hasSecurity: true,
        morningSlots: JSON.stringify(['06:30', '07:30', '08:30', '09:30']),
        eveningSlots: JSON.stringify(['17:30', '18:30', '19:30', '20:30']),
        isActive: true,
      },
    }),
  ]);

  // Route 2: Electronic City to Koramangala
  await Promise.all([
    prisma.pickupPoint.create({
      data: {
        routeId: routes[1].id,
        name: 'Electronic City Phase 1',
        address: 'Electronic City, Hosur Road',
        landmark: 'Infosys Main Gate',
        latitude: 12.8456,
        longitude: 77.6603,
        type: 'parking-hub',
        hasParkingHub: true,
        parkingCapacity: 40,
        hasWaitingArea: true,
        hasSecurity: true,
        morningSlots: JSON.stringify(['06:00', '07:00', '08:00', '09:00']),
        eveningSlots: JSON.stringify(['17:00', '18:00', '19:00', '20:00']),
        isActive: true,
      },
    }),
    prisma.pickupPoint.create({
      data: {
        routeId: routes[1].id,
        name: 'HSR Layout Sector 1',
        address: 'HSR Layout, 27th Main Road',
        landmark: 'Near BDA Complex',
        latitude: 12.9121,
        longitude: 77.6446,
        type: 'bus-stop',
        hasParkingHub: true,
        parkingCapacity: 25,
        hasWaitingArea: true,
        hasSecurity: false,
        morningSlots: JSON.stringify(['06:20', '07:20', '08:20', '09:20']),
        eveningSlots: JSON.stringify(['17:20', '18:20', '19:20', '20:20']),
        isActive: true,
      },
    }),
  ]);

  // 8. Create Trips (Next 7 days)
  console.log('🚌 Creating trips...');
  const now = new Date();
  const trips = [];

  // Create morning and evening trips for the next 7 days
  for (let day = 0; day < 7; day++) {
    const tripDate = new Date(now);
    tripDate.setDate(tripDate.getDate() + day);

    // Morning trips (6 AM - 10 AM)
    const morningSlots = ['06:00', '07:00', '08:00', '09:00'];
    for (const slot of morningSlots) {
      const [hours, minutes] = slot.split(':').map(Number);
      const departureTime = new Date(tripDate);
      departureTime.setHours(hours, minutes, 0, 0);

      // Route 1: Whitefield to MG Road
      const estimatedArrival1 = new Date(departureTime);
      estimatedArrival1.setMinutes(estimatedArrival1.getMinutes() + routes[0].estimatedTime);

      trips.push(
        prisma.trip.create({
          data: {
            tripCode: `WF-MG-${tripDate.getDate()}${tripDate.getMonth() + 1}-${slot.replace(':', '')}`,
            routeId: routes[0].id,
            vehicleId: vehicles[0].id,
            driverId: drivers[0].id,
            departureTime,
            estimatedArrival: estimatedArrival1,
            totalSeats: vehicles[0].capacity,
            availableSeats: vehicles[0].capacity,
            status: day === 0 && hours < now.getHours() ? 'COMPLETED' : 'SCHEDULED',
            actualDeparture: day === 0 && hours < now.getHours() ? departureTime : null,
            actualArrival: day === 0 && hours < now.getHours() ? estimatedArrival1 : null,
          },
        })
      );

      // Route 2: Electronic City to Koramangala
      const estimatedArrival2 = new Date(departureTime);
      estimatedArrival2.setMinutes(estimatedArrival2.getMinutes() + routes[1].estimatedTime);

      trips.push(
        prisma.trip.create({
          data: {
            tripCode: `EC-KR-${tripDate.getDate()}${tripDate.getMonth() + 1}-${slot.replace(':', '')}`,
            routeId: routes[1].id,
            vehicleId: vehicles[1].id,
            driverId: drivers[1].id,
            departureTime,
            estimatedArrival: estimatedArrival2,
            totalSeats: vehicles[1].capacity,
            availableSeats: vehicles[1].capacity,
            status: day === 0 && hours < now.getHours() ? 'COMPLETED' : 'SCHEDULED',
            actualDeparture: day === 0 && hours < now.getHours() ? departureTime : null,
            actualArrival: day === 0 && hours < now.getHours() ? estimatedArrival2 : null,
          },
        })
      );
    }

    // Evening trips (5 PM - 8 PM)
    const eveningSlots = ['17:00', '18:00', '19:00', '20:00'];
    for (const slot of eveningSlots) {
      const [hours, minutes] = slot.split(':').map(Number);
      const departureTime = new Date(tripDate);
      departureTime.setHours(hours, minutes, 0, 0);

      // Route 3: Yelahanka to Hebbal
      const estimatedArrival3 = new Date(departureTime);
      estimatedArrival3.setMinutes(estimatedArrival3.getMinutes() + routes[2].estimatedTime);

      trips.push(
        prisma.trip.create({
          data: {
            tripCode: `YL-HB-${tripDate.getDate()}${tripDate.getMonth() + 1}-${slot.replace(':', '')}`,
            routeId: routes[2].id,
            vehicleId: vehicles[2].id,
            driverId: drivers[2].id,
            departureTime,
            estimatedArrival: estimatedArrival3,
            totalSeats: vehicles[2].capacity,
            availableSeats: vehicles[2].capacity,
            status: 'SCHEDULED',
          },
        })
      );

      // Route 4: Banashankari to Jayanagar
      const estimatedArrival4 = new Date(departureTime);
      estimatedArrival4.setMinutes(estimatedArrival4.getMinutes() + routes[3].estimatedTime);

      trips.push(
        prisma.trip.create({
          data: {
            tripCode: `BS-JN-${tripDate.getDate()}${tripDate.getMonth() + 1}-${slot.replace(':', '')}`,
            routeId: routes[3].id,
            vehicleId: vehicles[3].id,
            driverId: drivers[3].id,
            departureTime,
            estimatedArrival: estimatedArrival4,
            totalSeats: vehicles[3].capacity,
            availableSeats: vehicles[3].capacity,
            status: 'SCHEDULED',
          },
        })
      );
    }
  }

  await Promise.all(trips);

  console.log('✅ Seed completed successfully!');
  console.log(`
📊 Summary:
  - Companies: ${companies.length}
  - Users: ${regularUsers.length + driverUsers.length + 1} (${driverUsers.length} drivers, 1 admin, ${regularUsers.length} regular)
  - Drivers: ${drivers.length}
  - Vehicles: ${vehicles.length}
  - Routes: ${routes.length}
  - Trips: ${trips.length} (covering next 7 days)

🔑 Admin Login:
  Email: admin@blrtransit.com
  Password: password123

🚗 Sample Driver Login:
  Email: ramesh.driver@blrtransit.com
  Password: password123

👤 Sample User Login:
  Email: anita.patel@infosys.com
  Password: password123
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
