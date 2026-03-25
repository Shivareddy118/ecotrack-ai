import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/admin/leaderboard')
      .then(r => setLeaders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0' }}>🏆 Sustainability Leaderboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Top eco-warriors on campus this semester</p>
      </div>

      {leaders.length > 0 && (
        <div className="grid-3" style={{ marginBottom: '32px' }}>
          {leaders.slice(0, 3).map((u, i) => (
            <div key={u._id} className="glass" style={{ padding: '28px', textAlign: 'center', border: i === 0 ? '1px solid rgba(234,179,8,0.4)' : i === 1 ? '1px solid rgba(156,163,175,0.4)' : '1px solid rgba(180,124,61,0.4)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '80px', opacity: 0.06 }}>{medals[i]}</div>
              <div style={{ fontSize: '40px', marginBottom: '8px' }}>{medals[i]}</div>
              <div style={{ width: '56px', height: '56px', background: `linear-gradient(135deg, ${i === 0 ? '#eab308,#ca8a04' : i === 1 ? '#9ca3af,#6b7280' : '#b47c3d,#92600a'})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '22px', color: 'white', margin: '0 auto 12px' }}>
                {u.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#e2e8f0', marginBottom: '4px' }}>{u.name}</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: i === 0 ? '#eab308' : i === 1 ? '#9ca3af' : '#b47c3d' }}>{u.greenCredits}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>Green Credits</div>
              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                <span className="badge badge-green">🌍 {u.plasticAvoided} bottles saved</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>📊 Full Rankings</h3>
        {loading ? (
          <div className="loading"><div className="spinner"></div> Loading leaderboard...</div>
        ) : leaders.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px 0' }}>
            No data yet. Be the first to scan a QR code!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leaders.map((u, i) => (
              <div key={u._id} style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px',
                background: u._id === user?._id ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                border: u._id === user?._id ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s'
              }}>
                <div style={{ width: '36px', height: '36px', background: i < 3 ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'rgba(255,255,255,0.08)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: i < 3 ? '18px' : '14px', color: 'white', flexShrink: 0 }}>
                  {i < 3 ? medals[i] : `#${i + 1}`}
                </div>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #22c55e, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', flexShrink: 0 }}>
                  {u.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#e2e8f0' }}>
                    {u.name} {u._id === user?._id && <span style={{ fontSize: '11px', color: '#86efac' }}>(You)</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>♻️ {u.plasticAvoided} plastic bottles avoided</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#22c55e' }}>{u.greenCredits}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>credits</div>
                </div>
                <div style={{ width: '100px' }}>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (u.greenCredits / (leaders[0]?.greenCredits || 1)) * 100)}%`, background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
