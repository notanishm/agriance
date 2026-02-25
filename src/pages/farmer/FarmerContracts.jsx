import React from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import { FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FarmerContracts = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate('/farmer/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '0.5rem' }}>Trade Handshakes</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>View and manage your active contracts</p>
      <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
        <FileText size={64} color="var(--gold)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
        <h2 style={{ marginBottom: '1rem' }}>Coming Soon</h2>
        <p style={{ color: 'var(--text-muted)' }}>This feature will allow you to view all your active contracts.</p>
      </div>
    </div>
  );
};
export default FarmerContracts;
