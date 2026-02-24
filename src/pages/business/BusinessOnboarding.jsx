import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Building2, FileText, Banknote, ArrowLeft, ArrowRight, AlertCircle, ShieldCheck, Landmark } from 'lucide-react';
import FileUpload from '../../components/FileUpload';
import { useAuth } from '../../contexts/AuthContext';
import { businessService } from '../../services/database';

const BusinessOnboarding = () => {
    const { t } = useTranslation();
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [regFile, setRegFile] = useState(null);
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
        companyName: '',
        gstNumber: '',
        businessType: '',
        registrationNumber: '',
        bankName: '',
        accountNumber: '',
        ifscCode: ''
    });

    useEffect(() => {
        if (user) {
            const { fullName } = getGoogleUserInfo();
            if (fullName) {
                setFormData(prev => ({
                    ...prev,
                    companyName: fullName
                }));
            }
        }
    }, [user]);

    const handleNext = async () => {
        if (step < 3) {
            setStep(step + 1);
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
            if (!formData.companyName || !formData.gstNumber) {
                throw new Error('Please fill in company name and GST number');
            }

            if (!formData.bankName || !formData.accountNumber || !formData.ifscCode) {
                throw new Error('Please fill in all financial details');
            }

            const { email: userEmail, fullName: googleName } = getUserInfo();

            if (!userEmail) {
                throw new Error('Email not found. Please try logging in again.');
            }

            const { data, error } = await businessService.createBusinessProfile(
                user.id,
                {
                    email: userEmail,
                    business_name: formData.companyName,
                    business_gst: formData.gstNumber,
                    business_type: formData.businessType || 'Agricultural Trader',
                    registration_number: formData.registrationNumber,
                    bank_account: formData.accountNumber,
                    ifsc_code: formData.ifscCode,
                }
            );

            if (error) throw new Error(error);

            await updateProfile({
                role: 'business',
                onboarding_completed: true,
                business_name: formData.companyName,
                business_gst: formData.gstNumber,
            });

            navigate('/business/dashboard');
        } catch (err) {
            console.error('Error saving business profile:', err);
            setError(err.message || 'Failed to save profile. Please try again.');
            setIsSubmitting(false);
        }
    };

    const steps = [
        { id: 1, label: 'Entity Detail', icon: <Building2 size={18} /> },
        { id: 2, label: 'Legal Audit', icon: <FileText size={18} /> },
        { id: 3, label: 'Capital Node', icon: <Landmark size={18} /> }
    ];

    return (
        <div className="agri-pattern" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Header Section */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <ShieldCheck size={20} className="text-olive" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.15em', color: 'var(--olive)' }}>INSTITUTIONAL ONBOARDING</span>
                    </div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Business <span className="text-olive" style={{ fontStyle: 'italic' }}>Establishment</span></h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--olive)', opacity: 0.8 }}>Verify your operational identity to start procurement and deployment.</p>
                </div>

                {/* Progress Indicator */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    {steps.map((s) => (
                        <div key={s.id} style={{
                            flex: 1,
                            height: '4px',
                            background: step >= s.id ? 'var(--olive)' : 'var(--border-light)',
                            borderRadius: '2px',
                            transition: 'all 0.4s ease'
                        }} />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card card-business"
                    style={{ padding: '4rem', background: 'white' }}
                >
                    <div style={{ display: 'flex', gap: '3rem' }}>
                        {/* Sidebar Label */}
                        <div style={{ width: '150px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {steps.map((s) => (
                                <div key={s.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    color: step === s.id ? 'var(--olive)' : 'var(--border-main)',
                                    opacity: step >= s.id ? 1 : 0.4,
                                    transition: 'all 0.3s ease'
                                }}>
                                    <div style={{
                                        width: '32px', height: '32px', borderRadius: '8px',
                                        background: step === s.id ? 'var(--olive)' : 'transparent',
                                        color: step === s.id ? 'white' : 'inherit',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: step === s.id ? 'none' : '1px solid var(--border-light)'
                                    }}>
                                        {s.icon}
                                    </div>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.05em' }}>{s.label.toUpperCase()}</span>
                                </div>
                            ))}
                        </div>

                        {/* Content Area */}
                        <div style={{ flex: 1 }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                >
                                    {error && (
                                        <div style={{
                                            padding: '1.25rem',
                                            background: 'rgba(215, 87, 87, 0.05)',
                                            border: '1px solid var(--terracotta)',
                                            borderRadius: '10px',
                                            marginBottom: '2rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            color: 'var(--terracotta)',
                                            fontWeight: 700,
                                            fontSize: '0.9rem'
                                        }}>
                                            <AlertCircle size={18} />
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    {step === 1 && (
                                        <div>
                                            <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>Core Entity Details</h2>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--olive)' }}>ENTITY LEGAL NAME</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        placeholder="As registered in GST/PAN"
                                                        value={formData.companyName}
                                                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--olive)' }}>GST/TAX IDENTIFICATION</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        placeholder="22AAAAA0000A1Z5"
                                                        value={formData.gstNumber}
                                                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--olive)' }}>BUSINESS DOMAIN</label>
                                                    <select
                                                        className="input"
                                                        value={formData.businessType}
                                                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                                    >
                                                        <option value="">Select Domain</option>
                                                        <option value="Processor">Food Processor</option>
                                                        <option value="Exporter">Exporter</option>
                                                        <option value="Retailer">Institutional Retailer</option>
                                                        <option value="Trader">Agricultural Trader</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {step === 2 && (
                                        <div>
                                            <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem' }}>Legal Audit</h2>
                                            <p style={{ color: 'var(--olive)', marginBottom: '3rem', fontSize: '1.1rem', opacity: 0.8 }}>Verify your operational legitimacy by uploading regulatory certificates.</p>
                                            <div className="card-business" style={{ background: 'var(--sand-light)', border: '1px dashed var(--olive)', padding: '3rem' }}>
                                                <FileUpload
                                                    label="REGISTRATION CERTIFICATE (PDF/JPG)"
                                                    value={regFile}
                                                    onFileSelect={setRegFile}
                                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {step === 3 && (
                                        <div>
                                            <h2 style={{ fontSize: '2.2rem', marginBottom: '2rem' }}>Capital Deployment Node</h2>
                                            <p style={{ color: 'var(--olive)', marginBottom: '3rem', fontSize: '1.1rem', opacity: 0.8 }}>Configure your primary settlement account for platform transactions.</p>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--olive)' }}>BANKING INSTITUTION</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        placeholder="Legal bank name"
                                                        value={formData.bankName}
                                                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                                    />
                                                </div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--olive)' }}>ACCOUNT NUMBER</label>
                                                        <input
                                                            type="text"
                                                            className="input"
                                                            placeholder="000000000000"
                                                            value={formData.accountNumber}
                                                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--olive)' }}>IFSC ROUTING CODE</label>
                                                        <input
                                                            type="text"
                                                            className="input"
                                                            placeholder="ABCD0123456"
                                                            value={formData.ifscCode}
                                                            onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'space-between', paddingTop: '3rem', borderTop: '1px solid var(--border-light)' }}>
                                <button
                                    onClick={() => setStep(s => s - 1)}
                                    disabled={step === 1 || isSubmitting}
                                    style={{
                                        padding: '1rem 2.5rem',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        border: '1px solid var(--border-light)',
                                        background: 'transparent',
                                        color: 'var(--olive)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        opacity: step === 1 ? 0 : 1
                                    }}
                                >
                                    <ArrowLeft size={16} /> BACK
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={isSubmitting}
                                    style={{
                                        padding: '1rem 3rem',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 800,
                                        border: 'none',
                                        background: 'var(--olive)',
                                        color: 'white',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem'
                                    }}
                                >
                                    {step === 3
                                        ? (isSubmitting ? 'VERIFYING...' : 'ESTABLISH NODE')
                                        : 'NEXT PROTOCOL'
                                    } <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BusinessOnboarding;
