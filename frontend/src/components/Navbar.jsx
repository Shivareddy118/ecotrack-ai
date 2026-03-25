import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const links = [
    { to: '/dashboard', label: '🏠 Dashboard' },
    { to: '/scan', label: '📷 QR Scan' },
    { to: '/ai-detection', label: '🤖 AI Detect' },
    { to: '/leaderboard', label: '🏆 Leaderboard' },
    ...(user?.role === 'admin' ? [{ to: '/admin', label: '⚙️ Admin' }] : [])
  ];

  if (!user) return null;

  return (
    <nav style={{
      background: 'rgba(10,15,30,0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      padding: '0 24px',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🌿</div>
          <span style={{ fontWeight: 700, fontSize: '18px', background: 'linear-gradient(135deg, #22c55e, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EcoTrack AI</span>
        </Link>

        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          {links.map(l => (
            <Link key={l.to} to={l.to} style={{
              textDecoration: 'none', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500,
              background: location.pathname === l.to ? 'rgba(34,197,94,0.2)' : 'transparent',
              color: location.pathname === l.to ? '#86efac' : 'rgba(255,255,255,0.6)',
              border: location.pathname === l.to ? '1px solid rgba(34,197,94,0.3)' : '1px solid transparent',
              transition: 'all 0.2s', whiteSpace: 'nowrap'
            }}>{l.label}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#86efac' }}>🌱 {user.greenCredits} Credits</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{user.name}</div>
          </div>
          <Link to="/profile" style={{
            width: '36px', height: '36px', background: 'linear-gradient(135deg, #22c55e, #059669)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, color: 'white', textDecoration: 'none', fontSize: '14px'
          }}>{user.name?.[0]?.toUpperCase()}</Link>
          <button onClick={handleLogout} style={{
            background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
            fontSize: '13px', fontWeight: 500, transition: 'all 0.2s'
          }}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
