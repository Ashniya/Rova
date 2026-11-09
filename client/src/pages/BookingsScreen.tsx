import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  ArrowLeft,
  Wifi,
  Zap,
  Snowflake,
  ShieldCheck,
  Luggage,
  Sparkles,
  Lock,
  Armchair,
  Check,
  ArrowRight,
  Clock,
  MapPin,
  X,
  CreditCard,
  User,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import TicketCard from '../components/TicketCard';

export const BookingsScreen: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'buy' | 'schedules' | 'trips' | 'vehicles'>('buy');

  // Selected seats state: initially C1, C2 as in Image 2
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>(['C1', 'C2']);
  const [boardingCounter, setBoardingCounter] = useState('Dhaka-Kallayanpur (05:30 PM)');
  const [droppingCounter, setDroppingCounter] = useState('Rangpur Modern Mo (12:30 AM)');

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [primaryName, setPrimaryName] = useState('Elena Rostova');
  const [contactEmail, setContactEmail] = useState('elena.rostova@example.com');
  const [contactPhone, setContactPhone] = useState('+1 (206) 884-2104');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  // Fetch real trip from API if available to bind real database booking
  const { data: tripsData } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const res = await api.get('/trips');
      return res.data.data;
    },
  });

  const activeTrip = tripsData && tripsData.length > 0 ? tripsData[0] : null;

  // Seat matrix definition exactly matching Image 2
  // Rows A to G, cols 1, 2, 3, 4
  const soldSeats = ['A1', 'A2', 'A4'];
  const lockedSeats = ['F3'];

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  const handleToggleSeat = (seatCode: string) => {
    if (soldSeats.includes(seatCode) || lockedSeats.includes(seatCode)) return;

    if (selectedSeatCodes.includes(seatCode)) {
      setSelectedSeatCodes(selectedSeatCodes.filter((s) => s !== seatCode));
    } else {
      if (selectedSeatCodes.length >= 6) {
        alert('Maximum 6 seats per booking.');
        return;
      }
      setSelectedSeatCodes([...selectedSeatCodes, seatCode]);
    }
  };

  // Pricing calculations
  const perSeatPrice = 55.0;
  const seatCount = selectedSeatCodes.length;
  const baseFare = seatCount * perSeatPrice;
  const pgwFee = seatCount > 0 ? 2.2 : 0;
  const serviceCharge = seatCount > 0 ? 2.3 : 0;
  const vipDiscount = seatCount > 0 ? 10.0 : 0;
  const subtotalDue = Math.max(0, baseFare + pgwFee + serviceCharge - vipDiscount);

  // Submit booking
  const handleProceedPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSeatCodes.length === 0) return;

    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      if (activeTrip) {
        // Fetch trip detail to get valid seat IDs
        const detailRes = await api.get(`/trips/${activeTrip.id}`);
        const availableDbSeats = detailRes.data.data.seats.filter((s: any) => s.isAvailable);

        const passengersPayload = selectedSeatCodes.map((code, idx) => {
          const dbSeat = availableDbSeats[idx] || availableDbSeats[0];
          return {
            seatId: dbSeat.id,
            passengerName: idx === 0 ? primaryName : `Companion ${idx + 1}`,
            passengerAge: 28,
            passengerGender: 'FEMALE',
          };
        });

        const res = await api.post('/bookings', {
          tripId: activeTrip.id,
          passengers: passengersPayload,
          contactEmail,
          contactPhone,
          paymentMethod,
        });

        if (res.data.success) {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
          const ticketRes = await api.get(`/bookings/${res.data.data.pnr}`);
          setConfirmedBooking(ticketRes.data.data);
          setIsCheckoutOpen(false);
        }
      } else {
        // Fallback simulated booking
        setConfirmedBooking({
          pnr: 'RV' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          passengerName: primaryName,
          contactEmail,
          contactPhone,
          totalAmount: subtotalDue,
          status: 'CONFIRMED',
          bookingDate: new Date().toISOString(),
          trip: {
            departureTime: new Date().toISOString(),
            arrivalTime: new Date(Date.now() + 7 * 3600 * 1000).toISOString(),
            bus: {
              name: 'StarLiner Executive Fleet',
              busType: 'LUXURY_VOLVO',
              registrationNumber: 'DHA-METRO-11-8921',
              operator: { name: 'StarLiner Transit' },
            },
            route: {
              origin: 'Dhaka-Kallayanpur',
              destination: 'Rangpur-Bus Counter',
            },
          },
          bookingSeats: selectedSeatCodes.map((c) => ({
            id: c,
            seatId: c,
            passengerName: primaryName,
            passengerAge: 28,
            passengerGender: 'FEMALE',
            seatPrice: 55,
            status: 'CONFIRMED',
            seat: { seatNumber: c, deck: 'LOWER' },
          })),
        });
        setIsCheckoutOpen(false);
      }
    } catch (err: any) {
      setCheckoutError(err.response?.data?.message || 'Booking reservation could not be completed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Top Navigation Strip matching Image 2 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          {/* Sub tabs */}
          <button
            onClick={() => setActiveSubTab('buy')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeSubTab === 'buy'
                ? 'bg-[#B91C1C] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Buy Tickets</span>
          </button>
          <button
            onClick={() => setActiveSubTab('schedules')}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Schedules
          </button>
          <button
            onClick={() => setActiveSubTab('trips')}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Trips
          </button>
          <button
            onClick={() => setActiveSubTab('vehicles')}
            className="px-4 py-2 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Vehicles
          </button>
        </div>

        {/* Terminal corridor badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-xs">
          <span className="text-slate-400 font-mono text-[10px] uppercase">TERMINAL:</span>
          <span className="text-slate-900 font-black">Dhaka Kallayanpur</span>
          <span className="text-[#B91C1C] font-bold">──▶</span>
          <span className="text-slate-900 font-black">Rangpur Central</span>
          <span className="text-slate-400 ml-2">Today, 24 Oct</span>
        </div>
      </div>

      {/* Main 2-Column Split matching Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (7 Cols): Coach Header, Scenic Bus Banner, Schedule & Features */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Line Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#991B1B]">
                <ArrowLeft className="w-4 h-4 cursor-pointer hover:-translate-x-1 transition-transform" />
                <span className="uppercase tracking-wider">VIP LUXURY COACH • Line 1713-Rangpur</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-wider border border-emerald-200">
                  LIVE ON-TIME
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  Plate: DHA-METRO-11-8921
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              StarLiner Executive Fleet
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Multi-Axle Scania Touring • Premium Sleeper Recliner Air-Suspension
            </p>
          </div>

          {/* Luxury Scenic Coach Banner Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 group">
            <img
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
              alt="StarLiner Executive Fleet"
              className="w-full h-72 sm:h-80 object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

            {/* Floating Amenity Badges over image matching Image 2 */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur rounded-full text-slate-800 text-[11px] font-bold shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>5-Star Sanitized Cabin</span>
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sidebar-bg/90 backdrop-blur rounded-full text-white text-[11px] font-bold border border-white/10">
                <Wifi className="w-3.5 h-3.5 text-blue-400" />
                <span>Free 5G</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sidebar-bg/90 backdrop-blur rounded-full text-white text-[11px] font-bold border border-white/10">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>USB-C 65W</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sidebar-bg/90 backdrop-blur rounded-full text-white text-[11px] font-bold border border-white/10">
                <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                <span>Climate Control</span>
              </span>
            </div>
          </div>

          {/* Journey Departure Schedule Card matching Image 2 */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Origin */}
              <div className="sm:col-span-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>BOARDING POINT</span>
                </div>
                <h4 className="text-base font-black text-slate-900 mt-1">
                  Dhaka-Kallayanpur Counter
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-black text-slate-900">05:30 PM</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    Gate 4
                  </span>
                </div>
              </div>

              {/* Transit Route Line */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center text-center py-2">
                <span className="text-[10px] font-bold text-slate-500 mb-1">
                  7 hrs 00 min • <strong className="text-emerald-600">28 Seats Left</strong>
                </span>
                <div className="w-full flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  <div className="flex-1 border-b-2 border-dashed border-slate-300 relative">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs">🚌</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#B91C1C]"></div>
                </div>
                <span className="text-[10px] text-slate-400 mt-1">
                  Direct Hwy via Bangabandhu Bridge
                </span>
              </div>

              {/* Destination */}
              <div className="sm:col-span-4 sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-[#B91C1C]"></span>
                  <span>DROPPING POINT</span>
                </div>
                <h4 className="text-base font-black text-slate-900 mt-1">
                  Rangpur-Bus Counter
                </h4>
                <div className="flex items-center sm:justify-end gap-2 mt-0.5">
                  <span className="text-lg font-black text-slate-900">12:30 AM</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-50 text-[#991B1B] rounded">
                    +1 Day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Key Feature Pills matching Image 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#991B1B] flex items-center justify-center shrink-0">
                <Luggage className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">20 kg Checked</p>
                <p className="text-[10px] text-slate-400">Plus 7 kg hand luggage</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">140° Recline</p>
                <p className="text-[10px] text-slate-400">Calf & lumbar support</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-900">Transit Insurance</p>
                <p className="text-[10px] text-slate-400">Included on all seats</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): Seat Map & Fare Calculation & Payment CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-floating space-y-6">
            {/* Color Legend matching Image 2 */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-[#B91C1C]"></div>
                <span className="text-slate-600">Sold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-slate-300 text-slate-600 flex items-center justify-center text-[8px]">
                  <Lock className="w-2.5 h-2.5" />
                </div>
                <span className="text-slate-600">Blocked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-brand-500 text-white flex items-center justify-center text-[8px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-slate-900 font-black">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded border border-slate-300 bg-white"></div>
                <span className="text-slate-600">Available</span>
              </div>
            </div>

            {/* Boarding and Dropping dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  BOARDING COUNTER
                </label>
                <select
                  value={boardingCounter}
                  onChange={(e) => setBoardingCounter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#B91C1C]"
                >
                  <option value="Dhaka-Kallayanpur (05:30 PM)">Dhaka-Kallayanpur</option>
                  <option value="Gabtoli Central (06:00 PM)">Gabtoli Central</option>
                  <option value="Airport Counter (06:45 PM)">Airport Counter</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  DROPPING COUNTER
                </label>
                <select
                  value={droppingCounter}
                  onChange={(e) => setDroppingCounter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-[#B91C1C]"
                >
                  <option value="Rangpur Modern Mo (12:30 AM)">Rangpur Modern Mo</option>
                  <option value="KamalKachna (01:00 AM)">KamalKachna</option>
                  <option value="Rangpur Bypass (01:30 AM)">Rangpur Bypass</option>
                </select>
              </div>
            </div>

            {/* Realistic Bus Seat Chassis Card matching Image 2 */}
            <div className="bg-slate-50/80 rounded-3xl p-5 border-2 border-dashed border-slate-200 space-y-4">
              {/* Front of Coach Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-bold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span>🚪</span> COACH ENTRY
                </span>
                <span className="flex items-center gap-1.5">
                  DRIVER CABIN <span>☸️</span>
                </span>
              </div>

              {/* Rows A through G, 2+2 layout */}
              <div className="space-y-2.5">
                {rows.map((rowLetter) => {
                  const s1 = `${rowLetter}1`;
                  const s2 = `${rowLetter}2`;
                  const s3 = `${rowLetter}3`;
                  const s4 = `${rowLetter}4`;

                  const renderSeatBtn = (seatCode: string) => {
                    const isSold = soldSeats.includes(seatCode);
                    const isLocked = lockedSeats.includes(seatCode);
                    const isSelected = selectedSeatCodes.includes(seatCode);

                    return (
                      <button
                        key={seatCode}
                        type="button"
                        disabled={isSold || isLocked}
                        onClick={() => handleToggleSeat(seatCode)}
                        className={`w-9 h-10 rounded-xl flex flex-col items-center justify-center text-[10px] font-bold transition-all ${
                          isSelected
                            ? 'bg-brand-500 text-white shadow-xs scale-105'
                            : isSold
                            ? 'bg-[#B91C1C] text-white cursor-not-allowed shadow-xs'
                            : isLocked
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-white text-slate-700 border border-slate-200 hover:border-[#B91C1C] hover:shadow-xs'
                        }`}
                        title={`Seat ${seatCode}`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : isSold ? (
                          <span className="text-[9px]">SOLD</span>
                        ) : isLocked ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Armchair className="w-3 h-3 text-slate-400" />
                        )}
                        <span className="leading-none mt-0.5">{seatCode}</span>
                      </button>
                    );
                  };

                  return (
                    <div key={rowLetter} className="flex items-center justify-between">
                      {/* Left Pair */}
                      <div className="flex items-center gap-2">
                        {renderSeatBtn(s1)}
                        {renderSeatBtn(s2)}
                      </div>

                      {/* Aisle Row Indicator */}
                      <span className="text-[10px] font-mono font-bold text-slate-400">
                        Row {rowLetter}
                      </span>

                      {/* Right Pair */}
                      <div className="flex items-center gap-2">
                        {renderSeatBtn(s3)}
                        {renderSeatBtn(s4)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-400 font-medium">
                Tap any seat to add or release reservation
              </div>
            </div>

            {/* Price Breakdown Calculation Card matching Image 2 */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">SELECTED SEATS</span>
                  <p className="text-sm font-black text-slate-900">
                    {selectedSeatCodes.length > 0 ? selectedSeatCodes.join(', ') : 'None'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">CABIN TIER</span>
                  <p className="text-xs font-black text-[#991B1B]">E-Class Luxury</p>
                </div>
              </div>

              {/* Cost Rows */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Base Fare ({seatCount} x ${perSeatPrice.toFixed(2)})</span>
                  <span className="font-bold text-slate-900">${baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Online PGW & Gateway Fee</span>
                  <span className="font-bold text-slate-900">${pgwFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service & Insurance Charge</span>
                  <span className="font-bold text-slate-900">${serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>App VIP Discount</span>
                  <span className="font-bold">-${vipDiscount.toFixed(2)}</span>
                </div>
              </div>

              {/* Subtotal Due */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <span className="text-sm font-black text-slate-900">Subtotal Due</span>
                <span className="text-2xl font-black text-slate-900">${subtotalDue.toFixed(2)}</span>
              </div>

              {/* Big Coral-Orange CTA Button matching Image 2 */}
              <button
                type="button"
                disabled={selectedSeatCodes.length === 0}
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-4 bg-[#B91C1C] hover:bg-[#991B1B] active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>Confirm & Proceed to Payment</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <p className="text-center text-[10px] text-slate-400 font-semibold flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instant SMS e-Ticket & 100% Guaranteed Seat Reservation</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Passenger Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900">Complete Passenger Checkout</h3>
                <p className="text-xs text-slate-500">
                  Allocating Seats: <strong className="text-[#B91C1C]">{selectedSeatCodes.join(', ')}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleProceedPayment} className="space-y-4 pt-4">
              {checkoutError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                  {checkoutError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Passenger Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={primaryName}
                    onChange={(e) => setPrimaryName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email for e-Ticket</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">SMS Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['CARD', 'UPI', 'WALLET'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        paymentMethod === m
                          ? 'border-[#B91C1C] bg-red-50 text-[#991B1B]'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {m === 'CARD' ? '💳 Credit Card' : m === 'UPI' ? '⚡ Instant UPI' : '💵 Pay at Counter'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total To Pay</span>
                  <p className="text-xl font-black text-slate-900">${subtotalDue.toFixed(2)}</p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-black text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Confirming Seats...' : 'Authorize & Issue PNR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmed Ticket Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <TicketCard
            booking={confirmedBooking}
            onClose={() => setConfirmedBooking(null)}
          />
        </div>
      )}
    </div>
  );
};

export default BookingsScreen;
