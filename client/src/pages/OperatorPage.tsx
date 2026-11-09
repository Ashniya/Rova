import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ManifestItem } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { format } from 'date-fns';
import {
  Bus,
  Calendar,
  Users,
  DollarSign,
  Plus,
  ShieldCheck,
  AlertTriangle,
  Printer,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const OperatorPage: React.FC = () => {
  const { user, isOperator } = useAuth();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'overview' | 'manifest' | 'trips' | 'fleet' | 'routes'>('overview');
  const [selectedTripForManifest, setSelectedTripForManifest] = useState<string>('');

  // Forms State
  const [newBusModalOpen, setNewBusModalOpen] = useState(false);
  const [newTripModalOpen, setNewTripModalOpen] = useState(false);
  const [disruptionModalTripId, setDisruptionModalTripId] = useState<string | null>(null);

  // New Bus form
  const [busReg, setBusReg] = useState('');
  const [busName, setBusName] = useState('');
  const [busType, setBusType] = useState('LUXURY_VOLVO');
  const [busLayout, setBusLayout] = useState('2x2');
  const [busSeats, setBusSeats] = useState(40);

  // New Trip form
  const [tripBusId, setTripBusId] = useState('');
  const [tripRouteId, setTripRouteId] = useState('');
  const [tripDep, setTripDep] = useState('');
  const [tripArr, setTripArr] = useState('');
  const [tripFare, setTripFare] = useState(200000);

  // Disruption form
  const [disruptionType, setDisruptionType] = useState<'DELAY' | 'CANCELLATION'>('DELAY');
  const [disruptionReason, setDisruptionReason] = useState('Technical highway maintenance');

  // Queries
  const { data: overviewData } = useQuery({
    queryKey: ['operator-overview'],
    queryFn: async () => {
      const res = await api.get('/operator/overview');
      return res.data.data;
    },
  });

  const { data: analyticsData } = useQuery({
    queryKey: ['operator-analytics'],
    queryFn: async () => {
      const res = await api.get('/operator/analytics');
      return res.data.data;
    },
  });

  const { data: tripsData, refetch: refetchTrips } = useQuery({
    queryKey: ['operator-trips'],
    queryFn: async () => {
      const res = await api.get('/operator/trips');
      return res.data.data;
    },
  });

  const { data: busesData, refetch: refetchBuses } = useQuery({
    queryKey: ['operator-buses'],
    queryFn: async () => {
      const res = await api.get('/operator/buses');
      return res.data.data;
    },
  });

  const { data: routesData } = useQuery({
    queryKey: ['operator-routes'],
    queryFn: async () => {
      const res = await api.get('/operator/routes');
      return res.data.data;
    },
  });

  // Query manifest when trip is selected
  const activeManifestTripId = selectedTripForManifest || (tripsData && tripsData[0]?.id) || '';
  const { data: manifestData, isLoading: manifestLoading } = useQuery({
    queryKey: ['manifest', activeManifestTripId],
    queryFn: async () => {
      if (!activeManifestTripId) return null;
      const res = await api.get(`/operator/manifest/${activeManifestTripId}`);
      return res.data.data;
    },
    enabled: !!activeManifestTripId,
  });

  // Mutations
  const createBusMutation = useMutation({
    mutationFn: async () => {
      await api.post('/operator/buses', {
        registrationNumber: busReg,
        name: busName,
        busType,
        layoutType: busLayout,
        totalSeats: busSeats,
      });
    },
    onSuccess: () => {
      setNewBusModalOpen(false);
      refetchBuses();
      setBusReg('');
      setBusName('');
    },
  });

  const createTripMutation = useMutation({
    mutationFn: async () => {
      await api.post('/operator/trips', {
        busId: tripBusId,
        routeId: tripRouteId,
        departureTime: tripDep,
        arrivalTime: tripArr,
        basePrice: tripFare,
      });
    },
    onSuccess: () => {
      setNewTripModalOpen(false);
      refetchTrips();
    },
  });

  const reportDisruptionMutation = useMutation({
    mutationFn: async () => {
      if (!disruptionModalTripId) return;
      await api.post(`/operator/trips/${disruptionModalTripId}/disruption`, {
        disruptionType,
        reason: disruptionReason,
      });
    },
    onSuccess: () => {
      setDisruptionModalTripId(null);
      refetchTrips();
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider">
              Staff & Operations Dashboard
            </span>
            <span className="text-xs text-slate-400 font-semibold">• Live Sync</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Rova Operator Management Portal
          </h1>
          <p className="text-sm text-slate-500">
            Control fleet capacity, monitor real-time passenger manifests, and view revenue analytics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setNewBusModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-brand-600" />
            <span>Add Vehicle</span>
          </button>
          <button
            onClick={() => setNewTripModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Journey</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 mb-8 overflow-x-auto">
        {[
          { id: 'overview', label: '📊 Occupancy & Revenue' },
          { id: 'manifest', label: '📋 Passenger Manifest' },
          { id: 'trips', label: '🗓️ Schedules & Recovery' },
          { id: 'fleet', label: '🚌 Fleet Vehicles' },
          { id: 'routes', label: '🗺️ Routes & Stops' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 text-xs font-extrabold whitespace-nowrap border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-brand-500 text-brand-700 bg-brand-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview & Analytics */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs uppercase font-bold tracking-wider">Fleet Buses</span>
                <Bus className="w-5 h-5 text-brand-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">{overviewData?.busCount || 0}</p>
              <span className="text-[11px] text-emerald-600 font-bold mt-1 block">Active across routes</span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs uppercase font-bold tracking-wider">Scheduled Journeys</span>
                <Calendar className="w-5 h-5 text-brand-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">{overviewData?.tripCount || 0}</p>
              <span className="text-[11px] text-slate-500 font-bold mt-1 block">Daily & upcoming departures</span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs uppercase font-bold tracking-wider">Confirmed Tickets</span>
                <Users className="w-5 h-5 text-brand-500" />
              </div>
              <p className="text-3xl font-black text-slate-900">{overviewData?.confirmedBookings || 0}</p>
              <span className="text-[11px] text-brand-600 font-bold mt-1 block">
                {overviewData?.cancelledBookings || 0} cancellations reconciled
              </span>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 mb-3">
                <span className="text-xs uppercase font-bold tracking-wider">Net Ticket Revenue</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-slate-900">
                {(overviewData?.netRevenue || 0).toLocaleString()} <span className="text-xs text-slate-500 font-bold">UZS</span>
              </p>
              <span className="text-[11px] text-slate-400 font-bold mt-1 block">After policy refunds</span>
            </div>
          </div>

          {/* Occupancy and Revenue Chart */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <h3 className="text-base font-black text-slate-900 mb-2">
              Route Seat Occupancy Performance (%)
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Compare average passenger capacity utilization across intercity corridors.
            </p>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData?.routePerformance || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="route" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis unit="%" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Occupancy Rate']}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0' }}
                  />
                  <Bar dataKey="occupancyPercent" fill="#00D053" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Passenger Manifest (Conductor Report) */}
      {activeTab === 'manifest' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Trip Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Select Departure for Manifest
              </label>
              <select
                value={activeManifestTripId}
                onChange={(e) => setSelectedTripForManifest(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:bg-white focus:outline-none focus:border-brand-500"
              >
                {tripsData?.map((t: any) => (
                  <option key={t.id} value={t.id}>
                    {t.routeOrigin} → {t.routeDestination} ({format(new Date(t.departureTime), 'MMM dd, HH:mm')}) • {t.busName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Conductor Manifest</span>
            </button>
          </div>

          {/* Manifest Table */}
          {manifestLoading ? (
            <div className="text-center py-12 text-slate-400">Loading manifest records...</div>
          ) : manifestData ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6 print:m-0 print:border-none print:shadow-none">
              {/* Manifest Summary Header */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Bus & Route</span>
                  <p className="text-sm font-black text-slate-900">
                    {manifestData.tripDetails.busName} ({manifestData.tripDetails.busReg}) • {manifestData.tripDetails.origin} → {manifestData.tripDetails.destination}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Departure Time</span>
                  <p className="text-sm font-black text-brand-600">
                    {format(new Date(manifestData.tripDetails.departureTime), 'PPP p')}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Booked / Total</span>
                  <p className="text-sm font-black text-slate-900">
                    {manifestData.tripDetails.manifestCount} / {manifestData.tripDetails.totalCapacity} seats ({manifestData.tripDetails.occupancyRate}%)
                  </p>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Seat</th>
                      <th className="py-3 px-4">Passenger Name</th>
                      <th className="py-3 px-4">Age / Gender</th>
                      <th className="py-3 px-4">PNR</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Fare Paid</th>
                      <th className="py-3 px-4 text-right">Boarding Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {manifestData.manifest.length > 0 ? (
                      manifestData.manifest.map((item: ManifestItem, i: number) => (
                        <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-black text-slate-900 font-mono text-sm">
                            <span className="px-2.5 py-1 bg-brand-50 border border-brand-200 text-brand-700 rounded-lg">
                              {item.seatNumber}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{item.passengerName}</td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {item.passengerAge} yrs • {item.passengerGender}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{item.pnr}</td>
                          <td className="py-3.5 px-4 text-slate-600">{item.contactPhone}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {item.fare.toLocaleString()} UZS
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" /> Confirmed
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                          No confirmed tickets booked on this departure yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Tab 3: Trip Schedules & Recovery */}
      {activeTab === 'trips' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-black text-slate-900">Scheduled Departures</h2>
            <button
              onClick={() => setNewTripModalOpen(true)}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
            >
              + Schedule Journey
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Journey Route</th>
                    <th className="py-3 px-4">Departure Time</th>
                    <th className="py-3 px-4">Bus Vehicle</th>
                    <th className="py-3 px-4">Occupancy</th>
                    <th className="py-3 px-4">Fare</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Operations Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tripsData?.map((t: any) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {t.routeOrigin} → {t.routeDestination}
                      </td>
                      <td className="py-4 px-4 text-slate-700 font-semibold">
                        {format(new Date(t.departureTime), 'MMM dd, HH:mm')}
                      </td>
                      <td className="py-4 px-4 text-slate-600">
                        {t.busName} ({t.busReg})
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-800">
                          {t.bookedSeatsCount} / {t.totalSeats} ({t.occupancyRate}%)
                        </span>
                      </td>
                      <td className="py-4 px-4 font-black text-brand-600">
                        {t.basePrice.toLocaleString()} UZS
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            t.status === 'DELAYED'
                              ? 'bg-amber-100 text-amber-800'
                              : t.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {t.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setDisruptionModalTripId(t.id)}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-lg text-xs font-bold transition-colors"
                        >
                          Report Disruption
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Fleet Vehicles */}
      {activeTab === 'fleet' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-black text-slate-900">Fleet Vehicles & Layouts</h2>
            <button
              onClick={() => setNewBusModalOpen(true)}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
            >
              + Add Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {busesData?.map((b: any) => (
              <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-mono text-xs font-bold rounded-lg">
                    {b.registrationNumber}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-brand-600">
                    {b.layoutType} Layout
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900">{b.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{b.busType.replace('_', ' ')}</p>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                  <span>Total Seats: <strong>{b.totalSeats}</strong></span>
                  <span>Active Trips: <strong>{b._count?.trips || 0}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Routes & Stops */}
      {activeTab === 'routes' && (
        <div className="space-y-4 animate-fadeIn">
          <h2 className="text-base font-black text-slate-900 mb-2">Configured Travel Corridors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {routesData?.map((r: any) => (
              <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-black text-slate-900">
                    {r.origin} ──&gt; {r.destination}
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    {r.distanceKm} km • ~{r.estimatedMinutes} mins
                  </span>
                </div>

                <div className="space-y-2 mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Intermediate Stops & Stations
                  </span>
                  {r.routeStops?.map((rs: any) => (
                    <div key={rs.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-500" />
                        <span className="font-semibold text-slate-800">{rs.stop.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        +{rs.timeFromStartMinutes} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {newBusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4">Add Fleet Vehicle</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createBusMutation.mutate();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Registration Plate</label>
                <input
                  type="text"
                  required
                  placeholder="01-X-555-XX"
                  value={busReg}
                  onChange={(e) => setBusReg(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Model / Name</label>
                <input
                  type="text"
                  required
                  placeholder="Volvo 9900 Sleeper"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Bus Type</label>
                  <select
                    value={busType}
                    onChange={(e) => setBusType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="LUXURY_VOLVO">Luxury Volvo</option>
                    <option value="AC_SLEEPER">AC Sleeper</option>
                    <option value="AC_SEATER">AC Seater</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Layout</label>
                  <select
                    value={busLayout}
                    onChange={(e) => setBusLayout(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <option value="2x2">2x2 Standard</option>
                    <option value="2x1">2x1 Luxury VIP</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Seat Capacity</label>
                <input
                  type="number"
                  required
                  min={10}
                  max={60}
                  value={busSeats}
                  onChange={(e) => setBusSeats(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewBusModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBusMutation.isPending}
                  className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold"
                >
                  {createBusMutation.isPending ? 'Generating Seats...' : 'Save Bus'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Journey Modal */}
      {newTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-4">Schedule New Journey</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createTripMutation.mutate();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Assign Bus</label>
                <select
                  required
                  value={tripBusId}
                  onChange={(e) => setTripBusId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="">Select bus...</option>
                  {busesData?.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.registrationNumber}) • {b.totalSeats} seats
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Route</label>
                <select
                  required
                  value={tripRouteId}
                  onChange={(e) => setTripRouteId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <option value="">Select route...</option>
                  {routesData?.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.origin} → {r.destination} ({r.distanceKm} km)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Departure</label>
                  <input
                    type="datetime-local"
                    required
                    value={tripDep}
                    onChange={(e) => setTripDep(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Arrival</label>
                  <input
                    type="datetime-local"
                    required
                    value={tripArr}
                    onChange={(e) => setTripArr(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Base Price (UZS)</label>
                <input
                  type="number"
                  required
                  step={5000}
                  value={tripFare}
                  onChange={(e) => setTripFare(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewTripModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTripMutation.isPending}
                  className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold"
                >
                  {createTripMutation.isPending ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disruption Trigger Modal */}
      {disruptionModalTripId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <div className="flex items-center gap-2 mb-3 text-amber-600 font-bold">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-black text-slate-900">Trigger Journey Recovery</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Logging a delay or cancellation will automatically invoke Rova's Journey Recovery Engine to calculate alternate departures and compensate passengers.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                reportDisruptionMutation.mutate();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Type of Disruption</label>
                <select
                  value={disruptionType}
                  onChange={(e) => setDisruptionType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="DELAY">Schedule Delay</option>
                  <option value="CANCELLATION">Trip Cancellation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Notice</label>
                <input
                  type="text"
                  required
                  value={disruptionReason}
                  onChange={(e) => setDisruptionReason(e.target.value)}
                  placeholder="e.g. Highway roadwork detour"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDisruptionModalTripId(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportDisruptionMutation.isPending}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
                >
                  {reportDisruptionMutation.isPending ? 'Processing...' : 'Broadcast Disruption'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperatorPage;
