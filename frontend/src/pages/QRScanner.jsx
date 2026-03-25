import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

// Vendor list for demo
const VENDORS = [
  { id: 'VENDOR_001', name: '☕ Campus Café', qrData: 'ECOTRACK:VENDOR_001:Campus Cafe' },
  { id: 'VENDOR_002', name: '🍽️ Main Canteen', qrData: 'ECOTRACK:VENDOR_002:Main Canteen' },
  { id: 'VENDOR_003', name: '🥤 Juice Bar', qrData: 'ECOTRACK:VENDOR_003:Juice Bar' },
  { id: 'VENDOR_004', name: '🍱 Food Court', qrData: 'ECOTRACK:VENDOR_004:Food Court' },
];

export default function QRScanner() {
  const { API, refreshUser } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [manualVendor, setManualVendor] = useState('');
  const fileInputRef = useRef();

  const processQRData = async (qrData) => {
    setError('');
    setLoading(true);
    try {
      // Parse QR: format ECOTRACK:VENDOR_ID:VendorName
      let vendorId, vendorName;
      if (qrData.startsWith('ECOTRACK:')) {
        const parts = qrData.split(':');
        vendorId = parts[1];
        vendorName = parts[2] || 'Campus Vendor';
      } else {
        vendorId = qrData;
        vendorName = 'Campus Vendor';
      }

      const res = await API.post('/transaction/scan', { vendorId, vendorName });
      setResult(res.data);
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  const handleManualScan = async (vendor) => {
    setResult(null);
    await processQRData(vendor.qrData);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // In a real app, would decode QR from image
    // For demo, we just use filename or a mock vendor
    setResult(null);
    processQRData('ECOTRACK:VENDOR_001:Uploaded QR Vendor');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">📷 QR Code Scanner</h1>
        <p className="page-subtitle">Scan vendor QR codes to earn Green Credits for using reusable containers</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {result && (
        <div className="alert alert-success" style={{ padding: 24, borderRadius: 16 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Scan Successful!</h3>
          <p style={{ marginBottom: 4 }}>{result.message}</p>
          <p style={{ fontSize: 13, opacity: 0.7 }}>Vendor: {result.transaction?.vendorName}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <div style={{ textAlign: 'center', background: 'rgba(0,200,150,0.1)', padding: '12px 20px', borderRadius: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#00c896' }}>+{result.transaction?.creditsEarned}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Green Credits</div>
            </div>
            <div style={{ textAlign: 'center', background: 'rgba(108,99,255,0.1)', padding: '12px 20px', borderRadius: 12 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#a78bfa' }}>{result.user?.greenCredits}</div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Total Credits</div>
            </div>
          </div>
          <button className="btn-secondary" style={{ marginTop: 16 }} onClick={() => setResult(null)}>Scan Another</button>
        </div>
      )}

      <div className="grid-2">
        {/* Demo Vendor QR Codes */}
        <div className="glass-card" style={{ padding: 28 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Campus Vendor QR Codes</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 24 }}>Click any vendor to simulate scanning their QR code</p>

          <div style={{ display: 'grid', gap: 12 }}>
            {VENDORS.map(vendor => (
              <button
                key={vendor.id}
                onClick={() => handleManualScan(vendor)}
                disabled={loading}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, cursor: 'pointer', color: 'white', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#00c896'; e.currentTarget.style.background = 'rgba(0,200,150,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              >
                <span style={{ fontSize: 15, fontWeight: 600 }}>{vendor.name}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className="badge badge-green">+10 credits</span>
                  <span style={{ fontSize: 20 }}>📱</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload QR / How it works */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Upload QR Image</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 20 }}>Upload a QR code image to scan</p>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
            <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => fileInputRef.current.click()}>
              📁 Upload QR Image
            </button>
            {loading && <div className="spinner" style={{ margin: '16px auto' }} />}
          </div>

          <div className="glass-card" style={{ padding: 28, background: 'linear-gradient(135deg, rgba(0,200,150,0.08), rgba(108,99,255,0.08))' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>How It Works</h3>
            {[
              { step: '1', text: 'Get a reusable container from the vendor', icon: '🫙' },
              { step: '2', text: "Scan the vendor's QR code", icon: '📷' },
              { step: '3', text: 'Earn 10 Green Credits per scan', icon: '🌿' },
              { step: '4', text: 'Redeem credits for campus rewards', icon: '🎁' },
            ].map(item => (
              <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,200,150,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#00c896', flexShrink: 0 }}>
                  {item.step}
                </div>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{item.icon} {item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
