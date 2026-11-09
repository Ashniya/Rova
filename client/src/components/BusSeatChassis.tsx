import React from 'react';
import { Armchair, Check, Lock, User } from 'lucide-react';

export interface PassengerInfo {
  seat: string;
  name: string;
  phone?: string;
  boarding?: string;
  dropping?: string;
  pnr?: string;
  fare?: number;
}

interface BusSeatChassisProps {
  bookedSeatCodes: string[];
  selectedSeatCodes?: string[];
  onToggleSeat?: (seatCode: string) => void;
  interactive?: boolean;
  passengerMap?: Record<string, PassengerInfo>;
  onHoverSeat?: (info: PassengerInfo | null) => void;
  onClickSeat?: (info: PassengerInfo | null) => void;
  hoveredSeatCode?: string | null;
}

export const BusSeatChassis: React.FC<BusSeatChassisProps> = ({
  bookedSeatCodes = [],
  selectedSeatCodes = [],
  onToggleSeat,
  interactive = true,
  passengerMap = {},
  onHoverSeat,
  onClickSeat,
  hoveredSeatCode,
}) => {
  // Front VIP Rows (2 on left, 1 on right: Orange, Green, Yellow)
  const vipRows = [
    { rowNum: 1, left: [{ code: 'V1', color: 'bg-[#F97316] text-white', label: 'V1' }, { code: 'V2', color: 'bg-[#84CC16] text-white', label: 'V2' }], right: [{ code: 'V3', color: 'bg-[#EAB308] text-stone-900', label: 'V3' }] },
    { rowNum: 2, left: [{ code: 'V4', color: 'bg-[#F97316] text-white', label: 'V4' }, { code: 'V5', color: 'bg-[#84CC16] text-white', label: 'V5' }], right: [{ code: 'V6', color: 'bg-[#EAB308] text-stone-900', label: 'V6' }] },
    { rowNum: 3, left: [{ code: 'V7', color: 'bg-[#F97316] text-white', label: 'V7' }, { code: 'V8', color: 'bg-[#84CC16] text-white', label: 'V8' }], right: [{ code: 'V9', color: 'bg-[#EAB308] text-stone-900', label: 'V9' }] },
  ];

  // Rear Standard Rows (2+2 Cyan/Blue)
  const standardRows = [
    { rowNum: 4, left: ['S1', 'S2'], right: ['S3', 'S4'] },
    { rowNum: 5, left: ['S5', 'S6'], right: ['S7', 'S8'] },
    { rowNum: 6, left: ['S9', 'S10'], right: ['S11', 'S12'] },
    { rowNum: 7, left: ['S13', 'S14'], right: ['S15', 'S16'] },
    { rowNum: 8, left: ['S17', 'S18'], right: ['S19', 'S20'] },
    { rowNum: 9, left: ['S21', 'S22'], right: ['S23', 'S24'] },
    { rowNum: 10, left: ['S25', 'S26'], right: ['S27', 'S28'] },
  ];

  const renderSeat = (code: string, defaultColorClass: string, isVip = false) => {
    const isBooked = bookedSeatCodes.includes(code);
    const isSelected = selectedSeatCodes.includes(code);
    const isHovered = hoveredSeatCode === code;
    const passenger = passengerMap[code];

    return (
      <button
        key={code}
        type="button"
        disabled={!interactive && !isBooked}
        onClick={() => {
          if (interactive && !isBooked && onToggleSeat) {
            onToggleSeat(code);
          } else if (isBooked && onClickSeat) {
            onClickSeat(passenger || { seat: code, name: 'Booked Passenger' });
          }
        }}
        onMouseEnter={() => {
          if (onHoverSeat) {
            onHoverSeat(passenger || (isBooked ? { seat: code, name: 'Booked Passenger' } : null));
          }
        }}
        onMouseLeave={() => {
          if (onHoverSeat) onHoverSeat(null);
        }}
        className={`w-9 h-11 sm:w-10 sm:h-12 rounded-xl flex flex-col items-center justify-center font-bold text-[10px] transition-all relative ${
          isSelected
            ? 'bg-emerald-500 text-white ring-4 ring-emerald-300 scale-105 shadow-md z-10'
            : isBooked
            ? 'bg-[#B91C1C] text-white cursor-pointer shadow-xs hover:bg-[#991B1B] hover:scale-105'
            : `${defaultColorClass} hover:opacity-90 hover:scale-105 shadow-xs cursor-pointer`
        } ${isHovered ? 'ring-2 ring-white scale-110 z-20' : ''}`}
        title={
          isBooked
            ? `Seat ${code} - Booked by ${passenger?.name || 'Passenger'}`
            : `Seat ${code} - Available (${isVip ? 'VIP Tier' : 'Executive Tier'})`
        }
      >
        {isSelected ? (
          <Check className="w-4 h-4 stroke-[3]" />
        ) : isBooked ? (
          <span className="text-[8px] font-black font-mono leading-none">SOLD</span>
        ) : (
          <div className="w-3.5 h-3.5 rounded-sm border-2 border-white/60 mb-0.5"></div>
        )}
        <span className="leading-none text-[9px] font-mono mt-0.5">{code}</span>
      </button>
    );
  };

  return (
    <div className="relative mx-auto select-none max-w-[280px]">
      {/* Outer Coach Outline matching user image */}
      <div className="relative bg-[#E5E7EB] dark:bg-stone-800 rounded-[44px] p-4 pt-6 pb-6 border-4 border-stone-800 dark:border-stone-900 shadow-2xl space-y-4">
        {/* Left and Right Side Mirrors at top */}
        <div className="absolute -left-2 top-16 w-2 h-6 bg-stone-900 rounded-l-md"></div>
        <div className="absolute -right-2 top-16 w-2 h-6 bg-stone-900 rounded-r-md"></div>

        {/* Wheel Arches on sides */}
        <div className="absolute -left-2.5 top-36 w-2.5 h-12 bg-stone-900 rounded-l-lg"></div>
        <div className="absolute -right-2.5 top-36 w-2.5 h-12 bg-stone-900 rounded-r-lg"></div>
        <div className="absolute -left-2.5 bottom-24 w-2.5 h-14 bg-stone-900 rounded-l-lg"></div>
        <div className="absolute -right-2.5 bottom-24 w-2.5 h-14 bg-stone-900 rounded-r-lg"></div>

        {/* Top Front Area: Attendant Seat (Left) & Driver Cabin (Right) */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-stone-300 dark:border-stone-700">
          {/* Attendant Seat (Orange) */}
          <div className="flex flex-col items-center">
            <div className="w-9 h-11 bg-[#F97316] rounded-xl flex flex-col items-center justify-center text-white shadow-xs">
              <span className="text-[8px] font-bold">GUIDE</span>
            </div>
            <span className="text-[8px] text-stone-500 font-bold mt-1">Attendant</span>
          </div>

          {/* Front Windshield Indicator */}
          <div className="flex-1 text-center">
            <div className="w-10 h-1 bg-stone-400 rounded-full mx-auto"></div>
            <span className="text-[7px] font-black uppercase tracking-widest text-stone-400">FRONT</span>
          </div>

          {/* Driver Cabin (Black background with steering wheel and orange driver seat) */}
          <div className="bg-[#1C1917] p-1.5 rounded-2xl flex flex-col items-center border border-stone-700 shadow-md">
            {/* Steering wheel icon */}
            <div className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center mb-1">
              <div className="w-2.5 h-2.5 rounded-full border border-white"></div>
            </div>
            <div className="w-8 h-9 bg-[#F97316] rounded-lg flex items-center justify-center text-white">
              <span className="text-[8px] font-black">DRIVER</span>
            </div>
          </div>
        </div>

        {/* SECTION 1: Front VIP Rows (Rows 1-3: Orange, Green, Yellow) */}
        <div className="space-y-2.5 pt-1">
          {vipRows.map((row) => (
            <div key={row.rowNum} className="flex items-center justify-between">
              {/* Left Pair */}
              <div className="flex items-center gap-1.5">
                {row.left.map((s) => renderSeat(s.code, s.color, true))}
              </div>

              {/* Aisle */}
              <div className="w-5 text-center">
                <span className="text-[8px] font-mono text-stone-400 font-bold">R{row.rowNum}</span>
              </div>

              {/* Right Single */}
              <div className="flex items-center justify-end">
                {row.right.map((s) => renderSeat(s.code, s.color, true))}
              </div>
            </div>
          ))}
        </div>

        {/* Transition / Aisle Divider */}
        <div className="py-1">
          <div className="h-0.5 bg-stone-300 dark:bg-stone-700 rounded-full"></div>
        </div>

        {/* SECTION 2: Standard Executive Rows (Rows 4-10: Cyan/Blue 2+2) */}
        <div className="space-y-2.5">
          {standardRows.map((row) => (
            <div key={row.rowNum} className="flex items-center justify-between">
              {/* Left Pair */}
              <div className="flex items-center gap-1.5">
                {row.left.map((code) => renderSeat(code, 'bg-[#0EA5E9] text-white', false))}
              </div>

              {/* Aisle */}
              <div className="w-5 text-center">
                <span className="text-[8px] font-mono text-stone-400 font-bold">R{row.rowNum}</span>
              </div>

              {/* Right Pair */}
              <div className="flex items-center gap-1.5">
                {row.right.map((code) => renderSeat(code, 'bg-[#0EA5E9] text-white', false))}
              </div>
            </div>
          ))}
        </div>

        {/* Rear Coach Exit */}
        <div className="pt-2 border-t-2 border-stone-300 dark:border-stone-700 text-center">
          <span className="text-[7px] font-black uppercase tracking-widest text-stone-400">
            REAR COACH EXIT • SANITIZED LAVATORY
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 p-3 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-[10px] space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-stone-600 dark:text-stone-300">
            <span className="w-3 h-3 rounded bg-[#F97316]"></span> VIP Front (Orange)
          </span>
          <span className="flex items-center gap-1.5 font-bold text-stone-600 dark:text-stone-300">
            <span className="w-3 h-3 rounded bg-[#84CC16]"></span> VIP Middle (Green)
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-bold text-stone-600 dark:text-stone-300">
            <span className="w-3 h-3 rounded bg-[#EAB308]"></span> VIP Single (Yellow)
          </span>
          <span className="flex items-center gap-1.5 font-bold text-stone-600 dark:text-stone-300">
            <span className="w-3 h-3 rounded bg-[#0EA5E9]"></span> Executive (Blue)
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
          <span className="flex items-center gap-1.5 font-bold text-[#B91C1C]">
            <span className="w-3 h-3 rounded bg-[#B91C1C]"></span> Booked / Sold Out
          </span>
          <span className="flex items-center gap-1.5 font-bold text-emerald-600">
            <span className="w-3 h-3 rounded bg-emerald-500"></span> Selected Seat
          </span>
        </div>
      </div>
    </div>
  );
};

export default BusSeatChassis;
