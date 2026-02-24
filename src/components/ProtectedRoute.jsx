import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';

/**
 * Loading Screen Component
 */
const LoadingScreen = () => (
  <div
    className="agri-pattern"
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--sand-light)',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 2rem' }}>
        <Loader2
          size={80}
          className="animate-spin"
          style={{ color: 'var(--blue-trust-light)', opacity: 0.2, position: 'absolute', top: 0, left: 0 }}
        />
        <div style={{
          position: 'absolute',
          top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          color: 'var(--blue-trust)'
        }}>
          <ShieldCheck size={32} />
        </div>
      </div>
      <p style={{
        color: 'var(--forest)',
        fontWeight: 800,
        letterSpacing: '0.3em',
        fontSize: '0.7rem',
        textTransform: 'uppercase'
      }}>
        Initializing Protocol Nodes
      </p>
    </div>
  </div>
);

/**
 * Protected Route Component
 * Requires authentication and optionally a specific role
 */
export const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role if required
  if (requiredRole && userProfile?.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's role
    const rolePaths = {
      farmer: '/farmer/dashboard',
      business: '/business/dashboard',
      bank: '/bank/dashboard',
    };

    const redirectPath = rolePaths[userProfile?.role] || '/roles';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

/**
 * Public Route Component
 * Redirects authenticated users to their dashboard
 */
export const PublicRoute = ({ children }) => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect authenticated users to their dashboard
  if (user && userProfile) {
    const rolePaths = {
      farmer: '/farmer/dashboard',
      business: '/business/dashboard',
      bank: '/bank/dashboard',
    };

    const redirectPath = rolePaths[userProfile.role] || '/roles';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
