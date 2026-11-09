import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { format, addDays, subDays } from 'date-fns';

interface HeroSectionProps {
  onSearch: (params: { origin: string; destination: string; date: string; passengers: number }) => void;
  availableCities: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, availableCities }) => {
  const [origin, setOrigin] = useState('Toshkent');
  const [destination, setDestination] = useState('Buxoro');
  const [date, setDate] = useState<Date>(addDays(new Date(), 1));
  const [passengers, setPassengers] = useState(1);
  const [isSwapping, setIsSwapping] = useState(false);

  const navigate = useNavigate();

  const handleSwap = () => {
    setIsSwapping(true);
    setTimeout(() => {
      setOrigin(destination);
      setDestination(origin);
      setIsSwapping(false);
    }, 150);
  };

  const handlePrevDay = () => {
    const prev = subDays(date, 1);
    // Don't allow past dates
    if (prev >= new Date(new Date().setHours(0, 0, 0, 0))) {
      setDate(prev);
    }
  };

  const handleNextDay = () => {
    setDate(addDays(date, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      origin,
      destination,
      date: format(date, 'yyyy-MM-dd'),
      passengers,
    });
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-[#F6FDF9] to-[#F8FAFC] pt-6 pb-16 lg:pt-10 lg:pb-24">
      {/* Decorative background curvy route lines */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
          <path
            d="M-50,380 C300,450 450,200 850,280 C1150,340 1250,120 1480,100"
            stroke="#CBD5E1"
            strokeWidth="3"
            strokeDasharray="6 8"
          />
          <path
            d="M-20,410 C250,470 520,240 900,310 C1200,360 1320,160 1490,140"
            stroke="#BBF7D0"
            strokeWidth="2"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Hero Header and Visual Graphic */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4 pb-10">
          {/* Left Title and Tagline */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand-50 border border-brand-200/60 rounded-full text-brand-700 text-xs font-bold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
              <span>Where routes become journeys</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-900 tracking-tight leading-[1.12]">
              Har kuni O'zbekiston bo'ylab avtobus qatnovi
            </h1>

            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              Find the right connection, choose your seat, and make your next destination closer than ever.
              From first search to final arrival, Rova brings your travel experience together.
            </p>

            {/* Region pill */}
            <div className="pt-2">
              <div className="inline-block px-4 py-2 bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-sm text-xs font-semibold text-slate-700">
                ✨ Biz viloyatlar bo'ylab ommabop qatnovlarni taklif etamiz
              </div>
            </div>
          </div>

          {/* Center Bus Illustration + Route Pin */}
          <div className="lg:col-span-4 relative flex items-center justify-center">
            {/* Animated Pin at the top right of bus path */}
            <div className="absolute -top-6 right-6 flex flex-col items-center animate-bounce">
              <div className="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30 text-white">
                <MapPin className="w-5 h-5 fill-white text-white" />
              </div>
              <div className="w-4 h-1.5 bg-brand-900/10 rounded-full mt-1"></div>
            </div>

            {/* Stylized High-Definition Bus Graphic */}
            <div className="relative group">
              <div className="w-72 sm:w-80 h-48 sm:h-52 relative flex items-center justify-center">
                {/* SVG High-detailed modern white express coach */}
                <svg
                  viewBox="0 0 500 300"
                  className="w-full h-auto drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Bus Body */}
                  <rect x="70" y="70" width="360" height="150" rx="28" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="4" />
                  <path d="M70 140 H430" stroke="#F1F5F9" strokeWidth="2" />
                  {/* Aerodynamic Windshield */}
                  <path d="M360 85 H415 C425 85 430 95 430 110 V145 H360 V85 Z" fill="#334155" />
                  {/* Passenger Windows */}
                  <rect x="95" y="85" width="45" height="55" rx="6" fill="#38BDF8" fillOpacity="0.85" />
                  <rect x="150" y="85" width="45" height="55" rx="6" fill="#38BDF8" fillOpacity="0.85" />
                  <rect x="205" y="85" width="45" height="55" rx="6" fill="#38BDF8" fillOpacity="0.85" />
                  <rect x="260" y="85" width="45" height="55" rx="6" fill="#38BDF8" fillOpacity="0.85" />
                  <rect x="315" y="85" width="35" height="55" rx="6" fill="#38BDF8" fillOpacity="0.85" />
                  {/* Green Brand Stripe matching uploaded reference */}
                  <rect x="70" y="152" width="360" height="10" fill="#00D053" />
                  {/* Headlights */}
                  <ellipse cx="425" cy="185" rx="8" ry="12" fill="#FACC15" />
                  <rect x="390" y="195" width="35" height="6" rx="3" fill="#94A3B8" />
                  {/* Side Mirrors */}
                  <path d="M410 90 L425 80 V98 Z" fill="#1E293B" />
                  <path d="M390 88 L380 78 V95 Z" fill="#1E293B" />
                  {/* Front/Side Wheels */}
                  <circle cx="140" cy="220" r="32" fill="#1E293B" />
                  <circle cx="140" cy="220" r="18" fill="#94A3B8" />
                  <circle cx="140" cy="220" r="7" fill="#F8FAFC" />
                  <circle cx="360" cy="220" r="32" fill="#1E293B" />
                  <circle cx="360" cy="220" r="18" fill="#94A3B8" />
                  <circle cx="360" cy="220" r="7" fill="#F8FAFC" />
                  {/* Ground Shadow */}
                  <ellipse cx="250" cy="255" rx="170" ry="14" fill="#000000" fillOpacity="0.12" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Floating Digital Boarding Pass Ticket Card */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[270px] bg-white rounded-3xl p-5 shadow-ticket border border-slate-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              {/* Notch left & right */}
              <div className="ticket-notch-left"></div>
              <div className="ticket-notch-right"></div>

              {/* Ticket Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800">Ekonom</span>
                <span className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded text-[10px] font-bold">
                  Active Demo
                </span>
              </div>

              <div className="py-2.5">
                <p className="text-[11px] font-bold text-slate-400">6-qator chiptasi</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Yo'lovchi</span>
                    <p className="text-xs font-bold text-slate-800 truncate">Xasanova Go'zal</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Kun</span>
                    <p className="text-xs font-bold text-slate-800">10.25.2026</p>
                  </div>
                </div>

                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Chiptani tanlash</span>
                    <p className="text-xs font-bold text-brand-600">205 997 UZS</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">O'rin</span>
                    <p className="text-xs font-extrabold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded inline-block">
                      16B
                    </p>
                  </div>
                </div>

                {/* Route and time */}
                <div className="mt-3 pt-2 border-t border-dashed border-slate-200">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                    <span>23:30</span>
                    <div className="flex-1 mx-2 border-b-2 border-brand-400 relative">
                      <span className="absolute -top-1.5 right-0 text-[10px] text-brand-500">▶</span>
                    </div>
                    <span>06:25</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>Toshkent</span>
                    <span>Jizzax</span>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-400 mt-0.5">
                    <span>25-Oktyabr</span>
                    <span>26-Oktyabr</span>
                  </div>
                </div>

                {/* Realistic Barcode */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center">
                  <div className="flex items-center gap-[3px] h-9">
                    {[
                      '#10B981', '#1E293B', '#1E293B', '#F59E0B', '#1E293B', '#EC4899', '#1E293B',
                      '#10B981', '#1E293B', '#3B82F6', '#1E293B', '#1E293B', '#10B981', '#1E293B',
                      '#F59E0B', '#1E293B', '#EC4899', '#10B981', '#1E293B', '#3B82F6', '#1E293B'
                    ].map((color, idx) => (
                      <div
                        key={idx}
                        className="w-[3px] rounded-full"
                        style={{
                          height: idx % 3 === 0 ? '100%' : idx % 2 === 0 ? '80%' : '65%',
                          backgroundColor: color,
                        }}
                      ></div>
                    ))}
                  </div>
                  <span className="text-[9px] tracking-[0.2em] font-mono text-slate-400 mt-1">
                    PNR: RV8F92K
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Main Elevated Search Widget (Exact Visual Replica) */}
        <div className="mt-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-floating border border-slate-100 transition-all">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              O'z avtobusingizni toping (Find your journey)
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              {/* Origin (Qayerdan) */}
              <div className="lg:col-span-3 relative">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Qayerdan (From)
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Origin city..."
                    list="origin-cities"
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
                  />
                  <datalist id="origin-cities">
                    {availableCities.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Swap Button */}
              <div className="lg:col-span-1 flex justify-center -my-2 lg:my-0 lg:pt-5">
                <button
                  type="button"
                  onClick={handleSwap}
                  className={`p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-brand-600 shadow-sm transition-transform duration-300 ${
                    isSwapping ? 'rotate-180 scale-110' : ''
                  }`}
                  title="Swap Origin and Destination"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Destination (Qayerga) */}
              <div className="lg:col-span-3 relative">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Qayerga (To)
                </label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Destination city..."
                    list="dest-cities"
                    className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
                  />
                  <datalist id="dest-cities">
                    {availableCities.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Date Selector (Qachon) with Prev/Next Arrow buttons */}
              <div className="lg:col-span-3 relative">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Qachon (Travel Date)
                </label>
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-2 py-1.5 focus-within:bg-white focus-within:border-brand-500 transition-all">
                  <Calendar className="w-4 h-4 text-slate-400 ml-1.5 mr-2 shrink-0" />
                  <input
                    type="date"
                    value={format(date, 'yyyy-MM-dd')}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      if (e.target.value) setDate(new Date(e.target.value));
                    }}
                    className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                  />
                  <div className="flex items-center gap-1 pr-1 shrink-0">
                    <button
                      type="button"
                      onClick={handlePrevDay}
                      className="p-1 hover:bg-slate-200 rounded-md text-slate-500 transition-colors"
                      title="Previous Day"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextDay}
                      className="p-1 hover:bg-slate-200 rounded-md text-slate-500 transition-colors"
                      title="Next Day"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Passenger Count & Search Button */}
              <div className="lg:col-span-2 flex items-center gap-2 lg:pt-5">
                <div className="relative flex-1">
                  <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3">
                    <Users className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(Number(e.target.value))}
                      className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value={1}>1 kishi</option>
                      <option value={2}>2 kishi</option>
                      <option value={3}>3 kishi</option>
                      <option value={4}>4 kishi</option>
                      <option value={5}>5 kishi</option>
                    </select>
                  </div>
                </div>

                {/* Bright Vibrant Green Search Button */}
                <button
                  type="submit"
                  className="flex items-center justify-center w-14 h-12 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white rounded-2xl shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 transition-all shrink-0"
                  title="Search Journeys"
                >
                  <Search className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
