import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Landmark,
    CreditCard,
    PieChart,
    FileCheck,
    ChevronRight,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    ShieldCheck,
    Lock,
    Scale,
    Activity,
    X
} from 'lucide-react';
import { partnerBanks } from '../data/loans';
import FileUpload from './FileUpload';
import { BankLMSService } from '../services/bankLMS';
import { useAuth } from '../contexts/AuthContext';
import { farmerService, businessService } from '../services/database';

const LoanApplicationFlow = ({ onClose, onComplete }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: Bank selection, 2: Details, 3: Documents, 4: Review
    const [selectedBank, setSelectedBank] = useState(null);
    const [amount, setAmount] = useState('');
    const [tenure, setTenure] = useState('12');
    const [purpose, setPurpose] = useState('');
    const [bankStatement, setBankStatement] = useState(null);
    const [landRecord, setLandRecord] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [decision, setDecision] = useState(null);
    const [error, setError] = useState(null);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);
    const goToStep = (s) => {
        if (s < step) setStep(s);
    };

    const handleSubmit = async () => {
        try {
            setIsProcessing(true);
            setError(null);

            const applicationNumber = `APL-${Date.now()}`;
            const applicationData = {
                landArea: 5,
                cropValue: 1,
                contractValue: 200000,
                duration: 6,
                kycVerified: true
            };

            const riskScore = BankLMSService.calculateRiskScore(applicationData);

            const loanData = {
                farmer_id: user.id,
                application_number: applicationNumber,
                loan_amount: parseFloat(amount),
                tenure_months: parseInt(tenure),
                purpose: purpose || 'Agricultural financing',
                bank_name: selectedBank?.name,
                status: 'pending',
                risk_score: riskScore,
                applicant_type: 'farmer'
            };

            let saveResult;
            try {
                saveResult = await farmerService.createLoanApplication(loanData);
            } catch (err) {
                saveResult = await businessService.createLoanApplication(loanData);
            }

            if (saveResult.error) throw saveResult.error;

            const payload = BankLMSService.createLoanPayload(
                { id: user.id, name: user.email, kycStatus: 'verified' },
                { id: 'C-505', totalValue: 200000, cropName: 'Wheat' },
                amount,
                tenure
            );

            const result = await BankLMSService.submitLoanApplication(payload, riskScore);
            setDecision(result);
        } catch (err) {
            console.error('Error submitting loan application:', err);
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const steps = [
        { id: 1, label: 'INSTITUTION' },
        { id: 2, label: 'CAPITAL' },
        { id: 3, label: 'EVIDENCE' },
        { id: 4, label: 'EXECUTION' }
    ];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(14, 46, 33, 0.4)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '2rem'
        }}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                style={{
                    maxWidth: '850px',
                    width: '100%',
                    background: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 40px 100px rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
            >
                {/* Institutional Header */}
                <div style={{ padding: '2rem 3rem', background: 'var(--blue-trust)', color: 'var(--sand)', position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.2em', opacity: 0.7, marginBottom: '0.5rem' }}>FINANCIAL PROTOCOL</div>
                            <h2 style={{ margin: 0, fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Apply for <span className="text-gold">Credit Liquidity</span></h2>
                        </div>
                        <button
                            onClick={onClose}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                border: 'none',
                                color: 'white',
                                width: '40px', height: '40px',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(215, 87, 87, 0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Refined Stepper */}
                <div style={{ display: 'flex', background: 'var(--sand-light)', padding: '0 3rem' }}>
                    {steps.map((s, i) => (
                        <div
                            key={s.id}
                            onClick={() => goToStep(s.id)}
                            style={{
                                flex: 1,
                                padding: '1.5rem 0',
                                textAlign: 'center',
                                borderBottom: step === s.id ? '2px solid var(--blue-trust)' : '2px solid transparent',
                                opacity: step === s.id ? 1 : 0.4,
                                color: step === s.id ? 'var(--blue-trust)' : 'var(--olive)',
                                fontWeight: 800,
                                fontSize: '0.65rem',
                                letterSpacing: '0.2em',
                                cursor: s.id < step ? 'pointer' : 'default',
                                transition: 'all 0.4s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem'
                            }}
                        >
                            <div style={{
                                width: '20px', height: '20px',
                                borderRadius: '50%',
                                border: `1px solid ${step >= s.id ? 'var(--blue-trust)' : 'var(--olive)'}`,
                                background: step > s.id ? 'var(--blue-trust)' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.6rem', color: step > s.id ? 'white' : 'inherit'
                            }}>
                                {s.id < step ? '✓' : s.id}
                            </div>
                            {s.label}
                        </div>
                    ))}
                </div>

                <div style={{ padding: '3.5rem', overflowY: 'auto', flex: 1 }} className="agri-pattern-light">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Select <span className="text-gold">Partner</span> Institution</h3>
                                    <p style={{ color: 'var(--olive)', fontWeight: 500 }}>Choose a banking node from our verified credit ecosystem.</p>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                                    {partnerBanks.map(bank => (
                                        <motion.div
                                            whileHover={{ scale: 1.01, x: 5 }}
                                            key={bank.id}
                                            onClick={() => setSelectedBank(bank)}
                                            style={{
                                                padding: '1.5rem 2rem',
                                                border: `1px solid ${selectedBank?.id === bank.id ? 'var(--blue-trust)' : 'var(--border-light)'}`,
                                                borderRadius: '16px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '2rem',
                                                transition: 'all 0.3s ease',
                                                background: selectedBank?.id === bank.id ? 'rgba(14, 46, 33, 0.03)' : 'white',
                                                boxShadow: selectedBank?.id === bank.id ? '0 10px 30px rgba(14, 46, 33, 0.05)' : 'none'
                                            }}
                                        >
                                            <div style={{ fontSize: '2.5rem', filter: selectedBank?.id === bank.id ? 'none' : 'grayscale(1)' }}>{bank.icon}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--blue-trust)' }}>{bank.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--olive)', fontWeight: 600, opacity: 0.7 }}>Starting {bank.minInterest} • Term up to {bank.maxTenure}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.1em' }}>PRECISION RATING</div>
                                                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--blue-trust)' }}>★ {bank.rating}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginTop: '3rem', padding: '1.25rem', fontSize: '1rem', fontWeight: 800 }}
                                    disabled={!selectedBank}
                                    onClick={handleNext}
                                >
                                    PROCEED TO TERMS <ChevronRight size={18} />
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Configure <span className="text-gold">Loan</span> Parameters</h3>
                                    <p style={{ color: 'var(--olive)', fontWeight: 500 }}>Specify your capital requirements and repayment frequency.</p>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label">REQUESTED CAPITAL (₹)</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter numeric value"
                                            className="form-input"
                                            style={{ fontSize: '1.25rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">REPAYMENT TENURE</label>
                                        <select
                                            value={tenure}
                                            onChange={(e) => setTenure(e.target.value)}
                                            className="form-select"
                                        >
                                            <option value="6">6 Months (Tactical)</option>
                                            <option value="12">12 Months (Standard)</option>
                                            <option value="24">24 Months (Developmental)</option>
                                            <option value="36">36 Months (Long-term)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label">FACILITY PURPOSE</label>
                                        <select
                                            className="form-select"
                                            value={purpose}
                                            onChange={(e) => setPurpose(e.target.value)}
                                        >
                                            <option value="">Select utilization...</option>
                                            <option value="Input Procurement">Input Procurement</option>
                                            <option value="Equipment Leasing">Equipment Leasing</option>
                                            <option value="Infrastructure Growth">Infrastructure Growth</option>
                                            <option value="Operational Liquidity">Operational Liquidity</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4rem' }}>
                                    <button className="btn-secondary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-light)', fontWeight: 800, cursor: 'pointer' }} onClick={handleBack}><ArrowLeft size={18} /> BACK</button>
                                    <button className="btn btn-primary" style={{ flex: 2, padding: '1.25rem', fontSize: '1rem', fontWeight: 800 }} onClick={handleNext} disabled={!amount}>UPLOAD EVIDENCE <ChevronRight size={18} /></button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                            >
                                <div style={{ marginBottom: '2.5rem' }}>
                                    <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Support <span className="text-gold">Evidence</span></h3>
                                    <p style={{ color: 'var(--olive)', fontWeight: 500 }}>Strengthen your application with institutional documentation.</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                    <FileUpload
                                        label="BANK STATEMENT (LAST 3 MONTHS)"
                                        value={bankStatement}
                                        onFileSelect={setBankStatement}
                                        accept=".pdf,.jpg,.png"
                                    />
                                    <FileUpload
                                        label="LAND RECORD / TITLE (OPTIONAL)"
                                        value={landRecord}
                                        onFileSelect={setLandRecord}
                                        accept=".pdf,.jpg,.png"
                                    />

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1.5rem', background: 'var(--sand-light)', borderRadius: '16px', border: '1px solid var(--border-light)' }}>
                                        <div style={{ padding: '0.75rem', background: 'white', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                                            <ShieldCheck color="var(--blue-trust)" size={24} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--blue-trust)', letterSpacing: '0.05em' }}>AUTOMATIC DATA SYNC</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--olive)', fontWeight: 600, opacity: 0.7 }}>Verified KYC & Active Proof-of-Crop are already linked.</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '4rem' }}>
                                    <button className="btn-secondary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-light)', fontWeight: 800, cursor: 'pointer' }} onClick={handleBack}><ArrowLeft size={18} /> BACK</button>
                                    <button className="btn btn-primary" style={{ flex: 2, padding: '1.25rem', fontSize: '1rem', fontWeight: 800 }} onClick={handleNext}>REVIEW AUDIT <ChevronRight size={18} /></button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            >
                                {decision ? (
                                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                        <motion.div
                                            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                                            style={{
                                                width: '100px', height: '100px',
                                                background: decision.decision === 'APPROVED' ? 'var(--blue-trust)' : 'var(--terracotta)',
                                                color: 'white',
                                                borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                margin: '0 auto 2.5rem',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            {decision.decision === 'APPROVED' ? <CheckCircle2 size={48} strokeWidth={1.5} /> : <AlertCircle size={48} strokeWidth={1.5} />}
                                        </motion.div>
                                        <h3 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                                            Application {decision.decision}
                                        </h3>
                                        <p style={{ color: 'var(--olive)', fontSize: '1.2rem', marginBottom: '3rem', fontWeight: 500 }}>
                                            NODE REF: <span style={{ fontWeight: 800, letterSpacing: '0.05em' }}>{decision.bankReference}</span>
                                        </p>

                                        {decision.decision === 'APPROVED' ? (
                                            <div style={{ background: 'var(--sand-light)', padding: '2.5rem', borderRadius: '24px', textAlign: 'left', marginBottom: '3rem', border: '1px solid var(--border-light)' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                                    <div>
                                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--olive)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>INTEREST RATE</div>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--blue-trust)' }}>{decision.financialTerms.interestRate} <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>p.a.</span></div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--olive)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>PROCESSING</div>
                                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--blue-trust)' }}>{decision.financialTerms.processingFee}</div>
                                                    </div>
                                                    <div style={{ gridColumn: 'span 2' }}>
                                                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--olive)', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>ESTIMATED DISBURSAL</div>
                                                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--blue-trust)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                            <Activity size={20} className="text-gold" /> {decision.financialTerms.disbursalTime}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ padding: '2rem', background: 'rgba(215, 87, 87, 0.05)', borderRadius: '16px', color: 'var(--terracotta)', fontWeight: 600, marginBottom: '3rem' }}>
                                                {decision.financialTerms.reason}
                                            </div>
                                        )}

                                        <button
                                            className="btn btn-primary"
                                            style={{ width: '100%', padding: '1.25rem', fontSize: '1rem', fontWeight: 800 }}
                                            onClick={onClose}
                                        >
                                            SYNC DASHBOARD
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: '2.5rem' }}>
                                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Final <span className="text-gold">Verification</span> Audit</h3>
                                            <p style={{ color: 'var(--olive)', fontWeight: 500 }}>Confirm parameters before submitting to corporate ledger.</p>
                                        </div>

                                        <div style={{ background: 'var(--blue-trust)', borderRadius: '24px', padding: '3rem', color: 'var(--sand)', marginBottom: '3rem', position: 'relative', overflow: 'hidden' }}>
                                            <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05 }}>
                                                <Scale size={200} />
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', position: 'relative', zIndex: 1 }}>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>BENEFICIARY NODE</div>
                                                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{selectedBank?.name}</div>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>SCHEDULED TENURE</div>
                                                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{tenure} MONTHS</div>
                                                </div>
                                                <div style={{ gridColumn: 'span 2', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6, letterSpacing: '0.2em', marginBottom: '0.5rem' }}>TOTAL PRINCIPAL LIQUIDITY</div>
                                                    <div style={{ fontSize: '3rem', fontWeight: 400, fontFamily: 'var(--font-heading)', color: 'var(--gold)' }}>₹{parseInt(amount).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem', background: 'var(--sand-light)', borderRadius: '16px', marginBottom: '3rem' }}>
                                            <Lock size={18} className="text-olive" style={{ marginTop: '0.25rem' }} />
                                            <p style={{ fontSize: '0.85rem', color: 'var(--olive)', fontWeight: 500, margin: 0 }}>
                                                Submission authorizes <span style={{ fontWeight: 800 }}>{selectedBank?.name}</span> to access your institutional profile and proof-of-production for credit risk synthesis.
                                            </p>
                                        </div>

                                        {error && (
                                            <div style={{
                                                marginBottom: '2rem', padding: '1.25rem',
                                                background: 'rgba(215, 87, 87, 0.05)', borderRadius: '12px',
                                                display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--terracotta)', fontWeight: 600
                                            }}>
                                                <AlertCircle size={20} />
                                                <span style={{ fontSize: '0.9rem' }}>{error}</span>
                                            </div>
                                        )}

                                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                                            <button className="btn-secondary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--border-light)', fontWeight: 800, cursor: 'pointer' }} onClick={handleBack} disabled={isProcessing}>BACK</button>
                                            <button
                                                className="btn btn-primary"
                                                style={{ flex: 2, padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '1rem', fontWeight: 800 }}
                                                onClick={handleSubmit}
                                                disabled={isProcessing}
                                            >
                                                {isProcessing ? <><Loader2 className="animate-spin" size={20} /> ANALYZING RISK...</> : 'COMMIT APPLICATION'}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default LoanApplicationFlow;
