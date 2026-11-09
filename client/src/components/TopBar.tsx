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
import AuthModal from './AuthModal';

interface TopBarProps {
  onSearch?: (term: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);
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
      <header className="h-18 bg-white dark:bg-[#160B24] border-b border-slate-100 dark:border-purple-950/80 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs transition-colors duration-200">
        {/* Search input with rounded pill design */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search route, booking code (PNR), coach plate, passenger..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-purple-950/40 border border-slate-200/80 dark:border-purple-500/20 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:bg-white dark:focus:bg-purple-950/70 focus:border-coral-500 focus:outline-none transition-all"
          />
        </form>

        {/* Right side items */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button (Replaces Beams button) */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-slate-700 dark:text-slate-200 border border-transparent dark:border-purple-500/20 rounded-full text-xs font-bold transition-all cursor-pointer"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Dark Mode</span>
              </>
            )}
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-950/60 rounded-xl transition-colors cursor-pointer"
              title="Dispatch Notifications"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full border-2 border-white dark:border-[#160B24]"></span>
              )}
            </button>

            {/* Notification Popover Panel */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1A0B2E] border border-slate-200 dark:border-purple-500/30 rounded-3xl shadow-xl p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-100 dark:border-purple-900/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      Dispatch Feed
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-coral-500/10 text-coral-500 text-[10px] font-bold">
                      {notifications.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-2xl bg-slate-50 dark:bg-purple-950/40 border border-slate-100 dark:border-purple-900/40 text-xs flex gap-2.5 items-start"
                    >
                      {item.type === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      {item.type === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      {item.type === 'info' && (
                        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-800 dark:text-slate-200 truncate">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setNotifications([])}
                  className="w-full mt-3 py-2 text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white text-center rounded-xl bg-slate-50 dark:bg-purple-950/60 transition-colors"
                >
                  Clear All Alerts
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-purple-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-sidebar-bg text-white font-black text-xs flex items-center justify-center border-2 border-slate-200 dark:border-purple-500/40 shadow-xs uppercase">
                  {user?.name.slice(0, 2)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {user?.name || 'Adam Smith'}
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {user?.role === 'OPERATOR' ? 'Dispatch Lead' : user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Log in / Sign up</span>
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default TopBar;
