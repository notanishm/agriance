import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Edit3, CheckCircle, ShieldCheck, FileText, Stamp, Printer } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ContractDisplay = ({ content, onEdit, onSign }) => {
    const contractRef = useRef();

    const downloadPDF = async () => {
        const element = contractRef.current;
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            logging: false
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Agriance_Protocol_Contract.pdf');
    };

    return (
        <div className="contract-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div
                ref={contractRef}
                className="contract-paper agri-pattern-light"
                style={{
                    background: 'white',
                    padding: '80px 60px',
                    borderRadius: '4px',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                    color: '#2d3748',
                    fontSize: '15px',
                    lineHeight: '1.8',
                    fontFamily: 'serif',
                    minHeight: '1000px',
                    position: 'relative',
                    border: '1px solid var(--border-light)'
                }}
            >
                {/* Institutional Header Seal */}
                <div style={{ position: 'absolute', top: '40px', right: '40px', opacity: 0.1 }}>
                    <ShieldCheck size={120} color="var(--blue-trust)" />
                </div>

                <div style={{ textAlign: 'center', marginBottom: '60px', borderBottom: '2px double var(--blue-trust)', paddingBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <ShieldCheck size={32} color="var(--blue-trust)" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.3em', color: 'var(--blue-trust)' }}>AGRIANCE PROTOCOL NETWORK</span>
                    </div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '3rem',
                        fontFamily: 'var(--font-heading)',
                        color: 'var(--forest)',
                        lineHeight: 1.1
                    }}>
                        Agricultural Trade Agreement
                    </h1>
                    <p style={{ margin: '15px 0 0 0', fontSize: '0.85rem', fontWeight: 600, color: 'var(--olive)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Protocol ID: AP-X-{Math.floor(Math.random() * 1000000)} • Precision Secured
                    </p>
                </div>

                <div className="markdown-body">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>

                <div style={{ marginTop: '100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
                    <div style={{ borderTop: '1px solid var(--border-main)', paddingTop: '20px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--olive)', letterSpacing: '0.1em', marginBottom: '1rem' }}>FIRST PARTY: SELLER (FARMER)</div>
                        <div style={{ background: 'var(--sand-light)', padding: '20px', borderRadius: '8px', border: '1px dashed var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Stamp size={24} color="var(--blue-trust)" style={{ opacity: 0.5 }} />
                            <p style={{ margin: 0, fontStyle: 'italic', fontWeight: 600, color: 'var(--blue-trust)', fontSize: '0.9rem' }}>
                                DIGITALLY SECURED BY AGRIANCE-NODE
                            </p>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-main)', paddingTop: '20px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--olive)', letterSpacing: '0.1em', marginBottom: '1rem' }}>SECOND PARTY: BUYER (BUSINESS)</div>
                        <div style={{ background: 'var(--sand-light)', padding: '20px', borderRadius: '8px', border: '1px dashed var(--border-light)', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: 'var(--olive)', opacity: 0.4 }}>PENDING INSTITUTIONAL SIGNATURE</p>
                        </div>
                    </div>
                </div>

                {/* Footer Fine Print */}
                <div style={{ marginTop: '80px', paddingTop: '30px', borderTop: '1px solid var(--border-light)', fontSize: '0.7rem', color: 'var(--olive)', opacity: 0.6, textAlign: 'center' }}>
                    This document is a smart legal protocol executed on the Agriance Distributed Ledger.
                    Verifiable at agriance.network/node/verify. All dispute resolutions subject to protocol governance.
                </div>
            </div>

            <div style={{ marginTop: '3.5rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <button
                    className="btn btn-secondary"
                    onClick={onEdit}
                    style={{ background: 'white', border: '1px solid var(--border-main)', padding: '1rem 2rem', fontWeight: 800, fontSize: '0.8rem' }}
                >
                    <Edit3 size={16} style={{ marginRight: '0.75rem' }} /> MODIFY PARAMETERS
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={downloadPDF}
                    style={{ background: 'white', border: '1px solid var(--border-main)', padding: '1rem 2rem', fontWeight: 800, fontSize: '0.8rem' }}
                >
                    <Printer size={16} style={{ marginRight: '0.75rem' }} /> EXPORT AUDIT LOG
                </button>
                <button
                    className="btn btn-primary"
                    onClick={onSign}
                    style={{ padding: '1rem 3rem', fontWeight: 800, fontSize: '0.9rem', boxShadow: 'var(--shadow-main)' }}
                >
                    <CheckCircle size={18} style={{ marginRight: '0.75rem' }} /> AUTHORIZE & SEAL
                </button>
            </div>

            <style>{`
                .markdown-body h1, .markdown-body h2, .markdown-body h3 {
                    color: var(--forest);
                    font-family: var(--font-heading);
                    margin-top: 2.5rem;
                    margin-bottom: 1.25rem;
                    border-bottom: 1px solid var(--border-light);
                    padding-bottom: 0.5rem;
                }
                .markdown-body h2 { font-size: 1.75rem; }
                .markdown-body p {
                    margin-bottom: 1.5rem;
                    color: #4a5568;
                }
                .markdown-body ul {
                    margin-bottom: 1.5rem;
                    padding-left: 2rem;
                }
                .markdown-body li {
                    margin-bottom: 0.75rem;
                }
                .markdown-body strong {
                    color: var(--blue-trust);
                }
            `}</style>
        </div>
    );
};

export default ContractDisplay;
