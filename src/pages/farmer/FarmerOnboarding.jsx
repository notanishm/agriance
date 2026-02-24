import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, ClipboardList, ShieldCheck, ArrowLeft, ArrowRight, AlertCircle, Wheat, Leaf } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { farmerService } from '../../services/database';

const steps = [
    { id: 'kyc', title: 'KYC Verification', icon: <ShieldCheck size={20} /> },
    { id: 'personal', title: 'Identity Profile', icon: <CheckCircle2 size={20} /> },
    { id: 'land', title: 'Estate Asset', icon: <MapPin size={20} /> },
    { id: 'history', title: 'Harvest History', icon: <ClipboardList size={20} /> }
];

const FarmerOnboarding = () => {
    const { t } = useTranslation();
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(0);
    const [isLocating, setIsLocating] = useState(false);
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
        documentType: 'Aadhaar Card',
        documentNumber: '',
        fullName: '',
        phoneNumber: '',
        landSize: '',
        location: '',
        selectedCrops: []
    });

    useEffect(() => {
        if (user) {
            const { fullName } = getGoogleUserInfo();
            if (fullName) {
                setFormData(prev => ({
                    ...prev,
                    fullName: fullName
                }));
            }
        }
    }, [user]);

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

    const handleNext = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            await handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            if (!formData.phoneNumber) {
                throw new Error('Phone number is required');
            }

            const { email: userEmail, fullName: googleName } = getUserInfo();

            if (!userEmail) {
                throw new Error('Email not found. Please try logging in again.');
            }

            const { data, error } = await farmerService.createFarmerProfile(
                user.id,
                {
                    email: userEmail,
                    full_name: formData.fullName || googleName,
                    phone_number: formData.phoneNumber,
                    land_size: formData.landSize ? parseFloat(formData.landSize) : null,
                    location: formData.location || null,
                    crop_history: formData.selectedCrops || [],
                }
            );

            if (error) throw new Error(error);

            await updateProfile({
                role: 'farmer',
                onboarding_completed: true,
                full_name: formData.fullName || googleName,
                land_size: formData.landSize ? parseFloat(formData.landSize) : null,
            });

            navigate('/farmer/dashboard');
        } catch (err) {
            console.error('Error saving farmer profile:', err);
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

    const detectLocation = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationStr = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (GPS Verified)`;
                    setFormData(prev => ({ ...prev, location: locationStr }));
                    setIsLocating(false);
                },
                (error) => {
                    setError('Unable to detect location. Please enter manually.');
                    setIsLocating(false);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser');
            setIsLocating(false);
        }
    };

    const toggleCrop = (crop) => {
        setFormData(prev => ({
            ...prev,
            selectedCrops: prev.selectedCrops.includes(crop)
                ? prev.selectedCrops.filter(c => c !== crop)
                : [...prev.selectedCrops, crop]
        }));
    };

    return (
        <div className="agri-pattern" style={{ minHeight: '100vh', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                {/* Header Context */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <Leaf size={24} className="text-gold" />
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--olive)' }}>Ecosystem Entry</span>
                    </div>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Complete Your <span className="text-gold" style={{ fontStyle: 'italic' }}>Handshake</span></h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--olive)', maxWidth: '600px', margin: '0 auto' }}>Finalize your institutional profile to unlock collateral-free credit and direct trade.</p>
                </div>

                {/* Progress Visual */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5rem',
                    position: 'relative',
                    padding: '0 2rem'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: '25px',
                        left: '60px',
                        right: '60px',
                        height: '1px',
                        background: 'var(--border-light)',
                        zIndex: 0
                    }} />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStep / (steps.length - 1)) * 85}%` }}
                        style={{
                            position: 'absolute',
                            top: '25px',
                            left: '60px',
                            height: '2px',
                            background: 'var(--gold)',
                            zIndex: 0
                        }}
                    />

                    {steps.map((step, index) => (
                        <div key={step.id} style={{ zIndex: 1, textAlign: 'center', width: '120px' }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '50%',
                                background: index < currentStep ? 'var(--forest)' : index === currentStep ? 'white' : 'var(--sand-light)',
                                color: index < currentStep ? 'white' : index === currentStep ? 'var(--gold)' : 'var(--olive)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: index === currentStep ? '2px solid var(--gold)' : '1px solid var(--border-light)',
                                margin: '0 auto 1rem',
                                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                                boxShadow: index === currentStep ? 'var(--gold-glow)' : 'none'
                            }}>
                                {index < currentStep ? <CheckCircle2 size={24} /> : step.icon}
                            </div>
                            <span style={{
                                fontSize: '0.85rem',
                                fontWeight: index <= currentStep ? 800 : 500,
                                color: index <= currentStep ? 'var(--forest)' : 'var(--olive)',
                                letterSpacing: '-0.01em'
                            }}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>

                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="card card-farmer"
                    style={{ padding: '4rem', background: 'white' }}
                >
                    {error && (
                        <div style={{
                            padding: '1.25rem',
                            background: 'rgba(215, 87, 87, 0.1)',
                            border: '1px solid var(--terracotta)',
                            borderRadius: '12px',
                            marginBottom: '2.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            color: 'var(--terracotta)',
                            fontWeight: 600
                        }}>
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    {currentStep === 0 && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Verify Your Identity</h2>
                            <p style={{ color: 'var(--olive)', marginBottom: '3rem', fontSize: '1.1rem' }}>
                                Institutional trust starts with verification. Provide your Aadhaar or PAN details.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>DOCUMENT TYPE</label>
                                    <select
                                        className="input"
                                        style={{ width: '100%' }}
                                        value={formData.documentType}
                                        onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                                    >
                                        <option>Aadhaar Card</option>
                                        <option>PAN Card</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>SERIAL NUMBER</label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder={formData.documentType === 'Aadhaar Card' ? 'XXXX-XXXX-XXXX' : 'XXXXXXXXXX'}
                                        value={formData.documentNumber}
                                        onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Personal Profile</h2>
                            <p style={{ color: 'var(--olive)', marginBottom: '3rem', fontSize: '1.1rem' }}>Refine your platform identity for ecosystem participants.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>FULL LEGAL NAME</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Enter full legal name"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>MOBILE NUMBER</label>
                                    <input
                                        type="tel"
                                        className="input"
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        placeholder="+91..."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Estate Assets</h2>
                            <p style={{ color: 'var(--olive)', marginBottom: '3rem', fontSize: '1.1rem' }}>Quantify your agricultural territory for accurate risk evaluating.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>TOTAL LAND SIZE (ACRES)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        placeholder="e.g. 12.5"
                                        value={formData.landSize}
                                        onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.8rem', color: 'var(--olive)' }}>GEOGRAPHIC LOCATION</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            className="input"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="Tehsil / District"
                                            style={{ flex: 1 }}
                                        />
                                        <button
                                            onClick={detectLocation}
                                            disabled={isLocating}
                                            className="btn btn-secondary"
                                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                                        >
                                            <MapPin size={18} /> {isLocating ? 'Locating...' : 'Verify GPS'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Harvest Capability</h2>
                                <p style={{ color: 'var(--olive)', fontSize: '1.1rem' }}>Select your primary crop portfolio for procurement matching.</p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1.25rem' }}>
                                {['Wheat', 'Rice', 'Soybean', 'Cotton', 'Sugarcane', 'Maize', 'Onion', 'Potato', 'Pulse Mix'].map(crop => (
                                    <motion.div
                                        key={crop}
                                        whileHover={{ y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => toggleCrop(crop)}
                                        style={{
                                            padding: '2rem 1rem',
                                            border: '1px solid var(--border-light)',
                                            background: formData.selectedCrops.includes(crop) ? 'var(--sand-light)' : 'white',
                                            color: formData.selectedCrops.includes(crop) ? 'var(--forest)' : 'var(--olive)',
                                            borderRadius: '20px',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            boxShadow: formData.selectedCrops.includes(crop) ? 'inset 0 0 0 2px var(--gold)' : 'none'
                                        }}
                                    >
                                        <div style={{
                                            width: '40px', height: '40px', borderRadius: '50%',
                                            background: formData.selectedCrops.includes(crop) ? 'var(--forest)' : 'var(--sand-light)',
                                            color: formData.selectedCrops.includes(crop) ? 'white' : 'var(--olive)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {formData.selectedCrops.includes(crop) ? <CheckCircle2 size={24} /> : <Wheat size={20} />}
                                        </div>
                                        <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{crop}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={{
                        marginTop: '4rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        paddingTop: '3rem',
                        borderTop: '1px solid var(--border-light)'
                    }}>
                        <button onClick={handleBack} className="btn btn-secondary" disabled={isSubmitting} style={{ padding: '1rem 2rem' }}>
                            <ArrowLeft size={18} /> BACK
                        </button>
                        <button onClick={handleNext} className="btn btn-primary" disabled={isSubmitting} style={{ padding: '1rem 3rem' }}>
                            {currentStep === steps.length - 1
                                ? (isSubmitting ? 'ESTABLISHING PROFILE...' : 'COMPLETE HANDSHAKE')
                                : 'CONTINUE'
                            } <ArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FarmerOnboarding;
