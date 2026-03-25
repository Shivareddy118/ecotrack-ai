import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Vendor QR data simulation
const SAMPLE_VENDORS = [
  { id: 'VENDOR_001', name: '☕ Campus Café' },
  { id: 'VENDOR_002', name: '🍕 Food Court Central' },
  { id: 'VENDOR_003', name: '🥗 Green Bowl Restaurant' },
  { id: 'VENDOR_004', name: '🧃 Juice Bar' },
];

export default function QRScan() {
  const { user, updateUser } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(SAMPLE_VENDORS[0]);
  const fileInputRef = useRef();

  const processQRScan = async (vendorId, vendorName) => {
    setLoading(true); setError(''); setResult(null);
    try {
      const { data } = await axios.post('/api/transaction/scan', { vendorId, vendorName });
      setResult(data);
      updateUser({ greenCredits: data.user.greenCredits, plasticAvoided: data.user.plasticAvoided });
    } catch (err) {
      setError(err.response?.data?.message || 'Scan failed');
    } finally { setLoading(false); }
  };

  const handleSimulateScan = () => {
    processQRScan(selectedVendor.id, selectedVendor.name);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate QR decode from image
      const vendor = SAMPLE_VENDORS[Math.floor(Math.random() * SAMPLE_VENDORS.length)];
      processQRScan(vendor.id, vendor.name);
    }
  };

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0' }}>📷 QR Code Scanner</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Scan vendor QR codes to earn Green Credits</p>
      </div>

      <div className="grid-2">
        <div className="glass" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>🏪 Select Vendor & Scan</h3>

          <div className="form-group">
            <label>Choose Vendor</label>
            <select value={selectedVendor.id} onChange={e => setSelectedVendor(SAMPLE_VENDORS.find(v => v.id === e.target.value))}>
              {SAMPLE_VENDORS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>

          {error && <div className="error-msg">{error}</div>}
          {result && (
            <div className="success-msg" style={{ fontSize: '15px' }}>
              <strong>{result.message}</strong><br/>
              <span style={{ fontSize: '13px' }}>Total Credits: {result.user.greenCredits} | Plastic Avoided: {result.user.plasticAvoided}</span>
            </div>
          )}

          <button className="btn-primary" onClick={handleSimulateScan} disabled={loading} style={{ marginBottom: '12px' }}>
            {loading ? '⏳ Processing...' : '📷 Simulate QR Scan'}
          </button>

          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', marginBottom: '12px', fontSize: '13px' }}>— or —</div>

          <button className="btn-secondary" onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '12px' }}>
            📤 Upload QR Image
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />

          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '16px', textAlign: 'center', lineHeight: '1.6' }}>
            In production, use a camera-based QR reader (react-qr-reader). Here we simulate the QR scan flow with vendor selection for demo purposes.
          </p>
        </div>

        <div>
          <div className="glass" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#e2e8f0' }}>🎯 How It Works</h3>
            {[
              { step: '1', title: 'Vendor Displays QR Code', desc: 'Each vendor has a unique QR code at their counter', icon: '🏪' },
              { step: '2', title: 'Student Scans QR', desc: 'Use this scanner when you use a reusable container', icon: '📱' },
              { step: '3', title: 'Earn Green Credits', desc: '+10 credits credited to your account instantly', icon: '💚' },
              { step: '4', title: 'Track Your Impact', desc: 'See how much plastic you\'ve helped avoid', icon: '📊' },
            ].map(s => (
              <div key={s.step} style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'flex-start' }}>
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>{s.step}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: '#e2e8f0' }}>{s.icon} {s.title}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#e2e8f0' }}>Your Progress 🌍</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#22c55e' }}>{user?.greenCredits || 0}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Green Credits</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', padding: '16px', background: 'rgba(59,130,246,0.1)', borderRadius: '12px' }}>
                <div style={{ fontSize: '32px', fontWeight: 800, color: '#3b82f6' }}>{user?.plasticAvoided || 0}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>Bottles Avoided</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass" style={{ padding: '24px', marginTop: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#e2e8f0' }}>🏪 Campus Vendor QR Codes</h3>
        <div className="grid-4">
          {SAMPLE_VENDORS.map(v => (
            <div key={v.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>
                <svg width="80" height="80" viewBox="0 0 80 80" style={{ display: 'block', margin: '0 auto 8px' }}>
                  {/* Simple QR-like visual */}
                  {[0,1,2].map(r => [0,1,2].map(c => (
                    <rect key={`${r}-${c}`} x={5+c*25} y={5+r*25} width="20" height="20" fill={Math.random() > 0.5 ? '#22c55e' : 'rgba(255,255,255,0.1)'} rx="2" />
                  )))}
                </svg>
              </div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#e2e8f0' }}>{v.name}</div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>{v.id}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
