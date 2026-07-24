import { useState, useEffect } from 'react';

function HomePage() {
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/network/status')
      .then(res => {
        if (!res.ok) throw new Error('Network response not ok');
        return res.json();
      })
      .then(data => {
        setInterfaces(data.interfaces || []);
        setLoading(false);
      })
      .catch(err => {
        console.warn('Backend not reachable, using fallback data:', err);
        setError('Backend not available – showing fallback data');
        setInterfaces([
          { name: 'Wi-Fi', status: 'online', signal: 85 },
          { name: 'Ethernet', status: 'online', signal: 95 },
          { name: 'Local Area Connection', status: 'online', signal: 75 },
          { name: 'Bluetooth', status: 'offline', signal: 0 },
        ]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ padding: '20px', color: '#fff', background: '#0a0a1a', minHeight: '100vh' }}>⏳ Loading...</div>;
  }

  const total = interfaces.length;
  const online = interfaces.filter(i => i.status === 'online').length;
  const warning = interfaces.filter(i => i.status === 'warning').length;
  const offline = interfaces.filter(i => i.status === 'offline').length;
  const avgSignal = interfaces.filter(i => i.signal > 0).reduce((sum, i) => sum + i.signal, 0) / (interfaces.filter(i => i.signal > 0).length || 1);
  const health = total > 0 ? Math.round((online / total) * 100) : 0;

  return (
    <div style={{ padding: '20px', color: '#fff', background: '#0a0a1a', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '8px', color: '#fff' }}>🏠 Home</h2>
      {error && <p style={{ color: '#eab308' }}>⚠️ {error}</p>}
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
        Network summary – {total} interfaces • {online} online • {health}% health
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>🖥️</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Total Interfaces</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff' }}>{total}</div>
        </div>
        <div style={{ padding: '20px', background: 'rgba(34,197,94,0.06)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>✅</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Online</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>{online}</div>
        </div>
        <div style={{ padding: '20px', background: 'rgba(234,179,8,0.06)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>⚠️</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Warnings</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#eab308' }}>{warning}</div>
        </div>
        <div style={{ padding: '20px', background: 'rgba(239,68,68,0.06)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>🔴</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Offline</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#ef4444' }}>{offline}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div style={{ padding: '20px', background: 'rgba(99,102,241,0.06)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>🧠</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>AI Status</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#818cf8' }}>Active</div>
        </div>
        <div style={{ padding: '20px', background: 'rgba(34,197,94,0.06)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>📊</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Network Health</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: health >= 80 ? '#22c55e' : health >= 60 ? '#eab308' : '#ef4444' }}>{health}%</div>
        </div>
        <div style={{ padding: '20px', background: 'rgba(99,102,241,0.06)', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '28px' }}>📡</div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Avg Signal</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#818cf8' }}>{Math.round(avgSignal)}%</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
