import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Landmark, ShieldCheck, FileText, Globe, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Activity, Lock } from 'lucide-react';
import { useTranslation } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { bankService } from '../../services/database';

const steps = [
    { id: 'bank_info', title: 'Institute Profile', icon: <Landmark size={20} /> },
    { id: 'license', title: 'Regulatory Compliance', icon: <ShieldCheck size={20} /> },
    { id: 'products', title: 'Loan Product Architecture', icon: <FileText size={20} /> },
    { id: 'ops', title: 'Deployment Node', icon: <Globe size={20} /> }
];

const BankOnboarding = () => {
    const { t } = useTranslation();
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const getGoogleUserInfo = () => {
        const fullName = user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            user?.identities?.[0]?.identity_data?.full_name ||
            user?.identities?.[0]?.identity_data?.name ||
            '';
        return { fullName };
    };

    const [formData, setFormData] = useState({
        bankName: '',
        institutionType: 'Public Sector Bank',
        headquartersCity: '',
        rbiLicense: '',
        gstin: '',
        branchName: '',
        bankCode: ''
    });

    useEffect(() => {
        if (user) {
            const { fullName } = getGoogleUserInfo();
            if (fullName) {
                setFormData(prev => ({
                    ...prev,
                    bankName: fullName
                }));
            }
        }
    }, [user]);

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await handleSubmit();
        }
    };

    const getUserInfo = () => {
        const email = user?.email ||
            user?.user_metadata?.email ||
            user?.user_metadata?.user_name ||
            user?.identities?.[0]?.identity_data?.email;

        const fullName = user?.user_metadata?.full_name ||
            user?.user_metadata?.name ||
            user?.user_metadata?.user_name ||
            user?.identities?.[0]?.identity_data?.full_name ||
            user?.identities?.[0]?.identity_data?.name;

        return { email, fullName };
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (!formData.bankName || !formData.rbiLicense) {
                throw new Error('Please fill in bank name and RBI license number');
            }

            const { email: userEmail } = getUserInfo();

            if (!userEmail) {
                throw new Error('Email not found. Please try logging in again.');
            }

            const { data, error } = await bankService.createBankProfile(
                user.id,
                {
                    email: userEmail,
                    bank_name: formData.bankName,
                    branch_name: formData.headquartersCity || 'Main Branch',
                    bank_code: formData.rbiLicense,
                    license_number: formData.rbiLicense,
                }
            );

            if (error) throw new Error(error);

            await updateProfile({
                role: 'bank',
                onboarding_completed: true,
                bank_name: formData.bankName,
            });

            navigate('/bank/dashboard');
        } catch (err) {
            console.error('Error saving bank profile:', err);
            setError(err.message || 'Failed to save profile. Please try again.');
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate('/roles');
        }
    };

    return (
        <div className="agri-pattern" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                {/* Header Context */}
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <Lock size={18} className="text-gold" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.3em', color: 'var(--blue-trust)' }}>SECURE INSTITUTIONAL PORTAL</span>
                    </div>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Capital <span className="text-gold" style={{ fontStyle: 'italic' }}>Precision</span></h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--olive)', maxWidth: '600px', margin: '0 auto' }}>Establishing your institutional framework for the agricultural ecosystem.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem', alignItems: 'start' }}>

                    {/* Stepper Sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {steps.map((step, index) => (
                            <div key={step.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.25rem',
                                color: currentStep === index ? 'var(--blue-trust)' : 'var(--olive)',
                                opacity: currentStep >= index ? 1 : 0.4,
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px',
                                    background: currentStep === index ? 'var(--blue-trust)' : 'var(--sand-light)',
                                    color: currentStep === index ? 'white' : 'inherit',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    border: currentStep === index ? 'none' : '1px solid var(--border-light)',
                                    boxShadow: currentStep === index ? 'var(--glow-sm)' : 'none'
                                }}>
                                    {currentStep > index ? <CheckCircle2 size={20} /> : step.icon}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', opacity: 0.6 }}>STEP 0{index + 1}</span>
                                    <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>{step.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Area */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card"
                        style={{ padding: '4rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border-light)' }}
                    >
                        {error && (
                            <div style={{
                                padding: '1.25rem',
                                background: 'rgba(215, 87, 87, 0.05)',
                                border: '1px solid var(--terracotta)',
                                borderRadius: '8px',
                                marginBottom: '2.5rem',
                                display: 'flex',
                                alignItems: 'center', gap: '1rem',
                                color: 'var(--terracotta)',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}>
                                <AlertCircle size={18} />
                                <span>{error}</span>
                            </div>
                        )}

                        <AnimatePresence mode="wait">
                            {currentStep === 0 && (
                                <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Institute Profile</h2>
                                    <p style={{ color: 'var(--olive)', marginBottom: '3rem', fontSize: '1.1rem' }}>Official identity metrics for institutional onboarding.</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--blue-trust)' }}>LEGAL ENTITY NAME</label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="e.g. State Bank of India"
                                                value={formData.bankName}
                                                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                            />
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--blue-trust)' }}>INSTITUTION TYPE</label>
                                                <select
                                                    className="input"
                                                    value={formData.institutionType}
                                                    onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                                                >
                                                    <option>Public Sector Bank</option>
                                                    <option>Private Bank</option>
                                                    <option>Co-operative Bank</option>
                                                    <option>NBFC</option>
                                                    <option>MFI</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--blue-trust)' }}>HEADQUARTERS</label>
                                                <input
                                                    type="text"
                                                    className="input"
                                                    placeholder="Mumbai / Delhi"
                                                    value={formData.headquartersCity}
                                                    onChange={(e) => setFormData({ ...formData, headquartersCity: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Regulatory Audit</h2>
                                    <p style={{ color: 'var(--olive)', marginBottom: '3rem', fontSize: '1.1rem' }}>Sovereign authorization and tax identification mapping.</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--blue-trust)' }}>RBI LICENSE NUMBER</label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="AUTH-XXXX-XXXX"
                                                value={formData.rbiLicense}
                                                onChange={(e) => setFormData({ ...formData, rbiLicense: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--blue-trust)' }}>INSTITUTIONAL GSTIN</label>
                                            <input
                                                type="text"
                                                className="input"
                                                placeholder="22AAAAA0000A1Z5"
                                                value={formData.gstin}
                                                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                            />
                                        </div>
                                        <div style={{
                                            padding: '3rem',
                                            border: '1px dashed var(--blue-trust)',
                                            background: 'var(--sand-light)',
                                            borderRadius: '8px',
                                            textAlign: 'center'
                                        }}>
                                            <FileText size={32} className="text-blue-trust" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                            <p style={{ color: 'var(--blue-trust)', fontSize: '0.85rem', fontWeight: 700 }}>UPLOAD RBI AUTHORIZATION PDF</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Product Engineering</h2>
                                    <p style={{ color: 'var(--olive)', marginBottom: '3rem', fontSize: '1.1rem' }}>Defining institutional lending frameworks and interest archetypes.</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {['Kisan Credit Card (KCC)', 'Post-Harvest Finance', 'Agri-Infra Debt', 'Micro-Irrigation Lease'].map((prod, i) => (
                                            <div key={i} style={{
                                                padding: '1.5rem',
                                                border: '1px solid var(--border-light)',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                background: 'var(--white)'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <Activity size={18} className="text-gold" />
                                                    <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{prod.toUpperCase()}</span>
                                                </div>
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <input type="text" placeholder="Rate %" style={{ width: '80px', padding: '0.5rem', border: '1px solid var(--border-light)', borderRadius: '4px', fontSize: '0.8rem' }} />
                                                    <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem', fontWeight: 800 }}>CONFIGURE</button>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="btn btn-secondary" style={{ borderStyle: 'dashed', border: '1px dashed var(--border-light)', background: 'transparent', padding: '1.5rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>+ ENGINEER CUSTOM PRODUCT ARCHIVE</button>
                                    </div>
                                </motion.div>
                            )}

                            {currentStep === 3 && (
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '80px', height: '80px', background: 'var(--blue-trust)',
                                        color: 'white', borderRadius: '50%', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem',
                                        boxShadow: 'var(--glow-sm)'
                                    }}>
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>System Ready</h2>
                                    <p style={{ color: 'var(--olive)', fontSize: '1.15rem', marginBottom: '3.5rem' }}>
                                        Your institutional node is now active. Authorization for credit deployment is established.
                                    </p>
                                    <div style={{ background: 'var(--sand-light)', padding: '2rem', borderRadius: '12px', textAlign: 'left', border: '1px solid var(--border-light)' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--blue-trust)', letterSpacing: '0.1em', marginBottom: '1rem' }}>OPERATIONAL STATUS</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--gold)' }}>
                                            <Activity size={18} />
                                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pending final cryptographic verification (Est. 2-4 hrs)</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>

                        <div style={{
                            marginTop: '5rem', display: 'flex', justifyContent: 'space-between',
                            paddingTop: '3rem', borderTop: '1px solid var(--border-light)'
                        }}>
                            <button
                                onClick={handleBack}
                                className="btn btn-secondary"
                                style={{
                                    opacity: currentStep === 0 ? 0 : 1,
                                    pointerEvents: currentStep === 0 ? 'none' : 'auto',
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    fontWeight: 800, fontSize: '0.85rem'
                                }}
                            >
                                <ArrowLeft size={18} /> BACK
                            </button>
                            <button
                                onClick={handleNext}
                                className="btn btn-primary"
                                disabled={isSubmitting}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    fontWeight: 800, fontSize: '0.85rem',
                                    background: 'var(--blue-trust)', color: 'white'
                                }}
                            >
                                {currentStep === steps.length - 1
                                    ? (isSubmitting ? 'ESTABLISHING NODE...' : 'INITIALIZE DASHBOARD')
                                    : 'NEXT PROTOCOL'
                                } <ArrowRight size={18} />
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default BankOnboarding;
