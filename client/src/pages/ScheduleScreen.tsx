import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import { Calendar, Plus, Clock, AlertTriangle, Bus, MapPin, CheckCircle2, X } from 'lucide-react';
import RecoveryBanner from '../components/RecoveryBanner';

export const ScheduleScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const [newTripOpen, setNewTripOpen] = useState(false);
  const [disruptionTripId, setDisruptionTripId] = useState<string | null>(null);

  // Form states
  const [busId, setBusId] = useState('');
  const [routeId, setRouteId] = useState('');
  const [depTime, setDepTime] = useState('');
  const [arrTime, setArrTime] = useState('');
  const [basePrice, setBasePrice] = useState(55);

  const [disruptionType, setDisruptionType] = useState<'DELAY' | 'CANCELLATION'>('DELAY');
  const [disruptionReason, setDisruptionReason] = useState('Highway bridge structural inspection');

  const { data: tripsData, refetch: refetchTrips } = useQuery({
    queryKey: ['operator-trips'],
    queryFn: async () => {
      const res = await api.get('/operator/trips');
      return res.data.data;
    },
  });

  const { data: busesData } = useQuery({
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

  const createTripMutation = useMutation({
    mutationFn: async () => {
      await api.post('/operator/trips', {
        busId,
        routeId,
        departureTime: depTime,
        arrivalTime: arrTime,
        basePrice,
      });
    },
    onSuccess: () => {
      setNewTripOpen(false);
      refetchTrips();
    },
  });

  const reportDisruptionMutation = useMutation({
    mutationFn: async () => {
      if (!disruptionTripId) return;
      await api.post(`/operator/trips/${disruptionTripId}/disruption`, {
        disruptionType,
        reason: disruptionReason,
      });
    },
    onSuccess: () => {
      setDisruptionTripId(null);
      refetchTrips();
    },
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Schedule & Transit Run Operations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch departures, monitor delay events, and trigger automated passenger recovery.
          </p>
        </div>

        <button
          onClick={() => setNewTripOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-2xl text-xs font-black shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Schedule</span>
        </button>
      </div>

      {/* Disrupted trips recovery callout if any */}
      {tripsData && tripsData.some((t: any) => t.status === 'DELAYED' || t.status === 'CANCELLED') && (
        <RecoveryBanner
          disruption={{
            id: 'DISR-ALERT',
            disruptionType: 'DELAY ALERT',
            reason: 'Transit corridor delay: Automated Journey Recovery active with passenger vouchers.',
          }}
        />
      )}

      {/* Departures Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 pb-2 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-900">Scheduled Coach Departures</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">ROUTE</th>
                <th className="py-3 px-4">DEPARTURE</th>
                <th className="py-3 px-4">ASSIGNED COACH</th>
                <th className="py-3 px-4">LOAD FACTOR</th>
                <th className="py-3 px-4">FARE</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">DISPATCH ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tripsData?.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {t.routeOrigin} ──▶ {t.routeDestination}
                  </td>
                  <td className="py-4 px-4 font-semibold text-slate-700">
                    {format(new Date(t.departureTime), 'MMM dd, p')}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {t.busName} <span className="font-mono text-slate-400">({t.busReg})</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800">
                      {t.bookedSeatsCount} / {t.totalSeats} ({t.occupancyRate}%)
                    </span>
                  </td>
                  <td className="py-4 px-4 font-black text-slate-900">
                    ${t.basePrice}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
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
                      onClick={() => setDisruptionTripId(t.id)}
                      className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
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

      {/* New Schedule Modal */}
      {newTripOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setNewTripOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-4">Add Departure Schedule</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createTripMutation.mutate();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Coach</label>
                <select
                  required
                  value={busId}
                  onChange={(e) => setBusId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Route Corridor</label>
                <select
                  required
                  value={routeId}
                  onChange={(e) => setRouteId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  <option value="">Select route...</option>
                  {routesData?.map((r: any) => (
                    <option key={r.id} value={r.id}>
                      {r.origin} ──▶ {r.destination}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Departure</label>
                  <input
                    type="datetime-local"
                    required
                    value={depTime}
                    onChange={(e) => setDepTime(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Arrival</label>
                  <input
                    type="datetime-local"
                    required
                    value={arrTime}
                    onChange={(e) => setArrTime(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Price ($)</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setNewTripOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createTripMutation.isPending}
                  className="flex-1 py-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold"
                >
                  {createTripMutation.isPending ? 'Scheduling...' : 'Confirm Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Disruption Modal */}
      {disruptionTripId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <button
              type="button"
              onClick={() => setDisruptionTripId(null)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-800 rounded-full hover:bg-stone-100 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-2">Report Trip Disruption</h3>
            <p className="text-xs text-slate-500 mb-4">
              Invokes the Journey Recovery Engine to calculate alternate travel options and issue goodwill compensation vouchers.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                reportDisruptionMutation.mutate();
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Disruption Type</label>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason</label>
                <input
                  type="text"
                  required
                  value={disruptionReason}
                  onChange={(e) => setDisruptionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setDisruptionTripId(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportDisruptionMutation.isPending}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold"
                >
                  {reportDisruptionMutation.isPending ? 'Processing...' : 'Broadcast Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleScreen;
