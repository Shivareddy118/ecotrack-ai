import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [redeemAmount, setRedeemAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleRedeem = async () => {
    const credits = parseInt(redeemAmount);
    if (!credits || credits <= 0) return setError('Enter a valid amount');
    setLoading(true); setMsg(''); setError('');
    try {
      const { data } = await axios.post('/api/admin/redeem', { credits });
      setMsg(data.message);
      updateUser({ greenCredits: data.greenCredits });
      setRedeemAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Redemption failed');
    } finally { setLoading(false); }
  };

  const rewards = [
    { icon: '☕', name: 'Free Coffee', cost: 50, desc: 'Redeemable at Campus Café' },
    { icon: '🍕', name: 'Pizza Slice', cost: 80, desc: 'Valid at Food Court' },
    { icon: '📚', name: 'Stationery Set', cost: 100, desc: 'From Campus Store' },
    { icon: '🎽', name: 'Eco T-Shirt', cost: 200, desc: 'Green Campus merchandise' },
    { icon: '🌱', name: 'Plant a Tree', cost: 150, desc: 'We plant in your name' },
    { icon: '🏅', name: 'Eco Champion Badge', cost: 300, desc: 'Digital certificate' },
  ];

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0' }}>👤 My Profile</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Manage your account and redeem green credits</p>
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="glass" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '28px' }}>
            <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #22c55e, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: 'white' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#e2e8f0' }}>{user?.name}</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{user?.email}</div>
              <span className={`badge ${user?.role === 'admin' ? 'badge-blue' : 'badge-green'}`} style={{ marginTop: '6px' }}>
                {user?.role === 'admin' ? '⚙️ Admin' : '🎓 Student'}
              </span>
            </div>
          </div>

          <div className="grid-2">
            {[
              { icon: '🌱', value: user?.greenCredits || 0, label: 'Green Credits', color: '#22c55e' },
              { icon: '♻️', value: user?.plasticAvoided || 0, label: 'Plastic Avoided', color: '#3b82f6' },
            ].map(s => (
              <div key={s.label} style={{ padding: '18px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '4px' }}>{s.icon}</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '24px', padding: '18px', background: 'rgba(34,197,94,0.08)', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.15)' }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Environmental Impact</div>
            <div style={{ fontSize: '15px', color: '#86efac', fontWeight: 600 }}>
              🌍 You've helped prevent {user?.plasticAvoided || 0} single-use plastic bottles
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
              That's approximately {((user?.plasticAvoided || 0) * 0.015).toFixed(3)} kg of plastic waste avoided
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>💳 Redeem Credits</h3>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '20px' }}>Use your green credits for eco-friendly rewards</p>

          {msg && <div className="success-msg">{msg}</div>}
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label>Credits to Redeem</label>
            <input type="number" placeholder="Enter amount" value={redeemAmount}
              onChange={e => setRedeemAmount(e.target.value)} min="1" max={user?.greenCredits} />
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>Available: {user?.greenCredits || 0} credits</div>
          </div>

          <button className="btn-primary" onClick={handleRedeem} disabled={loading || !redeemAmount}>
            {loading ? '⏳ Processing...' : '💚 Redeem Credits'}
          </button>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>🎁 Available Rewards</h3>
        <div className="grid-3">
          {rewards.map(r => (
            <div key={r.name} style={{ padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>{r.icon}</div>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#e2e8f0' }}>{r.name}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px', marginBottom: '12px' }}>{r.desc}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#22c55e', fontWeight: 700, fontSize: '16px' }}>{r.cost} 🌱</span>
                <button
                  onClick={() => { setRedeemAmount(r.cost.toString()); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  style={{ background: user?.greenCredits >= r.cost ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${user?.greenCredits >= r.cost ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.1)'}`, color: user?.greenCredits >= r.cost ? '#86efac' : 'rgba(255,255,255,0.3)', padding: '6px 14px', borderRadius: '8px', cursor: user?.greenCredits >= r.cost ? 'pointer' : 'default', fontSize: '12px', fontWeight: 600 }}>
                  {user?.greenCredits >= r.cost ? 'Redeem' : 'Locked'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
