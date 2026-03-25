import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [txRes, lbRes] = await Promise.all([
          axios.get('/api/transaction/my-history'),
          axios.get('/api/admin/leaderboard')
        ]);
        setTransactions(txRes.data);
        setLeaderboard(lbRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const chartData = transactions.slice(0, 7).reverse().map((t, i) => ({
    day: new Date(t.date).toLocaleDateString('en', { weekday: 'short' }),
    credits: t.creditsEarned,
    plastic: t.plasticSaved
  }));

  const stats = [
    { icon: '🌱', label: 'Green Credits', value: user?.greenCredits || 0, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { icon: '♻️', label: 'Plastic Avoided', value: user?.plasticAvoided || 0, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { icon: '📊', label: 'Total Scans', value: transactions.length, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
    { icon: '🏆', label: 'Rank', value: `#${(leaderboard.findIndex(u => u._id === user?._id) + 1) || '—'}`, color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
  ];

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0' }}>
          Welcome back, <span style={{ background: 'linear-gradient(135deg, #22c55e, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Track your sustainability impact</p>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {stats.map(s => (
          <div className="stat-card" key={s.label} style={{ borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>📈 Weekly Activity</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#1a2335', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
                <Bar dataKey="credits" fill="#22c55e" radius={[4,4,0,0]} name="Credits" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '40px 0' }}>
              No scans yet. Start scanning QR codes!
            </div>
          )}
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>🚀 Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { to: '/scan', icon: '📷', label: 'Scan QR Code', desc: 'Earn +10 Green Credits', color: '#22c55e' },
              { to: '/ai-detection', icon: '🤖', label: 'AI Plastic Detection', desc: 'Detect plastic waste', color: '#3b82f6' },
              { to: '/leaderboard', icon: '🏆', label: 'View Leaderboard', desc: 'See top contributors', color: '#a855f7' },
              { to: '/profile', icon: '💳', label: 'Redeem Credits', desc: 'Use your green credits', color: '#eab308' },
            ].map(a => (
              <Link key={a.to} to={a.to} style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
                  <div style={{ width: '40px', height: '40px', background: `${a.color}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{a.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#e2e8f0' }}>{a.label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{a.desc}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: a.color, fontSize: '16px' }}>→</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>📜 Recent Transactions</h3>
        {loading ? <div className="loading"><div className="spinner"></div> Loading...</div> :
          transactions.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '30px 0' }}>No transactions yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {transactions.slice(0, 5).map(t => (
                <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '22px' }}>♻️</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', color: '#e2e8f0' }}>{t.vendorName}</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{new Date(t.date).toLocaleString()}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#86efac', fontWeight: 700 }}>+{t.creditsEarned} Credits</div>
                    <div style={{ fontSize: '12px', color: '#93c5fd' }}>-{t.plasticSaved} plastic bottle</div>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  );
}
