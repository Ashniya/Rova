import { Request, Response } from 'express';
import prisma from '../prisma';
import { logAuditEvent } from '../services/auditService';

// Generates a human-friendly unique 8-character PNR like ROVA-9H42K
function generatePNR(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let pnr = 'RV';
  for (let i = 0; i < 6; i++) {
    pnr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pnr;
}

export async function createBooking(req: Request, res: Response): Promise<void> {
  try {
    const {
      tripId,
      passengers, // Array of { seatId, passengerName, passengerAge, passengerGender }
      contactEmail,
      contactPhone,
      primaryPassengerName,
      paymentMethod = 'CARD',
    } = req.body;

    if (!tripId || !passengers || !Array.isArray(passengers) || passengers.length === 0) {
      res.status(400).json({ success: false, message: 'tripId and at least one passenger seat are required' });
      return;
    }

    if (!contactEmail || !contactPhone) {
      res.status(400).json({ success: false, message: 'Contact email and phone number are required' });
      return;
    }

    const seatIds = passengers.map((p) => p.seatId);

    // Atomic transaction to ensure seat integrity and prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // 1. Fetch trip to get basePrice and verify it exists
      const trip = await tx.trip.findUnique({
        where: { id: tripId },
        include: { bus: true, route: true },
      });

      if (!trip) {
        throw new Error('TRIP_NOT_FOUND');
      }

      if (trip.status === 'CANCELLED') {
        throw new Error('TRIP_CANCELLED');
      }

      // 2. Query any existing active/confirmed bookings for these exact seats on this trip
      const conflictingBookings = await tx.bookingSeat.findMany({
        where: {
          tripId,
          seatId: { in: seatIds },
          status: 'CONFIRMED',
          booking: {
            status: 'CONFIRMED',
          },
        },
        include: {
          seat: true,
        },
      });

      if (conflictingBookings.length > 0) {
        const bookedSeatNumbers = conflictingBookings.map((c) => c.seat.seatNumber).join(', ');
        const error: any = new Error(`SEAT_CONFLICT: Seat(s) ${bookedSeatNumbers} were just booked by another passenger. Please select another seat.`);
        error.code = 'SEAT_CONFLICT';
        error.conflictingSeats = conflictingBookings.map((c) => c.seat.seatNumber);
        throw error;
      }

      // 3. Calculate total amount
      const totalAmount = trip.basePrice * passengers.length;
      const pnr = generatePNR();

      // 4. Create the Booking
      const booking = await tx.booking.create({
        data: {
          pnr,
          tripId,
          userId: req.user?.id || null,
          passengerName: primaryPassengerName || passengers[0].passengerName,
          contactEmail,
          contactPhone,
          totalAmount,
          status: 'CONFIRMED',
        },
      });

      // 5. Create Booking Seats
      for (const p of passengers) {
        await tx.bookingSeat.create({
          data: {
            bookingId: booking.id,
            tripId,
            seatId: p.seatId,
            passengerName: p.passengerName,
            passengerAge: parseInt(p.passengerAge, 10) || 25,
            passengerGender: p.passengerGender || 'OTHER',
            seatPrice: trip.basePrice,
            status: 'CONFIRMED',
          },
        });
      }

      // 6. Create simulated payment record
      const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const payment = await tx.payment.create({
        data: {
          bookingId: booking.id,
          transactionId,
          amount: totalAmount,
          paymentMethod,
          status: 'SUCCESS',
        },
      });

      return { booking, payment, trip };
    });

    // 7. Write audit log
    await logAuditEvent({
      action: 'BOOKING_CONFIRMED',
      entity: 'BOOKING',
      entityId: result.booking.id,
      userId: req.user?.id || null,
      details: {
        pnr: result.booking.pnr,
        seatsCount: passengers.length,
        seatIds,
        totalAmount: result.booking.totalAmount,
      },
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        pnr: result.booking.pnr,
        bookingId: result.booking.id,
        totalAmount: result.booking.totalAmount,
        seatsCount: passengers.length,
        transactionId: result.payment.transactionId,
        tripSummary: {
          origin: result.trip.route.origin,
          destination: result.trip.route.destination,
          departureTime: result.trip.departureTime,
          busName: result.trip.bus.name,
        },
      },
    });
  } catch (error: any) {
    if (error.code === 'SEAT_CONFLICT') {
      res.status(409).json({
        success: false,
        message: error.message,
        conflictingSeats: error.conflictingSeats,
      });
      return;
    }

    if (error.message === 'TRIP_NOT_FOUND') {
      res.status(404).json({ success: false, message: 'Trip not found' });
      return;
    }

    if (error.message === 'TRIP_CANCELLED') {
      res.status(400).json({ success: false, message: 'Cannot book seats on a cancelled trip' });
      return;
    }

    console.error('Create booking error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getBookingByPNR(req: Request, res: Response): Promise<void> {
  try {
    const pnr = String(req.params.pnr).toUpperCase();

    const booking = await prisma.booking.findUnique({
      where: { pnr },
      include: {
        trip: {
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
          },
        },
        bookingSeats: {
          include: { seat: true },
        },
        payment: true,
        refund: true,
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: `No booking found for PNR: ${pnr}` });
      return;
    }

    // Cancellation policy calculation for this booking
    const departureTime = new Date(booking.trip.departureTime);
    const now = new Date();
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 3600);

    let refundPercentage = 0;
    let cancellationRuleDescription = 'Non-refundable (< 12 hours before departure)';

    if (hoursUntilDeparture > 24) {
      refundPercentage = 90;
      cancellationRuleDescription = '90% refund (> 24 hours before departure; 10% processing fee)';
    } else if (hoursUntilDeparture >= 12) {
      refundPercentage = 50;
      cancellationRuleDescription = '50% refund (12–24 hours before departure; 50% cancellation fee)';
    }

    const estimatedRefund = (booking.totalAmount * refundPercentage) / 100;
    const estimatedDeduction = booking.totalAmount - estimatedRefund;

    res.json({
      success: true,
      data: {
        ...booking,
        cancellationEstimate: {
          hoursUntilDeparture: Math.round(hoursUntilDeparture * 10) / 10,
          canCancel: booking.status === 'CONFIRMED' && hoursUntilDeparture > 0,
          refundPercentage,
          estimatedRefund,
          estimatedDeduction,
          rule: cancellationRuleDescription,
        },
      },
    });
  } catch (error: any) {
    console.error('Get booking error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function cancelBooking(req: Request, res: Response): Promise<void> {
  try {
    const pnr = String(req.params.pnr).toUpperCase();
    const { reason = 'Customer requested cancellation' } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { pnr },
      include: {
        trip: true,
        bookingSeats: true,
        payment: true,
        refund: true,
      },
    });

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    if (booking.status === 'CANCELLED') {
      res.status(400).json({ success: false, message: 'Booking is already cancelled' });
      return;
    }

    // Calculate refund based on configurable time rules
    const departureTime = new Date(booking.trip.departureTime);
    const now = new Date();
    const hoursUntilDeparture = (departureTime.getTime() - now.getTime()) / (1000 * 3600);

    let refundPercentage = 0;
    if (hoursUntilDeparture > 24) {
      refundPercentage = 90;
    } else if (hoursUntilDeparture >= 12) {
      refundPercentage = 50;
    } else {
      refundPercentage = 0;
    }

    const refundAmount = Math.round(((booking.totalAmount * refundPercentage) / 100) * 100) / 100;
    const deductionAmount = Math.round((booking.totalAmount - refundAmount) * 100) / 100;

    // Execute cancellation in transaction
    const cancelledResult = await prisma.$transaction(async (tx) => {
      // 1. Update Booking status to CANCELLED
      const updatedBooking = await tx.booking.update({
        where: { id: booking.id },
        data: { status: 'CANCELLED' },
      });

      // 2. Update all BookingSeats to CANCELLED (restores seat availability immediately!)
      await tx.bookingSeat.updateMany({
        where: { bookingId: booking.id },
        data: { status: 'CANCELLED' },
      });

      // 3. Create simulated Refund record
      const refund = await tx.refund.create({
        data: {
          bookingId: booking.id,
          refundAmount,
          deductionAmount,
          cancellationReason: reason,
          status: 'PROCESSED',
        },
      });

      return { updatedBooking, refund };
    });

    // 4. Write audit log
    await logAuditEvent({
      action: 'BOOKING_CANCELLED',
      entity: 'BOOKING',
      entityId: booking.id,
      userId: req.user?.id || null,
      details: {
        pnr: booking.pnr,
        originalAmount: booking.totalAmount,
        refundAmount,
        deductionAmount,
        refundPercentage,
        seatsReleased: booking.bookingSeats.length,
        reason,
      },
      ipAddress: req.ip,
    });

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been restored to available inventory.',
      data: {
        pnr: booking.pnr,
        status: 'CANCELLED',
        refund: {
          refundAmount,
          deductionAmount,
          refundPercentage,
          status: 'PROCESSED',
          policyApplied:
            hoursUntilDeparture > 24
              ? '> 24 hrs before departure (90% refund)'
              : hoursUntilDeparture >= 12
              ? '12-24 hrs before departure (50% refund)'
              : '< 12 hrs before departure (0% refund)',
        },
      },
    });
  } catch (error: any) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}

export async function getUserBookings(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: {
        trip: {
          include: {
            bus: { include: { operator: true } },
            route: true,
          },
        },
        bookingSeats: {
          include: { seat: true },
        },
        refund: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error: any) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
}
