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
  ChevronLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { collapsed, toggleSidebar } = useSidebar();

  const navItems = [
    { label: 'Landing Page', path: '/landing', icon: Globe },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', path: '/bookings', icon: Ticket },
    { label: 'Bus Fleet & Routes', path: '/fleet', icon: Bus },
    { label: 'Schedule', path: '/schedule', icon: Calendar },
    { label: 'Customer Management', path: '/customers', icon: Users },
    { label: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard' && (location.pathname === '/' || location.pathname === '/dashboard')) {
      return true;
    }
    if (path !== '/dashboard' && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <aside
      className={`bg-sidebar-bg min-h-screen text-slate-300 flex flex-col justify-between shrink-0 border-r border-sidebar-border select-none transition-all duration-300 ease-in-out relative z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className={`border-b border-sidebar-border transition-all duration-300 ${collapsed ? 'p-3 flex flex-col items-center' : 'p-6'}`}>
          {collapsed ? (
            /* Minimized state: Rova title at top with expand button */
            <div className="flex flex-col items-center gap-3 w-full">
              <Link
                to="/landing"
                title="Rova • Where routes become journeys"
                className="text-center group"
              >
                <span className="text-xl font-black tracking-tight text-white group-hover:text-coral-400 transition-colors block">
                  Rova
                </span>
                <span className="text-[8px] font-bold tracking-widest text-coral-400 uppercase block -mt-0.5">
                  Transit
                </span>
              </Link>
              <button
                onClick={toggleSidebar}
                title="Expand Sidebar"
                className="p-1.5 rounded-xl bg-sidebar-card hover:bg-sidebar-hover text-slate-300 hover:text-white border border-sidebar-border transition-all"
              >
                <ChevronRight className="w-4 h-4 text-coral-400" />
              </button>
            </div>
          ) : (
            /* Expanded state: Full Rova title + Tagline + Minimize button */
            <div className="flex items-start justify-between">
              <Link to="/landing" className="flex flex-col group">
                <span className="text-3xl font-black tracking-tight text-white group-hover:text-coral-400 transition-colors">
                  Rova
                </span>
                <span className="text-[10px] font-bold tracking-wide text-white/90 mt-1">
                  Where routes become journeys
                </span>
                <span className="text-[9px] tracking-widest text-slate-400 uppercase mt-0.5 font-semibold">
                  TRANSIT CONTROL
                </span>
              </Link>
              <button
                onClick={toggleSidebar}
                title="Minimize Sidebar"
                className="p-1.5 rounded-xl bg-sidebar-card hover:bg-sidebar-hover text-slate-300 hover:text-white border border-sidebar-border transition-all mt-1"
              >
                <ChevronLeft className="w-4 h-4 text-slate-400 hover:text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Section Label */}
        <div className={`pt-4 pb-2 ${collapsed ? 'text-center' : 'px-6'}`}>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase">
            {collapsed ? 'OPS' : 'OPERATIONS'}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-2.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center rounded-2xl text-xs font-bold transition-all duration-200 ${
                  collapsed
                    ? 'justify-center p-3'
                    : 'gap-3.5 px-4 py-3'
                } ${
                  active
                    ? 'bg-sidebar-active text-white border border-purple-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-sidebar-hover'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-coral-400' : 'text-slate-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Fleet Dispatch Status Pill at the bottom */}
      <div className={`m-3 transition-all duration-300 ${collapsed ? 'p-2 text-center' : 'p-4'} bg-sidebar-card/80 border border-sidebar-border rounded-2xl`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-1" title="Fleet Dispatch 99.1% Active">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
            </span>
            <span className="text-[9px] font-mono font-bold text-brand-400">99%</span>
          </div>
        ) : (
          <div>
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
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
