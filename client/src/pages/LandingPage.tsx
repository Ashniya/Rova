import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  ArrowRight,
  Star,
  Compass,
  MapPin,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // Auto-logout when returning to the landing page, as specified in requirements
  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  // Top popular Punjab & Northern India overland routes
  const routes = [
    {
      id: 'ASR-IXC',
      title: 'Amritsar ──▶ Chandigarh Express',
      corridor: 'Grand Trunk Road via Jalandhar & Ludhiana',
      image: '/images/coach-exterior.jpg',
      price: '₹650',
      duration: '4h 15m',
      timing: 'Daily 06:30 & 14:00',
      rating: '★ 4.9 (1.8k)',
      bus: 'StarLiner Scania Touring PB-02-AK-9921',
    },
    {
      id: 'DEL-ASR',
      title: 'Delhi ──▶ Amritsar Golden Corridor',
      corridor: 'Kashmere Gate ISBT to Golden Temple Gateway',
      image: '/images/coach-exterior.jpg',
      price: '₹950',
      duration: '7h 30m',
      timing: 'Daily 21:30 (Overnight Sleeper)',
      rating: '★ 4.8 (2.4k)',
      bus: 'Volvo 9600 Multi-Axle PB-10-BX-1002',
    },
    {
      id: 'IXC-SML',
      title: 'Chandigarh ──▶ Shimla Hills Liner',
      corridor: 'Himalayan Expressway Observatory Line',
      image: '/images/coach-interior.jpg',
      price: '₹550',
      duration: '3h 45m',
      timing: 'Daily 07:15 & 12:30',
      rating: '★ 4.9 (980)',
      bus: 'Northern Shivalik Vista CH-01-GA-3091',
    },
    {
      id: 'LDH-DEL',
      title: 'Ludhiana ──▶ Delhi IGI Airport Direct',
      corridor: 'Non-stop Sherpur Chowk to Terminal 3',
      image: '/images/coach-exterior.jpg',
      price: '₹850',
      duration: '5h 00m',
      timing: 'Every 2 Hours (24x7)',
      rating: '★ 4.8 (1.5k)',
      bus: 'Punjab Executive Cruiser PB-08-CC-4412',
    },
  ];

  // User must log in before booking: leads directly to dedicated /login page
  const handleInitiateBooking = (routeId?: string) => {
    if (!isAuthenticated) {
      navigate('/login?role=passenger');
      return;
    }
    navigate('/passenger');
  };

  return (
    <div className="min-h-screen bg-[#FBF9F7] text-[#1C1917] font-sans selection:bg-[#B91C1C] selection:text-white animate-fadeIn">
      {/* 1. TOP NAVBAR matching Image 3 */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E7E2DA] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-2xl bg-[#B91C1C] flex items-center justify-center text-white shadow-xs">
              <Bus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-[#1C1917] block leading-none">
                ROVA
              </span>
              <p className="text-[10px] font-black tracking-widest text-[#B91C1C] uppercase mt-1">
                EXPEDITIONS &amp; FLEET
              </p>
            </div>
          </div>

          {/* Navigation Links with Dedicated Portals */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-[#44403C]">
            <a href="#routes" className="hover:text-[#B91C1C] transition-colors">
              Routes &amp; Destinations
            </a>
            <a href="#logistics" className="hover:text-[#B91C1C] transition-colors">
              Fleet Specs
            </a>
            <a href="#telemetry" className="hover:text-[#B91C1C] transition-colors">
              Live Telemetry
            </a>
            <button
              onClick={() => navigate('/login?role=driver')}
              className="hover:text-[#B91C1C] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>🚌 Driver HUD</span>
            </button>
            <button
              onClick={() => navigate('/login?role=admin')}
              className="hover:text-[#B91C1C] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>🛡️ Fleet Admin</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-bold text-[#44403C] hover:text-[#B91C1C] px-3.5 py-2 cursor-pointer transition-colors"
            >
              Sign In
            </button>

            {/* Red 'Book Journey' CTA */}
            <button
              onClick={() => handleInitiateBooking()}
              className="px-5 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] active:scale-[0.98] text-white rounded-full text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Book Journey</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION matching Image 3 */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-[10px] font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#B91C1C] animate-pulse"></span>
                <span>PREMIUM OVERLAND TRANSIT • PUNJAB &amp; NORTH CORRIDORS</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1C1917] tracking-tight leading-[1.1]">
                Explore Scenic <span className="text-[#B91C1C]">Bus Journeys</span> to Cherish!
              </h1>

              <p className="text-sm sm:text-base text-[#78716C] font-medium leading-relaxed max-w-xl">
                Enjoy breathtaking panoramic network routes of coastal lines and alpine horizons across Punjab, Chandigarh, Delhi, and Himalayan gateways. Relish in tailored luxury, live telemetry, and seamless overland transit with Rova.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => handleInitiateBooking('ASR-IXC')}
                  className="px-7 py-3.5 bg-[#B91C1C] hover:bg-[#991B1B] active:scale-[0.98] text-white font-black text-xs sm:text-sm rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Book Journey</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>

                <a
                  href="#routes"
                  className="px-6 py-3.5 bg-white hover:bg-[#F3EFEA] text-[#1C1917] font-bold text-xs sm:text-sm rounded-full border border-[#E7E2DA] transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-4 h-4 text-[#B91C1C]" />
                  <span>Explore Routes</span>
                </a>
              </div>

              {/* Reviewer Avatars & Rating Proof */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#E7E2DA]">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#B91C1C] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    HS
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    SK
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1C1917] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    RV
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[#F59E0B] text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-[#F59E0B]" />
                    <span>4.9 / 5.0 (12,300+ Verified Reviews)</span>
                  </div>
                  <p className="text-[10px] text-[#78716C] font-semibold">
                    Over 120,000+ happy overland voyagers across Northern India
                  </p>
                </div>
              </div>
            </div>

            {/* Right Overlapping Luxury Coach Visual matching Image 3, 4, 5 */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg">
                {/* Main Coach Exterior Card matching Image 5 */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#E7E2DA] h-80 group">
                  <img
                    src="/images/coach-exterior.jpg"
                    alt="Scenic Luxury Overland Coach through Stone Tunnel"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Grand Trunk Highway • Coastal &amp; Alpine Lines</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] font-mono">
                      PB-02-AK-9921
                    </span>
                  </div>
                </div>

                {/* Overlapping Interior Card matching Image 4 */}
                <div className="absolute -bottom-10 -left-6 sm:-left-10 w-64 sm:w-72 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <div className="relative h-44">
                    <img
                      src="/images/coach-interior.jpg"
                      alt="Luxury Panoramic Interior with Elena Lindqvist"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[#1C1917] text-[9px] font-black shadow-xs">
                      Elena Lindqvist ★ 4.9
                    </div>
                  </div>
                  <div className="p-3 text-[10px] text-[#44403C] font-semibold bg-white flex items-center justify-between">
                    <span>140° Sleeper Recliner Air-Suspension</span>
                    <span className="text-[#10B981] font-bold">WiFi 6</span>
                  </div>
                </div>

                {/* Floating On-Time Badge */}
                <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-[#E7E2DA] flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping"></span>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-[#1C1917] leading-tight">Fleet On-Time</p>
                    <p className="text-[9px] font-mono text-[#10B981] font-bold">99.8% Punctual</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RED RIBBON BANNER matching Image 3 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-[#B91C1C] text-white rounded-3xl p-6 sm:p-8 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black">120k+</p>
              <p className="text-xs text-white/80 font-bold uppercase tracking-wider">Happy Passengers</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black">45+</p>
              <p className="text-xs text-white/80 font-bold uppercase tracking-wider">Corridors Scenic Overland Lines</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black">140°</p>
              <p className="text-xs text-white/80 font-bold uppercase tracking-wider">Tilt Club Glassdome Seating</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black">99.8%</p>
              <p className="text-xs text-white/80 font-bold uppercase tracking-wider">Punctual Live Telemetry Radar</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR OVERLAND ROUTES IN INDIA / PUNJAB matching Image 3 */}
      <section id="routes" className="py-14 bg-white border-t border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-[#B91C1C]">
                TOP SCENIC OVERLAND ROUTES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] mt-1">
                Explore Popular Overland Corridors
              </h2>
              <p className="text-xs text-[#78716C] mt-1 font-medium">
                Hand-picked panoramic bus corridors with premier glass observatory cabins across Punjab and Northern India.
              </p>
            </div>

            <button
              onClick={() => handleInitiateBooking()}
              className="mt-4 sm:mt-0 px-4 py-2 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-[#1C1917] rounded-full text-xs font-bold border border-[#E7E2DA] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore All Fleets</span>
              <ChevronRight className="w-4 h-4 text-[#B91C1C]" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {routes.map((r) => (
              <div
                key={r.id}
                className="bg-[#FBF9F7] rounded-3xl p-4 border border-[#E7E2DA] shadow-xs hover:border-[#B91C1C]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative rounded-2xl overflow-hidden h-44 mb-3">
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2.5 right-2.5 px-3 py-1 rounded-full bg-white/95 text-[#B91C1C] font-black text-xs shadow-xs">
                      {r.price} <span className="text-[9px] text-[#78716C] font-normal">/ seat</span>
                    </span>
                  </div>
                  <h3 className="font-black text-sm text-[#1C1917] group-hover:text-[#B91C1C] transition-colors leading-snug">
                    {r.title}
                  </h3>
                  <p className="text-[11px] text-[#78716C] mt-1 line-clamp-1">{r.corridor}</p>
                  <p className="text-[10px] font-mono text-[#44403C] mt-2 font-bold">{r.bus}</p>

                  <div className="flex items-center justify-between text-[10px] text-[#78716C] font-semibold mt-3 pt-3 border-t border-[#E7E2DA]">
                    <span>{r.timing}</span>
                    <span className="text-[#F59E0B] font-bold">{r.rating}</span>
                  </div>
                </div>

                {/* Book Now Button */}
                <button
                  type="button"
                  onClick={() => handleInitiateBooking(r.id)}
                  className="w-full mt-4 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Select Seat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE ROVA / ELEVATED GROUND LOGISTICS matching Image 3 */}
      <section id="logistics" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#B91C1C]">
              WHY CHOOSE ROVA
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1C1917] tracking-tight">
              We Always Provide Elevated Ground Logistics
            </h2>
            <p className="text-xs sm:text-sm text-[#78716C] font-medium leading-relaxed">
              With decades perfecting regional passenger transit across Punjab and Northern India corridors, our connected ecosystem delivers frictionless seat booking, telemetry tracking, and zero-conflict seat security.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-white rounded-2xl border border-[#E7E2DA]">
                <p className="text-xl sm:text-2xl font-black text-[#1C1917]">25+</p>
                <p className="text-[10px] text-[#78716C] uppercase font-bold mt-0.5">Terminals</p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#E7E2DA]">
                <p className="text-xl sm:text-2xl font-black text-[#B91C1C]">180+</p>
                <p className="text-[10px] text-[#78716C] uppercase font-bold mt-0.5">Daily Trips</p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-[#E7E2DA]">
                <p className="text-xl sm:text-2xl font-black text-[#10B981]">380+</p>
                <p className="text-[10px] text-[#78716C] uppercase font-bold mt-0.5">Fleet Coaches</p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => navigate('/login?role=passenger')}
                className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold rounded-full cursor-pointer shadow-xs"
              >
                👤 Passenger Access
              </button>
              <button
                onClick={() => navigate('/login?role=driver')}
                className="px-4 py-2 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-[#44403C] font-bold rounded-full border border-[#E7E2DA] cursor-pointer"
              >
                🚌 Driver Captain HUD
              </button>
              <button
                onClick={() => navigate('/login?role=admin')}
                className="px-4 py-2 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-[#44403C] font-bold rounded-full border border-[#E7E2DA] cursor-pointer"
              >
                🛡️ Fleet Dispatch HUD
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#E7E2DA] h-72 sm:h-80 relative">
              <img
                src="/images/coach-interior.jpg"
                alt="Luxury Intercity Coach Interior"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 text-white">
                <div>
                  <p className="text-sm font-black">StarLiner Punjab Master Cabin</p>
                  <p className="text-xs text-white/80">Active Air Suspension • Certified Sanitized Air</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. EXPLORE CORRIDORS IN REAL-TIME (LIVE RADAR) matching Image 3 */}
      <section id="telemetry" className="py-14 bg-white border-t border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Live Progress Box */}
            <div className="lg:col-span-7 bg-[#FBF9F7] rounded-3xl p-6 border border-[#E7E2DA] shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E7E2DA] text-xs font-bold text-[#78716C]">
                <span className="flex items-center gap-1.5 text-[#1C1917]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                  Active Corridor: GT Road Express
                </span>
                <span className="font-mono">Coach: PB-02-AK-9921</span>
              </div>

              {/* Corridor Progress Bar */}
              <div className="space-y-2 py-4">
                <div className="flex justify-between text-xs font-black text-[#1C1917]">
                  <span>Amritsar ISBT (06:30 AM)</span>
                  <span>Chandigarh Sector 17 (10:45 AM)</span>
                </div>
                <div className="w-full bg-[#E7E2DA] h-3 rounded-full overflow-hidden relative">
                  <div className="bg-[#B91C1C] h-full w-[65%] rounded-full relative">
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#B91C1C]"></span>
                  </div>
                </div>
                <div className="flex justify-between text-[11px] text-[#78716C] font-semibold">
                  <span>Departed Bay 03</span>
                  <span className="font-bold text-[#10B981]">Near Jalandhar Bypass • 68 km/h</span>
                  <span>ETA: 42 mins</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#E7E2DA] text-center text-xs">
                <div>
                  <span className="text-[10px] text-[#78716C] uppercase font-bold block">Speed</span>
                  <span className="font-black text-[#1C1917]">68 km/h</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#78716C] uppercase font-bold block">Fuel Reserve</span>
                  <span className="font-black text-[#10B981]">82% Diesel</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#78716C] uppercase font-bold block">Cabin Climate</span>
                  <span className="font-black text-[#1C1917]">21°C Climate</span>
                </div>
              </div>
            </div>

            {/* Radar Information & Button */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#B91C1C]">
                LIVE GPS RADAR DESTINATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1C1917]">
                Explore Corridors in Real-Time
              </h3>
              <p className="text-xs text-[#78716C] leading-relaxed">
                Watch coaches glide across open topography, preview actual adjustments, rest stops, and live weather conditions before booking your observatory window.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/login?role=driver')}
                  className="px-6 py-3.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-black text-xs rounded-full shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch Radar HUD</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PASSENGER TESTIMONIALS matching Image 3 */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#B91C1C]">
            COMMUNITY REVIEWS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] mt-1">
            What Passengers Say About Us
          </h2>
          <p className="text-xs text-[#78716C] mt-1">
            Real experiences from travelers across Punjab and Northern India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#B91C1C] text-white font-bold text-xs flex items-center justify-center">
                HS
              </div>
              <div>
                <p className="text-xs font-black text-[#1C1917]">Harpreet Singh</p>
                <p className="text-[10px] text-[#F59E0B] font-bold">★ 5.0 (Amritsar)</p>
              </div>
            </div>
            <p className="text-xs text-[#44403C] italic leading-relaxed">
              "Traveling to Chandigarh with my family was effortless. Spotless luxury cabins, heated seats, and the double-decker observation seats made the journey memorable."
            </p>
          </div>

          <div className="bg-[#B91C1C] text-white rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white text-[#B91C1C] font-bold text-xs flex items-center justify-center">
                SK
              </div>
              <div>
                <p className="text-xs font-black text-white">Simran Kaur</p>
                <p className="text-[10px] text-[#FBBF24] font-bold">★ 5.0 (Ludhiana)</p>
              </div>
            </div>
            <p className="text-xs text-white/95 italic leading-relaxed">
              "The best bus service by far. Fast Wi-Fi, onboard charging ports for my laptop, and on-time departure from Sherpur Chowk. Using Rova will not disappoint."
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1C1917] text-white font-bold text-xs flex items-center justify-center">
                RV
              </div>
              <div>
                <p className="text-xs font-black text-[#1C1917]">Rajesh Verma</p>
                <p className="text-[10px] text-[#F59E0B] font-bold">★ 4.9 (Delhi)</p>
              </div>
            </div>
            <p className="text-xs text-[#44403C] italic leading-relaxed">
              "Booking my seat through this interface was so smooth. Instant SMS PNR, zero duplicate seat nonsense, and the live driver telemetry map was accurate."
            </p>
          </div>
        </div>
      </section>

      {/* 8. VISION & FLEET BANNER matching Image 3 */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-[#B91C1C] text-white rounded-3xl p-8 sm:p-12 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-4 flex justify-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img
                  src="/images/coach-interior.jpg"
                  alt="Rova Vision Coach"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-red-200">
                ABOUT ROVA TRANSIT ELITE
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Get More Info About Our Vision &amp; Fleet
              </h2>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-xl">
                Get to know us a little bit more and learn why we are your premier choice to plan your overland journeys. Where routes become journeys.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleInitiateBooking()}
                  className="px-6 py-3 bg-white text-[#B91C1C] hover:bg-red-50 font-black text-xs rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Book Journey
                </button>
                <button
                  onClick={() => navigate('/login?role=driver')}
                  className="px-6 py-3 bg-[#991B1B] hover:bg-red-900 text-white font-bold text-xs rounded-full border border-white/20 transition-all cursor-pointer"
                >
                  Contact Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. DARK FOOTER matching Image 3 */}
      <footer className="bg-[#1C1917] text-[#D6D3D1] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-[#B91C1C] flex items-center justify-center text-white">
                  <Bus className="w-4 h-4" />
                </div>
                <span className="text-xl font-black text-white">Rova</span>
              </div>
              <p className="text-xs text-[#A8A29E] leading-relaxed">
                Where routes become journeys. Transforming intercity and alpine road logistics into seamless, predictable passenger expeditions.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wider mb-3">Network</h4>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li className="hover:text-white cursor-pointer" onClick={() => handleInitiateBooking('ASR-IXC')}>Grand Trunk Corridor</li>
                <li className="hover:text-white cursor-pointer" onClick={() => handleInitiateBooking('IXC-SML')}>Himalayan Shivalik Line</li>
                <li className="hover:text-white cursor-pointer" onClick={() => handleInitiateBooking('DEL-ASR')}>Golden Temple Express</li>
                <li className="hover:text-white cursor-pointer" onClick={() => handleInitiateBooking('LDH-DEL')}>Delhi IGI Connections</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wider mb-3">Fleet &amp; Crew</h4>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/login?role=driver')}>Driver Cockpit HUD</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/login?role=admin')}>Fleet Logistics Console</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/login?role=driver')}>Live 37-Berth Schematic</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/login?role=admin')}>Platform Revenue Analytics</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wider mb-3">Dispatch Center</h4>
              <p className="text-xs text-[#A8A29E] mb-1">Headquarters: Punjab Operations Hub</p>
              <p className="text-xs text-[#A8A29E] mb-3">24/7 Toll-Free: 1800-ROVA-BUS</p>
              <button
                onClick={() => navigate('/login?role=driver')}
                className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Access System HUD &rarr;
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#78716C]">
            <p>&copy; 2026 Rova Expeditions India Private Limited. All rights reserved. Where routes become journeys.</p>
            <p className="font-mono">ALGIONS AI LABS ASSESSMENT</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
