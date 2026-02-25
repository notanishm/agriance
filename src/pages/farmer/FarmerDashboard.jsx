import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Wallet,
    FileCheck,
    Tractor,
    TrendingUp,
    ShieldCheck,
    AlertCircle,
    ArrowRight,
    Sprout,
    MessageCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ChatWidget from '../../components/ChatWidget';
import { supabase } from '../../lib/supabase';

const FarmerDashboard = () => {
    const { t } = useTranslation();
    const { user, userProfile } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatAvailable, setChatAvailable] = useState(false);

    useEffect(() => {
        checkChatAvailability();
    }, [user]);

    const checkChatAvailability = async () => {
        if (!user) return;
        
        try {
            const { data: contracts } = await supabase
                .from('contracts')
                .select('id, business_id')
                .eq('farmer_id', user.id)
                .in('status', ['active', 'pending', 'accepted'])
                .limit(1);

            if (contracts && contracts.length > 0) {
                setChatAvailable(true);
                return;
            }

            const { data: conversations } = await supabase
                .from('conversations')
                .select('id')
                .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
                .limit(1);

            if (conversations && conversations.length > 0) {
                setChatAvailable(true);
            }
        } catch (err) {
            console.error('Error checking chat availability:', err);
        }
    };

    const menuItems = [
        { id: 'contracts', label: 'Trade Handshakes', icon: <FileCheck size={20} />, path: '/farmer/contracts' },
        { id: 'loans', label: 'Capital Access', icon: <Wallet size={20} />, path: '/farmer/loans' },
        { id: 'profile', label: 'Estate Profile', icon: <Sprout size={20} />, path: '/farmer/profile' },
    ];

    const stats = [
        { label: 'Active Contracts', value: '0', icon: <FileCheck size={18} />, color: 'var(--forest)', path: '/farmer/contracts' },
        { label: 'Pending Offers', value: '0', icon: <Bell size={18} />, color: 'var(--gold)', path: '/farmer/contracts' },
        { label: 'Total Earnings', value: '₹0', icon: <Wallet size={18} />, color: 'var(--olive)', path: '/farmer/loans' },
    ];

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: 'var(--bg-main)' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--forest)', marginBottom: '0.5rem' }}>
                    Welcome back, {userProfile?.full_name || 'Farmer'}
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Here's what's happening on your farm</p>
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

            {/* Active Contracts Placeholder */}
            <div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Active Contracts</h2>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    onClick={() => navigate('/farmer/contracts')}
                    style={{
                        background: 'var(--bg-card)',
                        padding: '3rem',
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        cursor: 'pointer'
                    }}
                >
                    <FileCheck size={48} color="var(--gold)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>No Active Contracts</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Check the Requirements tab to find contract opportunities</p>
                </motion.div>
            </div>

            {/* Chat Button - Only show if farmer has contracts or existing conversations */}
            {chatAvailable && (
                <>
                    <motion.button
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        onClick={() => setShowChat(true)}
                        style={{
                            position: 'fixed',
                            bottom: '20px',
                            right: '20px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: 'var(--forest)',
                            border: 'none',
                            color: 'white',
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

                    <AnimatePresence>
                        {showChat && user && (
                            <ChatWidget
                                currentUserId={user.id}
                                currentUserRole={userProfile?.role}
                                onClose={() => setShowChat(false)}
                            />
                        )}
                    </AnimatePresence>
                </>
            )}
        </div>
    );
};

export default FarmerDashboard;
