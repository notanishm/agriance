import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from 'lucide-react';
import Logo from './Logo';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const Header = () => {
    const navigate = useNavigate();
    const { language, setLanguage } = useTranslation();
    const { user } = useAuth();

    return (
        <header style={{
            padding: '1.5rem clamp(1rem, 5vw, 3rem)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            background: 'transparent',
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'inherit' }}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                        background: 'var(--forest)',
                        color: 'var(--gold)',
                        borderRadius: '12px',
                        padding: '0.4rem',
                        display: 'flex',
                        boxShadow: 'var(--shadow-main)'
                    }}
                >
                    <Logo size={24} color="var(--gold)" />
                </motion.div>
                <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
                    fontWeight: 400,
                    color: 'var(--forest)',
                    letterSpacing: '-0.02em',
                }}>
                    Agriance
                </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(1rem, 3vw, 2.5rem)' }}>
                {/* Language Switcher */}
                <div style={{
                    display: 'flex',
                    gap: '0.15rem',
                    backgroundColor: 'rgba(14, 46, 33, 0.05)',
                    backdropFilter: 'blur(10px)',
                    padding: '0.25rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(14, 46, 33, 0.1)'
                }}>
                    {[
                        { code: 'en', label: 'EN' },
                        { code: 'hi', label: 'हि' },
                        { code: 'mr', label: 'मर' }
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            style={{
                                padding: '0.3rem clamp(0.5rem, 2vw, 0.8rem)',
                                borderRadius: '7px',
                                border: 'none',
                                background: language === lang.code ? 'var(--forest)' : 'transparent',
                                color: language === lang.code ? 'var(--sand)' : 'var(--forest)',
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                letterSpacing: '0.05em',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>

                {!user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link to="/login" style={{
                            textDecoration: 'none',
                            color: 'var(--forest)',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            letterSpacing: '0.05em',
                            opacity: 0.8
                        }} className="mobile-hide">
                            LOGIN
                        </Link>
                        <button
                            onClick={() => navigate('/roles')}
                            className="btn btn-primary"
                            style={{
                                padding: '0.6rem 1.25rem',
                                fontSize: '0.75rem',
                                borderRadius: '10px',
                                background: 'var(--forest)',
                                color: 'var(--sand)',
                                border: 'none',
                                fontWeight: 800,
                                cursor: 'pointer',
                            }}
                        >
                            <span className="mobile-hide">ESTABLISH ACCESS</span>
                            <span style={{ display: 'none' }} className="mobile-show">GET STARTED</span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => navigate(`/${user.user_metadata?.role || 'farmer'}/dashboard`)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '10px',
                            background: 'white',
                            border: '1px solid var(--border-light)',
                            color: 'var(--forest)',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                    >
                        <User size={16} /> <span className="mobile-hide">DASHBOARD</span>
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
