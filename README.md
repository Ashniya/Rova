# 🚌 Rova — Bus Booking Management System

> **"Where routes become journeys."**  
> *Find the right connection, choose your seat, and make your next destination closer than ever. Explore freely. Travel seamlessly. Arrive confidently.*

A full-stack, responsive, database-backed bus booking and operations management platform built for the **ALGIONS AI LABS PRIVATE LIMITED** Advanced Full-Stack Web Development Assessment.

---

## 📸 Visual Design & Interface Reference

Designed around modern transit aesthetics matching the specification reference:
- **Fresh vibrant green accent palette** (`#00D053` / emerald) with high-legibility typography and dark accents.
- **Interactive Floating Boarding Pass Card**: Visual ticket notch punch, barcode graphics, route time indicators, and passenger metadata.
- **One-Touch Trip Search Widget**: Origin & destination with swap animation, calendar picker with prev/next day arrow controls, and passenger counter.
- **Realistic Bus Seat Map**: Driver cabin, entrance door, aisle separation, 2x2 and 2x1 luxury layouts, women-preferred seat indicators, and live price recalculations.
- **Operator Portal & Conductor Manifest**: Live route scheduling, printable passenger manifests, disruption logging, and Recharts occupancy analytics.
- **Enterprise Audit Trail**: Cryptographic logging of every booking, seat release, cancellation, and user event.

---

## 🛠️ Technology Stack

| Layer | Technologies Used | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | **React 18 / 19, TypeScript, Vite, Tailwind CSS** | Component architecture, responsive design system, and fast HMR bundling. |
| **State & Data Fetching** | **TanStack Query (React Query) + Axios** | Server-state caching, automatic refetching, and background synchronization. |
| **Icons & Visuals** | **Lucide React, Canvas-Confetti** | Modern SVG iconography and celebratory booking feedback. |
| **Charts & Reporting** | **Recharts** | Interactive occupancy rate (%) and route revenue visualization. |
| **Backend API** | **Node.js, Express 5, TypeScript** | RESTful endpoints, middleware architecture, and route controllers. |
| **Data Persistence** | **Prisma ORM + PostgreSQL / SQLite** | Type-safe migrations, relational modeling, and atomic transactional seat locking. |
| **Security & Auth** | **JWT, bcryptjs, Helmet, Express-Rate-Limit** | Password hashing, role-based access control (RBAC), and security headers. |
| **API Documentation** | **OpenAPI 3.0 + Swagger UI** | Interactive API explorer accessible at `/api/docs`. |
| **Automated Testing** | **Vitest, Supertest** | Unit, integration, and concurrent race-condition test suite. |

---

## 🚀 Quick Start & Local Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22.x recommended)
- **Package Manager**: npm or pnpm

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Rova
```

### 2. Install Dependencies
You can install dependencies for both the backend and frontend:
```bash
# Server dependencies
cd server
npm install # or: pnpm install

# Client dependencies
cd ../client
npm install # or: pnpm install
```

### 3. Configure Environment Variables
Copy the example environment configuration:
```bash
# In server directory
cp .env.example .env
```
Default `.env` contents (works out of the box with zero external configuration):
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="rova-jwt-super-secret-production-key-2026"
NODE_ENV="development"
```

> **Note on PostgreSQL**: To use PostgreSQL instead of SQLite, simply change `DATABASE_URL` in `.env` to your PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/rova_db?schema=public`) and set `provider = "postgresql"` in `server/prisma/schema.prisma`.

### 4. Setup Database & Seed Initial Data
```bash
cd server
npx prisma db push
npm run seed
```
This generates the database tables and seeds demo operators, buses, stops, scheduled departures, pre-booked tickets, and audit trails.

### 5. Run the Application
In separate terminal tabs:
```bash
# Terminal 1: Run Backend API (Port 5000)
cd server
npm run dev

# Terminal 2: Run Frontend App (Port 5173)
cd client
npm run dev
```

Open your browser at **`http://localhost:5173`** to access the web application!  
Open **`http://localhost:5000/api/docs`** to explore the interactive Swagger documentation.

---

## 🔑 Demo Accounts & Pre-Seeded Credentials

The application includes one-click autofill buttons in the login modal, or you can use these credentials:

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Passenger** | `gozal@example.com` | `password123` | Search trips, choose seats, book tickets, cancel reservations. |
| **Operator** | `operator@silkroad.com` | `operator123` | Fleet management, route scheduling, passenger manifests, disruption logging. |
| **Admin** | `admin@rova.com` | `admin123` | Global statistics, compliance audit logs, user directory. |

### 🎫 Pre-Seeded Reference Ticket for Direct Lookup:
- **PNR Reference**: `RV8F92K`
- **Passenger**: Xasanova Go'zal
- **Route**: Toshkent → Jizzax (23:30 departure)
- **Seat**: 16B (Executive Coach)
- Enter `RV8F92K` in the **Chiptani olish (Ticket Lookup)** page to inspect the digital boarding pass immediately!

---

## 🧪 Automated Testing Suite

To execute the automated acceptance test suite:
```bash
cd server
npm test # or: npx vitest run
```

### Test Evidence (5 / 5 Criteria Passing):
```
 ✓ Acceptance Criteria 1: Passenger can search valid trip and book an available seat (52ms)
 ✓ Acceptance Criteria 2: Two users cannot confirm the same seat on one trip (Race condition prevention) (62ms)
 ✓ Acceptance Criteria 3: PNR ticket contains exact passenger, route, date and seat details (15ms)
 ✓ Acceptance Criteria 4: Cancellation restores seat availability and calculates refund rule correctly (47ms)
 ✓ Acceptance Criteria 5: Operator manifest reconciles with active confirmed tickets (26ms)

 Test Files  1 passed (1)
      Tests  5 passed (5)
   Duration  4.02s
```

---

## 🛡️ Critical Engineering Implementations

### 1. Concurrency & Double-Booking Prevention (Acceptance Criteria 2)
To guarantee data integrity under high concurrent booking traffic:
- All reservations execute within an atomic transaction boundary (`prisma.$transaction`).
- The transaction queries existing confirmed seats on the requested trip before any record creation.
- If ANY requested seat is already locked by another passenger, the transaction immediately rolls back and returns an HTTP `409 Conflict` error with the conflicting seat numbers.
- Verified through simultaneous `Promise.all` test requests in `rova.test.ts`.

### 2. Configurable Cancellation & Refund Policy (Acceptance Criteria 4)
- **> 24 hours prior to departure**: 90% refund (10% processing fee).
- **12 to 24 hours prior**: 50% refund (50% fee).
- **< 12 hours prior**: Non-refundable (0% refund).
- When cancelled, the seat is immediately released back to available inventory and reflected live on the seat map.

### 3. Journey Recovery Engine
- When an operator logs a delay or cancellation, Rova's recovery engine automatically analyzes downstream routes, finds alternative buses with available seats, and issues goodwill compensation vouchers.

### 4. Interactive Conductor Manifest
- Operational staff can view real-time passenger manifests for any departure, detailing seat numbers, passenger ages, genders, contact phones, and boarding statuses, with full printable layout support.

---

## 📑 API Documentation

Interactive OpenAPI 3.0 documentation is served at `/api/docs`:
- `POST /api/auth/register` — Create user (Passenger, Operator, Admin)
- `POST /api/auth/login` — Authenticate and receive JWT token
- `GET /api/trips` — Search scheduled journeys with filters
- `GET /api/trips/:id` — Get seat map layout and occupancy
- `POST /api/bookings` — Create booking with transactional seat lock
- `GET /api/bookings/:pnr` — Get ticket details by reference
- `POST /api/bookings/:pnr/cancel` — Cancel ticket and calculate refund
- `GET /api/operator/manifest/:tripId` — Conductor passenger manifest
- `POST /api/operator/trips/:tripId/disruption` — Report delay/cancellation to trigger Journey Recovery Engine
- `GET /api/admin/audit-logs` — Immutable audit trail

---

## ⚖️ Known Limitations & Assumptions

1. **Payment Gateway**: Payments are currently simulated via a transactional ledger table. Production deployment would integrate live gateways (Stripe, Click, Payme).
2. **Notification Transport**: Alerts and recovery notices are currently presented in-app; SMS gateway integration (e.g. Twilio) would enable mobile text notifications.
3. **Multi-Deck Layouts**: Currently supports 2x2 and 2x1 seating arrangements on lower deck; upper sleeper deck support is architected into the database schema (`deck: UPPER`) for future UI toggle expansion.

---

## 👨‍💻 Candidate Submission Information

- **Assigned Project**: Bus Booking Management System ("Rova")
- **Role**: Full-Stack Web Development Intern
- **Company**: ALGIONS AI LABS PRIVATE LIMITED
- **Submission Contents**: Source repository, technical report, schema diagram, automated tests, and local run instructions.
