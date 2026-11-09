import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MyBookingsPage from './pages/MyBookingsPage';
import TicketLookupPage from './pages/TicketLookupPage';
import OperatorPage from './pages/OperatorPage';
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
          <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-800">
            <Navbar />
            <div className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/my-bookings" element={<MyBookingsPage />} />
                <Route path="/ticket-lookup" element={<TicketLookupPage />} />
                <Route path="/operator" element={<OperatorPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
