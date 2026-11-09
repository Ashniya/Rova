import React from 'react';
import { Booking } from '../types';
import { format } from 'date-fns';
import { Printer, X, Download, ShieldCheck, MapPin, Calendar, User, Clock, AlertCircle } from 'lucide-react';

interface TicketCardProps {
  booking: Booking;
  onClose?: () => void;
  onCancelRequest?: (pnr: string) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  booking,
  onClose,
  onCancelRequest,
}) => {
  const departureDate = new Date(booking.trip.departureTime);
  const arrivalDate = new Date(booking.trip.arrivalTime);
  const isCancelled = booking.status === 'CANCELLED';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden print:m-0 print:border-none print:shadow-none">
      {/* Top Banner */}
      <div className={`p-6 text-white ${isCancelled ? 'bg-slate-700' : 'bg-gradient-to-r from-slate-900 to-slate-800'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-8 bg-brand-500 rounded-xl flex items-center justify-center font-bold text-white text-lg">
              r.
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-brand-400">
                Official E-Ticket & Boarding Pass
              </span>
              <h3 className="text-xl font-black">Rova Intercity Express</h3>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-700 transition-colors print:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* PNR Banner */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/15">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-300">Booking Reference (PNR)</span>
            <p className="text-2xl font-black tracking-widest text-brand-400 font-mono">{booking.pnr}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-300">Status</span>
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  isCancelled ? 'bg-red-500 text-white' : 'bg-brand-500 text-slate-950'
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Ticket Body with notches */}
      <div className="relative p-6 sm:p-8 space-y-6">
        <div className="ticket-notch-left"></div>
        <div className="ticket-notch-right"></div>

        {/* Route and Schedule Visual */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Origin */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase">
                <MapPin className="w-3.5 h-3.5 text-brand-500" />
                <span>Origin</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-1">{booking.trip.route.origin}</p>
              <p className="text-sm font-bold text-brand-600 mt-0.5">
                {format(departureDate, 'HH:mm')}
              </p>
              <p className="text-xs text-slate-500">{format(departureDate, 'dd MMMM yyyy')}</p>
            </div>

            {/* Travel Line */}
            <div className="flex flex-col items-center justify-center py-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {booking.trip.bus.busType.replace('_', ' ')}
              </span>
              <div className="w-full flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500"></div>
                <div className="flex-1 border-b-2 border-dashed border-slate-300 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-slate-50 text-[10px] text-slate-400 font-bold">
                    DIRECT
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
              </div>
              <span className="text-xs font-semibold text-slate-600 mt-1">{booking.trip.bus.name}</span>
            </div>

            {/* Destination */}
            <div className="md:text-right">
              <div className="flex items-center md:justify-end gap-1.5 text-xs font-bold text-slate-400 uppercase">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Destination</span>
              </div>
              <p className="text-xl font-black text-slate-900 mt-1">{booking.trip.route.destination}</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">
                {format(arrivalDate, 'HH:mm')}
              </p>
              <p className="text-xs text-slate-500">{format(arrivalDate, 'dd MMMM yyyy')}</p>
            </div>
          </div>
        </div>

        {/* Passenger & Allocated Seats Matrix */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Passenger & Seat Allocations
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
            {booking.bookingSeats.map((bs, index) => (
              <div key={bs.id || index} className="p-4 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{bs.passengerName}</p>
                    <p className="text-xs text-slate-500">
                      {bs.passengerGender} • {bs.passengerAge} years
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Seat Number</span>
                  <div className="px-3 py-1 bg-brand-50 border border-brand-200 text-brand-700 rounded-xl font-black text-base">
                    {bs.seat?.seatNumber || 'Assigned'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Contact Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Contact Email</span>
            <p className="text-xs font-bold text-slate-800 truncate">{booking.contactEmail}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Phone</span>
            <p className="text-xs font-bold text-slate-800">{booking.contactPhone}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Fare Paid</span>
            <p className="text-sm font-black text-brand-600">
              {booking.totalAmount.toLocaleString()} UZS
            </p>
          </div>
        </div>

        {/* Barcode graphic footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center">
          <div className="flex items-center gap-1 h-10 w-full max-w-xs justify-center">
            {[
              '#10B981', '#1E293B', '#1E293B', '#F59E0B', '#1E293B', '#EC4899', '#1E293B',
              '#10B981', '#1E293B', '#3B82F6', '#1E293B', '#1E293B', '#10B981', '#1E293B',
              '#F59E0B', '#1E293B', '#EC4899', '#10B981', '#1E293B', '#3B82F6', '#1E293B',
              '#1E293B', '#10B981', '#1E293B', '#F59E0B', '#1E293B'
            ].map((col, idx) => (
              <div
                key={idx}
                className="w-1 rounded-sm"
                style={{
                  height: idx % 3 === 0 ? '100%' : idx % 2 === 0 ? '80%' : '65%',
                  backgroundColor: col,
                }}
              ></div>
            ))}
          </div>
          <p className="text-[10px] font-mono tracking-widest text-slate-400 mt-2">
            *{booking.pnr}* • ROVA SECURITY VALIDATED
          </p>
        </div>

        {/* Cancellation Notice if Cancelled */}
        {isCancelled && booking.refund && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-800">
            <div className="flex items-center gap-2 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>Ticket Cancelled</span>
            </div>
            <p>
              Refund of <strong>{booking.refund.refundAmount.toLocaleString()} UZS</strong> processed
              (Deduction: {booking.refund.deductionAmount.toLocaleString()} UZS).
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print Ticket / PDF</span>
          </button>

          {!isCancelled && onCancelRequest && (
            <button
              onClick={() => onCancelRequest(booking.pnr)}
              className="px-4 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors border border-red-200"
            >
              Cancel Ticket & Refund
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
