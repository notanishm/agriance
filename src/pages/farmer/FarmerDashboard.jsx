import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Bell,
    Wallet,
    FileCheck,
    Tractor,
    TrendingUp,
    ShieldCheck,
    Microscope,
    ThermometerSun,
    AlertCircle,
    ArrowRight,
    Wheat,
    Leaf
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { farmerService } from '../../services/database';

const FarmerDashboard = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { isDark } = useTheme();
    const navigate = useNavigate();
    const [contracts, setContracts] = useState([]);
    const [loans, setLoans] = useState([]);
    const [postings, setPostings] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('contracts');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                const { data: contractsData, error: contractsError } = await farmerService.getFarmerContracts(user.id);
                if (contractsError) throw contractsError;
                setContracts(contractsData || []);

                const { data: loansData, error: loansError } = await farmerService.getFarmerLoans(user.id);
                if (loansError) throw loansError;
                setLoans(loansData || []);

                // Fetch available postings
                const { data: postingsData, error: postingsError } = await farmerService.getAvailablePostings();
                if (!postingsError) setPostings(postingsData || []);

                const { data: profileData, error: profileError } = await farmerService.getFarmerProfile(user.id);
                if (profileError) throw profileError;
                setProfile(profileData);

            } catch (err) {
                console.error('Error fetching farmer data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const activeContractsCount = contracts.filter(c => c.status === 'active' || c.status === 'in_progress').length;
    const pendingOffersCount = contracts.filter(c => c.status === 'pending').length;
    const totalEarnings = contracts
        .filter(c => c.status === 'completed')
        .reduce((sum, c) => sum + (c.total_value || 0), 0);

    const profileFields = [
        { key: 'full_name', label: t('profile.fullName'), value: profile?.full_name },
        { key: 'phone_number', label: t('profile.phone'), value: profile?.phone_number },
    ];

    const missingFields = [
        !profile?.full_name && 'Full Name',
        !profile?.phone_number && 'Phone Number',
        !profile?.farm_size && 'Farm Size',
        !profile?.location && 'Location'
    ].filter(Boolean);

    const completedFields = profileFields.filter(f => f.value).length;
    const completionPercent = profileFields.length > 0 ? Math.round((completedFields / profileFields.length) * 100) : 100;

    const stats = [
        { label: 'Active Contracts', value: activeContractsCount.toString(), icon: <FileCheck color="var(--primary)" /> },
        { label: 'Pending Offers', value: pendingOffersCount.toString(), icon: <Bell color="#B8860B" /> },
        { label: 'Total Earnings', value: `₹${(totalEarnings / 100000).toFixed(1)}L`, icon: <Wallet color="var(--success)" /> },
        { label: 'Upcoming Harvest', value: '15 Days', icon: <Tractor color="#4A8B3F" /> }
    ];

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#fcfdfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                    <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ minHeight: '100vh', background: '#fcfdfa', padding: '3rem 4rem' }}>
                <div className="card" style={{ padding: '2rem', maxWidth: '600px', margin: '2rem auto', border: '1px solid #ef4444' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', marginBottom: '1rem' }}>
                        <AlertCircle size={24} />
                        <h3 style={{ margin: 0 }}>Error Loading Dashboard</h3>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{error}</p>
                    <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fcfdfa' }}>
            {/* Header section removed - using global Header */}

            <main style={{ padding: '3rem 4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1>Welcome back, {profile?.full_name || user?.email || 'Farmer'}</h1>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {profile?.kyc_status === 'verified' && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)',
                                color: 'var(--success)', borderRadius: 'var(--radius-full)',
                                fontSize: '0.85rem', fontWeight: 700
                            }}>
                                <ShieldCheck size={16} /> KYC Verified
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="card"
                            style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}
                        >
                            <div style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.03)', borderRadius: '12px' }}>{stat.icon}</div>
                            <div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{stat.value}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {completionPercent < 100 && (
                    <div className="card" style={{
                        padding: '1.5rem',
                        marginBottom: '2rem',
                        background: isDark ? 'linear-gradient(135deg, #451a03 0%, #78350f 100%)' : 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
                        border: '1px solid #fed7aa'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '0.75rem', background: '#f97316', borderRadius: '12px', color: 'white' }}>
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', color: isDark ? '#fdba74' : '#9a3412' }}>Complete your profile ({completionPercent}%)</h3>
                                    <p style={{ margin: '0.25rem 0 0', color: isDark ? '#fed7aa' : '#c2410c', fontSize: '0.9rem' }}>
                                        Missing: {missingFields.join(', ')}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.href = '/farmer/register'}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: '#f97316',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 600
                                }}
                            >
                                Complete Profile
                            </button>
                        </div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                    {/* Active Contracts */}
                    <section>
                        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileCheck size={24} color="var(--primary)" /> Active Contracts
                        </h2>
                        {contracts.length === 0 ? (
                            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                                <FileCheck size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                                <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }}>No Active Contracts</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    Start by exploring contract opportunities in the marketplace
                                </p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {contracts.map(contract => {
                                    const statusDisplay = contract.status === 'active' || contract.status === 'in_progress' ? 'In Progress' :
                                        contract.status === 'pending' ? 'Verification' :
                                            contract.status === 'completed' ? 'Completed' : contract.status;
                                    const progress = contract.progress || (contract.status === 'completed' ? 100 : 50);

                                    return (
                                        <motion.div
                                            key={contract.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="card"
                                            style={{ padding: '2rem' }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                                <div>
                                                    <h3 style={{ fontSize: '1.25rem' }}>{contract.business_name || 'Business Contract'}</h3>
                                                    <p style={{ color: 'var(--text-muted)' }}>
                                                        {contract.crop_name} • {contract.quantity} Quintals
                                                    </p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <span style={{
                                                        padding: '0.4rem 1rem',
                                                        borderRadius: 'var(--radius-full)',
                                                        background: statusDisplay === 'In Progress' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                                                        color: statusDisplay === 'In Progress' ? 'var(--success)' : '#B8860B',
                                                        fontSize: '0.8rem',
                                                        fontWeight: 700
                                                    }}>
                                                        {statusDisplay}
                                                    </span>
                                                    <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        Value: ₹{contract.total_value?.toLocaleString() || '0'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                                <span>Growth Progress</span>
                                                <span style={{ fontWeight: 600 }}>{progress}%</span>
                                            </div>
                                            <div style={{ height: '12px', background: 'var(--sand-light)', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${contract.progress || 65}%` }}
                                                    style={{ height: '100%', background: 'var(--gold)', boxShadow: '0 0 10px var(--gold-glow)' }}
                                                />
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    {/* Sidebar */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Market Trends Card */}
                        <div className="card card-farmer" style={{ padding: '2rem', background: 'var(--forest)', color: 'var(--sand)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <TrendingUp className="text-gold" />
                                    <span style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>LOCAL ALERTS</span>
                                </div>
                                <h3 style={{ color: 'var(--white)', marginBottom: '1rem', fontSize: '1.75rem' }}>Wheat Demand Spike</h3>
                                <p style={{ fontSize: '1rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.6 }}>
                                    Verified buyers in your region are offering 12% above MSP for Organic Wheat.
                                </p>
                                <button className="btn btn-primary" style={{ width: '100%' }}>Scan Offers</button>
                            </div>
                            {/* Decorative Pattern overlay */}
                            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.1 }}>
                                <Wheat size={160} />
                            </div>
                        </div>

                        {/* Quality Monitoring Card */}
                        <div className="card card-farmer" style={{ padding: '2rem', background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Microscope className="text-gold" size={24} />
                                    <span style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em', color: 'var(--olive)' }}>FIELD ANALYSIS</span>
                                </div>
                                <ThermometerSun size={20} className="text-risk" />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ background: 'var(--sand-light)', padding: '1.5rem', borderRadius: '16px' }}>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--olive)', marginBottom: '0.5rem' }}>Estimated Yield</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: 400, fontFamily: 'var(--font-heading)' }}>8.5 <span style={{ fontSize: '1rem' }}>qtl/acre</span></div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--olive)', marginBottom: '0.25rem' }}>Moisture</div>
                                        <div style={{ fontWeight: 700 }}>12.4%</div>
                                    </div>
                                    <div style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--olive)', marginBottom: '0.25rem' }}>Health Status</div>
                                        <div style={{ fontWeight: 700, color: 'var(--olive)' }}>OPTIMAL</div>
                                    </div>
                                </div>

                                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.9rem' }}>Full Quality Report</button>
                            </div>
                        </div>

                        {/* Completion Card */}
                        {completionPercent < 100 && (
                            <div className="card card-farmer" style={{
                                padding: '1.5rem',
                                background: 'var(--sand-light)',
                                border: '1px dashed var(--gold)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <AlertCircle size={24} className="text-gold" />
                                    <span style={{ fontWeight: 700, color: 'var(--forest)' }}>Complete Profile ({completionPercent}%)</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--olive)', marginBottom: '1.25rem' }}>
                                    Verified profiles get priority access to lower interest loans.
                                </p>
                                <button onClick={() => navigate('/farmer/register')} className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.85rem' }}>Finalize Vault</button>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default FarmerDashboard;
