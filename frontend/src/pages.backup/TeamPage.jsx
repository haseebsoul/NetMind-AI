import { motion } from 'framer-motion';

export default function TeamPage({ isDark }) {
  const teamMembers = [
    { id: 1, name: 'Haseeb Khan', role: 'Lead Developer', initials: 'HK', online: true, color: '#6366f1' },
    { id: 2, name: 'AI Assistant', role: 'Self-Healing Agent', initials: 'AI', online: true, color: '#8b5cf6' },
    { id: 3, name: 'Network Monitor', role: 'Anomaly Detection', initials: 'NM', online: true, color: '#22c55e' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ padding: '24px', marginLeft: '240px' }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: isDark ? 'white' : '#1a1a2e', marginBottom: '8px' }}>
        👥 Team Members
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Network operations team</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            style={{
              background: isDark ? 'rgba(30,30,60,0.8)' : 'white',
              borderRadius: '16px',
              padding: '24px',
              border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e5e7eb',
              textAlign: 'center'
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: member.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '28px',
                margin: '0 auto 12px'
              }}
            >
              {member.initials}
            </motion.div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: isDark ? 'white' : '#1a1a2e' }}>{member.name}</h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>{member.role}</p>
            <span style={{
              display: 'inline-block',
              marginTop: '8px',
              fontSize: '11px',
              color: member.online ? '#22c55e' : '#6b7280',
              background: member.online ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)',
              padding: '4px 14px',
              borderRadius: '12px'
            }}>
              {member.online ? '🟢 Online' : '⚪ Offline'}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
