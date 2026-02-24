import React, { useState } from 'react';
<<<<<<< HEAD
import { motion } from 'framer-motion';
import { FileText, Shield, CreditCard, ChevronRight, Check, Loader2, RefreshCw, AlertCircle, X } from 'lucide-react';
=======
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Shield,
    CreditCard,
    ChevronRight,
    Check,
    Loader2,
    RefreshCw,
    AlertCircle,
    ArrowLeft,
    ShieldCheck,
    Stamp,
    Layers,
    Activity,
    Lock
} from 'lucide-react';
>>>>>>> c74a01f (Changes in ui)
import { useTranslation } from '../../contexts/LanguageContext';
import { generateContractLocally } from '../../services/contractEngine';
import ContractDisplay from '../../components/ContractDisplay';
import { useAuth } from '../../contexts/AuthContext';
import { businessService } from '../../services/database';

const ContractFlow = ({ farmer, onComplete, onClose }) => {
    const { user } = useAuth();
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
    
    React.useEffect(() => {
        const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    
    const [step, setStep] = useState('form'); // form, generating, review, sign, pay, done
    const [loading, setLoading] = useState(false);
    const [contractContent, setContractContent] = useState('');
    const [error, setError] = useState(null);
    const [savedContractId, setSavedContractId] = useState(null);
    const { t, language } = useTranslation();

    const [formData, setFormData] = useState({
        farmerName: farmer?.full_name || farmer?.name || 'Farmer',
        farmerId: farmer?.id,
        businessName: 'AgriCorp Ltd.',
        businessGst: '27AABCU9603R1Z',
        cropName: 'Premium Organic Wheat',
        quantity: 50,
        unit: 'Quintals',
        price: 4200,
        deliveryDate: '2025-10-15',
    });

    const [selectedClauses, setSelectedClauses] = useState(['quality', 'forceMajeure']);

    const toggleClause = (clause) => {
        setSelectedClauses(prev =>
            prev.includes(clause)
                ? prev.filter(c => c !== clause)
                : [...prev, clause]
        );
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setStep('generating');

        setTimeout(() => {
            const content = generateContractLocally(formData, language, selectedClauses);
            setContractContent(content);
            setStep('review');
        }, 2000);
    };

    const handleRegenerate = () => {
        setStep('form');
    };

    const handleFinalizeContract = async () => {
        try {
            setLoading(true);
            setError(null);

            const contractNumber = `FC-${Date.now()}`;
            const totalValue = parseFloat(formData.quantity) * parseFloat(formData.price);

            const { data, error: saveError } = await businessService.createContract({
                business_id: user.id,
                farmer_id: formData.farmerId,
                contract_number: contractNumber,
                crop_name: formData.cropName,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                price: parseFloat(formData.price),
                total_value: totalValue,
                delivery_date: formData.deliveryDate,
                status: 'pending',
                contract_content: contractContent,
                selected_clauses: selectedClauses
            });

            if (saveError) throw saveError;

            setSavedContractId(data?.id);
            setStep('done');
        } catch (err) {
            console.error('Error saving contract:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const currentStepIndex = ['form', 'generating', 'review', 'sign', 'pay', 'done'].indexOf(step);

    return (
        <div className="card card-business" style={{
            padding: '3rem',
            maxWidth: '1000px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
<<<<<<< HEAD
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
            position: 'relative'
        }}>
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        color: isDark ? '#fff' : '#333'
                    }}
                >
                    <X size={20} />
                </button>
            )}
            {step === 'form' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                        <div style={{ background: 'var(--primary-light)', p: '10px', borderRadius: '12px' }}>
                            <FileText size={32} color="var(--primary)" />
=======
            background: 'white',
            position: 'relative'
        }}>
            {/* Architectural Progress Indicator */}
            <div style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    {['ARCHITECTURE', 'DRAFTING', 'VERIFICATION', 'SETTLEMENT'].map((s, i) => (
                        <div key={s} style={{
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            letterSpacing: '0.15em',
                            color: currentStepIndex >= i * 1.5 ? 'var(--blue-trust)' : 'var(--olive)',
                            opacity: currentStepIndex >= i * 1.5 ? 1 : 0.4,
                            transition: 'all 0.4s ease'
                        }}>
                            {s}
>>>>>>> c74a01f (Changes in ui)
                        </div>
                    ))}
                </div>
                <div style={{ height: '2px', background: 'var(--sand-light)', position: 'relative' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStepIndex / 5) * 100}%` }}
                        style={{ position: 'absolute', top: 0, left: 0, height: '100%', background: 'var(--blue-trust)' }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 'form' && (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '3rem' }}>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Define <span className="text-gold">Operational</span> Scope</h1>
                                <p style={{ color: 'var(--olive)', fontSize: '1.1rem', fontWeight: 500 }}>Establish legal parameters for the agricultural handshake.</p>
                            </div>
                            <div style={{ padding: '1rem', background: 'var(--sand-light)', borderRadius: '12px' }}>
                                <Layers size={32} className="text-olive" />
                            </div>
                        </div>

                        <form onSubmit={handleFormSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1.5rem' }}>
                            <div style={{ gridColumn: 'span 6' }}>
                                <label className="form-label">FARMER IDENTITY</label>
                                <div style={{
                                    padding: '1.25rem',
                                    background: 'var(--sand-light)',
                                    borderRadius: '10px',
                                    border: '1px solid var(--border-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem'
                                }}>
                                    <div style={{ width: '32px', height: '32px', background: 'var(--gold)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem' }}>
                                        {formData.farmerName.charAt(0)}
                                    </div>
                                    <span style={{ fontWeight: 700, color: 'var(--blue-trust)' }}>{formData.farmerName}</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--olive)', opacity: 0.6, marginLeft: 'auto' }}>VERIFIED NODE</span>
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 3' }}>
                                <label className="form-label">CROP SPECIFICATION</label>
                                <input
                                    type="text"
                                    value={formData.cropName}
                                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div style={{ gridColumn: 'span 3' }}>
                                <label className="form-label">EXPECTED DELIVERY</label>
                                <input
                                    type="date"
                                    value={formData.deliveryDate}
                                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">QUANTITY</label>
                                <input
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">UNIT</label>
                                <select
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    className="form-select"
                                >
                                    <option>Quintals</option>
                                    <option>Kilograms</option>
                                    <option>Tons</option>
                                </select>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label className="form-label">UNIT PRICE (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="form-input"
                                    required
                                />
                            </div>

                            <div style={{ gridColumn: 'span 6', marginTop: '2rem' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--blue-trust)', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>INSTITUTIONAL PROVISIONS</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                    {[
                                        { id: 'quality', label: 'Quality Standards', desc: '7-day inspection protocol' },
                                        { id: 'forceMajeure', label: 'Force Majeure', desc: 'Natural disruption coverage' },
                                        { id: 'organicCert', label: 'Organic Warranty', desc: 'Eco-certification mandate' },
                                        { id: 'insurance', label: 'Yield Insurance', desc: 'Risk mitigation protocol' }
                                    ].map(clause => (
                                        <div
                                            key={clause.id}
                                            onClick={() => toggleClause(clause.id)}
                                            style={{
                                                padding: '1.5rem',
                                                borderRadius: '12px',
                                                border: `1px solid ${selectedClauses.includes(clause.id) ? 'var(--blue-trust)' : 'var(--border-light)'}`,
                                                background: selectedClauses.includes(clause.id) ? 'var(--sand-light)' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '1rem'
                                            }}
                                        >
                                            <div style={{
                                                width: '24px', height: '24px',
                                                borderRadius: '6px',
                                                border: '2px solid var(--blue-trust)',
                                                background: selectedClauses.includes(clause.id) ? 'var(--blue-trust)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                                            }}>
                                                {selectedClauses.includes(clause.id) && <Check size={16} strokeWidth={3} />}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--blue-trust)' }}>{clause.label}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--olive)', fontWeight: 600, opacity: 0.6 }}>{clause.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 6', background: 'var(--blue-trust)', padding: '2rem', borderRadius: '16px', color: 'var(--sand)', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', opacity: 0.7, marginBottom: '0.5rem' }}>TOTAL SETTLEMENT VALUE</div>
                                    <div style={{ fontSize: '2rem', fontWeight: 400, fontFamily: 'var(--font-heading)' }}>₹{(formData.quantity * formData.price).toLocaleString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', opacity: 0.7, marginBottom: '0.5rem' }}>ADVANCE LIQUIDITY (25%)</div>
                                    <div style={{ fontSize: '1.5rem', color: 'var(--gold)' }}>₹{(formData.quantity * formData.price * 0.25).toLocaleString()}</div>
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 6', marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', fontWeight: 800 }}>
                                    INITIALIZE LEGAL SYNTHESIS <ChevronRight size={20} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {step === 'generating' && (
                    <motion.div
                        key="generating"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '6rem 2rem' }}
                    >
                        <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 3rem' }}>
                            <motion.div
                                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                style={{ position: 'absolute', inset: 0, border: '2px dashed var(--gold)', borderRadius: '50%' }}
                            />
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <RefreshCw size={40} className="text-blue-trust animate-spin" />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Synthesizing Agreement</h2>
                        <p style={{ color: 'var(--olive)', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto', fontWeight: 500 }}>
                            Constructing an institutional-grade legal protocol between <span className="text-gold">AgriCorp</span> and <span className="text-gold">{formData.farmerName}</span>.
                        </p>
                    </motion.div>
                )}

                {step === 'review' && (
                    <motion.div
                        key="review"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Review <span className="text-gold">Synthesized</span> Document</h2>
                                <p style={{ color: 'var(--olive)', fontSize: '1.1rem', fontWeight: 500 }}>Tailored legal parameters for this node connection.</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'var(--sand-light)', padding: '0.75rem 1.25rem', borderRadius: '30px', border: '1px solid var(--border-light)' }}>
                                <ShieldCheck size={18} className="text-olive" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--olive)', letterSpacing: '0.1em' }}>VERIFIED TEMPLATE</span>
                            </div>
                        </div>

                        <div className="card-business" style={{ background: 'var(--sand-light)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                            <ContractDisplay
                                content={contractContent}
                                onEdit={handleRegenerate}
                                onSign={() => setStep('sign')}
                            />
                        </div>
                    </motion.div>
                )}

                {step === 'sign' && (
                    <motion.div
                        key="sign"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '4rem 0' }}
                    >
                        <div style={{ width: '80px', height: '80px', background: 'var(--sand-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', border: '1px solid var(--border-light)' }}>
                            <Lock size={32} className="text-blue-trust" />
                        </div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>E-Sign Verification</h2>
                        <p style={{ color: 'var(--olive)', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 3rem', fontWeight: 500 }}>
                            Send institutional Aadhaar-linked OTP for secure identity verification.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '3rem' }}>
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <input key={i} type="text" maxLength="1" style={{
                                    width: '60px', height: '70px',
                                    textAlign: 'center', fontSize: '2rem', fontWeight: 400, fontFamily: 'var(--font-heading)',
                                    border: '1px solid var(--border-main)', borderRadius: '12px', background: 'var(--sand-light)'
                                }} />
                            ))}
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', fontWeight: 800 }} onClick={() => setStep('pay')}>
                            VERIFY & DEPLOY SIGNATURE
                        </button>
                        <button className="btn-secondary" onClick={() => setStep('review')} style={{ marginTop: '1.5rem', background: 'none', border: 'none', color: 'var(--olive)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em', cursor: 'pointer' }}>
                            ABORT - RETURN TO REVIEW
                        </button>
                    </motion.div>
                )}

                {step === 'pay' && (
                    <motion.div
                        key="pay"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                            <div style={{ width: '80px', height: '80px', background: 'var(--sand-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem' }}>
                                <CreditCard size={32} className="text-blue-trust" />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Liquidity Provision</h2>
                            <p style={{ color: 'var(--olive)', fontSize: '1.2rem', fontWeight: 500 }}>Establishing resource flow for production cycles.</p>
                        </div>

                        <div style={{ background: 'var(--sand-light)', borderRadius: '20px', padding: '2.5rem', border: '1px solid var(--border-light)', marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ color: 'var(--olive)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em' }}>FARMER ADVANCE</span>
                                <span style={{ fontWeight: 800, color: 'var(--blue-trust)' }}>₹{(formData.quantity * formData.price * 0.25).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-light)' }}>
                                <span style={{ color: 'var(--olive)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.1em' }}>PLATFORM FEE (2%)</span>
                                <span style={{ fontWeight: 800, color: 'var(--olive)' }}>₹{(formData.quantity * formData.price * 0.25 * 0.02).toLocaleString()}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--blue-trust)', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.1em' }}>AGGREGATE PAYABLE</span>
                                <span style={{ fontSize: '2rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: 'var(--blue-trust)' }}>₹{(formData.quantity * formData.price * 0.25 * 1.02).toLocaleString()}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
                            <button className="form-input" style={{ background: 'white', fontWeight: 800, fontSize: '0.8rem' }}>CORPORATE NET BANKING</button>
                            <button className="form-input" style={{ background: 'white', fontWeight: 800, fontSize: '0.8rem' }}>INSTITUTIONAL UPI</button>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', fontWeight: 800 }} onClick={handleFinalizeContract} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" style={{ marginRight: '0.75rem' }} />
                                    COMMITTING PROTOCOL...
                                </>
                            ) : (
                                'AUTHORIZE SETTLEMENT'
                            )}
                        </button>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                style={{
                                    marginTop: '2rem', padding: '1.25rem',
                                    background: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px',
                                    display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--terracotta)', fontWeight: 600
                                }}
                            >
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {step === 'done' && (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        style={{ textAlign: 'center', padding: '4rem 0' }}
                    >
                        <div style={{
                            width: '120px', height: '120px',
                            background: 'var(--blue-trust)', color: 'var(--sand)',
                            borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 3rem', boxShadow: 'var(--shadow-main)'
                        }}>
                            <ShieldCheck size={60} strokeWidth={1.5} />
                        </div>
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>Protocol Finalized.</h2>

                        {savedContractId && (
                            <div style={{
                                background: 'var(--sand-light)',
                                padding: '1.5rem 2.5rem',
                                borderRadius: '16px',
                                marginBottom: '2.5rem',
                                display: 'inline-block',
                                border: '1px solid var(--border-light)'
                            }}>
                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--olive)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>INSTITUTIONAL ID</div>
                                <div style={{ fontWeight: 800, color: 'var(--blue-trust)', fontSize: '1.2rem', letterSpacing: '0.05em' }}>
                                    {savedContractId}
                                </div>
                            </div>
                        )}

                        <p style={{ color: 'var(--olive)', fontSize: '1.2rem', maxWidth: '500px', margin: '0 auto 4rem', fontWeight: 500, lineHeight: 1.6 }}>
                            The legal protocol is now active across <span className="text-blue-trust">Agriance Network Nodes</span>. {formData.farmerName} has been synchronized.
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                            <button className="btn btn-primary" style={{ flex: 1, padding: '1.25rem' }} onClick={onComplete}>SYNC WITH DASHBOARD</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ContractFlow;
