import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  Bus,
  Users,
  Armchair,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  MapPin,
  ShieldCheck,
  Radio,
  Printer,
  ChevronDown,
  Navigation,
  Compass,
  FileSpreadsheet,
} from 'lucide-react';

interface ManifestPassenger {
  seat: string;
  name: string;
  phone: string;
  boarding: string;
  dropping: string;
  pnr: string;
  status: 'CHECKED_IN' | 'PENDING';
  fare: number;
}

export const DriverOwnerDashboard: React.FC = () => {
  const [selectedBus, setSelectedBus] = useState('PB-02-AK-9921');
  const [activeTab, setActiveTab] = useState<'manifest' | 'seats' | 'dispatch'>('seats');
  const [hoveredSeat, setHoveredSeat] = useState<ManifestPassenger | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<ManifestPassenger | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<'ON_TIME' | 'DELAYED_15' | 'DELAYED_30' | 'DIVERTED'>('ON_TIME');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial Punjab Passenger Manifest for StarLiner Executive (PB-02-AK-9921)
  const [manifest, setManifest] = useState<ManifestPassenger[]>([
    { seat: 'A1', name: 'Gurpreet Singh', phone: '+91 98140-54321', boarding: 'Amritsar ISBT', dropping: 'Chandigarh Sec 17', pnr: 'ROV-9912A', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'A2', name: 'Harleen Kaur', phone: '+91 98722-11099', boarding: 'Amritsar ISBT', dropping: 'Chandigarh Sec 17', pnr: 'ROV-9912B', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'A3', name: 'Rajinder Sharma', phone: '+91 94170-88231', boarding: 'Jalandhar Rama Mandi', dropping: 'Mohali Phase 8', pnr: 'ROV-8821X', status: 'PENDING', fare: 850 },
    { seat: 'A4', name: 'Pooja Sharma', phone: '+91 94170-88232', boarding: 'Jalandhar Rama Mandi', dropping: 'Mohali Phase 8', pnr: 'ROV-8821Y', status: 'PENDING', fare: 850 },
    { seat: 'B1', name: 'Manpreet Dhillon', phone: '+91 98555-77610', boarding: 'Amritsar ISBT', dropping: 'Chandigarh Sec 17', pnr: 'ROV-7710M', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'B2', name: 'Sukhwinder Gill', phone: '+91 98150-33421', boarding: 'Amritsar ISBT', dropping: 'Tribune Chowk', pnr: 'ROV-6620S', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'B3', name: 'Baldev Singh', phone: '+91 99144-88902', boarding: 'Jalandhar Rama Mandi', dropping: 'Chandigarh Sec 17', pnr: 'ROV-5541B', status: 'PENDING', fare: 850 },
    { seat: 'B4', name: 'Jasleen Cheema', phone: '+91 98881-22901', boarding: 'Jalandhar Rama Mandi', dropping: 'Chandigarh Sec 17', pnr: 'ROV-5541C', status: 'PENDING', fare: 850 },
    { seat: 'C1', name: 'Amanpreet Singh', phone: '+91 98765-43210', boarding: 'Amritsar ISBT', dropping: 'Chandigarh Sec 17', pnr: 'ROV-7849X', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'C2', name: 'Simranjit Kaur', phone: '+91 98765-43211', boarding: 'Amritsar ISBT', dropping: 'Chandigarh Sec 17', pnr: 'ROV-7849Y', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'C3', name: 'Navjot Sandhu', phone: '+91 97800-44123', boarding: 'Ludhiana Sherpur', dropping: 'Chandigarh Sec 17', pnr: 'ROV-4419N', status: 'PENDING', fare: 550 },
    { seat: 'C4', name: 'Kirandeep Brar', phone: '+91 97800-44124', boarding: 'Ludhiana Sherpur', dropping: 'Chandigarh Sec 17', pnr: 'ROV-4419K', status: 'PENDING', fare: 550 },
    { seat: 'D1', name: 'Vikramaditya Verma', phone: '+91 98141-99881', boarding: 'Amritsar ISBT', dropping: 'Tribune Chowk', pnr: 'ROV-3312V', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'D2', name: 'Meenakshi Verma', phone: '+91 98141-99882', boarding: 'Amritsar ISBT', dropping: 'Tribune Chowk', pnr: 'ROV-3312M', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'D3', name: 'Hardev Bajwa', phone: '+91 98551-66772', boarding: 'Jalandhar Rama Mandi', dropping: 'Chandigarh Sec 17', pnr: 'ROV-2218H', status: 'PENDING', fare: 850 },
    { seat: 'D4', name: 'Surjit Bajwa', phone: '+91 98551-66773', boarding: 'Jalandhar Rama Mandi', dropping: 'Chandigarh Sec 17', pnr: 'ROV-2218S', status: 'PENDING', fare: 850 },
    { seat: 'E1', name: 'Taranjit Kahlon', phone: '+91 98720-44331', boarding: 'Amritsar ISBT', dropping: 'Mohali Phase 8', pnr: 'ROV-1109T', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'E2', name: 'Parminder Kahlon', phone: '+91 98720-44332', boarding: 'Amritsar ISBT', dropping: 'Mohali Phase 8', pnr: 'ROV-1109P', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'E3', name: 'Inderjit Sidhu', phone: '+91 94172-55661', boarding: 'Ludhiana Sherpur', dropping: 'Chandigarh Sec 17', pnr: 'ROV-9081I', status: 'PENDING', fare: 550 },
    { seat: 'E4', name: 'Davinder Sidhu', phone: '+91 94172-55662', boarding: 'Ludhiana Sherpur', dropping: 'Chandigarh Sec 17', pnr: 'ROV-9081D', status: 'PENDING', fare: 550 },
    { seat: 'F1', name: 'Kulwinder Bhatti', phone: '+91 98884-11223', boarding: 'Amritsar ISBT', dropping: 'Chandigarh Sec 17', pnr: 'ROV-8072K', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'F2', name: 'Jaswant Bhatti', phone: '+91 98884-11224', boarding: 'Amritsar ISBT', dropping: 'Chandigarh Sec 17', pnr: 'ROV-8072J', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'G1', name: 'Rupinder Deol', phone: '+91 98144-33221', boarding: 'Jalandhar Rama Mandi', dropping: 'Tribune Chowk', pnr: 'ROV-7063R', status: 'PENDING', fare: 850 },
    { seat: 'G2', name: 'Amrik Deol', phone: '+91 98144-33222', boarding: 'Jalandhar Rama Mandi', dropping: 'Tribune Chowk', pnr: 'ROV-7063A', status: 'PENDING', fare: 850 },
    { seat: 'G3', name: 'Satnam Randhawa', phone: '+91 98761-00991', boarding: 'Amritsar ISBT', dropping: 'Chandigarh Sec 17', pnr: 'ROV-6054S', status: 'CHECKED_IN', fare: 1100 },
    { seat: 'G4', name: 'Kuldeep Randhawa', phone: '+91 98761-00992', boarding: 'Amritsar ISBT', dropping: 'Chandigarh Sec 17', pnr: 'ROV-6054K', status: 'CHECKED_IN', fare: 1100 },
  ]);

  const bookedSeatCodes = manifest.map((m) => m.seat);
  const totalSeats = 40;
  const bookedCount = manifest.length;
  const availableCount = totalSeats - bookedCount;
  const totalRevenue = manifest.reduce((acc, cur) => acc + cur.fare, 0);

  const handleToggleCheckIn = (seatCode: string) => {
    setManifest((prev) =>
      prev.map((p) =>
        p.seat === seatCode
          ? { ...p, status: p.status === 'CHECKED_IN' ? 'PENDING' : 'CHECKED_IN' }
          : p
      )
    );
    showToast(`Updated check-in status for Seat ${seatCode}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Bus Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E7E2DA] dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B91C1C]/10 dark:bg-[#B91C1C]/20 border border-[#B91C1C]/30 rounded-full text-[#B91C1C] dark:text-[#F87171] text-[10px] font-black uppercase tracking-wider mb-2">
            <Bus className="w-3.5 h-3.5" />
            <span>Bus Owner & Driver Cockpit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white tracking-tight">
            Vehicle Occupancy & Manifest HUD
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Real-time passenger roster, seat-by-seat passenger identity, and highway dispatch controls.
          </p>
        </div>

        {/* Bus Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-stone-900 px-4 py-2.5 rounded-2xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs">
            <Bus className="w-4 h-4 text-[#B91C1C]" />
            <select
              value={selectedBus}
              onChange={(e) => setSelectedBus(e.target.value)}
              className="text-xs font-black bg-transparent text-[#1C1917] dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="PB-02-AK-9921">PB-02-AK-9921 • StarLiner Scania Recliner (Amritsar ──▶ Chandigarh)</option>
              <option value="PB-08-CC-4412">PB-08-CC-4412 • Astra Sleeper Coach (Jalandhar ──▶ Delhi)</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white dark:bg-stone-900 hover:bg-[#F3EFEA] text-[#1C1917] dark:text-stone-200 border border-[#E7E2DA] dark:border-stone-800 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Manifest</span>
          </button>
        </div>
      </div>

      {/* KPI Occupancy Metrics in ₹ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Booked */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Seats Booked</span>
            <Armchair className="w-4 h-4 text-[#B91C1C]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1C1917] dark:text-white">{bookedCount}</span>
            <span className="text-xs text-stone-400 font-bold">/ {totalSeats} seats</span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#B91C1C] h-full rounded-full transition-all duration-500"
              style={{ width: `${(bookedCount / totalSeats) * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-bold text-[#B91C1C]">
            {Math.round((bookedCount / totalSeats) * 100)}% Capacity Occupied
          </span>
        </div>

        {/* Available Seats */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Seats Remaining</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{availableCount}</span>
            <span className="text-xs text-stone-400 font-bold">vacant seats</span>
          </div>
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block pt-3">
            Open for en-route booking at Jalandhar Rama Mandi
          </span>
        </div>

        {/* Collected Bus Fare */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Trip Gross Revenue</span>
            <span className="text-xs font-black text-[#B91C1C]">₹</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#1C1917] dark:text-white">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block pt-3">
            Net payout queued to Bus Owner Bank Account
          </span>
        </div>

        {/* Driver Highway Telemetry */}
        <div className="bg-[#1C1917] text-white p-5 rounded-3xl border border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Live Highway Location</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <span className="text-lg font-black text-[#F59E0B]">Jalandhar Tollway (GT Road)</span>
            <p className="text-[11px] text-stone-400">Speed: 68 km/h • ETA Chandigarh: 10:45 AM</p>
          </div>
          <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Driver: Gurpreet Singh (Verified)</span>
          </div>
        </div>
      </div>

      {/* Dispatch Controls Ribbon */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-[#E7E2DA] dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-[#1C1917] dark:text-white uppercase tracking-wider">
            Highway Dispatch Status:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setDispatchStatus('ON_TIME');
                showToast('Trip broadcast: Running On-Time via GT Road');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dispatchStatus === 'ON_TIME'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              🟢 On-Time (Schedule Intact)
            </button>
            <button
              onClick={() => {
                setDispatchStatus('DELAYED_15');
                showToast('Broadcasted 15-min Highway Fog Delay notice to all passengers');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dispatchStatus === 'DELAYED_15'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              🟡 +15m Fog Delay (GT Road)
            </button>
            <button
              onClick={() => {
                setDispatchStatus('DIVERTED');
                showToast('Alert: Highway diversion via Phagwara Bypass activated');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dispatchStatus === 'DIVERTED'
                  ? 'bg-red-500 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              🔴 Highway Diversion
            </button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-[#F3EFEA] dark:bg-stone-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('seats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'seats'
                ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            💺 Visual Seat Floorplan
          </button>
          <button
            onClick={() => setActiveTab('manifest')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'manifest'
                ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            📋 Passenger Roster ({manifest.length})
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'seats' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Bus Floorplan Grid */}
          <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-base font-black text-[#1C1917] dark:text-white">
                  StarLiner 2+2 Luxury Chassis (40 Berths)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Click or hover any seat to see passenger name, phone, boarding point & ticket PNR.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <span className="flex items-center gap-1.5 text-stone-500">
                  <span className="w-3.5 h-3.5 rounded bg-[#B91C1C]"></span> Booked ({bookedCount})
                </span>
                <span className="flex items-center gap-1.5 text-stone-500">
                  <span className="w-3.5 h-3.5 rounded bg-white border border-stone-300"></span> Available ({availableCount})
                </span>
              </div>
            </div>

            {/* Realistic Coach Chassis Frame */}
            <div className="bg-[#FBF9F7] dark:bg-stone-950 p-6 rounded-3xl border-2 border-dashed border-[#E7E2DA] dark:border-stone-800 space-y-4 max-w-lg mx-auto">
              {/* Front Cabin */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800 text-xs font-bold text-stone-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">🚪 Front Passenger Entry</span>
                <span className="flex items-center gap-1">Driver Cabin ☸️</span>
              </div>

              {/* Seating Grid */}
              <div className="space-y-3">
                {rows.map((rowLetter) => {
                  const s1 = `${rowLetter}1`;
                  const s2 = `${rowLetter}2`;
                  const s3 = `${rowLetter}3`;
                  const s4 = `${rowLetter}4`;

                  const renderSeatBtn = (code: string) => {
                    const passenger = manifest.find((m) => m.seat === code);
                    const isBooked = !!passenger;
                    const isSelected = selectedSeat?.seat === code;

                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          if (passenger) setSelectedSeat(passenger);
                        }}
                        onMouseEnter={() => {
                          if (passenger) setHoveredSeat(passenger);
                        }}
                        className={`w-11 h-12 rounded-2xl flex flex-col items-center justify-center font-bold text-xs transition-all relative cursor-pointer ${
                          isSelected
                            ? 'ring-4 ring-[#B91C1C] scale-105 bg-[#991B1B] text-white shadow-md'
                            : isBooked
                            ? 'bg-[#B91C1C] hover:bg-[#991B1B] text-white shadow-xs'
                            : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-700 hover:border-emerald-500'
                        }`}
                        title={
                          isBooked
                            ? `Seat ${code}: ${passenger?.name} (${passenger?.boarding})`
                            : `Seat ${code}: Available`
                        }
                      >
                        {isBooked ? (
                          <Armchair className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold">VACANT</span>
                        )}
                        <span className="text-[10px] font-mono font-bold leading-none mt-0.5">{code}</span>
                      </button>
                    );
                  };

                  return (
                    <div key={rowLetter} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {renderSeatBtn(s1)}
                        {renderSeatBtn(s2)}
                      </div>

                      <span className="text-[10px] font-mono text-stone-400 font-bold">Row {rowLetter}</span>

                      <div className="flex items-center gap-2.5">
                        {renderSeatBtn(s3)}
                        {renderSeatBtn(s4)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rear Toilet / Emergency Exit */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <span>🧻 Sanitized Lavatory</span>
                <span>🚨 Emergency Rear Door</span>
              </div>
            </div>
          </div>

          {/* Seat Passenger Inspector Card */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-sm font-black text-[#1C1917] dark:text-white uppercase tracking-wider">
                  Passenger Seat Inspector
                </h3>
                <span className="text-[10px] font-bold text-stone-400">
                  {selectedSeat || hoveredSeat ? `Seat ${(selectedSeat || hoveredSeat)?.seat}` : 'Select a seat'}
                </span>
              </div>

              {selectedSeat || hoveredSeat ? (
                (() => {
                  const p = selectedSeat || hoveredSeat!;
                  return (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#B91C1C] text-white flex items-center justify-center font-black text-lg">
                          {p.seat}
                        </div>
                        <div>
                          <h4 className="text-base font-black text-[#1C1917] dark:text-white">{p.name}</h4>
                          <span className="text-xs text-stone-500 font-mono">PNR: {p.pnr}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-stone-400">Boarding Station</span>
                          <p className="font-bold text-[#1C1917] dark:text-white flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#B91C1C]" />
                            {p.boarding}
                          </p>
                        </div>
                        <div className="p-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-stone-400">Dropping Station</span>
                          <p className="font-bold text-[#1C1917] dark:text-white flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            {p.dropping}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400">Contact Number</span>
                          <p className="font-bold text-[#1C1917] dark:text-white flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            {p.phone}
                          </p>
                        </div>
                        <a
                          href={`tel:${p.phone}`}
                          className="px-3 py-1.5 bg-[#B91C1C] text-white rounded-lg text-[11px] font-bold"
                        >
                          Call Passenger
                        </a>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs font-bold text-stone-500">Boarding Verification:</span>
                        <button
                          onClick={() => handleToggleCheckIn(p.seat)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            p.status === 'CHECKED_IN'
                              ? 'bg-emerald-500 text-white'
                              : 'bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
                          }`}
                        >
                          {p.status === 'CHECKED_IN' ? '✓ Checked In On-board' : 'Mark Checked In'}
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="py-12 text-center text-stone-400 space-y-2">
                  <Armchair className="w-10 h-10 mx-auto opacity-40 text-stone-400" />
                  <p className="text-xs font-bold">Hover or click any red seat to view passenger details.</p>
                </div>
              )}
            </div>

            {/* Quick Summary of Stops */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-3">
              <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider">
                Passenger Pickup Summary by Stop
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <span className="font-bold text-stone-700 dark:text-stone-300">Amritsar ISBT Central</span>
                  <span className="font-black text-[#B91C1C]">14 Boarded</span>
                </div>
                <div className="flex justify-between p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <span className="font-bold text-stone-700 dark:text-stone-300">Jalandhar Rama Mandi Hub</span>
                  <span className="font-black text-[#F59E0B]">8 Boarding in 25m</span>
                </div>
                <div className="flex justify-between p-2.5 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <span className="font-bold text-stone-700 dark:text-stone-300">Ludhiana Sherpur Bypass</span>
                  <span className="font-black text-emerald-600">4 Boarding</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Passenger Roster Manifest Table */
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs overflow-hidden space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="text-base font-black text-[#1C1917] dark:text-white">
                Official Passenger Travel Manifest
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Authorized for Punjab Highway Patrol and conductor ticket clearance.
              </p>
            </div>
            <button
              onClick={() => showToast('Exported passenger manifest as CSV')}
              className="px-4 py-2 bg-[#F3EFEA] dark:bg-stone-800 hover:bg-[#EAE4DC] text-[#1C1917] dark:text-stone-200 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Seat</th>
                  <th className="py-3 px-3">Passenger</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Boarding Stop</th>
                  <th className="py-3 px-3">Dropping Station</th>
                  <th className="py-3 px-3">PNR Code</th>
                  <th className="py-3 px-3">Fare Paid</th>
                  <th className="py-3 px-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {manifest.map((p) => (
                  <tr key={p.seat} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                    <td className="py-3 px-3 font-mono font-black text-[#B91C1C]">{p.seat}</td>
                    <td className="py-3 px-3 font-bold text-[#1C1917] dark:text-white">{p.name}</td>
                    <td className="py-3 px-3 text-stone-500 font-mono">{p.phone}</td>
                    <td className="py-3 px-3 text-stone-700 dark:text-stone-300 font-medium">{p.boarding}</td>
                    <td className="py-3 px-3 text-stone-700 dark:text-stone-300 font-medium">{p.dropping}</td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-500">{p.pnr}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">₹{p.fare}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleToggleCheckIn(p.seat)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          p.status === 'CHECKED_IN'
                            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700'
                        }`}
                      >
                        {p.status === 'CHECKED_IN' ? '✓ On-Board' : 'Check In'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverOwnerDashboard;
