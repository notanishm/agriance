import React from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BusinessFarmers = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate('/business/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '2rem' }}>Ecosystem Network</h1>
      <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
        <Users size={64} color="var(--gold)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
        <h2>Coming Soon</h2>
        <p style={{ color: 'var(--text-muted)' }}>View and manage your farmer network.</p>
      </div>
    </div>
  );
};
export default BusinessFarmers;
