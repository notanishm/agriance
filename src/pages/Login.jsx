import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/roles';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error);
      setIsLoading(false);
    } else {
      // Check if user has profile and redirect accordingly
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarding_completed')
        .eq('id', data.user.id)
        .single();
      
      if (profile?.onboarding_completed) {
        navigate(`/${profile.role}/dashboard`, { replace: true });
      } else if (profile?.role) {
        navigate(`/${profile.role}/register`, { replace: true });
      } else {
        navigate('/roles', { replace: true });
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      const { error } = await signInWithGoogle();
      if (error) {
        setError(error);
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in with Google');
    }
  };

  // Test user login
  const handleTestLogin = async () => {
    setEmail('hello@agriance.com');
    setPassword('1234');
    setIsLoading(true);
    const { error } = await signIn('hello@agriance.com', '1234');
    if (!error) {
      navigate('/roles', { replace: true });
    } else {
      setError(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="agri-pattern" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      backgroundColor: 'var(--bg-main)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card"
        style={{
          maxWidth: '380px',
          width: '100%',
          padding: '1.75rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #15803d 100%)',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 0.75rem',
              color: 'white',
              boxShadow: '0 4px 12px rgba(22, 101, 52, 0.25)'
            }}
          >
            <LogIn size={26} />
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem', color: 'var(--text-main)', fontWeight: '700' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Sign in to continue
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '0.75rem',
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.2)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--error)',
              fontSize: '0.85rem',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem' }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required style={{ padding: '0.65rem 0.75rem 0.65rem 2.25rem', fontSize: '0.9rem' }} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '500', fontSize: '0.9rem' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ padding: '0.65rem 0.75rem 0.65rem 2.25rem', fontSize: '0.9rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <input type="checkbox" style={{ width: '14px', height: '14px' }} />
              <span>Remember</span>
            </label>
            <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--primary)' }}>Forgot?</Link>
          </div>

          <button type="submit" disabled={isLoading} className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', marginBottom: '0.75rem' }}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <button type="button" onClick={handleTestLogin} style={{ width: '100%', padding: '0.55rem', fontSize: '0.8rem', marginBottom: '1rem', background: 'rgba(22, 101, 52, 0.08)', color: 'var(--primary)', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            Test: hello@agriance.com / 1234
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
            <span>or</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
          </div>

          <button type="button" onClick={handleGoogleSignIn} disabled={isLoading} style={{ width: '100%', padding: '0.7rem', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign up</Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
