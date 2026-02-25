import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, MapPin, Phone, MessageCircle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchService } from '../../services/fetchService';
import { useAuth } from '../../contexts/AuthContext';
import ContractFlow from './ContractFlow';

const BusinessFarmers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    setLoading(true);
    const data = await fetchService.getFarmers(20);
    setFarmers(data || []);
    setLoading(false);
  };

  if (selectedFarmer) {
    return (
      <ContractFlow
        farmer={selectedFarmer}
        onComplete={() => {
          setSelectedFarmer(null);
          fetchFarmers();
        }}
        onClose={() => setSelectedFarmer(null)}
      />
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate('/business/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </button>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '2rem' }}>Ecosystem Network</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading farmers...</div>
      ) : farmers.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {farmers.map((farmer) => (
            <div key={farmer.id} className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{farmer.full_name || 'Farmer'}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} /> {farmer.location || 'Location not set'}
                  </p>
                </div>
                <div style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  background: farmer.kyc_status === 'verified' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                  color: farmer.kyc_status === 'verified' ? 'var(--success)' : 'var(--gold)'
                }}>
                  {farmer.kyc_status === 'verified' ? 'Verified' : 'Pending'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {farmer.phone_number && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Phone size={14} /> {farmer.phone_number}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedFarmer(farmer)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--forest)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <FileText size={16} /> Create Contract
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
          <Users size={64} color="var(--gold)" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
          <h2>No Farmers Yet</h2>
          <p style={{ color: 'var(--text-muted)' }}>No farmers have registered in the network.</p>
        </div>
      )}
    </div>
  );
};
export default BusinessFarmers;
