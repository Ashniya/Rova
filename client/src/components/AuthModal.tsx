import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Building, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'PASSENGER' | 'OPERATOR'>('PASSENGER');
  const [operatorName, setOperatorName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, role, operatorName);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setMode('login');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse"></div>
            <span className="text-xs uppercase font-bold tracking-wider text-brand-400">
              Rova Platform Access
            </span>
          </div>
          <h3 className="text-2xl font-black">
            {mode === 'login' ? 'Welcome back to Rova' : 'Create your account'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {mode === 'login'
              ? 'Access your saved trips, manifests and operator tools'
              : 'Join thousands of seamless travelers and verified operators'}
          </p>
        </div>

        {/* Quick Demo Logins Pill */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            ⚡ Quick Demo Logins (Click to autofill):
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setDemoAccount('gozal@example.com', 'password123')}
              className="px-2 py-1.5 bg-white hover:bg-brand-50 border border-slate-200 hover:border-brand-300 rounded-lg text-left text-[11px] font-semibold text-slate-700 hover:text-brand-700 transition-colors"
            >
              👤 Passenger
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('operator@silkroad.com', 'operator123')}
              className="px-2 py-1.5 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-lg text-left text-[11px] font-semibold text-slate-700 hover:text-emerald-700 transition-colors"
            >
              🚌 Operator
            </button>
            <button
              type="button"
              onClick={() => setDemoAccount('admin@rova.com', 'admin123')}
              className="px-2 py-1.5 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-lg text-left text-[11px] font-semibold text-slate-700 hover:text-purple-700 transition-colors"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jasur Rakhimov"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('PASSENGER')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      role === 'PASSENGER'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Passenger
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('OPERATOR')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      role === 'OPERATOR'
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Bus Operator
                  </button>
                </div>
              </div>

              {role === 'OPERATOR' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Fleet / Agency Name</label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={operatorName}
                      onChange={(e) => setOperatorName(e.target.value)}
                      placeholder="e.g. SilkRoad Star Express"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-coral-500 hover:bg-coral-600 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In to Rova' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Toggle between Login and Register */}
          <div className="text-center pt-2">
            {mode === 'login' ? (
              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                  }}
                  className="font-bold text-brand-600 hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-500">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-bold text-brand-600 hover:underline"
                >
                  Sign in instead
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
