import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, MapPin, Star, Filter,
    ArrowRight, CheckCircle, Globe, Banknote,
    ShieldCheck, ChevronDown, Landmark, Briefcase,
    TrendingUp, Users, FileText, Building2, Phone, Mail, MessageCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import ChatWidget from '../../components/ChatWidget';

const BusinessDashboard = () => {
    const { t } = useTranslation();
    const { user, userProfile } = useAuth();
    const navigate = useNavigate();
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showChat, setShowChat] = useState(false);
    const [error, setError] = useState(null);

    const fetchFarmers = async (retryCount = 0) => {
        setLoading(true);
        setError(null);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('id, full_name, phone_number, location, kyc_status, role')
                .eq('role', 'farmer')
                .limit(20);

            clearTimeout(timeoutId);

            if (fetchError) {
                if ((fetchError.message?.includes('network') || fetchError.code === 'PGRST301') && retryCount < 3) {
                    await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
                    return fetchFarmers(retryCount + 1);
                }
                setError(fetchError.message);
                return;
            }

            setFarmers(data || []);
        } catch (err) {
            const errorMsg = err.name === 'AbortError' 
                ? 'Request timed out. Please try again.' 
                : err.message || 'Network error. Please check your connection.';
            
            setError(errorMsg);
            if (retryCount < 3 && err.name !== 'AbortError') {
                await new Promise(r => setTimeout(r, 1000 * (retryCount + 1)));
                return fetchFarmers(retryCount + 1);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, []);

    const menuItems = [
        { id: 'pipeline', label: 'Procurement Flow', icon: <TrendingUp size={20} />, path: '/business/pipeline' },
        { id: 'farmers', label: 'Ecosystem Network', icon: <Users size={20} />, path: '/business/farmers' },
        { id: 'profile', label: 'Institutional ID', icon: <Building2 size={20} />, path: '/business/profile' },
    ];

    const stats = [
        { label: 'Active Contracts', value: '0', icon: <FileText size={18} />, color: 'var(--forest)', path: '/business/pipeline' },
        { label: 'Farmers Connected', value: farmers.length > 0 ? farmers.length.toString() : '0', icon: <Users size={18} />, color: 'var(--gold)', path: '/business/farmers' },
        { label: 'Total Sourcing', value: '₹0', icon: <Banknote size={18} />, color: 'var(--olive)', path: '/business/profile' },
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
                        onClick={() => navigate(stat.path)}
                        whileHover={{ scale: 1.02, cursor: 'pointer' }}
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
                            onClick={() => navigate(item.path)}
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

            {/* Farmer Marketplace */}
            <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Farmer Marketplace</h2>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading farmers...</div>
                ) : error ? (
                    <motion.div
                        style={{
                            background: 'var(--bg-card)',
                            padding: '2rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                        }}
                    >
                        <p style={{ color: 'var(--error)', marginBottom: '1rem' }}>{error}</p>
                        <button 
                            onClick={() => fetchFarmers()}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'var(--forest)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                            }}
                        >
                            Retry
                        </button>
                    </motion.div>
                ) : farmers.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                        {farmers.map((farmer) => (
                            <motion.div
                                key={farmer.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                whileHover={{ scale: 1.02 }}
                                style={{
                                    background: 'var(--bg-card)',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => navigate('/business/farmers')}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                    <div>
                                        <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{farmer.full_name || 'Farmer'}</h3>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <MapPin size={14} /> {farmer.location || 'Location not set'}
                                        </p>
                                    </div>
                                    <div style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        background: farmer.kyc_status === 'verified' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                                        color: farmer.kyc_status === 'verified' ? 'var(--success)' : 'var(--gold)'
                                    }}>
                                        {farmer.kyc_status === 'verified' ? 'Verified' : 'Pending'}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {farmer.phone_number && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Phone size={14} /> {farmer.phone_number}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        whileHover={{ scale: 1.01 }}
                        onClick={() => navigate('/business/farmers')}
                        style={{
                            background: 'var(--bg-card)',
                            padding: '3rem',
                            borderRadius: '12px',
                            textAlign: 'center',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            cursor: 'pointer'
                        }}
                    >
                        <Users size={48} color="var(--gold)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>No Farmers Yet</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Browse the farmer network to find suppliers</p>
                    </motion.div>
                )}
            </div>

            {/* Chat Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowChat(!showChat)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--forest)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(14, 46, 33, 0.4)',
                    zIndex: 999,
                }}
            >
                <MessageCircle size={28} />
            </motion.button>

            {/* Chat Widget */}
            <AnimatePresence>
                {showChat && user && (
                    <ChatWidget
                        currentUserId={user.id}
                        currentUserRole={userProfile?.role}
                        onClose={() => setShowChat(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default BusinessDashboard;
