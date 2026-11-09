import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import RovaIntro from './components/RovaIntro';
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

// Operations Layout with Collapsible Sidebar and Design System
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#FBF9F7] dark:bg-[#120E0C] text-[#1C1917] dark:text-stone-100 font-sans selection:bg-[#B91C1C] selection:text-white transition-colors duration-200">
      {/* Dark Stone Sidebar (Expandable / Minimizable) */}
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
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    // Show 3-second MaskedHeading intro on first session load
    const seen = sessionStorage.getItem('rova_intro_seen');
    return !seen;
  });

  const handleIntroComplete = () => {
    sessionStorage.setItem('rova_intro_seen', 'true');
    setShowIntro(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            {/* 3-second MaskedHeading Rova Intro Animation */}
            {showIntro && <RovaIntro onComplete={handleIntroComplete} durationSeconds={3} />}

            <Router>
              <Routes>
                {/* Landing Page is the default entry point */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing" element={<LandingPage />} />

                {/* Replay Intro Route */}
                <Route
                  path="/intro"
                  element={<RovaIntro onComplete={() => (window.location.href = '/')} durationSeconds={3} />}
                />

                {/* Operations Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <DashboardLayout>
                      <OperationsDashboard />
                    </DashboardLayout>
                  }
                />

                {/* Seat Selection & Booking Screen */}
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
