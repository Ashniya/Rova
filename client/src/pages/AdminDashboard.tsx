import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Radio,
  Navigation,
  ShieldCheck,
  Lock,
  Bus,
  MapPin,
  Clock,
  Fuel,
  Thermometer,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Download,
  Filter,
  Plus,
  X,
  UserCheck,
  User,
  Phone,
} from 'lucide-react';
import { fleetService, BusData, BookedSeatRecord } from '../services/fleetService';
import BusSeatChassis from '../components/BusSeatChassis';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'fleet' | 'radar' | 'audit'>('overview');
  const [buses, setBuses] = useState<BusData[]>([]);
  const [selectedCoachId, setSelectedCoachId] = useState<string>('bus-1');
  const [addBusModalOpen, setAddBusModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New bus form state
  const [newRegNo, setNewRegNo] = useState('');
  const [newBusName, setNewBusName] = useState('');
  const [newOrigin, setNewOrigin] = useState('Amritsar ISBT');
  const [newDest, setNewDest] = useState('Chandigarh Sector 17');
  const [newDepTime, setNewDepTime] = useState('08:00 AM');
  const [newArrTime, setNewArrTime] = useState('12:15 PM');
  const [newPrice, setNewPrice] = useState(1100);
  const [newDriver, setNewDriver] = useState('Baldev Singh');
  const [newPhone, setNewPhone] = useState('+91 99144-88902');

  const registeredDrivers = [
    { name: 'Gurpreet Singh', phone: '+91 98140-54321' },
    { name: 'Balwinder Sharma', phone: '+91 98722-11099' },
    { name: 'Davinder Gill', phone: '+91 94170-88231' },
    { name: 'Harbhajan Singh', phone: '+91 98555-77610' },
    { name: 'Jagtar Sandhu', phone: '+91 98150-33421' },
    { name: 'Baldev Singh', phone: '+91 99144-88902' },
  ];

  const loadData = () => {
    setBuses(fleetService.getBuses());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('rova_seats_updated', handleUpdate);
    return () => window.removeEventListener('rova_seats_updated', handleUpdate);
  }, []);

  const allBookings = fleetService.getAllBookings().filter((b) => b.status !== 'CANCELLED');
  const totalTickets = allBookings.length;
  const totalRevenue = allBookings.reduce((sum, b) => sum + b.fare, 0);
  const platformCommission = Math.round(totalRevenue * 0.1); // 10% commission

  const selectedBus = buses.find((b) => b.id === selectedCoachId) || buses[0];
  const busBookedSeats = selectedBus ? fleetService.getBookedSeatsForBus(selectedBus.id) : [];
  const busPassengerMap = selectedBus ? fleetService.getPassengerMapForBus(selectedBus.id) : {};

  const handleAssignDriver = (busId: string, driverName: string) => {
    const d = registeredDrivers.find((drv) => drv.name === driverName);
    const phone = d ? d.phone : '+91 98765-43210';
    fleetService.assignDriver(busId, driverName, phone);
    loadData();
    showToast(`Assigned driver ${driverName} to bus successfully!`);
  };

  const handleCreateBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRegNo || !newBusName) return;

    fleetService.addBus({
      registrationNumber: newRegNo.toUpperCase(),
      name: newBusName,
      busType: 'Luxury Scania Touring',
      totalSeats: 37,
      origin: newOrigin,
      destination: newDest,
      departureTime: newDepTime,
      arrivalTime: newArrTime,
      basePrice: Number(newPrice),
      driverName: newDriver,
      driverPhone: newPhone,
      driverInitials: newDriver.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      status: 'ON_TIME',
    });

    setAddBusModalOpen(false);
    loadData();
    setNewRegNo('');
    setNewBusName('');
    showToast(`Bus ${newRegNo} registered and published for passenger booking!`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-slideDown">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Cockpit Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E7E2DA] dark:border-stone-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B91C1C]/10 dark:bg-[#B91C1C]/20 border border-[#B91C1C]/30 rounded-full text-[#B91C1C] dark:text-[#F87171] text-[10px] font-black uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1C1917] dark:text-white tracking-tight">
            Revenue & Bus Fleet Master
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Track platform income in ₹, manage intercity buses, and assign verified drivers to coaches.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setAddBusModalOpen(true)}
            className="px-4 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Bus & Assign Driver</span>
          </button>

          <div className="flex items-center gap-1 bg-[#F3EFEA] dark:bg-stone-800 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              💰 Income & Tickets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('fleet')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'fleet'
                  ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              🚌 Fleet & Driver Assignments
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('radar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'radar'
                  ? 'bg-white dark:bg-stone-900 text-[#B91C1C] dark:text-[#F87171] shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'
              }`}
            >
              🛰️ GPS Radar
            </button>
          </div>
        </div>
      </div>

      {/* Financial & Ticket KPI Metric Cards in ₹ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Tickets Booked */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Tickets Booked</span>
            <span className="text-base">🎫</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#1C1917] dark:text-white">{totalTickets}</span>
            <span className="text-xs text-stone-400 font-bold">confirmed berths</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Synchronized across all accounts
          </span>
        </div>

        {/* Gross Platform Income */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Gross Platform Income</span>
            <span className="text-xs font-black text-emerald-600">₹</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#1C1917] dark:text-white">
              ₹{(totalRevenue + 475000).toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-600">
            +18.4% growth across Punjab corridors
          </span>
        </div>

        {/* Platform Net Earnings */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Platform Commission (10%)</span>
            <CreditCard className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-[#1C1917] dark:text-white">
              ₹{(platformCommission + 47500).toLocaleString()}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-stone-500">
            10% fee retained by Rova Platform
          </span>
        </div>

        {/* Active Buses */}
        <div className="bg-[#1C1917] text-white p-5 rounded-3xl border border-stone-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Configured Fleet</span>
            <Bus className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#F59E0B]">{buses.length} Buses</span>
            <span className="text-xs text-stone-400">{buses.length} drivers assigned</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> All published to passenger app
          </span>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & LIVE SEAT SCHEMATIC */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 37-Seat Bus Schematic (Image design) */}
          <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h3 className="text-base font-black text-[#1C1917] dark:text-white">
                  Bus Seat Occupancy Inspector
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {selectedBus.name} ({selectedBus.registrationNumber})
                </p>
              </div>
              <select
                value={selectedCoachId}
                onChange={(e) => setSelectedCoachId(e.target.value)}
                className="text-xs font-bold bg-[#F3EFEA] dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-[#1C1917] dark:text-white focus:outline-none"
              >
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.registrationNumber} ({b.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center pt-2">
              <BusSeatChassis
                bookedSeatCodes={busBookedSeats}
                passengerMap={busPassengerMap}
                interactive={false}
              />
            </div>
          </div>

          {/* Right: Payment Transactions & Distribution */}
          <div className="lg:col-span-7 space-y-5">
            {/* Payment Method Distribution */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-4">
              <h3 className="text-sm font-black text-[#1C1917] dark:text-white uppercase tracking-wider">
                Income Distribution by Gateway (Punjab Region)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">⚡ UPI / GPay (68%)</span>
                  <p className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-1">₹327,930</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300">💳 Cards (24%)</span>
                  <p className="text-xl font-black text-blue-900 dark:text-blue-100 mt-1">₹115,740</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-800">
                  <span className="text-[11px] font-bold text-purple-800 dark:text-purple-300">🏦 NetBanking (8%)</span>
                  <p className="text-xl font-black text-purple-900 dark:text-purple-100 mt-1">₹38,580</p>
                </div>
              </div>
            </div>

            {/* Confirmed Bookings Table */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2">
                <h3 className="text-sm font-black text-[#1C1917] dark:text-white uppercase tracking-wider">
                  Recent Passenger Ticket Bookings
                </h3>
                <span className="text-xs font-bold text-stone-400">{allBookings.length} Total Bookings</span>
              </div>

              <div className="overflow-x-auto max-h-[360px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] font-bold text-stone-400 uppercase">
                      <th className="py-2.5 px-3">PNR</th>
                      <th className="py-2.5 px-3">Seat</th>
                      <th className="py-2.5 px-3">Passenger</th>
                      <th className="py-2.5 px-3">Phone</th>
                      <th className="py-2.5 px-3">Amount</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                    {allBookings.map((b, idx) => (
                      <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-[#B91C1C]">{b.pnr}</td>
                        <td className="py-2.5 px-3 font-mono font-black">{b.seatCode}</td>
                        <td className="py-2.5 px-3 font-bold">{b.passengerName}</td>
                        <td className="py-2.5 px-3 font-mono text-stone-500">{b.passengerPhone}</td>
                        <td className="py-2.5 px-3 font-bold text-emerald-600">₹{b.fare}</td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            CONFIRMED
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BUS FLEET & DRIVER ASSIGNMENT MANAGER */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1C1917] dark:text-white">
                Admin Fleet & Driver Assignment Manager
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                The Platform Admin creates these buses and assigns drivers. Only these buses are available for passengers to book.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAddBusModalOpen(true)}
              className="px-4 py-2 bg-[#B91C1C] text-white text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register Bus</span>
            </button>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-[#E7E2DA] dark:border-stone-800 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  <th className="py-3 px-3">Plate Number</th>
                  <th className="py-3 px-3">Coach Name</th>
                  <th className="py-3 px-3">Route Corridor</th>
                  <th className="py-3 px-3">Departure</th>
                  <th className="py-3 px-3">Fare (₹)</th>
                  <th className="py-3 px-3">Assigned Driver</th>
                  <th className="py-3 px-3 text-right">Change Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {buses.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-3.5 px-3 font-mono font-black text-[#B91C1C] text-sm">
                      {b.registrationNumber}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#1C1917] dark:text-white">
                      {b.name}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-stone-700 dark:text-stone-300">
                      {b.origin} ──▶ {b.destination}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-stone-500">
                      {b.departureTime}
                    </td>
                    <td className="py-3.5 px-3 font-black text-emerald-600">
                      ₹{b.basePrice}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-[#1C1917] dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#B91C1C]" />
                        {b.driverName}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400 block ml-5">
                        {b.driverPhone}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <select
                        value={b.driverName}
                        onChange={(e) => handleAssignDriver(b.id, e.target.value)}
                        className="px-3 py-1.5 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none cursor-pointer"
                      >
                        {registeredDrivers.map((drv) => (
                          <option key={drv.name} value={drv.name}>
                            Assign: {drv.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: GPS FLEET RADAR */}
      {activeTab === 'radar' && (
        <div className="bg-[#1C1917] text-white rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div>
              <span className="text-[10px] font-mono uppercase text-[#F59E0B]">
                Live Punjab Highway GPS Telemetry
              </span>
              <h3 className="text-xl font-black text-white">Grand Trunk Road (NH3) Active Fleet</h3>
            </div>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
              {buses.length} Coaches Transmitting
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buses.map((b) => (
              <div key={b.id} className="p-4 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#F59E0B] text-xs">{b.registrationNumber}</span>
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    68 km/h • On-Time
                  </span>
                </div>
                <h4 className="text-sm font-black text-white">{b.name}</h4>
                <p className="text-xs text-stone-400 font-semibold">{b.origin} ──▶ {b.destination}</p>
                <div className="pt-2 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                  <span>Driver: <strong>{b.driverName}</strong></span>
                  <span className="text-emerald-400 font-bold">ETA: {b.arrivalTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD BUS & ASSIGN DRIVER */}
      {addBusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E7E2DA] dark:border-stone-800 space-y-4">
            <button
              type="button"
              onClick={() => setAddBusModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-stone-400 hover:text-stone-800 dark:hover:text-white rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black text-[#1C1917] dark:text-white">
                Register New Intercity Bus
              </h3>
              <p className="text-xs text-stone-500">
                This bus and its assigned driver will immediately become visible to passengers for seat booking.
              </p>
            </div>

            <form onSubmit={handleCreateBus} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Bus Plate Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PB-11-AX-7788"
                    value={newRegNo}
                    onChange={(e) => setNewRegNo(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Coach Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doaba Royal Liner"
                    value={newBusName}
                    onChange={(e) => setNewBusName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white focus:outline-none focus:border-[#B91C1C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Origin Station
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Destination Station
                  </label>
                  <input
                    type="text"
                    required
                    value={newDest}
                    onChange={(e) => setNewDest(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="text"
                    required
                    value={newDepTime}
                    onChange={(e) => setNewDepTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Arrival Time
                  </label>
                  <input
                    type="text"
                    required
                    value={newArrTime}
                    onChange={(e) => setNewArrTime(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Fare (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Assign Driver
                </label>
                <select
                  value={newDriver}
                  onChange={(e) => {
                    setNewDriver(e.target.value);
                    const d = registeredDrivers.find((drv) => drv.name === e.target.value);
                    if (d) setNewPhone(d.phone);
                  }}
                  className="w-full px-3 py-2.5 bg-[#F3EFEA] dark:bg-stone-800 border border-[#E7E2DA] dark:border-stone-700 rounded-xl text-xs font-bold text-[#1C1917] dark:text-white"
                >
                  {registeredDrivers.map((drv) => (
                    <option key={drv.name} value={drv.name}>
                      {drv.name} ({drv.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setAddBusModalOpen(false)}
                  className="flex-1 py-2.5 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white font-black text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  Publish Bus & Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
