import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import TicketCard from '../components/TicketCard';
import CancelModal from '../components/CancelModal';
import { format } from 'date-fns';
import { Ticket, Search, Calendar, MapPin, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const MyBookingsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [pnrSearch, setPnrSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingPnr, setCancellingPnr] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch logged in user bookings if authenticated
  const { data: userBookings, isLoading, refetch } = useQuery({
    queryKey: ['my-bookings', user?.id],
    queryFn: async () => {
      if (!isAuthenticated) return [];
      const res = await api.get('/bookings/my-bookings');
      return res.data.data as Booking[];
    },
    enabled: isAuthenticated,
  });

  const handleLookupPnr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnrSearch.trim()) return;

    setSearchLoading(true);
    setSearchError(null);
    try {
      const res = await api.get(`/bookings/${pnrSearch.trim().toUpperCase()}`);
      if (res.data.success) {
        setSelectedBooking(res.data.data);
      }
    } catch (err: any) {
      setSearchError(err.response?.data?.message || `No booking found for reference: ${pnrSearch}`);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleCancelSuccess = (refund: any) => {
    setCancellingPnr(null);
    if (selectedBooking) {
      setSelectedBooking({
        ...selectedBooking,
        status: 'CANCELLED',
        refund,
      });
    }
    refetch();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Buyurtmalaringiz (My Bookings)
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your journey itineraries, print boarding passes, or manage cancellations.
        </p>
      </div>

      {/* PNR Quick Search Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-8">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Find Any Ticket by PNR Reference
        </h2>
        <form onSubmit={handleLookupPnr} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Ticket className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              placeholder="e.g. RV8F92K"
              value={pnrSearch}
              onChange={(e) => setPnrSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold uppercase tracking-wider text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{searchLoading ? 'Searching...' : 'Lookup Ticket'}</span>
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-red-600 font-semibold mt-2">{searchError}</p>
        )}
      </div>

      {/* User Bookings Section */}
      {isAuthenticated ? (
        <div>
          <h2 className="text-lg font-black text-slate-900 mb-4">
            Bookings for {user?.name} ({userBookings?.length || 0})
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-32 bg-white rounded-3xl animate-pulse border border-slate-100"></div>
              ))}
            </div>
          ) : userBookings && userBookings.length > 0 ? (
            <div className="space-y-4">
              {userBookings.map((b) => {
                const isCancelled = b.status === 'CANCELLED';
                const depDate = new Date(b.trip.departureTime);

                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
                          isCancelled ? 'bg-slate-400' : 'bg-brand-500 shadow-brand-500/20'
                        }`}
                      >
                        <Ticket className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-black text-slate-900">
                            {b.pnr}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                              isCancelled ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-700'
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-slate-700 mt-1">
                          {b.trip.route.origin} → {b.trip.route.destination}
                        </p>
                        <p className="text-xs text-slate-500">
                          Departure: {format(depDate, 'PPP')} at {format(depDate, 'HH:mm')} • {b.trip.bus.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-between md:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Total</span>
                        <p className="text-base font-black text-slate-900">
                          {b.totalAmount.toLocaleString()} UZS
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedBooking(b)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
                      >
                        View Ticket
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
              <Ticket className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No bookings on this account yet.</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Book your first journey on the home page or look up a ticket by reference above.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-brand-50/60 rounded-3xl p-8 border border-brand-200/80 text-center">
          <Ticket className="w-12 h-12 text-brand-600 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-900">
            Sign in to automatically sync your bookings
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 mb-4">
            Already bought a ticket without logging in? Enter your PNR reference above to access and print your boarding pass anytime.
          </p>
        </div>
      )}

      {/* Ticket Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <TicketCard
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onCancelRequest={(pnr) => setCancellingPnr(pnr)}
          />
        </div>
      )}

      {/* Cancellation Modal */}
      {cancellingPnr && (
        <CancelModal
          pnr={cancellingPnr}
          isOpen={true}
          onClose={() => setCancellingPnr(null)}
          onSuccess={handleCancelSuccess}
        />
      )}
    </div>
  );
};

export default MyBookingsPage;
