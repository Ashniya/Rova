import { Request, Response } from 'express';
import prisma from '../prisma';

export async function searchTrips(req: Request, res: Response): Promise<void> {
  try {
    const { origin, destination, date, busType, maxPrice, operatorId } = req.query;

    const whereClause: any = {
      status: { in: ['SCHEDULED', 'ON_TIME', 'DELAYED'] },
    };

    if (origin || destination) {
      whereClause.route = {};
      if (origin) {
        whereClause.route.origin = {
          contains: String(origin),
        };
      }
      if (destination) {
        whereClause.route.destination = {
          contains: String(destination),
        };
      }
    }

    if (date) {
      const searchDate = new Date(String(date));
      const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));
      whereClause.departureTime = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    if (busType) {
      whereClause.bus = {
        ...(whereClause.bus || {}),
        busType: String(busType),
      };
    }

    if (operatorId) {
      whereClause.bus = {
        ...(whereClause.bus || {}),
        operatorId: String(operatorId),
      };
    }

    if (maxPrice) {
      whereClause.basePrice = {
        lte: parseFloat(String(maxPrice)),
      };
    }

    const trips = await prisma.trip.findMany({
      where: whereClause,
      include: {
        bus: {
          include: {
            operator: true,
          },
        },
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
          include: { bookingSeats: { where: { status: 'CONFIRMED' } } },
        },
        disruptions: {
          where: { status: 'ACTIVE' },
          take: 1,
        },
      },
      orderBy: { departureTime: 'asc' },
    });

    // Transform trips to include available seat count & duration
    const formattedTrips = trips.map((trip) => {
      const bookedSeatsCount = trip.bookings.reduce((acc, b) => acc + b.bookingSeats.length, 0);
      const availableSeats = Math.max(0, trip.bus.totalSeats - bookedSeatsCount);
      const durationMinutes = Math.round(
        (trip.arrivalTime.getTime() - trip.departureTime.getTime()) / (1000 * 60)
      );

      return {
        id: trip.id,
        busId: trip.busId,
        busName: trip.bus.name,
        busType: trip.bus.busType,
        layoutType: trip.bus.layoutType,
        registrationNumber: trip.bus.registrationNumber,
        operator: {
          id: trip.bus.operator.id,
          name: trip.bus.operator.name,
          code: trip.bus.operator.code,
          rating: trip.bus.operator.rating,
        },
        route: {
          id: trip.route.id,
          origin: trip.route.origin,
          destination: trip.route.destination,
          distanceKm: trip.route.distanceKm,
          stops: trip.route.routeStops.map((rs) => ({
            id: rs.stop.id,
            name: rs.stop.name,
            city: rs.stop.city,
            stopType: rs.stopType,
            sequence: rs.sequence,
            timeFromStartMinutes: rs.timeFromStartMinutes,
          })),
        },
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        durationMinutes,
        basePrice: trip.basePrice,
        status: trip.status,
        totalSeats: trip.bus.totalSeats,
        bookedSeatsCount,
        availableSeats,
        activeDisruption: trip.disruptions[0] || null,
      };
    });

    res.json({
      success: true,
      count: formattedTrips.length,
      data: formattedTrips,
    });
  } catch (error: any) {
    console.error('Search trips error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getTripById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);

    const trip: any = await prisma.trip.findUnique({
      where: { id },
      include: {
        bus: {
          include: {
            operator: true,
            seats: {
              orderBy: [{ row: 'asc' }, { column: 'asc' }],
            },
          },
        },
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
            },
          },
        },
        disruptions: {
          where: { status: 'ACTIVE' },
          include: { recoveryOptions: true },
        },
      },
    });

    if (!trip) {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    // Build map of booked seat IDs and genders
    const bookedSeatMap = new Map<string, { gender: string; passengerName: string }>();
    trip.bookings.forEach((b: any) => {
      b.bookingSeats.forEach((bs: any) => {
        bookedSeatMap.set(bs.seatId, {
          gender: bs.passengerGender,
          passengerName: bs.passengerName,
        });
      });
    });

    // Enhance seats with real-time status
    const seatsWithStatus = trip.bus.seats.map((seat: any) => {
      const bookedInfo = bookedSeatMap.get(seat.id);
      return {
        id: seat.id,
        seatNumber: seat.seatNumber,
        deck: seat.deck,
        seatType: seat.seatType,
        isWomenOnly: seat.isWomenOnly,
        row: seat.row,
        column: seat.column,
        isAvailable: !bookedInfo,
        status: bookedInfo ? 'BOOKED' : 'AVAILABLE',
        occupiedByGender: bookedInfo ? bookedInfo.gender : null,
        price: trip.basePrice,
      };
    });

    const boardingPoints = trip.route.routeStops
      .filter((rs: any) => rs.stopType === 'BOARDING' || rs.stopType === 'BOTH')
      .map((rs: any) => ({
        id: rs.stop.id,
        name: rs.stop.name,
        city: rs.stop.city,
        landmark: rs.stop.landmark,
        minutes: rs.timeFromStartMinutes,
      }));

    const droppingPoints = trip.route.routeStops
      .filter((rs: any) => rs.stopType === 'DROPPING' || rs.stopType === 'BOTH')
      .map((rs: any) => ({
        id: rs.stop.id,
        name: rs.stop.name,
        city: rs.stop.city,
        landmark: rs.stop.landmark,
        minutes: rs.timeFromStartMinutes,
      }));

    res.json({
      success: true,
      data: {
        id: trip.id,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        basePrice: trip.basePrice,
        status: trip.status,
        bus: {
          id: trip.bus.id,
          name: trip.bus.name,
          busType: trip.bus.busType,
          layoutType: trip.bus.layoutType,
          registrationNumber: trip.bus.registrationNumber,
          totalSeats: trip.bus.totalSeats,
        },
        operator: trip.bus.operator,
        route: {
          id: trip.route.id,
          origin: trip.route.origin,
          destination: trip.route.destination,
          distanceKm: trip.route.distanceKm,
        },
        boardingPoints,
        droppingPoints,
        seats: seatsWithStatus,
        availableSeatsCount: seatsWithStatus.filter((s: any) => s.isAvailable).length,
        disruption: trip.disruptions[0] || null,
      },
    });
  } catch (error: any) {
    console.error('Get trip error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getPopularLocations(_req: Request, res: Response): Promise<void> {
  try {
    const routes = await prisma.route.findMany({
      select: { origin: true, destination: true },
    });

    const origins = Array.from(new Set(routes.map((r) => r.origin)));
    const destinations = Array.from(new Set(routes.map((r) => r.destination)));
    const allCities = Array.from(new Set([...origins, ...destinations]));

    res.json({
      success: true,
      data: {
        origins,
        destinations,
        allCities,
      },
    });
  } catch (error: any) {
    console.error('Locations error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
