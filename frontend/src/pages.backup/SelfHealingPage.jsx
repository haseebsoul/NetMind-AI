import { useState } from 'react';
import { motion } from 'framer-motion';
import AISelfHealing from '../components/AISelfHealing';

export default function SelfHealingPage({ isDark }) {
  const [devices] = useState([
    { id: 1, name: 'Router-01', status: 'online' },
    { id: 2, name: 'Switch-02', status: 'online' },
    { id: 3, name: 'Server-03', status: 'warning' },
    { id: 4, name: 'Firewall-04', status: 'online' },
    { id: 5, name: 'AP-05', status: 'warning' },
    { id: 6, name: 'Gateway-06', status: 'online' },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ padding: '24px', marginLeft: '240px' }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: isDark ? 'white' : '#1a1a2e', marginBottom: '8px' }}>
        🔄 AI Self-Healing
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>AI-powered network recovery system</p>
      
      <AISelfHealing isDark={isDark} devices={devices} />
    </motion.div>
  );
}
