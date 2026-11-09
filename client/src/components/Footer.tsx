import React from 'react';
import { Link } from 'react-router-dom';
import { Bus, ShieldCheck, Heart, FileText, Code2, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-8 bg-brand-500 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-brand-500/20">
                <Bus className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight">
                rova<span className="text-brand-500">.</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-brand-400">
              Where routes become journeys.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Find the right connection, choose your seat, and make your next destination closer than ever. From the first search to the final arrival, Rova brings your travel experience together.
            </p>

            <p className="text-[11px] text-slate-500 italic">
              Explore freely. Travel seamlessly. Arrive confidently.
            </p>
          </div>

          {/* Quick Platform Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Passenger Journeys
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">
                  Explore Departures
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-brand-400 transition-colors">
                  Buyurtmalaringiz (My Bookings)
                </Link>
              </li>
              <li>
                <Link to="/ticket-lookup" className="hover:text-brand-400 transition-colors">
                  Chiptani olish (Ticket Lookup)
                </Link>
              </li>
              <li>
                <a
                  href="/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-brand-400 font-bold hover:underline"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>OpenAPI / Swagger Docs</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Operations & Assessment */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Operational Staff & Submission Info
            </h4>
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/60 text-xs text-slate-300 space-y-2">
              <div className="flex items-center gap-2 text-brand-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>ALGIONS AI LABS ASSESSMENT</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Full-Stack Web Development | Bus Booking Management System
              </p>
              <div className="pt-2 border-t border-slate-700/60 text-[10px] text-slate-400">
                <span>Demo logins: </span>
                <span className="font-mono text-slate-300">passenger@example.com</span> /{' '}
                <span className="font-mono text-slate-300">operator@silkroad.com</span> /{' '}
                <span className="font-mono text-slate-300">admin@rova.com</span> (Password: <span className="font-mono text-brand-400">password123</span> / <span className="font-mono text-brand-400">admin123</span>)
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Rova Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Engineered with React 19, TypeScript, Node.js & Prisma</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
