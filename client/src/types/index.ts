export interface User {
  id: string;
  name: string;
  email: string;
  role: 'PASSENGER' | 'OPERATOR' | 'ADMIN';
  phone?: string;
  operatorId?: string | null;
  operatorName?: string | null;
}

export interface Stop {
  id: string;
  name: string;
  city: string;
  landmark?: string;
  stopType?: string;
  sequence?: number;
  timeFromStartMinutes?: number;
}

export interface Route {
  id: string;
  origin: string;
  destination: string;
  distanceKm: number;
  stops?: Stop[];
}

export interface Operator {
  id: string;
  name: string;
  code: string;
  rating: number;
}

export interface Seat {
  id: string;
  seatNumber: string;
  deck: 'LOWER' | 'UPPER';
  seatType: 'SEATER' | 'SLEEPER';
  isWomenOnly: boolean;
  row: number;
  column: number;
  isAvailable: boolean;
  status: 'AVAILABLE' | 'BOOKED' | 'RESERVED';
  occupiedByGender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  price: number;
}

export interface Trip {
  id: string;
  busId: string;
  busName: string;
  busType: string;
  layoutType: string;
  registrationNumber: string;
  operator: Operator;
  route: Route;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  basePrice: number;
  status: string;
  totalSeats: number;
  bookedSeatsCount: number;
  availableSeats: number;
  activeDisruption?: {
    id: string;
    disruptionType: string;
    reason: string;
  } | null;
}

export interface PassengerInput {
  seatId: string;
  seatNumber: string;
  passengerName: string;
  passengerAge: number | string;
  passengerGender: 'MALE' | 'FEMALE' | 'OTHER';
}

export interface BookingSeat {
  id: string;
  seatId: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  seatPrice: number;
  status: string;
  seat?: {
    seatNumber: string;
    deck: string;
  };
}

export interface Booking {
  id: string;
  pnr: string;
  passengerName: string;
  contactEmail: string;
  contactPhone: string;
  totalAmount: number;
  status: 'CONFIRMED' | 'CANCELLED';
  bookingDate: string;
  trip: {
    id: string;
    departureTime: string;
    arrivalTime: string;
    bus: {
      name: string;
      busType: string;
      registrationNumber: string;
      operator: {
        name: string;
      };
    };
    route: {
      origin: string;
      destination: string;
    };
  };
  bookingSeats: BookingSeat[];
  refund?: {
    refundAmount: number;
    deductionAmount: number;
    status: string;
  };
  cancellationEstimate?: {
    hoursUntilDeparture: number;
    canCancel: boolean;
    refundPercentage: number;
    estimatedRefund: number;
    estimatedDeduction: number;
    rule: string;
  };
}

export interface ManifestItem {
  bookingId: string;
  pnr: string;
  seatNumber: string;
  deck: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  contactEmail: string;
  contactPhone: string;
  bookingDate: string;
  fare: number;
  boardingStatus: string;
}
