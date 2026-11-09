import React, { useState } from 'react';
import { Search, Bell, Radio, User as UserIcon, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface TopBarProps {
  onSearch?: (term: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <>
      <header className="h-18 bg-white border-b border-slate-100 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shadow-xs">
        {/* Search input with rounded pill design */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search route, booking code, coach plate, passenger..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-coral-500 focus:outline-none transition-all"
          />
        </form>

        {/* Right side items */}
        <div className="flex items-center gap-3">
          {/* Beams Radar Pill */}
          <button
            type="button"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-coral-500 animate-pulse" />
            <span>Beams</span>
          </button>

          {/* Notification Bell */}
          <button
            type="button"
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-coral-500 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-sidebar-bg text-white font-black text-xs flex items-center justify-center border-2 border-slate-200 shadow-xs uppercase">
                  {user?.name.slice(0, 2)}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-slate-800 leading-tight">
                    {user?.name || 'Adam Smith'}
                  </p>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    {user?.role === 'OPERATOR' ? 'Dispatch Lead' : user?.role}
                  </span>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-coral-500 hover:bg-coral-600 text-white rounded-xl text-xs font-bold shadow-sm shadow-coral-500/20 transition-all"
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
