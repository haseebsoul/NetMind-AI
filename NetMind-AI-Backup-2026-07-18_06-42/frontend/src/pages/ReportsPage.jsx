import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';

export default function Reports() {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(() => []);
  }, []);
  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      <h2 style={{ color: 'white' }}>📈 Reports</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '16px' }}>
        <GlassCard><div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Network Health</div><div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>98%</div></GlassCard>
        <GlassCard><div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Devices</div><div style={{ fontSize: '24px', fontWeight: '700', color: '#818cf8' }}>{devices.length}</div></GlassCard>
        <GlassCard><div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Online</div><div style={{ fontSize: '24px', fontWeight: '700', color: '#22c55e' }}>{devices.filter(d => d.status === 'online').length}</div></GlassCard>
      </div>
      <GlassCard style={{ marginTop: '16px' }}>
        <div style={{ color: 'white', fontWeight: '600', marginBottom: '12px' }}>Device Health</div>
        {devices.map(d => (
          <div key={d.id} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}><span style={{ color: 'white' }}>{d.name}</span><span style={{ color: d.status === 'online' ? '#22c55e' : '#eab308' }}>{d.status}</span></div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ width: d.status === 'online' ? '100%' : '30%', height: '100%', background: d.status === 'online' ? '#22c55e' : '#eab308' }} />
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
