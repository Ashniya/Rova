import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';

interface CancelModalProps {
  pnr: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (refundData: any) => void;
}

export const CancelModal: React.FC<CancelModalProps> = ({
  pnr,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('Change of travel plans');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirmCancel = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(`/bookings/${pnr}/cancel`, { reason });
      if (res.data.success) {
        onSuccess(res.data.data.refund);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-red-50 border-b border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Cancel Booking</h3>
                <p className="text-xs text-slate-500">PNR: {pnr}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Policy breakdown */}
        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Configured Cancellation & Refund Rules
            </h4>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>&gt; 24 hours before departure</span>
                <span className="font-bold text-brand-600">90% Refund</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span>12 – 24 hours before departure</span>
                <span className="font-bold text-amber-600">50% Refund</span>
              </div>
              <div className="flex justify-between py-1">
                <span>&lt; 12 hours before departure</span>
                <span className="font-bold text-red-500">Non-refundable</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Cancellation Reason (Optional)
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:border-brand-500 focus:outline-none"
            >
              <option value="Change of travel plans">Change of travel plans</option>
              <option value="Health emergency">Health emergency</option>
              <option value="Booked wrong bus/date">Booked wrong bus/date</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Keep My Ticket
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleConfirmCancel}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
