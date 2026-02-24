import React, { useMemo } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sprout, Building2, ChevronRight, Landmark, ShieldCheck } from 'lucide-react';

const RoleSelection = () => {
    const { t, language } = useTranslation();
    const navigate = useNavigate();

    const roles = useMemo(() => [
        {
            id: 'farmer',
            title: t('roles.farmer'),
            description: t('roles.farmer_desc'),
            icon: <Sprout size={40} />,
            accent: 'var(--gold)',
            radius: 'var(--radius-farmer)',
            path: '/farmer/register',
            className: 'card-farmer'
        },
        {
            id: 'business',
            title: t('roles.business'),
            description: t('roles.business_desc'),
            icon: <Building2 size={40} />,
            accent: 'var(--olive)',
            radius: 'var(--radius-business)',
            path: '/business/register',
            className: 'card-business'
        },
        {
            id: 'bank',
            title: t('roles.bank'),
            description: t('roles.bank_desc'),
            icon: <Landmark size={40} />,
            accent: 'var(--blue-trust)',
            radius: 'var(--radius-bank)',
            path: '/bank/register',
            className: 'card-bank'
        }
    ], [t]);

    return (
        <div className="agri-pattern" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'clamp(2rem, 10vh, 4rem) 1.5rem',
        }}>
            <div style={{ maxWidth: '1200px', width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 8vh, 4rem)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <ShieldCheck size={28} color="var(--forest)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.15rem', color: 'var(--olive)', textTransform: 'uppercase' }}>
                            Agriance
                        </span>
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '1rem', color: 'var(--forest)' }}>
                        {t('roles.title')}
                    </h1>
                </div>

                <div className="grid grid-cols-3 tablet-cols-1 mobile-cols-1" style={{ gap: '1.5rem' }}>
                    {roles.map((role, idx) => (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => navigate(role.path)}
                            className={`card ${role.className}`}
                            style={{
                                cursor: 'pointer',
                                padding: 'clamp(1.5rem, 5vw, 3rem) 2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                background: 'white',
                                height: '100%'
                            }}
                        >
                            <div style={{
                                color: role.accent,
                                marginBottom: '1.5rem',
                                padding: '1.25rem',
                                background: 'var(--sand-light)',
                                borderRadius: '24px'
                            }}>
                                {role.icon}
                            </div>
                            <h3 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', marginBottom: '0.75rem' }}>{role.title}</h3>
                            <p style={{
                                color: 'var(--olive)',
                                marginBottom: '2rem',
                                flexGrow: 1,
                                fontSize: '1rem',
                                lineHeight: 1.5
                            }}>
                                {role.description}
                            </p>
                            <button className="btn btn-secondary" style={{ width: '100%', padding: '0.75rem' }}>
                                {t('roles.cta')} <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
