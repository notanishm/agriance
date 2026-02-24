import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from '../contexts/LanguageContext';
import { Mail, Lock, User, AlertCircle, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, error: authError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
      });
      if (error) {
        setError(error);
        return;
      }
      setSuccessMessage(t('register.success_subtitle'));
    } catch (err) {
      setError(err.message || 'Failed to initialize account');
    } finally {
      setLoading(false);
    }
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
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit', marginBottom: '4rem' }}>
            <div style={{ background: 'var(--forest)', color: 'var(--gold)', borderRadius: '12px', padding: '0.5rem', display: 'flex' }}>
              <ShieldCheck size={28} />
            </div>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--forest)' }}>Agriance</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--forest)', lineHeight: 1.1 }}>
              {t('register.heading')} <span className="text-gold" style={{ fontStyle: 'italic' }}>{t('register.heading_accent')}</span>
            </h2>
            <p style={{ fontSize: '1.2rem', color: 'var(--olive)', marginBottom: '3rem', lineHeight: 1.6 }}>
              {t('register.subtitle')}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                t('register.feature1'),
                t('register.feature2'),
                t('register.feature3'),
                t('register.feature4')
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--forest)', fontSize: '1.05rem', fontWeight: 600 }}>
                  <CheckCircle2 size={20} className="text-gold" />
                  {text}
                </div>
              ))}
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
        padding: 'clamp(1.5rem, 5vw, 2.5rem)',
        backgroundColor: 'var(--white)'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '100%', maxWidth: '480px' }}
        >
          <div style={{ marginBottom: '2.5rem' }}>
            {/* Mobile Logo */}
            <Link to="/" style={{ display: 'none', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'inherit', marginBottom: '2rem' }} className="mobile-show">
              <div style={{ background: 'var(--forest)', color: 'var(--gold)', borderRadius: '8px', padding: '0.4rem', display: 'flex' }}>
                <ShieldCheck size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', color: 'var(--forest)' }}>Agriance</span>
            </Link>

            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '0.5rem', color: 'var(--forest)' }}>{t('register.submit')}</h1>
            <p style={{ color: 'var(--olive)' }}>{t('register.subtitle')}</p>
          </div>

          {successMessage ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                backgroundColor: 'rgba(14, 46, 33, 0.03)',
                borderRadius: '24px',
                border: '1px solid var(--gold-glow)'
              }}
            >
              <div style={{ backgroundColor: 'var(--gold)', color: 'var(--forest)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--forest)' }}>{t('register.success_heading')}</h3>
              <p style={{ color: 'var(--olive)', marginBottom: '2rem' }}>{successMessage}</p>
              <Link to="/login" className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }}>{t('login.submit')}</Link>
            </motion.div>
          ) : (
            <>
              {(error || authError) && (
                <div style={{
                  backgroundColor: 'rgba(163, 92, 79, 0.1)',
                  color: 'var(--terracotta)',
                  padding: '1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  border: '1px solid rgba(163, 92, 79, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.9rem'
                }}>
                  <AlertCircle size={18} />
                  {error || authError}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)', paddingLeft: '4px' }}>{t('register.name_label')}</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--olive)' }} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={t('register.name_placeholder')}
                      style={{ paddingLeft: '3rem', height: '52px', borderRadius: '10px' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)', paddingLeft: '4px' }}>{t('register.email_label')}</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--olive)' }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('register.email_placeholder')}
                      style={{ paddingLeft: '3rem', height: '52px', borderRadius: '10px' }}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)', paddingLeft: '4px' }}>{t('register.password_label')}</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--olive)' }} />
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        style={{ paddingLeft: '3rem', height: '52px', borderRadius: '10px' }}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--forest)', paddingLeft: '4px' }}>{t('register.confirm_password_label')}</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--olive)' }} />
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        style={{ paddingLeft: '3rem', height: '52px', borderRadius: '10px' }}
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: '100%', height: '56px', borderRadius: '12px', fontSize: '1.05rem', marginTop: '1rem' }}
                >
                  {loading ? '...' : t('register.submit')} <ArrowRight size={20} />
                </button>
              </form>

              <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }}></div>
                <span style={{ fontSize: '0.75rem', color: 'var(--olive)', fontWeight: 700 }}>{t('common.or') || 'OR'}</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-light)' }}></div>
              </div>

              <button
                onClick={signInWithGoogle}
                className="btn btn-secondary"
                style={{ width: '100%', gap: '0.75rem', borderRadius: '12px', height: '52px' }}
              >
                {t('login.google_login')}
              </button>

              <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--olive)', fontSize: '0.9rem' }}>
                {t('register.already_member')} <Link to="/login" style={{ color: 'var(--gold)', fontWeight: 800, textDecoration: 'none' }}>{t('register.login_link')}</Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
