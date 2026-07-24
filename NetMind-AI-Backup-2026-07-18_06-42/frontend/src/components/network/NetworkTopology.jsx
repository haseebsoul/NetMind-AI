import { useState } from 'react';

export default function NetworkTopology({ devices }) {
  const [selected, setSelected] = useState(null);
  const getColor = (status) => {
    if (status === 'online') return '#22c55e';
    if (status === 'warning') return '#eab308';
    return '#ef4444';
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
      {devices.map(d => (
        <div key={d.id} onClick={() => setSelected(d)} style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '12px',
          borderRadius: '12px',
          border: '2px solid ' + getColor(d.status),
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s',
          transform: selected?.id === d.id ? 'scale(1.05)' : 'scale(1)'
        }}>
          <div style={{ fontSize: '20px' }}>{d.name}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{d.ip || 'No IP'}</div>
          <div style={{ fontSize: '11px', color: getColor(d.status) }}>{d.status}</div>
          {selected?.id === d.id && (
            <div style={{ marginTop: '8px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
              {d.speed_mbps ? d.speed_mbps + ' Mbps' : ''}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
