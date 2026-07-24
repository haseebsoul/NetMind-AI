import { motion } from 'framer-motion';

export default function ReportsPage({ isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ padding: '24px', marginLeft: '240px' }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: isDark ? 'white' : '#1a1a2e', marginBottom: '8px' }}>
        📈 Reports
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Network reports and analytics</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {[
          { title: 'Network Health Report', desc: 'Overall network health summary', icon: '🏥', color: '#22c55e' },
          { title: 'Device Performance', desc: 'CPU, Memory, Latency metrics', icon: '⚡', color: '#6366f1' },
          { title: 'Security Audit', desc: 'Security events and threats', icon: '🛡️', color: '#ef4444' },
          { title: 'Traffic Analysis', desc: 'Network traffic patterns', icon: '📊', color: '#eab308' }
        ].map((report, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              background: isDark ? 'rgba(30,30,60,0.8)' : 'white',
              borderRadius: '16px',
              padding: '24px',
              border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e5e7eb',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>{report.icon}</div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: isDark ? 'white' : '#1a1a2e' }}>{report.title}</h3>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>{report.desc}</p>
            <button style={{
              marginTop: '12px',
              padding: '6px 16px',
              borderRadius: '8px',
              border: 'none',
              background: report.color,
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Generate Report
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
