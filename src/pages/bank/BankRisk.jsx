import React from 'react';
import { ArrowLeft, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BankRisk = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate('/bank/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '2rem' }}>Risk Architecture</h1>
      <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
        <TrendingUp size={64} color="var(--gold)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
        <h2>Coming Soon</h2>
        <p style={{ color: 'var(--text-muted)' }}>Monitor and analyze risk metrics.</p>
      </div>
    </div>
  );
};
export default BankRisk;
