import prisma from '../prisma';
import { logAuditEvent } from './auditService';

export interface DisruptionInput {
  tripId: string;
  disruptionType: 'DELAY' | 'CANCELLATION' | 'BREAKDOWN' | 'ROUTE_DIVERSION';
  revisedDeparture?: Date;
  reason: string;
  userId?: string;
}

export async function processTripDisruption(input: DisruptionInput) {
  const trip = await prisma.trip.findUnique({
    where: { id: input.tripId },
    include: {
      route: true,
      bus: true,
      bookings: {
        where: { status: 'CONFIRMED' },
        include: { bookingSeats: true },
      },
    },
  });

  if (!trip) {
    throw new Error('Trip not found');
  }

  // Update trip status
  const updatedStatus = input.disruptionType === 'CANCELLATION' ? 'CANCELLED' : 'DELAYED';
  await prisma.trip.update({
    where: { id: input.tripId },
    data: { status: updatedStatus },
  });

  // Create disruption record
  const disruption = await prisma.disruption.create({
    data: {
      tripId: input.tripId,
      disruptionType: input.disruptionType,
      originalDeparture: trip.departureTime,
      revisedDeparture: input.revisedDeparture || null,
      reason: input.reason,
      status: 'ACTIVE',
    },
  });

  // Journey Recovery Engine: Find alternative trips on the same route or nearby departures
  const alternativeTrips = await prisma.trip.findMany({
    where: {
      routeId: trip.routeId,
      id: { not: trip.id },
      status: { in: ['SCHEDULED', 'ON_TIME'] },
      departureTime: {
        gte: new Date(Date.now() - 3600 * 1000), // departing shortly or in future
        lte: new Date(trip.departureTime.getTime() + 24 * 3600 * 1000), // up to 24h later
      },
    },
    include: {
      bus: true,
      route: true,
      bookings: {
        where: { status: 'CONFIRMED' },
        include: { bookingSeats: true },
      },
    },
    take: 3,
  });

  // Generate recovery options for passengers
  const recoveryOptionsData = [];
  for (const altTrip of alternativeTrips) {
    const bookedSeatsCount = altTrip.bookings.reduce((sum, b) => sum + b.bookingSeats.length, 0);
    const availableSeats = altTrip.bus.totalSeats - bookedSeatsCount;

    if (availableSeats > 0) {
      recoveryOptionsData.push({
        disruptionId: disruption.id,
        originalTripId: trip.id,
        alternativeTripId: altTrip.id,
        compensationOffered: input.disruptionType === 'CANCELLATION' 
          ? 'Free Seat Transfer + $10 Meal Voucher' 
          : 'Free Delay Care Pack + 15% Travel Credit',
        autoTransferEligible: true,
        notes: `Next available bus: ${altTrip.bus.name} (${availableSeats} seats available). Departure: ${altTrip.departureTime.toISOString()}`,
      });
    }
  }

  // If no alternative trips found or in addition, record a full refund recovery option
  if (recoveryOptionsData.length === 0) {
    recoveryOptionsData.push({
      disruptionId: disruption.id,
      originalTripId: trip.id,
      alternativeTripId: 'REFUND_VOUCHER',
      compensationOffered: '100% Immediate Automated Refund + 25% Goodwill Voucher',
      autoTransferEligible: false,
      notes: 'No alternative bus available within 24 hours. Full refund initiated.',
    });
  }

  for (const opt of recoveryOptionsData) {
    await prisma.recoveryOption.create({ data: opt });
  }

  await logAuditEvent({
    action: 'TRIP_DISRUPTION_PROCESSED',
    entity: 'TRIP',
    entityId: trip.id,
    userId: input.userId,
    details: {
      disruptionId: disruption.id,
      type: input.disruptionType,
      reason: input.reason,
      affectedBookings: trip.bookings.length,
      recoveryOptionsCount: recoveryOptionsData.length,
    },
  });

  return {
    disruption,
    affectedBookings: trip.bookings.length,
    recoveryOptions: await prisma.recoveryOption.findMany({
      where: { disruptionId: disruption.id },
    }),
  };
}
