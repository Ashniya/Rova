import { Request, Response } from 'express';
import prisma from '../prisma';
import { processTripDisruption } from '../services/recoveryEngine';
import { logAuditEvent } from '../services/auditService';

export async function getOperatorOverview(req: Request, res: Response): Promise<void> {
  try {
    // If operator user, filter by their operatorId; if admin, show all
    const operatorId = req.user?.operatorId || undefined;

    const busCount = await prisma.bus.count({
      where: operatorId ? { operatorId } : {},
    });

    const routeCount = await prisma.route.count();

    const tripCount = await prisma.trip.count({
      where: operatorId ? { bus: { operatorId } } : {},
    });

    const bookings = await prisma.booking.findMany({
      where: operatorId ? { trip: { bus: { operatorId } } } : {},
      include: {
        bookingSeats: true,
        refund: true,
      },
    });

    const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
    const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');

    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalRefunds = cancelledBookings.reduce((sum, b) => sum + (b.refund?.refundAmount || 0), 0);
    const netRevenue = Math.round((totalRevenue - totalRefunds) * 100) / 100;

    res.json({
      success: true,
      data: {
        busCount,
        routeCount,
        tripCount,
        totalBookings: bookings.length,
        confirmedBookings: confirmedBookings.length,
        cancelledBookings: cancelledBookings.length,
        totalRevenue,
        netRevenue,
      },
    });
  } catch (error: any) {
    console.error('Operator overview error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getOperatorBuses(req: Request, res: Response): Promise<void> {
  try {
    const operatorId = req.user?.operatorId || undefined;

    const buses = await prisma.bus.findMany({
      where: operatorId ? { operatorId } : {},
      include: {
        operator: true,
        seats: true,
        _count: { select: { trips: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: buses,
    });
  } catch (error: any) {
    console.error('Get buses error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function createBus(req: Request, res: Response): Promise<void> {
  try {
    const {
      registrationNumber,
      name,
      busType = 'AC_SEATER',
      totalSeats = 40,
      layoutType = '2x2',
      operatorId: providedOperatorId,
    } = req.body;

    const operatorId = req.user?.operatorId || providedOperatorId;

    if (!operatorId) {
      res.status(400).json({ success: false, message: 'Operator ID is required' });
      return;
    }

    if (!registrationNumber || !name) {
      res.status(400).json({ success: false, message: 'Registration number and bus name are required' });
      return;
    }

    // Create bus and generate seat layout automatically
    const bus = await prisma.$transaction(async (tx) => {
      const createdBus = await tx.bus.create({
        data: {
          registrationNumber: registrationNumber.toUpperCase().trim(),
          name,
          busType,
          totalSeats: Number(totalSeats),
          layoutType,
          operatorId,
        },
      });

      // Generate seats based on layout
      const seatsToCreate = [];
      const colsPerRow = layoutType === '2x1' ? 3 : 4;
      const totalRows = Math.ceil(totalSeats / colsPerRow);
      const colLetters = layoutType === '2x1' ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];

      let seatCount = 0;
      for (let r = 1; r <= totalRows && seatCount < totalSeats; r++) {
        for (let c = 0; c < colLetters.length && seatCount < totalSeats; c++) {
          seatCount++;
          const seatNumber = `${r}${colLetters[c]}`;
          // Designate row 1 as women-preferred or front
          const isWomenOnly = r === 1;

          seatsToCreate.push({
            seatNumber,
            deck: 'LOWER',
            seatType: busType.includes('SLEEPER') ? 'SLEEPER' : 'SEATER',
            isWomenOnly,
            row: r,
            column: c + 1,
            busId: createdBus.id,
          });
        }
      }

      await tx.seat.createMany({
        data: seatsToCreate,
      });

      return createdBus;
    });

    await logAuditEvent({
      action: 'BUS_CREATED',
      entity: 'BUS',
      entityId: bus.id,
      userId: req.user?.id,
      details: { name: bus.name, regNo: bus.registrationNumber, seats: totalSeats },
    });

    res.status(201).json({
      success: true,
      message: 'Bus and seat layout created successfully',
      data: bus,
    });
  } catch (error: any) {
    console.error('Create bus error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getOperatorRoutes(_req: Request, res: Response): Promise<void> {
  try {
    const routes = await prisma.route.findMany({
      include: {
        routeStops: {
          include: { stop: true },
          orderBy: { sequence: 'asc' },
        },
        _count: { select: { trips: true } },
      },
      orderBy: { origin: 'asc' },
    });

    res.json({
      success: true,
      data: routes,
    });
  } catch (error: any) {
    console.error('Get routes error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function createRoute(req: Request, res: Response): Promise<void> {
  try {
    const { origin, destination, distanceKm, estimatedMinutes, stops = [] } = req.body;

    if (!origin || !destination) {
      res.status(400).json({ success: false, message: 'Origin and destination are required' });
      return;
    }

    const route = await prisma.$transaction(async (tx) => {
      const createdRoute = await tx.route.create({
        data: {
          origin: origin.trim(),
          destination: destination.trim(),
          distanceKm: parseFloat(distanceKm) || 100,
          estimatedMinutes: parseInt(estimatedMinutes, 10) || 120,
        },
      });

      // If stops provided, create stops and route stops
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        let stop = await tx.stop.findFirst({
          where: { name: s.name, city: s.city || origin },
        });

        if (!stop) {
          stop = await tx.stop.create({
            data: {
              name: s.name,
              city: s.city || (i === 0 ? origin : destination),
              landmark: s.landmark || null,
            },
          });
        }

        await tx.routeStop.create({
          data: {
            routeId: createdRoute.id,
            stopId: stop.id,
            sequence: i + 1,
            stopType: s.stopType || (i === 0 ? 'BOARDING' : i === stops.length - 1 ? 'DROPPING' : 'BOTH'),
            timeFromStartMinutes: s.timeFromStartMinutes || i * 30,
          },
        });
      }

      return createdRoute;
    });

    await logAuditEvent({
      action: 'ROUTE_CREATED',
      entity: 'ROUTE',
      entityId: route.id,
      userId: req.user?.id,
      details: { origin, destination },
    });

    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: route,
    });
  } catch (error: any) {
    console.error('Create route error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getOperatorTrips(req: Request, res: Response): Promise<void> {
  try {
    const operatorId = req.user?.operatorId || undefined;

    const trips: any = await prisma.trip.findMany({
      where: operatorId ? { bus: { operatorId } } : {},
      include: {
        bus: { include: { operator: true } },
        route: true,
        bookings: {
          where: { status: 'CONFIRMED' },
          include: { bookingSeats: true },
        },
        disruptions: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
      orderBy: { departureTime: 'desc' },
    });

    const formatted = trips.map((t: any) => {
      const bookedSeatsCount = t.bookings.reduce((sum: number, b: any) => sum + b.bookingSeats.length, 0);
      const occupancyRate = Math.round((bookedSeatsCount / t.bus.totalSeats) * 100);
      const revenue = t.bookings.reduce((sum: number, b: any) => sum + b.totalAmount, 0);

      return {
        id: t.id,
        busName: t.bus.name,
        busReg: t.bus.registrationNumber,
        busType: t.bus.busType,
        routeOrigin: t.route.origin,
        routeDestination: t.route.destination,
        departureTime: t.departureTime,
        arrivalTime: t.arrivalTime,
        basePrice: t.basePrice,
        status: t.status,
        totalSeats: t.bus.totalSeats,
        bookedSeatsCount,
        availableSeats: t.bus.totalSeats - bookedSeatsCount,
        occupancyRate,
        revenue,
        hasDisruption: t.disruptions.length > 0,
      };
    });

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error('Get trips error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function createTrip(req: Request, res: Response): Promise<void> {
  try {
    const { busId, routeId, departureTime, arrivalTime, basePrice } = req.body;

    if (!busId || !routeId || !departureTime || !arrivalTime || !basePrice) {
      res.status(400).json({ success: false, message: 'All trip parameters are required' });
      return;
    }

    const trip = await prisma.trip.create({
      data: {
        busId,
        routeId,
        departureTime: new Date(departureTime),
        arrivalTime: new Date(arrivalTime),
        basePrice: parseFloat(basePrice),
        status: 'SCHEDULED',
      },
      include: {
        bus: true,
        route: true,
      },
    });

    await logAuditEvent({
      action: 'TRIP_SCHEDULED',
      entity: 'TRIP',
      entityId: trip.id,
      userId: req.user?.id,
      details: {
        bus: trip.bus.name,
        route: `${trip.route.origin} -> ${trip.route.destination}`,
        departureTime: trip.departureTime,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Trip scheduled successfully',
      data: trip,
    });
  } catch (error: any) {
    console.error('Create trip error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getPassengerManifest(req: Request, res: Response): Promise<void> {
  try {
    const tripId = String(req.params.tripId);

    const trip: any = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        bus: { include: { operator: true } },
        route: {
          include: {
            routeStops: {
              include: { stop: true },
              orderBy: { sequence: 'asc' },
            },
          },
        },
        bookings: {
          where: { status: 'CONFIRMED' },
          include: {
            bookingSeats: {
              where: { status: 'CONFIRMED' },
              include: { seat: true },
            },
          },
        },
      },
    });

    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    // Flatten manifest records for conductor/operator report
    const manifestRows = [];
    for (const booking of trip.bookings) {
      for (const bs of booking.bookingSeats) {
        manifestRows.push({
          bookingId: booking.id,
          pnr: booking.pnr,
          seatNumber: bs.seat.seatNumber,
          deck: bs.seat.deck,
          passengerName: bs.passengerName,
          passengerAge: bs.passengerAge,
          passengerGender: bs.passengerGender,
          contactEmail: booking.contactEmail,
          contactPhone: booking.contactPhone,
          bookingDate: booking.bookingDate,
          fare: bs.seatPrice,
          boardingStatus: 'CONFIRMED',
        });
      }
    }

    manifestRows.sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true }));

    res.json({
      success: true,
      data: {
        tripDetails: {
          id: trip.id,
          busName: trip.bus.name,
          busReg: trip.bus.registrationNumber,
          operatorName: trip.bus.operator.name,
          origin: trip.route.origin,
          destination: trip.route.destination,
          departureTime: trip.departureTime,
          arrivalTime: trip.arrivalTime,
          totalCapacity: trip.bus.totalSeats,
          manifestCount: manifestRows.length,
          occupancyRate: Math.round((manifestRows.length / trip.bus.totalSeats) * 100),
        },
        manifest: manifestRows,
      },
    });
  } catch (error: any) {
    console.error('Get manifest error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function reportDisruption(req: Request, res: Response): Promise<void> {
  try {
    const tripId = String(req.params.tripId);
    const { disruptionType = 'DELAY', revisedDeparture, reason = 'Traffic disruption' } = req.body;

    const result = await processTripDisruption({
      tripId,
      disruptionType,
      revisedDeparture: revisedDeparture ? new Date(revisedDeparture) : undefined,
      reason,
      userId: req.user?.id,
    });

    res.json({
      success: true,
      message: 'Trip disruption logged and Journey Recovery Engine activated',
      data: result,
    });
  } catch (error: any) {
    console.error('Report disruption error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const operatorId = req.user?.operatorId || undefined;

    const trips: any = await prisma.trip.findMany({
      where: operatorId ? { bus: { operatorId } } : {},
      include: {
        bus: true,
        route: true,
        bookings: {
          include: {
            bookingSeats: true,
          },
        },
      },
    });

    // Route occupancy comparison
    const routeMap = new Map<string, { totalSeats: number; bookedSeats: number; revenue: number }>();
    trips.forEach((t: any) => {
      const key = `${t.route.origin} → ${t.route.destination}`;
      const confirmed = t.bookings.filter((b: any) => b.status === 'CONFIRMED');
      const booked = confirmed.reduce((sum: number, b: any) => sum + b.bookingSeats.length, 0);
      const rev = confirmed.reduce((sum: number, b: any) => sum + b.totalAmount, 0);

      const existing = routeMap.get(key) || { totalSeats: 0, bookedSeats: 0, revenue: 0 };
      existing.totalSeats += t.bus.totalSeats;
      existing.bookedSeats += booked;
      existing.revenue += rev;
      routeMap.set(key, existing);
    });

    const routePerformance = Array.from(routeMap.entries()).map(([route, data]) => ({
      route,
      totalSeats: data.totalSeats,
      bookedSeats: data.bookedSeats,
      revenue: Math.round(data.revenue),
      occupancyPercent: data.totalSeats > 0 ? Math.round((data.bookedSeats / data.totalSeats) * 100) : 0,
    }));

    res.json({
      success: true,
      data: {
        routePerformance,
      },
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
