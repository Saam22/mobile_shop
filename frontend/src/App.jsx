import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// ✅ استيراد الـ Auth من الملف الموحد
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Sales from './pages/Sales';
import Customers from './pages/Customers';
import Maintenance from './pages/Maintenance';
import Treasury from './pages/Treasury';
import Expenses from './pages/Expenses';
import Employees from './pages/Employees';
import Reports from './pages/Reports';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-64"><p className="text-dark-400">جاري التحميل...</p></div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-dark-950"
    >
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/sales" element={<ProtectedRoute><Sales /></ProtectedRoute>} />
              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
              <Route path="/treasury" element={<ProtectedRoute><Treasury /></ProtectedRoute>} />
              <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
              <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </motion.div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid #334155',
              fontFamily: 'Cairo, sans-serif',
              direction: 'rtl',
            },
          }}
        />
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;