import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Trip, Seat, PassengerInput, Booking } from '../types';
import HeroSection from '../components/HeroSection';
import SeatMap from '../components/SeatMap';
import TicketCard from '../components/TicketCard';
import RecoveryBanner from '../components/RecoveryBanner';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';
import {
  Bus,
  Clock,
  MapPin,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  User,
  Phone,
  Mail,
  X,
  ChevronDown,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<{
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  }>({
    origin: 'Toshkent',
    destination: 'Buxoro',
    date: '',
    passengers: 1,
  });

  // Filters
  const [selectedBusType, setSelectedBusType] = useState<string>('ALL');
  const [maxPriceFilter, setMaxPriceFilter] = useState<number>(500000);

  // Seat Selection State
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [tripDetailLoading, setTripDetailLoading] = useState(false);
  const [tripDetailData, setTripDetailData] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [passengersData, setPassengersData] = useState<PassengerInput[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Fetch popular locations for search suggestions
  const { data: locationsData } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await api.get('/trips/locations');
      return res.data.data;
    },
  });

  // Fetch Trips based on search
  const { data: tripsData, isLoading: tripsLoading, refetch: refetchTrips } = useQuery({
    queryKey: ['trips', searchParams, selectedBusType, maxPriceFilter],
    queryFn: async () => {
      const params: any = {};
      if (searchParams.origin) params.origin = searchParams.origin;
      if (searchParams.destination) params.destination = searchParams.destination;
      if (searchParams.date) params.date = searchParams.date;
      if (selectedBusType !== 'ALL') params.busType = selectedBusType;
      if (maxPriceFilter) params.maxPrice = maxPriceFilter;

      const res = await api.get('/trips', { params });
      return res.data.data as Trip[];
    },
  });

  const handleSearch = (newParams: {
    origin: string;
    destination: string;
    date: string;
    passengers: number;
  }) => {
    setSearchParams(newParams);
    setActiveTrip(null);
    setSelectedSeats([]);
  };

  // Open Seat Map drawer
  const handleOpenSeatMap = async (trip: Trip) => {
    setActiveTrip(trip);
    setSelectedSeats([]);
    setTripDetailLoading(true);
    try {
      const res = await api.get(`/trips/${trip.id}`);
      setTripDetailData(res.data.data);
    } catch (err) {
      console.error('Failed to load trip details', err);
    } finally {
      setTripDetailLoading(false);
    }
  };

  // Toggle seat in seat map
  const handleToggleSeat = (seat: Seat) => {
    if (selectedSeats.some((s) => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        alert('You can select a maximum of 6 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Proceed to Checkout
  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) return;

    // Initialize passenger data inputs
    const initialPassengers: PassengerInput[] = selectedSeats.map((seat) => ({
      seatId: seat.id,
      seatNumber: seat.seatNumber,
      passengerName: '',
      passengerAge: 25,
      passengerGender: seat.isWomenOnly ? 'FEMALE' : 'MALE',
    }));

    setPassengersData(initialPassengers);
    setIsCheckoutOpen(true);
  };

  // Submit Final Booking
  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTrip) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const payload = {
        tripId: activeTrip.id,
        passengers: passengersData,
        contactEmail,
        contactPhone,
        paymentMethod,
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        // Trigger celebratory confetti!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Fetch full ticket details for display
        const ticketRes = await api.get(`/bookings/${res.data.data.pnr}`);
        setConfirmedBooking(ticketRes.data.data);
        setIsCheckoutOpen(false);
        setActiveTrip(null);
        setSelectedSeats([]);
        refetchTrips();
      }
    } catch (err: any) {
      // Handles 409 Conflict gracefully
      if (err.response?.status === 409) {
        setBookingError(err.response.data.message || 'Seat conflict: Selected seat was booked by another user.');
        // Refresh seats
        if (activeTrip) handleOpenSeatMap(activeTrip);
      } else {
        setBookingError(err.response?.data?.message || 'Booking failed. Please try again.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Reference Hero & Search Widget */}
      <HeroSection
        onSearch={handleSearch}
        availableCities={locationsData?.allCities || ['Toshkent', 'Buxoro', 'Samarkand', 'Jizzax']}
      />

      {/* Main Results Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Active Disruption Announcement if demo disrupted trip exists */}
        {tripsData && tripsData.some((t) => t.status === 'DELAYED' || t.status === 'CANCELLED') && (
          <RecoveryBanner
            disruption={{
              id: 'DISR-DEMO',
              disruptionType: 'SCHEDULE DELAY',
              reason: 'Tashkent highway transit delay due to scheduled roadwork maintenance.',
              recoveryOptions: [
                {
                  id: 'REC-1',
                  alternativeTripId: tripsData.find((t) => t.status === 'SCHEDULED')?.id || '',
                  compensationOffered: 'Free Seat Reassignment + $10 Meal Voucher',
                  notes: 'Direct morning express departures are running on normal schedule.',
                },
              ],
            }}
          />
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Filter Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-28 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-brand-600" />
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider">
                    Filters
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSelectedBusType('ALL');
                    setMaxPriceFilter(500000);
                  }}
                  className="text-xs text-brand-600 font-bold hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Bus Type Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bus Category
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'ALL', label: 'All Bus Types' },
                    { id: 'LUXURY_VOLVO', label: 'Luxury Volvo Express' },
                    { id: 'AC_SLEEPER', label: 'AC Sleeper Cruiser' },
                    { id: 'AC_SEATER', label: 'AC Executive Seater' },
                  ].map((type) => (
                    <label key={type.id} className="flex items-center gap-2.5 text-xs font-semibold text-slate-600 cursor-pointer hover:text-slate-900">
                      <input
                        type="radio"
                        name="busType"
                        checked={selectedBusType === type.id}
                        onChange={() => setSelectedBusType(type.id)}
                        className="text-brand-500 focus:ring-brand-400"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Max Fare
                  </label>
                  <span className="text-xs font-black text-brand-600">
                    {maxPriceFilter.toLocaleString()} UZS
                  </span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={500000}
                  step={10000}
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(Number(e.target.value))}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              {/* Amenities info */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Standard Rova Amenities
                </span>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                    <span>Free onboard High-Speed Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                    <span>USB Fast Charging at every seat</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                    <span>Verified Conductor & GPS tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Trips List */}
          <div className="lg:w-3/4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900">
                Available Departures ({tripsData?.length || 0})
              </h2>
              <span className="text-xs text-slate-500">
                Route: <strong>{searchParams.origin || 'All'}</strong> → <strong>{searchParams.destination || 'All'}</strong>
              </span>
            </div>

            {tripsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-40 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
                ))}
              </div>
            ) : tripsData && tripsData.length > 0 ? (
              tripsData.map((trip) => {
                const departure = new Date(trip.departureTime);
                const arrival = new Date(trip.arrivalTime);
                const isSelected = activeTrip?.id === trip.id;

                return (
                  <div
                    key={trip.id}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-200 shadow-sm hover:shadow-md ${
                      isSelected ? 'border-brand-500 ring-2 ring-brand-500/20' : 'border-slate-100'
                    }`}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                      {/* Operator & Bus Type */}
                      <div className="md:col-span-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-extrabold text-slate-900">{trip.operator.name}</span>
                          <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-black rounded-md">
                            ★ {trip.operator.rating}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-500 mt-1">{trip.busName}</p>
                        <span className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider mt-2">
                          {trip.busType.replace('_', ' ')} • {trip.layoutType}
                        </span>
                      </div>

                      {/* Timings & Duration */}
                      <div className="md:col-span-5 flex items-center justify-between">
                        <div>
                          <p className="text-lg font-black text-slate-900">{format(departure, 'HH:mm')}</p>
                          <p className="text-xs font-semibold text-slate-500">{trip.route.origin}</p>
                          <p className="text-[10px] text-slate-400">{format(departure, 'MMM dd')}</p>
                        </div>

                        <div className="flex flex-col items-center px-4">
                          <span className="text-[10px] font-bold text-slate-400 mb-1">
                            {Math.floor(trip.durationMinutes / 60)}h {trip.durationMinutes % 60}m
                          </span>
                          <div className="w-20 border-b-2 border-dashed border-slate-300 relative">
                            <span className="absolute -top-1.5 right-0 text-[10px] text-brand-500">▶</span>
                          </div>
                          <span className="text-[9px] text-emerald-600 font-bold mt-1">Direct</span>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-black text-slate-900">{format(arrival, 'HH:mm')}</p>
                          <p className="text-xs font-semibold text-slate-500">{trip.route.destination}</p>
                          <p className="text-[10px] text-slate-400">{format(arrival, 'MMM dd')}</p>
                        </div>
                      </div>

                      {/* Price & Select Seats Button */}
                      <div className="md:col-span-3 flex md:flex-col items-center md:items-end justify-between gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                        <div className="md:text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold">Fare</span>
                          <p className="text-xl font-black text-brand-600 leading-tight">
                            {trip.basePrice.toLocaleString()} <span className="text-xs font-bold">UZS</span>
                          </p>
                          <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                            {trip.availableSeats} seats left
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenSeatMap(trip)}
                          className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                            isSelected
                              ? 'bg-slate-900 text-white'
                              : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/20'
                          }`}
                        >
                          {isSelected ? 'Seats Active' : 'View Seats'}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Seat Map Section */}
                    {isSelected && (
                      <div className="mt-6 pt-6 border-t border-slate-100 animate-fadeIn">
                        {tripDetailLoading ? (
                          <div className="text-center py-8 text-slate-400">Loading seat layout...</div>
                        ) : tripDetailData ? (
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-black text-slate-900">
                                Select Seats for {trip.busName} ({trip.layoutType})
                              </h3>
                              <span className="text-xs font-bold text-brand-600">
                                {selectedSeats.length} of 6 seats selected
                              </span>
                            </div>

                            <SeatMap
                              seats={tripDetailData.seats}
                              selectedSeatIds={selectedSeats.map((s) => s.id)}
                              onToggleSeat={handleToggleSeat}
                              layoutType={tripDetailData.bus.layoutType}
                            />

                            {/* Sticky Bottom Bar for Selected Seats */}
                            {selectedSeats.length > 0 && (
                              <div className="mt-6 p-4 bg-slate-900 text-white rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
                                <div>
                                  <span className="text-[10px] uppercase font-bold text-brand-400">
                                    Selected Seats
                                  </span>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {selectedSeats.map((s) => (
                                      <span
                                        key={s.id}
                                        className="px-2 py-0.5 bg-white/20 rounded font-mono text-xs font-bold"
                                      >
                                        {s.seatNumber}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <span className="text-[10px] uppercase font-bold text-slate-400">Total Price</span>
                                    <p className="text-lg font-black text-brand-400">
                                      {(trip.basePrice * selectedSeats.length).toLocaleString()} UZS
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={handleProceedToCheckout}
                                    className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-black text-xs rounded-xl shadow-lg shadow-brand-500/30 transition-all flex items-center gap-2"
                                  >
                                    <span>Continue to Passenger Details</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <Bus className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800">No scheduled departures found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching for another destination like Toshkent, Buxoro, or Samarkand.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Checkout Passenger Details Modal */}
      {isCheckoutOpen && activeTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-brand-400">Step 2 of 2</span>
                <h3 className="text-xl font-black">Passenger Details & Payment</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Trip: {activeTrip.route.origin} → {activeTrip.route.destination} ({activeTrip.busName})
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scroll Area */}
            <form onSubmit={handleConfirmBooking} className="p-6 overflow-y-auto space-y-5 flex-1">
              {bookingError && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Passenger Inputs for each selected seat */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Passenger Names per Seat
                </h4>
                <div className="space-y-3">
                  {passengersData.map((p, idx) => (
                    <div key={p.seatId} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">
                          Passenger {idx + 1}
                        </span>
                        <span className="px-2.5 py-0.5 bg-brand-500 text-white rounded-lg text-xs font-black">
                          Seat {p.seatNumber}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            required
                            placeholder="Full Name (as on ID)"
                            value={p.passengerName}
                            onChange={(e) => {
                              const updated = [...passengersData];
                              updated[idx].passengerName = e.target.value;
                              setPassengersData(updated);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <input
                            type="number"
                            required
                            placeholder="Age"
                            min={1}
                            max={110}
                            value={p.passengerAge}
                            onChange={(e) => {
                              const updated = [...passengersData];
                              updated[idx].passengerAge = Number(e.target.value);
                              setPassengersData(updated);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <select
                            value={p.passengerGender}
                            onChange={(e) => {
                              const updated = [...passengersData];
                              updated[idx].passengerGender = e.target.value as any;
                              setPassengersData(updated);
                            }}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                          >
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                            <option value="OTHER">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Ticket Receipt & Boarding Notification
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="passenger@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+998 90 123 45 67"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Simulated Payment Method
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CARD', label: 'Bank Card', desc: 'UzCard / Humo / Visa' },
                    { id: 'UPI', label: 'Instant Pay', desc: 'Click / Payme' },
                    { id: 'WALLET', label: 'Cash on Board', desc: 'At Bus Terminal' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        paymentMethod === m.id
                          ? 'border-brand-500 bg-brand-50/50 shadow-xs ring-1 ring-brand-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-brand-600 mb-1" />
                      <p className="text-xs font-bold text-slate-900 leading-tight">{m.label}</p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grand Total & Confirmation Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Payable</span>
                  <p className="text-2xl font-black text-brand-600">
                    {(activeTrip.basePrice * selectedSeats.length).toLocaleString()} UZS
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-black text-sm rounded-xl shadow-lg shadow-brand-500/30 transition-all disabled:opacity-50"
                >
                  {bookingLoading ? 'Securing Seats...' : 'Confirm & Issue Ticket'}
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

export default HomePage;
