// Centralized fleet, driver assignment, and real-time seat reservation service
// Ensures cross-account seat integrity: when User A books a seat, it is immediately marked as SOLD for User B, Driver & Admin.

export interface BusData {
  id: string;
  registrationNumber: string;
  name: string;
  busType: string;
  totalSeats: number;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  basePrice: number;
  driverName: string;
  driverPhone: string;
  driverInitials: string;
  status: 'ON_TIME' | 'DELAYED' | 'MAINTENANCE';
}

export interface BookedSeatRecord {
  busId: string;
  seatCode: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  pnr: string;
  bookingDate: string;
  fare: number;
  boardingPoint: string;
  droppingPoint: string;
  status: 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED';
}

const DEFAULT_BUSES: BusData[] = [
  {
    id: 'bus-1',
    registrationNumber: 'PB-02-AK-9921',
    name: 'StarLiner Punjab Executive',
    busType: 'Scania Multi-Axle Recliner',
    totalSeats: 37,
    origin: 'Amritsar ISBT Central',
    destination: 'Chandigarh Sector 17',
    departureTime: '06:30 AM',
    arrivalTime: '10:45 AM',
    basePrice: 1100,
    driverName: 'Gurpreet Singh',
    driverPhone: '+91 98140-54321',
    driverInitials: 'GS',
    status: 'ON_TIME',
  },
  {
    id: 'bus-2',
    registrationNumber: 'PB-08-CC-4412',
    name: 'Astra Grand Cruiser',
    busType: 'Volvo 9600 Luxury Sleeper',
    totalSeats: 37,
    origin: 'Jalandhar Rama Mandi',
    destination: 'Delhi Kashmere Gate',
    departureTime: '09:00 AM',
    arrivalTime: '03:30 PM',
    basePrice: 1450,
    driverName: 'Balwinder Sharma',
    driverPhone: '+91 98722-11099',
    driverInitials: 'BS',
    status: 'ON_TIME',
  },
  {
    id: 'bus-3',
    registrationNumber: 'PB-10-BX-1102',
    name: 'Himalayan Luxury Sleeper',
    busType: 'Mercedes-Benz Glider AC',
    totalSeats: 37,
    origin: 'Amritsar ISBT',
    destination: 'Manali Mall Road',
    departureTime: '08:15 AM',
    arrivalTime: '04:45 PM',
    basePrice: 1650,
    driverName: 'Davinder Gill',
    driverPhone: '+91 94170-88231',
    driverInitials: 'DG',
    status: 'ON_TIME',
  },
  {
    id: 'bus-4',
    registrationNumber: 'PB-01-DL-8820',
    name: 'Punjab Roadways Scania',
    busType: 'Scania Intercity 2+2',
    totalSeats: 37,
    origin: 'Chandigarh Sector 17',
    destination: 'Amritsar ISBT',
    departureTime: '11:30 AM',
    arrivalTime: '03:45 PM',
    basePrice: 950,
    driverName: 'Harbhajan Singh',
    driverPhone: '+91 98555-77610',
    driverInitials: 'HS',
    status: 'ON_TIME',
  },
  {
    id: 'bus-5',
    registrationNumber: 'PB-65-AX-5501',
    name: 'Golden Temple Express',
    busType: 'BharatBenz Air-Suspension',
    totalSeats: 37,
    origin: 'Ludhiana Sherpur',
    destination: 'Jalandhar Rama Mandi',
    departureTime: '02:00 PM',
    arrivalTime: '03:15 PM',
    basePrice: 450,
    driverName: 'Jagtar Sandhu',
    driverPhone: '+91 98150-33421',
    driverInitials: 'JS',
    status: 'ON_TIME',
  },
];

// Initial bookings so the driver and passenger screens display realistic seat reservations
const DEFAULT_BOOKINGS: BookedSeatRecord[] = [
  { busId: 'bus-1', seatCode: 'V1', passengerName: 'Amanpreet Singh', passengerPhone: '+91 98765-43210', passengerEmail: 'aman@example.com', pnr: 'ROV-7849X', bookingDate: 'Today 06:00 AM', fare: 1100, boardingPoint: 'Amritsar ISBT Central', droppingPoint: 'Chandigarh Sector 17', status: 'CHECKED_IN' },
  { busId: 'bus-1', seatCode: 'V2', passengerName: 'Simranjit Kaur', passengerPhone: '+91 98765-43211', passengerEmail: 'simran@example.com', pnr: 'ROV-7849Y', bookingDate: 'Today 06:00 AM', fare: 1100, boardingPoint: 'Amritsar ISBT Central', droppingPoint: 'Chandigarh Sector 17', status: 'CHECKED_IN' },
  { busId: 'bus-1', seatCode: 'V3', passengerName: 'Rajinder Sharma', passengerPhone: '+91 94170-88231', passengerEmail: 'rajinder@example.com', pnr: 'ROV-8821X', bookingDate: 'Today 06:05 AM', fare: 1100, boardingPoint: 'Jalandhar Rama Mandi', droppingPoint: 'Chandigarh Sector 17', status: 'CONFIRMED' },
  { busId: 'bus-1', seatCode: 'S1', passengerName: 'Gurpreet Singh', passengerPhone: '+91 98140-54321', passengerEmail: 'gurpreet@example.com', pnr: 'ROV-9912A', bookingDate: 'Today 06:10 AM', fare: 1100, boardingPoint: 'Amritsar ISBT Central', droppingPoint: 'Chandigarh Sector 17', status: 'CHECKED_IN' },
  { busId: 'bus-1', seatCode: 'S2', passengerName: 'Harleen Kaur', passengerPhone: '+91 98722-11099', passengerEmail: 'harleen@example.com', pnr: 'ROV-9912B', bookingDate: 'Today 06:10 AM', fare: 1100, boardingPoint: 'Amritsar ISBT Central', droppingPoint: 'Chandigarh Sector 17', status: 'CHECKED_IN' },
  { busId: 'bus-1', seatCode: 'S3', passengerName: 'Manpreet Dhillon', passengerPhone: '+91 98555-77610', passengerEmail: 'manpreet@example.com', pnr: 'ROV-7710M', bookingDate: 'Today 06:15 AM', fare: 1100, boardingPoint: 'Amritsar ISBT Central', droppingPoint: 'Chandigarh Sector 17', status: 'CONFIRMED' },
  { busId: 'bus-1', seatCode: 'S4', passengerName: 'Sukhwinder Gill', passengerPhone: '+91 98150-33421', passengerEmail: 'sukhwinder@example.com', pnr: 'ROV-6620S', bookingDate: 'Today 06:15 AM', fare: 1100, boardingPoint: 'Amritsar ISBT Central', droppingPoint: 'Chandigarh Sector 17', status: 'CONFIRMED' },
];

export const fleetService = {
  getBuses(): BusData[] {
    const raw = localStorage.getItem('rova_fleet_buses');
    if (!raw) {
      localStorage.setItem('rova_fleet_buses', JSON.stringify(DEFAULT_BUSES));
      return DEFAULT_BUSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_BUSES;
    }
  },

  getBusById(id: string): BusData | undefined {
    return this.getBuses().find((b) => b.id === id || b.registrationNumber === id);
  },

  saveBuses(buses: BusData[]) {
    localStorage.setItem('rova_fleet_buses', JSON.stringify(buses));
  },

  addBus(bus: Omit<BusData, 'id'>): BusData {
    const buses = this.getBuses();
    const newBus: BusData = {
      ...bus,
      id: `bus-${Date.now()}`,
    };
    buses.push(newBus);
    this.saveBuses(buses);
    return newBus;
  },

  assignDriver(busId: string, driverName: string, driverPhone: string) {
    const buses = this.getBuses();
    const idx = buses.findIndex((b) => b.id === busId || b.registrationNumber === busId);
    if (idx !== -1) {
      const initials = driverName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      buses[idx].driverName = driverName;
      buses[idx].driverPhone = driverPhone;
      buses[idx].driverInitials = initials;
      this.saveBuses(buses);
    }
  },

  // Cross-account seat reservations
  getAllBookings(): BookedSeatRecord[] {
    const raw = localStorage.getItem('rova_fleet_bookings');
    if (!raw) {
      localStorage.setItem('rova_fleet_bookings', JSON.stringify(DEFAULT_BOOKINGS));
      return DEFAULT_BOOKINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_BOOKINGS;
    }
  },

  saveBookings(bookings: BookedSeatRecord[]) {
    localStorage.setItem('rova_fleet_bookings', JSON.stringify(bookings));
  },

  getBookedSeatsForBus(busId: string): string[] {
    const all = this.getAllBookings();
    return all
      .filter((b) => (b.busId === busId || busId === 'ALL') && b.status !== 'CANCELLED')
      .map((b) => b.seatCode);
  },

  getPassengerMapForBus(busId: string): Record<string, BookedSeatRecord> {
    const all = this.getAllBookings();
    const map: Record<string, BookedSeatRecord> = {};
    all
      .filter((b) => (b.busId === busId || busId === 'ALL') && b.status !== 'CANCELLED')
      .forEach((b) => {
        map[b.seatCode] = b;
      });
    return map;
  },

  bookSeats(
    busId: string,
    seatCodes: string[],
    passenger: {
      name: string;
      phone: string;
      email: string;
      boardingPoint: string;
      droppingPoint: string;
      fare: number;
    }
  ): { success: boolean; pnr: string; error?: string } {
    const all = this.getAllBookings();

    // Check for seat conflicts across all accounts
    const existingBooked = all
      .filter((b) => b.busId === busId && b.status !== 'CANCELLED')
      .map((b) => b.seatCode);

    const conflicts = seatCodes.filter((s) => existingBooked.includes(s));
    if (conflicts.length > 0) {
      return {
        success: false,
        pnr: '',
        error: `Seat(s) ${conflicts.join(', ')} were just reserved by another user. Please choose another seat.`,
      };
    }

    // Generate unique PNR
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pnr = 'ROV-';
    for (let i = 0; i < 5; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const newBookings: BookedSeatRecord[] = seatCodes.map((seatCode) => ({
      busId,
      seatCode,
      passengerName: passenger.name,
      passengerPhone: passenger.phone,
      passengerEmail: passenger.email,
      pnr,
      bookingDate: 'Just now',
      fare: passenger.fare,
      boardingPoint: passenger.boardingPoint,
      droppingPoint: passenger.droppingPoint,
      status: 'CONFIRMED',
    }));

    all.push(...newBookings);
    this.saveBookings(all);

    // Also notify any listening components
    window.dispatchEvent(new CustomEvent('rova_seats_updated', { detail: { busId, seatCodes } }));

    return { success: true, pnr };
  },

  cancelBooking(pnr: string): boolean {
    const all = this.getAllBookings();
    let found = false;
    const updated = all.map((b) => {
      if (b.pnr === pnr) {
        found = true;
        return { ...b, status: 'CANCELLED' as const };
      }
      return b;
    });
    if (found) {
      this.saveBookings(updated);
      window.dispatchEvent(new CustomEvent('rova_seats_updated', { detail: { pnr } }));
    }
    return found;
  },

  checkInPassenger(busId: string, seatCode: string) {
    const all = this.getAllBookings();
    const updated = all.map((b) => {
      if (b.busId === busId && b.seatCode === seatCode) {
        return {
          ...b,
          status: (b.status === 'CHECKED_IN' ? 'CONFIRMED' : 'CHECKED_IN') as any,
        };
      }
      return b;
    });
    this.saveBookings(updated);
    window.dispatchEvent(new CustomEvent('rova_seats_updated', { detail: { busId, seatCode } }));
  },
};
