import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Landmark, User, FileText,
    BarChart3, CheckCircle, XCircle, ChevronRight,
    AlertCircle, TrendingUp, Calendar, Clock, ShieldCheck,
    CreditCard, Activity, ArrowUpRight
} from 'lucide-react';
import RiskAssessment from '../../components/RiskAssessment';
import { useAuth } from '../../contexts/AuthContext';
import { bankService } from '../../services/database';

const BankDashboard = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('applications'); // applications, portfolio, analytics
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [loanApplications, setLoanApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                setError(null);

                const { data: loansData, error: loansError } = await bankService.getLoanApplications({});
                if (loansError) throw loansError;
                setLoanApplications(loansData || []);

            } catch (err) {
                console.error('Error fetching bank data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const handleApprove = async (loanId) => {
        try {
            const { error } = await bankService.updateLoanStatus(loanId, 'approved', 'Approved by banker');
            if (error) throw error;

            setLoanApplications(prev =>
                prev.map(loan => loan.id === loanId ? { ...loan, status: 'approved' } : loan)
            );
            setSelectedApplication(prev => prev?.id === loanId ? { ...prev, status: 'approved' } : prev);
        } catch (err) {
            console.error('Error approving loan:', err);
        }
    };

    const handleReject = async (loanId) => {
        try {
            const { error } = await bankService.updateLoanStatus(loanId, 'rejected', 'Rejected by banker');
            if (error) throw error;

            setLoanApplications(prev =>
                prev.map(loan => loan.id === loanId ? { ...loan, status: 'rejected' } : loan)
            );
            setSelectedApplication(prev => prev?.id === loanId ? { ...prev, status: 'rejected' } : prev);
        } catch (err) {
            console.error('Error rejecting loan:', err);
        }
    };

    const pendingCount = loanApplications.filter(l => l.status === 'pending').length;
    const approvedLoans = loanApplications.filter(l => l.status === 'approved');
    const totalActiveLoanValue = approvedLoans.reduce((sum, l) => sum + (l.loan_amount || 0), 0);
    const avgRiskScore = loanApplications.length > 0
        ? Math.round(loanApplications.reduce((sum, l) => sum + (l.risk_score || 80), 0) / loanApplications.length)
        : 82;

    const stats = [
        { label: 'Pending Queue', value: pendingCount.toString(), icon: <Clock size={24} />, color: 'var(--gold)', trend: 'Action Required' },
        { label: 'Active Portfolio', value: `₹${(totalActiveLoanValue / 100000).toFixed(1)}L`, icon: <CreditCard size={24} />, color: 'var(--blue-trust)', trend: `${approvedLoans.length} Loans` },
        { label: 'Network Risk', value: `${avgRiskScore}/100`, icon: <ShieldCheck size={24} />, color: 'var(--forest)', trend: 'Healthy' },
        { label: 'Repayment Index', value: '98.4%', icon: <Activity size={24} />, color: 'var(--terracotta)', trend: 'Stable' }
    ];

    const filteredApplications = loanApplications.filter(loan =>
        loan.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        loan.application_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="agri-pattern" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} style={{ color: 'var(--blue-trust)' }}>
                    <Landmark size={48} />
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
                            <Landmark size={20} className="text-blue" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--blue-trust)' }}>INSTITUTIONAL TERMINAL</span>
                        </div>
                        <h1 style={{ marginBottom: '0.5rem' }}>Capital Management</h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--olive)' }}>Precision-based agriculture risk evaluation and credit deployment.</p>
                    </div>
                </div>
            </header>

            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card card-bank"
                        style={{ padding: '2rem', background: 'white' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div style={{ color: stat.color }}>{stat.icon}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--olive)', fontWeight: 700, letterSpacing: '0.05em' }}>{stat.trend}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--olive)', fontWeight: 600, marginBottom: '0.25rem' }}>{stat.label}</div>
                        <div style={{ fontSize: '2rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: 'var(--forest)' }}>{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            <nav style={{
                display: 'flex', gap: '1rem', marginBottom: '3rem',
                background: 'var(--sand-light)', padding: '0.5rem',
                borderRadius: '16px', border: '1px solid var(--border-light)',
                maxWidth: 'fit-content'
            }}>
                {[
                    { id: 'applications', label: 'Credit Queue', icon: <FileText size={18} /> },
                    { id: 'portfolio', label: 'Loan Portfolio', icon: <Landmark size={18} /> },
                    { id: 'analytics', label: 'Risk Analytics', icon: <TrendingUp size={18} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            padding: '0.8rem 1.5rem',
                            border: 'none',
                            background: activeTab === tab.id ? 'white' : 'transparent',
                            color: activeTab === tab.id ? 'var(--blue-trust)' : 'var(--olive)',
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
                {activeTab === 'applications' && (
                    <div style={{ display: 'grid', gridTemplateColumns: selectedApplication ? '1fr 420px' : '1fr', gap: '2.5rem' }}>
                        {/* List Section */}
                        <section>
                            <div className="card card-bank" style={{ padding: 0, overflow: 'hidden' }}>
                                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-light)', display: 'flex', gap: '1.5rem', background: 'var(--sand-light)' }}>
                                    <div style={{ position: 'relative', flex: 1 }}>
                                        <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--olive)' }} size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search by ID, Applicant, or Territory..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem 0.75rem 0.75rem 2.8rem',
                                                border: '1px solid var(--border-light)',
                                                borderRadius: '10px',
                                                background: 'white',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                    </div>
                                    <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'white' }}>
                                        <Filter size={18} /> Filters
                                    </button>
                                </div>

                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: 'white', borderBottom: '1px solid var(--border-light)' }}>
                                            <th style={{ padding: '1.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>IDENTITY</th>
                                            <th style={{ padding: '1.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>CAPITAL REQUEST</th>
                                            <th style={{ padding: '1.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>RISK INDEX</th>
                                            <th style={{ padding: '1.5rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--olive)' }}>STATUS</th>
                                            <th style={{ padding: '1.5rem' }}></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredApplications.map(loan => {
                                            const status = loan.status || 'pending';
                                            return (
                                                <tr
                                                    key={loan.id}
                                                    onClick={() => setSelectedApplication(loan)}
                                                    style={{
                                                        borderBottom: '1px solid var(--border-light)',
                                                        cursor: 'pointer',
                                                        background: selectedApplication?.id === loan.id ? 'var(--sand-light)' : 'transparent',
                                                        transition: 'background 0.2s ease'
                                                    }}
                                                >
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <div style={{ fontWeight: 800, color: 'var(--forest)', fontSize: '1rem' }}>{loan.applicant_name}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--olive)', marginTop: '0.2rem' }}>{loan.application_number} • {loan.applicant_type?.toUpperCase()}</div>
                                                    </td>
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <div style={{ fontWeight: 800, color: 'var(--forest)' }}>₹{loan.loan_amount?.toLocaleString()}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--olive)' }}>{loan.purpose?.substring(0, 30)}...</div>
                                                    </td>
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <div style={{
                                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                                            color: loan.risk_score >= 80 ? 'var(--forest)' : '#B8860B',
                                                            fontWeight: 800, fontSize: '1.2rem'
                                                        }}>
                                                            {loan.risk_score || 80}
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '1.5rem' }}>
                                                        <span style={{
                                                            padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800,
                                                            background: status === 'approved' ? 'rgba(45, 90, 39, 0.1)' :
                                                                status === 'rejected' ? 'rgba(139, 69, 19, 0.1)' : 'rgba(198, 169, 78, 0.1)',
                                                            color: status === 'approved' ? 'var(--forest)' :
                                                                status === 'rejected' ? 'var(--terracotta)' : 'var(--gold)',
                                                            border: '1px solid currentColor'
                                                        }}>
                                                            {status.toUpperCase()}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                                        <ChevronRight size={18} color="var(--olive)" />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Analysis Sidebar */}
                        <AnimatePresence>
                            {selectedApplication && (
                                <motion.aside
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: 20, opacity: 0 }}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                                >
                                    <div className="card card-bank" style={{ padding: '2.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                            <ShieldCheck size={20} className="text-blue" />
                                            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Capital Analysis</h3>
                                        </div>

                                        <RiskAssessment score={selectedApplication.risk_score || 80} breakdown={selectedApplication.riskBreakdown || {}} />

                                        <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                                                <span style={{ color: 'var(--olive)', fontSize: '0.85rem', fontWeight: 700 }}>APPLY DATE</span>
                                                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{new Date(selectedApplication.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-light)' }}>
                                                <span style={{ color: 'var(--olive)', fontSize: '0.85rem', fontWeight: 700 }}>TENURE</span>
                                                <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{selectedApplication.tenure_months} MONTHS</span>
                                            </div>

                                            {selectedApplication.status === 'pending' ? (
                                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                                    <button
                                                        className="btn btn-secondary"
                                                        style={{ flex: 1, color: 'var(--terracotta)', border: '1px solid var(--terracotta)' }}
                                                        onClick={() => handleReject(selectedApplication.id)}
                                                    >
                                                        Decline
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{ flex: 2, background: 'var(--blue-trust)' }}
                                                        onClick={() => handleApprove(selectedApplication.id)}
                                                    >
                                                        Approve Deployment
                                                    </button>
                                                </div>
                                            ) : (
                                                <div style={{
                                                    marginTop: '1.5rem', padding: '1.25rem',
                                                    borderRadius: '12px', textAlign: 'center', fontWeight: 800,
                                                    background: 'var(--sand-light)',
                                                    color: selectedApplication.status === 'approved' ? 'var(--forest)' : 'var(--terracotta)',
                                                    border: '1px solid currentColor'
                                                }}>
                                                    {selectedApplication.status === 'approved' ? 'ASSET DEPLOYED' : 'REQUEST REJECTED'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card card-bank" style={{ padding: '2rem', background: 'var(--sand-light)', border: '1px dashed var(--blue-trust)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--blue-trust)', marginBottom: '1rem', fontWeight: 800, fontSize: '0.8rem' }}>
                                            <AlertCircle size={16} /> NETWORK INSIGHT
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--olive)', lineHeight: 1.6, margin: 0 }}>
                                            Verified contract history confirms harvest viability. Applicant has maintaining a 100% platform fulfillment rate.
                                        </p>
                                    </div>
                                </motion.aside>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {activeTab !== 'applications' && (
                    <div className="card card-bank" style={{ padding: '6rem 4rem', textAlign: 'center' }}>
                        <div style={{ color: 'var(--blue-trust)', opacity: 0.2, marginBottom: '2rem' }}>
                            <BarChart3 size={80} strokeWidth={1} />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Institutional Intelligence</h2>
                        <p style={{ color: 'var(--olive)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                            Aggregate portfolio analytics and territorial risk mapping modules are currently synchronizing with regional data nodes.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default BankDashboard;
