const ITEMS = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'network', icon: '🕸️', label: 'Network' },
  { id: 'ai-core', icon: '🧠', label: 'AI Core' },
  { id: 'healing', icon: '🔄', label: 'Self-Healing' },
  { id: 'team', icon: '👥', label: 'Team' },
  { id: 'reports', icon: '📈', label: 'Reports' },
  { id: 'network-manager', icon: '📶', label: 'Network Manager' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar({ activePage, setActivePage, onLogout }) {
  return (
    <div style={{
      width: '220px',
      height: '100vh',
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(0,0,0,0.04)',
      padding: '24px 12px',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      boxShadow: '2px 0 20px rgba(0,0,0,0.03)'
    }}>
      <div style={{ padding: '0 8px', marginBottom: '32px' }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: '#1a1a2e' }}>🧠 NetMind AI</div>
        <div style={{ fontSize: '10px', color: 'rgba(0,0,0,0.3)', letterSpacing: '2px', textTransform: 'uppercase' }}>Network Ops Center</div>
      </div>
      <nav style={{ flex: 1 }}>
        {ITEMS.map(item => (
          <div
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 16px', borderRadius: '10px', cursor: 'pointer',
              marginBottom: '2px', fontSize: '14px', fontWeight: '500',
              transition: 'all 0.2s',
              color: activePage === item.id ? '#4f46e5' : 'rgba(0,0,0,0.5)',
              background: activePage === item.id ? 'rgba(99,102,241,0.08)' : 'transparent',
              border: activePage === item.id ? '1px solid rgba(99,102,241,0.15)' : '1px solid transparent'
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.04)', paddingTop: '16px' }}>
        <div onClick={onLogout} style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '11px 16px', borderRadius: '10px', cursor: 'pointer',
          color: '#dc2626', fontSize: '14px', fontWeight: '500'
        }}>
          <span>🚪</span><span>Logout</span>
        </div>
      </div>
    </div>
  );
}