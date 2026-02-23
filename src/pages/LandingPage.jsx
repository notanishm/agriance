import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const { setLanguage, t } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    navigate('/roles');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', maxWidth: '500px' }}
      >
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(45, 90, 39, 0.05)',
          borderRadius: '999px',
          color: 'var(--primary)',
          fontSize: '0.9rem',
          fontWeight: '600'
        }}>
          <Globe size={18} />
          <span>Agriance Platform</span>
        </div>

        <h1 className="gradient-text" style={{
          fontSize: '3rem',
          fontWeight: '700',
          marginBottom: '1rem'
        }}>
          {t('landing.title')}
        </h1>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          marginBottom: '2rem'
        }}>
          {t('landing.subtitle')}
        </p>

        <div className="glass" style={{
          padding: '2rem',
          borderRadius: 'var(--radius-lg)'
        }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{t('landing.choose_language')}</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {['en', 'hi', 'mr'].map((lang) => (
              <button
                key={lang}
                className="btn btn-secondary"
                onClick={() => handleLanguageSelect(lang)}
                style={{
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  fontSize: '1rem'
                }}
              >
                <span>{lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'मराठी'}</span>
                <ArrowRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
