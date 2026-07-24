import Sidebar from './sidebar/Sidebar';

export default function Layout({ children, isDark, setIsDark, onLogout }) {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: isDark ? '#0a0a1a' : '#f5f7fb',
      fontFamily: 'Segoe UI, system-ui, sans-serif'
    }}>
      <Sidebar isDark={isDark} onLogout={onLogout} />
      
      <div style={{
        marginLeft: '240px',
        flex: 1,
        minHeight: '100vh'
      }}>
        {/* Top Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '16px',
          padding: '12px 24px',
          background: isDark ? 'rgba(20,20,40,0.5)' : 'rgba(255,255,255,0.5)',
          backdropFilter: 'blur(10px)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: isDark ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
              color: isDark ? 'white' : '#1a1a2e',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <span style={{ color: isDark ? '#6b6b8d' : '#999', fontSize: '13px' }}>
            👋 Welcome, <strong style={{ color: isDark ? 'white' : '#1a1a2e' }}>Haseeb</strong>
          </span>
        </div>

        {/* Page Content */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
