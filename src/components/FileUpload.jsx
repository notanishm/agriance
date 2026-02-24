import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FileUpload = ({ label, accept, onFileSelect, value }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange(file);
    };

    const handleFileChange = (file) => {
        if (onFileSelect) onFileSelect(file);
    };

    const clearFile = (e) => {
        e.stopPropagation();
        if (onFileSelect) onFileSelect(null);
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '1rem',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    color: 'var(--olive)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase'
                }}>
                    {label}
                </label>
            )}

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                    position: 'relative',
                    padding: '3rem 2rem',
                    background: isDragging ? 'rgba(74, 93, 35, 0.03)' : 'var(--sand-light)',
                    border: `1px dashed ${isDragging ? 'var(--olive)' : 'var(--border-main)'}`,
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: isDragging ? 'scale(1.01)' : 'scale(1)',
                    boxShadow: isDragging ? 'var(--glow-sm)' : 'none'
                }}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    accept={accept}
                    style={{ display: 'none' }}
                />

                <AnimatePresence mode="wait">
                    {value ? (
                        <motion.div
                            key="file-info"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--border-light)', textAlign: 'left' }}
                        >
                            <div style={{
                                width: '48px', height: '48px',
                                background: 'rgba(74, 93, 35, 0.1)',
                                borderRadius: '10px',
                                color: 'var(--olive)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <File size={22} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--blue-trust)', marginBottom: '0.25rem' }}>
                                    {value.name || 'Document Uploaded'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--olive)', fontWeight: 600, opacity: 0.7, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Shield size={12} /> SECURELY ATTACHED
                                </div>
                            </div>
                            <button
                                onClick={clearFile}
                                style={{
                                    background: 'var(--sand-light)',
                                    border: 'none',
                                    borderRadius: '8px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: 'var(--terracotta)',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="upload-prompt"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'white',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                color: 'var(--olive)'
                            }}>
                                <Upload size={24} />
                            </div>
                            <div style={{ fontWeight: 700, color: 'var(--blue-trust)', marginBottom: '0.5rem', fontSize: '1rem' }}>
                                Deploy Institutional Document
                            </div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--olive)', fontWeight: 500, opacity: 0.6 }}>
                                {accept ? `ACCEPTED FORMATS: ${accept.toUpperCase()}` : 'PDF, JPG, PNG SECURE TRANSFER'}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {value && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{
                            position: 'absolute',
                            top: '-10px',
                            right: '-10px',
                            background: 'white',
                            borderRadius: '50%',
                            padding: '4px',
                            boxShadow: 'var(--glow-sm)',
                            color: 'var(--olive)'
                        }}
                    >
                        <CheckCircle size={24} fill="currentColor" color="white" />
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
