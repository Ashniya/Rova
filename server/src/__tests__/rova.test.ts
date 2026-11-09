import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index';
import prisma from '../prisma';

describe('Rova Bus Booking Management System - Acceptance Tests', () => {
  let demoTripId: string;
  let testSeatId1: string;
  let testSeatId2: string;
  let operatorToken: string;
  let createdPnr: string;

  beforeAll(async () => {
    // 1. Authenticate as Operator to obtain JWT token
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'operator@silkroad.com', password: 'operator123' });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.data.token).toBeDefined();
    operatorToken = loginRes.body.data.token;

    // Find a scheduled trip departing at least 24 hours in future (to test >24h 90% refund rule)
    const tripsRes = await request(app).get('/api/trips');
    expect(tripsRes.status).toBe(200);
    expect(tripsRes.body.data.length).toBeGreaterThan(0);

    const futureTrip = tripsRes.body.data.find((t: any) => {
      const hours = (new Date(t.departureTime).getTime() - Date.now()) / (1000 * 3600);
      return hours > 24;
    }) || tripsRes.body.data[0];

    demoTripId = futureTrip.id;

    // Fetch trip details to get available seats
    const tripDetail = await request(app).get(`/api/trips/${demoTripId}`);
    expect(tripDetail.status).toBe(200);
    const availableSeats = tripDetail.body.data.seats.filter((s: any) => s.isAvailable);
    expect(availableSeats.length).toBeGreaterThanOrEqual(2);

    testSeatId1 = availableSeats[0].id;
    testSeatId2 = availableSeats[1].id;
  });

  // Acceptance Test 1: A passenger can search a valid trip and book an available seat.
  it('Acceptance Criteria 1: Passenger can search valid trip and book an available seat', async () => {
    const bookingPayload = {
      tripId: demoTripId,
      passengers: [
        {
          seatId: testSeatId1,
          passengerName: 'Dilshod Aliyev',
          passengerAge: 29,
          passengerGender: 'MALE',
        },
      ],
      contactEmail: 'dilshod@example.com',
      contactPhone: '+998 90 111 22 33',
      paymentMethod: 'CARD',
    };

    const res = await request(app).post('/api/bookings').send(bookingPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.pnr).toBeDefined();
    expect(res.body.data.pnr.length).toBeGreaterThanOrEqual(6);
    expect(res.body.data.transactionId).toBeDefined();

    createdPnr = res.body.data.pnr;
  });

  // Acceptance Test 2: Two users cannot confirm the same seat on one trip (Concurrency test).
  it('Acceptance Criteria 2: Two users cannot confirm the same seat on one trip (Race condition prevention)', async () => {
    // Attempt two simultaneous booking requests for the exact same seat (testSeatId2)
    const request1 = request(app).post('/api/bookings').send({
      tripId: demoTripId,
      passengers: [
        {
          seatId: testSeatId2,
          passengerName: 'Candidate User Alpha',
          passengerAge: 25,
          passengerGender: 'MALE',
        },
      ],
      contactEmail: 'alpha@example.com',
      contactPhone: '+998 91 100 20 30',
    });

    const request2 = request(app).post('/api/bookings').send({
      tripId: demoTripId,
      passengers: [
        {
          seatId: testSeatId2,
          passengerName: 'Candidate User Beta',
          passengerAge: 27,
          passengerGender: 'FEMALE',
        },
      ],
      contactEmail: 'beta@example.com',
      contactPhone: '+998 91 200 30 40',
    });

    // Execute simultaneously
    const [res1, res2] = await Promise.all([request1, request2]);

    // Exactly one must succeed (201) and the other must be rejected with 409 Conflict
    const statuses = [res1.status, res2.status];
    expect(statuses).toContain(201);
    expect(statuses).toContain(409);

    const conflictResponse = res1.status === 409 ? res1 : res2;
    expect(conflictResponse.body.success).toBe(false);
    expect(conflictResponse.body.message).toMatch(/booked by another passenger|SEAT_CONFLICT/i);
  });

  // Acceptance Test 3: The PNR includes correct passenger, route, date and seat details.
  it('Acceptance Criteria 3: PNR ticket contains exact passenger, route, date and seat details', async () => {
    expect(createdPnr).toBeDefined();

    const res = await request(app).get(`/api/bookings/${createdPnr}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const ticket = res.body.data;
    expect(ticket.pnr).toBe(createdPnr);
    expect(ticket.contactEmail).toBe('dilshod@example.com');
    expect(ticket.trip).toBeDefined();
    expect(ticket.trip.route.origin).toBeDefined();
    expect(ticket.trip.route.destination).toBeDefined();
    expect(ticket.trip.departureTime).toBeDefined();
    expect(ticket.bookingSeats.length).toBe(1);
    expect(ticket.bookingSeats[0].passengerName).toBe('Dilshod Aliyev');
    expect(ticket.bookingSeats[0].seatId).toBe(testSeatId1);
  });

  // Acceptance Test 4: Cancellation changes seat availability and refund status according to the rule.
  it('Acceptance Criteria 4: Cancellation restores seat availability and calculates refund rule correctly', async () => {
    // 1. Cancel the booking created in test 1
    const cancelRes = await request(app)
      .post(`/api/bookings/${createdPnr}/cancel`)
      .send({ reason: 'Trip rescheduled by customer' });

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body.success).toBe(true);
    expect(cancelRes.body.data.status).toBe('CANCELLED');
    expect(cancelRes.body.data.refund).toBeDefined();
    expect(cancelRes.body.data.refund.status).toBe('PROCESSED');
    expect(cancelRes.body.data.refund.refundAmount).toBeGreaterThan(0);

    // 2. Verify that seat is now available again for booking
    const tripDetailAfterCancel = await request(app).get(`/api/trips/${demoTripId}`);
    const seatAfterCancel = tripDetailAfterCancel.body.data.seats.find((s: any) => s.id === testSeatId1);

    expect(seatAfterCancel).toBeDefined();
    expect(seatAfterCancel.isAvailable).toBe(true);
    expect(seatAfterCancel.status).toBe('AVAILABLE');
  });

  // Acceptance Test 5: Operator manifest and occupancy summaries reconcile with confirmed tickets.
  it('Acceptance Criteria 5: Operator manifest reconciles with active confirmed tickets', async () => {
    const manifestRes = await request(app)
      .get(`/api/operator/manifest/${demoTripId}`)
      .set('Authorization', `Bearer ${operatorToken}`);

    expect(manifestRes.status).toBe(200);
    expect(manifestRes.body.success).toBe(true);
    expect(manifestRes.body.data.tripDetails).toBeDefined();
    expect(manifestRes.body.data.manifest).toBeInstanceOf(Array);

    // Compare manifest count with confirmed bookingSeats in DB for this trip
    const activeConfirmedCount = await prisma.bookingSeat.count({
      where: {
        tripId: demoTripId,
        status: 'CONFIRMED',
        booking: { status: 'CONFIRMED' },
      },
    });

    expect(manifestRes.body.data.manifest.length).toBe(activeConfirmedCount);
  });
});
