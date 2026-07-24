import { useState } from 'react';
import GlassCard from '../components/GlassCard';

export default function Settings({ isDark, toggleDark }) {
  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      <h2 style={{ color: 'white' }}>⚙️ Settings</h2>
      <GlassCard style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'white' }}>🌙 Dark Theme</span>
          <button onClick={toggleDark} style={{
            padding: '4px 16px', borderRadius: '20px', border: 'none',
            background: isDark ? 'rgba(99,102,241,0.6)' : 'rgba(255,255,255,0.1)',
            color: isDark ? 'white' : 'rgba(255,255,255,0.6)',
            cursor: 'pointer'
          }}>{isDark ? 'On' : 'Off'}</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ color: 'white' }}>🔄 WebSocket</span>
          <span style={{ color: '#22c55e' }}>Connected</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
          <span style={{ color: 'white' }}>🔔 Notifications</span>
          <span style={{ color: '#22c55e' }}>On</span>
        </div>
      </GlassCard>
    </div>
  );
}
