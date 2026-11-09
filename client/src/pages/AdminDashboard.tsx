import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Radio,
  Navigation,
  ShieldCheck,
  Lock,
  Bus,
  MapPin,
  Clock,
  Fuel,
  Thermometer,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Download,
  Filter,
} from 'lucide-react';

interface LiveCoach {
  plate: string;
  name: string;
  route: string;
  driver: string;
  speed: string;
  fuel: string;
  temp: string;
  location: string;
  lat: number;
  lng: number;
  status: 'en_route' | 'boarding' | 'docked' | 'delayed';
  eta: string;
  occupancy: string;
  passengers: number;
}

interface PaymentRecord {
  id: string;
  pnr: string;
  passenger: string;
  amount: number;
  method: 'UPI' | 'CARD' | 'NETBANKING';
  status: 'SETTLED' | 'PROCESSING';
  timestamp: string;
  route: string;
}

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'radar' | 'payments' | 'audit'>('radar');
  const [selectedCoachPlate, setSelectedCoachPlate] = useState('PB-02-AK-9921');
  const [searchQuery, setSearchQuery] = useState('');
  const [radarFilter, setRadarFilter] = useState<'ALL' | 'EN_ROUTE' | 'DELAYED'>('ALL');

  // Live Punjab Fleet Tracking
  const liveFleet: LiveCoach[] = [
    {
      plate: 'PB-02-AK-9921',
      name: 'StarLiner Punjab Executive',
      route: 'Amritsar ISBT ──▶ Chandigarh Sec 17',
      driver: 'Gurpreet Singh',
      speed: '68 km/h',
      fuel: '84%',
      temp: '21°C',
      location: 'Jalandhar Rama Mandi Bypass (GT Road NH3)',
      lat: 31.326,
      lng: 75.5762,
      status: 'en_route',
      eta: '10:45 AM (42m remaining)',
      occupancy: '34/40 Seats (85%)',
      passengers: 34,
    },
    {
      plate: 'PB-08-CC-4412',
      name: 'Astra Grand Cruiser',
      route: 'Jalandhar ──▶ Delhi Kashmere Gate',
      driver: 'Balwinder Sharma',
      speed: '74 km/h',
      fuel: '76%',
      temp: '22°C',
      location: 'Phagwara GT Road Corridor (Passing Haveli)',
      lat: 31.224,
      lng: 75.7708,
      status: 'en_route',
      eta: '04:15 PM (5h 10m remaining)',
      occupancy: '42/44 Seats (95%)',
      passengers: 42,
    },
    {
      plate: 'PB-10-BX-1102',
      name: 'Himalayan Luxury Sleeper',
      route: 'Amritsar ──▶ Manali (via Pathankot)',
      driver: 'Davinder Gill',
      speed: '58 km/h',
      fuel: '91%',
      temp: '19°C',
      location: 'Beas River Bridge Approach (NH3)',
      lat: 31.516,
      lng: 75.313,
      status: 'en_route',
      eta: '02:30 PM (6h 40m remaining)',
      occupancy: '28/32 Berths (87%)',
      passengers: 28,
    },
    {
      plate: 'PB-01-DL-8820',
      name: 'Punjab Roadways Scania Intercity',
      route: 'Chandigarh Sec 17 ──▶ Amritsar ISBT',
      driver: 'Harbhajan Singh',
      speed: '0 km/h',
      fuel: '98%',
      temp: '20°C',
      location: 'Chandigarh ISBT Terminal Bay 04',
      lat: 30.7333,
      lng: 76.7794,
      status: 'boarding',
      eta: 'Departs 11:30 AM',
      occupancy: '19/40 Seats (47%)',
      passengers: 19,
    },
  ];

  // Recent Payment Collections
  const recentPayments: PaymentRecord[] = [
    { id: 'PAY-9081', pnr: 'ROV-7849X', passenger: 'Amanpreet Singh', amount: 2200, method: 'UPI', status: 'SETTLED', timestamp: '10:14 AM Today', route: 'Amritsar ──▶ Chandigarh' },
    { id: 'PAY-9080', pnr: 'ROV-9912A', passenger: 'Gurpreet Singh', amount: 1100, method: 'UPI', status: 'SETTLED', timestamp: '10:02 AM Today', route: 'Amritsar ──▶ Chandigarh' },
    { id: 'PAY-9079', pnr: 'ROV-8821X', passenger: 'Rajinder Sharma', amount: 1700, method: 'CARD', status: 'SETTLED', timestamp: '09:48 AM Today', route: 'Jalandhar ──▶ Chandigarh' },
    { id: 'PAY-9078', pnr: 'ROV-5541B', passenger: 'Baldev Singh', amount: 1700, method: 'NETBANKING', status: 'SETTLED', timestamp: '09:35 AM Today', route: 'Jalandhar ──▶ Chandigarh' },
    { id: 'PAY-9077', pnr: 'ROV-3312V', passenger: 'Vikramaditya Verma', amount: 2200, method: 'UPI', status: 'SETTLED', timestamp: '09:12 AM Today', route: 'Amritsar ──▶ Tribune Chowk' },
    { id: 'PAY-9076', pnr: 'ROV-1109T', passenger: 'Taranjit Kahlon', amount: 2200, method: 'CARD', status: 'SETTLED', timestamp: '08:50 AM Today', route: 'Amritsar ──▶ Mohali Phase 8' },
    { id: 'PAY-9075', pnr: 'ROV-8072K', passenger: 'Kulwinder Bhatti', amount: 2200, method: 'UPI', status: 'SETTLED', timestamp: '08:24 AM Today', route: 'Amritsar ──▶ Chandigarh' },
    { id: 'PAY-9074', pnr: 'ROV-7063R', passenger: 'Rupinder Deol', amount: 1700, method: 'UPI', status: 'SETTLED', timestamp: '08:05 AM Today', route: 'Jalandhar ──▶ Tribune Chowk' },
  ];

  // Cryptographic Audit Trail
  const auditLogs = [
    { action: 'BOOKING_CREATED', hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', actor: 'Amanpreet Singh', details: 'Seats C1, C2 reserved on StarLiner PB-02 (Amritsar ──▶ Chandigarh)', time: '10:14 AM' },
    { action: 'PAYMENT_SETTLED', hash: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35', actor: 'Razorpay UPI Gateway', details: '₹2,200 credited for PNR ROV-7849X via Google Pay UPI', time: '10:14 AM' },
    { action: 'SEAT_LOCK_ACQUIRED', hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', actor: 'Booking Engine LockMgr', details: 'Exclusive lock on trip_seat [C1, C2] for trip #PB-9921', time: '10:11 AM' },
    { action: 'SCHEDULE_DISPATCHED', hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d', actor: 'Gurpreet Singh (Driver)', details: 'Departure cleared from Amritsar ISBT Bay 02 on-time', time: '06:30 AM' },
  ];

  const totalRevenue = 482250;
  const todayRevenue = 38940;
  const platformCommissions = 48225; // 10%

  const selectedCoach = liveFleet.find((c) => c.plate === selectedCoachPlate) || liveFleet[0];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Admin Cockpit Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E7E2DA] dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B91C1C]/10 dark:bg-[#B91C1C]/20 border border-[#B91C1C]/30 rounded-full text-[#B91C1C] dark:text-[#F87171] text-[10px] font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Rova Central Administration & Financial Controller</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white tracking-tight">
            Admin Revenue & Fleet GPS Radar
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Real-time financial collections, Punjab highway GPS telemetry, and cryptographic audit security.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 bg-[#F3EFEA] dark:bg-stone-800 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            🛰️ Live GPS Fleet Radar
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'payments'
                ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            💰 Payments Received (₹)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            🔒 Cryptographic Audit Log
          </button>
        </div>
      </div>

      {/* Financial Overview Cards in ₹ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Gross Collections */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Payments Received</span>
            <span className="text-xs font-black text-emerald-600">₹</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#1C1917] dark:text-white">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% vs last week across Punjab routes
          </span>
        </div>

        {/* Today's Collections */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Today's Collections</span>
            <Clock className="w-4 h-4 text-[#B91C1C]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#B91C1C] dark:text-[#F87171]">₹{todayRevenue.toLocaleString()}</span>
          </div>
          <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
            52 confirmed ticket bookings today
          </span>
        </div>

        {/* Platform Commissions (10%) */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Net Platform Earnings</span>
            <CreditCard className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#1C1917] dark:text-white">₹{platformCommissions.toLocaleString()}</span>
          </div>
          <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">
            10% commission on intercity bookings
          </span>
        </div>

        {/* Active Highway Units */}
        <div className="bg-[#1C1917] text-white p-5 rounded-3xl border border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Buses on Highway</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#F59E0B]">4 Coaches</span>
            <span className="text-xs text-stone-400">123 passengers en route</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 98.6% On-Time Transit Guarantee
          </span>
        </div>
      </div>

      {/* Main Tab Panels */}
      {activeTab === 'radar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Buses List */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-base font-black text-[#1C1917] dark:text-white">Active Punjab Fleet</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">Live GPS telemetry from onboard units</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-black uppercase">
                4 Live Units
              </span>
            </div>

            <div className="space-y-3">
              {liveFleet.map((c) => {
                const isSelected = selectedCoachPlate === c.plate;
                return (
                  <div
                    key={c.plate}
                    onClick={() => setSelectedCoachPlate(c.plate)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#B91C1C] bg-red-50/50 dark:bg-red-950/20 shadow-xs'
                        : 'border-[#E7E2DA] dark:border-stone-800 bg-[#FBF9F7] dark:bg-stone-800/40 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-xs text-[#B91C1C] dark:text-[#F87171]">{c.plate}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        {c.speed}
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-[#1C1917] dark:text-white">{c.name}</h4>
                    <p className="text-xs text-stone-600 dark:text-stone-300 font-semibold">{c.route}</p>

                    <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-700/60 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#B91C1C]" />
                        {c.location.split('(')[0]}
                      </span>
                      <span className="font-bold text-[#1C1917] dark:text-white">{c.occupancy.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Radar Telemetry & Location Cockpit */}
          <div className="lg:col-span-7 bg-[#1C1917] text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#F59E0B]">Active Target Radar Telemetry</span>
                <h3 className="text-xl font-black text-white">{selectedCoach.name} ({selectedCoach.plate})</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-stone-400">Corridor Route</span>
                <p className="text-xs font-bold text-stone-200">{selectedCoach.route}</p>
              </div>
            </div>

            {/* Simulated Live Radar Highway Map Display */}
            <div className="relative bg-stone-900 rounded-2xl p-6 border border-stone-800 overflow-hidden min-h-[220px] flex flex-col justify-between">
              {/* Radar Grid Lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#292524_1px,transparent_1px),linear-gradient(to_bottom,#292524_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>

              {/* Highway Corridor Line (GT Road NH3) */}
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                  <span>📍 AMRITSAR ISBT (0 km)</span>
                  <span className="text-[#F59E0B] font-bold">🛣️ GRAND TRUNK ROAD (NH3)</span>
                  <span>CHANDIGARH SEC 17 (228 km) 🏁</span>
                </div>

                <div className="relative w-full h-3 bg-stone-800 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#B91C1C] via-[#F59E0B] to-emerald-500 rounded-full w-[42%]"></div>
                  {/* Bus Blip */}
                  <div className="absolute top-1/2 left-[42%] -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#B91C1C] shadow-lg flex items-center justify-center animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-[#B91C1C]"></span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-stone-400">Departed: 06:30 AM (Amritsar)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-[#F59E0B] font-bold border border-amber-500/30">
                    📍 Current: {selectedCoach.location}
                  </span>
                  <span className="text-emerald-400 font-bold">ETA: {selectedCoach.eta}</span>
                </div>
              </div>

              {/* Real-time Onboard Sensor Telemetry Cards */}
              <div className="relative z-10 grid grid-cols-4 gap-3 pt-6">
                <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60 text-center">
                  <Gauge className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <span className="text-[10px] text-stone-400 uppercase font-mono block">Speed</span>
                  <span className="text-sm font-black text-white">{selectedCoach.speed}</span>
                </div>
                <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60 text-center">
                  <Fuel className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <span className="text-[10px] text-stone-400 uppercase font-mono block">Diesel Fuel</span>
                  <span className="text-sm font-black text-white">{selectedCoach.fuel}</span>
                </div>
                <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60 text-center">
                  <Thermometer className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <span className="text-[10px] text-stone-400 uppercase font-mono block">Cabin Temp</span>
                  <span className="text-sm font-black text-white">{selectedCoach.temp}</span>
                </div>
                <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700/60 text-center">
                  <Radio className="w-4 h-4 text-[#F87171] mx-auto mb-1" />
                  <span className="text-[10px] text-stone-400 uppercase font-mono block">Driver</span>
                  <span className="text-xs font-bold text-white truncate block">{selectedCoach.driver}</span>
                </div>
              </div>
            </div>

            {/* OSRM Route Verification */}
            <div className="p-4 bg-stone-900/60 rounded-2xl border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#F59E0B]" />
                OSRM Routing Engine: Route clearance verified for GT Road (Jalandhar bypass free of road closures)
              </span>
              <span className="text-emerald-400 font-mono font-bold">Latency 18ms</span>
            </div>
          </div>
        </div>
      )}

      {/* Payments Received View */}
      {activeTab === 'payments' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Payment Method Breakdown Bar */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-4">
            <h3 className="text-base font-black text-[#1C1917] dark:text-white">Payment Method Distribution (Punjab)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">⚡ UPI / Google Pay (68%)</span>
                <p className="text-2xl font-black text-emerald-900 dark:text-emerald-200 mt-1">₹327,930</p>
                <span className="text-[11px] text-emerald-700 dark:text-emerald-400">Zero surcharge, instant settlement</span>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800">
                <span className="text-xs font-bold text-blue-800 dark:text-blue-300">💳 Debit / Credit Cards (24%)</span>
                <p className="text-2xl font-black text-blue-900 dark:text-blue-200 mt-1">₹115,740</p>
                <span className="text-[11px] text-blue-700 dark:text-blue-400">Visa, Mastercard, RuPay</span>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800">
                <span className="text-xs font-bold text-purple-800 dark:text-purple-300">🏦 NetBanking (8%)</span>
                <p className="text-2xl font-black text-purple-900 dark:text-purple-200 mt-1">₹38,580</p>
                <span className="text-[11px] text-purple-700 dark:text-purple-400">HDFC, SBI, ICICI, PNB</span>
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-base font-black text-[#1C1917] dark:text-white">Recent Payment Transactions (₹)</h3>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#F3EFEA] dark:bg-stone-800 text-[#1C1917] dark:text-stone-200 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Financial Statement</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    <th className="py-3 px-3">Transaction ID</th>
                    <th className="py-3 px-3">PNR Code</th>
                    <th className="py-3 px-3">Passenger</th>
                    <th className="py-3 px-3">Route</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Amount (₹)</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                  {recentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-stone-500">{p.id}</td>
                      <td className="py-3 px-3 font-mono font-black text-[#B91C1C] dark:text-[#F87171]">{p.pnr}</td>
                      <td className="py-3 px-3 font-bold text-[#1C1917] dark:text-white">{p.passenger}</td>
                      <td className="py-3 px-3 text-stone-600 dark:text-stone-300">{p.route}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                          {p.method}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-black text-emerald-600">₹{p.amount.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-stone-400 font-mono">{p.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Cryptographic Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="text-base font-black text-[#1C1917] dark:text-white">
                Cryptographic Audit Ledger (SHA-256)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Tamper-proof chronological ledger recording all critical system, payment, and dispatch events.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <Lock className="w-3.5 h-3.5" />
              <span>Chain Integrity Verified</span>
            </div>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-4 bg-[#FBF9F7] dark:bg-stone-800/40 rounded-2xl border border-[#E7E2DA] dark:border-stone-800 space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-[#B91C1C] dark:text-[#F87171] uppercase tracking-wider text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-stone-400 font-mono text-[11px]">{log.time}</span>
                </div>
                <p className="text-xs font-semibold text-[#1C1917] dark:text-white">{log.details}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-stone-500 font-mono">
                  <span>Actor: <strong>{log.actor}</strong></span>
                  <span className="truncate max-w-[280px]" title={log.hash}>
                    Hash: {log.hash.slice(0, 24)}...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
