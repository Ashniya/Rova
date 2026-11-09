import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Rova database seeding...');

  // Clean existing tables in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.recoveryOption.deleteMany();
  await prisma.disruption.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.bookingSeat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.routeStop.deleteMany();
  await prisma.stop.deleteMany();
  await prisma.route.deleteMany();
  await prisma.seat.deleteMany();
  await prisma.bus.deleteMany();
  await prisma.operator.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing data.');

  // 1. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const operatorPasswordHash = await bcrypt.hash('operator123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'System Admin',
      email: 'admin@rova.com',
      passwordHash: adminPasswordHash,
      phone: '+998 90 123 45 67',
      role: 'ADMIN',
    },
  });

  const operatorUser1 = await prisma.user.create({
    data: {
      name: 'SilkRoad Operations',
      email: 'operator@silkroad.com',
      passwordHash: operatorPasswordHash,
      phone: '+998 91 234 56 78',
      role: 'OPERATOR',
    },
  });

  const operatorUser2 = await prisma.user.create({
    data: {
      name: 'Orient Lines Manager',
      email: 'operator@orient.com',
      passwordHash: operatorPasswordHash,
      phone: '+998 93 345 67 89',
      role: 'OPERATOR',
    },
  });

  const passengerUser = await prisma.user.create({
    data: {
      name: "Xasanova Go'zal",
      email: 'gozal@example.com',
      passwordHash: passwordHash,
      phone: '+998 94 456 78 90',
      role: 'PASSENGER',
    },
  });

  console.log('👤 Created demo users: admin@rova.com, operator@silkroad.com, gozal@example.com');

  // 2. Create Operators
  const operator1 = await prisma.operator.create({
    data: {
      name: 'SilkRoad Express',
      code: 'SILK',
      contactEmail: 'support@silkroad.uz',
      contactPhone: '+998 71 200 11 22',
      address: 'Amir Temur Avenue 45, Tashkent',
      rating: 4.8,
      userId: operatorUser1.id,
    },
  });

  const operator2 = await prisma.operator.create({
    data: {
      name: 'Orient Star Lines',
      code: 'ORIENT',
      contactEmail: 'contact@orientlines.uz',
      contactPhone: '+998 66 230 44 55',
      address: 'Registan Street 12, Samarkand',
      rating: 4.6,
      userId: operatorUser2.id,
    },
  });

  const operator3 = await prisma.operator.create({
    data: {
      name: 'Rova Swift Transit',
      code: 'ROVA',
      contactEmail: 'fleet@rova.com',
      contactPhone: '+998 71 555 00 99',
      address: 'Navoi Boulevard 88, Tashkent',
      rating: 4.9,
    },
  });

  // 3. Create Buses & Seats
  // Helper to generate seats
  const createBusWithSeats = async (
    reg: string,
    name: string,
    type: string,
    layout: string,
    opId: string,
    seatsCount: number
  ) => {
    const bus = await prisma.bus.create({
      data: {
        registrationNumber: reg,
        name,
        busType: type,
        layoutType: layout,
        totalSeats: seatsCount,
        operatorId: opId,
      },
    });

    const seats = [];
    const cols = layout === '2x1' ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
    const rows = Math.ceil(seatsCount / cols.length);

    let count = 0;
    for (let r = 1; r <= rows && count < seatsCount; r++) {
      for (let c = 0; c < cols.length && count < seatsCount; c++) {
        count++;
        seats.push({
          seatNumber: `${r}${cols[c]}`,
          deck: 'LOWER',
          seatType: type.includes('SLEEPER') ? 'SLEEPER' : 'SEATER',
          isWomenOnly: r === 1, // Front row reserved for women passengers
          row: r,
          column: c + 1,
          busId: bus.id,
        });
      }
    }

    await prisma.seat.createMany({ data: seats });
    return bus;
  };

  const bus1 = await createBusWithSeats('01-A-789-AA', 'SilkRoad Volvo 9800', 'LUXURY_VOLVO', '2x2', operator1.id, 40);
  const bus2 = await createBusWithSeats('01-B-432-BB', 'SilkRoad Sleeper Cruiser', 'AC_SLEEPER', '2x1', operator1.id, 30);
  const bus3 = await createBusWithSeats('30-C-111-CC', 'Orient Star Intercity', 'AC_SEATER', '2x2', operator2.id, 44);
  const bus4 = await createBusWithSeats('01-R-999-RR', 'Rova Electric SuperCoach', 'LUXURY_VOLVO', '2x2', operator3.id, 36);

  console.log('🚌 Created 4 buses with realistic seat matrices.');

  // 4. Create Stops
  const stopToshkentCentral = await prisma.stop.create({
    data: { name: 'Toshkent Central Bus Station (Avtovokzal)', city: 'Toshkent', landmark: 'Chilonzor Metro' },
  });
  const stopToshkentAirport = await prisma.stop.create({
    data: { name: 'Toshkent Yuzhny Gate', city: 'Toshkent', landmark: 'Terminal 2' },
  });
  const stopJizzaxMain = await prisma.stop.create({
    data: { name: 'Jizzax Avtoshohbekati', city: 'Jizzax', landmark: 'City Center' },
  });
  const stopSamarkandRegistan = await prisma.stop.create({
    data: { name: 'Samarkand Silk Road Station', city: 'Samarkand', landmark: 'Registan Junction' },
  });
  const stopBuxoroKogon = await prisma.stop.create({
    data: { name: 'Buxoro Ark Bus Terminal', city: 'Buxoro', landmark: 'Old Town entrance' },
  });

  // 5. Create Routes & RouteStops
  const routeToshkentBuxoro = await prisma.route.create({
    data: {
      origin: 'Toshkent',
      destination: 'Buxoro',
      distanceKm: 570,
      estimatedMinutes: 420,
    },
  });

  await prisma.routeStop.createMany({
    data: [
      { routeId: routeToshkentBuxoro.id, stopId: stopToshkentCentral.id, sequence: 1, stopType: 'BOARDING', timeFromStartMinutes: 0 },
      { routeId: routeToshkentBuxoro.id, stopId: stopJizzaxMain.id, sequence: 2, stopType: 'BOTH', timeFromStartMinutes: 180 },
      { routeId: routeToshkentBuxoro.id, stopId: stopSamarkandRegistan.id, sequence: 3, stopType: 'BOTH', timeFromStartMinutes: 260 },
      { routeId: routeToshkentBuxoro.id, stopId: stopBuxoroKogon.id, sequence: 4, stopType: 'DROPPING', timeFromStartMinutes: 420 },
    ],
  });

  const routeToshkentJizzax = await prisma.route.create({
    data: {
      origin: 'Toshkent',
      destination: 'Jizzax',
      distanceKm: 210,
      estimatedMinutes: 180,
    },
  });

  await prisma.routeStop.createMany({
    data: [
      { routeId: routeToshkentJizzax.id, stopId: stopToshkentCentral.id, sequence: 1, stopType: 'BOARDING', timeFromStartMinutes: 0 },
      { routeId: routeToshkentJizzax.id, stopId: stopJizzaxMain.id, sequence: 2, stopType: 'DROPPING', timeFromStartMinutes: 180 },
    ],
  });

  const routeToshkentSamarkand = await prisma.route.create({
    data: {
      origin: 'Toshkent',
      destination: 'Samarkand',
      distanceKm: 310,
      estimatedMinutes: 240,
    },
  });

  await prisma.routeStop.createMany({
    data: [
      { routeId: routeToshkentSamarkand.id, stopId: stopToshkentCentral.id, sequence: 1, stopType: 'BOARDING', timeFromStartMinutes: 0 },
      { routeId: routeToshkentSamarkand.id, stopId: stopSamarkandRegistan.id, sequence: 2, stopType: 'DROPPING', timeFromStartMinutes: 240 },
    ],
  });

  // 6. Create Scheduled Trips across today and future days
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const makeDate = (dayOffset: number, hours: number, mins: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + dayOffset);
    d.setHours(hours, mins, 0, 0);
    return d;
  };

  // Featured trip matching reference image: Toshkent -> Jizzax at 23:30
  const tripFeatured = await prisma.trip.create({
    data: {
      busId: bus1.id,
      routeId: routeToshkentJizzax.id,
      departureTime: makeDate(1, 23, 30),
      arrivalTime: makeDate(2, 6, 25),
      basePrice: 205997, // Exactly 205,997 UZS from reference image!
      status: 'SCHEDULED',
    },
  });

  // Trip 2: Toshkent -> Buxoro Morning Express
  const trip2 = await prisma.trip.create({
    data: {
      busId: bus2.id,
      routeId: routeToshkentBuxoro.id,
      departureTime: makeDate(1, 8, 0),
      arrivalTime: makeDate(1, 15, 0),
      basePrice: 280000,
      status: 'SCHEDULED',
    },
  });

  // Trip 3: Toshkent -> Samarkand Afternoon
  const trip3 = await prisma.trip.create({
    data: {
      busId: bus3.id,
      routeId: routeToshkentSamarkand.id,
      departureTime: makeDate(1, 14, 30),
      arrivalTime: makeDate(1, 18, 30),
      basePrice: 150000,
      status: 'SCHEDULED',
    },
  });

  // Trip 4: Toshkent -> Buxoro (Disrupted trip for demonstrating Journey Recovery Engine)
  const trip4 = await prisma.trip.create({
    data: {
      busId: bus4.id,
      routeId: routeToshkentBuxoro.id,
      departureTime: makeDate(0, 19, 0),
      arrivalTime: makeDate(1, 2, 0),
      basePrice: 260000,
      status: 'DELAYED',
    },
  });

  console.log('🗓️ Scheduled journeys created.');

  // 7. Seed Bookings & Seats matching Reference Image Ticket
  // Fetch seat 16B for bus1
  const seat16B = await prisma.seat.findFirst({
    where: { busId: bus1.id, seatNumber: '16B' },
  });

  const seat16A = await prisma.seat.findFirst({
    where: { busId: bus1.id, seatNumber: '16A' },
  });

  if (seat16B) {
    const bookingGozal = await prisma.booking.create({
      data: {
        pnr: 'RV8F92K', // Distinctive reference PNR
        userId: passengerUser.id,
        passengerName: "Xasanova Go'zal",
        contactEmail: 'gozal@example.com',
        contactPhone: '+998 94 456 78 90',
        tripId: tripFeatured.id,
        totalAmount: 205997,
        status: 'CONFIRMED',
      },
    });

    await prisma.bookingSeat.create({
      data: {
        bookingId: bookingGozal.id,
        tripId: tripFeatured.id,
        seatId: seat16B.id,
        passengerName: "Xasanova Go'zal",
        passengerAge: 24,
        passengerGender: 'FEMALE',
        seatPrice: 205997,
        status: 'CONFIRMED',
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: bookingGozal.id,
        transactionId: 'TXN-98231-UZB',
        amount: 205997,
        paymentMethod: 'CARD',
        status: 'SUCCESS',
      },
    });

    console.log("🎫 Created reference ticket RV8F92K for Xasanova Go'zal (Seat 16B).");
  }

  // Pre-seed a few more seats for bus1 so manifest and occupancy report look lively
  if (seat16A) {
    const booking2 = await prisma.booking.create({
      data: {
        pnr: 'RV3B17P',
        passengerName: 'Anvar Karimov',
        contactEmail: 'anvar@example.com',
        contactPhone: '+998 90 999 88 77',
        tripId: tripFeatured.id,
        totalAmount: 205997,
        status: 'CONFIRMED',
      },
    });

    await prisma.bookingSeat.create({
      data: {
        bookingId: booking2.id,
        tripId: tripFeatured.id,
        seatId: seat16A.id,
        passengerName: 'Anvar Karimov',
        passengerAge: 32,
        passengerGender: 'MALE',
        seatPrice: 205997,
        status: 'CONFIRMED',
      },
    });

    await prisma.payment.create({
      data: {
        bookingId: booking2.id,
        transactionId: 'TXN-74120-UZB',
        amount: 205997,
        paymentMethod: 'UPI',
        status: 'SUCCESS',
      },
    });
  }

  // 8. Create a Disruption record on Trip 4 with Recovery Options
  const disruption = await prisma.disruption.create({
    data: {
      tripId: trip4.id,
      disruptionType: 'DELAY',
      originalDeparture: trip4.departureTime,
      revisedDeparture: new Date(trip4.departureTime.getTime() + 90 * 60 * 1000), // 90 min delay
      reason: 'Technical safety inspection at Tashkent depot',
      status: 'ACTIVE',
    },
  });

  await prisma.recoveryOption.create({
    data: {
      disruptionId: disruption.id,
      originalTripId: trip4.id,
      alternativeTripId: trip2.id,
      compensationOffered: 'Free Delay Care Snack Pack + 20% Travel Credit on next booking',
      autoTransferEligible: true,
      notes: `Direct morning express alternative available: ${bus2.name} departing ${trip2.departureTime.toLocaleTimeString()}`,
    },
  });

  // 9. Initial Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'SYSTEM_INITIALIZATION',
        entity: 'SYSTEM',
        entityId: 'ROVA_INIT',
        userId: adminUser.id,
        details: JSON.stringify({ version: '1.0.0', environment: 'production-ready' }),
      },
      {
        action: 'TRIP_SCHEDULED',
        entity: 'TRIP',
        entityId: tripFeatured.id,
        userId: operatorUser1.id,
        details: JSON.stringify({ route: 'Toshkent -> Jizzax', departure: tripFeatured.departureTime }),
      },
      {
        action: 'BOOKING_CONFIRMED',
        entity: 'BOOKING',
        entityId: 'RV8F92K',
        userId: passengerUser.id,
        details: JSON.stringify({ pnr: 'RV8F92K', seat: '16B', passenger: "Xasanova Go'zal" }),
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
