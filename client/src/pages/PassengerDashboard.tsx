import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  Bus,
  Clock,
  MapPin,
  Calendar,
  Download,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Shield,
  ArrowRight,
  Printer,
  ChevronRight,
  User,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fleetService, BusData, BookedSeatRecord } from '../services/fleetService';
import BusSeatChassis, { PassengerInfo } from '../components/BusSeatChassis';

export const PassengerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [buses, setBuses] = useState<BusData[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>([]);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [confirmedPnr, setConfirmedPnr] = useState<string | null>(null);
  const [viewingTicket, setViewingTicket] = useState<BookedSeatRecord | null>(null);
  const [cancelTargetPnr, setCancelTargetPnr] = useState<string | null>(null);
  const [passengerName, setPassengerName] = useState(user?.name || '');
  const [passengerPhone, setPassengerPhone] = useState('+91 98765-43210');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || 'passenger@rova.com');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const list = fleetService.getBuses();
    setBuses(list);
    if (!selectedBus && list.length > 0) {
      setSelectedBus(list[0]);
    }
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('rova_seats_updated', handleUpdate);
    return () => window.removeEventListener('rova_seats_updated', handleUpdate);
  }, []);

  const activeBus = selectedBus || buses[0];
  const bookedSeats = activeBus ? fleetService.getBookedSeatsForBus(activeBus.id) : [];
  const passengerMap = activeBus ? fleetService.getPassengerMapForBus(activeBus.id) : {};
  const allBookings = fleetService.getAllBookings().filter((b) => b.status !== 'CANCELLED');

  const handleToggleSeat = (seatCode: string) => {
    if (selectedSeatCodes.includes(seatCode)) {
      setSelectedSeatCodes(selectedSeatCodes.filter((s) => s !== seatCode));
    } else {
      setSelectedSeatCodes([...selectedSeatCodes, seatCode]);
    }
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!activeBus) return;
    if (selectedSeatCodes.length === 0) {
      setBookingError('Please select at least one seat on the bus layout.');
      return;
    }

    const farePerSeat = activeBus.basePrice;
    const res = fleetService.bookSeats(activeBus.id, selectedSeatCodes, {
      name: passengerName,
      phone: passengerPhone,
      email: passengerEmail,
      boardingPoint: activeBus.origin,
      droppingPoint: activeBus.destination,
      fare: farePerSeat,
    });

    if (!res.success) {
      setBookingError(res.error || 'Failed to book seats.');
      return;
    }

    setConfirmedPnr(res.pnr);
    setSelectedSeatCodes([]);
    setBookingModalOpen(false);
    showToast(`Success! PNR ${res.pnr} issued. Seat is now marked as SOLD for all users.`);
  };

  const handleCancelBooking = (pnr: string) => {
    const ok = fleetService.cancelBooking(pnr);
    if (ok) {
      setCancelTargetPnr(null);
      showToast(`Booking ${pnr} cancelled. Refund of 90% queued to your payment source.`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#B91C1C] via-[#991B1B] to-[#7F1D1D] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-2">
            <span>👤 PASSENGER EXPEDITION PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Welcome, {user?.name || 'Passenger'}!
          </h1>
          <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-2xl leading-relaxed">
            Browse all verified intercity buses scheduled by the Platform Admin across Punjab. Pick your berths on the exact 37-seat bus schematic and reserve guaranteed tickets.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#seat-selection"
            className="px-5 py-2.5 bg-white text-[#B91C1C] hover:bg-red-50 font-black text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Bus className="w-4 h-4" />
            <span>Select Seats Below</span>
          </a>
        </div>
      </div>

      {/* 1. BUS SELECTION & ROUTE CATALOG (Configured by Admin) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#1C1917] dark:text-white">
              Admin-Scheduled Punjab Intercity Fleet
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Only verified buses with assigned drivers are available for booking. Select a coach to inspect its live seats.
            </p>
          </div>
          <span className="text-xs font-bold text-[#B91C1C] bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-800">
            {buses.length} Active Coaches
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.map((b) => {
            const isSelected = activeBus?.id === b.id;
            const bBooked = fleetService.getBookedSeatsForBus(b.id);
            const bAvail = b.totalSeats - bBooked.length;

            return (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBus(b);
                  setSelectedSeatCodes([]);
                }}
                className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-[#B91C1C] bg-red-50/40 dark:bg-red-950/20 ring-2 ring-[#B91C1C]/20 shadow-md'
                    : 'border-[#E7E2DA] dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-[#B91C1C] bg-white dark:bg-stone-800 px-2.5 py-1 rounded-xl border border-stone-200 dark:border-stone-700">
                    {b.registrationNumber}
                  </span>
                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {bAvail} Seats Left
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-black text-[#1C1917] dark:text-white">{b.name}</h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 font-semibold">{b.busType}</p>
                </div>

                <div className="p-3 bg-[#FBF9F7] dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-700/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-[#1C1917] dark:text-white">
                    <span>{b.origin}</span>
                    <span className="text-stone-400">──▶</span>
                    <span>{b.destination}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>Departs: <strong>{b.departureTime}</strong></span>
                    <span>Fare: <strong className="text-[#B91C1C] text-xs">₹{b.basePrice}</strong></span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-stone-500 flex items-center gap-1 font-semibold">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    Driver: <strong>{b.driverName}</strong>
                  </span>
                  <button
                    type="button"
                    className={`px-3 py-1 rounded-xl text-xs font-bold ${
                      isSelected
                        ? 'bg-[#B91C1C] text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Pick Seats'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. REAL-TIME SEAT SELECTION & CHASSIS (Exact image layout) */}
      {activeBus && (
        <div id="seat-selection" className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-bold text-stone-600 dark:text-stone-300 mb-1">
                <span>Selected Coach: {activeBus.name} ({activeBus.registrationNumber})</span>
              </div>
              <h3 className="text-xl font-black text-[#1C1917] dark:text-white">
                Live 37-Seat Cabin Schematic
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Front VIP (Rows 1-3 in Orange, Green, Yellow) & Rear Executive (Rows 4-10 in Blue). Red seats are already booked.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-500">
                Selected: <strong className="text-[#B91C1C]">{selectedSeatCodes.length > 0 ? selectedSeatCodes.join(', ') : 'None'}</strong>
              </span>
              <button
                type="button"
                disabled={selectedSeatCodes.length === 0}
                onClick={() => setBookingModalOpen(true)}
                className="px-6 py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-black text-xs rounded-2xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <span>Proceed to Checkout ({selectedSeatCodes.length})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Exact Bus Chassis Component */}
            <div className="lg:col-span-5 flex justify-center">
              <BusSeatChassis
                bookedSeatCodes={bookedSeats}
                selectedSeatCodes={selectedSeatCodes}
                onToggleSeat={handleToggleSeat}
                passengerMap={passengerMap}
                interactive={true}
              />
            </div>

            {/* Fare Summary & Booking Info */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-[#FBF9F7] dark:bg-stone-800/40 p-6 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 space-y-4">
                <h4 className="text-sm font-black text-[#1C1917] dark:text-white uppercase tracking-wider">
                  Journey & Pricing Summary
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-stone-400 font-bold text-[10px] uppercase">Route Corridor</span>
                    <p className="font-black text-[#1C1917] dark:text-white mt-0.5">
                      {activeBus.origin} ──▶ {activeBus.destination}
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-400 font-bold text-[10px] uppercase">Departure Time</span>
                    <p className="font-black text-[#1C1917] dark:text-white mt-0.5">
                      Today at {activeBus.departureTime}
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-400 font-bold text-[10px] uppercase">Assigned Driver</span>
                    <p className="font-black text-[#1C1917] dark:text-white mt-0.5">
                      {activeBus.driverName} ({activeBus.driverPhone})
                    </p>
                  </div>
                  <div>
                    <span className="text-stone-400 font-bold text-[10px] uppercase">Coach Plate</span>
                    <p className="font-mono font-black text-[#B91C1C] mt-0.5">
                      {activeBus.registrationNumber}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-700 space-y-2">
                  <div className="flex justify-between text-xs text-stone-600 dark:text-stone-300">
                    <span>Base Fare per Seat</span>
                    <span className="font-bold">₹{activeBus.basePrice}</span>
                  </div>
                  <div className="flex justify-between text-xs text-stone-600 dark:text-stone-300">
                    <span>Selected Berths ({selectedSeatCodes.length})</span>
                    <span className="font-bold">{selectedSeatCodes.join(', ') || 'None'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-[#1C1917] dark:text-white pt-2 border-t border-stone-200 dark:border-stone-700">
                    <span>Total Amount Due</span>
                    <span className="text-[#B91C1C] text-lg font-black">
                      ₹{selectedSeatCodes.length * activeBus.basePrice}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={selectedSeatCodes.length === 0}
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-black text-xs rounded-2xl shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Book Now for ₹{selectedSeatCodes.length * activeBus.basePrice}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {/* Safety and Cancellation Policy Notice */}
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  Zero-Conflict Seat Integrity Guarantee
                </span>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  Seats are locked with atomic transaction integrity. Once confirmed, this berth is instantly marked as SOLD across all other passenger sessions and updated on the driver manifest.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MY BOOKINGS & PASSENGER MANIFEST HISTORY */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-xl font-black text-[#1C1917] dark:text-white">My Confirmed Tickets</h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Access digital boarding passes with QR codes, or cancel bookings for instant simulated refund.
            </p>
          </div>
          <span className="text-xs font-bold text-stone-500">
            {allBookings.length} Active Reservations
          </span>
        </div>

        <div className="space-y-3">
          {allBookings.map((b) => (
            <div
              key={`${b.pnr}-${b.seatCode}`}
              className="p-5 bg-[#FBF9F7] dark:bg-stone-800/40 rounded-2xl border border-[#E7E2DA] dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#B91C1C] text-white flex flex-col items-center justify-center font-black">
                  <span className="text-[10px] leading-none">SEAT</span>
                  <span className="text-base leading-none font-mono">{b.seatCode}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-[#B91C1C] text-xs">{b.pnr}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      CONFIRMED
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#1C1917] dark:text-white mt-0.5">
                    {b.boardingPoint} ──▶ {b.droppingPoint}
                  </h4>
                  <p className="text-xs text-stone-500">Passenger: {b.passengerName} • Fare: ₹{b.fare}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setViewingTicket(b)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>View Boarding Pass</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCancelTargetPnr(b.pnr)}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-[#B91C1C] rounded-xl text-xs font-bold border border-red-200 cursor-pointer"
                >
                  Cancel Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: CHECKOUT & PAYMENT MODAL */}
      {bookingModalOpen && activeBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E7E2DA] dark:border-stone-800 space-y-5">
            <button
              type="button"
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-800 dark:hover:text-white rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black text-[#1C1917] dark:text-white">
                Complete Passenger Reservation
              </h3>
              <p className="text-xs text-stone-500">
                Reserving Berths: <strong className="text-[#B91C1C]">{selectedSeatCodes.join(', ')}</strong> on {activeBus.name} ({activeBus.registrationNumber})
              </p>
            </div>

            {bookingError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
                {bookingError}
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Primary Passenger Full Name
                </label>
                <input
                  type="text"
                  required
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="e.g. Gurpreet Singh"
                  className="w-full px-4 py-2.5 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Mobile Number (SMS PNR)
                  </label>
                  <input
                    type="tel"
                    required
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Email for e-Ticket
                  </label>
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              {/* Payment Option */}
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-[#B91C1C] bg-red-50 text-[#B91C1C]'
                        : 'border-[#E7E2DA] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    ⚡ UPI / GPay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-[#B91C1C] bg-red-50 text-[#B91C1C]'
                        : 'border-[#E7E2DA] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    💳 Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-[#B91C1C] bg-red-50 text-[#B91C1C]'
                        : 'border-[#E7E2DA] dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    🏦 NetBanking
                  </button>
                </div>
              </div>

              {/* Price total and action */}
              <div className="p-4 bg-[#F3EFEA] dark:bg-stone-800 rounded-2xl border border-[#E7E2DA] dark:border-stone-700 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Total Fare</span>
                  <p className="text-xl font-black text-[#1C1917] dark:text-white">
                    ₹{selectedSeatCodes.length * activeBus.basePrice}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2.5 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    Pay & Issue Ticket
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMED TICKET BOARDING PASS */}
      {viewingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E7E2DA] space-y-5">
            <button
              type="button"
              onClick={() => setViewingTicket(null)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-[#1C1917]">Digital Boarding Pass</h3>
              <p className="text-xs text-stone-500">
                PNR Reference: <strong className="text-[#B91C1C] font-mono text-sm">{viewingTicket.pnr}</strong>
              </p>
            </div>

            <div className="bg-[#FBF9F7] rounded-2xl p-5 border border-[#E7E2DA] space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="font-bold text-stone-500">Passenger:</span>
                <span className="font-black text-[#1C1917]">{viewingTicket.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-500">Seat Code:</span>
                <span className="font-mono font-black text-[#B91C1C] text-sm">{viewingTicket.seatCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-stone-500">Corridor:</span>
                <span className="font-bold text-[#1C1917]">{viewingTicket.boardingPoint} ──▶ {viewingTicket.droppingPoint}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-500">Amount Paid:</span>
                <span className="font-black text-emerald-600">₹{viewingTicket.fare}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-[#1C1917] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingTicket(null)}
                className="flex-1 py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CANCELLATION MODAL */}
      {cancelTargetPnr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-red-100 space-y-4">
            <button
              type="button"
              onClick={() => setCancelTargetPnr(null)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-[#B91C1C] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#1C1917]">Cancel Ticket Reservation</h3>
                <p className="text-xs text-stone-500">PNR: {cancelTargetPnr}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              According to the Rova cancellation rule: trips cancelled more than 2 hours before departure receive a <strong>90% simulated refund</strong>. Once cancelled, this seat will immediately become AVAILABLE for other passengers.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelTargetPnr(null)}
                className="flex-1 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Keep Ticket
              </button>
              <button
                type="button"
                onClick={() => handleCancelBooking(cancelTargetPnr)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;
