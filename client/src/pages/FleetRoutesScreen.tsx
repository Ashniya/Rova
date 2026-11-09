import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Bus, MapPin, Plus, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FleetRoutesScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const [newBusOpen, setNewBusOpen] = useState(false);
  const [regNo, setRegNo] = useState('');
  const [busName, setBusName] = useState('');
  const [busType, setBusType] = useState('LUXURY_VOLVO');
  const [seats, setSeats] = useState(40);
  const [layout, setLayout] = useState('2x2');

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

  const createBusMutation = useMutation({
    mutationFn: async () => {
      await api.post('/operator/buses', {
        registrationNumber: regNo,
        name: busName,
        busType,
        totalSeats: seats,
        layoutType: layout,
      });
    },
    onSuccess: () => {
      setNewBusOpen(false);
      refetchBuses();
      setRegNo('');
      setBusName('');
    },
  });

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-[1600px] mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bus Fleet & Route Network
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your registered intercity coaches, seat layouts, and transit corridors.
          </p>
        </div>

        <button
          onClick={() => setNewBusOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-2xl text-xs font-black shadow-coral transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Coach</span>
        </button>
      </div>

      {/* Fleet Vehicles Grid */}
      <div>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>Active Fleet Coaches ({busesData?.length || 0})</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {busesData?.map((b: any) => (
            <div key={b.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 bg-sidebar-bg text-white font-mono text-xs font-bold rounded-xl">
                  {b.registrationNumber}
                </span>
                <span className="text-[10px] font-bold text-coral-600 uppercase">
                  {b.layoutType} Seating
                </span>
              </div>

              <h3 className="text-base font-black text-slate-900">{b.name}</h3>
              <p className="text-xs text-slate-500">{b.busType.replace('_', ' ')}</p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span>Capacity: <strong>{b.totalSeats} seats</strong></span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready for dispatch
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routes & Stops */}
      <div>
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
          Configured Intercity Routes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {routesData?.map((r: any) => (
            <div key={r.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">
                  {r.origin} ──▶ {r.destination}
                </h3>
                <span className="text-xs font-bold text-slate-400">
                  {r.distanceKm} km • ~{r.estimatedMinutes} mins
                </span>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase text-slate-400">Intermediate Stops</span>
                {r.routeStops?.map((rs: any) => (
                  <div key={rs.id} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-xl">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-coral-500" />
                      {rs.stop.name}
                    </span>
                    <span className="text-slate-400 font-mono">+{rs.timeFromStartMinutes} min</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Coach Modal */}
      {newBusOpen && (
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Plate Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHA-METRO-11-8921"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Coach Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. StarLiner Coastliner"
                  value={busName}
                  onChange={(e) => setBusName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={busType}
                    onChange={(e) => setBusType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="LUXURY_VOLVO">Luxury Volvo</option>
                    <option value="AC_SLEEPER">AC Sleeper</option>
                    <option value="AC_SEATER">AC Seater</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Layout</label>
                  <select
                    value={layout}
                    onChange={(e) => setLayout(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="2x2">2x2 Standard</option>
                    <option value="2x1">2x1 VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Total Seats</label>
                <input
                  type="number"
                  required
                  min={10}
                  max={60}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewBusOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createBusMutation.isPending}
                  className="flex-1 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold"
                >
                  {createBusMutation.isPending ? 'Saving...' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetRoutesScreen;
