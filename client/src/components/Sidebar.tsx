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
      className={`bg-[#1C1917] min-h-screen text-stone-300 flex flex-col justify-between shrink-0 border-r border-[#2E2A27] select-none transition-all duration-300 ease-in-out relative z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className={`border-b border-[#2E2A27] transition-all duration-300 ${collapsed ? 'p-3 flex flex-col items-center' : 'p-6'}`}>
          {collapsed ? (
            /* Minimized state: Rova title at top with expand button */
            <div className="flex flex-col items-center gap-3 w-full">
              <Link
                to="/landing"
                title="Rova • Where routes become journeys"
                className="text-center group"
              >
                <span className="text-xl font-black tracking-tight text-white group-hover:text-[#B91C1C] transition-colors block">
                  Rova
                </span>
                <span className="text-[8px] font-bold tracking-widest text-[#B91C1C] uppercase block -mt-0.5">
                  Transit
                </span>
              </Link>
              <button
                onClick={toggleSidebar}
                title="Expand Sidebar"
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-[#B91C1C]" />
              </button>
            </div>
          ) : (
            /* Expanded state: Full Rova title + Tagline + Minimize button */
            <div className="flex items-start justify-between">
              <Link to="/landing" className="flex flex-col group">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#B91C1C] flex items-center justify-center text-white">
                    <Bus className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-black tracking-tight text-white group-hover:text-[#FCA5A5] transition-colors">
                    Rova
                  </span>
                </div>
                <span className="text-[10px] font-bold tracking-wide text-stone-300 mt-2">
                  Where routes become journeys
                </span>
                <span className="text-[9px] tracking-widest text-stone-500 uppercase mt-0.5 font-semibold">
                  TRANSIT CONTROL HUD
                </span>
              </Link>
              <button
                onClick={toggleSidebar}
                title="Minimize Sidebar"
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white border border-stone-700 transition-all cursor-pointer mt-1"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Section Label */}
        <div className={`pt-4 pb-2 ${collapsed ? 'text-center' : 'px-6'}`}>
          <span className="text-[9px] font-bold tracking-widest text-stone-500 uppercase">
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
                    ? 'bg-[#B91C1C] text-white shadow-xs'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-stone-400'}`} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Fleet Dispatch Status Pill at the bottom */}
      <div className={`m-3 transition-all duration-300 ${collapsed ? 'p-2 text-center' : 'p-4'} bg-stone-900 border border-stone-800 rounded-2xl`}>
        {collapsed ? (
          <div className="flex flex-col items-center gap-1" title="Fleet Dispatch 99.8% Active">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[9px] font-mono font-bold text-emerald-400">99.8%</span>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[11px] font-bold text-white tracking-wide">Fleet Dispatch</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">99.8%</span>
            </div>
            <p className="text-[10px] text-stone-400 leading-tight">
              51 of 52 coaches transmitting active GPS telemetry.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
