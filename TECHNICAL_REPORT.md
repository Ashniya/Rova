# Rova — Bus Booking Management System: Technical Report

**Candidate Role:** Full-Stack Web Development Intern  
**Company Assessment:** ALGIONS AI LABS PRIVATE LIMITED  
**Assigned Project:** Bus Booking Management System ("Rova")  
**Brand Motto:** *Rova — Where routes become journeys.*  

---

## 1. Executive Summary

Rova is an enterprise-grade full-stack bus booking management platform built with React 19, TypeScript, Vite, Tailwind CSS, Node.js (Express 5), and Prisma ORM. It enables passengers to search intercity travel routes, inspect real-time bus layouts, select seats, and purchase verified digital boarding passes with unique PNR codes. Concurrently, it equips operational staff, conductors, and fleet managers with route scheduling tools, interactive passenger manifests, and real-time revenue and seat occupancy analytics.

The system was crafted following the provided modern UI reference design (featuring high-impact green brand accents, an interactive floating boarding pass card, city-swapping trip search widgets, and detailed seat mapping).

---

## 2. Key Architecture & Design Decisions

### 2.1 Monorepo Separation of Concerns
The application follows a modular architecture separating persistence, business logic, and user presentation:
- **`server/`**: Express API built with TypeScript. Follows the Controller-Service-Repository pattern. Prisma ORM handles strongly typed data access and database migrations.
- **`client/`**: Modern React single-page application built with Vite and Tailwind CSS. TanStack Query manages asynchronous server state caching, optimistic updates, and background refetching.

```
Client (React + Vite + Tailwind)
   │
   ▼ HTTP / REST (OpenAPI 3.0 Contract)
Express 5 Application (Helmet, Rate Limiter, CORS)
   │
   ├─► Authentication & RBAC Middleware (JWT + bcrypt)
   ├─► Booking Controller (Prisma $transaction Atomic Lock)
   ├─► Journey Recovery Engine (Automatic Disruption Alternative Matching)
   ├─► Operator Controller (Manifest Generation & Fleet Management)
   └─► Audit Service (Cryptographic Business Trail)
         │
         ▼
Prisma ORM Layer
         │
         ▼
PostgreSQL / SQLite Storage Engine
```

---

## 3. Critical Business Rules & Integrity Mechanisms

### 3.1 Seat Integrity & Race Condition Prevention (Acceptance Criteria 2)
The most critical failure mode in ticketing applications is double-booking: when two users concurrently attempt to confirm the same seat on the same trip.

**Solution Mechanism:**
1. All booking creations execute inside a strict database transaction (`prisma.$transaction(async (tx) => { ... })`).
2. Inside the transaction boundary:
   ```ts
   const conflictingBookings = await tx.bookingSeat.findMany({
     where: {
       tripId,
       seatId: { in: seatIds },
       status: 'CONFIRMED',
       booking: { status: 'CONFIRMED' },
     },
     include: { seat: true },
   });

   if (conflictingBookings.length > 0) {
     const error = new Error('SEAT_CONFLICT');
     error.code = 'SEAT_CONFLICT';
     throw error; // Automatically rolls back transaction
   }
   ```
3. A compound index on `booking_seats(tripId, seatId, status)` ensures that concurrent check queries are executed with microsecond latency.
4. When a conflict occurs, the database transaction instantly rolls back and returns an HTTP `409 Conflict` response with the exact conflicting seat numbers, while the winning request successfully commits.
5. This is proven through our automated test suite in `server/src/__tests__/rova.test.ts` where concurrent `Promise.all` requests against the same seat verify that exactly one succeeds (`201 Created`) while the second receives `409 Conflict`.

### 3.2 Configurable Cancellation & Refund Rules (Acceptance Criteria 4)
Cancellations are governed by a time-tiered refund matrix calculated from the moment of request relative to scheduled departure:
- **Tier 1 (> 24 hours before departure)**: 90% refund (10% processing fee).
- **Tier 2 (12 to 24 hours before departure)**: 50% refund (50% cancellation fee).
- **Tier 3 (< 12 hours before departure)**: Non-refundable (0% refund).

When cancellation is confirmed:
1. Booking status is set to `CANCELLED`.
2. All linked `BookingSeat` records are updated to `CANCELLED`, which immediately restores seat availability in the visual seat map for other passengers.
3. A `Refund` record is generated with timestamp, fee deductions, and reference ID.
4. An immutable entry is written to `audit_logs`.

### 3.3 Journey Recovery Engine
When unpredictable transit conditions arise (such as technical vehicle delays or roadwork diversions), operators can broadcast a disruption notice. This triggers Rova's Journey Recovery Engine:
1. Automatically identifies scheduled departures on the same or nearest route within 24 hours.
2. Checks remaining seat capacity.
3. Automatically generates passenger recovery options offering either free re-routing with care vouchers or a 100% immediate automated refund voucher.

---

## 4. Role-Based Access Control (RBAC) & Security

Authentication is verified using signed JSON Web Tokens (JWT) with HMAC-SHA256 and bcrypt password hashing. Security is enforced strictly on the server:
- **`PASSENGER`**: Can search trips, select seats, book tickets, view personal booking history, and cancel tickets.
- **`OPERATOR`**: Can manage vehicle fleets, create routes, schedule departures, view real-time passenger manifests, log disruptions, and access occupancy analytics.
- **`ADMIN`**: Complete access to system metrics, user roles, and compliance audit logs.

Route middleware verifies authorization before handlers are reached:
```ts
router.use(authenticate, requireRole(['OPERATOR', 'ADMIN']));
```
No sensitive administrative routes rely on client-side button hiding alone.

---

## 5. Automated Verification & Test Results

The test suite is powered by Vitest and Supertest (`server/src/__tests__/rova.test.ts`). All 5 acceptance tests pass:

```
 RUN  v3.2.7 C:/Users/M S I/Rova/server

 ✓ Acceptance Criteria 1: Passenger can search valid trip and book an available seat (52ms)
 ✓ Acceptance Criteria 2: Two users cannot confirm the same seat on one trip (Race condition prevention) (62ms)
 ✓ Acceptance Criteria 3: PNR ticket contains exact passenger, route, date and seat details (15ms)
 ✓ Acceptance Criteria 4: Cancellation restores seat availability and calculates refund rule correctly (47ms)
 ✓ Acceptance Criteria 5: Operator manifest reconciles with active confirmed tickets (26ms)

 Test Files  1 passed (1)
      Tests  5 passed (5)
```

---

## 6. Honest Limitations & Future Improvements

1. **Payment Gateway Integration**: Payment processing is currently simulated (`payments` table with transaction references). A production rollout would connect to real payment gateways like Click, Payme, Stripe, or Razorpay using secure webhooks.
2. **Push Notifications**: Passengers currently view notifications and recovery options in-app; integration with Twilio SMS or SendGrid would enable real-time SMS departure alerts.
3. **WebSockets for Multi-Terminal Live Updates**: Real-time seat locking currently utilizes polling and re-fetching on interaction; Socket.IO can be layered to reflect seat locks live across open client sessions.
