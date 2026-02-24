import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, MapPin, Star, Filter,
    ArrowRight, CheckCircle, Globe, Banknote,
    ShieldCheck, ChevronDown, Landmark, Briefcase, Microscope, ThermometerSun, AlertCircle, User,
    X, LayoutDashboard, Database, Activity
} from 'lucide-react';
import ContractFlow from './ContractFlow';
import LoanApplicationFlow from '../../components/LoanApplicationFlow';
import { cropCategories } from '../../data/crops';
import { useAuth } from '../../contexts/AuthContext';
import { businessService } from '../../services/database';

const BusinessDashboard = () => {
    const { t, setLanguage, language } = useTranslation();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [showContract, setShowContract] = useState(false);
    const [showLoanFlow, setShowLoanFlow] = useState(false);
    const [activeTab, setActiveTab] = useState('marketplace'); // marketplace, financing, quality

    const [farmers, setFarmers] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                if (typeof businessService?.searchFarmers === 'function') {
                    const { data: farmersData, error: farmersError } = await businessService.searchFarmers('');
                    if (!farmersError) setFarmers(farmersData || []);
                }

                if (typeof businessService?.getBusinessContracts === 'function') {
                    const { data: contractsData, error: contractsError } = await businessService.getBusinessContracts(user.id);
                    if (!contractsError) setContracts(contractsData || []);
                }

                if (typeof businessService?.getBusinessProfile === 'function') {
                    const { data: profileData, error: profileError } = await businessService.getBusinessProfile(user.id);
                    if (!profileError) setProfile(profileData);
                }

            } catch (err) {
                console.error('Error fetching business data:', err);
                setError(err.message || 'Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const activeContractsCount = contracts.filter(c => c.status === 'active' || c.status === 'in_progress').length;
    const totalContractValue = contracts.reduce((sum, c) => sum + (c.total_value || 0), 0);
    const trustScore = profile?.trust_score || 84;

    const qualityBatches = [
        { id: 'BAT-001', farmer: 'Ramesh Patil', crop: 'Organic Wheat', status: 'Optimal', moisture: '12.4%', purity: '99.2%', health: 'Excellent', lastUpdate: '2h ago' },
        { id: 'BAT-002', farmer: 'Suresh Jadhav', crop: 'Rice', status: 'Monitoring', moisture: '14.1%', purity: '98.5%', health: 'Good', lastUpdate: '5h ago' },
        { id: 'BAT-003', farmer: 'Arjun More', crop: 'Soybean', status: 'Certified', moisture: '11.8%', purity: '99.8%', health: 'Standard', lastUpdate: '1d ago' },
    ];

    if (loading) {
        return (
            <div className="agri-pattern" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{ color: 'var(--olive)' }}
                >
                    <Briefcase size={48} />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="canvas">
            <header style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <LayoutDashboard size={20} className="text-olive" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--olive)' }}>PROCUREMENT OPS</span>
                        </div>
                        <h1 style={{ marginBottom: '0.5rem' }}>{profile?.business_name || 'Agri-Business'} Dashboard</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--olive)' }}>Institutional grade monitoring and procurement.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{
                            padding: '0.75rem 1.25rem', background: 'white',
                            border: '1px solid var(--border-light)', borderRadius: 'var(--radius-business)',
                            display: 'flex', alignItems: 'center', gap: '1rem'
                        }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--olive)', fontWeight: 700 }}>TRUST SCORE</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--forest)' }}>{trustScore}</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav style={{
                display: 'flex', gap: '1rem', marginBottom: '3rem',
                background: 'var(--sand-light)', padding: '0.5rem',
                borderRadius: '16px', border: '1px solid var(--border-light)',
                maxWidth: 'fit-content'
            }}>
                {[
                    { id: 'marketplace', label: 'Farmer Marketplace', icon: <Briefcase size={18} /> },
                    { id: 'financing', label: 'Strategic Financing', icon: <Landmark size={18} /> },
                    { id: 'quality', label: 'Ecosystem Quality', icon: <Activity size={18} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.8rem 1.5rem',
                            border: 'none',
                            background: activeTab === tab.id ? 'white' : 'transparent',
                            color: activeTab === tab.id ? 'var(--forest)' : 'var(--olive)',
                            fontWeight: 700,
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </nav>

            <main>
                {activeTab === 'marketplace' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '3rem' }}>
                            {/* Filtering Sidebar */}
                            <aside>
                                <div className="card card-business" style={{ padding: '2rem', sticky: 'top', top: '2rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                        <Filter size={18} className="text-olive" />
                                        <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Strategy Filters</h3>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>COMMODITY</label>
                                            <select className="input" style={{ width: '100%', padding: '0.8rem' }}>
                                                <option>All Commodities</option>
                                                {cropCategories.map(cat => <option key={cat.name}>{cat.name}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>SOCIETAL LAND SIZE</label>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                <button style={{ padding: '0.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }}>&lt; 5 Acres</button>
                                                <button style={{ padding: '0.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '0.8rem' }}>5-20 Acres</button>
                                            </div>
                                        </div>

                                        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ marginTop: '1rem', width: '100%' }}>
                                            <Plus size={18} /> New Request
                                        </button>
                                    </div>
                                </div>
                            </aside>

                            {/* Farmer List */}
                            <section>
                                <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
                                    <Search style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--olive)' }} size={20} />
                                    <input
                                        type="text"
                                        placeholder="Intelligence Search: Name, Location, or Specific Crop Capability..."
                                        style={{
                                            width: '100%',
                                            padding: '1.25rem 1.25rem 1.25rem 3.5rem',
                                            borderRadius: 'var(--radius-business)',
                                            border: '1px solid var(--border-light)',
                                            background: 'white',
                                            fontSize: '1.1rem',
                                            boxShadow: 'var(--shadow-sm)'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {farmers.map(farmer => (
                                        <motion.div
                                            key={farmer.id}
                                            whileHover={{ y: -4 }}
                                            className="card card-business"
                                            style={{ display: 'grid', gridTemplateColumns: '80px 1fr 200px', alignItems: 'center', gap: '2.5rem', padding: '2.5rem' }}
                                        >
                                            <div style={{
                                                width: '80px', height: '80px', borderRadius: '16px',
                                                background: 'var(--sand-light)', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                fontSize: '2rem'
                                            }}>👨‍🌾</div>

                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{farmer.full_name || 'Enterprise Farmer'}</h3>
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                                                        background: 'var(--sand-light)', padding: '0.25rem 0.6rem',
                                                        borderRadius: '8px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--forest)'
                                                    }}>
                                                        <Star size={14} fill="var(--forest)" /> {farmer.rating || '4.8'}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', gap: '2rem', color: 'var(--olive)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <MapPin size={16} /> {farmer.location}
                                                    </span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                        <Database size={16} /> {farmer.land_size || '12.5'} Acres
                                                    </span>
                                                </div>

                                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                                    {(farmer.crop_history || ['Wheat', 'Organic Soy']).map((crop, idx) => (
                                                        <span key={idx} style={{
                                                            padding: '0.4rem 0.8rem', background: 'var(--sand-light)',
                                                            borderRadius: '8px', fontSize: '0.8rem', color: 'var(--olive)',
                                                            fontWeight: 700, border: '1px solid var(--border-light)'
                                                        }}>{crop}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                <button className="btn btn-primary" onClick={() => { setSelectedFarmer(farmer); setShowContract(true); }}>
                                                    Establish Contract
                                                </button>
                                                <button className="btn btn-secondary">Audit Profile</button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'financing' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                            <div style={{ color: 'var(--blue-trust)', marginBottom: '2rem' }}>
                                <Landmark size={64} strokeWidth={1.5} />
                            </div>
                            <h2 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Strategic Liquidity</h2>
                            <p style={{ fontSize: '1.25rem', color: 'var(--olive)', maxWidth: '700px', margin: '0 auto' }}>Leverage your procurement portfolio to unlock institutional grade working capital.</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', marginBottom: '4rem' }}>
                            <div className="card card-business" style={{ padding: '3rem', borderTop: '4px solid var(--blue-trust)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                    <ShieldCheck className="text-olive" />
                                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Entity Analysis</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {[
                                        { label: 'Network Reliability', value: '96.2%', status: 'optimal' },
                                        { label: 'KYC Verification', value: 'Complete', status: 'verified' },
                                        { label: 'Payment Velocity', value: 'A+', status: 'prime' }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                                            <span style={{ color: 'var(--olive)', fontWeight: 600 }}>{item.label}</span>
                                            <span style={{ fontWeight: 800, color: 'var(--forest)' }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card card-business" style={{ padding: '3rem', borderTop: '4px solid var(--gold)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                    <Banknote className="text-olive" />
                                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>Collateralized Asset Value</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {[
                                        { label: 'Active Open Contracts', value: activeContractsCount },
                                        { label: 'Total Portfolio Value', value: `₹${(totalContractValue / 100000).toFixed(1)}L` },
                                        { label: 'Strategic Credit Limit', value: `₹${(totalContractValue * 0.4 / 100000).toFixed(1)}L`, featured: true }
                                    ].map((item, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
                                            <span style={{ color: 'var(--olive)', fontWeight: 600 }}>{item.label}</span>
                                            <span style={{ fontWeight: 800, color: item.featured ? 'var(--gold)' : 'var(--forest)', fontSize: item.featured ? '1.25rem' : '1rem' }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="card card-business" style={{ padding: '4rem', textAlign: 'center', background: 'var(--sand-light)', border: '1px dashed var(--blue-trust)' }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Capitalize on Network Velocity</h3>
                            <p style={{ color: 'var(--olive)', marginBottom: '3rem', fontSize: '1.1rem' }}>Our institutional partners approve lines of credit based on your platform contract history.</p>
                            <button className="btn btn-primary" style={{ padding: '1.25rem 4rem', fontSize: '1.1rem' }} onClick={() => setShowLoanFlow(true)}>
                                Initialize Line of Credit
                            </button>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'quality' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '3rem' }}>
                            <div className="card card-business" style={{ padding: 0, overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'var(--sand-light)', borderBottom: '1px solid var(--border-light)' }}>
                                            <th style={{ padding: '1.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>SERIAL ID</th>
                                            <th style={{ padding: '1.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>ENTITY / COMMODITY</th>
                                            <th style={{ padding: '1.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>INTELLIGENCE STATUS</th>
                                            <th style={{ padding: '1.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>PARAMETERS</th>
                                            <th style={{ padding: '1.5rem' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {qualityBatches.map(batch => (
                                            <tr key={batch.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                                                <td style={{ padding: '1.5rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--forest)' }}>{batch.id}</td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <div style={{ fontWeight: 800, color: 'var(--forest)' }}>{batch.farmer}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--olive)' }}>{batch.crop}</div>
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <span style={{
                                                        padding: '0.4rem 0.8rem',
                                                        borderRadius: '8px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 800,
                                                        background: 'var(--sand-light)',
                                                        color: batch.status === 'Optimal' ? 'var(--forest)' : '#B8860B',
                                                        border: '1px solid var(--border-light)'
                                                    }}>
                                                        {batch.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.5rem' }}>
                                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                                                        <div><span style={{ color: 'var(--olive)', fontWeight: 600 }}>MST:</span> {batch.moisture}</div>
                                                        <div><span style={{ color: 'var(--olive)', fontWeight: 600 }}>PRY:</span> {batch.purity}</div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                                    <button style={{
                                                        background: 'none', border: 'none', color: 'var(--olive)',
                                                        fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                                                        display: 'flex', alignItems: 'center', gap: '0.4rem'
                                                    }}>
                                                        REPORT <ArrowRight size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div className="card card-business" style={{ padding: '2.5rem', background: 'var(--forest)', color: 'white' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                        <TrendingUp className="text-gold" />
                                        <span style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>PORTFOLIO YIELD</span>
                                    </div>
                                    <div style={{ fontSize: '3rem', fontWeight: 400, fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>45.2 <span style={{ fontSize: '1.25rem' }}>TONS</span></div>
                                    <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Projected aggregate yield across active procurement portfolio.</p>
                                </div>

                                <div className="card card-business" style={{ padding: '2.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--olive)' }}>
                                        <Microscope size={20} />
                                        <span style={{ fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.1em' }}>SENSOR NETWORK</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                        <div style={{ width: '8px', height: '8px', background: 'var(--forest)', borderRadius: '50%' }}></div>
                                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>All streams operational</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--olive)' }}>Satellite telemetry synced 42 minutes ago from regional nodes.</p>
                                </div>
                            </aside>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* Modals */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(28, 48, 25, 0.4)', backdropFilter: 'blur(12px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem'
                    }}>
                        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="card card-business" style={{ maxWidth: '600px', width: '100%', padding: '4rem', background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }}>
                                <div>
                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Post Procurement</h2>
                                    <p style={{ color: 'var(--olive)' }}>Specify commodity requirements for recruitment.</p>
                                </div>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--olive)', cursor: 'pointer' }}><X /></button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>COMMODITY CATEGORY</label>
                                    <select className="input" style={{ width: '100%', padding: '1rem' }}>
                                        {cropCategories.map(cat => (
                                            <optgroup key={cat.name} label={cat.name}>
                                                {cat.crops.map(crop => <option key={crop} value={crop}>{crop}</option>)}
                                            </optgroup>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>QUANTITY (QTL)</label>
                                        <input type="number" className="input" placeholder="e.g. 500" style={{ width: '100%', padding: '1rem' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>TARGET UNIT PRICE (₹)</label>
                                        <input type="number" className="input" placeholder="e.g. 2100" style={{ width: '100%', padding: '1rem' }} />
                                    </div>
                                </div>

                                <button className="btn btn-primary" style={{ padding: '1.25rem', marginTop: '1rem' }} onClick={() => setShowModal(false)}>Publish Requirement</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Other Flow Modals */}
            <AnimatePresence>
                {showLoanFlow && (
                    <LoanApplicationFlow onClose={() => setShowLoanFlow(false)} onComplete={() => setShowLoanFlow(false)} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showContract && selectedFarmer && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(28, 48, 25, 0.6)', backdropFilter: 'blur(16px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '2rem'
                    }}>
                        <ContractFlow farmer={selectedFarmer} onClose={() => { setShowContract(false); setSelectedFarmer(null); }} onComplete={() => { setShowContract(false); setSelectedFarmer(null); }} />
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BusinessDashboard;
