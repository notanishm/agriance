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
    <div className="landing-two-col">
      <section className="left-column" style={{ padding: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', padding: '0.5rem 1rem', background: 'rgba(45, 90, 39, 0.05)', borderRadius: '999px', color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>
          <Globe size={18} />
          <span>Agriance Platform</span>
        </div>
        <h1 className="gradient-text" style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '1rem' }}>
          {t('landing.title')}
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '28rem' }}>
          {t('landing.subtitle')}
        </p>
      </section>
      <section className="right-column" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '420px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>{t('landing.choose_language')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {['en','hi','mr'].map((lang) => (
              <button key={lang} className="btn btn-secondary" onClick={()=>handleLanguageSelect(lang)} style={{ padding: '1.25rem 2rem', fontSize: '1.1rem', justifyContent: 'space-between' }}>
                <span>{lang==='en'?'English': lang==='hi'?'हिन्दी':'मराठी'}</span>
                <ArrowRight size={20} />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
