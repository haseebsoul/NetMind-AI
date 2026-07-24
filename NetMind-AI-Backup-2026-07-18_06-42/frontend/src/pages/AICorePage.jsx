import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';

export default function AICore() {
  const [devices, setDevices] = useState([]);
  const [recommend, setRecommend] = useState(null);
  useEffect(() => {
    fetch('http://localhost:8000/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(() => []);
    fetch('http://localhost:8000/ai/recommend')
      .then(res => res.json())
      .then(data => setRecommend(data))
      .catch(() => null);
  }, []);
  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      <h2 style={{ color: 'white' }}>🧠 AI Core</h2>
      {recommend && (
        <GlassCard style={{ border: '1px solid rgba(99,102,241,0.3)' }}>
          <div style={{ color: 'white' }}>🤖 {recommend.recommendation}</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{recommend.reason}</div>
        </GlassCard>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: '16px', marginTop: '16px' }}>
        <GlassCard><div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Prediction Accuracy</div><div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>97.8%</div></GlassCard>
        <GlassCard><div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Self-Heals</div><div style={{ fontSize: '24px', fontWeight: '700', color: '#818cf8' }}>1,247</div></GlassCard>
      </div>
    </div>
  );
}
