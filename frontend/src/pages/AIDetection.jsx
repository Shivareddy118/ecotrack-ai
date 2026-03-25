import React, { useState, useRef } from 'react';
import axios from 'axios';

const PLASTIC_KEYWORDS = ['plastic', 'bottle', 'container', 'cup', 'bag', 'wrapper', 'packaging', 'water bottle', 'soda bottle', 'straw', 'utensil', 'styrofoam', 'polystyrene', 'polyethylene'];

export default function AIDetection() {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [logged, setLogged] = useState(false);
  const fileInputRef = useRef();
  const imgRef = useRef();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setResult(null); setError(''); setLogged(false);
    const url = URL.createObjectURL(file);
    setImageURL(url);
  };

  const runDetection = async () => {
    if (!image) return;
    setLoading(true); setModelLoading(true); setError(''); setResult(null);
    try {
      // Load TensorFlow.js and MobileNet
      const tf = await import('@tensorflow/tfjs');
      setModelLoading(false);
      const mobilenet = await import('@tensorflow-models/mobilenet');
      const model = await mobilenet.load();

      const imgElement = imgRef.current;
      const predictions = await model.classify(imgElement);

      const topPrediction = predictions[0];
      const label = topPrediction.className.toLowerCase();
      const confidence = Math.round(topPrediction.probability * 100);
      const isPlastic = PLASTIC_KEYWORDS.some(kw => label.includes(kw));

      setResult({ label: topPrediction.className, confidence, isPlastic, allPredictions: predictions });

      // Log to backend
      try {
        await axios.post('/api/admin/plastic-detected', {
          label: topPrediction.className, confidence, isPlastic
        });
        setLogged(true);
      } catch (logErr) { console.warn('Log failed:', logErr.message); }

    } catch (err) {
      setError('AI model failed to load. Make sure TensorFlow.js packages are installed: ' + err.message);
    } finally { setLoading(false); setModelLoading(false); }
  };

  return (
    <div className="page-container fade-in">
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#e2e8f0' }}>🤖 AI Plastic Detection</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>Upload an image to detect plastic waste using MobileNet AI</p>
      </div>

      <div className="grid-2">
        <div className="glass" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>📤 Upload Waste Image</h3>

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed rgba(34,197,94,0.3)', borderRadius: '16px', padding: '40px 20px',
              textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s',
              background: imageURL ? 'transparent' : 'rgba(34,197,94,0.03)',
              marginBottom: '20px'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(34,197,94,0.6)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)'}
          >
            {imageURL ? (
              <img ref={imgRef} src={imageURL} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '240px', borderRadius: '10px', objectFit: 'contain' }} crossOrigin="anonymous" />
            ) : (
              <>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🗑️</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Click to upload waste image</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '6px' }}>PNG, JPG, WEBP supported</div>
              </>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />

          {error && <div className="error-msg">{error}</div>}

          <button className="btn-primary" onClick={runDetection} disabled={!image || loading}>
            {modelLoading ? '⏳ Loading AI Model...' : loading ? '🔍 Analyzing...' : '🤖 Detect Plastic'}
          </button>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
              {modelLoading ? 'Loading MobileNet model (~20MB)...' : 'Running classification...'}
            </div>
          )}
        </div>

        <div>
          {result ? (
            <div className="glass" style={{ padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#e2e8f0' }}>🔍 Detection Results</h3>

              <div style={{ padding: '20px', borderRadius: '14px', background: result.isPlastic ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `2px solid ${result.isPlastic ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, marginBottom: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '8px' }}>{result.isPlastic ? '🚨' : '✅'}</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: result.isPlastic ? '#fca5a5' : '#86efac' }}>
                  {result.isPlastic ? 'PLASTIC DETECTED!' : 'Not Plastic'}
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginTop: '6px' }}>
                  {result.isPlastic ? '⚠️ This item should not be used' : '♻️ This appears safe'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>DETECTED LABEL</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>{result.label}</div>
                </div>
                <div style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>CONFIDENCE</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e' }}>{result.confidence}%</div>
                </div>
              </div>

              {logged && (
                <div className="success-msg">✅ Detection logged to database successfully</div>
              )}

              <div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginBottom: '10px' }}>All Predictions:</div>
                {result.allPredictions?.map((p, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{p.className}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${p.probability * 100}%`, background: i === 0 ? '#22c55e' : '#3b82f6', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', width: '35px' }}>{Math.round(p.probability * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass" style={{ padding: '24px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#e2e8f0' }}>ℹ️ About AI Detection</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: '1.7' }}>
                This module uses <strong style={{ color: '#86efac' }}>TensorFlow.js + MobileNet</strong> to classify waste images directly in your browser — no data sent to external servers.
              </p>
              <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Upload any waste/trash image', 'AI analyzes in real-time in browser', 'Plastic items flagged automatically', 'Detection logged to MongoDB', 'Contributes to campus analytics'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="glass" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '14px', color: '#e2e8f0' }}>🎯 Detectable Items</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['Plastic Bottles', 'Plastic Bags', 'Styrofoam', 'Plastic Cups', 'Food Wrappers', 'Straws', 'Containers', 'Packaging'].map(item => (
                <span key={item} className="badge badge-green">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
