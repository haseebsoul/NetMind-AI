import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState({ total: 0, online: 0, warning: 0 });

  useEffect(() => {
    const deviceNames = ['Router-01', 'Switch-02', 'Server-03', 'Firewall-04', 'AP-05', 'Gateway-06'];
    const statuses = ['online', 'online', 'online', 'warning', 'online', 'online'];
    
    const newDevices = deviceNames.map((name, i) => ({
      id: i + 1,
      name: name,
      ip: '192.168.1.' + (i + 1),
      status: statuses[i % statuses.length],
      cpu: Math.floor(Math.random() * 60) + 20,
      latency: Math.floor(Math.random() * 40) + 5
    }));
    
    setDevices(newDevices);
    
    const online = newDevices.filter(d => d.status === 'online').length;
    const warning = newDevices.filter(d => d.status === 'warning').length;
    setStats({ total: newDevices.length, online, warning });
  }, []);

  return (
    <div style={{ padding: '24px', marginLeft: '240px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>Network Operations Center</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Total Devices</div>
          <div style={{ fontSize: '32px', fontWeight: '700' }}>{stats.total}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Online</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#22c55e' }}>{stats.online}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>Warnings</div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#eab308' }}>{stats.warning}</div>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>📋 Network Devices</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Device</th>
                <th style={{ textAlign: 'left', padding: '10px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>IP</th>
                <th style={{ textAlign: 'left', padding: '10px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '10px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>CPU</th>
                <th style={{ textAlign: 'left', padding: '10px', color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>Latency</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>{device.name}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', color: '#6b7280' }}>{device.ip}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: device.status === 'online' ? 'rgba(34,197,94,0.1)' : 'rgba(234,179,8,0.1)',
                      color: device.status === 'online' ? '#22c55e' : '#eab308'
                    }}>
                      {device.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '4px', background: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ width: device.cpu + '%', height: '100%', background: device.cpu > 80 ? '#ef4444' : device.cpu > 60 ? '#eab308' : '#22c55e' }} />
                      </div>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>{device.cpu}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #f1f5f9', color: '#6b7280' }}>{device.latency}ms</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
