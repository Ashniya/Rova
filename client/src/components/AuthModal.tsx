import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Mail, User as UserIcon, Bus, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess?: () => void;
  defaultRole?: 'PASSENGER' | 'DRIVER' | 'ADMIN';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
  defaultRole = 'PASSENGER',
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRoleTab, setSelectedRoleTab] = useState<'PASSENGER' | 'DRIVER' | 'ADMIN'>(defaultRole);
  const [email, setEmail] = useState('gozal@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSelectRole = (r: 'PASSENGER' | 'DRIVER' | 'ADMIN') => {
    setSelectedRoleTab(r);
    setError(null);
    if (r === 'PASSENGER') {
      setEmail('gozal@example.com');
      setPassword('password123');
    } else if (r === 'DRIVER') {
      setEmail('operator@silkroad.com');
      setPassword('operator123');
    } else {
      setEmail('admin@rova.com');
      setPassword('admin123');
    }
  };

  const handleDirectRoleLogin = async (r: 'PASSENGER' | 'DRIVER' | 'ADMIN') => {
    setError(null);
    setLoading(true);
    let targetEmail = 'gozal@example.com';
    let targetPass = 'password123';
    let redirectUrl = '/passenger';

    if (r === 'PASSENGER') {
      targetEmail = 'gozal@example.com';
      targetPass = 'password123';
      redirectUrl = '/passenger';
    } else if (r === 'DRIVER') {
      targetEmail = 'operator@silkroad.com';
      targetPass = 'operator123';
      redirectUrl = '/driver';
    } else if (r === 'ADMIN') {
      targetEmail = 'admin@rova.com';
      targetPass = 'admin123';
      redirectUrl = '/admin';
    }

    try {
      await login(targetEmail, targetPass);
      onClose();
      if (onSuccess) onSuccess();
      navigate(redirectUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        const backendRole = selectedRoleTab === 'PASSENGER' ? 'PASSENGER' : selectedRoleTab === 'DRIVER' ? 'OPERATOR' : 'ADMIN';
        await register(name, email, password, backendRole);
      }
      onClose();
      if (onSuccess) onSuccess();

      if (selectedRoleTab === 'PASSENGER') navigate('/passenger');
      else if (selectedRoleTab === 'DRIVER') navigate('/driver');
      else navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl overflow-hidden border border-[#E7E2DA] dark:border-stone-800">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-[#1C1917] text-white border-b border-stone-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B91C1C] animate-pulse"></span>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#F59E0B]">
              ROVA EXPEDITIONS & FLEET • PORTAL ACCESS
            </span>
          </div>
          <h3 className="text-2xl font-black tracking-tight">
            {mode === 'login' ? 'Select Your Portal' : 'Register New Account'}
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Sign in to access your designated passenger booking, driver bus HUD, or platform admin center.
          </p>
        </div>

        {/* 3 Explicit Role Cards */}
        <div className="p-4 bg-[#FBF9F7] dark:bg-stone-950 border-b border-[#E7E2DA] dark:border-stone-800 space-y-2">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
            Choose Role Portal (Click to autofill & switch):
          </span>
          <div className="grid grid-cols-3 gap-2">
            {/* Passenger Tab */}
            <button
              type="button"
              onClick={() => handleSelectRole('PASSENGER')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedRoleTab === 'PASSENGER'
                  ? 'border-[#B91C1C] bg-red-50/80 dark:bg-red-950/30 ring-2 ring-[#B91C1C]/20 shadow-xs'
                  : 'border-[#E7E2DA] dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">👤</span>
                {selectedRoleTab === 'PASSENGER' && (
                  <span className="w-2 h-2 rounded-full bg-[#B91C1C]"></span>
                )}
              </div>
              <h4 className="text-xs font-black text-[#1C1917] dark:text-white">Passenger</h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5">
                Book seats & view e-tickets
              </p>
            </button>

            {/* Driver Tab */}
            <button
              type="button"
              onClick={() => handleSelectRole('DRIVER')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedRoleTab === 'DRIVER'
                  ? 'border-[#B91C1C] bg-red-50/80 dark:bg-red-950/30 ring-2 ring-[#B91C1C]/20 shadow-xs'
                  : 'border-[#E7E2DA] dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">🚌</span>
                {selectedRoleTab === 'DRIVER' && (
                  <span className="w-2 h-2 rounded-full bg-[#B91C1C]"></span>
                )}
              </div>
              <h4 className="text-xs font-black text-[#1C1917] dark:text-white">Driver</h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5">
                My assigned bus & live seats
              </p>
            </button>

            {/* Admin Tab */}
            <button
              type="button"
              onClick={() => handleSelectRole('ADMIN')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                selectedRoleTab === 'ADMIN'
                  ? 'border-[#B91C1C] bg-red-50/80 dark:bg-red-950/30 ring-2 ring-[#B91C1C]/20 shadow-xs'
                  : 'border-[#E7E2DA] dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-base">🛡️</span>
                {selectedRoleTab === 'ADMIN' && (
                  <span className="w-2 h-2 rounded-full bg-[#B91C1C]"></span>
                )}
              </div>
              <h4 className="text-xs font-black text-[#1C1917] dark:text-white">Platform Admin</h4>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-tight mt-0.5">
                Revenue & assign drivers
              </p>
            </button>
          </div>

          {/* 1-Click Instant Enter Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDirectRoleLogin(selectedRoleTab)}
              className="w-full py-2.5 px-4 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>
                ⚡ Instant 1-Click Login as{' '}
                {selectedRoleTab === 'PASSENGER'
                  ? 'Passenger'
                  : selectedRoleTab === 'DRIVER'
                  ? 'Bus Driver (Gurpreet Singh)'
                  : 'Platform Admin'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gurpreet Singh"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Registered Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#1C1917] hover:bg-black text-white font-black text-xs rounded-xl transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? 'Authenticating...'
                : mode === 'login'
                ? `Log in to ${selectedRoleTab === 'PASSENGER' ? 'Passenger View' : selectedRoleTab === 'DRIVER' ? 'Driver HUD' : 'Admin Portal'}`
                : 'Create Account'}
            </button>
          </div>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
              }}
              className="text-xs font-bold text-[#B91C1C] hover:underline cursor-pointer"
            >
              {mode === 'login'
                ? "Don't have an account? Register new user"
                : 'Already have credentials? Back to Log In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
