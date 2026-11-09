import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  DollarSign,
  Ticket,
  Bus,
  ShieldCheck,
  Plus,
  Navigation,
  Fuel,
  Thermometer,
  Speedometer,
  Clock,
  ArrowUpRight,
  Download,
  Calendar,
  ChevronRight,
  Radio,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface CoachTelemetry {
  id: string;
  name: string;
  code: string;
  route: string;
  driver: string;
  driverInitials: string;
  seats: string;
  status: 'active' | 'boarding' | 'delayed';
  statusText: string;
  nextStop: string;
  speed: string;
  fuel: string;
  temp: string;
  eta: string;
}

export const OperationsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeRadarTab, setActiveRadarTab] = useState<'all' | 'active' | 'boarding' | 'delayed'>('active');
  const [selectedCoachId, setSelectedCoachId] = useState<string>('PB-9921');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState<string>('ALL');
  const [activeCalendarDate, setActiveCalendarDate] = useState<string>('18');

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    },
  });

  const coaches: CoachTelemetry[] = [
    {
      id: 'PB-9921',
      name: 'StarLiner Punjab Express',
      code: 'PB-9921',
      route: 'Amritsar ──▶ Chandigarh',
      driver: 'Gurpreet Singh • Fleet Captain',
      driverInitials: 'GS',
      seats: '44/48 Seats',
      status: 'active',
      statusText: 'ETA 42m',
      nextStop: 'Jalandhar Bypass Tollway (07:45 AM)',
      speed: '68 km/h',
      fuel: '82%',
      temp: '21°C',
      eta: '42m',
    },
    {
      id: 'PB-1002',
      name: 'Punjab Roadways Volvo 9600',
      code: 'PB-1002',
      route: 'Delhi ──▶ Amritsar',
      driver: 'Balwinder Singh • Senior Captain',
      driverInitials: 'BS',
      seats: 'Full Pack (48)',
      status: 'active',
      statusText: 'On Schedule',
      nextStop: 'Ludhiana Sherpur Chowk (09:15 AM)',
      speed: '74 km/h',
      fuel: '88%',
      temp: '20°C',
      eta: '1h 10m',
    },
    {
      id: 'CH-3091',
      name: 'Northern Shivalik Vista',
      code: 'CH-3091',
      route: 'Chandigarh ──▶ Shimla',
      driver: 'Vikram Sharma • Hill Pilot',
      driverInitials: 'VS',
      seats: '38/48 Seats',
      status: 'delayed',
      statusText: 'Delayed 10m',
      nextStop: 'Solan Mountain Pass (11:20 AM)',
      speed: '45 km/h',
      fuel: '68%',
      temp: '18°C',
      eta: '2h 15m',
    },
    {
      id: 'PB-4412',
      name: 'Golden Temple Airport Liner',
      code: 'PB-4412',
      route: 'Ludhiana ──▶ Delhi IGI Airport',
      driver: 'Jasbir Singh • Airport Lead',
      driverInitials: 'JS',
      seats: '42/48 Seats',
      status: 'boarding',
      statusText: 'Boarding Gate 02',
      nextStop: 'Panipat Expressway (01:30 PM)',
      speed: '0 km/h (Bay)',
      fuel: '95%',
      temp: '21°C',
      eta: 'Departing 15m',
    },
  ];

  const filteredCoaches = coaches.filter((c) => {
    if (activeRadarTab === 'all') return true;
    return c.status === activeRadarTab;
  });

  const activeCoach = coaches.find((c) => c.id === selectedCoachId) || coaches[0];

  // Manifest items with route tags
  const manifestData = [
    {
      id: 1,
      name: 'Harpreet Singh',
      initials: 'HS',
      phone: '+91 98141 23456',
      route: 'Amritsar ──▶ Chandigarh',
      routeCode: 'ASR-IXC',
      service: 'StarLiner • Recliner Scania',
      date: '10 Nov, 2026',
      time: '06:30 AM (Bay 02)',
      seats: ['C1', 'C2'],
      status: 'Completed',
    },
    {
      id: 2,
      name: 'Simran Kaur',
      initials: 'SK',
      phone: '+91 98722 34567',
      route: 'Delhi ──▶ Amritsar',
      routeCode: 'DEL-ASR',
      service: 'Volvo 9600 • Sleeper Cabin',
      date: '10 Nov, 2026',
      time: '09:30 PM (Bay 04)',
      seats: ['B3'],
      status: 'Pending Auth',
    },
    {
      id: 3,
      name: 'Rajesh Verma',
      initials: 'RV',
      phone: '+91 98111 45678',
      route: 'Chandigarh ──▶ Shimla',
      routeCode: 'IXC-SML',
      service: 'Northern Shivalik • Vista',
      date: '10 Nov, 2026',
      time: '07:15 AM (Bay 01)',
      seats: ['D1', 'D2', 'D3'],
      status: 'Completed',
    },
    {
      id: 4,
      name: 'Gurinder Dhillon',
      initials: 'GD',
      phone: '+91 98888 56789',
      route: 'Ludhiana ──▶ Delhi IGI',
      routeCode: 'LDH-DEL',
      service: 'Airport Non-stop Cruiser',
      date: '10 Nov, 2026',
      time: '11:00 AM (Bay 03)',
      seats: ['16B'],
      status: 'Completed',
    },
  ];

  const filteredManifest = manifestData.filter((item) => {
    if (selectedRouteFilter === 'ALL') return true;
    return item.routeCode === selectedRouteFilter;
  });

  // Real CSV export generator
  const handleExportCSV = () => {
    const headers = ['Passenger Name', 'Phone', 'Route Corridor', 'Service', 'Date', 'Time', 'Seats', 'Payment Status'];
    const rows = filteredManifest.map((item) => [
      `"${item.name}"`,
      `"${item.phone}"`,
      `"${item.route}"`,
      `"${item.service}"`,
      `"${item.date}"`,
      `"${item.time}"`,
      `"${item.seats.join(' ')}"`,
      `"${item.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `passenger_manifest_2024-10-${activeCalendarDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto animate-fadeIn text-slate-800 dark:text-slate-100">
      {/* Good Morning, Operations! Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Good Morning, Operations!
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE FEED
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Friday, Oct 18 • 52 active intercity coaches en route • 99.1% on-time transit guarantee.
          </p>
        </div>

        {/* Header Tabs & Add Schedule CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-purple-950/40 p-1 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-transparent dark:border-purple-500/20">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-sidebar-card text-slate-900 dark:text-white shadow-xs"
            >
              Executive Lead
            </button>
            <button
              onClick={() => navigate('/fleet')}
              className="px-3 py-1.5 rounded-xl hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Fleet Dispatch
            </button>
            <button
              onClick={() => navigate('/customers')}
              className="px-3 py-1.5 rounded-xl hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Manifest View
            </button>
          </div>

          <button
            onClick={() => navigate('/schedule')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-2xl text-xs font-black shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Schedule</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Gross Revenue Card (Dark Stone Neutral) */}
        <div className="bg-gradient-to-br from-[#1C1917] to-[#292524] text-white rounded-3xl p-6 shadow-xs border border-[#2E2A27] relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
              GROSS REVENUE (TODAY)
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-stone-300" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tight">₹1,48,250</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-2">
            <span>↑ +12.4%</span>
            <span className="text-[11px] font-normal text-stone-400">vs last Friday</span>
          </div>
        </div>

        {/* Confirmed Tickets Card (Primary Red Gradient #B91C1C to #991B1B) */}
        <div className="bg-gradient-to-br from-[#B91C1C] to-[#991B1B] text-white rounded-3xl p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-100">
              CONFIRMED TICKETS
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tight">4,120</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-bold text-white/90">↑ +5.8%</span>
            <span className="text-[11px] text-white/80 font-medium">94% seat load factor</span>
          </div>
        </div>

        {/* Successful Departures (White / Dark card) */}
        <div className="bg-white dark:bg-[#1A0B2E] rounded-3xl p-6 border border-slate-100 dark:border-purple-950/80 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4 text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              SUCCESSFUL DEPARTURES
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-3xl font-black text-slate-900 dark:text-white">184</p>
            <span className="text-base font-bold text-slate-400">/ 190</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="font-bold text-emerald-600 dark:text-emerald-400">96.8%</span>
            <span className="text-slate-400">• 6 boarding at bay</span>
          </div>
        </div>

        {/* Fleet Telemetry (White / Dark card) */}
        <div className="bg-white dark:bg-[#1A0B2E] rounded-3xl p-6 border border-slate-100 dark:border-purple-950/80 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4 text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              FLEET TELEMETRY
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">98.6%</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">51 of 52 units compliant</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Radar & Manifest, Right Flagship & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Radar + Manifest */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Fleet & Route Radar */}
          <div className="bg-white dark:bg-[#1A0B2E] rounded-3xl p-6 border border-slate-100 dark:border-purple-950/80 shadow-sm space-y-5 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Active Fleet & Route Radar</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Real-time GPS telemetry from StarLiner onboard units
                </p>
              </div>

              {/* Status Filter Counts */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => setActiveRadarTab('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeRadarTab === 'all'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-purple-950/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  120 In service
                </button>
                <button
                  onClick={() => setActiveRadarTab('active')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeRadarTab === 'active'
                      ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200'
                      : 'bg-slate-100 dark:bg-purple-950/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Active ({coaches.filter((c) => c.status === 'active').length})
                </button>
                <button
                  onClick={() => setActiveRadarTab('boarding')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeRadarTab === 'boarding'
                      ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                      : 'bg-slate-100 dark:bg-purple-950/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Boarding (1)
                </button>
                <button
                  onClick={() => setActiveRadarTab('delayed')}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                    activeRadarTab === 'delayed'
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                      : 'bg-slate-100 dark:bg-purple-950/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  Delayed (1)
                </button>
              </div>
            </div>

            {/* Split: Fleet Coach List + Live GPS Active Map Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Coach Cards */}
              <div className="md:col-span-6 space-y-3">
                {filteredCoaches.map((coach) => {
                  const isSelected = coach.id === activeCoach.id;
                  return (
                    <div
                      key={coach.id}
                      onClick={() => setSelectedCoachId(coach.id)}
                      className={`p-4 rounded-2xl transition-all cursor-pointer space-y-2 border ${
                        isSelected
                          ? 'bg-sidebar-bg text-white border-[#B91C1C]/50 shadow-sm'
                          : 'bg-slate-50 dark:bg-purple-950/30 hover:bg-slate-100 dark:hover:bg-purple-950/60 border-slate-200 dark:border-purple-900/40 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                          {coach.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                            coach.code === 'EXP-884'
                              ? 'bg-[#B91C1C] text-white'
                              : 'bg-slate-200 dark:bg-purple-900 text-slate-700 dark:text-slate-200 font-mono'
                          }`}
                        >
                          {coach.code}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 truncate pr-2">
                          <Navigation className="w-3.5 h-3.5 text-[#F87171] shrink-0" />
                          <span className="truncate">{coach.route}</span>
                        </span>
                        <span
                          className={`font-bold shrink-0 ${
                            coach.status === 'delayed'
                              ? 'text-amber-500'
                              : isSelected
                              ? 'text-emerald-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {coach.statusText}
                        </span>
                      </div>
                      <div
                        className={`pt-2 flex items-center justify-between text-[11px] ${
                          isSelected ? 'border-t border-white/10 text-slate-400' : 'border-t border-slate-200 dark:border-purple-900/40 text-slate-500'
                        }`}
                      >
                        <span>{coach.driver}</span>
                        <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                          {coach.seats}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Live GPS Telemetry Card (Right sub-panel matching screenshot) */}
              <div className="md:col-span-6 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 dark:from-purple-950/40 dark:via-purple-950/20 dark:to-sidebar-bg rounded-2xl p-5 border border-slate-200 dark:border-purple-900/40 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-slate-800 dark:text-slate-100">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      LIVE GPS ACTIVE • {activeCoach.speed}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      TELEMETRY SYNC
                    </span>
                  </div>

                  {/* Route stop callout */}
                  <div className="p-4 bg-sidebar-bg text-white rounded-2xl flex items-center gap-3 shadow-sm my-4 border border-sidebar-border">
                    <div className="w-10 h-10 rounded-xl bg-[#B91C1C] flex items-center justify-center text-white shrink-0">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">{activeCoach.name}</p>
                      <p className="text-[11px] text-purple-200">Next: {activeCoach.nextStop}</p>
                    </div>
                  </div>
                </div>

                {/* Telemetry metrics bar */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 dark:border-purple-900/40 text-center text-xs font-bold text-slate-700 dark:text-slate-200">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-[#B91C1C]">⚡</span>
                    <span>{activeCoach.speed}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-emerald-500">⛽</span>
                    <span>{activeCoach.fuel} Fuel</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-blue-500">❄️</span>
                    <span>Cabin {activeCoach.temp}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Booking Manifest Table (Live Feed) */}
          <div className="bg-white dark:bg-[#1A0B2E] rounded-3xl p-6 border border-slate-100 dark:border-purple-950/80 shadow-sm space-y-4 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900 dark:text-white">Recent Booking Manifest</h3>
                  <span className="px-2 py-0.5 rounded-full bg-sidebar-bg text-white text-[9px] font-black uppercase">
                    Live Feed
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Validated customer seat confirmations across active dispatch corridors
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedRouteFilter}
                  onChange={(e) => setSelectedRouteFilter(e.target.value)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-purple-950/60 hover:bg-slate-200 dark:hover:bg-purple-900/60 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors border border-transparent dark:border-purple-500/20 cursor-pointer"
                >
                  <option value="ALL">All Routes</option>
                  <option value="DHK-CTG">Dhaka ──▶ Chattogram</option>
                  <option value="BS-MON">Big Sur ──▶ Monterey</option>
                  <option value="DHK-SYL">Dhaka ──▶ Sylhet</option>
                  <option value="TSH-BX">Toshkent ──▶ Buxoro</option>
                </select>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sidebar-bg hover:bg-sidebar-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  title="Download Manifest as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Manifest Table matching Image 1 */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-purple-900/60 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">PASSENGER DETAILS</th>
                    <th className="py-3 px-3">ROUTE CORRIDOR</th>
                    <th className="py-3 px-3">SCHEDULE & TIME</th>
                    <th className="py-3 px-3">SEAT(S)</th>
                    <th className="py-3 px-3 text-right">PAYMENT STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-purple-900/30">
                  {filteredManifest.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-purple-950/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-orange-100 text-[#B91C1C] font-bold text-xs flex items-center justify-center">
                            {item.initials}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-xs">{item.name}</p>
                            <p className="text-[10px] text-slate-400">{item.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.route}</p>
                        <p className="text-[10px] text-slate-400">{item.service}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{item.date}</p>
                        <p className="text-[10px] text-slate-400">{item.time}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex gap-1 font-mono font-black">
                          {item.seats.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-md text-[11px]"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] ${
                            item.status === 'Completed'
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400'
                              : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          ></span>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Flagship Showcase + Activity Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* FEATURED FLAGSHIP CARD (with coastal bus banner matching screenshot) */}
          <div className="bg-white dark:bg-[#1A0B2E] rounded-3xl p-5 border border-slate-100 dark:border-purple-950/80 shadow-sm space-y-4 transition-colors">
            <span className="inline-block px-3 py-1 bg-slate-100 dark:bg-purple-950/60 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
              FEATURED FLAGSHIP
            </span>

            {/* Scenic Bus Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-sm group">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80"
                alt="Astra Executive Fleet"
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent"></div>

              {/* Over image info */}
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                <div>
                  <h4 className="text-base font-black">Astra Executive Fleet</h4>
                  <p className="text-[11px] text-slate-200">Panoramic Vista • Recliner Bed Pods</p>
                </div>
                <button
                  onClick={() => navigate('/bookings')}
                  className="w-8 h-8 rounded-full bg-[#B91C1C] hover:bg-[#991B1B] text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                  title="Book This Fleet"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 pt-1">
              <span>🛏️ 32 Ultra-Wide Berths</span>
              <span className="text-[#B91C1C] font-black">99.4% User Rating</span>
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="bg-white dark:bg-[#1A0B2E] rounded-3xl p-6 border border-slate-100 dark:border-purple-950/80 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">Activity Timeline</h3>
                <p className="text-xs text-slate-400">October {activeCalendarDate}, 2024 • Scheduled Runs</p>
              </div>
              <button
                onClick={() => navigate('/schedule')}
                className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-purple-950/60 hover:bg-slate-200 dark:hover:bg-purple-900/60 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#F87171]" />
                <span>Plan</span>
              </button>
            </div>

            {/* Days Calendar Strip */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 border-y border-slate-100 dark:border-purple-900/40">
              {[
                { day: 'MON', date: '14' },
                { day: 'TUE', date: '15' },
                { day: 'WED', date: '16' },
                { day: 'THU', date: '17' },
                { day: 'FRI', date: '18' },
                { day: 'SAT', date: '19' },
                { day: 'SUN', date: '20' },
              ].map((d) => (
                <button
                  key={d.day}
                  type="button"
                  onClick={() => setActiveCalendarDate(d.date)}
                  className={`py-2 rounded-xl text-xs flex flex-col items-center transition-all cursor-pointer ${
                    activeCalendarDate === d.date
                      ? 'bg-sidebar-bg dark:bg-[#B91C1C] text-white font-black shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-purple-950/50'
                  }`}
                >
                  <span className="text-[9px] font-semibold">{d.day}</span>
                  <span className="text-xs mt-0.5 font-bold">{d.date}</span>
                </button>
              ))}
            </div>

            {/* Scheduled Transit Run Cards */}
            <div className="space-y-3">
              {/* Next Departure */}
              <div className="p-4 bg-red-50/70 dark:bg-coral-950/20 border border-red-200 dark:border-red-900/40 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#991B1B] dark:text-[#F87171] tracking-wider">
                    NEXT DEPARTURE
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-[#B91C1C] text-white font-black text-[10px]">
                    07:00 AM
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Chattogram Express</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Dhaka Bay 02 ──▶ Dampara Station</p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-red-200/80 dark:border-red-900/40">
                  <span>Coach Plate: DHA-8931</span>
                  <span className="font-bold text-[#991B1B] dark:text-[#F87171]">Boarding in 12m</span>
                </div>
              </div>

              {/* Later Run */}
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 tracking-wider">
                    LATER RUN
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-sidebar-bg text-white font-black text-[10px]">
                    08:30 AM
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Pacific Coastliner Superb</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Terminal 1 ──▶ Monterey Scenic Strip</p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-blue-200/80 dark:border-blue-900/40">
                  <span>Coach Plate: CAL-1940</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Manifest Confirmed</span>
                </div>
              </div>

              {/* Night Transit */}
              <div className="p-4 bg-slate-50 dark:bg-purple-950/30 border border-slate-200 dark:border-purple-900/40 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                    NIGHT TRANSIT
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-purple-900/60 text-slate-700 dark:text-slate-200 font-black text-[10px]">
                    10:15 PM
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Sylhet Star Express</p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">Sayedabad Central ──▶ Sylhet Kadamtail</p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-purple-900/40">
                  <span>Coach Plate: SYL-4412</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">42 Seats Available</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/schedule')}
              className="w-full py-3 bg-sidebar-bg hover:bg-sidebar-hover active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-xs transition-all cursor-pointer"
            >
              + Schedule New Transit Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboard;
