import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Ticket,
  Bus,
  Calendar,
  Users,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Globe,
  Radio,
  LogOut,
  User,
  ShieldCheck,
} from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { collapsed, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();

  // Determine portal scope strictly
  const isDriver = location.pathname.startsWith('/driver') || (!location.pathname.startsWith('/admin') && user?.role === 'OPERATOR');
  const isPassenger = location.pathname.startsWith('/passenger') || (!location.pathname.startsWith('/admin') && user?.role === 'PASSENGER');
  const isAdmin = location.pathname.startsWith('/admin') || user?.role === 'ADMIN' || (!isDriver && !isPassenger);

  let portalTitle = 'TRANSIT CONTROL';
  let portalRoleTag = 'OPERATIONS';
  let navItems: { label: string; path: string; icon: any }[] = [];

  if (isDriver) {
    portalTitle = 'DRIVER HUD';
    portalRoleTag = 'DRIVER COCKPIT';
    navItems = [
      { label: 'Landing Page', path: '/landing', icon: Globe },
      { label: 'My Bus & Live Seats', path: '/driver', icon: Bus },
    ];
  } else if (isPassenger) {
    portalTitle = 'PASSENGER PORTAL';
    portalRoleTag = 'PASSENGER ACCESS';
    navItems = [
      { label: 'Landing Page', path: '/landing', icon: Globe },
      { label: 'Browse & Book Buses', path: '/passenger', icon: Ticket },
    ];
  } else {
    portalTitle = 'PLATFORM ADMIN';
    portalRoleTag = 'ADMIN CONSOLE';
    navItems = [
      { label: 'Landing Page', path: '/landing', icon: Globe },
      { label: 'Income & Tickets', path: '/admin', icon: Radio },
      { label: 'Bus Fleet & Drivers', path: '/fleet', icon: Bus },
      { label: 'Schedules', path: '/schedule', icon: Calendar },
      { label: 'Passenger Manifests', path: '/customers', icon: Users },
      { label: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
    ];
  }

  const isActive = (path: string) => {
    if (path === '/landing' && location.pathname === '/landing') return true;
    if (path !== '/landing' && location.pathname.startsWith(path)) return true;
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
            /* Minimized state: Rova title at top */
            <div className="flex flex-col items-center gap-2 w-full pt-1">
              <Link
                to="/"
                title="Rova • Where routes become journeys."
                className="text-center group flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#B91C1C] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <Bus className="w-5 h-5 stroke-[2.5]" />
                </div>
                <span className="text-base font-black tracking-tight text-white group-hover:text-[#B91C1C] transition-colors block mt-1.5 leading-none">
                  ROVA
                </span>
                <span className="text-[7px] font-black tracking-widest text-[#B91C1C] uppercase block mt-0.5">
                  FLEET
                </span>
              </Link>
              <button
                onClick={toggleSidebar}
                title="Expand Sidebar"
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition-all cursor-pointer mt-2"
              >
                <ChevronRight className="w-4 h-4 text-[#B91C1C]" />
              </button>
            </div>
          ) : (
            /* Expanded state */
            <div className="flex items-start justify-between">
              <Link to="/" className="flex flex-col group">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-[#B91C1C] flex items-center justify-center text-white shadow-xs">
                    <Bus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="text-2xl font-black tracking-tight text-white group-hover:text-[#FCA5A5] transition-colors block leading-none">
                      ROVA
                    </span>
                    <span className="text-[9px] font-black tracking-widest text-[#B91C1C] uppercase block mt-0.5">
                      EXPEDITIONS &amp; FLEET
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-stone-300 mt-2.5">
                  Where routes become journeys.
                </span>
                <span className="text-[9px] tracking-widest text-[#F59E0B] uppercase mt-0.5 font-bold">
                  {portalTitle}
                </span>
              </Link>
              <button
                onClick={toggleSidebar}
                title="Minimize Sidebar"
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white border border-stone-700 transition-all cursor-pointer mt-0.5"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Section Label */}
        <div className={`pt-4 pb-2 ${collapsed ? 'text-center' : 'px-6'}`}>
          <span className="text-[9px] font-bold tracking-widest text-stone-500 uppercase">
            {collapsed ? 'NAV' : portalRoleTag}
          </span>
        </div>

        {/* Navigation Links strictly isolated for this role */}
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

      {/* Footer Area with User Profile & Logout */}
      <div className="p-3 border-t border-stone-800 space-y-2">
        {!collapsed && user && (
          <div className="px-3 py-2 bg-stone-900 rounded-xl border border-stone-800 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#B91C1C] text-white flex items-center justify-center text-xs font-black">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate flex-1">
              <span className="text-xs font-bold text-white block truncate">{user.name}</span>
              <span className="text-[10px] text-stone-400 font-mono block leading-none">
                {user.role}
              </span>
            </div>
          </div>
        )}

        {user && (
          <button
            onClick={() => {
              logout();
              window.location.href = '/landing';
            }}
            title="Log out of system"
            className={`w-full flex items-center rounded-xl text-xs font-bold text-stone-400 hover:text-red-400 hover:bg-stone-900 transition-colors cursor-pointer ${
              collapsed ? 'justify-center p-2.5' : 'gap-2 px-3 py-2'
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
