import React from 'react';
import { useNavigate, useLocation, Link, NavLink } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  LayoutDashboard,
  FileText,
  Wallet,
  User,
  Settings,
  LogOut,
  TrendingUp,
  Building2,
  Landmark,
  Shield,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from '../contexts/LanguageContext';

const Sidebar = () => {
  const { userProfile, signOut, role } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'farmer': return <Sprout size={14} />;
      case 'business': return <Building2 size={14} />;
      case 'bank': return <Landmark size={14} />;
      default: return <User size={14} />;
    }
  };

  const menuItems = {
    farmer: [
      { path: '/farmer/dashboard', label: 'ECOSYSTEM OVERVIEW', icon: <LayoutDashboard size={18} /> },
      { path: '/farmer/contracts', label: 'TRADE HANDSHAKES', icon: <FileText size={18} /> },
      { path: '/farmer/loans', label: 'CAPITAL ACCESS', icon: <Wallet size={18} /> },
      { path: '/farmer/profile', label: 'ESTATE PROFILE', icon: <User size={18} /> },
    ],
    business: [
      { path: '/business/dashboard', label: 'STRATEGIC NODE', icon: <LayoutDashboard size={18} /> },
      { path: '/business/pipeline', label: 'PROCUREMENT FLOW', icon: <TrendingUp size={18} /> },
      { path: '/business/farmers', label: 'ECOSYSTEM NETWORK', icon: <User size={18} /> },
      { path: '/business/profile', label: 'INSTITUTIONAL ID', icon: <User size={18} /> },
    ],
    bank: [
      { path: '/bank/dashboard', label: 'CAPITAL PRECISION', icon: <LayoutDashboard size={18} /> },
      { path: '/bank/loans', label: 'CREDIT QUEUE', icon: <FileText size={18} /> },
      { path: '/bank/risk', label: 'RISK ARCHITECTURE', icon: <TrendingUp size={18} /> },
      { path: '/bank/profile', label: 'BANKING NODE', icon: <User size={18} /> },
    ]
  };

  const currentMenu = menuItems[role] || [];
  const kycProgress = userProfile?.kyc_status === 'verified' ? 100 : 65;

  return (
    <aside className="sidebar agri-pattern-light" style={{
      width: '300px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      backgroundColor: 'var(--forest)',
      color: 'var(--sand)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2.5rem 1.75rem',
      zIndex: 1000,
      borderRight: '1px solid rgba(231, 216, 201, 0.08)',
      boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
    }}>
      {/* Brand Header */}
      <Link to="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        textDecoration: 'none',
        color: 'inherit',
        marginBottom: '4rem'
      }}>
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          style={{
            background: 'var(--gold)',
            color: 'var(--forest)',
            borderRadius: '14px',
            padding: '0.6rem',
            display: 'flex',
            boxShadow: 'var(--shadow-main)'
          }}
        >
          <ShieldCheck size={28} />
        </motion.div>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.8rem',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          color: 'var(--sand)'
        }}>
          Agriance
        </span>
      </Link>

      {/* Institutional Role Badge */}
      <div style={{
        backgroundColor: 'rgba(231, 216, 201, 0.04)',
        borderRadius: '12px',
        padding: '1rem',
        marginBottom: '3rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        border: '1px solid rgba(231, 216, 201, 0.08)'
      }}>
        <div style={{
          width: '32px', height: '32px',
          backgroundColor: 'var(--gold)',
          color: 'var(--forest)',
          borderRadius: '8px',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {getRoleIcon()}
        </div>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.2rem' }}>
            OPERATIONAL ROLE
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--sand)', letterSpacing: '0.02em' }}>
            {role?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Navigation Protocols */}
      <nav style={{ flex: 1 }}>
        <div style={{ fontSize: '0.65rem', color: 'var(--olive)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem', paddingLeft: '0.75rem', opacity: 0.6 }}>
          PROTOCOL MODULES
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {currentMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                padding: '1rem 1.25rem',
                borderRadius: '12px',
                textDecoration: 'none',
                color: isActive ? 'var(--forest)' : 'var(--sand)',
                backgroundColor: isActive ? 'var(--sand)' : 'transparent',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.05em',
                borderLeft: isActive ? '4px solid var(--gold)' : '4px solid transparent',
              })}
            >
              <span style={{ opacity: 0.8 }}>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Institutional Verification Footer */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(231, 216, 201, 0.08)', paddingTop: '2.5rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '1.25rem',
          backgroundColor: 'rgba(231, 216, 201, 0.03)',
          borderRadius: '16px',
          marginBottom: '2rem',
          border: '1px solid rgba(231, 216, 201, 0.05)'
        }}>
          <div style={{ position: 'relative', width: '40px', height: '40px' }}>
            <svg style={{ transform: 'rotate(-90deg)', width: '40px', height: '40px' }}>
              <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(231, 216, 201, 0.05)" strokeWidth="3" />
              <circle
                cx="20" cy="20" r="18" fill="none" stroke="var(--gold)" strokeWidth="3"
                strokeDasharray={`${(kycProgress / 100) * 113}, 113`}
                style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
              <Shield size={18} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--sand)', marginBottom: '0.2rem' }}>COMPLIANCE STATUS</div>
            <div style={{ fontSize: '0.7rem', color: userProfile?.kyc_status === 'verified' ? 'var(--gold)' : 'var(--terracotta)', fontWeight: 700, letterSpacing: '0.05em' }}>
              {userProfile?.kyc_status === 'verified' ? 'VERIFIED NODE' : 'ACTION REQUIRED'}
            </div>
          </div>
        </div>

        {/* User Identity / Logout */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '44px', height: '44px',
              borderRadius: '12px',
              backgroundColor: 'var(--sand)',
              color: 'var(--forest)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: '1.1rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {userProfile?.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--sand)' }}>{userProfile?.full_name || 'IDENTIFIED USER'}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--olive)', fontWeight: 600, letterSpacing: '0.05em' }}>NODE ID: 0341-AGRI</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(215, 87, 87, 0.1)',
              border: 'none',
              color: 'var(--terracotta)',
              cursor: 'pointer',
              padding: '0.75rem',
              borderRadius: '10px',
              display: 'flex',
              transition: 'all 0.2s'
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
