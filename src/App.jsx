import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import RoleSelection from './pages/RoleSelection';
import FarmerOnboarding from './pages/farmer/FarmerOnboarding';
import BusinessOnboarding from './pages/business/BusinessOnboarding';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BusinessDashboard from './pages/business/BusinessDashboard';
import BankOnboarding from './pages/bank/BankOnboarding';
import BankDashboard from './pages/bank/BankDashboard';
import { ShieldCheck } from 'lucide-react';
import AuthCallback from './pages/AuthCallback';

const AppContent = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const publicRoutes = ['/', '/login', '/register', '/auth/callback', '/roles'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  const showSidebar = user && !isPublicRoute;

  if (loading) {
    return (
      <div className="agri-pattern" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--sand-light)' }}>
        <div className="animate-sprout">
          <div style={{ background: 'var(--white)', padding: '2rem', borderRadius: '24px', boxShadow: 'var(--shadow-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={48} color="var(--forest)" />
          </div>
        </div>
      </div>
    );
  }

  const hideHeaderNames = ['/login', '/register', '/roles'];
  const hideHeader = showSidebar || hideHeaderNames.includes(location.pathname);

  return (
    <div className={`app-container ${showSidebar ? 'has-sidebar' : ''}`}>
      {!hideHeader && <Header />}
      {showSidebar && <Sidebar />}

      <main style={{
        marginLeft: showSidebar ? '280px' : '0',
        transition: 'margin-left 0.3s ease'
      }}>
        <div className={showSidebar ? 'canvas' : ''}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/roles" element={<RoleSelection />} />

            {/* Onboarding routes - require authentication */}
            <Route
              path="/farmer/register"
              element={
                <ProtectedRoute>
                  <FarmerOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/register"
              element={
                <ProtectedRoute>
                  <BusinessOnboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank/register"
              element={
                <ProtectedRoute>
                  <BankOnboarding />
                </ProtectedRoute>
              }
            />

            {/* Protected dashboard routes - role-based access */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute requiredRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/business/dashboard"
              element={
                <ProtectedRoute requiredRole="business">
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bank/dashboard"
              element={
                <ProtectedRoute requiredRole="bank">
                  <BankDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
