import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'var(--bg-main)' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '8rem', fontFamily: 'var(--font-heading)', color: 'var(--gold)', marginBottom: '0', lineHeight: 1 }}>404</h1>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>The page you're looking for doesn't exist.</p>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'var(--forest)', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
          <ArrowLeft size={18} /> Go Home
        </Link>
      </div>
    </div>
  );
};
export default NotFound;
