import { useState, useEffect } from 'react';

function NetworkManager() {
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/network/status')
      .then(res => res.json())
      .then(data => {
        setInterfaces(data.interfaces || []);
        setLoading(false);
      })
      .catch(() => {
        setInterfaces([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading network manager...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white' }}>📡 Network Manager</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>Manage your network interfaces.</p>
      <div style={{ display: 'grid', gap: '12px' }}>
        {interfaces.map(iface => (
          <div key={iface.name} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '600', color: 'white' }}>{iface.name}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{iface.ip || 'No IP'} • {iface.speed_mbps || 0} Mbps</div>
            </div>
            <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '11px', background: iface.status === 'online' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: iface.status === 'online' ? '#22c55e' : '#ef4444' }}>{iface.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NetworkManager;
