import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  ChevronLeft,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Search,
  Filter,
  Sparkles,
  Zap,
  Wifi,
  ShieldCheck,
  Info,
  Radio,
  Gauge,
  Compass,
  FileText,
  Headphones,
  Send,
  DollarSign,
  Tag,
  Check,
  Navigation,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fleetService, BusData, BookedSeatRecord, PUNJAB_CITIES } from '../services/fleetService';
import BusSeatChassis from '../components/BusSeatChassis';

export const PassengerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Tab from URL query param: coaches | tickets | tracking | timetable | calculator | guidelines | support
  const currentTab = searchParams.get('tab') || 'coaches';

  const [buses, setBuses] = useState<BusData[]>(() => fleetService.getBuses());
  // When selectedBus is set, the entire page transitions into the dedicated full-page booking cockpit!
  const [selectedBus, setSelectedBus] = useState<BusData | null>(null);
  const [selectedSeatCodes, setSelectedSeatCodes] = useState<string[]>([]);
  const [viewingTicket, setViewingTicket] = useState<BookedSeatRecord | null>(null);
  const [cancelTargetPnr, setCancelTargetPnr] = useState<string | null>(null);

  // Big Search Bar States
  const [searchOrigin, setSearchOrigin] = useState('ALL');
  const [searchDest, setSearchDest] = useState('ALL');
  const [searchDate, setSearchDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [searchTimeSlot, setSearchTimeSlot] = useState<string>('ALL');
  const [searchOperator, setSearchOperator] = useState<string>('ALL');

  // Layout View Modes (Grid / Table)
  const [coachViewMode, setCoachViewMode] = useState<'grid' | 'table'>('grid');
  const [ticketViewMode, setTicketViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedTicketBusId, setSelectedTicketBusId] = useState<string | null>(null);
  const [cancelTargetTicket, setCancelTargetTicket] = useState<BookedSeatRecord | null>(null);
  const [cancelRefundDetails, setCancelRefundDetails] = useState<any | null>(null);
  const [, setUpdateTick] = useState(0);

  // Booking Checkout States
  const [passengerName, setPassengerName] = useState(user?.name || 'Amanpreet Singh');
  const [passengerPhone, setPassengerPhone] = useState('+91 98765-43210');
  const [passengerEmail, setPassengerEmail] = useState(user?.email || 'passenger@rova.com');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastConfirmedPnr, setLastConfirmedPnr] = useState<string | null>(null);

  // Ticket Search State
  const [ticketSearchQuery, setTicketSearchQuery] = useState('');

  // Fare Calculator States
  const [calcOrigin, setCalcOrigin] = useState('Amritsar ISBT');
  const [calcDest, setCalcDest] = useState('Chandigarh Sector 17');
  const [calcTier, setCalcTier] = useState<'VIP' | 'STANDARD' | 'SAVER'>('VIP');
  const [calcConcession, setCalcConcession] = useState<'NONE' | 'SENIOR' | 'STUDENT'>('NONE');

  // Support Form State
  const [supportName, setSupportName] = useState(user?.name || '');
  const [supportPhone, setSupportPhone] = useState('');
  const [supportPnr, setSupportPnr] = useState('');
  const [supportCategory, setSupportCategory] = useState('Booking Assistance');
  const [supportMessage, setSupportMessage] = useState('');

  const loadData = () => {
    const list = fleetService.getBuses();
    setBuses([...list]);
    setUpdateTick((t) => t + 1);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('rova_seats_updated', handleUpdate);
    return () => window.removeEventListener('rova_seats_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter buses based on search criteria
  const filteredBuses = buses.filter((b) => {
    const matchOrigin = searchOrigin === 'ALL' || b.origin.toLowerCase().includes(searchOrigin.toLowerCase().split(' ')[0]);
    const matchDest = searchDest === 'ALL' || b.destination.toLowerCase().includes(searchDest.toLowerCase().split(' ')[0]);
    const matchSlot = searchTimeSlot === 'ALL' || b.timeSlot === searchTimeSlot;
    const matchOperator = searchOperator === 'ALL' || b.operatorType.toLowerCase().includes(searchOperator.toLowerCase());
    return matchOrigin && matchDest && matchSlot && matchOperator;
  });

  const bookedSeats = selectedBus ? fleetService.getBookedSeatsForBus(selectedBus.id) : [];
  const passengerMap = selectedBus ? fleetService.getPassengerMapForBus(selectedBus.id) : {};
  const allBookings = fleetService.getAllBookings().filter((b) => b.status !== 'CANCELLED');

  const handleToggleSeat = (seatCode: string) => {
    if (selectedSeatCodes.includes(seatCode)) {
      setSelectedSeatCodes(selectedSeatCodes.filter((s) => s !== seatCode));
    } else {
      setSelectedSeatCodes([...selectedSeatCodes, seatCode]);
    }
  };

  const handleSelectBus = (bus: BusData) => {
    setSelectedBus(bus);
    setSelectedSeatCodes([]);
    setBookingError(null);
    const scrollEl = document.getElementById('main-app-scroll');
    if (scrollEl) {
      scrollEl.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleCloseBusSelector = () => {
    setSelectedBus(null);
    setSelectedSeatCodes([]);
    setBookingError(null);
    const scrollEl = document.getElementById('main-app-scroll');
    if (scrollEl) {
      scrollEl.scrollTo({ top: 0, behavior: 'instant' });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const currentTotalFare = selectedBus ? fleetService.calculateTotalPrice(selectedBus, selectedSeatCodes) : 0;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);

    if (!selectedBus) return;
    if (selectedSeatCodes.length === 0) {
      setBookingError('Please select at least one seat on the 37-seat bus schematic on the right.');
      return;
    }

    const res = fleetService.bookSeats(selectedBus.id, selectedSeatCodes, {
      name: passengerName,
      phone: passengerPhone,
      email: passengerEmail,
      boardingPoint: selectedBus.origin,
      droppingPoint: selectedBus.destination,
      fare: currentTotalFare,
    });

    if (!res.success) {
      setBookingError(res.error || 'Failed to book seats.');
      return;
    }

    const pnr = res.pnr;
    setLastConfirmedPnr(pnr);
    setSelectedSeatCodes([]);
    showToast(`✓ Booking Confirmed! PNR ${pnr} issued. Seats are now locked as SOLD across all devices.`);

    // Find first booked seat for viewing
    const ticket = fleetService.getAllBookings().find((b) => b.pnr === pnr);
    if (ticket) {
      setViewingTicket(ticket);
    }
  };

  const handleOpenCancelModal = (ticket: BookedSeatRecord) => {
    const refund = fleetService.getRefundPolicy(ticket.fare);
    setCancelTargetTicket(ticket);
    setCancelRefundDetails(refund);
  };

  const handleConfirmCancelTicket = () => {
    if (!cancelTargetTicket) return;
    const ok = fleetService.cancelBooking(cancelTargetTicket.pnr, cancelTargetTicket.seatCode);
    if (ok) {
      const refund = cancelRefundDetails || fleetService.getRefundPolicy(cancelTargetTicket.fare);
      showToast(`✓ Ticket ${cancelTargetTicket.pnr} (Seat ${cancelTargetTicket.seatCode}) cancelled! Refund of ₹${refund.refundAmount} credited to ${refund.refundMethod}.`);
      setCancelTargetTicket(null);
      setCancelRefundDetails(null);
      setCancelTargetPnr(null);
    }
  };

  const handleCancelBooking = (pnr: string) => {
    const ok = fleetService.cancelBooking(pnr);
    if (ok) {
      setCancelTargetPnr(null);
      showToast(`Booking ${pnr} cancelled. Refund processed according to rules.`);
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('✓ Support inquiry submitted! Reference #TKT-8921 logged. Station master will call back shortly.');
    setSupportMessage('');
    setSupportPnr('');
  };

  // Calculator logic
  const calcBase = 650;
  const calcTierAmount = calcTier === 'VIP' ? 250 : calcTier === 'SAVER' ? -100 : 0;
  const subtotal = calcBase + calcTierAmount;
  const concessionRate = calcConcession === 'SENIOR' ? 0.2 : calcConcession === 'STUDENT' ? 0.15 : 0;
  const discountAmount = Math.round(subtotal * concessionRate);
  const gstAmount = Math.round((subtotal - discountAmount) * 0.05);
  const finalCalcPrice = subtotal - discountAmount + gstAmount;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-[1700px] mx-auto animate-fadeIn select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 1: DEDICATED FULL-PAGE COACH DETAILS & SEAT BOOKING COCKPIT */}
      {/* ========================================================================= */}
      {currentTab === 'coaches' && selectedBus ? (
        <div className="w-full space-y-6 animate-slideInRight">
          {/* Top Bar with Back Button, Plate, and Close */}
          <div className="bg-white dark:bg-stone-900 rounded-[28px] p-5 sm:p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleCloseBusSelector}
                className="px-4 py-2.5 bg-stone-100 hover:bg-[#B91C1C] text-stone-700 hover:text-white dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-[#B91C1C] rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
                title="Return to coach search catalog"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back to Coaches Catalog</span>
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-red-50 dark:bg-red-950/60 text-[#B91C1C] px-2.5 py-0.5 rounded-xl border border-red-200 dark:border-red-800">
                    {selectedBus.registrationNumber}
                  </span>
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    {selectedBus.operatorType}
                  </span>
                </div>
                <h1 className="text-2xl font-black text-[#1C1917] dark:text-white mt-1">
                  {selectedBus.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end md:self-center">
              <div className="px-4 py-2 bg-[#FBF9F7] dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs font-bold text-stone-700 dark:text-stone-300">
                <span>{selectedBus.origin}</span>
                <span className="mx-2 text-stone-400 font-mono">──▶</span>
                <span>{selectedBus.destination}</span>
              </div>

              <button
                type="button"
                onClick={handleCloseBusSelector}
                className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-500 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* DUAL-COCKPIT WIDESCREEN GRID: LEFT SPECS & FORM, RIGHT 37-BERTH SCHEMATIC */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COCKPIT: SPECS, AMENITIES, TIERS, SELECTIONS & CHECKOUT */}
            <div className="lg:col-span-7 space-y-6">
              {/* Bus Specs & Driver Info Bar */}
              <div className="bg-white dark:bg-stone-900 rounded-[28px] p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <h3 className="text-sm font-black uppercase tracking-wider text-stone-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B91C1C]" />
                    <span>Coach Specifications &amp; Crew</span>
                  </h3>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {selectedBus.totalSeats - bookedSeats.length} Berths Available
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-[#FBF9F7] dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Departure</span>
                    <span className="font-black text-stone-900 dark:text-white text-sm">{selectedBus.departureTime}</span>
                  </div>
                  <div className="p-3 bg-[#FBF9F7] dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Arrival</span>
                    <span className="font-black text-stone-900 dark:text-white text-sm">{selectedBus.arrivalTime}</span>
                  </div>
                  <div className="p-3 bg-[#FBF9F7] dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Captain</span>
                    <span className="font-black text-stone-900 dark:text-white truncate block">{selectedBus.driverName}</span>
                  </div>
                  <div className="p-3 bg-[#FBF9F7] dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-800">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Captain Mobile</span>
                    <span className="font-black text-stone-900 dark:text-white">{selectedBus.driverPhone}</span>
                  </div>
                </div>

                {/* Amenities Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-bold text-stone-600 dark:text-stone-300">
                  <span className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-blue-500" /> WiFi 6 (100 Mbps)
                  </span>
                  <span className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" /> USB-C 65W Sockets
                  </span>
                  <span className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Air-Suspension Chassis
                  </span>
                  <span className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-purple-500" /> Real-time GPS Telemetry
                  </span>
                </div>
              </div>

              {/* Cabin Pricing Tiers */}
              <div className="bg-white dark:bg-stone-900 rounded-[28px] p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Cabin Pricing Tiers (Dynamic Seat Pricing)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                      <span className="w-3 h-3 rounded-full bg-[#F97316]"></span>
                      <span>VIP Panorama (V1-V9)</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      140° Tilt Recliners • Front view
                    </p>
                    <p className="text-sm font-black text-[#B91C1C]">
                      ₹{selectedBus.basePrice + 250} <span className="text-[9px] font-normal text-amber-700">(+₹250 VIP)</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
                      <span className="w-3 h-3 rounded-full bg-[#06B6D4]"></span>
                      <span>Executive (S1-S20)</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Standard Comfort • Air-conditioned
                    </p>
                    <p className="text-sm font-black text-stone-900 dark:text-white">
                      ₹{selectedBus.basePrice} <span className="text-[9px] font-normal text-stone-400">(Base Fare)</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                      <span className="w-3 h-3 rounded-full bg-[#0284C7]"></span>
                      <span>Rear Saver (S21-S28)</span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Rear rows • Budget economy saver
                    </p>
                    <p className="text-sm font-black text-emerald-600">
                      ₹{Math.max(100, selectedBus.basePrice - 100)} <span className="text-[9px] font-normal text-emerald-700">(-₹100 Saver)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Instant Passenger Checkout Form */}
              <form onSubmit={handleConfirmBooking} className="bg-white dark:bg-stone-900 rounded-[28px] p-6 sm:p-7 border-2 border-[#B91C1C]/40 dark:border-stone-700 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                  <h3 className="text-base font-black text-[#1C1917] dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-[#B91C1C]" />
                    <span>Passenger Details &amp; Instant Seat Lock</span>
                  </h3>
                  <span className="text-xs font-bold text-stone-400">Step 2 of 2</span>
                </div>

                {bookingError && (
                  <div className="p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl text-xs font-bold text-red-600 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Selected Berths Chip Container & Fare Calculation */}
                <div className="p-4 bg-[#FBF9F7] dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-500">Chosen Berths on Chassis:</span>
                    <span className="text-xs font-black text-stone-900 dark:text-white">
                      {selectedSeatCodes.length > 0 ? `${selectedSeatCodes.length} berth(s) reserved` : 'None selected'}
                    </span>
                  </div>

                  {selectedSeatCodes.length === 0 ? (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Info className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>Click any available colored seat on the bus layout on the right to select it.</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {selectedSeatCodes.map((code) => {
                        const seatPricing = fleetService.getSeatPrice(selectedBus, code);
                        return (
                          <span
                            key={code}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white font-mono text-xs font-black shadow-xs"
                          >
                            <span>Seat {code}</span>
                            <span className="opacity-80 text-[10px]">₹{seatPricing.price}</span>
                            <button
                              type="button"
                              onClick={() => handleToggleSeat(code)}
                              className="hover:bg-emerald-600 rounded-full p-0.5 ml-0.5 cursor-pointer"
                              title="Deselect seat"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Total Fare Amount */}
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-500 block">Total Fare Payable:</span>
                      <span className="text-[10px] text-stone-400 font-semibold">Includes all terminal taxes &amp; passenger insurance</span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-black text-[#B91C1C]">₹{currentTotalFare}</span>
                    </div>
                  </div>
                </div>

                {/* Passenger Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#B91C1C]" />
                      <span>Passenger Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
                      placeholder="e.g. Jaspreet Kaur"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#B91C1C]" />
                      <span>Mobile Number (+91)</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
                      placeholder="+91 98765-43210"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[#B91C1C]" />
                    <span>Email Address (For Instant QR Pass)</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={passengerEmail}
                    onChange={(e) => setPassengerEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
                    placeholder="passenger@example.com"
                  />
                </div>

                {/* Payment Option Selector */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Select Payment Method:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    {[
                      { id: 'UPI', label: 'UPI / GPay / PhonePe' },
                      { id: 'CARD', label: 'Debit / Credit Card' },
                      { id: 'NETBANKING', label: 'Net Banking' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          paymentMethod === m.id
                            ? 'bg-[#B91C1C] text-white border-[#B91C1C] shadow-xs'
                            : 'bg-[#F3EFEA] dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-stone-400'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Big Action Submit Button */}
                <button
                  type="submit"
                  disabled={selectedSeatCodes.length === 0}
                  className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                    selectedSeatCodes.length > 0
                      ? 'bg-[#B91C1C] hover:bg-[#991B1B] text-white active:scale-[0.99]'
                      : 'bg-stone-300 dark:bg-stone-800 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>
                    {selectedSeatCodes.length > 0
                      ? `Pay ₹${currentTotalFare} & Lock ${selectedSeatCodes.length} Berth(s) Now →`
                      : 'Select Berth(s) on Chassis to Proceed'}
                  </span>
                </button>
              </form>
            </div>

            {/* RIGHT COCKPIT: DEDICATED 37-BERTH SCHEMATIC (STAYS IN VIEW WITHOUT SCROLL OVERLOAD) */}
            <div className="lg:col-span-5 sticky top-4 space-y-4">
              <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 border-2 border-stone-200 dark:border-stone-800 shadow-xl">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100 dark:border-stone-800">
                  <div>
                    <h3 className="text-sm font-black text-stone-900 dark:text-white uppercase tracking-wider">
                      Interactive 37-Berth Cabin
                    </h3>
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Click any seat to select or deselect
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#B91C1C] bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-xl">
                    {selectedBus.registrationNumber}
                  </span>
                </div>

                {/* 37-SEAT CHASSIS COMPONENT */}
                <div className="flex justify-center py-2">
                  <BusSeatChassis
                    bookedSeatCodes={bookedSeats}
                    selectedSeatCodes={selectedSeatCodes}
                    onToggleSeat={handleToggleSeat}
                    interactive={true}
                    passengerMap={passengerMap}
                    basePrice={selectedBus.basePrice}
                  />
                </div>

                {/* Color Legend directly under the chassis */}
                <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-bold text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#F97316]"></span>
                    <span>VIP Recliner (V1-V9)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#06B6D4]"></span>
                    <span>Executive (S1-S20)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#0284C7]"></span>
                    <span>Rear Saver (S21-S28)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-emerald-500 ring-2 ring-emerald-300"></span>
                    <span>Your Selection</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#B91C1C]"></span>
                    <span>Sold Out (Locked)</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-stone-400">
                    <User className="w-3 h-3" />
                    <span>Captain Cabin</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : currentTab === 'coaches' ? (
        /* ========================================================================= */
        /* CASE 2: REGULAR CATALOG & BIG SEARCH VIEW (WHEN NO BUS IS SELECTED)       */
        /* ========================================================================= */
        <div className="space-y-8 animate-fadeIn">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7E2DA] dark:border-stone-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B91C1C]/10 border border-[#B91C1C]/20 rounded-full text-[#B91C1C] text-[10px] font-black uppercase tracking-wider mb-2">
                <Ticket className="w-3.5 h-3.5" />
                <span>Punjab Transit Corridor • Live Seat Reservation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] dark:text-white tracking-tight">
                Browse &amp; Book Coaches
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                Select your origin, destination, and travel slot. Click any coach to inspect the 37-seat schematic and reserve your berth.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchParams({ tab: 'tickets' })}
                className="px-4 py-2.5 bg-white dark:bg-stone-900 hover:bg-[#F3EFEA] text-[#1C1917] dark:text-stone-200 border border-[#E7E2DA] dark:border-stone-800 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <QrCode className="w-4 h-4 text-[#B91C1C]" />
                <span>My Bookings ({allBookings.length})</span>
              </button>
            </div>
          </div>

          {/* Big Filter & Search Panel */}
          <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xl space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Origin Terminal */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B91C1C]" />
                  <span>Origin Terminal (From)</span>
                </label>
                <select
                  value={searchOrigin}
                  onChange={(e) => setSearchOrigin(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                >
                  <option value="ALL">All Departure Terminals</option>
                  {PUNJAB_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Terminal */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Destination Terminal (To)</span>
                </label>
                <select
                  value={searchDest}
                  onChange={(e) => setSearchDest(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                >
                  <option value="ALL">All Destination Terminals</option>
                  {PUNJAB_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Travel Date */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Travel Date</span>
                </label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                />
              </div>

              {/* Departure Time Slot */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  <span>Departure Time Slot</span>
                </label>
                <select
                  value={searchTimeSlot}
                  onChange={(e) => setSearchTimeSlot(e.target.value)}
                  className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C] cursor-pointer"
                >
                  <option value="ALL">All Timings (24 Hours)</option>
                  <option value="MORNING">Morning (05:00 AM - 12:00 PM)</option>
                  <option value="AFTERNOON">Afternoon (12:00 PM - 06:00 PM)</option>
                  <option value="NIGHT">Night Transit (06:00 PM - 12:00 AM)</option>
                </select>
              </div>
            </div>

            {/* Quick Filter Operator Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-stone-400 mr-1">Filter Operator:</span>
                {[
                  { id: 'ALL', label: 'All Services' },
                  { id: 'PUNBUS', label: 'Punjab Roadways (PUNBUS)' },
                  { id: 'PRTC', label: 'PRTC (PEPSU Roadways)' },
                  { id: 'StarLiner', label: 'StarLiner Executive' },
                ].map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setSearchOperator(op.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      searchOperator === op.id
                        ? 'bg-[#B91C1C] text-white shadow-xs'
                        : 'bg-[#F3EFEA] dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {op.label}
                  </button>
                ))}
              </div>

              <span className="text-xs font-bold text-stone-500">
                Showing <strong className="text-[#B91C1C]">{filteredBuses.length}</strong> available coaches for {searchDate}
              </span>
            </div>
          </div>

          {/* COACHES CATALOG WITH VIEW SWITCHER (BOXES vs TABLE) */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-black text-[#1C1917] dark:text-white flex items-center gap-2">
                <Bus className="w-5 h-5 text-[#B91C1C]" />
                <span>Available Scheduled Coaches</span>
              </h2>

              {/* Layout Switcher: Cards vs Table */}
              <div className="flex items-center gap-1 bg-[#F3EFEA] dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setCoachViewMode('grid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    coachViewMode === 'grid'
                      ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Boxes / Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCoachViewMode('table')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    coachViewMode === 'table'
                      ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
              </div>
            </div>

            {filteredBuses.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-[#E7E2DA] dark:border-stone-800 space-y-3">
                <Bus className="w-12 h-12 mx-auto text-stone-300" />
                <h3 className="text-base font-black text-stone-800 dark:text-white">
                  No coaches found matching selected filters
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try switching origin or destination to "All Departure Terminals" to see all active Punjab transit routes.
                </p>
                <button
                  onClick={() => {
                    setSearchOrigin('ALL');
                    setSearchDest('ALL');
                    setSearchTimeSlot('ALL');
                    setSearchOperator('ALL');
                  }}
                  className="px-4 py-2 bg-[#B91C1C] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : coachViewMode === 'table' ? (
              /* TABLE VIEW FOR COACHES */
              <div className="bg-white dark:bg-stone-900 rounded-[28px] p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-sm overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                      <th className="py-3 px-3">Coach Plate &amp; Name</th>
                      <th className="py-3 px-3">Corridor Route</th>
                      <th className="py-3 px-3">Departure / Arrival</th>
                      <th className="py-3 px-3">Available Leftover Seats</th>
                      <th className="py-3 px-3">Fare (₹)</th>
                      <th className="py-3 px-3">Crew / Captain</th>
                      <th className="py-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {filteredBuses.map((b) => {
                      const bBooked = fleetService.getBookedSeatsForBus(b.id);
                      const bAvail = Math.max(0, b.totalSeats - bBooked.length);

                      return (
                        <tr key={b.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                          <td className="py-3.5 px-3">
                            <span className="font-mono font-bold text-xs text-[#B91C1C] block">{b.registrationNumber}</span>
                            <span className="font-bold text-stone-900 dark:text-white block mt-0.5">{b.name}</span>
                            <span className="text-[10px] text-stone-400 block">{b.operatorType}</span>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-stone-800 dark:text-stone-200">
                            <span>{b.origin}</span>
                            <span className="text-stone-400 mx-1.5 font-mono">──▶</span>
                            <span>{b.destination}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-mono font-bold text-stone-800 dark:text-stone-200 block">{b.departureTime}</span>
                            <span className="text-[10px] text-stone-400">ETA {b.arrivalTime}</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={`inline-block font-black text-xs px-2.5 py-1 rounded-xl ${
                                bAvail === 0
                                  ? 'bg-red-50 text-red-600 border border-red-200'
                                  : bAvail < 10
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}
                            >
                              {bAvail === 0 ? 'Sold Out' : `${bAvail} / ${b.totalSeats} seats left`}
                            </span>
                            <span className="text-[10px] text-stone-400 block mt-0.5 font-mono">
                              ({bBooked.length} booked)
                            </span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-black text-stone-900 dark:text-white text-sm">₹{b.basePrice}</span>
                            <span className="text-[10px] text-stone-400 block">Base fare</span>
                          </td>
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-stone-800 dark:text-stone-200 block">{b.driverName}</span>
                            <span className="text-[10px] font-mono text-stone-400">{b.driverPhone}</span>
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleSelectBus(b)}
                              className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                            >
                              Select &amp; Book
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* CARD / BOXES VIEW FOR COACHES */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBuses.map((b) => {
                  const bBooked = fleetService.getBookedSeatsForBus(b.id);
                  const bAvail = Math.max(0, b.totalSeats - bBooked.length);
                  const vipPrice = b.basePrice + 250;
                  const rearPrice = Math.max(100, b.basePrice - 100);

                  return (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBus(b)}
                      className="p-6 rounded-[28px] border border-[#E7E2DA] dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-[#B91C1C] hover:shadow-xl transition-all duration-300 cursor-pointer space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-[#B91C1C] bg-red-50 dark:bg-red-950/60 px-2.5 py-1 rounded-xl border border-red-200 dark:border-red-800">
                          {b.registrationNumber}
                        </span>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            bAvail === 0
                              ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:border-red-800'
                              : bAvail < 10
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800'
                          }`}
                        >
                          {bAvail === 0
                            ? '🔴 Sold Out (0 Left)'
                            : `🟢 ${bAvail} Seats Left (${bBooked.length} booked)`}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          {b.operatorType}
                        </span>
                        <h3 className="text-lg font-black text-[#1C1917] dark:text-white mt-0.5 leading-snug group-hover:text-[#B91C1C] transition-colors">
                          {b.name}
                        </h3>
                        <p className="text-[11px] text-stone-500 font-mono mt-0.5">{b.busType}</p>
                      </div>

                      {/* Route Corridor */}
                      <div className="p-3.5 bg-[#FBF9F7] dark:bg-stone-800/60 rounded-2xl border border-stone-100 dark:border-stone-700/60 space-y-2 text-xs">
                        <div className="flex items-center justify-between font-bold text-[#1C1917] dark:text-white">
                          <span>{b.origin}</span>
                          <span className="text-stone-400 font-mono">──▶</span>
                          <span>{b.destination}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60 dark:border-stone-700">
                          <span>Departs: <strong className="text-stone-800 dark:text-white">{b.departureTime}</strong></span>
                          <span>Arrives: <strong className="text-stone-800 dark:text-white">{b.arrivalTime}</strong></span>
                        </div>
                      </div>

                      {/* Tiered Pricing Range */}
                      <div className="flex items-center justify-between text-[11px] bg-stone-50 dark:bg-stone-800/40 px-3 py-1.5 rounded-xl border border-stone-100 dark:border-stone-800">
                        <span className="text-stone-500">
                          Saver: <strong className="text-stone-700 dark:text-stone-300">₹{rearPrice}</strong>
                        </span>
                        <span className="text-stone-400">•</span>
                        <span className="text-stone-500">
                          Standard: <strong className="text-stone-700 dark:text-stone-300">₹{b.basePrice}</strong>
                        </span>
                        <span className="text-stone-400">•</span>
                        <span className="text-[#B91C1C] font-black">
                          VIP: ₹{vipPrice}
                        </span>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-stone-500 flex items-center gap-1 font-semibold">
                          <User className="w-3.5 h-3.5 text-stone-400" />
                          <span>Captain: <strong>{b.driverName}</strong></span>
                        </span>
                        <button
                          type="button"
                          className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-[#B91C1C] text-white shadow-xs group-hover:bg-[#991B1B]"
                        >
                          <span>View 37 Seats &amp; Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* ========================================================================= */}
      {/* CASE 3: MY DIGITAL TICKETS & QR PASSES TAB                                */}
      {/* ========================================================================= */}
      {currentTab === 'tickets' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header with Search and Layout Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E2DA] dark:border-stone-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-wider mb-2">
                <QrCode className="w-3.5 h-3.5" />
                <span>My Active Reservations</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white">
                My Digital Tickets &amp; QR Boarding Passes
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                First select your booked coach, then inspect individual seat allocations, QR passes, and cancellation refunds.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Layout Switcher: Cards vs Table */}
              <div className="flex items-center gap-1 bg-[#F3EFEA] dark:bg-stone-800 p-1 rounded-2xl border border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => setTicketViewMode('grid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    ticketViewMode === 'grid'
                      ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Boxes / Cards</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTicketViewMode('table')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    ticketViewMode === 'table'
                      ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Table View</span>
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by PNR, seat or name..."
                  value={ticketSearchQuery}
                  onChange={(e) => setTicketSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#B91C1C]"
                />
              </div>
            </div>
          </div>

          {(() => {
            // Group active bookings by Bus
            const busGroupMap: Record<
              string,
              { bus: BusData | undefined; tickets: BookedSeatRecord[]; totalFare: number; pnrList: string[] }
            > = {};

            allBookings.forEach((t) => {
              const q = ticketSearchQuery.toLowerCase();
              const match =
                !q ||
                t.pnr.toLowerCase().includes(q) ||
                t.passengerName.toLowerCase().includes(q) ||
                t.seatCode.toLowerCase().includes(q) ||
                (t.boardingPoint && t.boardingPoint.toLowerCase().includes(q)) ||
                (t.droppingPoint && t.droppingPoint.toLowerCase().includes(q));

              if (!match) return;

              if (!busGroupMap[t.busId]) {
                busGroupMap[t.busId] = {
                  bus: fleetService.getBusById(t.busId),
                  tickets: [],
                  totalFare: 0,
                  pnrList: [],
                };
              }
              busGroupMap[t.busId].tickets.push(t);
              busGroupMap[t.busId].totalFare += t.fare;
              if (!busGroupMap[t.busId].pnrList.includes(t.pnr)) {
                busGroupMap[t.busId].pnrList.push(t.pnr);
              }
            });

            const busGroups = Object.values(busGroupMap);

            if (busGroups.length === 0) {
              return (
                <div className="bg-white dark:bg-stone-900 rounded-3xl p-12 text-center border border-[#E7E2DA] dark:border-stone-800 space-y-4">
                  <Ticket className="w-12 h-12 mx-auto text-stone-300" />
                  <h3 className="text-base font-black text-stone-800 dark:text-white">
                    No active coach bookings found
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    You haven't booked any coach seats yet or no tickets match your search. Return to the coach catalog to reserve seats.
                  </p>
                  <button
                    onClick={() => setSearchParams({ tab: 'coaches' })}
                    className="px-5 py-2.5 bg-[#B91C1C] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Browse &amp; Book Coaches
                  </button>
                </div>
              );
            }

            // SUB-VIEW A: IF A BUS IS SELECTED, SHOW ITS INDIVIDUAL SEAT DETAILS & CANCEL/REFUND OPTIONS
            if (selectedTicketBusId) {
              const currentGroup = busGroups.find((g) => g.bus?.id === selectedTicketBusId || g.tickets[0]?.busId === selectedTicketBusId);

              if (!currentGroup) {
                return (
                  <div className="p-8 text-center space-y-3">
                    <p className="text-xs text-stone-500">Bus not found or bookings were cancelled.</p>
                    <button
                      type="button"
                      onClick={() => setSelectedTicketBusId(null)}
                      className="px-4 py-2 bg-[#B91C1C] text-white text-xs font-bold rounded-xl"
                    >
                      Return to My Buses
                    </button>
                  </div>
                );
              }

              const bus = currentGroup.bus;

              return (
                <div className="space-y-6 animate-slideInRight">
                  {/* Top Bar for Bus Details */}
                  <div className="bg-white dark:bg-stone-900 rounded-[28px] p-5 sm:p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedTicketBusId(null)}
                        className="px-4 py-2 bg-stone-100 hover:bg-[#B91C1C] hover:text-white dark:bg-stone-800 dark:hover:bg-[#B91C1C] text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back to My Booked Buses</span>
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs bg-red-50 dark:bg-red-950/60 text-[#B91C1C] px-2.5 py-0.5 rounded-lg border border-red-200 dark:border-red-800">
                            {bus?.registrationNumber || 'COACH'}
                          </span>
                          <span className="text-[11px] font-bold text-stone-400">
                            {bus?.operatorType}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-stone-900 dark:text-white mt-1">
                          {bus?.name}
                        </h3>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="px-3.5 py-1.5 bg-[#FBF9F7] dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 text-xs font-bold">
                        <span>{bus?.origin}</span>
                        <span className="mx-2 text-stone-400 font-mono">──▶</span>
                        <span>{bus?.destination}</span>
                      </div>
                      <div className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl border border-emerald-200 text-xs font-black">
                        {currentGroup.tickets.length} Berths Reserved • ₹{currentGroup.totalFare} Paid
                      </div>
                    </div>
                  </div>

                  {/* Individual Seat Cards for this Bus */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-black uppercase tracking-wider text-stone-500">
                      Reserved Berths on this Coach ({currentGroup.tickets.length})
                    </h4>

                    {ticketViewMode === 'table' ? (
                      /* Table View of Seats on this Bus */
                      <div className="bg-white dark:bg-stone-900 rounded-[28px] p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-sm overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                              <th className="py-3 px-3">Seat Berth</th>
                              <th className="py-3 px-3">PNR Code</th>
                              <th className="py-3 px-3">Passenger Details</th>
                              <th className="py-3 px-3">Fare (₹)</th>
                              <th className="py-3 px-3">Status</th>
                              <th className="py-3 px-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                            {currentGroup.tickets.map((ticket) => (
                              <tr key={ticket.seatCode} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                                <td className="py-3.5 px-3">
                                  <span className="font-mono font-black text-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 rounded-xl">
                                    Seat {ticket.seatCode}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 font-mono font-bold text-[#B91C1C]">
                                  {ticket.pnr}
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className="font-bold text-stone-900 dark:text-white block">{ticket.passengerName}</span>
                                  <span className="text-[10px] text-stone-400 font-mono">{ticket.passengerPhone}</span>
                                </td>
                                <td className="py-3.5 px-3 font-black text-stone-900 dark:text-white">
                                  ₹{ticket.fare}
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    {ticket.status}
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 text-right space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => setViewingTicket(ticket)}
                                    className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#B91C1C] hover:text-white text-stone-700 font-bold text-xs transition cursor-pointer"
                                  >
                                    View QR
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenCancelModal(ticket)}
                                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-bold text-xs transition cursor-pointer"
                                  >
                                    Cancel &amp; Refund
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* Card View of Seats on this Bus */
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {currentGroup.tickets.map((ticket) => (
                          <div
                            key={ticket.seatCode}
                            className="p-5 rounded-2xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 space-y-3 shadow-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-black text-sm bg-emerald-500 text-white px-3 py-1 rounded-xl shadow-xs">
                                Seat {ticket.seatCode}
                              </span>
                              <span className="font-mono font-bold text-xs text-[#B91C1C] bg-red-50 dark:bg-red-950/60 px-2.5 py-0.5 rounded-lg border border-red-200 dark:border-red-800">
                                PNR: {ticket.pnr}
                              </span>
                            </div>

                            <div className="p-3 bg-[#FBF9F7] dark:bg-stone-800 rounded-xl border border-stone-100 dark:border-stone-700 text-xs space-y-1">
                              <div>Passenger: <strong>{ticket.passengerName}</strong></div>
                              <div>Mobile: <span className="font-mono">{ticket.passengerPhone}</span></div>
                              <div>Fare Paid: <strong className="text-emerald-600 font-mono">₹{ticket.fare}</strong></div>
                              <div>Status: <span className="text-emerald-700 font-bold uppercase">{ticket.status}</span></div>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                              <button
                                type="button"
                                onClick={() => setViewingTicket(ticket)}
                                className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#B91C1C] hover:text-white text-stone-700 dark:text-stone-200 font-bold flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <QrCode className="w-3.5 h-3.5" />
                                <span>Boarding QR</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenCancelModal(ticket)}
                                className="text-red-500 hover:text-red-700 font-bold text-xs transition cursor-pointer px-2 py-1"
                              >
                                Cancel &amp; Refund
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            // SUB-VIEW B: SHOW THE DIFFERENT BUSES FIRST
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#1C1917] dark:text-white">
                    Coaches with Confirmed Bookings ({busGroups.length} Buses)
                  </h3>
                  <span className="text-xs text-stone-500">
                    Click any coach to inspect individual seats or process refunds
                  </span>
                </div>

                {ticketViewMode === 'table' ? (
                  /* TABLE VIEW OF BUSES */
                  <div className="bg-white dark:bg-stone-900 rounded-[28px] p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-sm overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                          <th className="py-3 px-3">Coach Plate &amp; Name</th>
                          <th className="py-3 px-3">Corridor Route</th>
                          <th className="py-3 px-3">Departure</th>
                          <th className="py-3 px-3">Reserved Berths</th>
                          <th className="py-3 px-3">Total Paid</th>
                          <th className="py-3 px-3">Status</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                        {busGroups.map((group) => {
                          const bus = group.bus;
                          const seatSummary = group.tickets.map((t) => t.seatCode).join(', ');

                          return (
                            <tr key={group.bus?.id || group.tickets[0].busId} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                              <td className="py-3.5 px-3">
                                <span className="font-mono font-bold text-xs text-[#B91C1C] block">
                                  {bus?.registrationNumber || 'COACH'}
                                </span>
                                <span className="font-bold text-stone-900 dark:text-white block mt-0.5">
                                  {bus?.name}
                                </span>
                                <span className="text-[10px] text-stone-400 block">{bus?.operatorType}</span>
                              </td>
                              <td className="py-3.5 px-3 font-semibold text-stone-800 dark:text-stone-200">
                                <span>{bus?.origin}</span>
                                <span className="text-stone-400 mx-1.5 font-mono">──▶</span>
                                <span>{bus?.destination}</span>
                              </td>
                              <td className="py-3.5 px-3">
                                <span className="font-mono font-bold text-stone-800 dark:text-stone-200 block">
                                  {bus?.departureTime}
                                </span>
                                <span className="text-[10px] text-stone-400">ETA {bus?.arrivalTime}</span>
                              </td>
                              <td className="py-3.5 px-3">
                                <span className="font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl text-xs inline-block">
                                  {group.tickets.length} Berths ({seatSummary})
                                </span>
                              </td>
                              <td className="py-3.5 px-3 font-black text-stone-900 dark:text-white text-sm">
                                ₹{group.totalFare}
                              </td>
                              <td className="py-3.5 px-3">
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  CONFIRMED
                                </span>
                              </td>
                              <td className="py-3.5 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => setSelectedTicketBusId(bus?.id || group.tickets[0].busId)}
                                  className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
                                >
                                  View Seats &amp; Manage →
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* CARD / BOXES VIEW OF BUSES */
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {busGroups.map((group) => {
                      const bus = group.bus;
                      const seatSummary = group.tickets.map((t) => t.seatCode).join(', ');

                      return (
                        <div
                          key={group.bus?.id || group.tickets[0].busId}
                          onClick={() => setSelectedTicketBusId(bus?.id || group.tickets[0].busId)}
                          className="p-6 rounded-[28px] border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 hover:border-[#B91C1C] hover:shadow-xl transition-all duration-300 cursor-pointer space-y-4 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-xs bg-[#B91C1C] text-white px-3 py-1 rounded-xl">
                              {bus?.registrationNumber || 'COACH'}
                            </span>
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                              CONFIRMED
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                              {bus?.operatorType}
                            </span>
                            <h4 className="font-black text-lg text-stone-900 dark:text-white mt-0.5 group-hover:text-[#B91C1C] transition-colors">
                              {bus?.name}
                            </h4>
                          </div>

                          <div className="p-3.5 bg-[#FBF9F7] dark:bg-stone-800/70 rounded-2xl border border-stone-100 dark:border-stone-700 text-xs space-y-2">
                            <div className="flex items-center justify-between font-bold text-stone-800 dark:text-stone-200">
                              <span>{bus?.origin}</span>
                              <span className="text-stone-400 font-mono">──▶</span>
                              <span>{bus?.destination}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60 dark:border-stone-700">
                              <span>Departs: <strong className="text-stone-800 dark:text-white">{bus?.departureTime}</strong></span>
                              <span>Captain: <strong>{bus?.driverName}</strong></span>
                            </div>
                          </div>

                          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/50 flex items-center justify-between text-xs">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">
                              {group.tickets.length} Berth(s): <strong className="font-mono">{seatSummary}</strong>
                            </span>
                            <span className="font-black text-emerald-700 dark:text-emerald-200 text-sm">
                              ₹{group.totalFare}
                            </span>
                          </div>

                          <button
                            type="button"
                            className="w-full py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-[#B91C1C] text-white shadow-xs group-hover:bg-[#991B1B]"
                          >
                            <span>Inspect {group.tickets.length} Booked Seat(s) &amp; QR →</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 4: LIVE HIGHWAY TELEMETRY & OSRM TRACKER TAB                          */}
      {/* ========================================================================= */}
      {currentTab === 'tracking' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-4 border-b border-[#E7E2DA] dark:border-stone-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-600 text-[10px] font-black uppercase tracking-wider mb-2">
              <Radio className="w-3.5 h-3.5" />
              <span>Live Highway Telemetry &amp; OSRM Route Navigation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white">
              Grand Trunk Corridor Live Tracker (NH 44 / NH 3)
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Live distance calculations, vehicle telemetry, and waypoint progress for coaches active in Punjab.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Interactive Route Map Progress */}
            <div className="lg:col-span-8 bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white">
                    Golden Temple Superfast • PB-02-AK-9921
                  </h3>
                  <span className="text-xs text-stone-400">Grand Trunk Express Corridor • Amritsar to Chandigarh</span>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-black rounded-full border border-emerald-200">
                  ● LIVE EN-ROUTE
                </span>
              </div>

              {/* Highway Route Visual Progress */}
              <div className="p-6 bg-[#FBF9F7] dark:bg-stone-800/60 rounded-3xl border border-stone-200 dark:border-stone-700 space-y-6">
                <div className="relative">
                  <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full"></div>
                  <div className="h-2 bg-gradient-to-r from-emerald-500 via-[#B91C1C] to-amber-500 rounded-full -mt-2" style={{ width: '42%' }}></div>

                  {/* Stops */}
                  <div className="flex justify-between pt-4 text-xs font-bold">
                    <div className="text-left">
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block mb-1"></span>
                      <p className="text-stone-900 dark:text-white">Amritsar ISBT</p>
                      <span className="text-[10px] text-stone-400 font-mono">Km 0 • 06:30 AM (Dep)</span>
                    </div>

                    <div className="text-center">
                      <span className="w-4 h-4 rounded-full bg-[#B91C1C] ring-4 ring-red-200 inline-block mb-1 animate-pulse"></span>
                      <p className="text-[#B91C1C] font-black">Jalandhar Rama Mandi</p>
                      <span className="text-[10px] text-[#B91C1C] font-mono">Km 82 • ETA 07:55 AM (14m)</span>
                    </div>

                    <div className="text-center">
                      <span className="w-3.5 h-3.5 rounded-full bg-stone-300 inline-block mb-1"></span>
                      <p className="text-stone-500">Ludhiana Sherpur</p>
                      <span className="text-[10px] text-stone-400 font-mono">Km 142 • 09:10 AM</span>
                    </div>

                    <div className="text-right">
                      <span className="w-3.5 h-3.5 rounded-full bg-stone-300 inline-block mb-1"></span>
                      <p className="text-stone-500">Chandigarh ISBT-17</p>
                      <span className="text-[10px] text-stone-400 font-mono">Km 228 • 10:45 AM</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* OSRM Highway Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Distance to Jalandhar</span>
                  <span className="text-xl font-black text-stone-900 dark:text-white">12.4 km</span>
                  <span className="text-[10px] text-emerald-600 block mt-0.5">OSRM Route Verified</span>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Cruising Speed</span>
                  <span className="text-xl font-black text-stone-900 dark:text-white">72 km/h</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">Speed Limiter Active</span>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Highway Conditions</span>
                  <span className="text-base font-black text-emerald-600">Dry &amp; Clear</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">GT Road NH 44</span>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Bay Clearance</span>
                  <span className="text-base font-black text-stone-900 dark:text-white">Bay 04 Green</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">ISBT Dispatch Confirmed</span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Vehicle Telemetry Gauges */}
            <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-[32px] p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xl space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-400 pb-2 border-b border-stone-100 dark:border-stone-800 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#B91C1C]" />
                <span>Coach Telemetry Health</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Diesel Fuel Level</span>
                    <span className="font-black text-stone-900 dark:text-white text-base">82% (410 Liters)</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Nominal</span>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Engine Coolant Temp</span>
                    <span className="font-black text-stone-900 dark:text-white text-base">88°C</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Normal Range</span>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Tire Pressure</span>
                    <span className="font-black text-stone-900 dark:text-white text-base">110 PSI</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">All 6 Wheels OK</span>
                </div>

                <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">Assigned Captain</span>
                    <span className="font-black text-stone-900 dark:text-white">Gurpreet Singh</span>
                  </div>
                  <a href="tel:+919814054321" className="text-xs font-bold text-[#B91C1C] hover:underline">
                    Call Driver
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 5: PUNJAB TRANSIT TIMETABLE & HALTS TAB                              */}
      {/* ========================================================================= */}
      {currentTab === 'timetable' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-4 border-b border-[#E7E2DA] dark:border-stone-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-wider mb-2">
              <Clock className="w-3.5 h-3.5" />
              <span>Full Schedule &amp; Timetable Directory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white">
              Punjab Highway Transit Timetable
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Official departure frequencies, intermediate halts, and ISBT bay allocations across Punjab corridors.
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xl overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3.5 px-3">Coach Name</th>
                  <th className="py-3.5 px-3">Origin</th>
                  <th className="py-3.5 px-3">Destination</th>
                  <th className="py-3.5 px-3">Departure</th>
                  <th className="py-3.5 px-3">Arrival</th>
                  <th className="py-3.5 px-3">Intermediate Halts</th>
                  <th className="py-3.5 px-3">ISBT Bay</th>
                  <th className="py-3.5 px-3">Fare</th>
                  <th className="py-3.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                {buses.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/80 dark:hover:bg-stone-800/40 transition">
                    <td className="py-4 px-3">
                      <span className="font-black text-stone-900 dark:text-white block">{b.name}</span>
                      <span className="text-[10px] font-mono text-stone-400">{b.registrationNumber} • {b.operatorType}</span>
                    </td>
                    <td className="py-4 px-3 font-bold text-stone-800 dark:text-white">{b.origin}</td>
                    <td className="py-4 px-3 font-bold text-stone-800 dark:text-white">{b.destination}</td>
                    <td className="py-4 px-3 font-mono font-bold text-[#B91C1C]">{b.departureTime}</td>
                    <td className="py-4 px-3 font-mono font-bold text-stone-700 dark:text-stone-300">{b.arrivalTime}</td>
                    <td className="py-4 px-3 text-stone-500 text-[11px]">Jalandhar, Ludhiana</td>
                    <td className="py-4 px-3 font-bold text-emerald-600">Bay 04</td>
                    <td className="py-4 px-3 font-black text-stone-900 dark:text-white">From ₹{Math.max(100, b.basePrice - 100)}</td>
                    <td className="py-4 px-3 text-right">
                      <button
                        onClick={() => {
                          setSearchParams({ tab: 'coaches' });
                          handleSelectBus(b);
                        }}
                        className="px-3.5 py-1.5 bg-[#B91C1C] text-white rounded-xl text-xs font-bold hover:bg-[#991B1B] cursor-pointer"
                      >
                        Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 6: FARE & SEAT TIER CALCULATOR TAB                                   */}
      {/* ========================================================================= */}
      {currentTab === 'calculator' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-4 border-b border-[#E7E2DA] dark:border-stone-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-600 text-[10px] font-black uppercase tracking-wider mb-2">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Transparent Fare &amp; Concession Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white">
              Fare &amp; Seat Tier Calculator
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Estimate your ticket price across VIP Panorama recliners, Executive standard, and Rear budget seats with government concessions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xl space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Departure Terminal
                  </label>
                  <select
                    value={calcOrigin}
                    onChange={(e) => setCalcOrigin(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl font-bold cursor-pointer"
                  >
                    {PUNJAB_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Arrival Terminal
                  </label>
                  <select
                    value={calcDest}
                    onChange={(e) => setCalcDest(e.target.value)}
                    className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl font-bold cursor-pointer"
                  >
                    {PUNJAB_CITIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Seat Tier Selection */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Select Cabin Seat Tier
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setCalcTier('VIP')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      calcTier === 'VIP'
                        ? 'border-[#F97316] bg-amber-50/60 dark:bg-amber-950/20 ring-2 ring-[#F97316]'
                        : 'border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <span className="font-black text-[#F97316] block">VIP Panorama</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Rows V1-V9 (+₹250)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcTier('STANDARD')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      calcTier === 'STANDARD'
                        ? 'border-[#06B6D4] bg-cyan-50/60 dark:bg-cyan-950/20 ring-2 ring-[#06B6D4]'
                        : 'border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <span className="font-black text-[#06B6D4] block">Executive</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Rows S1-S20 (Base)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalcTier('SAVER')}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      calcTier === 'SAVER'
                        ? 'border-[#0284C7] bg-blue-50/60 dark:bg-blue-950/20 ring-2 ring-[#0284C7]'
                        : 'border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <span className="font-black text-[#0284C7] block">Rear Saver</span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Rows S21-S28 (-₹100)</span>
                  </button>
                </div>
              </div>

              {/* Concession Selection */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Passenger Concession
                </label>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => setCalcConcession('NONE')}
                    className={`p-3 rounded-xl border font-bold cursor-pointer ${
                      calcConcession === 'NONE' ? 'bg-[#1C1917] text-white' : 'bg-[#F3EFEA] dark:bg-stone-800'
                    }`}
                  >
                    Standard Fare (0%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcConcession('SENIOR')}
                    className={`p-3 rounded-xl border font-bold cursor-pointer ${
                      calcConcession === 'SENIOR' ? 'bg-[#1C1917] text-white' : 'bg-[#F3EFEA] dark:bg-stone-800'
                    }`}
                  >
                    Senior Citizen (20% off)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcConcession('STUDENT')}
                    className={`p-3 rounded-xl border font-bold cursor-pointer ${
                      calcConcession === 'STUDENT' ? 'bg-[#1C1917] text-white' : 'bg-[#F3EFEA] dark:bg-stone-800'
                    }`}
                  >
                    Student Pass (15% off)
                  </button>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Calculation Receipt */}
            <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-7 border border-[#E7E2DA] dark:border-stone-800 shadow-xl space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-400 pb-2 border-b border-stone-100 dark:border-stone-800">
                Fare Breakdown Receipt
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Base Route Fare:</span>
                  <span className="font-bold text-stone-900 dark:text-white">₹{calcBase}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tier Surcharge:</span>
                  <span className={`font-bold ${calcTierAmount >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {calcTierAmount >= 0 ? `+₹${calcTierAmount}` : `-₹${Math.abs(calcTierAmount)}`}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Concession Discount:</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">GST (5%):</span>
                  <span className="font-bold text-stone-900 dark:text-white">₹{gstAmount}</span>
                </div>

                <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-stone-900 dark:text-white">Total Estimated Fare:</span>
                  <span className="text-3xl font-black text-[#B91C1C]">₹{finalCalcPrice}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSearchParams({ tab: 'coaches' })}
                className="w-full py-3.5 bg-[#B91C1C] text-white rounded-2xl font-black text-xs hover:bg-[#991B1B] transition cursor-pointer shadow-md mt-4"
              >
                Proceed to Book Coaches →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 7: BAGGAGE & TRAVEL GUIDELINES TAB                                   */}
      {/* ========================================================================= */}
      {currentTab === 'guidelines' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-4 border-b border-[#E7E2DA] dark:border-stone-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-600 text-[10px] font-black uppercase tracking-wider mb-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Official Travel &amp; Baggage Guidelines</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white">
              Baggage Allowance &amp; Passenger Guidelines
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Read transparent baggage policies, onboard amenity guides, and refund timelines for Punjab express routes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-stone-900 rounded-[28px] border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                🧳
              </div>
              <h3 className="text-base font-black text-stone-900 dark:text-white">Baggage Allowance</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Each ticket includes <strong>2 free check-in bags</strong> (up to 20kg each) placed in the lower coach hold + 1 cabin laptop handbag inside the overhead bin. Excess luggage is charged at ₹25/kg.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-stone-900 rounded-[28px] border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black">
                📶
              </div>
              <h3 className="text-base font-black text-stone-900 dark:text-white">WiFi &amp; Charging</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Connect to <strong>"ROVA-EXPRESS-WIFI"</strong> once onboard. Every seat is equipped with a 65W USB-C and standard AC socket for laptops and mobile phones.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-stone-900 rounded-[28px] border border-stone-200 dark:border-stone-800 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-[#B91C1C] flex items-center justify-center font-black">
                ⏱️
              </div>
              <h3 className="text-base font-black text-stone-900 dark:text-white">Refund Slabs</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Cancel &gt;24 hrs prior for a <strong>90% refund</strong>. Between 12-24 hrs: <strong>75% refund</strong>. Less than 12 hrs: 50% refund. Direct bank / UPI refund within 2 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CASE 8: 24/7 TRANSIT HELPDESK & STATION SUPPORT TAB                       */}
      {/* ========================================================================= */}
      {currentTab === 'support' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="pb-4 border-b border-[#E7E2DA] dark:border-stone-800">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[#B91C1C] text-[10px] font-black uppercase tracking-wider mb-2">
              <Headphones className="w-3.5 h-3.5" />
              <span>24x7 Customer Support &amp; Emergency Dispatch</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white">
              Passenger Transit Helpdesk
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Contact our 24x7 Punjab ISBT terminal station offices, emergency hotline, or submit an assistance request.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Terminal Emergency Phone Numbers */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-7 border border-[#E7E2DA] dark:border-stone-800 shadow-xl space-y-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-400 pb-2 border-b border-stone-100 dark:border-stone-800">
                  ISBT Terminal Enquiry Direct Helplines
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">Amritsar ISBT Central Desk</span>
                      <span className="text-[10px] text-stone-400">Bay 01-08 Control Room</span>
                    </div>
                    <a href="tel:+911832551734" className="font-mono font-bold text-[#B91C1C] bg-red-50 px-3 py-1.5 rounded-xl">
                      +91 183-2551734
                    </a>
                  </div>

                  <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">Jalandhar Rama Mandi Hub</span>
                      <span className="text-[10px] text-stone-400">GT Road Transit Office</span>
                    </div>
                    <a href="tel:+911812223755" className="font-mono font-bold text-[#B91C1C] bg-red-50 px-3 py-1.5 rounded-xl">
                      +91 181-2223755
                    </a>
                  </div>

                  <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">Ludhiana Sherpur Terminal</span>
                      <span className="text-[10px] text-stone-400">ISBT Express Wing</span>
                    </div>
                    <a href="tel:+911612447035" className="font-mono font-bold text-[#B91C1C] bg-red-50 px-3 py-1.5 rounded-xl">
                      +91 161-2447035
                    </a>
                  </div>

                  <div className="p-3.5 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 dark:text-white block">Chandigarh Sector 17 / 43</span>
                      <span className="text-[10px] text-stone-400">Capital Transit Enquiry</span>
                    </div>
                    <a href="tel:+911722704014" className="font-mono font-bold text-[#B91C1C] bg-red-50 px-3 py-1.5 rounded-xl">
                      +91 172-2704014
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-[#B91C1C] text-white rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider opacity-80 block">24x7 Toll-Free Passenger Care</span>
                    <span className="font-black text-lg">1800-ROVA-BUS</span>
                  </div>
                  <a
                    href="tel:18007682287"
                    className="px-4 py-2 bg-white text-[#B91C1C] font-black rounded-xl text-xs hover:bg-stone-100"
                  >
                    Call Toll-Free
                  </a>
                </div>
              </div>
            </div>

            {/* Submit Inquiry Form */}
            <div className="lg:col-span-6 bg-white dark:bg-stone-900 rounded-[32px] p-6 sm:p-7 border border-[#E7E2DA] dark:border-stone-800 shadow-xl space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-stone-400 pb-2 border-b border-stone-100 dark:border-stone-800">
                Submit Passenger Assistance Ticket
              </h3>

              <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      value={supportName}
                      onChange={(e) => setSupportName(e.target.value)}
                      placeholder="e.g. Jasleen Kaur"
                      className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      value={supportPhone}
                      onChange={(e) => setSupportPhone(e.target.value)}
                      placeholder="+91 98765-43210"
                      className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">PNR Code (Optional)</label>
                    <input
                      type="text"
                      value={supportPnr}
                      onChange={(e) => setSupportPnr(e.target.value)}
                      placeholder="e.g. ROV-7849X"
                      className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-stone-400 uppercase">Inquiry Category</label>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 font-bold cursor-pointer"
                    >
                      <option value="Booking Assistance">Booking Assistance</option>
                      <option value="Luggage & Lost Property">Luggage &amp; Lost Property</option>
                      <option value="Refund & Cancellation">Refund &amp; Cancellation</option>
                      <option value="Captain Feedback">Captain / Bus Feedback</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-stone-400 uppercase">Your Message / Question</label>
                  <textarea
                    rows={3}
                    required
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    placeholder="Describe how our transit station desk can assist you..."
                    className="w-full px-4 py-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 font-bold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B91C1C] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#991B1B] transition cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Support Request</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIGITAL BOARDING PASS MODAL                                               */}
      {/* ========================================================================= */}
      {viewingTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 rounded-[32px] max-w-lg w-full p-6 sm:p-8 border border-stone-200 dark:border-stone-700 shadow-2xl space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#B91C1C] flex items-center justify-center text-white">
                  <Bus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 dark:text-white">Rova Digital Boarding Pass</h3>
                  <span className="text-[10px] text-[#B91C1C] font-mono font-bold">PNR: {viewingTicket.pnr}</span>
                </div>
              </div>
              <button
                onClick={() => setViewingTicket(null)}
                className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Boarding Card */}
            <div className="bg-[#FBF9F7] dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Passenger</span>
                  <p className="text-sm font-black text-stone-900 dark:text-white">{viewingTicket.passengerName}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Assigned Berth</span>
                  <p className="text-lg font-black text-[#B91C1C] font-mono">{viewingTicket.seatCode}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 space-y-1 text-xs">
                <div>Route: <strong>{viewingTicket.boardingPoint} ──▶ {viewingTicket.droppingPoint}</strong></div>
                <div>Contact: <strong>{viewingTicket.passengerPhone}</strong></div>
                <div>Fare: <strong>₹{viewingTicket.fare} (Confirmed)</strong></div>
              </div>

              {/* Simulated QR Code */}
              <div className="pt-3 border-t border-dashed border-stone-300 dark:border-stone-600 flex flex-col items-center gap-2">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-stone-200">
                  <QrCode className="w-24 h-24 text-stone-900" />
                </div>
                <span className="text-[10px] font-mono text-stone-400">
                  Present this QR to coach captain at ISBT boarding gate
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>
              <button
                onClick={() => setViewingTicket(null)}
                className="px-5 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANCELLATION & SIMULATED REFUND HANDLING MODAL                            */}
      {/* ========================================================================= */}
      {(cancelTargetTicket || cancelTargetPnr) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-stone-900 rounded-[32px] max-w-lg w-full p-6 sm:p-7 border border-stone-200 dark:border-stone-700 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5 text-[#B91C1C]">
                <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/60 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#B91C1C]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 dark:text-white leading-tight">
                    Confirm Seat Cancellation &amp; Refund
                  </h3>
                  <span className="text-[11px] text-stone-400 font-bold">
                    PNR: {cancelTargetTicket?.pnr || cancelTargetPnr} • Seat {cancelTargetTicket?.seatCode || 'All'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCancelTargetTicket(null);
                  setCancelRefundDetails(null);
                  setCancelTargetPnr(null);
                }}
                className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-white rounded-full cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Passenger & Berth Info */}
            {cancelTargetTicket && (
              <div className="p-3.5 bg-[#FBF9F7] dark:bg-stone-800/80 rounded-2xl border border-stone-200 dark:border-stone-700 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Passenger:</span>
                  <span className="font-bold text-stone-900 dark:text-white">{cancelTargetTicket.passengerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Route:</span>
                  <span className="font-semibold">{cancelTargetTicket.boardingPoint} ──▶ {cancelTargetTicket.droppingPoint}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-500">Original Seat Fare:</span>
                  <span className="font-black text-stone-900 dark:text-white">₹{cancelTargetTicket.fare}</span>
                </div>
              </div>
            )}

            {/* Refund Financial Breakdown */}
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-2.5 text-xs">
              <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300 block">
                Simulated Refund Calculation &amp; Policy:
              </span>

              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span>Original Fare Paid:</span>
                <span className="font-bold font-mono">₹{cancelRefundDetails?.originalFare || cancelTargetTicket?.fare || 650}</span>
              </div>

              <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                <span>Cancellation Policy:</span>
                <span className="font-semibold text-[11px] text-amber-700 dark:text-amber-300">
                  {cancelRefundDetails?.ruleName || '> 24 hrs prior (10% fee)'}
                </span>
              </div>

              <div className="flex items-center justify-between text-red-600">
                <span>Processing Fee Deduction:</span>
                <span className="font-bold font-mono">-₹{cancelRefundDetails?.cancellationCharge || 65}</span>
              </div>

              <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-emerald-800 dark:text-emerald-200">
                <span className="font-black text-sm">Net Refund Payable:</span>
                <span className="text-xl font-black font-mono">₹{cancelRefundDetails?.refundAmount || 585}</span>
              </div>

              <div className="pt-1 text-[10px] text-stone-500 space-y-0.5">
                <div>Credited to: <strong>{cancelRefundDetails?.refundMethod || 'Original Payment Source (UPI/Card)'}</strong></div>
                <div>Refund Reference: <strong className="font-mono text-emerald-700">{cancelRefundDetails?.refundRef || 'RFND-984210-UPI'}</strong></div>
                <div>Timeline: <strong>{cancelRefundDetails?.estimatedTime || 'Within 5-15 minutes'}</strong></div>
              </div>
            </div>

            <p className="text-[11px] text-stone-500">
              Upon confirmation, this seat will be immediately released back into the live available inventory for other passengers.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setCancelTargetTicket(null);
                  setCancelRefundDetails(null);
                  setCancelTargetPnr(null);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                No, Keep Seat
              </button>
              <button
                type="button"
                onClick={() => {
                  if (cancelTargetTicket) {
                    handleConfirmCancelTicket();
                  } else if (cancelTargetPnr) {
                    handleCancelBooking(cancelTargetPnr);
                  }
                }}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-md cursor-pointer transition"
              >
                Confirm Cancellation &amp; Refund ₹{cancelRefundDetails?.refundAmount || 585}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PassengerDashboard;
