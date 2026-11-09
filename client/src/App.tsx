import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import SplashScreen from './components/SplashScreen';
import LandingPage from './pages/LandingPage';
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

// Operations Layout with Collapsible Sidebar and Dark/Light Mode support
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC] dark:bg-[#0F0619] text-slate-800 dark:text-slate-100 font-sans selection:bg-coral-500 selection:text-white transition-colors duration-200">
      {/* Dark Purple Sidebar (Expandable / Minimizable) */}
      <Sidebar />

      {/* Main Application Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Bar with Search, Dark Mode Toggle, Notifications & Profile */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 pb-12">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash screen on first session load
    const seen = sessionStorage.getItem('rova_splash_shown');
    return !seen;
  });

  const handleSplashFinish = () => {
    sessionStorage.setItem('rova_splash_shown', 'true');
    setShowSplash(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            {showSplash && <SplashScreen onFinish={handleSplashFinish} minDuration={1900} />}

            <Router>
              <Routes>
                {/* Public Transit Landing Page with animations matching the theme */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />

                {/* Operations Dashboard matching Image 1 */}
                <Route
                  path="/dashboard"
                  element={
                    <DashboardLayout>
                      <OperationsDashboard />
                    </DashboardLayout>
                  }
                />

                {/* Seat Selection & Booking Screen matching Image 2 */}
                <Route
                  path="/bookings"
                  element={
                    <DashboardLayout>
                      <BookingsScreen />
                    </DashboardLayout>
                  }
                />

                {/* Operational Management Screens */}
                <Route
                  path="/fleet"
                  element={
                    <DashboardLayout>
                      <FleetRoutesScreen />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <DashboardLayout>
                      <ScheduleScreen />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <DashboardLayout>
                      <CustomerManagementScreen />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <DashboardLayout>
                      <CustomerManagementScreen />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/ticket-lookup"
                  element={
                    <DashboardLayout>
                      <CustomerManagementScreen />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <DashboardLayout>
                      <AnalyticsScreen />
                    </DashboardLayout>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <DashboardLayout>
                      <AdminPage />
                    </DashboardLayout>
                  }
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
