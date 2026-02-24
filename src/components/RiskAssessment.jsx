import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, Activity, Target, Layers } from 'lucide-react';
import { RISK_FACTORS } from '../data/loans';

const RiskAssessment = ({ score, breakdown }) => {
    const getRiskStatus = (s) => {
        if (s >= 80) return { label: 'MINIMAL RISK', color: 'var(--blue-trust)', bg: 'rgba(14, 46, 33, 0.05)' };
        if (s >= 60) return { label: 'MODERATE EXPOSURE', color: 'var(--gold)', bg: 'rgba(212, 175, 55, 0.05)' };
        return { label: 'HIGH EXPOSURE', color: 'var(--terracotta)', bg: 'rgba(215, 87, 87, 0.05)' };
    };

    const status = getRiskStatus(score);

    return (
        <div style={{
            padding: '2.5rem',
            background: 'white',
            borderRadius: '24px',
            border: '1px solid var(--border-light)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.04)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'var(--sand-light)', borderRadius: '12px' }}>
                            <ShieldCheck color="var(--blue-trust)" size={24} />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'var(--forest)' }}>Credit Protocol <span className="text-gold">Synthesis</span></h3>
                    </div>
                    <p style={{ margin: 0, color: 'var(--olive)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
                        AI-DRIVEN RISK ANALYTICS BASELINE
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: status.color, lineHeight: 1 }}>
                        {score}<span style={{ fontSize: '1.2rem', color: 'var(--olive)', opacity: 0.5, fontWeight: 700 }}> / 100</span>
                    </div>
                    <div style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        color: status.color,
                        letterSpacing: '0.15em',
                        marginTop: '0.5rem',
                        padding: '0.4rem 0.8rem',
                        background: status.bg,
                        borderRadius: '20px',
                        display: 'inline-block'
                    }}>
                        {status.label}
                    </div>
                </div>
            </div>

            <div style={{ height: '8px', background: 'var(--sand-light)', borderRadius: '10px', overflow: 'hidden', marginBottom: '3.5rem' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{ height: '100%', background: status.color, boxShadow: `0 0 20px ${status.color}40` }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginBottom: '3rem' }}>
                {Object.entries(RISK_FACTORS).map(([key, config]) => {
                    const value = breakdown[config.id] || 0;
                    const percentage = (value / config.weight) * 100;

                    return (
                        <div key={key}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.75rem' }}>
                                <span style={{ color: 'var(--olive)', fontWeight: 800, letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {config.label.toUpperCase()} <Info size={14} style={{ opacity: 0.4 }} />
                                </span>
                                <span style={{ fontWeight: 800, color: 'var(--blue-trust)' }}>{value} / {config.weight} <span style={{ opacity: 0.4 }}>PTS</span></span>
                            </div>
                            <div style={{ height: '4px', background: 'var(--sand-light)', borderRadius: '10px', overflow: 'hidden' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    style={{
                                        height: '100%',
                                        background: percentage > 70 ? 'var(--blue-trust)' : 'var(--olive)',
                                        borderRadius: '10px',
                                        opacity: percentage > 70 ? 1 : 0.4
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{
                padding: '1.5rem',
                background: 'var(--sand-light)',
                borderRadius: '16px',
                fontSize: '0.75rem',
                color: 'var(--olive)',
                fontWeight: 500,
                lineHeight: 1.6,
                borderLeft: `2px solid ${status.color}`,
                display: 'flex',
                gap: '1rem'
            }}>
                <Target size={18} style={{ flexShrink: 0, opacity: 0.5 }} />
                <span>
                    This synthesis is generated via real-time analysis of cross-node historical trade protocols and verified soil productivity data.
                    Institutional users are advised to cross-reference this baseline with internal compliance frameworks.
                </span>
            </div>
        </div>
    );
};

export default RiskAssessment;
