import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import OperationsDashboard from './pages/OperationsDashboard';
import BookingsScreen from './pages/BookingsScreen';
import FleetRoutesScreen from './pages/FleetRoutesScreen';
import ScheduleScreen from './pages/ScheduleScreen';
import CustomerManagementScreen from './pages/CustomerManagementScreen';
import AnalyticsScreen from './pages/AnalyticsScreen';
import AdminPage from './pages/AdminPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 30000,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="flex min-h-screen bg-[#F8F9FC] text-slate-800 font-sans selection:bg-coral-500 selection:text-white">
            {/* Dark Purple Sidebar from Screenshots */}
            <Sidebar />

            {/* Main Application Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
              {/* Top Bar with Global Search and User Profile */}
              <TopBar />

              {/* Page Content */}
              <main className="flex-1">
                <Routes>
                  {/* Operations Dashboard matching Image 1 */}
                  <Route path="/" element={<OperationsDashboard />} />
                  <Route path="/dashboard" element={<OperationsDashboard />} />

                  {/* Seat Selection & Booking Screen matching Image 2 */}
                  <Route path="/bookings" element={<BookingsScreen />} />

                  {/* Operational Management Screens */}
                  <Route path="/fleet" element={<FleetRoutesScreen />} />
                  <Route path="/schedule" element={<ScheduleScreen />} />
                  <Route path="/customers" element={<CustomerManagementScreen />} />
                  <Route path="/my-bookings" element={<CustomerManagementScreen />} />
                  <Route path="/ticket-lookup" element={<CustomerManagementScreen />} />
                  <Route path="/analytics" element={<AnalyticsScreen />} />
                  <Route path="/admin" element={<AdminPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
