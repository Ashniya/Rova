import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

export async function seedDatabase(prisma: PrismaClient) {
  console.log('🌱 Starting Rova database seeding...');

  // 1. Create or ensure Demo Users exist
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const operatorPasswordHash = await bcrypt.hash('operator123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@rova.com' },
    update: { passwordHash: adminPasswordHash },
    create: {
      name: 'System Admin',
      email: 'admin@rova.com',
      passwordHash: adminPasswordHash,
      phone: '+998 90 123 45 67',
      role: 'ADMIN',
    },
  });

  const operatorUser1 = await prisma.user.upsert({
    where: { email: 'operator@silkroad.com' },
    update: { passwordHash: operatorPasswordHash },
    create: {
      name: 'SilkRoad Operations',
      email: 'operator@silkroad.com',
      passwordHash: operatorPasswordHash,
      phone: '+998 91 234 56 78',
      role: 'OPERATOR',
    },
  });

  const operatorUser2 = await prisma.user.upsert({
    where: { email: 'operator@orient.com' },
    update: { passwordHash: operatorPasswordHash },
    create: {
      name: 'Orient Lines Manager',
      email: 'operator@orient.com',
      passwordHash: operatorPasswordHash,
      phone: '+998 93 345 67 89',
      role: 'OPERATOR',
    },
  });

  const passengerUser = await prisma.user.upsert({
    where: { email: 'gozal@example.com' },
    update: { passwordHash: passwordHash },
    create: {
      name: "Xasanova Go'zal",
      email: 'gozal@example.com',
      passwordHash: passwordHash,
      phone: '+998 94 456 78 90',
      role: 'PASSENGER',
    },
  });

  console.log('👤 Created demo users: admin@rova.com, operator@silkroad.com, gozal@example.com');

  // 2. Operators
  const operator1 = await prisma.operator.upsert({
    where: { code: 'SILK' },
    update: {},
    create: {
      name: 'SilkRoad Express',
      code: 'SILK',
      contactEmail: 'support@silkroad.uz',
      contactPhone: '+998 71 200 11 22',
      address: 'Amir Temur Avenue 45, Tashkent',
      rating: 4.8,
      userId: operatorUser1.id,
    },
  });

  const operator2 = await prisma.operator.upsert({
    where: { code: 'ORIENT' },
    update: {},
    create: {
      name: 'Orient Star Lines',
      code: 'ORIENT',
      contactEmail: 'contact@orientlines.uz',
      contactPhone: '+998 66 230 44 55',
      address: 'Registan Street 12, Samarkand',
      rating: 4.6,
      userId: operatorUser2.id,
    },
  });

  const operator3 = await prisma.operator.upsert({
    where: { code: 'ROVA' },
    update: {},
    create: {
      name: 'Rova Swift Transit',
      code: 'ROVA',
      contactEmail: 'fleet@rova.com',
      contactPhone: '+998 71 555 00 99',
      address: 'Navoi Boulevard 88, Tashkent',
      rating: 4.9,
    },
  });

  // 3. Helper to create bus with seats
  const createBusWithSeats = async (
    reg: string,
    name: string,
    type: string,
    layout: string,
    opId: string,
    seatsCount: number
  ) => {
    let bus = await prisma.bus.findUnique({ where: { registrationNumber: reg } });
    if (!bus) {
      bus = await prisma.bus.create({
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
            isWomenOnly: r === 1,
            row: r,
            column: c + 1,
            busId: bus.id,
          });
        }
      }

      await prisma.seat.createMany({ data: seats });
    }
    return bus;
  };

  const bus1 = await createBusWithSeats('01-A-789-AA', 'SilkRoad Volvo 9800', 'LUXURY_VOLVO', '2x2', operator1.id, 40);
  const bus2 = await createBusWithSeats('01-B-432-BB', 'SilkRoad Sleeper Cruiser', 'AC_SLEEPER', '2x1', operator1.id, 30);
  const bus3 = await createBusWithSeats('30-C-111-CC', 'Orient Star Intercity', 'AC_SEATER', '2x2', operator2.id, 44);
  const bus4 = await createBusWithSeats('01-R-999-RR', 'Rova Electric SuperCoach', 'LUXURY_VOLVO', '2x2', operator3.id, 36);

  // 4. Stops
  let stopToshkentCentral = await prisma.stop.findFirst({ where: { name: 'Toshkent Central Bus Station (Avtovokzal)' } });
  if (!stopToshkentCentral) {
    stopToshkentCentral = await prisma.stop.create({
      data: { name: 'Toshkent Central Bus Station (Avtovokzal)', city: 'Toshkent', landmark: 'Chilonzor Metro' },
    });
  }

  let stopJizzaxMain = await prisma.stop.findFirst({ where: { name: 'Jizzax Avtoshohbekati' } });
  if (!stopJizzaxMain) {
    stopJizzaxMain = await prisma.stop.create({
      data: { name: 'Jizzax Avtoshohbekati', city: 'Jizzax', landmark: 'City Center' },
    });
  }

  let stopSamarkandRegistan = await prisma.stop.findFirst({ where: { name: 'Samarkand Silk Road Station' } });
  if (!stopSamarkandRegistan) {
    stopSamarkandRegistan = await prisma.stop.create({
      data: { name: 'Samarkand Silk Road Station', city: 'Samarkand', landmark: 'Registan Junction' },
    });
  }

  let stopBuxoroKogon = await prisma.stop.findFirst({ where: { name: 'Buxoro Ark Bus Terminal' } });
  if (!stopBuxoroKogon) {
    stopBuxoroKogon = await prisma.stop.create({
      data: { name: 'Buxoro Ark Bus Terminal', city: 'Buxoro', landmark: 'Old Town entrance' },
    });
  }

  // 5. Routes
  let routeToshkentJizzax = await prisma.route.findUnique({
    where: { origin_destination: { origin: 'Toshkent', destination: 'Jizzax' } },
  });
  if (!routeToshkentJizzax) {
    routeToshkentJizzax = await prisma.route.create({
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
  }

  // 6. Featured Trip
  const now = new Date();
  const tripCount = await prisma.trip.count();
  if (tripCount === 0) {
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 30);
    const dayAfter = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 6, 25);

    const tripFeatured = await prisma.trip.create({
      data: {
        busId: bus1.id,
        routeId: routeToshkentJizzax.id,
        departureTime: tomorrow,
        arrivalTime: dayAfter,
        basePrice: 205997,
        status: 'SCHEDULED',
      },
    });

    // Seat booking for Gozal
    const seat16B = await prisma.seat.findFirst({
      where: { busId: bus1.id, seatNumber: '16B' },
    });

    if (seat16B) {
      const bookingGozal = await prisma.booking.create({
        data: {
          pnr: 'RV8F92K',
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
    }
  }

  console.log('✅ Seed completed successfully!');
  return { success: true, message: 'Database seeded successfully' };
}
