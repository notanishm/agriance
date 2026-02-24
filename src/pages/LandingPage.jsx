import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  FileText,
  Wallet,
  ArrowRight,
  Lock,
  Users,
  CheckCircle2,
  TrendingUp,
  Landmark
} from 'lucide-react';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleLanguageSelect = (lang) => {
    localStorage.setItem('lang', lang);
    setLanguage(lang);
    setTimeout(() => navigate('/roles'), 100);
  };
=======
  const features = [
    {
      icon: <FileText size={32} />,
      title: t('landing.feature_contracts_title'),
      desc: t('landing.feature_contracts_desc')
    },
    {
      icon: <Wallet size={32} />,
      title: t('landing.feature_credit_title'),
      desc: t('landing.feature_credit_desc')
    },
    {
      icon: <Users size={32} />,
      title: t('landing.feature_direct_title'),
      desc: t('landing.feature_direct_desc')
    }
  ];
>>>>>>> c74a01f (Changes in ui)

  return (
    <div className="agri-pattern" style={{ minHeight: '100vh', overflowX: 'hidden' }}>

      {/* Hero Section */}
      <section style={{
        paddingTop: 'clamp(100px, 15vh, 160px)',
        paddingBottom: 'clamp(60px, 10vh, 120px)',
        position: 'relative'
      }}>
        <div className="canvas">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              style={{ maxWidth: '900px', width: '100%' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ height: '1px', width: '30px', background: 'var(--gold)' }} className="mobile-hide" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--olive)', textTransform: 'uppercase' }}>
                  {t('landing.tagline')}
                </span>
                <div style={{ height: '1px', width: '30px', background: 'var(--gold)' }} className="mobile-hide" />
              </div>

              <h1 style={{
                color: 'var(--forest)',
                marginBottom: '2.5rem',
                letterSpacing: '-0.03em',
                fontWeight: 400
              }}>
                {t('landing.heading_part1')} <span className="text-gold" style={{ fontStyle: 'italic' }}>{t('landing.heading_accent')}</span>. <br />
                <span>{t('landing.heading_part2')}</span> <span className="text-forest" style={{ fontWeight: 800 }}>{t('landing.heading_bold')}</span>
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                color: 'var(--olive)',
                maxWidth: '650px',
                margin: '0 auto 4rem',
                lineHeight: 1.6,
                opacity: 0.9
              }}>
                {t('landing.description')}
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate('/roles')}
                  className="btn btn-primary mobile-full"
                  style={{
                    padding: '1rem 2.5rem',
                    fontSize: '1rem',
                    borderRadius: '14px',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  {t('landing.cta_primary')} <ArrowRight size={18} />
                </button>
                <button className="btn btn-secondary mobile-full" style={{
                  padding: '1rem 2.5rem',
                  fontSize: '1rem',
                  borderRadius: '14px'
                }}>
                  {t('landing.cta_secondary')}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section style={{ padding: '0 0 80px' }}>
        <div className="canvas">
          <div className="mobile-stack" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(1.5rem, 4vw, 4rem)',
            padding: '2.5rem',
            background: 'white',
            borderRadius: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Landmark size={20} className="text-gold" />
              <span style={{ fontWeight: 700, color: 'var(--olive)', fontSize: '0.8rem' }}>RBI REGULATED PARTNERS</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--border-light)' }} className="mobile-hide" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={20} className="text-gold" />
              <span style={{ fontWeight: 700, color: 'var(--olive)', fontSize: '0.8rem' }}>VERIFIED TRADE DATA</span>
            </div>
            <div style={{ width: '1px', height: '20px', background: 'var(--border-light)' }} className="mobile-hide" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp size={20} className="text-gold" />
              <span style={{ fontWeight: 700, color: 'var(--olive)', fontSize: '0.8rem' }}>REAL-TIME SETTLEMENTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: 'clamp(60px, 10vh, 120px) 0', background: 'var(--forest)' }}>
        <div className="canvas">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 8vh, 6rem)' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--gold)', opacity: 0.8 }}>{t('landing.pillar_tagline')}</span>
            <h2 style={{ color: 'var(--sand)', marginTop: '1rem', fontWeight: 400 }}>{t('landing.pillar_heading')} <span style={{ fontStyle: 'italic', fontWeight: 300 }}>{t('landing.pillar_heading_italic')}</span></h2>
          </div>

          <div className="grid grid-cols-3 tablet-cols-1 mobile-cols-1" style={{ gap: '2rem' }}>
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{
                  padding: 'clamp(2rem, 5vw, 4rem) clamp(1.5rem, 4vw, 3rem)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(231, 216, 201, 0.08)',
                  borderRadius: '24px',
                  textAlign: 'left'
                }}
              >
                <div style={{ color: 'var(--gold)', marginBottom: '2rem' }}>{f.icon}</div>
                <h3 style={{ color: 'var(--sand)', marginBottom: '1rem', fontWeight: 400 }}>{f.title}</h3>
                <p style={{ color: 'var(--sand)', opacity: 0.6, lineHeight: 1.6, fontSize: '0.95rem' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ padding: 'clamp(80px, 12vh, 140px) 0' }}>
        <div className="canvas">
          <div className="grid grid-cols-4 tablet-cols-2 mobile-cols-1" style={{ gap: '3rem' }}>
            {[
              { label: t('landing.network_nodes'), val: t('landing.network_nodes_val') },
              { label: t('landing.capital_deployed'), val: t('landing.capital_deployed_val') },
              { label: t('landing.contracts_secured'), val: t('landing.contracts_secured_val') },
              { label: t('landing.settlement_time'), val: t('landing.settlement_time_val') }
            ].map((m, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--olive)', letterSpacing: '0.1em', marginBottom: '0.5rem', textTransform: 'uppercase' }}>{m.label}</div>
                <div style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 400, fontFamily: 'var(--font-heading)', color: 'var(--forest)' }}>{m.val}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: 'clamp(60px, 10vh, 100px) 0 40px',
        backgroundColor: 'var(--sand-light)',
        borderTop: '1px solid var(--border-light)'
      }}>
        <div className="canvas">
          <div className="grid grid-cols-3 tablet-cols-1 mobile-cols-1" style={{ gap: '4rem', marginBottom: '4rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <ShieldCheck size={28} className="text-forest" />
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', color: 'var(--forest)' }}>Agriance</span>
              </div>
              <p style={{ color: 'var(--olive)', maxWidth: '400px', fontSize: '1rem', lineHeight: 1.6 }}>
                {t('landing.footer_desc')}
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--forest)', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>LOCATIONS</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--olive)', fontSize: '0.9rem' }}>
                <span>Maharashtra</span>
                <span>Madhya Pradesh</span>
                <span>Karnataka</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--forest)', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>RESOURCES</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--olive)', fontSize: '0.9rem' }}>
                <span>Trade Guidelines</span>
                <span>Platform Demo</span>
                <span>Support Desk</span>
              </div>
            </div>
          </div>

          <div className="mobile-stack" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-light)',
            color: 'var(--olive)',
            fontSize: '0.85rem'
          }}>
            <span>{t('landing.footer_bottom')}</span>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <Lock size={12} /> SECURE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}>
                <CheckCircle2 size={12} /> VERIFIED
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
