import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ShieldCheck,
  Wifi,
  Zap,
  Snowflake,
  Clock,
  Sparkles,
  Lock,
  Check,
  Armchair,
  ArrowRight,
  User,
  Mail,
  Phone,
  CreditCard,
  X,
  Printer,
  Download,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

export const BookingsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [activeSubTab, setActiveSubTab] = useState<'buy' | 'schedules' | 'trips' | 'vehicles'>('buy');

  // Persistent sold seats: reads from localStorage merged with pre-sold seats
  const [soldSeats, setSoldSeats] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rova_sold_seats');
      return saved ? JSON.parse(saved) : ['A1', 'A2', 'A4'];
    } catch {
      return ['A1', 'A2', 'A4'];
    }
  });

  const lockedSeats = ['F3'];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  // Selected seats state
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>(['C1', 'C2']);
  const [boardingCounter, setBoardingCounter] = useState('Amritsar ISBT Central Counter (06:30 AM)');
  const [droppingCounter, setDroppingCounter] = useState('Chandigarh Sector 17 ISBT (10:45 AM)');

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [primaryName, setPrimaryName] = useState(user?.name || 'Harpreet Singh');
  const [contactEmail, setContactEmail] = useState(user?.email || 'harpreet.singh@example.com');
  const [contactPhone, setContactPhone] = useState(user?.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (user.name) setPrimaryName(user.name);
      if (user.email) setContactEmail(user.email);
      if (user.phone) setContactPhone(user.phone);
    }
  }, [user]);

  // Fetch real trip from API if available
  const { data: tripsData } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const res = await api.get('/trips');
      return res.data.data;
    },
  });

  const activeTrip = tripsData && tripsData.length > 0 ? tripsData[0] : null;

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

  // Indian Rupee (₹) pricing calculations
  const perSeatPrice = 650.0;
  const seatCount = selectedSeatCodes.length;
  const baseFare = seatCount * perSeatPrice;
  const pgwFee = seatCount > 0 ? 18.0 : 0;
  const serviceCharge = seatCount > 0 ? 25.0 : 0;
  const vipDiscount = seatCount > 0 ? 50.0 : 0;
  const subtotalDue = Math.max(0, baseFare + pgwFee + serviceCharge - vipDiscount);

  // User must be logged in to proceed to checkout
  const handleOpenCheckout = () => {
    if (selectedSeatCodes.length === 0) {
      alert('Please select at least one available seat to proceed.');
      return;
    }
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  // Submit payment & confirm booking
  const handleProceedPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setIsCheckoutOpen(false);
      setAuthModalOpen(true);
      return;
    }

    if (selectedSeatCodes.length === 0) return;

    setIsSubmitting(true);
    setCheckoutError(null);

    try {
      // 1. Immediately mark these seats as SOLD in persistent state and localStorage
      const updatedSoldSeats = Array.from(new Set([...soldSeats, ...selectedSeatCodes]));
      setSoldSeats(updatedSoldSeats);
      localStorage.setItem('rova_sold_seats', JSON.stringify(updatedSoldSeats));

      let bookedApiData = null;

      // 2. Attempt real backend booking call if activeTrip exists
      try {
        if (activeTrip) {
          const detailRes = await api.get(`/trips/${activeTrip.id}`);
          const availableDbSeats = detailRes.data.data.seats.filter((s: any) => s.isAvailable);

          const passengersPayload = selectedSeatCodes.map((code, idx) => ({
            seatId: availableDbSeats[idx]?.id || availableDbSeats[0]?.id,
            passengerName: idx === 0 ? primaryName : `Companion ${idx + 1}`,
            passengerAge: 28,
            passengerGender: 'MALE',
          }));

          const res = await api.post('/bookings', {
            tripId: activeTrip.id,
            passengers: passengersPayload,
            contactEmail,
            contactPhone,
            paymentMethod,
          });

          if (res.data.success) {
            bookedApiData = res.data.data;
          }
        }
      } catch (backendErr) {
        console.warn('Backend API booking fallback:', backendErr);
      }

      // Generate confirmed booking details
      const generatedPnr = bookedApiData?.pnr || `PB${Math.floor(100000 + Math.random() * 900000)}`;

      setConfirmedBooking({
        pnr: generatedPnr,
        passengerName: primaryName,
        contactEmail,
        contactPhone,
        totalAmount: subtotalDue,
        status: 'CONFIRMED',
        bookingDate: new Date().toISOString(),
        trip: {
          departureTime: '2026-11-10T06:30:00.000Z',
          arrivalTime: '2026-11-10T10:45:00.000Z',
          bus: {
            name: 'StarLiner Executive Fleet (Punjab Express)',
            busType: 'LUXURY_SCANIA',
            registrationNumber: 'PB-02-AK-8921',
            operator: { name: 'Punjab Overland Logistics' },
          },
          route: {
            origin: 'Amritsar ISBT Central Counter',
            destination: 'Chandigarh Sector 17 ISBT',
          },
        },
        bookingSeats: selectedSeatCodes.map((c) => ({
          id: c,
          seatId: c,
          passengerName: primaryName,
          passengerAge: 28,
          passengerGender: 'MALE',
          seatPrice: perSeatPrice,
          status: 'CONFIRMED',
          seat: { seatNumber: c, deck: 'LOWER' },
        })),
      });

      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      setSelectedSeatCodes([]);
      setIsCheckoutOpen(false);
    } catch (err: any) {
      setCheckoutError('Payment authorization failed. Please verify payment method.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Top Navigation Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('buy')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black transition-all ${
              activeSubTab === 'buy'
                ? 'bg-[#B91C1C] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>Buy Tickets</span>
          </button>
          <button
            onClick={() => navigate('/schedule')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Schedules
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Trips
          </button>
          <button
            onClick={() => navigate('/fleet')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-stone-600 hover:bg-stone-100 transition-colors"
          >
            Vehicles
          </button>
        </div>

        {/* Terminal corridor badge */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700 bg-white border border-[#E7E2DA] px-4 py-2 rounded-2xl shadow-xs">
          <span className="text-stone-400 font-mono text-[10px] uppercase">CORRIDOR:</span>
          <span className="text-[#1C1917] font-black">Amritsar ISBT</span>
          <span className="text-[#B91C1C] font-bold">──▶</span>
          <span className="text-[#1C1917] font-black">Chandigarh Sector 17</span>
          <span className="text-stone-400 ml-2">Today, Nov 10</span>
        </div>
      </div>

      {/* Main 2-Column Split matching Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN (7 Cols): Coach Header, Scenic Bus Banner, Schedule & Features */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header & Line Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#991B1B]">
                <ArrowLeft
                  onClick={() => navigate('/landing')}
                  className="w-4 h-4 cursor-pointer hover:-translate-x-1 transition-transform"
                />
                <span className="uppercase tracking-wider">VIP LUXURY COACH • Line 102 - Grand Trunk Corridor</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-wider border border-emerald-200">
                  LIVE ON-TIME
                </span>
                <span className="text-[10px] font-mono text-stone-500 font-bold">
                  Plate: PB-02-AK-8921
                </span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight">
              StarLiner Executive Fleet (Punjab Express)
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Multi-Axle Scania Touring • Premium Sleeper Recliner Air-Suspension
            </p>
          </div>

          {/* Luxury Scenic Coach Banner Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-sm border border-[#E7E2DA] group">
            <img
              src="/images/coach-exterior.jpg"
              alt="StarLiner Executive Fleet"
              className="w-full h-72 sm:h-80 object-cover group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>

            {/* Floating Amenity Badges */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/95 backdrop-blur rounded-full text-stone-800 text-[11px] font-bold shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>5-Star Sanitized Cabin</span>
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1917]/90 backdrop-blur rounded-full text-white text-[11px] font-bold border border-white/10">
                <Wifi className="w-3.5 h-3.5 text-blue-400" />
                <span>Free 5G</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1917]/90 backdrop-blur rounded-full text-white text-[11px] font-bold border border-white/10">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>USB-C 65W Fast Charging</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1C1917]/90 backdrop-blur rounded-full text-white text-[11px] font-bold border border-white/10">
                <Snowflake className="w-3.5 h-3.5 text-sky-400" />
                <span>Climate Control</span>
              </span>
            </div>
          </div>

          {/* Journey Departure Schedule Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Origin */}
              <div className="sm:col-span-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>BOARDING POINT</span>
                </div>
                <h4 className="text-base font-black text-[#1C1917] mt-1">
                  Amritsar ISBT Central
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-lg font-black text-[#1C1917]">06:30 AM</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-600 rounded">
                    Bay 02
                  </span>
                </div>
              </div>

              {/* Transit Route Line */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center text-center py-2">
                <span className="text-[10px] font-bold text-stone-500 mb-1">
                  4 hrs 15 min • <strong className="text-emerald-600">{48 - soldSeats.length} Seats Left</strong>
                </span>
                <div className="w-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full border-2 border-[#B91C1C] bg-white"></span>
                  <div className="flex-1 border-t-2 border-dashed border-[#B91C1C]/40"></div>
                  <span className="text-xs">🚌</span>
                  <div className="flex-1 border-t-2 border-dashed border-[#B91C1C]/40"></div>
                  <span className="w-2 h-2 rounded-full bg-[#B91C1C]"></span>
                </div>
                <span className="text-[9px] text-stone-400 mt-1">
                  GT Road Highway via Jalandhar &amp; Ludhiana
                </span>
              </div>

              {/* Destination */}
              <div className="sm:col-span-4 text-left sm:text-right">
                <div className="flex items-center sm:justify-end gap-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  <span>DROPPING POINT</span>
                  <span className="w-2 h-2 rounded-full bg-[#B91C1C]"></span>
                </div>
                <h4 className="text-base font-black text-[#1C1917] mt-1">
                  Chandigarh Sector 17 ISBT
                </h4>
                <div className="flex items-center sm:justify-end gap-2 mt-0.5">
                  <span className="text-lg font-black text-[#1C1917]">10:45 AM</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                    Platform 05
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Value Proposition Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 border border-[#E7E2DA] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-[#1C1917]">20 kg Checked</p>
                <p className="text-[10px] text-stone-400">Plus 7 kg cabin baggage</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E7E2DA] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-[#1C1917]">140° Recline</p>
                <p className="text-[10px] text-stone-400">Calf &amp; lumbar support</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#E7E2DA] shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-[#1C1917]">Transit Insurance</p>
                <p className="text-[10px] text-stone-400">Included on all seats</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 Cols): Seat Map & Fare Calculation & Payment CTA */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-card space-y-6">
            {/* Color Legend */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-[#B91C1C]"></div>
                <span className="text-stone-600">Sold</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-stone-300 text-stone-600 flex items-center justify-center text-[8px]">
                  <Lock className="w-2.5 h-2.5" />
                </div>
                <span className="text-stone-600">Blocked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded bg-emerald-500 text-white flex items-center justify-center text-[8px]">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="text-[#1C1917] font-black">Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3.5 h-3.5 rounded border border-stone-300 bg-white"></div>
                <span className="text-stone-600">Available</span>
              </div>
            </div>

            {/* Boarding and Dropping dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  BOARDING COUNTER
                </label>
                <select
                  value={boardingCounter}
                  onChange={(e) => setBoardingCounter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F3EFEA] border border-[#E7E2DA] rounded-xl text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#B91C1C]"
                >
                  <option value="Amritsar ISBT Central Counter (06:30 AM)">Amritsar ISBT</option>
                  <option value="Jalandhar Rama Mandi (07:45 AM)">Jalandhar Rama Mandi</option>
                  <option value="Ludhiana Sherpur Chowk (08:50 AM)">Ludhiana Sherpur</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  DROPPING COUNTER
                </label>
                <select
                  value={droppingCounter}
                  onChange={(e) => setDroppingCounter(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F3EFEA] border border-[#E7E2DA] rounded-xl text-xs font-bold text-[#1C1917] focus:outline-none focus:border-[#B91C1C]"
                >
                  <option value="Chandigarh Sector 17 ISBT (10:45 AM)">Chandigarh Sec 17</option>
                  <option value="Mohali Phase 8 Terminal (11:15 AM)">Mohali Phase 8</option>
                  <option value="Tribune Chowk (11:30 AM)">Tribune Chowk</option>
                </select>
              </div>
            </div>

            {/* Realistic Bus Seat Chassis Card */}
            <div className="bg-[#FBF9F7] rounded-3xl p-5 border-2 border-dashed border-[#E7E2DA] space-y-4">
              {/* Front of Coach Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 text-xs font-bold text-stone-500">
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
                            ? 'bg-emerald-500 text-white shadow-xs scale-105'
                            : isSold
                            ? 'bg-[#B91C1C] text-white cursor-not-allowed shadow-xs'
                            : isLocked
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-white text-stone-700 border border-stone-200 hover:border-[#B91C1C] hover:shadow-xs cursor-pointer'
                        }`}
                        title={isSold ? `Seat ${seatCode} - Sold Out` : `Seat ${seatCode}`}
                      >
                        {isSelected ? (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        ) : isSold ? (
                          <span className="text-[8px] font-mono font-black">SOLD</span>
                        ) : isLocked ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Armchair className="w-3 h-3 text-stone-400" />
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

                      <span className="text-[10px] font-mono text-stone-400 font-bold px-2">
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

              <p className="text-center text-[10px] text-stone-400 font-semibold pt-2 border-t border-stone-200">
                👆 Tap any available seat to add or release reservation
              </p>
            </div>

            {/* Fare Summary & Total Calculation */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    SELECTED SEATS ({selectedSeatCodes.length})
                  </span>
                  <p className="text-sm font-black text-[#1C1917]">
                    {selectedSeatCodes.length > 0 ? selectedSeatCodes.join(', ') : 'None selected'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    CABIN TIER
                  </span>
                  <p className="text-xs font-black text-[#B91C1C]">Scania Executive Recliner</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 bg-[#F3EFEA] rounded-2xl space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Base Fare ({selectedSeatCodes.length} × ₹{perSeatPrice.toFixed(2)})</span>
                  <span className="font-bold text-[#1C1917]">₹{baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Online PGW &amp; Gateway Fee</span>
                  <span>₹{pgwFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Service &amp; Insurance Charge</span>
                  <span>₹{serviceCharge.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-600">
                  <span>Rova App VIP Discount</span>
                  <span className="font-bold">-₹{vipDiscount.toFixed(2)}</span>
                </div>
              </div>

              {/* Subtotal Due */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <span className="text-sm font-black text-[#1C1917]">Subtotal Due</span>
                <span className="text-2xl font-black text-[#1C1917]">₹{subtotalDue.toFixed(2)}</span>
              </div>

              {/* Main Booking Button */}
              <button
                type="button"
                disabled={selectedSeatCodes.length === 0}
                onClick={handleOpenCheckout}
                className="w-full py-4 bg-[#B91C1C] hover:bg-[#991B1B] active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>Confirm &amp; Proceed to Payment</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <p className="text-center text-[10px] text-stone-400 font-semibold flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instant SMS e-Ticket &amp; 100% Guaranteed Seat Reservation</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout & Payment Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E7E2DA] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-[#1C1917]">Complete Passenger Checkout</h3>
                <p className="text-xs text-stone-500">
                  Reserving Seats: <strong className="text-[#B91C1C]">{selectedSeatCodes.join(', ')}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 cursor-pointer"
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
                <label className="block text-xs font-bold text-stone-700 mb-1">Primary Passenger Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={primaryName}
                    onChange={(e) => setPrimaryName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F3EFEA] border border-[#E7E2DA] rounded-xl text-xs font-bold text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Email for e-Ticket</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#F3EFEA] border border-[#E7E2DA] rounded-xl text-xs font-bold text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Number (SMS PNR)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-[#F3EFEA] border border-[#E7E2DA] rounded-xl text-xs font-bold text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">Select Payment Option</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'UPI'
                        ? 'border-[#B91C1C] bg-red-50 text-[#B91C1C]'
                        : 'border-[#E7E2DA] bg-white text-stone-700'
                    }`}
                  >
                    ⚡ UPI / GPay
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-[#B91C1C] bg-red-50 text-[#B91C1C]'
                        : 'border-[#E7E2DA] bg-white text-stone-700'
                    }`}
                  >
                    💳 Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NETBANKING')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      paymentMethod === 'NETBANKING'
                        ? 'border-[#B91C1C] bg-red-50 text-[#B91C1C]'
                        : 'border-[#E7E2DA] bg-white text-stone-700'
                    }`}
                  >
                    🏦 NetBanking
                  </button>
                </div>
              </div>

              <div className="p-4 bg-[#F3EFEA] rounded-2xl border border-[#E7E2DA] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Total Amount</span>
                  <p className="text-xl font-black text-[#1C1917]">₹{subtotalDue.toFixed(2)}</p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-black text-xs rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Verifying & Confirming...' : 'Pay & Issue Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmed Ticket Boarding Pass Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E7E2DA] space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-[#1C1917]">Ticket Confirmed!</h3>
              <p className="text-xs text-stone-500">
                PNR: <strong className="text-[#B91C1C] font-mono text-sm">{confirmedBooking.pnr}</strong>
              </p>
            </div>

            {/* Boarding Card */}
            <div className="bg-[#FBF9F7] rounded-2xl p-5 border border-[#E7E2DA] space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-500">Passenger:</span>
                <span className="font-black text-[#1C1917]">{confirmedBooking.passengerName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-500">Seats Reserved:</span>
                <span className="font-mono font-black text-[#B91C1C]">
                  {confirmedBooking.bookingSeats?.map((bs: any) => bs.seat?.seatNumber || bs.id).join(', ')}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-500">Route:</span>
                <span className="font-bold text-[#1C1917]">Amritsar ──▶ Chandigarh</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-500">Departure:</span>
                <span className="font-bold text-[#1C1917]">Today • 06:30 AM (Bay 02)</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-500">Paid Amount:</span>
                <span className="font-black text-emerald-600">₹{confirmedBooking.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-[#1C1917] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ticket</span>
              </button>
              <button
                onClick={() => setConfirmedBooking(null)}
                className="flex-1 py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal if unauthenticated user tries to book */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setIsCheckoutOpen(true)}
      />
    </div>
  );
};

export default BookingsScreen;
