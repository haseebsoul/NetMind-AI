import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AISelfHealing({ isDark, devices }) {
  const [healingLogs, setHealingLogs] = useState([]);
  const [isHealing, setIsHealing] = useState(false);
  const [healingProgress, setHealingProgress] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomDevice = devices[Math.floor(Math.random() * devices.length)];
      if (randomDevice && randomDevice.status === 'warning') {
        triggerHealing(randomDevice);
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [devices]);

  const triggerHealing = (device) => {
    if (isHealing) return;
    setIsHealing(true);
    setSelectedDevice(device);
    setHealingProgress(0);

    const newLog = {
      id: Date.now(),
      device: device.name,
      issue: 'High CPU / Latency detected',
      action: 'Traffic redistribution initiated',
      status: 'in-progress',
      timestamp: new Date().toLocaleTimeString()
    };
    setHealingLogs(prev => [newLog, ...prev]);

    const progressInterval = setInterval(() => {
      setHealingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          completeHealing(device);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const completeHealing = (device) => {
    setHealingLogs(prev => 
      prev.map(log => 
        log.device === device.name && log.status === 'in-progress'
          ? { ...log, status: 'completed', action: '✅ Network restored successfully' }
          : log
      )
    );
    setIsHealing(false);
    setSelectedDevice(null);
    setHealingProgress(0);
  };

  const getStatusColor = (status) => {
    const colors = {
      'in-progress': '#eab308',
      'completed': '#22c55e',
      'failed': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  return (
    <div style={{
      width: '100%',
      background: isDark ? 'rgba(10,10,26,0.6)' : 'rgba(255,255,255,0.9)',
      borderRadius: '16px',
      border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e5e7eb',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: isDark ? 'white' : '#1a1a2e',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            🧠 AI Self-Healing
            {isHealing && (
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                style={{
                  fontSize: '10px',
                  color: '#eab308',
                  background: 'rgba(234,179,8,0.1)',
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontWeight: '500'
                }}
              >
                HEALING...
              </motion.span>
            )}
          </h4>
          <span style={{
            fontSize: '12px',
            color: '#6b7280'
          }}>
            {healingLogs.filter(l => l.status === 'completed').length} issues resolved • {healingLogs.filter(l => l.status === 'in-progress').length} in progress
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (devices.some(d => d.status === 'warning')) {
              const warningDevice = devices.find(d => d.status === 'warning');
triggerHealing(warningDevice);
            }
          }}
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            border: 'none',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          🔄 Run AI Scan
        </motion.button>
      </div>

      {isHealing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            marginBottom: '20px',
            padding: '16px 20px',
            background: isDark ? 'rgba(234,179,8,0.1)' : 'rgba(234,179,8,0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(234,179,8,0.2)'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{
              fontSize: '13px',
              fontWeight: '500',
              color: isDark ? 'white' : '#1a1a2e'
            }}>
              🔧 Healing {selectedDevice?.name}...
            </span>
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: '#eab308'
            }}>
              {healingProgress}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '6px',
            background: isDark ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: healingProgress + '%' }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                borderRadius: '3px'
              }}
            />
          </div>
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            marginTop: '6px'
          }}>
            {healingProgress < 30 && '🔄 Analyzing network traffic...'}
            {healingProgress >= 30 && healingProgress < 60 && '🔀 Redistributing load...'}
            {healingProgress >= 60 && healingProgress < 90 && '✅ Applying fixes...'}
            {healingProgress >= 90 && '🚀 Finalizing recovery...'}
          </div>
        </motion.div>
      )}

      <div style={{
        maxHeight: '250px',
        overflowY: 'auto'
      }}>
        <AnimatePresence>
          {healingLogs.slice(0, 5).map((log, index) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 14px',
                borderRadius: '10px',
                background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                marginBottom: '6px',
                borderLeft: '3px solid ' + getStatusColor(log.status)
              }}
            >
              <span style={{
                fontSize: '16px'
              }}>
                {log.status === 'completed' ? '✅' : log.status === 'in-progress' ? '🔄' : '❌'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: isDark ? 'white' : '#1a1a2e'
                }}>
                  {log.device} - {log.action}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#6b7280'
                }}>
                  {log.issue}
                </div>
              </div>
              <div style={{
                textAlign: 'right'
              }}>
                <span style={{
                  fontSize: '10px',
                  color: getStatusColor(log.status),
                  fontWeight: '600'
                }}>
                  {log.status}
                </span>
                <div style={{
                  fontSize: '9px',
                  color: '#6b7280'
                }}>
                  {log.timestamp}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {healingLogs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🧠</div>
            <p>AI is monitoring your network...</p>
            <p style={{ fontSize: '12px', marginTop: '4px' }}>
              Issues will be detected and healed automatically
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
