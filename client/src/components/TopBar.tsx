import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
export const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications for real-time dispatch events
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'StarLiner Coastliner On-Time',
      desc: 'Coach Plate DHA-8921 cleared Big Sur waypoint right on schedule.',
      time: '2m ago',
    },
    {
      id: 2,
      type: 'warning',
      title: 'High Occupancy Alert',
      desc: 'Dhaka → Rangpur 05:30 PM is at 94% seat load factor.',
      time: '14m ago',
    },
    {
      id: 3,
      type: 'info',
      title: 'Seat Integrity Validated',
      desc: 'Zero concurrent seat collision detected across all active corridors.',
      time: '45m ago',
    },
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    } else if (searchTerm.trim()) {
      window.location.href = `/customers?pnr=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  return (
    <>
      <header className="h-18 bg-white dark:bg-[#1C1917] border-b border-[#E7E2DA] dark:border-stone-800 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs transition-colors duration-200">
        {/* Search input with rounded pill design */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search route, booking code (PNR), coach plate, passenger..."
            className="w-full pl-11 pr-4 py-2.5 bg-[#F3EFEA] dark:bg-stone-800/60 border border-[#E7E2DA] dark:border-stone-700 rounded-2xl text-xs font-semibold text-[#1C1917] dark:text-stone-100 placeholder:text-stone-400 focus:bg-white dark:focus:bg-stone-800 focus:border-[#B91C1C] focus:outline-none transition-all"
          />
        </form>

        {/* Right side items */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#F3EFEA] hover:bg-[#EAE4DC] dark:bg-stone-800 dark:hover:bg-stone-700 text-[#44403C] dark:text-stone-200 border border-[#E7E2DA] dark:border-stone-700 rounded-full text-xs font-bold transition-all cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-stone-700" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
              title="Dispatch Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B91C1C] rounded-full border-2 border-white dark:border-[#1C1917]"></span>
              )}
            </button>

            {/* Notification Popover Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1C1917] border border-[#E7E2DA] dark:border-stone-700 rounded-3xl shadow-xl p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E7E2DA] dark:border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1C1917] dark:text-white uppercase tracking-wider">
                      Dispatch Feed
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#FEF2F2] dark:bg-red-950/40 text-[#B91C1C] text-[10px] font-bold">
                      {notifications.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-white rounded-lg cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-2xl bg-[#FBF9F7] dark:bg-stone-800/60 border border-[#E7E2DA] dark:border-stone-700 text-xs flex gap-2.5 items-start"
                    >
                      {item.type === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {item.type === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                      )}
                      {item.type === 'info' && (
                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-[#1C1917] dark:text-stone-200 truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#78716C] dark:text-stone-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setNotifications([])}
                  className="w-full mt-3 py-2 text-[11px] font-bold text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-white text-center rounded-xl bg-[#F3EFEA] dark:bg-stone-800 transition-colors cursor-pointer"
                >
                  Clear All Alerts
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-[#E7E2DA] dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#B91C1C] text-white font-black text-xs flex items-center justify-center shadow-xs uppercase">
                  {user?.name.slice(0, 2)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-[#1C1917] dark:text-stone-100 leading-tight">
                    {user?.name || 'Adam Smith'}
                  </p>
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                    {user?.role === 'OPERATOR' ? 'Dispatch Lead' : user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-stone-400 hover:text-[#B91C1C] rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                window.location.href = '/login';
              }}
              className="flex items-center gap-2 px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
};

export default TopBar;
