import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await axios.post('/api/auth/register', form);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌱</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #22c55e, #86efac)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Join EcoTrack AI</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '8px', fontSize: '15px' }}>Start your sustainability journey</p>
        </div>

        <div className="glass-strong" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px', color: '#e2e8f0' }}>Create Account</h2>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Smith" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="student@campus.edu" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Min 6 characters" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="student">🎓 Student</option>
                <option value="admin">⚙️ Sustainability Officer (Admin)</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '⏳ Creating account...' : '🚀 Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'rgba(255,255,255,0.4)' }}>
            Already have an account? <Link to="/login" style={{ color: '#86efac', textDecoration: 'none', fontWeight: 600 }}>Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
