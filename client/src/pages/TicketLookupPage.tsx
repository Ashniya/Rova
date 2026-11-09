import React, { useState } from 'react';
import api from '../services/api';
import { Booking } from '../types';
import TicketCard from '../components/TicketCard';
import CancelModal from '../components/CancelModal';
import { Search, Ticket, Sparkles, CheckCircle2 } from 'lucide-react';

export const TicketLookupPage: React.FC = () => {
  const [pnr, setPnr] = useState('RV8F92K'); // Pre-filled with reference ticket
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellingPnr, setCancellingPnr] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/bookings/${pnr.trim().toUpperCase()}`);
      if (res.data.success) {
        setBooking(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `No ticket found for reference "${pnr}".`);
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSuccess = (refund: any) => {
    setCancellingPnr(null);
    if (booking) {
      setBooking({
        ...booking,
        status: 'CANCELLED',
        refund,
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Instant Boarding Pass Verification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Chiptani olish (Retrieve Your Ticket)
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2">
          Enter your 6-8 digit booking PNR reference code to view or print your digital pass.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-floating mb-10">
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Ticket className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
            <input
              type="text"
              required
              value={pnr}
              onChange={(e) => setPnr(e.target.value)}
              placeholder="e.g. RV8F92K"
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black uppercase tracking-wider text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-black text-sm rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>{loading ? 'Retrieving...' : 'Find Ticket'}</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold">
            {error}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
          <span>Demo PNR reference ready: <strong className="text-slate-700">RV8F92K</strong> (Xasanova Go'zal, Seat 16B)</span>
          <span className="text-brand-600 font-bold">100% Verified Database Record</span>
        </div>
      </div>

      {/* Ticket Result Display */}
      {booking && (
        <div className="flex justify-center animate-fadeIn">
          <TicketCard
            booking={booking}
            onCancelRequest={(pnrToCancel) => setCancellingPnr(pnrToCancel)}
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

export default TicketLookupPage;
