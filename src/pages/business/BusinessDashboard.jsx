import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { motion } from 'framer-motion';
import {
    Plus, Search, MapPin, Star, Filter,
    ArrowRight, CheckCircle, Globe, Banknote,
    ShieldCheck, ChevronDown, Landmark, Briefcase,
    TrendingUp, Users, FileText, Building2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const BusinessDashboard = () => {
    const { t } = useTranslation();
    const { user, userProfile } = useAuth();
    const [loading, setLoading] = useState(false);

    const menuItems = [
        { id: 'pipeline', label: 'Procurement Flow', icon: <TrendingUp size={20} />, path: '/business/pipeline' },
        { id: 'farmers', label: 'Ecosystem Network', icon: <Users size={20} />, path: '/business/farmers' },
        { id: 'profile', label: 'Institutional ID', icon: <Building2 size={20} />, path: '/business/profile' },
    ];

    const stats = [
        { label: 'Active Contracts', value: '0', icon: <FileText size={18} />, color: 'var(--forest)' },
        { label: 'Farmers Connected', value: '0', icon: <Users size={18} />, color: 'var(--gold)' },
        { label: 'Total Sourcing', value: '₹0', icon: <Banknote size={18} />, color: 'var(--olive)' },
    ];

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-main)' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '0.5rem' }}>
                    Welcome back, {userProfile?.full_name || 'Business'}
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your procurement and farmer network</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{
                            background: 'var(--bg-card)',
                            padding: '1.25rem',
                            borderRadius: '12px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ padding: '0.5rem', background: `${stat.color}20`, borderRadius: '8px', color: stat.color }}>
                                {stat.icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stat.value}</div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {menuItems.map((item) => (
                        <motion.button
                            key={item.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => window.location.href = item.path}
                            style={{
                                background: 'var(--bg-card)',
                                border: 'none',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ color: 'var(--forest)' }}>{item.icon}</div>
                                <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.label}</span>
                            </div>
                            <ArrowRight size={16} color="var(--text-muted)" />
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Marketplace Placeholder */}
            <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Farmer Marketplace</h2>
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '3rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                    <Users size={48} color="var(--gold)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>No Farmers Yet</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse the farmer network to find suppliers</p>
                </div>
            </div>
        </div>
    );
};

export default BusinessDashboard;
