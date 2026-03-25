import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await axios.post('/api/auth/login', form);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌿</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #22c55e, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EcoTrack AI</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontSize: '15px' }}>Plastic-Free Campus Ecosystem</p>
        </div>

        <div className="glass-strong" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#e2e8f0' }}>Welcome back 👋</h2>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="student@campus.edu" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '⏳ Logging in...' : '🔑 Login'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            No account? <Link to="/register" style={{ color: '#86efac', textDecoration: 'none', fontWeight: 600 }}>Register here</Link>
          </p>

          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(34,197,94,0.08)', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.15)' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '8px' }}>Demo Credentials:</p>
            <p style={{ fontSize: '12px', color: '#86efac' }}>Admin: admin@eco.com / admin123</p>
            <p style={{ fontSize: '12px', color: '#93c5fd' }}>Student: student@eco.com / student123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
