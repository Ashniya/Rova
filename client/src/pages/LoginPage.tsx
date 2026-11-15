import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User as UserIcon,
  Bus,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Tag,
  Star,
  Smile,
  Compass,
  Headphones,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRoleParam = searchParams.get('role');

  const [role, setRole] = useState<'PASSENGER' | 'DRIVER' | 'ADMIN'>(() => {
    if (initialRoleParam === 'driver') return 'DRIVER';
    if (initialRoleParam === 'admin') return 'ADMIN';
    return 'PASSENGER';
  });

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('gozal@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  // Auto-fill credentials based on selected role for easy testing across devices
  useEffect(() => {
    setError(null);
    if (role === 'PASSENGER') {
      setEmail('gozal@example.com');
      setPassword('password123');
    } else if (role === 'DRIVER') {
      setEmail('operator@silkroad.com');
      setPassword('operator123');
    } else if (role === 'ADMIN') {
      setEmail('admin@rova.com');
      setPassword('admin123');
    }
  }, [role]);

  const handleRoleChange = (newRole: 'PASSENGER' | 'DRIVER' | 'ADMIN') => {
    setRole(newRole);
    setMode('login');
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        const backendRole = role === 'PASSENGER' ? 'PASSENGER' : role === 'DRIVER' ? 'OPERATOR' : 'ADMIN';
        await register(name || (role === 'DRIVER' ? 'Captain Singh' : 'Traveler'), email, password, backendRole);
      }

      // Route directly to the corresponding dashboard after successful login (not intro/loading page)
      if (role === 'PASSENGER') navigate('/passenger');
      else if (role === 'DRIVER') navigate('/driver');
      else navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your email and passcode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F7] text-[#1C1917] flex flex-col justify-between selection:bg-[#B91C1C] selection:text-white animate-fadeIn font-sans">
      {/* 1. TOP BRAND HEADER matching Image 2 */}
      <header className="px-6 sm:px-12 py-5 flex items-center justify-between border-b border-[#E7E2DA]/50 bg-white/70 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-[#B91C1C] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Bus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-tight text-[#1C1917] block leading-none">
              ROVA
            </span>
            <span className="text-[10px] font-black tracking-widest text-[#B91C1C] uppercase block mt-1">
              EXPEDITIONS &amp; FLEET
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#F3EFEA] px-3.5 py-1.5 rounded-full border border-[#E7E2DA] text-xs font-bold text-stone-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Fleet Status: <strong className="text-stone-900">99.8% On-Time</strong></span>
          </div>
          <button
            type="button"
            onClick={() => alert('Station Support Line: +91 1800-ROVA-BUS (Toll-Free, 24x7 Operations Dispatch)')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E2DA] hover:bg-stone-50 text-xs font-bold text-stone-700 transition shadow-xs cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-[#B91C1C]" />
            <span>Station Support</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN SPLIT LOGIN SECTION matching Image 2 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          {/* LEFT: AUTH FORM CARD */}
          <div className="lg:col-span-7 bg-white rounded-[32px] p-6 sm:p-10 border border-[#E7E2DA] shadow-xl space-y-6">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FEF2F2] border border-[#FECACA] rounded-full text-[#B91C1C] text-[10px] font-black uppercase tracking-wider mb-3">
                <Lock className="w-3 h-3" />
                <span>UNIVERSAL TRANSIT ACCESS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-[#1C1917] tracking-tight">
                Where routes become journeys.
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 font-medium mt-1.5">
                Select your corridor clearance role to access tickets, route schedules, or fleet telemetry dashboards.
              </p>
            </div>

            {/* 3 ROLE SELECTOR PILLS matching Image 2 */}
            <div className="grid grid-cols-3 gap-2 bg-[#F3EFEA] p-1.5 rounded-2xl border border-[#E7E2DA]">
              <button
                type="button"
                onClick={() => handleRoleChange('PASSENGER')}
                className={`py-3 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'PASSENGER'
                    ? 'bg-[#B91C1C] text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>👤</span>
                <span>Passenger</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('DRIVER')}
                className={`py-3 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'DRIVER'
                    ? 'bg-[#B91C1C] text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🚌</span>
                <span>Drivers Hub</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange('ADMIN')}
                className={`py-3 px-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  role === 'ADMIN'
                    ? 'bg-[#B91C1C] text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🛡️</span>
                <span>Fleet Admin</span>
              </button>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-200">
                  {error}
                </div>
              )}

              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Gurpreet Singh"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#F3EFEA] border border-[#E7E2DA] rounded-2xl text-xs font-bold text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#B91C1C]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {role === 'PASSENGER'
                    ? 'Passenger PNR Code or Registered Email'
                    : role === 'DRIVER'
                    ? 'Driver Dispatch License or Mail ID'
                    : 'Admin System Clearance Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. ROV-7849X or user@voyage.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#F3EFEA] border border-[#E7E2DA] rounded-2xl text-xs font-bold text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    {role === 'PASSENGER' ? 'Voyager Password or Mobile OTP' : 'Security Passcode'}
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Demo passcode auto-filled for rapid evaluation.')}
                    className="text-[11px] font-bold text-[#B91C1C] hover:underline cursor-pointer"
                  >
                    Forgot passcode?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure credentials"
                    className="w-full pl-10 pr-4 py-3 bg-[#F3EFEA] border border-[#E7E2DA] rounded-2xl text-xs font-bold text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              {/* Keep me logged in */}
              <div className="flex items-center justify-between text-xs text-stone-600 font-semibold pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#B91C1C] rounded border-stone-300 focus:ring-[#B91C1C] cursor-pointer"
                  />
                  <span>Keep me logged in on this terminal</span>
                </label>
                <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Realtime boarding ready
                </span>
              </div>

              {/* Large Crimson Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>
                  {loading
                    ? 'Verifying Authorization...'
                    : role === 'PASSENGER'
                    ? 'Access Booking & Digital QR ➔'
                    : role === 'DRIVER'
                    ? 'Enter Drivers Hub ➔'
                    : 'Access Platform Admin Console ➔'}
                </span>
              </button>

              {/* Toggle Register / Login */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError(null);
                  }}
                  className="text-xs font-bold text-stone-600 hover:text-[#B91C1C] cursor-pointer"
                >
                  {mode === 'login'
                    ? role === 'PASSENGER'
                      ? "New traveler? Create Passenger Account"
                      : role === 'DRIVER'
                      ? "New driver? Register Driver License"
                      : "New administrator? Register Platform Admin"
                    : 'Already registered? Switch to Sign In'}
                </button>
              </div>

              {/* OR EXPRESS ACCESS Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E7E2DA]"></div>
                </div>
                <span className="relative px-3 bg-white text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                  OR EXPRESS ACCESS
                </span>
              </div>

              {/* Express Access Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    navigate('/passenger');
                  }}
                  className="py-3 px-3 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-stone-700 text-xs font-bold rounded-2xl border border-[#E7E2DA] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#B91C1C]" />
                  <span>Lookup by PNR</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Luggage barcode scanner ready at Amritsar & Chandigarh terminals.');
                  }}
                  className="py-3 px-3 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-stone-700 text-xs font-bold rounded-2xl border border-[#E7E2DA] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5 text-[#B91C1C]" />
                  <span>Scan Luggage Tag</span>
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-[11px] text-stone-400">
                <span>Need booking assistance? Call <strong>+41 22 819 0040</strong></span>
                <span className="space-x-2">
                  <span className="hover:underline cursor-pointer">Terms of Carriage</span>
                  <span>•</span>
                  <span className="hover:underline cursor-pointer">Privacy Policy</span>
                </span>
              </div>
            </form>
          </div>

          {/* RIGHT: SCENIC CARD matching Image 2 */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[36px] overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-stone-900 group">
              <img
                src="/images/coach-interior.jpg"
                alt="Elena Lindqvist in Rova Panoramic Coach"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Subtle Dark Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40"></div>

              {/* Top User Pill Badge */}
              <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md">
                  <div className="w-6 h-6 rounded-full bg-[#B91C1C] text-white flex items-center justify-center text-[10px] font-black">
                    EL
                  </div>
                  <div className="text-left">
                    <span className="text-[11px] font-black text-stone-900 block leading-tight">
                      Elena Lindqvist
                    </span>
                    <span className="text-[9px] font-bold text-amber-600 flex items-center gap-0.5 leading-none">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> 4.9 (Executive Cabin)
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-bold border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-[9px] font-black tracking-wider uppercase">CORRIDOR LIVE</span>
                  <span className="hidden sm:inline text-white/80 text-[9px]">Alpine Glacier Express</span>
                </div>
              </div>

              {/* Bottom Floating Quote Card matching Image 2 */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-xl space-y-2 border border-white">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-[#B91C1C] uppercase font-mono tracking-wider">
                    PANORAMA LOUNGE SEAT #14A
                  </span>
                  <span className="text-stone-500">WiFi 6 &amp; Espresso Bar</span>
                </div>
                <p className="text-xs text-stone-700 italic leading-snug font-medium">
                  "Gliding across the Bernina Pass with steaming coffee and heated leather recliners transformed coach travel into pure serenity."
                </p>
                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                  <span className="font-semibold text-stone-800">St. Moritz ──▶ Lugano</span>
                  <span className="font-bold text-[#B91C1C]">188 km scenic line</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. CRIMSON PROMISE PILL BAR matching Image 2 */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 my-6">
        <div className="bg-[#991B1B] text-white rounded-3xl sm:rounded-full py-4 px-6 sm:px-10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Smile className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight">Happy Voyagers</div>
              <div className="text-xs text-red-100 font-medium">98.4% five-star satisfaction ratings</div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-white/20"></div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight">Curated Corridors</div>
              <div className="text-xs text-red-100 font-medium">Scenic panoramic valley &amp; coastal lines</div>
            </div>
          </div>

          <div className="hidden sm:block h-8 w-px bg-white/20"></div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight">Transparent Fares</div>
              <div className="text-xs text-red-100 font-medium">Zero booking commissions or bag fees</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. UNDERNEATH STATS BAR matching Image 2 */}
      <footer className="border-t border-[#E7E2DA] bg-white/80 py-5 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#1C1917] block">450+</span>
            <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Daily departures</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#1C1917] block">2.4M</span>
            <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Km covered annually</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#1C1917] block">100%</span>
            <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">GPS-monitored fleet</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#1C1917] block">&lt;3m</span>
            <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider">Average boarding speed</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
