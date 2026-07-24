import NetworkTopology from '../components/network/NetworkTopology';
import { useState, useEffect } from 'react';

export default function Network() {
  const [devices, setDevices] = useState([]);
  useEffect(() => {
    fetch('http://localhost:8000/devices')
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(() => []);
  }, []);
  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      <h2 style={{ color: 'white' }}>🕸️ Network Topology</h2>
      <p style={{ color: 'rgba(255,255,255,0.3)' }}>Click a device for details</p>
      <NetworkTopology devices={devices} />
    </div>
  );
}
