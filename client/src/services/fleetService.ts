// Centralized fleet, driver assignment, and real-time seat reservation service
// Real Punjab RTC (PUNBUS, PRTC) & Intercity fleet data

export interface BusData {
  id: string;
  registrationNumber: string;
  name: string;
  operatorType: string;
  busType: string;
  totalSeats: number;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  timeSlot: 'MORNING' | 'AFTERNOON' | 'NIGHT';
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

export const PUNJAB_CITIES = [
  'Amritsar ISBT',
  'Jalandhar Rama Mandi',
  'Ludhiana Sherpur',
  'Chandigarh Sector 17',
  'Patiala ISBT',
  'Bathinda Terminal',
  'Delhi Kashmere Gate',
  'Pathankot Cantt',
  'Manali Mall Road',
  'Shimla Old ISBT',
];

const DEFAULT_BUSES: BusData[] = [
  {
    id: 'bus-1',
    registrationNumber: 'PB-02-AK-9921',
    name: 'PUNBUS Volvo 9600 Multi-Axle',
    operatorType: 'Punjab Roadways (PUNBUS)',
    busType: 'Volvo 9600 Air-Suspension',
    totalSeats: 37,
    origin: 'Amritsar ISBT',
    destination: 'Chandigarh Sector 17',
    departureTime: '06:30 AM',
    arrivalTime: '10:45 AM',
    timeSlot: 'MORNING',
    basePrice: 650,
    driverName: 'Gurpreet Singh',
    driverPhone: '+91 98140-54321',
    driverInitials: 'GS',
    status: 'ON_TIME',
  },
  {
    id: 'bus-2',
    registrationNumber: 'PB-10-BX-1002',
    name: 'PRTC PEPSU Executive HVAC',
    operatorType: 'PRTC (PEPSU Roadways)',
    busType: 'Corona AC Intercity',
    totalSeats: 37,
    origin: 'Ludhiana Sherpur',
    destination: 'Delhi Kashmere Gate',
    departureTime: '07:45 AM',
    arrivalTime: '01:30 PM',
    timeSlot: 'MORNING',
    basePrice: 780,
    driverName: 'Balwinder Sharma',
    driverPhone: '+91 98722-11099',
    driverInitials: 'BS',
    status: 'ON_TIME',
  },
  {
    id: 'bus-3',
    registrationNumber: 'PB-08-CC-4412',
    name: 'Punjab Roadways Fast Track',
    operatorType: 'Punjab Roadways (PUNBUS)',
    busType: 'Scania Multi-Axle Recliner',
    totalSeats: 37,
    origin: 'Jalandhar Rama Mandi',
    destination: 'Delhi Kashmere Gate',
    departureTime: '09:00 AM',
    arrivalTime: '03:15 PM',
    timeSlot: 'MORNING',
    basePrice: 850,
    driverName: 'Davinder Gill',
    driverPhone: '+91 94170-88231',
    driverInitials: 'DG',
    status: 'ON_TIME',
  },
  {
    id: 'bus-4',
    registrationNumber: 'PB-02-RS-2201',
    name: 'StarLiner Executive Scania',
    operatorType: 'StarLiner Expeditions',
    busType: 'Scania Touring VIP',
    totalSeats: 37,
    origin: 'Amritsar ISBT',
    destination: 'Chandigarh Sector 17',
    departureTime: '02:00 PM',
    arrivalTime: '06:15 PM',
    timeSlot: 'AFTERNOON',
    basePrice: 950,
    driverName: 'Gurpreet Singh',
    driverPhone: '+91 98140-54321',
    driverInitials: 'GS',
    status: 'ON_TIME',
  },
  {
    id: 'bus-5',
    registrationNumber: 'PB-11-DL-8820',
    name: 'PRTC Goldline Express',
    operatorType: 'PRTC (PEPSU Roadways)',
    busType: 'Tata Ultra Deluxe AC',
    totalSeats: 37,
    origin: 'Patiala ISBT',
    destination: 'Chandigarh Sector 17',
    departureTime: '10:15 AM',
    arrivalTime: '11:45 AM',
    timeSlot: 'MORNING',
    basePrice: 220,
    driverName: 'Harbhajan Singh',
    driverPhone: '+91 98555-77610',
    driverInitials: 'HS',
    status: 'ON_TIME',
  },
  {
    id: 'bus-6',
    registrationNumber: 'PB-03-AK-4433',
    name: 'PUNBUS Royal Sleeper',
    operatorType: 'Punjab Roadways (PUNBUS)',
    busType: 'BharatBenz Sleeper Coach',
    totalSeats: 37,
    origin: 'Bathinda Terminal',
    destination: 'Chandigarh Sector 17',
    departureTime: '05:45 AM',
    arrivalTime: '10:00 AM',
    timeSlot: 'MORNING',
    basePrice: 520,
    driverName: 'Jagtar Sandhu',
    driverPhone: '+91 98150-33421',
    driverInitials: 'JS',
    status: 'ON_TIME',
  },
  {
    id: 'bus-7',
    registrationNumber: 'PB-10-BX-1102',
    name: 'Himalayan Glacier Sleeper',
    operatorType: 'StarLiner Expeditions',
    busType: 'Mercedes-Benz Glider AC',
    totalSeats: 37,
    origin: 'Amritsar ISBT',
    destination: 'Manali Mall Road',
    departureTime: '08:15 PM',
    arrivalTime: '06:00 AM',
    timeSlot: 'NIGHT',
    basePrice: 1450,
    driverName: 'Baldev Singh',
    driverPhone: '+91 99144-88902',
    driverInitials: 'BS',
    status: 'ON_TIME',
  },
  {
    id: 'bus-8',
    registrationNumber: 'PB-65-AX-5501',
    name: 'Golden Temple Express',
    operatorType: 'PRTC (PEPSU Roadways)',
    busType: 'Ashok Leyland Viking AC',
    totalSeats: 37,
    origin: 'Ludhiana Sherpur',
    destination: 'Jalandhar Rama Mandi',
    departureTime: '03:30 PM',
    arrivalTime: '04:45 PM',
    timeSlot: 'AFTERNOON',
    basePrice: 180,
    driverName: 'Davinder Gill',
    driverPhone: '+91 94170-88231',
    driverInitials: 'DG',
    status: 'ON_TIME',
  },
];

const DEFAULT_BOOKINGS: BookedSeatRecord[] = [
  { busId: 'bus-1', seatCode: 'V1', passengerName: 'Amanpreet Singh', passengerPhone: '+91 98765-43210', passengerEmail: 'aman@example.com', pnr: 'ROV-7849X', bookingDate: 'Today 06:00 AM', fare: 650, boardingPoint: 'Amritsar ISBT', droppingPoint: 'Chandigarh Sector 17', status: 'CHECKED_IN' },
  { busId: 'bus-1', seatCode: 'V2', passengerName: 'Simranjit Kaur', passengerPhone: '+91 98765-43211', passengerEmail: 'simran@example.com', pnr: 'ROV-7849Y', bookingDate: 'Today 06:00 AM', fare: 650, boardingPoint: 'Amritsar ISBT', droppingPoint: 'Chandigarh Sector 17', status: 'CHECKED_IN' },
  { busId: 'bus-1', seatCode: 'S1', passengerName: 'Gurpreet Singh', passengerPhone: '+91 98140-54321', passengerEmail: 'gurpreet@example.com', pnr: 'ROV-9912A', bookingDate: 'Today 06:10 AM', fare: 650, boardingPoint: 'Amritsar ISBT', droppingPoint: 'Chandigarh Sector 17', status: 'CHECKED_IN' },
  { busId: 'bus-1', seatCode: 'S2', passengerName: 'Harleen Kaur', passengerPhone: '+91 98722-11099', passengerEmail: 'harleen@example.com', pnr: 'ROV-9912B', bookingDate: 'Today 06:10 AM', fare: 650, boardingPoint: 'Amritsar ISBT', droppingPoint: 'Chandigarh Sector 17', status: 'CHECKED_IN' },
];

export const fleetService = {
  getBuses(): BusData[] {
    const raw = localStorage.getItem('rova_fleet_buses_v2');
    if (!raw) {
      localStorage.setItem('rova_fleet_buses_v2', JSON.stringify(DEFAULT_BUSES));
      return DEFAULT_BUSES;
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed.length > 0 ? parsed : DEFAULT_BUSES;
    } catch {
      return DEFAULT_BUSES;
    }
  },

  getBusById(id: string): BusData | undefined {
    return this.getBuses().find((b) => b.id === id || b.registrationNumber === id);
  },

  saveBuses(buses: BusData[]) {
    localStorage.setItem('rova_fleet_buses_v2', JSON.stringify(buses));
  },

  addBus(bus: Omit<BusData, 'id'>): BusData {
    const buses = this.getBuses();
    const newBus: BusData = {
      ...bus,
      id: `bus-${Date.now()}`,
    };
    buses.push(newBus);
    this.saveBuses(buses);
    window.dispatchEvent(new CustomEvent('rova_seats_updated', { detail: { action: 'bus_added' } }));
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
      window.dispatchEvent(new CustomEvent('rova_seats_updated', { detail: { action: 'driver_assigned' } }));
    }
  },

  getAllBookings(): BookedSeatRecord[] {
    const raw = localStorage.getItem('rova_fleet_bookings_v2');
    if (!raw) {
      localStorage.setItem('rova_fleet_bookings_v2', JSON.stringify(DEFAULT_BOOKINGS));
      return DEFAULT_BOOKINGS;
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed.length > 0 ? parsed : DEFAULT_BOOKINGS;
    } catch {
      return DEFAULT_BOOKINGS;
    }
  },

  saveBookings(bookings: BookedSeatRecord[]) {
    localStorage.setItem('rova_fleet_bookings_v2', JSON.stringify(bookings));
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

  getSeatPrice(bus: BusData, seatCode: string): { price: number; type: 'VIP' | 'STANDARD' | 'BACK'; label: string; badge: string } {
    if (seatCode.startsWith('V')) {
      return {
        price: bus.basePrice + 250,
        type: 'VIP',
        label: 'VIP Panorama Recliner',
        badge: '+₹250 VIP Upgrade',
      };
    }
    const rearSeats = ['S21', 'S22', 'S23', 'S24', 'S25', 'S26', 'S27', 'S28'];
    if (rearSeats.includes(seatCode)) {
      return {
        price: Math.max(100, bus.basePrice - 100),
        type: 'BACK',
        label: 'Rear Economy Saver',
        badge: '-₹100 Economy Discount',
      };
    }
    return {
      price: bus.basePrice,
      type: 'STANDARD',
      label: 'Executive Standard',
      badge: 'Standard Fare',
    };
  },

  calculateTotalPrice(bus: BusData, seatCodes: string[]): number {
    return seatCodes.reduce((sum, code) => sum + this.getSeatPrice(bus, code).price, 0);
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

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pnr = 'ROV-';
    for (let i = 0; i < 5; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const currentBus = this.getBusById(busId) || ({ basePrice: passenger.fare } as BusData);

    const newBookings: BookedSeatRecord[] = seatCodes.map((seatCode) => {
      const seatPricing = this.getSeatPrice(currentBus, seatCode);
      return {
        busId,
        seatCode,
        passengerName: passenger.name,
        passengerPhone: passenger.phone,
        passengerEmail: passenger.email,
        pnr,
        bookingDate: 'Just now',
        fare: seatPricing.price,
        boardingPoint: passenger.boardingPoint,
        droppingPoint: passenger.droppingPoint,
        status: 'CONFIRMED',
      };
    });

    all.push(...newBookings);
    this.saveBookings(all);

    window.dispatchEvent(new CustomEvent('rova_seats_updated', { detail: { busId, seatCodes } }));
    return { success: true, pnr };
  },

  getRefundPolicy(fare: number, hoursBeforeDeparture: number = 30) {
    let refundPercentage = 90;
    let ruleName = '> 24 hrs prior to departure (Standard Cancellation)';
    if (hoursBeforeDeparture < 12) {
      refundPercentage = 50;
      ruleName = '< 12 hrs prior to departure (Late Cancellation)';
    } else if (hoursBeforeDeparture <= 24) {
      refundPercentage = 75;
      ruleName = '12 - 24 hrs prior to departure (Mid-window Cancellation)';
    }

    const cancellationCharge = Math.round((fare * (100 - refundPercentage)) / 100);
    const refundAmount = fare - cancellationCharge;
    return {
      originalFare: fare,
      refundPercentage,
      cancellationCharge,
      refundAmount,
      ruleName,
      refundMethod: 'Original Payment Source (Simulated UPI / NetBanking / Card)',
      refundRef: `RFND-${Math.floor(100000 + Math.random() * 900000)}-UPI`,
      estimatedTime: 'Within 5-15 minutes (Instant simulated credit)',
    };
  },

  cancelBooking(pnr: string, seatCode?: string): boolean {
    const all = this.getAllBookings();
    let found = false;
    const updated = all.map((b) => {
      const match = seatCode ? (b.pnr === pnr && b.seatCode === seatCode) : (b.pnr === pnr);
      if (match && b.status !== 'CANCELLED') {
        found = true;
        return { ...b, status: 'CANCELLED' as const };
      }
      return b;
    });
    if (found) {
      this.saveBookings(updated);
      window.dispatchEvent(new CustomEvent('rova_seats_updated', { detail: { pnr, seatCode } }));
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
