import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminPanel() {
  const { API } = useAuth();
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    Promise.all([
      API.get('/admin/plastic-stats'),
      API.get('/admin/leaderboard')
    ]).then(([statsRes, lbRes]) => {
      setStats(statsRes.data);
      setLeaderboard(lbRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(0,200,150,0.3)', borderRadius: 10, padding: '10px 14px' }}>
          <p style={{ color: '#00c896', fontWeight: 600 }}>{label}</p>
          {payload.map(p => <p key={p.name} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>{p.name}: {p.value}</p>)}
        </div>
      );
    }
    return null;
  };

  const tabs = ['overview', 'analytics', 'leaderboard', 'detections'];

  if (loading) return <div className="page-container"><div className="spinner" /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">⚙️ Admin Dashboard</h1>
        <p className="page-subtitle">Campus sustainability analytics and management</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 6, width: 'fit-content' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', borderRadius: 10, border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
              background: activeTab === tab ? 'rgba(0,200,150,0.2)' : 'transparent',
              color: activeTab === tab ? '#00c896' : 'rgba(255,255,255,0.5)',
              border: activeTab === tab ? '1px solid rgba(0,200,150,0.3)' : '1px solid transparent',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === 'overview' && stats && (
        <>
          <div className="stats-grid">
            {[
              { icon: '👥', value: stats.totalUsers, label: 'Total Students', color: '#00c896' },
              { icon: '📱', value: stats.totalTransactions, label: 'QR Scans', color: '#6c63ff' },
              { icon: '♻️', value: stats.totalPlasticAvoided, label: 'Plastic Avoided', color: '#f59e0b' },
              { icon: '🌿', value: stats.totalCreditsIssued, label: 'Credits Issued', color: '#10b981' },
              { icon: '🔍', value: stats.totalWasteDetections, label: 'Waste Detections', color: '#ef4444' },
              { icon: '⚠️', value: stats.plasticDetections, label: 'Plastic Detected', color: '#f97316' },
            ].map((s, i) => (
              <div key={i} className="glass-card stat-card">
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="glass-card" style={{ padding: 28, marginTop: 8, background: 'linear-gradient(135deg, rgba(0,200,150,0.08), rgba(108,99,255,0.08))' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>📊 Campus Impact Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { label: 'CO₂ Prevented', value: `${(stats.totalPlasticAvoided * 0.03).toFixed(1)}kg`, icon: '🌍' },
                { label: 'Avg Credits / Student', value: stats.totalUsers > 0 ? Math.round(stats.totalCreditsIssued / stats.totalUsers) : 0, icon: '📈' },
                { label: 'AI Detection Rate', value: `${stats.totalWasteDetections > 0 ? Math.round((stats.plasticDetections / stats.totalWasteDetections) * 100) : 0}%`, icon: '🤖' },
              ].map((item, i) => (
                <div key={i} style={{ textAlign: 'center', padding: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 28, color: '#00c896' }}>{item.value}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Analytics */}
      {activeTab === 'analytics' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Daily QR Scans (Last 7 Days)</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24 }}>Transaction volume by day</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.dailyStats.length > 0 ? stats.dailyStats : [{ _id: 'No data', count: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="_id" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Scans" fill="#00c896" radius={[4, 4, 0, 0]} />
                <Bar dataKey="plasticSaved" name="Plastic Saved" fill="#6c63ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid-2">
            <div className="glass-card" style={{ padding: 28 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Plastic Detection vs Avoided</h3>
              <div style={{ display: 'flex', gap: 20 }}>
                {[
                  { label: 'Detected by AI', value: stats.plasticDetections, color: '#ff6b6b', pct: stats.totalWasteDetections > 0 ? Math.round((stats.plasticDetections / stats.totalWasteDetections) * 100) : 0 },
                  { label: 'Avoided by QR', value: stats.totalPlasticAvoided, color: '#00c896', pct: 100 },
                ].map((item, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: `conic-gradient(${item.color} ${item.pct * 3.6}deg, rgba(255,255,255,0.08) 0deg)`, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 56, height: 56, background: '#0a0f1e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: item.color }}>
                        {item.value}
                      </div>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 28 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 20 }}>System Health</h3>
              {[
                { label: 'API Status', status: '✅ Online', color: '#00c896' },
                { label: 'MongoDB', status: '✅ Connected', color: '#00c896' },
                { label: 'AI Model', status: '✅ Ready', color: '#00c896' },
                { label: 'QR System', status: '✅ Active', color: '#00c896' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 700 }}>All Students — Sorted by Green Credits</h3>
            <span className="badge badge-green">{leaderboard.length} students</span>
          </div>
          <table className="eco-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Green Credits</th>
                <th>Plastic Avoided</th>
                <th>CO₂ Saved</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((u, i) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 700, color: i < 3 ? ['#ffd700', '#c0c0c0', '#cd7f32'][i] : 'rgba(255,255,255,0.5)' }}>
                    {i < 3 ? ['🥇', '🥈', '🥉'][i] : `#${i + 1}`}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: `hsl(${i * 37}, 60%, 50%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                        {u.name?.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td><span style={{ color: '#00c896', fontWeight: 700 }}>🌿 {u.greenCredits}</span></td>
                  <td><span style={{ color: '#a78bfa' }}>♻️ {u.plasticAvoided}</span></td>
                  <td style={{ color: '#f59e0b' }}>{(u.plasticAvoided * 0.03).toFixed(2)} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent Detections */}
      {activeTab === 'detections' && stats && (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 style={{ fontWeight: 700 }}>Recent AI Plastic Detections</h3>
          </div>
          <table className="eco-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Label</th>
                <th>Confidence</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentDetections.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.3)' }}>No detections yet</td></tr>
              ) : stats.recentDetections.map((d, i) => (
                <tr key={i}>
                  <td>{d.userId?.name || 'Unknown'}</td>
                  <td style={{ maxWidth: 200 }}><span style={{ fontSize: 13 }}>{d.label}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ height: 4, width: 60, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${d.confidence}%`, background: '#00c896', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontSize: 12, color: '#00c896' }}>{d.confidence?.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td><span className={`badge ${d.isPlastic ? 'badge-red' : 'badge-green'}`}>{d.isPlastic ? '⚠️ Plastic' : '✅ Clean'}</span></td>
                  <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{new Date(d.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
