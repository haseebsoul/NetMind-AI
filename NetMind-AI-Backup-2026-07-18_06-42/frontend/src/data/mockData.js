// Network Devices
export const devices = [
  { id: 1, name: 'Router-01', ip: '192.168.1.1', type: 'router', status: 'online', cpu: 45, memory: 60, latency: 10, uptime: '12d 4h', temperature: 42 },
  { id: 2, name: 'Switch-02', ip: '192.168.1.2', type: 'switch', status: 'online', cpu: 30, memory: 45, latency: 7, uptime: '8d 2h', temperature: 38 },
  { id: 3, name: 'Server-03', ip: '192.168.1.3', type: 'server', status: 'warning', cpu: 85, memory: 78, latency: 17, uptime: '30d 0h', temperature: 55 },
  { id: 4, name: 'Firewall-04', ip: '192.168.1.4', type: 'firewall', status: 'online', cpu: 25, memory: 35, latency: 5, uptime: '20d 6h', temperature: 35 },
  { id: 5, name: 'AP-05', ip: '192.168.1.5', type: 'access-point', status: 'warning', cpu: 70, memory: 55, latency: 35, uptime: '2d 12h', temperature: 48 },
  { id: 6, name: 'Gateway-06', ip: '192.168.1.6', type: 'gateway', status: 'online', cpu: 20, memory: 30, latency: 6, uptime: '15d 3h', temperature: 32 },
  { id: 7, name: 'Core-Switch-07', ip: '192.168.1.7', type: 'switch', status: 'online', cpu: 40, memory: 50, latency: 8, uptime: '25d 8h', temperature: 40 },
  { id: 8, name: 'DNS-08', ip: '192.168.1.8', type: 'server', status: 'online', cpu: 15, memory: 25, latency: 3, uptime: '18d 0h', temperature: 30 }
];

// AI Predictions
export const predictions = [
  { id: 1, device: 'Router-01', issue: 'CPU overload predicted', confidence: 87, time: '2 hours', severity: 'high' },
  { id: 2, device: 'Server-03', issue: 'Memory leak detected', confidence: 92, time: '4 hours', severity: 'critical' },
  { id: 3, device: 'AP-05', issue: 'Signal interference expected', confidence: 65, time: '6 hours', severity: 'medium' }
];

// Self-Healing Logs
export const healingLogs = [
  { id: 1, device: 'Router-01', action: 'Traffic redistributed', status: 'success', timestamp: '10:30 AM' },
  { id: 2, device: 'Server-03', action: 'Memory cache cleared', status: 'success', timestamp: '9:15 AM' },
  { id: 3, device: 'Firewall-04', action: 'Rule update applied', status: 'pending', timestamp: '8:00 AM' }
];

// Team Members
export const teamMembers = [
  { id: 1, name: 'Haseeb Khan', role: 'Lead Developer', avatar: '/avatars/haseeb.jpg', initials: 'HK', online: true },
  { id: 2, name: 'AI Assistant', role: 'Self-Healing Agent', avatar: '/avatars/ai.jpg', initials: 'AI', online: true },
  { id: 3, name: 'Network Monitor', role: 'Anomaly Detection', avatar: '/avatars/monitor.jpg', initials: 'NM', online: true }
];

// Alerts
export const alerts = [
  { id: 1, message: 'Server-03 CPU usage at 85%', severity: 'warning', time: '5:33 PM' },
  { id: 2, message: 'Unauthorized access attempt blocked', severity: 'critical', time: '4:50 PM' },
  { id: 3, message: 'AP-05 signal interference detected', severity: 'warning', time: '3:20 PM' },
  { id: 4, message: 'Router-01 packet loss below threshold', severity: 'info', time: '2:15 PM' }
];
