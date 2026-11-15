import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import RovaIntro from './components/RovaIntro';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import OperationsDashboard from './pages/OperationsDashboard';
import BookingsScreen from './pages/BookingsScreen';
import FleetRoutesScreen from './pages/FleetRoutesScreen';
import ScheduleScreen from './pages/ScheduleScreen';
import CustomerManagementScreen from './pages/CustomerManagementScreen';
import AnalyticsScreen from './pages/AnalyticsScreen';
import PassengerDashboard from './pages/PassengerDashboard';
import DriverOwnerDashboard from './pages/DriverOwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';

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
// Sidebar is fixed in view (h-screen) and does NOT scroll down with page content
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#FBF9F7] dark:bg-[#120E0C] text-[#1C1917] dark:text-stone-100 font-sans selection:bg-[#B91C1C] selection:text-white transition-colors duration-200">
      {/* Dark Stone Sidebar (Expandable / Minimizable) - Pinned in viewport */}
      <Sidebar />

      {/* Main Application Area - only this container scrolls */}
      <div id="main-app-scroll" className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto overflow-x-hidden">
        {/* Top Bar with Search, Dark Mode Toggle, Notifications & Profile */}
        <TopBar />

        {/* Page Content with smooth fade-in animation */}
        <main className="flex-1 pb-12 animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
};

// Route Guard requiring authentication before entering Driver or Admin areas
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  requiredRole?: 'PASSENGER' | 'DRIVER' | 'ADMIN';
}> = ({ children, requiredRole = 'PASSENGER' }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F7] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#B91C1C] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const hasAccess =
    isAuthenticated &&
    user &&
    (requiredRole === 'PASSENGER' ||
      (requiredRole === 'DRIVER' && (user.role === 'OPERATOR' || user.role === 'ADMIN')) ||
      (requiredRole === 'ADMIN' && user.role === 'ADMIN'));

  if (!hasAccess) {
    const roleParam = requiredRole === 'DRIVER' ? 'driver' : requiredRole === 'ADMIN' ? 'admin' : 'passenger';
    return <Navigate to={`/login?role=${roleParam}`} replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  // Loading page shows on every initial run/load, then transitions to landing page
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    // Check if initial route is / or /landing and not an internal navigation
    const path = window.location.pathname;
    const isDirectPortal = path.startsWith('/login') || path.startsWith('/driver') || path.startsWith('/admin') || path.startsWith('/passenger');
    return !isDirectPortal;
  });

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  return (
    <>
      {/* Animated Rova Loading Screen (MaskedHeading + Tagline Typewriter) */}
      {showIntro && <RovaIntro onComplete={handleIntroComplete} durationSeconds={3} />}

      <Router>
        <Routes>
          {/* Landing Page is the default entry point */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />

          {/* Dedicated Full-Screen Login Page matching Figma Design */}
          <Route path="/login" element={<LoginPage />} />

          {/* Replay Intro Route */}
          <Route
            path="/intro"
            element={<RovaIntro onComplete={() => (window.location.href = '/')} durationSeconds={3} />}
          />

          {/* Operations Dashboard (Intelligently adapts to role + switcher) */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <OperationsDashboard />
              </DashboardLayout>
            }
          />

          {/* Passenger Portal */}
          <Route
            path="/passenger"
            element={
              <DashboardLayout>
                <PassengerDashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/passenger-dashboard"
            element={
              <DashboardLayout>
                <PassengerDashboard />
              </DashboardLayout>
            }
          />

          {/* Driver / Bus Owner Dashboard (Guarded: must be authenticated as driver) */}
          <Route
            path="/driver"
            element={
              <ProtectedRoute requiredRole="DRIVER">
                <DashboardLayout>
                  <DriverOwnerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/driver-dashboard"
            element={
              <ProtectedRoute requiredRole="DRIVER">
                <DashboardLayout>
                  <DriverOwnerDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Super Admin Dashboard (Guarded: must be authenticated as admin) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
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
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <FleetRoutesScreen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/schedule"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <ScheduleScreen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <CustomerManagementScreen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <DashboardLayout>
                  <AnalyticsScreen />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SidebarProvider>
            <AppContent />
          </SidebarProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
