import { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [recommend, setRecommend] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/devices')
      .then(res => res.json())
      .then(data => {
        setDevices(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch('http://localhost:8000/ai/recommend')
      .then(res => res.json())
      .then(data => setRecommend(data))
      .catch(() => {});
  }, []);

  const online = devices.filter(d => d.status === 'online').length;
  const warnings = devices.filter(d => d.status === 'warning').length;
  const offline = devices.filter(d => d.status === 'offline').length;

  const getDeviceLabel = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('wi-fi') || lower.includes('wifi')) return 'Your wireless internet connection';
    if (lower.includes('ethernet')) return 'Wired cable — fastest and most stable';
    if (lower.includes('local area connection* 12')) return 'Your mobile hotspot — sharing phone data';
    if (lower.includes('local area connection* 11')) return 'Virtual adapter — currently inactive';
    if (lower.includes('loopback')) return 'Internal system loopback — not a real network';
    if (lower.includes('bluetooth')) return 'Bluetooth network — low speed, rarely used';
    return 'Network interface on your laptop';
  };

  const getBorderColor = (status) => {
    if (status === 'online') return '#22c55e';
    if (status === 'warning') return '#eab308';
    return '#ef4444';
  };

  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>

      {/* Welcome Banner */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.1)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: '12px',
        padding: '16px 24px',
        marginBottom: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <h2 style={{ color: 'white', margin: 0 }}>👋 Welcome, Haseeb</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: '4px 0 0' }}>
            Your network is <strong style={{ color: '#22c55e' }}>healthy</strong> — {online} of {devices.length} interfaces are online.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(34, 197, 94, 0.12)',
          borderRadius: '20px',
          border: '1px solid rgba(34, 197, 94, 0.15)'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22c55e',
            display: 'inline-block',
            animation: 'pulse 1.5s infinite'
          }} />
          <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: '500' }}>LIVE</span>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="stat-card blue">
          <div className="icon">🖥️</div>
          <div className="number">
            {devices.length}
            <span className="live-badge"><span className="dot" /> LIVE</span>
          </div>
          <div className="label">Total Interfaces</div>
          <div className="explanation">All network adapters detected on your laptop</div>
        </div>

        <div className="stat-card green">
          <div className="icon">✅</div>
          <div className="number">
            {online}
            <span className="live-badge"><span className="dot" /> LIVE</span>
          </div>
          <div className="label">Online</div>
          <div className="explanation">{online} connections are working fine right now</div>
        </div>

        <div className="stat-card yellow">
          <div className="icon">⚠️</div>
          <div className="number">
            {warnings}
            <span className="live-badge"><span className="dot" /> LIVE</span>
          </div>
          <div className="label">Warnings</div>
          <div className="explanation">{warnings} interface{warnings !== 1 ? 's are' : ' is'} showing unusual activity</div>
        </div>

        <div className="stat-card red">
          <div className="icon">🔴</div>
          <div className="number">
            {offline}
            <span className="live-badge"><span className="dot" /> LIVE</span>
          </div>
          <div className="label">Offline</div>
          <div className="explanation">{offline} interface{offline !== 1 ? 's are' : ' is'} disconnected</div>
        </div>
      </div>

      {/* Device List */}
      <GlassCard>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h3 style={{ color: 'white', margin: 0 }}>📋 Live Network Interfaces</h3>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            {devices.length} interfaces • <span className="live-badge"><span className="dot" /> REAL DATA</span>
          </span>
        </div>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading real interfaces...</p>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {devices.map(d => (
              <div key={d.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '10px',
                borderLeft: '4px solid ' + getBorderColor(d.status),
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                <div>
                  <div style={{ color: 'white', fontWeight: '500' }}>{d.name}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>
                    {d.ip || 'No IP'} • {getDeviceLabel(d.name)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '2px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: d.status === 'online' ? 'rgba(34,197,94,0.15)' :
                              d.status === 'warning' ? 'rgba(234,179,8,0.15)' :
                              'rgba(239,68,68,0.15)',
                    color: d.status === 'online' ? '#22c55e' :
                           d.status === 'warning' ? '#eab308' : '#ef4444'
                  }}>
                    {d.status}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
                    {d.speed_mbps ? `${d.speed_mbps} Mbps` : '—'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* AI Tip Box */}
      {recommend && (
        <div style={{
          marginTop: '24px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: '600', fontSize: '15px' }}>
              AI Tip: {recommend.recommendation}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>
              {recommend.reason}
            </div>
          </div>
          <span style={{
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'rgba(99, 102, 241, 0.2)',
            color: '#818cf8',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            REAL-TIME
          </span>
        </div>
      )}
    </div>
  );
}