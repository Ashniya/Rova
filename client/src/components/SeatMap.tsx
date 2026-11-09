import React from 'react';
import { Seat } from '../types';
import { Armchair, Check, Lock, Heart, SteeringWheel as Steering } from 'lucide-react';

interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seat: Seat) => void;
  maxSeats?: number;
  layoutType?: string;
}

export const SeatMap: React.FC<SeatMapProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  maxSeats = 6,
  layoutType = '2x2',
}) => {
  // Group seats by row
  const rowsMap = new Map<number, Seat[]>();
  seats.forEach((seat) => {
    const rowList = rowsMap.get(seat.row) || [];
    rowList.push(seat);
    rowsMap.set(seat.row, rowList);
  });

  const sortedRows = Array.from(rowsMap.keys()).sort((a, b) => a - b);

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-100 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg border-2 border-slate-200 bg-white shadow-xs"></div>
          <span className="text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-brand-500 text-white flex items-center justify-center shadow-xs">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="text-slate-900 font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-slate-300 text-slate-500 flex items-center justify-center">
            <Lock className="w-3 h-3" />
          </div>
          <span className="text-slate-400">Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg border-2 border-pink-300 bg-pink-50 text-pink-600 flex items-center justify-center">
            <Heart className="w-2.5 h-2.5 fill-pink-500 text-pink-500" />
          </div>
          <span className="text-pink-600">Women-Preferred</span>
        </div>
      </div>

      {/* Realistic Bus Chassis Container */}
      <div className="max-w-md mx-auto my-6 p-6 bg-slate-50/80 rounded-[2.5rem] border-2 border-dashed border-slate-200 relative">
        {/* Front of the Bus Header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200">
          <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-500">
            <span>🚪 Entrance</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Front Cabin
            </span>
            <div className="w-12 h-1 bg-slate-300 rounded-full mt-1"></div>
          </div>
          <div className="flex items-center justify-center w-9 h-9 bg-slate-800 text-white rounded-xl shadow-sm" title="Driver Cabin">
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-brand-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Seat Rows Matrix */}
        <div className="space-y-3">
          {sortedRows.map((rowNum) => {
            const rowSeats = rowsMap.get(rowNum) || [];
            // Sort seats by column
            rowSeats.sort((a, b) => a.column - b.column);

            // Split into Left Side and Right Side by Aisle
            const leftSeats = layoutType === '2x1' ? rowSeats.slice(0, 2) : rowSeats.slice(0, 2);
            const rightSeats = layoutType === '2x1' ? rowSeats.slice(2, 3) : rowSeats.slice(2, 4);

            return (
              <div key={rowNum} className="flex items-center justify-between">
                {/* Left Side */}
                <div className="flex items-center gap-2">
                  {leftSeats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isBooked = !seat.isAvailable;

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={isBooked}
                        onClick={() => onToggleSeat(seat)}
                        className={`relative group w-11 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 ${
                          isSelected
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30 scale-105 border-2 border-brand-400'
                            : isBooked
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                            : seat.isWomenOnly
                            ? 'bg-pink-50 text-pink-700 border-2 border-pink-200 hover:border-brand-500 hover:bg-white shadow-xs'
                            : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-brand-500 hover:shadow-sm'
                        }`}
                        title={`Seat ${seat.seatNumber} (${seat.seatType}) - ${
                          isBooked ? 'Booked' : `${seat.price.toLocaleString()} UZS`
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : isBooked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : seat.isWomenOnly ? (
                          <Heart className="w-3 h-3 fill-pink-500 text-pink-500 mb-0.5" />
                        ) : (
                          <Armchair className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        )}
                        <span className="text-[11px] leading-none mt-0.5">{seat.seatNumber}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Central Aisle */}
                <div className="w-8 flex items-center justify-center">
                  <span className="text-[10px] font-mono text-slate-300">R{rowNum}</span>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2">
                  {rightSeats.map((seat) => {
                    const isSelected = selectedSeatIds.includes(seat.id);
                    const isBooked = !seat.isAvailable;

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={isBooked}
                        onClick={() => onToggleSeat(seat)}
                        className={`relative group w-11 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 ${
                          isSelected
                            ? 'bg-brand-500 text-white shadow-md shadow-brand-500/30 scale-105 border-2 border-brand-400'
                            : isBooked
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200'
                            : seat.isWomenOnly
                            ? 'bg-pink-50 text-pink-700 border-2 border-pink-200 hover:border-brand-500 hover:bg-white shadow-xs'
                            : 'bg-white text-slate-800 border-2 border-slate-200 hover:border-brand-500 hover:shadow-sm'
                        }`}
                        title={`Seat ${seat.seatNumber} (${seat.seatType}) - ${
                          isBooked ? 'Booked' : `${seat.price.toLocaleString()} UZS`
                        }`}
                      >
                        {isSelected ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : isBooked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : seat.isWomenOnly ? (
                          <Heart className="w-3 h-3 fill-pink-500 text-pink-500 mb-0.5" />
                        ) : (
                          <Armchair className="w-3.5 h-3.5 text-slate-400 group-hover:text-brand-500 transition-colors" />
                        )}
                        <span className="text-[11px] leading-none mt-0.5">{seat.seatNumber}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rear of the Bus */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Rear Section
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
