import { useState, useEffect } from 'react';

export default function NetworkManager() {
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('http://localhost:8000/devices')
      .then(res => res.json())
      .then(data => { setInterfaces(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);
  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      <h2 style={{ color: 'white' }}>📶 Network Manager</h2>
      <p style={{ color: 'rgba(255,255,255,0.3)' }}>Real interfaces from psutil</p>
      {loading ? <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p> : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {interfaces.map(iface => (
            <div key={iface.id} style={{
              background: 'rgba(255,255,255,0.05)',
              padding: '16px 20px',
              borderRadius: '12px',
              borderLeft: '4px solid ' + (iface.status === 'online' ? '#22c55e' : iface.status === 'warning' ? '#eab308' : '#ef4444')
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white', fontWeight: '600' }}>{iface.name}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{iface.ip || 'No IP'}</span>
                <span style={{
                  padding: '2px 10px', borderRadius: '12px', fontSize: '11px',
                  background: iface.status === 'online' ? 'rgba(34,197,94,0.2)' : iface.status === 'warning' ? 'rgba(234,179,8,0.2)' : 'rgba(239,68,68,0.2)',
                  color: iface.status === 'online' ? '#22c55e' : iface.status === 'warning' ? '#eab308' : '#ef4444'
                }}>{iface.status}</span>
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                {iface.speed_mbps ? iface.speed_mbps + ' Mbps' : '—'} • {iface.bytes_sent ? (iface.bytes_sent / 1024 / 1024).toFixed(1) + ' MB sent' : ''}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
