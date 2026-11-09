import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { format } from 'date-fns';
import {
  ShieldAlert,
  Users,
  Database,
  DollarSign,
  Activity,
  FileText,
  Search,
  CheckCircle2,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'audit' | 'users'>('audit');
  const [actionFilter, setActionFilter] = useState('');

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    },
  });

  const { data: auditData, isLoading: auditLoading } = useQuery({
    queryKey: ['admin-audit-logs', actionFilter],
    queryFn: async () => {
      const params: any = { limit: 100 };
      if (actionFilter) params.action = actionFilter;
      const res = await api.get('/admin/audit-logs', { params });
      return res.data.data;
    },
  });

  const { data: usersData } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-black uppercase tracking-wider">
            Enterprise Audit & Compliance Trail
          </span>
          <span className="text-xs text-slate-400 font-semibold">• Immutable DB Log</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          System Administration & Governance
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review cryptographic audit records for every material booking, seat release, fare transaction, and user event.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-xs uppercase font-bold text-slate-400">Total Registered Users</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{statsData?.userCount || 0}</p>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">
            {statsData?.operatorCount || 0} Licensed Operators
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-xs uppercase font-bold text-slate-400">Total System Bookings</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{statsData?.bookingCount || 0}</p>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">
            {statsData?.refundCount || 0} Processed Refunds
          </span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-xs uppercase font-bold text-slate-400">Gross Ticket Volume</span>
          <p className="text-2xl font-black text-brand-600 mt-1">
            {(statsData?.totalGrossRevenue || 0).toLocaleString()} <span className="text-xs text-slate-400">UZS</span>
          </p>
          <span className="text-xs text-slate-500 font-semibold mt-1 block">Before policy deductions</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-xs uppercase font-bold text-slate-400">Net Platform Revenue</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {(statsData?.netRevenue || 0).toLocaleString()} <span className="text-xs text-slate-400">UZS</span>
          </p>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">Reconciled in real time</span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-3 text-xs font-black border-b-2 transition-all ${
            activeTab === 'audit'
              ? 'border-purple-600 text-purple-700 bg-purple-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          🔍 Audit Trail Logs ({auditData?.total || 0})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-3 text-xs font-black border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-700 bg-purple-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          👥 User Directory ({usersData?.length || 0})
        </button>
      </div>

      {/* Tab: Audit Trail Logs */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          {/* Action Filter */}
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Filter Event:</span>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="">All Business Actions</option>
                <option value="BOOKING_CONFIRMED">BOOKING_CONFIRMED</option>
                <option value="BOOKING_CANCELLED">BOOKING_CANCELLED</option>
                <option value="TRIP_SCHEDULED">TRIP_SCHEDULED</option>
                <option value="TRIP_DISRUPTION_PROCESSED">TRIP_DISRUPTION_PROCESSED</option>
                <option value="USER_REGISTERED">USER_REGISTERED</option>
                <option value="USER_LOGGED_IN">USER_LOGGED_IN</option>
              </select>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Displaying latest {auditData?.logs?.length || 0} events
            </span>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action Event</th>
                    <th className="py-3 px-4">Entity</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Cryptographic Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditLoading ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        Loading audit events...
                      </td>
                    </tr>
                  ) : auditData?.logs?.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {format(new Date(log.createdAt), 'MMM dd, HH:mm:ss')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-black ${
                            log.action.includes('CANCEL')
                              ? 'bg-red-50 text-red-700'
                              : log.action.includes('CONFIRM')
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {log.entity} <span className="font-mono text-slate-400 text-[10px]">({log.entityId.slice(0, 8)})</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {log.user ? (
                          <span className="font-semibold text-slate-800">
                            {log.user.name} ({log.user.role})
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">System / Guest</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 max-w-xs truncate">
                        {log.details || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users Directory */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Total Bookings</th>
                  <th className="py-3 px-4">Joined Date</th>
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
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{u.phone || '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">{u._count?.bookings || 0}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {format(new Date(u.createdAt), 'MMM dd, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
