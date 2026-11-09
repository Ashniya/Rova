import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Booking, ManifestItem } from '../types';
import TicketCard from '../components/TicketCard';
import CancelModal from '../components/CancelModal';
import { Search, Users, Ticket, Printer, CheckCircle2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

export const CustomerManagementScreen: React.FC = () => {
  const [pnrSearch, setPnrSearch] = useState('RV8F92K');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancellingPnr, setCancellingPnr] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.data;
    },
  });

  const handleLookup = async (e: React.FormEvent) => {
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
      setSearchError(err.response?.data?.message || 'No reservation found for reference.');
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
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Customer Management & Manifest Records
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review registered passenger manifests, inspect individual PNR tickets, and process customer refunds.
        </p>
      </div>

      {/* PNR Lookup Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Customer Reservation Lookup
        </h2>
        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Ticket className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              required
              value={pnrSearch}
              onChange={(e) => setPnrSearch(e.target.value)}
              placeholder="Enter PNR code..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-800 focus:bg-white focus:outline-none focus:border-coral-500"
            />
          </div>
          <button
            type="submit"
            disabled={searchLoading}
            className="px-6 py-2.5 bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs rounded-xl shadow-coral transition-all"
          >
            {searchLoading ? 'Searching...' : 'Find Ticket'}
          </button>
        </form>

        {searchError && (
          <p className="text-xs text-red-600 font-semibold mt-2">{searchError}</p>
        )}
      </div>

      {/* Selected Ticket Preview */}
      {selectedBooking && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-sm font-black text-slate-900">
              Verified Reservation: PNR {selectedBooking.pnr}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                selectedBooking.status === 'CANCELLED'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {selectedBooking.status}
            </span>
          </div>

          <div className="flex justify-center">
            <TicketCard
              booking={selectedBooking}
              onCancelRequest={(pnr) => setCancellingPnr(pnr)}
            />
          </div>
        </div>
      )}

      {/* Registered Passenger Directory */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 pb-2 border-b border-slate-100">
          <h2 className="text-base font-black text-slate-900">Registered Customer Accounts</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4">PHONE</th>
                <th className="py-3 px-4 text-right">MEMBER SINCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usersData?.map((u: any) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{u.name}</td>
                  <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        u.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'OPERATOR'
                          ? 'bg-sidebar-bg text-white'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono">{u.phone || '—'}</td>
                  <td className="py-3.5 px-4 text-right text-slate-400">
                    {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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

export default CustomerManagementScreen;
