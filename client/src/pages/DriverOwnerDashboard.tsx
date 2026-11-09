import React, { useState, useEffect } from 'react';
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
  FileSpreadsheet,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fleetService, BusData, BookedSeatRecord } from '../services/fleetService';
import BusSeatChassis, { PassengerInfo } from '../components/BusSeatChassis';

export const DriverOwnerDashboard: React.FC = () => {
  const { user } = useAuth();

  // The driver's assigned bus: by default PB-02-AK-9921 (Gurpreet Singh)
  const [driverBus, setDriverBus] = useState<BusData | null>(null);
  const [activeTab, setActiveTab] = useState<'seats' | 'manifest'>('seats');
  const [hoveredPassenger, setHoveredPassenger] = useState<PassengerInfo | null>(null);
  const [selectedPassenger, setSelectedPassenger] = useState<PassengerInfo | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<'ON_TIME' | 'DELAYED_15' | 'DIVERTED'>('ON_TIME');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadDriverData = () => {
    const buses = fleetService.getBuses();
    // Match driver by name or default to the lead bus
    const myBus = buses.find((b) => b.driverName.toLowerCase().includes('gurpreet')) || buses[0];
    setDriverBus(myBus);
  };

  useEffect(() => {
    loadDriverData();
    const handleUpdate = () => loadDriverData();
    window.addEventListener('rova_seats_updated', handleUpdate);
    return () => window.removeEventListener('rova_seats_updated', handleUpdate);
  }, []);

  const busId = driverBus ? driverBus.id : 'bus-1';
  const bookedSeatCodes = fleetService.getBookedSeatsForBus(busId);
  const passengerMap = fleetService.getPassengerMapForBus(busId);
  const manifestPassengers = fleetService.getAllBookings().filter((b) => b.busId === busId && b.status !== 'CANCELLED');

  const totalCapacity = 37;
  const bookedCount = bookedSeatCodes.length;
  const availableCount = Math.max(0, totalCapacity - bookedCount);
  const totalRevenue = manifestPassengers.reduce((acc, cur) => acc + cur.fare, 0);

  const handleToggleCheckIn = (seatCode: string) => {
    fleetService.checkInPassenger(busId, seatCode);
    showToast(`Updated on-board check-in status for Seat ${seatCode}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!driverBus) return null;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Assigned Bus Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E7E2DA] dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B91C1C]/10 dark:bg-[#B91C1C]/20 border border-[#B91C1C]/30 rounded-full text-[#B91C1C] dark:text-[#F87171] text-[10px] font-black uppercase tracking-wider mb-2">
            <Bus className="w-3.5 h-3.5" />
            <span>Driver HUD • My Assigned Bus Only</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white tracking-tight">
            {driverBus.name} ({driverBus.registrationNumber})
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Assigned Driver: <strong>{driverBus.driverName}</strong> • Route: <strong>{driverBus.origin} ──▶ {driverBus.destination}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white dark:bg-stone-900 hover:bg-[#F3EFEA] text-[#1C1917] dark:text-stone-200 border border-[#E7E2DA] dark:border-stone-800 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Manifest</span>
          </button>
        </div>
      </div>

      {/* KPI Occupancy Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Booked Seats */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Seats Occupied</span>
            <Armchair className="w-4 h-4 text-[#B91C1C]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1C1917] dark:text-white">{bookedCount}</span>
            <span className="text-xs text-stone-400 font-bold">/ {totalCapacity} seats</span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#B91C1C] h-full rounded-full transition-all duration-500"
              style={{ width: `${(bookedCount / totalCapacity) * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] font-bold text-[#B91C1C]">
            {Math.round((bookedCount / totalCapacity) * 100)}% Capacity Filled
          </span>
        </div>

        {/* Available Seats */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Seats Vacant</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{availableCount}</span>
            <span className="text-xs text-stone-400 font-bold">open berths</span>
          </div>
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block pt-3">
            Open for booking at intermediate stops
          </span>
        </div>

        {/* Total Collected Revenue */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Trip Gross Revenue</span>
            <span className="text-xs font-black text-[#B91C1C]">₹</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#1C1917] dark:text-white">₹{totalRevenue.toLocaleString()}</span>
          </div>
          <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 block pt-3">
            Total passenger ticket collections for this coach
          </span>
        </div>

        {/* Live GPS Telemetry */}
        <div className="bg-[#1C1917] text-white p-5 rounded-3xl border border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Highway Telemetry</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <span className="text-base font-black text-[#F59E0B]">Jalandhar Tollway (NH3)</span>
            <p className="text-[11px] text-stone-400">Speed: 68 km/h • ETA: 10:45 AM</p>
          </div>
          <div className="flex items-center gap-2 pt-1 text-[10px] font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Driver: {driverBus.driverName}</span>
          </div>
        </div>
      </div>

      {/* Dispatch Controls Ribbon */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-[#E7E2DA] dark:border-stone-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black text-[#1C1917] dark:text-white uppercase tracking-wider">
            Broadcast Status:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setDispatchStatus('ON_TIME');
                showToast('Broadcasted: Bus running strictly On-Time via GT Road NH3');
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
              type="button"
              onClick={() => {
                setDispatchStatus('DELAYED_15');
                showToast('Broadcasted 15-minute highway fog delay notice to all passengers');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                dispatchStatus === 'DELAYED_15'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
              }`}
            >
              🟡 +15m Fog Delay (GT Road)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[#F3EFEA] dark:bg-stone-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('seats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'seats'
                ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            💺 Visual Seat Schematic
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manifest')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'manifest'
                ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
            }`}
          >
            📋 Passenger Manifest ({manifestPassengers.length})
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {activeTab === 'seats' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Exact Bus Seat Chassis Component */}
          <div className="lg:col-span-5 flex justify-center bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xs">
            <BusSeatChassis
              bookedSeatCodes={bookedSeatCodes}
              passengerMap={passengerMap}
              onHoverSeat={(info) => setHoveredPassenger(info)}
              onClickSeat={(info) => setSelectedPassenger(info)}
              interactive={false}
              hoveredSeatCode={(selectedPassenger || hoveredPassenger)?.seat}
            />
          </div>

          {/* Passenger Identity Inspector Card */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <h3 className="text-sm font-black text-[#1C1917] dark:text-white uppercase tracking-wider">
                  Passenger Seat Inspector
                </h3>
                <span className="text-xs font-bold text-[#B91C1C]">
                  {selectedPassenger || hoveredPassenger
                    ? `Inspecting Seat ${(selectedPassenger || hoveredPassenger)?.seat}`
                    : 'Hover or click any red seat to view passenger info'}
                </span>
              </div>

              {selectedPassenger || hoveredPassenger ? (
                (() => {
                  const p = selectedPassenger || hoveredPassenger!;
                  return (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#B91C1C] text-white flex flex-col items-center justify-center font-black">
                          <span className="text-[10px]">SEAT</span>
                          <span className="text-lg font-mono leading-none">{p.seat}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-[#1C1917] dark:text-white">{p.name}</h4>
                          <span className="text-xs text-stone-500 font-mono">PNR: {p.pnr || 'ROV-7849X'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-stone-400">Boarding Point</span>
                          <p className="font-bold text-[#1C1917] dark:text-white flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#B91C1C]" />
                            {p.boarding || driverBus.origin}
                          </p>
                        </div>
                        <div className="p-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl space-y-0.5">
                          <span className="text-[10px] font-bold uppercase text-stone-400">Dropping Station</span>
                          <p className="font-bold text-[#1C1917] dark:text-white flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                            {p.dropping || driverBus.destination}
                          </p>
                        </div>
                      </div>

                      <div className="p-3 bg-[#F3EFEA] dark:bg-stone-800 rounded-xl flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-stone-400">Contact Number</span>
                          <p className="font-bold text-[#1C1917] dark:text-white flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-stone-400" />
                            {p.phone || '+91 98765-43210'}
                          </p>
                        </div>
                        <a
                          href={`tel:${p.phone || '+919876543210'}`}
                          className="px-4 py-2 bg-[#B91C1C] text-white rounded-xl text-xs font-bold"
                        >
                          Call Passenger
                        </a>
                      </div>

                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-500">Boarding Check-In:</span>
                        <button
                          type="button"
                          onClick={() => handleToggleCheckIn(p.seat)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          ✓ Confirm Passenger On-Board
                        </button>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="py-12 text-center text-stone-400 space-y-2">
                  <Armchair className="w-12 h-12 mx-auto opacity-30 text-[#B91C1C]" />
                  <p className="text-xs font-bold">
                    Hover or click any red (SOLD) seat on the bus chassis to view who is sitting there.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Stop Manifest Summary */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-3">
              <h4 className="text-xs font-black uppercase text-stone-400 tracking-wider">
                Intermediate Boarding Stops on Route
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <span className="font-bold text-stone-700 dark:text-stone-300">Amritsar ISBT Central</span>
                  <span className="font-black text-[#B91C1C]">Boarded</span>
                </div>
                <div className="flex justify-between p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <span className="font-bold text-stone-700 dark:text-stone-300">Jalandhar Rama Mandi Hub</span>
                  <span className="font-black text-[#F59E0B]">Approaching in 20m</span>
                </div>
                <div className="flex justify-between p-3 bg-stone-50 dark:bg-stone-800/60 rounded-xl">
                  <span className="font-bold text-stone-700 dark:text-stone-300">Ludhiana Sherpur Bypass</span>
                  <span className="font-black text-emerald-600">En-route</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Manifest Table */
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2">
            <div>
              <h3 className="text-lg font-black text-[#1C1917] dark:text-white">
                Official Passenger Travel Manifest
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Authorized manifest for Coach {driverBus.registrationNumber} ({driverBus.name}).
              </p>
            </div>
            <button
              type="button"
              onClick={() => showToast('Exported manifest as CSV')}
              className="px-4 py-2 bg-[#F3EFEA] dark:bg-stone-800 text-[#1C1917] dark:text-stone-200 text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
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
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3">Boarding Point</th>
                  <th className="py-3 px-3">PNR</th>
                  <th className="py-3 px-3">Fare</th>
                  <th className="py-3 px-3 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
                {manifestPassengers.map((p) => (
                  <tr key={p.seatCode} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3 px-3 font-mono font-black text-[#B91C1C]">{p.seatCode}</td>
                    <td className="py-3 px-3 font-bold text-[#1C1917] dark:text-white">{p.passengerName}</td>
                    <td className="py-3 px-3 text-stone-500 font-mono">{p.passengerPhone}</td>
                    <td className="py-3 px-3 text-stone-700 dark:text-stone-300">{p.boardingPoint}</td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-500">{p.pnr}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600">₹{p.fare}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleCheckIn(p.seatCode)}
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
