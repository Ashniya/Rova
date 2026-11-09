import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { DollarSign, Ticket, Bus, TrendingUp, Users } from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { data: analyticsData } = useQuery({
    queryKey: ['operator-analytics'],
    queryFn: async () => {
      const res = await api.get('/operator/analytics');
      return res.data.data;
    },
  });

  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/stats');
      return res.data.data;
    },
  });

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto animate-fadeIn">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Analytics & Performance Reporting
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor route yield metrics, seat occupancy factors, and net booking revenue.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{statsData?.bookingCount || 0}</p>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">Live across all lines</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Refunds Reconciled</span>
          <p className="text-3xl font-black text-coral-600 mt-1">{statsData?.refundCount || 0}</p>
          <span className="text-xs text-slate-500 font-medium mt-1 block">Policy deductions enforced</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Gross Ticket Volume</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            ${((statsData?.totalGrossRevenue || 0) / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-slate-400 font-medium mt-1 block">Passenger fares</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-400">Net Reconciled Revenue</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            ${((statsData?.netRevenue || 0) / 1000).toFixed(1)}k
          </p>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">Audited database records</span>
        </div>
      </div>

      {/* Recharts Bar Chart: Route Occupancy */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Seat Occupancy Factor by Route (%)</h2>
            <p className="text-xs text-slate-500">Utilization percentage across active departure corridors</p>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData?.routePerformance || []}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="route" tick={{ fontSize: 12, fill: '#64748B' }} />
              <YAxis unit="%" tick={{ fontSize: 12, fill: '#64748B' }} />
              <Tooltip
                formatter={(val: any) => [`${val}%`, 'Occupancy Rate']}
                contentStyle={{ borderRadius: '16px', border: '1px solid #E2E8F0' }}
              />
              <Bar dataKey="occupancyPercent" fill="#FF5722" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsScreen;
