# Rova Database Schema & Entity-Relationship Architecture

This document provides the comprehensive relational schema, indexes, unique constraints, and Mermaid ER diagram for the **Rova Bus Booking Management System** as specified for the ALGIONS AI LABS assessment.

---

## 1. Mermaid Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    User ||--o{ Booking : places
    User ||--o| Operator : manages
    User ||--o{ AuditLog : performs
    Operator ||--o{ Bus : owns
    Bus ||--o{ Seat : contains
    Bus ||--o{ Trip : assigned
    Route ||--o{ Trip : defines
    Route ||--o{ RouteStop : contains
    Stop ||--o{ RouteStop : located_at
    Trip ||--o{ Booking : booked_on
    Trip ||--o{ Disruption : experiences
    Booking ||--o{ BookingSeat : reserves
    Seat ||--o{ BookingSeat : allocated_to
    Booking ||--o| Payment : verified_by
    Booking ||--o| Refund : issues
    Disruption ||--o{ RecoveryOption : generates

    User {
        string id PK
        string name
        string email UK
        string passwordHash
        string phone
        string role
        datetime createdAt
    }

    Operator {
        string id PK
        string name
        string code UK
        string contactEmail
        string contactPhone
        float rating
        string userId FK
    }

    Bus {
        string id PK
        string registrationNumber UK
        string name
        string busType
        int totalSeats
        string layoutType
        string operatorId FK
    }

    Seat {
        string id PK
        string seatNumber
        string deck
        string seatType
        boolean isWomenOnly
        int row
        int column
        string busId FK
    }

    Route {
        string id PK
        string origin
        string destination
        float distanceKm
        int estimatedMinutes
    }

    Stop {
        string id PK
        string name
        string city
        string landmark
    }

    RouteStop {
        string id PK
        string routeId FK
        string stopId FK
        string stopType
        int sequence
        int timeFromStartMinutes
    }

    Trip {
        string id PK
        string busId FK
        string routeId FK
        datetime departureTime
        datetime arrivalTime
        float basePrice
        string status
    }

    Booking {
        string id PK
        string pnr UK
        string userId FK
        string passengerName
        string contactEmail
        string contactPhone
        string tripId FK
        float totalAmount
        string status
        datetime bookingDate
    }

    BookingSeat {
        string id PK
        string bookingId FK
        string tripId FK
        string seatId FK
        string passengerName
        int passengerAge
        string passengerGender
        float seatPrice
        string status
    }

    Payment {
        string id PK
        string bookingId FK
        string transactionId UK
        float amount
        string paymentMethod
        string status
        datetime paymentDate
    }

    Refund {
        string id PK
        string bookingId FK
        float refundAmount
        float deductionAmount
        string cancellationReason
        string status
        datetime processedAt
    }

    Disruption {
        string id PK
        string tripId FK
        string disruptionType
        datetime originalDeparture
        datetime revisedDeparture
        string reason
        string status
    }

    RecoveryOption {
        string id PK
        string disruptionId FK
        string originalTripId
        string alternativeTripId
        string compensationOffered
        boolean autoTransferEligible
        string notes
    }

    AuditLog {
        string id PK
        string action
        string entity
        string entityId
        string userId FK
        string details
        string ipAddress
        datetime createdAt
    }
```

---

## 2. Table Specifications & Indexes

| Table | Primary Key | Key Foreign Keys | Unique Constraints & Indexes | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `users` | `id` | — | `email` (UNIQUE) | Manages authentication, hashed passwords, and RBAC roles (`PASSENGER`, `OPERATOR`, `ADMIN`). |
| `operators` | `id` | `userId` | `code` (UNIQUE), `userId` (UNIQUE) | Agency profiles, contact details, quality ratings. |
| `buses` | `id` | `operatorId` | `registrationNumber` (UNIQUE) | Fleet vehicles, seating configuration (`2x2`, `2x1`), model info. |
| `seats` | `id` | `busId` | `[busId, seatNumber, deck]` (UNIQUE) | Physical seat layout matrix with deck, category, women-preference. |
| `routes` | `id` | — | `[origin, destination]` (UNIQUE) | Intercity corridors with distance and baseline travel duration. |
| `stops` | `id` | — | — | Boarding/dropping stations with city and landmarks. |
| `route_stops` | `id` | `routeId`, `stopId` | `[routeId, stopId]` (UNIQUE) | Ordered sequence of stations on a route. |
| `trips` | `id` | `busId`, `routeId` | Indexed by `departureTime`, `routeId`, `status` | Scheduled departures, base pricing, schedule health. |
| `bookings` | `id` | `userId`, `tripId` | `pnr` (UNIQUE) | Confirmed customer reservations and master contact details. |
| `booking_seats` | `id` | `bookingId`, `seatId`, `tripId` | `[bookingId, seatId]` (UNIQUE), Index on `[tripId, seatId, status]` | Individual seat reservations ensuring concurrency prevention. |
| `payments` | `id` | `bookingId` | `transactionId` (UNIQUE), `bookingId` (UNIQUE) | Payment authorization and transaction reference audit trail. |
| `refunds` | `id` | `bookingId` | `bookingId` (UNIQUE) | Refund accounting, policy deduction breakdowns, and timestamps. |
| `disruptions` | `id` | `tripId` | Indexed by `tripId`, `status` | Operational delays, cancellations, and depot inspection records. |
| `recovery_options` | `id` | `disruptionId` | Indexed by `disruptionId` | Alternative journeys and passenger goodwill vouchers. |
| `audit_logs` | `id` | `userId` | Indexed by `action`, `entity`, `createdAt` | Immutable log of material system events. |
