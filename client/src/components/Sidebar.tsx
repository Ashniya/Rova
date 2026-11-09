import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  Bus,
  Calendar,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  Radio,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Bookings', path: '/bookings', icon: Ticket },
    { label: 'Bus Fleet & Routes', path: '/fleet', icon: Bus },
    { label: 'Schedule', path: '/schedule', icon: Calendar },
    { label: 'Customer Management', path: '/customers', icon: Users },
    { label: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-sidebar-bg min-h-screen text-slate-300 flex flex-col justify-between shrink-0 border-r border-sidebar-border select-none">
      <div>
        {/* Brand Header: Just 'Rova' and 'the best' in white with matching dark background (no logo symbol) */}
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex flex-col group">
            <span className="text-3xl font-black tracking-tight text-white group-hover:text-coral-400 transition-colors">
              Rova
            </span>
            <span className="text-[11px] font-bold tracking-[0.28em] text-white/90 uppercase mt-0.5">
              the best
            </span>
            <span className="text-[9px] tracking-widest text-slate-400 uppercase mt-1 font-semibold">
              TRANSIT CONTROL
            </span>
          </Link>
        </div>

        {/* Section Label */}
        <div className="px-6 pt-5 pb-2">
          <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            OPERATIONS
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'bg-sidebar-active text-white shadow-sm shadow-purple-950/40 border border-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-sidebar-hover'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-coral-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Fleet Dispatch Status Pill at the bottom */}
      <div className="p-4 m-3 bg-sidebar-card/80 border border-sidebar-border rounded-2xl">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
            </span>
            <span className="text-[11px] font-bold text-white tracking-wide">Fleet Dispatch</span>
          </div>
          <span className="text-[10px] font-mono text-brand-400 font-bold">99.1%</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-tight">
          48 of 52 coaches transmitting active GPS telemetry.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
