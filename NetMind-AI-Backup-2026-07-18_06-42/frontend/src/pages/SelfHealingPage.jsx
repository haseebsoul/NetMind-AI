import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';

export default function SelfHealing() {
  const [devices, setDevices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [healing, setHealing] = useState(null);
  const [progress, setProgress] = useState(0);

  const fetchDevices = () => {
    fetch('http://localhost:8000/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(() => []);
  };

  useEffect(() => { fetchDevices(); }, []);

  const healDevice = (id) => {
    if (healing) return;
    setHealing(id);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          fetch('http://localhost:8000/heal/' + id, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
              setLogs(prev => [{ device: devices.find(d => d.id === id)?.name || '', action: data.message, time: new Date().toLocaleTimeString() }, ...prev]);
              fetchDevices();
              setHealing(null);
            });
          return 100;
        }
        return p + 10;
      });
    }, 300);
  };

  const failDevice = (id) => {
    fetch('http://localhost:8000/simulate/failure/' + id, { method: 'POST' })
      .then(() => fetchDevices());
  };

  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      <h2 style={{ color: 'white' }}>🔄 Self-Healing</h2>
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        {devices.map(d => (
          <GlassCard key={d.id} style={{ border: '2px solid ' + (d.status === 'online' ? '#22c55e' : d.status === 'warning' ? '#eab308' : '#ef4444') }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><div style={{ color: 'white', fontWeight: '600' }}>{d.name}</div><div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{d.ip}</div></div>
              <span style={{
                padding: '2px 10px', borderRadius: '12px', fontSize: '11px',
                background: d.status === 'online' ? 'rgba(34,197,94,0.2)' : d.status === 'warning' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
                color: d.status === 'online' ? '#22c55e' : d.status === 'warning' ? '#eab308' : '#ef4444'
              }}>{d.status}</span>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
              {d.status !== 'online' && (
                <button onClick={() => healDevice(d.id)} style={{
                  padding: '6px 16px', borderRadius: '6px', border: 'none', background: 'rgba(99,102,241,0.8)', color: 'white', cursor: 'pointer'
                }}>🔧 Heal</button>
              )}
              <button onClick={() => failDevice(d.id)} style={{
                padding: '6px 16px', borderRadius: '6px', border: 'none', background: 'rgba(239,68,68,0.6)', color: 'white', cursor: 'pointer'
              }}>💥 Fail</button>
            </div>
            {healing === d.id && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ width: progress + '%', height: '100%', background: '#818cf8', transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#818cf8', marginTop: '4px' }}>Healing... {progress}%</div>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
      <h3 style={{ color: 'white', fontSize: '16px' }}>📋 Healing Logs</h3>
      <GlassCard style={{ maxHeight: '150px', overflowY: 'auto' }}>
        {logs.length === 0 ? <div style={{ color: 'rgba(255,255,255,0.3)' }}>No logs yet</div> : logs.map((l, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < logs.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
            <span style={{ color: 'white' }}>{l.device}</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>{l.action}</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{l.time}</span>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
