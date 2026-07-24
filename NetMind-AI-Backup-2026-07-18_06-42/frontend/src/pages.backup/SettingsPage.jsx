import { motion } from 'framer-motion';

export default function SettingsPage({ isDark, setIsDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ padding: '24px', marginLeft: '240px' }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: isDark ? 'white' : '#1a1a2e', marginBottom: '8px' }}>
        ⚙️ Settings
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Application settings</p>

      <div style={{
        background: isDark ? 'rgba(30,30,60,0.8)' : 'white',
        borderRadius: '16px',
        padding: '24px',
        border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e5e7eb',
        maxWidth: '600px'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: isDark ? 'white' : '#1a1a2e', marginBottom: '16px' }}>
          Theme Preferences
        </h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e5e7eb' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: isDark ? 'white' : '#1a1a2e' }}>Dark Mode</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>Toggle between light and dark theme</div>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              padding: '8px 20px',
              borderRadius: '10px',
              border: 'none',
              background: isDark ? 'rgba(99,102,241,0.2)' : '#f1f5f9',
              color: isDark ? '#818cf8' : '#1a1a2e',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
