import { useState } from 'react';
import { motion } from 'framer-motion';
import NetworkTopology from '../components/network/NetworkTopology';

export default function NetworkPage({ isDark }) {
  const [devices] = useState([
    { id: 1, name: 'Router-01', ip: '192.168.1.1', status: 'online', cpu: 45, latency: 10, uptime: '12d', type: 'router' },
    { id: 2, name: 'Switch-02', ip: '192.168.1.2', status: 'online', cpu: 30, latency: 7, uptime: '8d', type: 'switch' },
    { id: 3, name: 'Server-03', ip: '192.168.1.3', status: 'warning', cpu: 85, latency: 17, uptime: '30d', type: 'server' },
    { id: 4, name: 'Firewall-04', ip: '192.168.1.4', status: 'online', cpu: 25, latency: 5, uptime: '20d', type: 'firewall' },
    { id: 5, name: 'AP-05', ip: '192.168.1.5', status: 'warning', cpu: 70, latency: 35, uptime: '2d', type: 'access-point' },
    { id: 6, name: 'Gateway-06', ip: '192.168.1.6', status: 'online', cpu: 20, latency: 6, uptime: '15d', type: 'gateway' },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ padding: '24px', marginLeft: '240px' }}
    >
      <h1 style={{ fontSize: '24px', fontWeight: '700', color: isDark ? 'white' : '#1a1a2e', marginBottom: '8px' }}>
        🕸️ Network Topology
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Interactive network visualization</p>
      
      <NetworkTopology 
        devices={devices} 
        isDark={isDark} 
        onDeviceSelect={(device) => {
          if (device) {
            alert('📡 ' + device.name + '\nStatus: ' + device.status + '\nIP: ' + device.ip + '\nCPU: ' + device.cpu + '%\nLatency: ' + device.latency + 'ms');
          }
        }}
      />
    </motion.div>
  );
}
