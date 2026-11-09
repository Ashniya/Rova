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

export const OperationsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeRadarTab, setActiveRadarTab] = useState<'all' | 'active' | 'boarding' | 'delayed'>('active');

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    },
  });

  const { data: tripsData } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const res = await api.get('/trips');
      return res.data.data;
    },
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Good Morning, Operations! Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Good Morning, Operations!
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE FEED
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Friday, Oct 18 • 52 active intercity coaches en route • 99.1% on-time transit guarantee.
          </p>
        </div>

        {/* Header Tabs & Add Schedule CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-bold text-slate-600">
            <button className="px-3 py-1.5 rounded-xl bg-white text-slate-900 shadow-xs">
              Executive Lead
            </button>
            <button className="px-3 py-1.5 rounded-xl hover:text-slate-900 transition-colors">
              Fleet Dispatch
            </button>
            <button
              onClick={() => navigate('/customers')}
              className="px-3 py-1.5 rounded-xl hover:text-slate-900 transition-colors"
            >
              Manifest View
            </button>
          </div>

          <button
            onClick={() => navigate('/bookings')}
            className="flex items-center gap-2 px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-2xl text-xs font-black shadow-coral transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ Add Schedule</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards matching Image 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Gross Revenue Card (Dark Purple) */}
        <div className="bg-gradient-to-br from-sidebar-bg to-sidebar-card text-white rounded-3xl p-6 shadow-md border border-sidebar-border relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
              GROSS REVENUE (TODAY)
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-200" />
            </div>
          </div>
          <p className="text-3xl font-black tracking-tight">$48,250</p>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-2">
            <span>↑ +12.4%</span>
            <span className="text-[11px] font-normal text-purple-300">vs last Friday</span>
          </div>
        </div>

        {/* Confirmed Tickets Card (Coral-Orange Gradient) */}
        <div className="bg-gradient-to-br from-coral-500 to-coral-600 text-white rounded-3xl p-6 shadow-coral relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-100">
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

        {/* Successful Departures (White Card) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              SUCCESSFUL DEPARTURES
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-3xl font-black text-slate-900">184</p>
            <span className="text-base font-bold text-slate-400">/ 190</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="font-bold text-emerald-600">96.8%</span>
            <span className="text-slate-400">• 6 boarding at bay</span>
          </div>
        </div>

        {/* Fleet Telemetry (White Card) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              FLEET TELEMETRY
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">98.6%</p>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-500 font-medium">51 of 52 units compliant</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Radar & Manifest, Right Flagship & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Radar + Manifest */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Fleet & Route Radar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Active Fleet & Route Radar</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time GPS telemetry from StarLiner onboard units
                </p>
              </div>

              {/* Status Filter Counts */}
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => setActiveRadarTab('all')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeRadarTab === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  120 In service
                </button>
                <button
                  onClick={() => setActiveRadarTab('active')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeRadarTab === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Active (48)
                </button>
                <button
                  onClick={() => setActiveRadarTab('boarding')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeRadarTab === 'boarding'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Boarding (12)
                </button>
                <button
                  onClick={() => setActiveRadarTab('delayed')}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    activeRadarTab === 'delayed'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Delayed (2)
                </button>
              </div>
            </div>

            {/* Split: Fleet Coach List + Live GPS Active Map Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Coach Cards */}
              <div className="md:col-span-6 space-y-3">
                {/* Active Coach 1 */}
                <div className="p-4 bg-sidebar-bg text-white rounded-2xl shadow-sm space-y-2 border border-sidebar-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">StarLiner Coastliner</span>
                    <span className="px-2 py-0.5 bg-coral-500 text-white rounded-md text-[10px] font-black uppercase">
                      EXP-884
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-coral-400" />
                      <span>Pacific Coast Hwy</span>
                    </span>
                    <span className="text-brand-400 font-bold">ETA 34m</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-white/20 text-white text-[9px] font-bold flex items-center justify-center">
                        AC
                      </span>
                      <span>Arian C. • Lead Driver</span>
                    </span>
                    <span className="text-white font-bold">44/48 Seats</span>
                  </div>
                </div>

                {/* Coach 2 */}
                <div className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Green Line Paribahan</span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">GLP-202</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Dhaka ──▶ Chattogram</span>
                    <span className="text-emerald-600 font-bold text-[11px]">On Schedule</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>MR M. Rahman</span>
                    <span className="font-bold text-slate-700">Full Pack (48)</span>
                  </div>
                </div>

                {/* Coach 3 */}
                <div className="p-4 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200 transition-colors space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900">Hanif Silver Executive</span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">HNF-303</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Dhaka ──▶ Rajshahi</span>
                    <span className="text-amber-600 font-bold text-[11px]">Delayed 10m</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>TL T. Latif</span>
                    <span className="font-bold text-slate-700">38/48 Seats</span>
                  </div>
                </div>
              </div>

              {/* Live GPS Telemetry Card (Right sub-panel matching screenshot) */}
              <div className="md:col-span-6 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-black text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
                      LIVE GPS ACTIVE • 62 MPH
                    </span>
                    <div className="flex gap-1 text-slate-400">
                      <span className="p-1 hover:text-slate-800 cursor-pointer">📍</span>
                      <span className="p-1 hover:text-slate-800 cursor-pointer">📡</span>
                    </div>
                  </div>

                  {/* Route stop callout */}
                  <div className="p-4 bg-sidebar-bg text-white rounded-2xl flex items-center gap-3 shadow-md my-4">
                    <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center text-white shrink-0">
                      <Bus className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white">StarLiner Coastliner</p>
                      <p className="text-[11px] text-purple-200">Next: Big Sur Rest Stop (09:45 AM)</p>
                    </div>
                  </div>
                </div>

                {/* Telemetry metrics bar */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 text-center text-xs font-bold text-slate-700">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-coral-500">⚡</span>
                    <span>Avg 58 mph</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-emerald-500">⛽</span>
                    <span>78% Fuel</span>
                  </div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-blue-500">❄️</span>
                    <span>Cabin 21°C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Booking Manifest Table (Live Feed) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-slate-900">Recent Booking Manifest</h3>
                  <span className="px-2 py-0.5 rounded-full bg-sidebar-bg text-white text-[9px] font-black uppercase">
                    Live Feed
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Validated customer seat confirmations across active dispatch corridors
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors">
                  All Routes
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sidebar-bg hover:bg-sidebar-hover text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
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
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-3">PASSENGER DETAILS</th>
                    <th className="py-3 px-3">ROUTE CORRIDOR</th>
                    <th className="py-3 px-3">SCHEDULE & TIME</th>
                    <th className="py-3 px-3">SEAT(S)</th>
                    <th className="py-3 px-3 text-right">PAYMENT STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Row 1 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-orange-100 text-coral-700 font-bold text-xs flex items-center justify-center">
                          MS
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">Md. Shiraj</p>
                          <p className="text-[10px] text-slate-400">+1 (415) 576-8971</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800">Dhaka ──▶ Chattogram</p>
                      <p className="text-[10px] text-slate-400">Green Line • Semi-Sleeper</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800">18 Oct, 2024</p>
                      <p className="text-[10px] text-slate-400">12:00 PM (Bay 04)</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex gap-1 font-mono font-black">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px]">A1</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px]">A2</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Completed
                      </span>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                          SK
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">Elena Rostova</p>
                          <p className="text-[10px] text-slate-400">+1 (206) 884-2104</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800">Big Sur Coast ──▶ Monterey</p>
                      <p className="text-[10px] text-slate-400">StarLiner Coastliner</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800">18 Oct, 2024</p>
                      <p className="text-[10px] text-slate-400">01:30 PM (Bay 01)</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md text-[11px] font-mono font-black">
                        B3
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Pending Auth
                      </span>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          TR
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">Tariqul Islam</p>
                          <p className="text-[10px] text-slate-400">+880 1711 092834</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800">Dhaka ──▶ Sylhet Highway</p>
                      <p className="text-[10px] text-slate-400">Hanif Enterprise • AC</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="font-bold text-slate-800">18 Oct, 2024</p>
                      <p className="text-[10px] text-slate-400">03:45 PM (Bay 08)</p>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex gap-1 font-mono font-black">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px]">D1</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px]">D2</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px]">D3</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full font-bold text-[10px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Completed
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Flagship Showcase + Activity Timeline */}
        <div className="lg:col-span-4 space-y-6">
          {/* FEATURED FLAGSHIP CARD (with coastal bus banner matching screenshot) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
            <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-wider text-slate-600">
              FEATURED FLAGSHIP
            </span>

            {/* Scenic Bus Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-md group">
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
                  className="w-8 h-8 rounded-full bg-coral-500 hover:bg-coral-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                  title="Book This Fleet"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-1">
              <span>🛏️ 32 Ultra-Wide Berths</span>
              <span className="text-coral-500 font-black">99.4% User Rating</span>
            </div>
          </div>

          {/* Activity Timeline Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">Activity Timeline</h3>
                <p className="text-xs text-slate-400">October 18, 2024 • Scheduled Runs</p>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors">
                <Calendar className="w-3.5 h-3.5" />
                <span>Plan</span>
              </button>
            </div>

            {/* Days Calendar Strip */}
            <div className="grid grid-cols-7 gap-1 text-center py-2 border-y border-slate-100">
              {[
                { day: 'MON', date: '14' },
                { day: 'TUE', date: '15' },
                { day: 'WED', date: '16' },
                { day: 'THU', date: '17' },
                { day: 'FRI', date: '18', active: true },
                { day: 'SAT', date: '19' },
                { day: 'SUN', date: '20' },
              ].map((d) => (
                <div
                  key={d.day}
                  className={`py-2 rounded-xl text-xs flex flex-col items-center ${
                    d.active ? 'bg-sidebar-bg text-white font-black shadow-sm' : 'text-slate-500'
                  }`}
                >
                  <span className="text-[9px] font-semibold">{d.day}</span>
                  <span className="text-xs mt-0.5 font-bold">{d.date}</span>
                </div>
              ))}
            </div>

            {/* Scheduled Transit Run Cards */}
            <div className="space-y-3">
              {/* Next Departure */}
              <div className="p-4 bg-coral-50/70 border border-coral-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-coral-600 tracking-wider">
                    NEXT DEPARTURE
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-coral-500 text-white font-black text-[10px]">
                    07:00 AM
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900">Chattogram Express</p>
                <p className="text-[11px] text-slate-600">Dhaka Bay 02 ──▶ Dampara Station</p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-coral-200/80">
                  <span>Coach Plate: DHA-8931</span>
                  <span className="font-bold text-coral-600">Boarding in 12m</span>
                </div>
              </div>

              {/* Later Run */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-blue-700 tracking-wider">
                    LATER RUN
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-sidebar-bg text-white font-black text-[10px]">
                    08:30 AM
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900">Pacific Coastliner Superb</p>
                <p className="text-[11px] text-slate-600">Terminal 1 ──▶ Monterey Scenic Strip</p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-blue-200/80">
                  <span>Coach Plate: CAL-1940</span>
                  <span className="font-bold text-emerald-600">Manifest Confirmed</span>
                </div>
              </div>

              {/* Night Transit */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    NIGHT TRANSIT
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-black text-[10px]">
                    10:15 PM
                  </span>
                </div>
                <p className="text-xs font-black text-slate-900">Sylhet Star Express</p>
                <p className="text-[11px] text-slate-600">Sayedabad Central ──▶ Sylhet Kadamtail</p>
                <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-200">
                  <span>Coach Plate: SYL-4412</span>
                  <span className="font-bold text-slate-700">42 Seats Available</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/bookings')}
              className="w-full py-3 bg-sidebar-bg hover:bg-sidebar-hover active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-sm transition-all"
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
