import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#eab308', '#ef4444'];
const DAY_NAMES = ['', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, lbRes] = await Promise.all([
          axios.get('/api/admin/plastic-stats'),
          axios.get('/api/admin/leaderboard')
        ]);
        setStats(statsRes.data);
        setLeaderboard(lbRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading" style={{ minHeight: '60vh' }}><div className="spinner"></div> Loading analytics...</div>;

  const weeklyChartData = stats?.weeklyData?.map(d => ({
    day: DAY_NAMES[d._id] || d._id,
    transactions: d.count,
    credits: d.credits
  })) || [];

  const pieData = [
    { name: 'Plastic Detected', value: stats?.plasticDetections || 0 },
    { name: 'Non-Plastic', value: (stats?.totalDetections || 0) - (stats?.plasticDetections || 0) },
  ].filter(d => d.value > 0);

  const adminStats = [
    { icon: '🚨', label: 'Plastic Detected', value: stats?.plasticDetections || 0, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    { icon: '♻️', label: 'Plastic Avoided', value: stats?.totalPlasticAvoided || 0, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { icon: '🌱', label: 'Total Credits Issued', value: stats?.totalCreditsIssued || 0, color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { icon: '📊', label: 'Total Scans', value: stats?.totalTransactions || 0, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  ];

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0' }}>⚙️ Admin Analytics</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Sustainability Officer Dashboard</p>
        </div>
        <span className="badge badge-blue">Sustainability Officer</span>
      </div>

      <div className="grid-4" style={{ marginBottom: '24px' }}>
        {adminStats.map(s => (
          <div className="stat-card" key={s.label} style={{ borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{s.icon}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color }}>{s.value.toLocaleString()}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '24px' }}>
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>📅 Weekly Transaction Activity</h3>
          {weeklyChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} />
                <Tooltip contentStyle={{ background: '#1a2335', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
                <Bar dataKey="transactions" fill="#22c55e" radius={[4,4,0,0]} name="Transactions" />
                <Bar dataKey="credits" fill="#3b82f6" radius={[4,4,0,0]} name="Credits" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '60px 0' }}>No weekly data yet</div>
          )}
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>🔍 AI Detection Breakdown</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a2335', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e2e8f0' }} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '60px 0' }}>No detection data yet</div>
          )}
        </div>
      </div>

      <div className="grid-2">
        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>🏆 Top Contributors</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {leaderboard.slice(0, 5).map((u, i) => (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: 'white', flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#e2e8f0' }}>{u.name}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>{u.plasticAvoided} bottles avoided</div>
                </div>
                <div style={{ fontWeight: 700, color: '#22c55e', fontSize: '16px' }}>{u.greenCredits} 🌱</div>
              </div>
            ))}
            {leaderboard.length === 0 && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '20px 0' }}>No users yet</div>}
          </div>
        </div>

        <div className="glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>🗑️ Recent Waste Detections</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {stats?.recentWaste?.slice(0, 5).map((w) => (
              <div key={w._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#e2e8f0' }}>{w.label}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>by {w.userId?.name || 'Unknown'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge ${w.isPlastic ? 'badge-yellow' : 'badge-green'}`}>{w.isPlastic ? '⚠️ Plastic' : '✅ Safe'}</span>
                </div>
              </div>
            ))}
            {(!stats?.recentWaste || stats.recentWaste.length === 0) && (
              <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '20px 0' }}>No detections yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
