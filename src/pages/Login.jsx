import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';
import {
  Mail,
  Lock,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error);
      setIsLoading(false);
    } else {
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
  const handleTestLogin = async (email) => {
    const testEmail = email || 'hello@agriance.com';
    setEmail(testEmail);
    setPassword('1234');
    setIsLoading(true);
    const { error } = await signIn(testEmail, '1234');
    if (!error) {
      navigate('/roles', { replace: true });
    } else {
      setError(error);
    }
    setIsLoading(false);
  };

  return (
    <div className="mobile-stack" style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--white)' }}>
      {/* Left Side */}
      <div className="agri-pattern mobile-hide" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem)',
        backgroundColor: 'var(--sand)',
        borderRight: '1px solid var(--border-light)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '480px', position: 'relative', zIndex: 10 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit', marginBottom: '5rem' }}>
            <div style={{ background: 'var(--forest)', color: 'var(--gold)', borderRadius: '12px', padding: '0.4rem', display: 'flex' }}>
              <Logo size={28} color="var(--gold)" />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--forest)' }}>Agriance</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--forest)', lineHeight: 1.1 }}>
              {t('login.heading')} <span className="text-gold" style={{ fontStyle: 'italic' }}>{t('login.heading_accent')}</span>
            </h2>
            <p style={{ fontSize: '1.25rem', color: 'var(--olive)', marginBottom: '3.5rem', lineHeight: 1.6 }}>
              {t('login.subtitle')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                <div style={{ color: 'var(--gold)', backgroundColor: 'var(--forest)', padding: '0.75rem', borderRadius: '12px' }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--forest)' }}>{t('landing.feature_contracts_title')}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--olive)' }}>{t('landing.feature_contracts_desc')}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(1.5rem, 5vw, 2rem)',
        backgroundColor: 'var(--white)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ width: '100%', maxWidth: '400px' }}
        >
          <div style={{ marginBottom: '2.5rem' }}>
            {/* Mobile Logo */}
            <Link to="/" style={{ display: 'none', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit', marginBottom: '2rem' }} className="mobile-show">
              <div style={{ background: 'var(--forest)', color: 'var(--gold)', borderRadius: '8px', padding: '0.4rem', display: 'flex' }}>
                <Logo size={20} color="var(--gold)" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--forest)' }}>Agriance</span>
            </Link>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '0.5rem', color: 'var(--forest)' }}>{t('common.login')}</h1>
            <p style={{ color: 'var(--olive)', fontSize: '1rem' }}>{t('login.subtitle')}</p>
          </div>

          {error && (
            <div style={{
              backgroundColor: 'rgba(163, 92, 79, 0.1)',
              color: 'var(--terracotta)',
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '0.9rem',
              border: '1px solid rgba(163, 92, 79, 0.2)'
            }}>
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)', paddingLeft: '4px' }}>{t('login.email_label')}</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--olive)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('login.email_placeholder')}
                  style={{ paddingLeft: '3.25rem', height: '52px', borderRadius: '12px' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', padding: '0 4px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)' }}>{t('login.password_label')}</label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: 'var(--gold)', fontWeight: 700, textDecoration: 'none' }}>{t('login.forgot_password')}</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--olive)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ paddingLeft: '3.25rem', height: '52px', borderRadius: '12px' }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{ width: '100%', height: '52px', borderRadius: '12px', fontSize: '1rem', marginTop: '0.5rem' }}
            >
              {isLoading ? '...' : t('login.submit')} <ArrowRight size={20} />
            </button>
          </form>

          <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }}></div>
            <span style={{ fontSize: '0.7rem', color: 'var(--olive)', fontWeight: 700, letterSpacing: '0.1em' }}>{t('login.or_continue_with')}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }}></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="btn btn-secondary"
            style={{ width: '100%', gap: '0.75rem', borderRadius: '12px', height: '52px', borderColor: 'var(--border)' }}
          >
            <Search size={18} />
            {t('login.google_login')}
          </button>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button type="button" onClick={() => handleTestLogin('hello@agriance.com')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: 'rgba(22, 101, 52, 0.08)', color: 'var(--primary)', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
              Test 1
            </button>
            <button type="button" onClick={() => handleTestLogin('bye@agriance.com')} style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem', background: 'rgba(22, 101, 52, 0.08)', color: 'var(--primary)', border: '1px dashed var(--primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
              Test 2
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--olive)', fontSize: '0.9rem' }}>
            {t('login.no_account')} <Link to="/register" style={{ color: 'var(--gold)', fontWeight: 800, textDecoration: 'none' }}>{t('login.register_link')}</Link>
          </p>

          <div style={{
            marginTop: '3.5rem',
            padding: '0.875rem',
            backgroundColor: 'var(--sand-light)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.4rem',
            color: 'var(--olive)',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            border: '1px solid var(--border-light)'
          }}>
            <Lock size={12} className="text-gold" />
            <span>{t('login.secure_vault')}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
