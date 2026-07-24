import { motion } from 'framer-motion';

export default function AICorePage({ isDark }) {
  const predictions = [
    { device: 'Router-01', issue: 'CPU overload predicted', confidence: 87, time: '2 hours' },
    { device: 'Server-03', issue: 'Memory leak detected', confidence: 92, time: '4 hours' },
    { device: 'AP-05', issue: 'Signal interference expected', confidence: 65, time: '6 hours' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ padding: '24px', marginLeft: '240px' }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: isDark ? 'white' : '#1a1a2e', marginBottom: '8px' }}>
        🧠 AI Core
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>AI predictions and analytics</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {predictions.map((pred, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5, scale: 1.02 }}
            style={{
              background: isDark ? 'rgba(30,30,60,0.8)' : 'white',
              borderRadius: '16px',
              padding: '24px',
              border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e5e7eb'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: isDark ? 'white' : '#1a1a2e' }}>{pred.device}</div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>{pred.issue}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: pred.confidence > 80 ? '#22c55e' : '#eab308' }}>
                  {pred.confidence}%
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>in {pred.time}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
