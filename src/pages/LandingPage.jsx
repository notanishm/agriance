import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sprout, Globe, ArrowRight, Leaf } from 'lucide-react';

const LandingPage = () => {
  const { setLanguage, t } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageSelect = (lang) => {
    setLanguage(lang);
    navigate('/roles');
  };

  return (
    <div className="agri-pattern" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      background: 'var(--bg-main)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, var(--primary) 0%, #15803d 100%)',
              borderRadius: '20px',
              marginBottom: '1.25rem',
              boxShadow: '0 8px 20px rgba(22, 101, 52, 0.3)'
            }}
          >
            <Sprout size={36} color="white" />
          </motion.div>
          
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.02em'
          }}>
            Agriance
          </h1>
          
          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
          }}>
            {t('landing.subtitle')}
          </p>
        </div>

        <div className="card" style={{
          padding: '1.5rem',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '1.25rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: '500'
          }}>
            <Globe size={16} />
            <span>{t('landing.choose_language')}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { code: 'en', label: 'English', flag: '🇺🇸' },
              { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
              { code: 'mr', label: 'मराठी', flag: '🇮🇳' }
            ].map((lang, i) => (
              <motion.button
                key={lang.code}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLanguageSelect(lang.code)}
                className="btn btn-secondary"
                style={{
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  fontSize: '0.95rem',
                  width: '100%',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
                  <span>{lang.label}</span>
                </span>
                <ArrowRight size={16} />
              </motion.button>
            ))}
          </div>
        </div>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.3rem'
        }}>
          <Leaf size={14} style={{ color: 'var(--primary)' }} />
          Connecting farmers & businesses
        </p>
      </motion.div>
    </div>
  );
};

export default LandingPage;
