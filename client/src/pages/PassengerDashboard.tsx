import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Ticket,
  Bus,
  Clock,
  MapPin,
  Calendar,
  Download,
  AlertCircle,
  CheckCircle2,
  X,
  CreditCard,
  QrCode,
  Shield,
  ArrowRight,
  Printer,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CancelModal from '../components/CancelModal';

export const PassengerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cancellingPnr, setCancellingPnr] = useState<string | null>(null);
  const [viewingTicket, setViewingTicket] = useState<any>(null);

  // Read booked tickets or fallback to demo Punjab journey
  const myTrips = [
    {
      pnr: 'PB982142',
      passengerName: user?.name || 'Harpreet Singh',
      route: 'Amritsar ISBT ──▶ Chandigarh Sector 17',
      coach: 'StarLiner Scania Touring (PB-02-AK-9921)',
      departure: 'Today, 06:30 AM (Bay 02)',
      arrival: 'Today, 10:45 AM (Platform 05)',
      seats: ['C1', 'C2'],
      paidAmount: 1304.50,
      status: 'CONFIRMED',
      boardingPoint: 'Amritsar Central Counter',
      busLiveStatus: 'En-route near Jalandhar Bypass • 68 km/h • ETA 42m',
    },
    {
      pnr: 'PB441290',
      passengerName: user?.name || 'Harpreet Singh',
      route: 'Chandigarh ──▶ Shimla Hills Liner',
      coach: 'Northern Shivalik Vista (CH-01-GA-3091)',
      departure: '15 Nov, 07:15 AM (Bay 01)',
      arrival: '15 Nov, 11:00 AM (Shimla Old ISBT)',
      seats: ['A3'],
      paidAmount: 550.00,
      status: 'CONFIRMED',
      boardingPoint: 'Sector 17 ISBT Counter 4',
      busLiveStatus: 'Scheduled on-time',
    },
  ];

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-[1500px] mx-auto animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#B91C1C] to-[#991B1B] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
            <span>PASSENGER PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Welcome back, {user?.name || 'Harpreet'}!
          </h1>
          <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl">
            Track your active intercity journeys across Punjab, download digital boarding passes with QR codes, or manage cancellations.
          </p>
        </div>

        <button
          onClick={() => navigate('/bookings')}
          className="px-6 py-3 bg-white text-[#B91C1C] hover:bg-red-50 font-black text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <span>+ Book Another Journey</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>

      {/* Active Trip Live Radar Callout */}
      <div className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping"></span>
            <span className="text-xs font-black text-[#1C1917] uppercase tracking-wider">
              LIVE EXPEDITION TRACKER
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-[#B91C1C]">
            PNR: PB982142
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-[#1C1917]">
                Amritsar ISBT ──▶ Chandigarh Sector 17
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                On Schedule
              </span>
            </div>

            {/* Moving Coach Progress Bar */}
            <div className="w-full bg-[#F3EFEA] h-3 rounded-full overflow-hidden relative">
              <div className="bg-[#B91C1C] h-full w-[65%] rounded-full relative">
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#B91C1C]"></span>
              </div>
            </div>

            <div className="flex justify-between text-[11px] text-[#78716C] font-semibold">
              <span>Departed Amritsar (06:30 AM)</span>
              <span className="font-bold text-[#10B981]">Near Jalandhar Bypass • 68 km/h</span>
              <span>ETA: 42 mins (Chandigarh)</span>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#FBF9F7] p-4 rounded-2xl border border-[#E7E2DA] flex items-center justify-between">
            <div>
              <p className="text-[10px] text-stone-400 font-bold uppercase">Your Seats</p>
              <p className="text-xl font-black text-[#B91C1C]">C1, C2</p>
              <p className="text-[10px] text-stone-500 font-medium">Recliner Lower Deck</p>
            </div>
            <button
              onClick={() => setViewingTicket(myTrips[0])}
              className="px-4 py-2 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              View Ticket QR
            </button>
          </div>
        </div>
      </div>

      {/* Confirmed Tickets List */}
      <div className="space-y-4">
        <h2 className="text-base font-black text-[#1C1917] uppercase tracking-wider">
          My Active &amp; Upcoming Boarding Passes ({myTrips.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {myTrips.map((trip) => (
            <div
              key={trip.pnr}
              className="bg-white rounded-3xl p-6 border border-[#E7E2DA] shadow-card space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-[#B91C1C] text-white font-mono text-xs font-black rounded-lg">
                      PNR: {trip.pnr}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                      {trip.status}
                    </span>
                  </div>
                  <span className="text-xs font-black text-[#1C1917]">
                    ₹{trip.paidAmount.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  <h3 className="text-base font-black text-[#1C1917]">{trip.route}</h3>
                  <p className="text-xs text-stone-500 font-medium">{trip.coach}</p>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-bold uppercase">Departure</span>
                      <span className="font-bold text-[#1C1917]">{trip.departure}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-bold uppercase">Seats</span>
                      <span className="font-mono font-bold text-[#B91C1C]">{trip.seats.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setViewingTicket(trip)}
                  className="flex-1 py-2.5 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-[#1C1917] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5 text-[#B91C1C]" />
                  <span>Show Boarding QR</span>
                </button>

                <button
                  onClick={() => setCancellingPnr(trip.pnr)}
                  className="py-2.5 px-4 text-xs font-bold text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                >
                  Cancel Ticket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket QR Modal with Close Button */}
      {viewingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E7E2DA] space-y-5 relative">
            {/* Top Close 'X' Button */}
            <button
              onClick={() => setViewingTicket(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <span className="px-3 py-1 bg-red-50 text-[#B91C1C] font-mono text-xs font-black rounded-full">
                PNR: {viewingTicket.pnr}
              </span>
              <h3 className="text-lg font-black text-[#1C1917] mt-1">Official Boarding Pass</h3>
              <p className="text-xs text-stone-500">Scan at boarding gate terminal</p>
            </div>

            {/* Big Simulated QR Code */}
            <div className="p-6 bg-[#FBF9F7] rounded-3xl border border-[#E7E2DA] flex flex-col items-center justify-center space-y-3">
              <div className="w-40 h-40 bg-white p-3 rounded-2xl border-2 border-stone-800 flex items-center justify-center shadow-xs">
                <QrCode className="w-32 h-32 text-stone-900" />
              </div>
              <span className="text-[10px] font-mono font-bold text-stone-500">
                ENCRYPTED TRANSIT TOKEN: RV-PUNJAB-{viewingTicket.pnr}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">Passenger:</span>
                <span className="font-bold text-[#1C1917]">{viewingTicket.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Route Corridor:</span>
                <span className="font-bold text-[#1C1917]">{viewingTicket.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Seats Reserved:</span>
                <span className="font-mono font-bold text-[#B91C1C]">{viewingTicket.seats.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Departure:</span>
                <span className="font-bold text-[#1C1917]">{viewingTicket.departure}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-[#F3EFEA] hover:bg-[#EAE4DC] text-[#1C1917] font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Ticket</span>
              </button>
              <button
                onClick={() => setViewingTicket(null)}
                className="flex-1 py-3 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                Close Pass
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal with explicit Close button */}
      {cancellingPnr && (
        <CancelModal
          pnr={cancellingPnr}
          isOpen={true}
          onClose={() => setCancellingPnr(null)}
          onSuccess={() => setCancellingPnr(null)}
        />
      )}
    </div>
  );
};

export default PassengerDashboard;
