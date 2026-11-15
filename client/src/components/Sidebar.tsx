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
  QrCode,
  Compass,
  Clock,
  Tag,
  Headphones,
  Navigation,
  Fuel,
  PhoneCall,
  TrendingUp,
  DollarSign,
  FileText,
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
    portalTitle = 'DRIVERS HUB';
    portalRoleTag = 'DRIVERS PLATFORM';
    navItems = [
      { label: 'My Bus & 37-Seat Cabin', path: '/driver?tab=seats', icon: Bus },
      { label: 'Passenger Manifest Checklist', path: '/driver?tab=manifest', icon: Users },
      { label: 'Corridor Waypoints & Stops', path: '/driver?tab=waypoints', icon: Navigation },
      { label: 'Coach Telemetry & Fuel Gauges', path: '/driver?tab=telemetry', icon: Fuel },
      { label: 'ISBT Bay Departure Clearance', path: '/driver?tab=clearance', icon: Clock },
      { label: 'Highway Emergency & Roadside SOS', path: '/driver?tab=emergency', icon: PhoneCall },
      { label: 'Return to Landing', path: '/', icon: Globe },
    ];
  } else if (isPassenger) {
    portalTitle = 'PASSENGER PORTAL';
    portalRoleTag = 'PASSENGER ACCESS';
    navItems = [
      { label: 'Browse & Book Coaches', path: '/passenger?tab=coaches', icon: Ticket },
      { label: 'My Digital Tickets & QR', path: '/passenger?tab=tickets', icon: QrCode },
      { label: 'Live Highway Telemetry (OSRM)', path: '/passenger?tab=tracking', icon: Radio },
      { label: 'Punjab Transit Timetable', path: '/passenger?tab=timetable', icon: Clock },
      { label: 'Fare & Seat Tier Calculator', path: '/passenger?tab=calculator', icon: DollarSign },
      { label: 'Baggage & Travel Guidelines', path: '/passenger?tab=guidelines', icon: Tag },
      { label: '24/7 Transit Helpdesk', path: '/passenger?tab=support', icon: Headphones },
      { label: 'Return to Landing', path: '/', icon: Globe },
    ];
  } else {
    portalTitle = 'PLATFORM ADMIN';
    portalRoleTag = 'ADMIN CONSOLE';
    navItems = [
      { label: 'Revenue & Financial Ledger', path: '/admin?tab=overview', icon: BarChart3 },
      { label: 'Bus Fleet & Live Coaches', path: '/fleet', icon: Bus },
      { label: 'Schedules & Trip Frequencies', path: '/schedule', icon: Calendar },
      { label: 'Passenger Directory & Accounts', path: '/customers', icon: Users },
      { label: 'Seat Bookings & Manifests', path: '/bookings', icon: Ticket },
      { label: 'Corridor Analytics & Reports', path: '/analytics', icon: TrendingUp },
      { label: 'Driver Roster & Compliance', path: '/admin?tab=roster', icon: ShieldCheck },
      { label: 'Dynamic Fare Engine', path: '/admin?tab=fares', icon: DollarSign },
      { label: 'System Security Audit Logs', path: '/admin?tab=audit', icon: FileText },
      { label: 'Return to Landing', path: '/', icon: Globe },
    ];
  }

  const isActive = (path: string) => {
    const current = location.pathname + (location.search || '');
    if (path === '/' && location.pathname === '/') return true;
    if (path === current) return true;
    // Default fallback when no search query parameter is present
    if (path.includes('?tab=') && !location.search) {
      if (isPassenger && path.endsWith('?tab=coaches')) return true;
      if (isDriver && path.endsWith('?tab=seats')) return true;
      if (isAdmin && path.endsWith('?tab=overview')) return true;
    }
    if (!path.includes('?') && location.pathname === path && !location.search) return true;
    return false;
  };

  return (
    <aside
      className={`bg-[#1C1917] h-screen text-stone-300 flex flex-col justify-between shrink-0 border-r border-[#2E2A27] select-none transition-all duration-300 ease-in-out relative z-30 sticky top-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Brand Header */}
        <div className={`border-b border-[#2E2A27] transition-all duration-300 shrink-0 ${collapsed ? 'p-3 flex flex-col items-center' : 'p-5'}`}>
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
        <div className={`pt-3 pb-1 shrink-0 ${collapsed ? 'text-center' : 'px-5'}`}>
          <span className="text-[9px] font-bold tracking-widest text-stone-500 uppercase">
            {collapsed ? 'NAV' : portalRoleTag}
          </span>
        </div>

        {/* Navigation Links - Scrollable internally if screen is small, but sidebar never scrolls page */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-1 space-y-1 scrollbar-thin scrollbar-thumb-stone-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.label}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center rounded-xl text-xs font-bold transition-all duration-200 ${
                  collapsed
                    ? 'justify-center p-2.5'
                    : 'gap-3 px-3.5 py-2.5'
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

      {/* Footer Area with User Profile & Logout - Always Pinned at Bottom */}
      <div className="p-3 border-t border-stone-800 space-y-2 shrink-0 bg-[#1C1917]">
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
              window.location.href = '/';
            }}
            title="Log out of system"
            className={`w-full flex items-center rounded-xl text-xs font-bold text-stone-400 hover:text-red-400 hover:bg-stone-900 transition-colors cursor-pointer ${
              collapsed ? 'justify-center p-2' : 'gap-2 px-3 py-2'
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
