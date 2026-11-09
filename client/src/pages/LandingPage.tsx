import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Lock,
  Ticket,
  Shield,
  ArrowRight,
  Search,
  CheckCircle2,
  Calendar,
  Users,
  Compass,
  Star,
  PhoneCall,
  User,
  Coffee,
  Wifi,
  Sparkles,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, logout } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Clearance Role Tabs: Passenger | Driver HUD | Fleet Admin
  const [activeRoleTab, setActiveRoleTab] = useState<'passenger' | 'driver' | 'admin'>('passenger');

  // Login form state inside the Hero card
  const [identifier, setIdentifier] = useState('gozal@example.com');
  const [password, setPassword] = useState('password123');
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Quick PNR modal state
  const [showPnrModal, setShowPnrModal] = useState(false);
  const [pnrInput, setPnrInput] = useState('RV8F92K');

  const handleRoleTabChange = (role: 'passenger' | 'driver' | 'admin') => {
    setActiveRoleTab(role);
    if (role === 'passenger') {
      setIdentifier('gozal@example.com');
      setPassword('password123');
    } else if (role === 'driver') {
      setIdentifier('operator@silkroad.com');
      setPassword('operator123');
    } else {
      setIdentifier('admin@rova.com');
      setPassword('admin123');
    }
  };

  const handleHeroLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError(null);
    try {
      await login(identifier, password);
      // Once logged in, navigate to dashboard or bookings
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.response?.data?.message || 'Invalid credentials. Please verify your email/password.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleBookRoute = (routeCode: string) => {
    if (!isAuthenticated) {
      // Require login before booking as user requested
      setAuthModalOpen(true);
      return;
    }
    navigate(`/bookings?route=${routeCode}`);
  };

  const handlePnrLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrInput.trim()) return;
    navigate(`/customers?pnr=${encodeURIComponent(pnrInput.trim().toUpperCase())}`);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F7] text-[#1C1917] font-sans selection:bg-[#B91C1C] selection:text-white">
      {/* Top Bar matching Image 2 */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E7E2DA] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-2xl bg-[#B91C1C] flex items-center justify-center text-white shadow-xs">
              <Bus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#1C1917]">ROVA</span>
              </div>
              <p className="text-[9px] font-bold tracking-[0.2em] text-[#78716C] uppercase -mt-0.5">
                EXPEDITIONS &amp; FLEET
              </p>
            </div>
          </div>

          {/* Right Header Status Pill & Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#F3EFEA] border border-[#E7E2DA] rounded-full text-xs font-semibold text-[#44403C]">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
              <span>Fleet Status: <strong className="text-[#1C1917]">99.8% On-Time</strong></span>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-[#1C1917] rounded-full text-xs font-bold border border-[#E7E2DA] transition-all flex items-center gap-1.5"
            >
              <span>Operations HUD</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B91C1C]" />
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2">
                <div className="w-8 h-8 rounded-full bg-[#1C1917] text-white font-bold text-xs flex items-center justify-center uppercase">
                  {user?.name.slice(0, 2)}
                </div>
                <button
                  onClick={logout}
                  className="text-xs font-bold text-[#78716C] hover:text-[#B91C1C] transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-5 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-full text-xs font-bold transition-all shadow-xs"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section matching Image 2 */}
      <section className="pt-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Universal Transit Access Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E7E2DA] shadow-card flex flex-col justify-between">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#B91C1C] text-[10px] font-bold uppercase tracking-wider mb-4">
                <Lock className="w-3 h-3" />
                <span>UNIVERSAL TRANSIT ACCESS</span>
              </div>

              {/* Title with exact tagline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1C1917] tracking-tight leading-tight mb-2">
                Where routes become journeys.
              </h1>
              <p className="text-xs sm:text-sm text-[#78716C] font-medium leading-relaxed mb-6">
                Select your corridor clearance role to access tickets, route schedules, or fleet telemetry dashboards.
              </p>

              {/* Clearance Role Tabs */}
              <div className="flex items-center gap-2 p-1 bg-[#F3EFEA] rounded-2xl border border-[#E7E2DA] mb-6">
                <button
                  type="button"
                  onClick={() => handleRoleTabChange('passenger')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeRoleTab === 'passenger'
                      ? 'bg-[#B91C1C] text-white shadow-xs'
                      : 'text-[#44403C] hover:text-[#1C1917]'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Passenger</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleTabChange('driver')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeRoleTab === 'driver'
                      ? 'bg-[#B91C1C] text-white shadow-xs'
                      : 'text-[#44403C] hover:text-[#1C1917]'
                  }`}
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>Driver HUD</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleTabChange('admin')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeRoleTab === 'admin'
                      ? 'bg-[#B91C1C] text-white shadow-xs'
                      : 'text-[#44403C] hover:text-[#1C1917]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Fleet Admin</span>
                </button>
              </div>

              {/* Login Form */}
              <form onSubmit={handleHeroLogin} className="space-y-4">
                {authError && (
                  <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl text-xs font-bold text-[#B91C1C]">
                    {authError}
                  </div>
                )}

                {/* Identifier input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#78716C] mb-1">
                    Passenger PNR Code or Registered Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. ROV-7849X or user@voyage.com"
                      className="w-full px-4 py-3 bg-[#F3EFEA] border border-[#E7E2DA] rounded-2xl text-xs font-bold text-[#1C1917] placeholder:text-[#A8A29E] focus:bg-white focus:outline-none focus:border-[#B91C1C] transition-all"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                      Voyager Password or Mobile OTP
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Demo Passwords: password123 (Passenger), operator123 (Operator), admin123 (Admin)')}
                      className="text-[11px] font-bold text-[#B91C1C] hover:underline"
                    >
                      Forgot passcode?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter secure credentials"
                      className="w-full px-4 py-3 bg-[#F3EFEA] border border-[#E7E2DA] rounded-2xl text-xs font-bold text-[#1C1917] placeholder:text-[#A8A29E] focus:bg-white focus:outline-none focus:border-[#B91C1C] transition-all"
                    />
                  </div>
                </div>

                {/* Checkbox row */}
                <div className="flex items-center justify-between pt-1 text-xs text-[#78716C]">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                      className="rounded border-[#E7E2DA] text-[#B91C1C] focus:ring-[#B91C1C]"
                    />
                    <span>Keep me logged in on this terminal</span>
                  </label>
                  <span className="font-semibold text-[#1C1917] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                    Realtime boarding pass ready
                  </span>
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-[#B91C1C] hover:bg-[#991B1B] active:scale-[0.99] text-white font-black text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isLoggingIn ? 'Authorizing Session...' : 'Access Booking & Digital QR'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </form>

              {/* Express Access Buttons */}
              <div className="mt-6 pt-5 border-t border-[#E7E2DA]">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="text-[10px] font-bold tracking-widest text-[#78716C] uppercase">
                    OR EXPRESS ACCESS
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPnrModal(true)}
                    className="py-2.5 px-4 bg-[#F3EFEA] hover:bg-[#EAE4DC] border border-[#E7E2DA] rounded-2xl text-xs font-bold text-[#1C1917] transition-all flex items-center justify-center gap-2"
                  >
                    <Ticket className="w-3.5 h-3.5 text-[#B91C1C]" />
                    <span>Lookup by PNR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="py-2.5 px-4 bg-[#F3EFEA] hover:bg-[#EAE4DC] border border-[#E7E2DA] rounded-2xl text-xs font-bold text-[#1C1917] transition-all flex items-center justify-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-[#B91C1C]" />
                    <span>Operations HUD</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Support Footer */}
            <div className="pt-6 mt-6 border-t border-[#E7E2DA] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#78716C]">
              <span>Need booking assistance? Call <strong className="text-[#1C1917]">+4122 819 0040</strong></span>
              <div className="flex items-center gap-3">
                <span className="hover:underline cursor-pointer">Terms of Carriage</span>
                <span>•</span>
                <span className="hover:underline cursor-pointer">Privacy Policy</span>
              </div>
            </div>
          </div>

          {/* Right Column: Scenic Luxury Coach Showcase matching Image 2 */}
          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-[#E7E2DA] shadow-card min-h-[580px] flex flex-col justify-between p-6 group">
            {/* Background scenic photo from uploaded media */}
            <img
              src="/images/coach-interior.jpg"
              alt="Alpine Glacier Express Coach"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Ambient vignette gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/95 via-transparent to-[#1C1917]/40"></div>

            {/* Top Badges */}
            <div className="relative z-10 flex items-start justify-between gap-2">
              {/* Passenger Tag */}
              <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/40 shadow-xs flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#B91C1C] text-white text-[10px] font-bold flex items-center justify-center">
                  EL
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#1C1917] leading-tight">Elena Lindqvist</p>
                  <p className="text-[9px] font-bold text-[#F59E0B]">★ 4.9 (Executive Cabin)</p>
                </div>
              </div>

              {/* Corridor Live Pill */}
              <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/40 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-[#1C1917]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>CORRIDOR LIVE • Alpine Glacier Express</span>
              </div>
            </div>

            {/* Bottom Panorama Lounge Seat Card matching Image 2 */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-2xl p-5 border border-white/60 shadow-lg text-[#1C1917]">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E7E2DA] text-xs font-black">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#B91C1C]">💺</span>
                  <span>PANORAMA LOUNGE SEAT #14A</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#78716C] font-semibold">
                  <span className="flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-[#10B981]" />
                    WiFi 6
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Coffee className="w-3 h-3 text-[#F59E0B]" />
                    Espresso Bar
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#44403C] italic leading-relaxed mb-3">
                "Gliding across the Bernina Pass with steaming coffee and heated leather recliners transformed coach travel into pure scenic joy."
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#E7E2DA] text-[10px] font-bold text-[#78716C]">
                <span>St. Moritz ──▶ Lugano</span>
                <span className="font-mono text-[#1C1917]">188 km scenic line</span>
              </div>
            </div>
          </div>
        </div>

        {/* Red Ribbon Banner matching Image 2 */}
        <div className="mt-8 bg-[#991B1B] text-white rounded-3xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <Star className="w-5 h-5 fill-white" />
              </div>
              <div>
                <p className="font-black text-sm text-white">Happy Voyagers</p>
                <p className="text-xs text-white/80">98.4% five-star satisfaction ratings</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-sm text-white">Curated Corridors</p>
                <p className="text-xs text-white/80">Scenic panoramic valley &amp; coastal lines</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-black text-sm text-white">Transparent Fares</p>
                <p className="text-xs text-white/80">Zero booking commissions or bag fees</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stats Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
          <div className="bg-white rounded-2xl p-4 border border-[#E7E2DA] shadow-xs">
            <p className="text-2xl sm:text-3xl font-black text-[#1C1917]">450+</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] mt-1">Daily departures</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#E7E2DA] shadow-xs">
            <p className="text-2xl sm:text-3xl font-black text-[#B91C1C]">2.4M</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] mt-1">Km covered annually</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#E7E2DA] shadow-xs">
            <p className="text-2xl sm:text-3xl font-black text-[#10B981]">100%</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] mt-1">GPS-monitored fleet</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#E7E2DA] shadow-xs">
            <p className="text-2xl sm:text-3xl font-black text-[#1C1917]">&lt;3m</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] mt-1">Average boarding speed</p>
          </div>
        </div>
      </section>

      {/* Explore Popular Overland Routes Section matching Image 3 */}
      <section className="py-14 bg-white border-t border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#B91C1C]">
                TOP SCENIC OVERLAND ROUTES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] mt-1">
                Explore Popular Overland Corridors
              </h2>
              <p className="text-xs text-[#78716C] mt-1">
                Hand-picked panoramic bus corridors with premier glass observatory cabins.
              </p>
            </div>
            <button
              onClick={() => navigate('/fleet')}
              className="mt-3 sm:mt-0 text-xs font-bold text-[#B91C1C] hover:text-[#991B1B] flex items-center gap-1"
            >
              <span>View All 52 Routes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Route 1 */}
            <div className="bg-[#FBF9F7] rounded-3xl p-4 border border-[#E7E2DA] shadow-xs hover:border-[#B91C1C]/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="relative rounded-2xl overflow-hidden h-44 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
                    alt="Pacific Coast Way"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 text-[#1C1917] font-black text-[10px] shadow-xs">
                    $55 / seat
                  </span>
                </div>
                <h3 className="font-black text-sm text-[#1C1917] group-hover:text-[#B91C1C] transition-colors">
                  Pacific Coast Way
                </h3>
                <p className="text-[11px] text-[#78716C] mt-0.5">Monterey to Big Sur Arch</p>
                <div className="flex items-center justify-between text-[10px] text-[#78716C] font-semibold mt-3 pt-3 border-t border-[#E7E2DA]">
                  <span>Daily 08:30 &amp; 14:00</span>
                  <span className="text-[#F59E0B]">★ 4.9 (1.2k)</span>
                </div>
              </div>
              <button
                onClick={() => handleBookRoute('DHK-CTG')}
                className="w-full mt-4 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Select Seat
              </button>
            </div>

            {/* Route 2 */}
            <div className="bg-[#FBF9F7] rounded-3xl p-4 border border-[#E7E2DA] shadow-xs hover:border-[#B91C1C]/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="relative rounded-2xl overflow-hidden h-44 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80"
                    alt="Canyon Red Gorge"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 text-[#1C1917] font-black text-[10px] shadow-xs">
                    $62 / seat
                  </span>
                </div>
                <h3 className="font-black text-sm text-[#1C1917] group-hover:text-[#B91C1C] transition-colors">
                  Canyon Red Gorge
                </h3>
                <p className="text-[11px] text-[#78716C] mt-0.5">Moab to Zion Portal</p>
                <div className="flex items-center justify-between text-[10px] text-[#78716C] font-semibold mt-3 pt-3 border-t border-[#E7E2DA]">
                  <span>Daily 07:00 &amp; 11:30</span>
                  <span className="text-[#F59E0B]">★ 4.8 (890)</span>
                </div>
              </div>
              <button
                onClick={() => handleBookRoute('BS-MON')}
                className="w-full mt-4 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Select Seat
              </button>
            </div>

            {/* Route 3 */}
            <div className="bg-[#FBF9F7] rounded-3xl p-4 border border-[#E7E2DA] shadow-xs hover:border-[#B91C1C]/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="relative rounded-2xl overflow-hidden h-44 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                    alt="Emerald Pine Crest"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 text-[#1C1917] font-black text-[10px] shadow-xs">
                    $48 / seat
                  </span>
                </div>
                <h3 className="font-black text-sm text-[#1C1917] group-hover:text-[#B91C1C] transition-colors">
                  Emerald Pine Crest
                </h3>
                <p className="text-[11px] text-[#78716C] mt-0.5">Cascade Pass to Lake Rainier</p>
                <div className="flex items-center justify-between text-[10px] text-[#78716C] font-semibold mt-3 pt-3 border-t border-[#E7E2DA]">
                  <span>Daily 09:15 &amp; 16:00</span>
                  <span className="text-[#F59E0B]">★ 4.9 (2.1k)</span>
                </div>
              </div>
              <button
                onClick={() => handleBookRoute('TSH-BX')}
                className="w-full mt-4 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Select Seat
              </button>
            </div>

            {/* Route 4 */}
            <div className="bg-[#FBF9F7] rounded-3xl p-4 border border-[#E7E2DA] shadow-xs hover:border-[#B91C1C]/40 transition-all flex flex-col justify-between group">
              <div>
                <div className="relative rounded-2xl overflow-hidden h-44 mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80"
                    alt="Heritage Valley Express"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-white/95 text-[#1C1917] font-black text-[10px] shadow-xs">
                    $45 / seat
                  </span>
                </div>
                <h3 className="font-black text-sm text-[#1C1917] group-hover:text-[#B91C1C] transition-colors">
                  Heritage Valley Express
                </h3>
                <p className="text-[11px] text-[#78716C] mt-0.5">Old Quarter to Grand Quay</p>
                <div className="flex items-center justify-between text-[10px] text-[#78716C] font-semibold mt-3 pt-3 border-t border-[#E7E2DA]">
                  <span>Hourly departures</span>
                  <span className="text-[#F59E0B]">★ 4.8 (640)</span>
                </div>
              </div>
              <button
                onClick={() => handleBookRoute('DHK-SYL')}
                className="w-full mt-4 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Select Seat
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer matching Image 3 */}
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
                Where routes become journeys. Transforming intercity and alpine passenger logistics into seamless, predictable expeditions.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wider mb-3">Corridors</h4>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/bookings')}>Coastline &amp; Fjords</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/bookings')}>Highland Crest Line</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/bookings')}>Historic Central Cities</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/bookings')}>Terminal Connections</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wider mb-3">Fleet &amp; Crew</h4>
              <ul className="space-y-2 text-xs text-[#A8A29E]">
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/fleet')}>Cabin Amenities</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/fleet')}>Safety Telemetry</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/schedule')}>Captain Protocols</li>
                <li className="hover:text-white cursor-pointer" onClick={() => navigate('/schedule')}>Charter Solutions</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase text-white tracking-wider mb-3">Operations</h4>
              <p className="text-xs text-[#A8A29E] mb-2">Headquarters: Dispatch Center West</p>
              <p className="text-xs text-[#A8A29E] mb-3">24/7 Dispatch: 1-800-ROVA-BUS</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-xl text-xs font-bold transition-all"
              >
                Access System HUD &rarr;
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#78716C]">
            <p>&copy; 2026 Rova Expeditions Inc. All rights reserved. Where routes become journeys.</p>
            <p className="font-mono">ALGIONS AI LABS ASSESSMENT</p>
          </div>
        </div>
      </footer>

      {/* PNR Quick Lookup Modal */}
      {showPnrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#E7E2DA] shadow-2xl">
            <h3 className="text-lg font-black text-[#1C1917] mb-1">Instant PNR Verification</h3>
            <p className="text-xs text-[#78716C] mb-4">
              Enter your booking reference to view digital boarding pass or manage cancellation.
            </p>
            <form onSubmit={handlePnrLookup} className="space-y-4">
              <input
                type="text"
                required
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                placeholder="e.g. RV8F92K"
                className="w-full px-4 py-3 bg-[#F3EFEA] border border-[#E7E2DA] rounded-2xl text-sm font-mono font-black text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#B91C1C]"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPnrModal(false)}
                  className="flex-1 py-3 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-[#44403C] font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Verify Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </div>
  );
};

export default LandingPage;
