import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Bus, User, LogOut, ShieldCheck, Ticket, Calendar, Globe, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isOperator, isAdmin } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo matching the reference visual */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-12 h-10 bg-brand-500 rounded-xl shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
                <Bus className="w-6 h-6 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-600"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  rova<span className="text-brand-500">.</span>
                </span>
                <span className="text-[10px] tracking-wider text-slate-400 font-semibold uppercase -mt-1 hidden sm:block">
                  Express Travel
                </span>
              </div>
            </Link>

            {/* Navigation Links matching the reference */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Asosiy
              </Link>
              <Link
                to="/my-bookings"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/my-bookings') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Buyurtmalaringiz
              </Link>
              <Link
                to="/ticket-lookup"
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/ticket-lookup') ? 'text-brand-600 bg-brand-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Chiptani olish
              </Link>
              <Link
                to="/operator"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/operator') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Operator Portal
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive('/admin') ? 'text-purple-700 bg-purple-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  Audit & Admin
                </Link>
              )}
            </nav>

            {/* Right Action buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Currency/Language pill */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold cursor-pointer transition-colors">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>UZB</span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-500">so'm</span>
              </div>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center gap-2 pl-2">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase border border-brand-300">
                      {user?.name.slice(0, 2)}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                      <span className="inline-block text-[10px] text-brand-600 font-semibold uppercase">
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Log out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Asosiy (Home)
            </Link>
            <Link
              to="/my-bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Buyurtmalaringiz (My Bookings)
            </Link>
            <Link
              to="/ticket-lookup"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-slate-50"
            >
              Chiptani olish (Ticket Lookup)
            </Link>
            <Link
              to="/operator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-emerald-700 hover:bg-emerald-50"
            >
              Operator Portal
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-purple-700 hover:bg-purple-50"
              >
                Admin & Audit Logs
              </Link>
            )}

            <div className="pt-4 border-t border-slate-100">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" /> Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenAuth('login')}
                    className="flex-1 py-2.5 text-center text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => handleOpenAuth('register')}
                    className="flex-1 py-2.5 text-center text-sm font-bold text-white bg-brand-500 rounded-xl"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
