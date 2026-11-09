import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Search,
  Calendar,
  Users,
  ShieldCheck,
  Zap,
  ArrowRight,
  Clock,
  Sparkles,
  Radio,
  CheckCircle2,
  Ticket,
  ChevronRight,
  MapPin,
  Compass,
} from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Search widget state
  const [origin, setOrigin] = useState('Toshkent');
  const [destination, setDestination] = useState('Buxoro');
  const [travelDate, setTravelDate] = useState('2026-11-10');
  const [passengerCount, setPassengerCount] = useState(1);

  // Quick PNR lookup state
  const [pnrInput, setPnrInput] = useState('');

  const handleSearchTrips = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/bookings?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${travelDate}`);
  };

  const handlePnrSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;
    navigate(`/customers?pnr=${encodeURIComponent(pnrInput.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#0F0619] text-white selection:bg-coral-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-purple-950/80 bg-[#1A0B2E]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand: Just Rova and tagline in white */}
          <div className="flex items-center gap-6">
            <div className="cursor-pointer" onClick={() => navigate('/')}>
              <span className="text-3xl font-black tracking-tight text-white hover:text-coral-400 transition-colors">
                Rova
              </span>
              <p className="text-[10px] font-semibold tracking-wider text-slate-300 uppercase">
                Where routes become journeys
              </p>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
              <button
                onClick={() => navigate('/bookings')}
                className="hover:text-white transition-colors"
              >
                Book Seats
              </button>
              <button
                onClick={() => navigate('/schedule')}
                className="hover:text-white transition-colors"
              >
                Schedules
              </button>
              <button
                onClick={() => navigate('/fleet')}
                className="hover:text-white transition-colors"
              >
                Fleet Radar
              </button>
              <button
                onClick={() => navigate('/customers')}
                className="hover:text-white transition-colors"
              >
                PNR Lookup
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-sidebar-card hover:bg-sidebar-hover text-white text-xs font-bold rounded-xl border border-purple-500/30 transition-all flex items-center gap-1.5"
            >
              <span>Operations Portal</span>
              <ArrowRight className="w-3.5 h-3.5 text-coral-400" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-900/40 rounded-xl border border-purple-500/20 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-white">{user?.name}</span>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold rounded-xl transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Ambient lighting glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-900/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-[300px] h-[300px] bg-coral-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-sidebar-card border border-purple-500/30 rounded-full text-coral-400 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Next-Generation Intercity Transit System</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Where routes become <span className="text-coral-400">journeys.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
              Real-time seat selection, zero-conflict booking integrity, and precision fleet telemetry built for passengers and transit operators alike.
            </p>
          </div>

          {/* Interactive Search Widget */}
          <div className="bg-[#1A0B2E] border border-purple-500/30 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-purple-900/80">
              <div className="flex items-center gap-2">
                <Bus className="w-5 h-5 text-coral-400" />
                <span className="font-bold text-sm text-white">Find Your Intercity Coach</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Live Availability Guaranteed</span>
            </div>

            <form onSubmit={handleSearchTrips} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Origin */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-coral-400" />
                  Origin
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-purple-950/70 border border-purple-500/20 rounded-2xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none focus:border-coral-500 transition-all cursor-pointer"
                >
                  <option value="Toshkent">Toshkent (Central Terminal)</option>
                  <option value="Dhaka">Dhaka (Kallayanpur Counter)</option>
                  <option value="Samarkand">Samarkand (Registan Terminal)</option>
                  <option value="Buxoro">Buxoro (Historic Station)</option>
                  <option value="Chattogram">Chattogram (Dampara Station)</option>
                </select>
              </div>

              {/* Destination */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-coral-400" />
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-purple-950/70 border border-purple-500/20 rounded-2xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none focus:border-coral-500 transition-all cursor-pointer"
                >
                  <option value="Buxoro">Buxoro (Historic Station)</option>
                  <option value="Rangpur">Rangpur (Central Counter)</option>
                  <option value="Samarkand">Samarkand (Registan Terminal)</option>
                  <option value="Chattogram">Chattogram (Dampara Station)</option>
                  <option value="Sylhet">Sylhet (Kadamtali Station)</option>
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-coral-400" />
                  Travel Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-purple-950/70 border border-purple-500/20 rounded-2xl px-3.5 py-3 text-xs font-bold text-white focus:outline-none focus:border-coral-500 transition-all"
                />
              </div>

              {/* Passenger & Search Button */}
              <div className="flex flex-col justify-end space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-coral-400" />
                  Seats
                </label>
                <button
                  type="submit"
                  className="w-full py-3 bg-coral-500 hover:bg-coral-600 active:scale-[0.99] text-white font-black text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 stroke-[2.5]" />
                  <span>Search Coaches</span>
                </button>
              </div>
            </form>

            {/* Quick Filter Badges */}
            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-purple-900/60 text-xs">
              <span className="text-slate-400 font-semibold">Popular Routes:</span>
              <button
                type="button"
                onClick={() => { setOrigin('Toshkent'); setDestination('Buxoro'); }}
                className="px-3 py-1 bg-purple-900/50 hover:bg-purple-900/80 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Toshkent → Buxoro
              </button>
              <button
                type="button"
                onClick={() => { setOrigin('Dhaka'); setDestination('Rangpur'); }}
                className="px-3 py-1 bg-purple-900/50 hover:bg-purple-900/80 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Dhaka → Rangpur
              </button>
              <button
                type="button"
                onClick={() => { setOrigin('Dhaka'); setDestination('Chattogram'); }}
                className="px-3 py-1 bg-purple-900/50 hover:bg-purple-900/80 rounded-xl text-slate-300 hover:text-white transition-colors"
              >
                Dhaka → Chattogram
              </button>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
            <div className="bg-[#1A0B2E]/80 border border-purple-500/20 rounded-2xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-white">52</p>
              <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Coaches Active</p>
            </div>
            <div className="bg-[#1A0B2E]/80 border border-purple-500/20 rounded-2xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">99.1%</p>
              <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">On-Time Transit</p>
            </div>
            <div className="bg-[#1A0B2E]/80 border border-purple-500/20 rounded-2xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-coral-400">0</p>
              <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Seat Conflicts</p>
            </div>
            <div className="bg-[#1A0B2E]/80 border border-purple-500/20 rounded-2xl p-4 text-center">
              <p className="text-2xl sm:text-3xl font-black text-white">4,120+</p>
              <p className="text-[11px] text-slate-400 font-bold uppercase mt-1">Tickets Booked</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Luxury Coaches Section */}
      <section className="py-16 bg-[#160B24] border-t border-b border-purple-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-coral-400">
                PREMIUM FLEET SELECTION
              </span>
              <h2 className="text-3xl font-black text-white mt-1">
                Engineered for Comfort & Precision
              </h2>
            </div>
            <button
              onClick={() => navigate('/fleet')}
              className="mt-4 md:mt-0 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <span>Explore All 52 Coaches</span>
              <ChevronRight className="w-4 h-4 text-coral-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Coach 1 */}
            <div className="bg-[#1A0B2E] border border-purple-500/20 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-bold">
                    LIVE ON-TIME
                  </span>
                  <span className="text-xs font-mono text-slate-400">Plate: DHA-8921</span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-coral-400 transition-colors">
                  StarLiner Executive Fleet
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Multi-Axle Scania Touring • Premium Sleeper Recliner Air-Suspension
                </p>

                <div className="grid grid-cols-2 gap-2 my-5 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    140° Recline Seats
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Free 5G Wi-Fi
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    USB-C 65W Ports
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Climate Control
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Base Fare</span>
                  <span className="text-lg font-black text-white">$55.00</span>
                </div>
                <button
                  onClick={() => navigate('/bookings')}
                  className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Select Seats
                </button>
              </div>
            </div>

            {/* Coach 2 */}
            <div className="bg-[#1A0B2E] border border-purple-500/20 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-[10px] font-bold">
                    PREMIUM VISTA
                  </span>
                  <span className="text-xs font-mono text-slate-400">Plate: UZB-4012</span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-coral-400 transition-colors">
                  Silk Road Regal Cruiser
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Volvo B11R Intercity • Panoramic Sightseeing Windows
                </p>

                <div className="grid grid-cols-2 gap-2 my-5 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Extra Legroom
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Onboard Lavatory
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    20kg Luggage Included
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Snack Bar
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Base Fare</span>
                  <span className="text-lg font-black text-white">$45.00</span>
                </div>
                <button
                  onClick={() => navigate('/bookings')}
                  className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Select Seats
                </button>
              </div>
            </div>

            {/* Coach 3 */}
            <div className="bg-[#1A0B2E] border border-purple-500/20 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all group">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-[10px] font-bold">
                    BUSINESS CLASS
                  </span>
                  <span className="text-xs font-mono text-slate-400">Plate: DHA-3091</span>
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-coral-400 transition-colors">
                  Astra Executive Express
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Mercedes-Benz Tourismo • Silent Cabin Vibration Dampening
                </p>

                <div className="grid grid-cols-2 gap-2 my-5 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Privacy Curtains
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Reading Lights
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Personal Audio
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Transit Insurance
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-purple-900/60 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Base Fare</span>
                  <span className="text-lg font-black text-white">$62.00</span>
                </div>
                <button
                  onClick={() => navigate('/bookings')}
                  className="px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold rounded-xl transition-all"
                >
                  Select Seats
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick PNR Lookup Banner */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#1A0B2E] to-[#25123E] border border-purple-500/30 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-coral-400">
              ALREADY HAVE A RESERVATION?
            </span>
            <h3 className="text-2xl font-black text-white">Track Your PNR or Download Boarding Pass</h3>
            <p className="text-xs text-slate-300 max-w-md">
              Enter your booking code to view real-time trip status, seat assignment, or manage your cancellation refund. Try demo PNR: <span className="font-mono text-coral-400 font-bold">RV8F92K</span>
            </p>
          </div>

          <form onSubmit={handlePnrSearch} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
              placeholder="e.g. RV8F92K"
              className="px-4 py-3 bg-purple-950/80 border border-purple-500/30 rounded-2xl text-xs font-mono font-bold text-white uppercase placeholder:text-slate-500 focus:outline-none focus:border-coral-500 min-w-[180px]"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs rounded-2xl transition-all whitespace-nowrap"
            >
              Verify PNR
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-950/80 bg-[#160B24] py-10 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xl font-black text-white">Rova</span>
            <span className="ml-3 text-[11px] text-slate-400">Where routes become journeys</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">
              Operations Control
            </button>
            <button onClick={() => navigate('/bookings')} className="hover:text-white transition-colors">
              Book Tickets
            </button>
            <button onClick={() => navigate('/admin')} className="hover:text-white transition-colors">
              System Admin
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-500">
            ALGIONS AI LABS ASSESSMENT • FULL-STACK BUS BOOKING
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
