import { useState, useEffect } from 'react';

function NetworkStatusPage() {
  const [interfaces, setInterfaces] = useState([]);
  const [active, setActive] = useState(null);
  const [history, setHistory] = useState([]);
  const [aiDecision, setAiDecision] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/network/status');
      const data = await res.json();
      setInterfaces(data.interfaces || []);
      setActive(data.active);
      setHistory(data.history || []);
      setErrorMsg(null);
    } catch (error) {
      console.warn('Network status API unavailable');
      setErrorMsg('Could not reach backend. Make sure it is running on port 8000.');
    }
  };

  const fetchDecision = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/network/ai-decision');
      const data = await res.json();
      setAiDecision(data);
    } catch (error) {
      console.warn('AI decision API unavailable');
    }
  };

  const triggerSwitch = async (fromIface, toIface) => {
    if (!fromIface || !toIface) {
      setErrorMsg('Invalid switch: missing interface names.');
      return;
    }
    if (fromIface === toIface) {
      setErrorMsg('Already connected to this interface.');
      return;
    }

    setIsSwitching(true);
    setErrorMsg(null);
    setNotification(null);
    try {
      const url = 'http://localhost:8000/api/network/switch?from_iface=' + encodeURIComponent(fromIface) + '&to_iface=' + encodeURIComponent(toIface);
      const res = await fetch(url, { method: 'POST' });
      const data = await res.json();
      if (data.status === 'switched' || data.status === 'success') {
        await fetchStatus();
        await fetchDecision();
        setNotification({
          message: '✅ AI switched from ' + fromIface + ' to ' + toIface,
          type: 'success'
        });
        setTimeout(() => setNotification(null), 5000);
      } else if (data.status === 'error') {
        setErrorMsg(data.message || 'Switch failed.');
      } else {
        setErrorMsg(data.message || 'Switch failed.');
      }
    } catch (error) {
      console.warn('Switch API error:', error);
      setErrorMsg('Switch API error. Check backend.');
    }
    setIsSwitching(false);
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    await fetchStatus();
    await fetchDecision();
    setIsRefreshing(false);
  };

  // Auto-refresh every 3 seconds
  useEffect(() => {
    fetchStatus();
    fetchDecision();
    const interval = setInterval(() => {
      fetchStatus();
      fetchDecision();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-switch when AI recommends
  useEffect(() => {
    if (aiDecision && aiDecision.decision === 'switch' && aiDecision.from && aiDecision.to) {
      if (!isSwitching && aiDecision.from !== aiDecision.to) {
        triggerSwitch(aiDecision.from, aiDecision.to);
      }
    }
  }, [aiDecision]);

  const getSignalColor = (signal) => {
    if (signal >= 70) return '#22c55e';
    if (signal >= 40) return '#eab308';
    return '#ef4444';
  };

  const getStatusColor = (status) => {
    if (status === 'online') return '#22c55e';
    if (status === 'warning') return '#eab308';
    return '#ef4444';
  };

  // Find the best speed for comparison
  const fastestInterface = interfaces.length > 0 
    ? interfaces.reduce((a, b) => (a.speed_mbps || 0) > (b.speed_mbps || 0) ? a : b) 
    : null;

  return (
    <div style={{
      padding: '24px',
      background: 'rgba(10,10,26,0.85)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      minHeight: 'calc(100vh - 100px)',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
    }}>
      {/* Header with Refresh Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white' }}>
          📶 AI Network Manager
        </h2>
        <button
          onClick={refreshData}
          disabled={isRefreshing}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
        >
          {isRefreshing ? '⏳ ...' : '🔄 Refresh'}
        </button>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
        AI monitors real network interfaces and switches to the best connection.
        {active && <span style={{ marginLeft: '12px', color: '#22c55e' }}>✅ Active: {active}</span>}
        {errorMsg && <span style={{ marginLeft: '12px', color: '#ef4444' }}>❌ {errorMsg}</span>}
      </p>

      {/* Speed Comparison Badge */}
      {fastestInterface && (
        <div style={{
          marginBottom: '16px',
          padding: '10px 16px',
          borderRadius: '10px',
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.2)',
          display: 'inline-block'
        }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>
            🚀 Fastest: <strong style={{ color: '#818cf8' }}>{fastestInterface.name}</strong>
            ({fastestInterface.speed_mbps || 0} Mbps)
          </span>
        </div>
      )}

      {/* Notification Banner */}
      {notification && (
        <div style={{
          marginBottom: '16px',
          padding: '12px 20px',
          borderRadius: '10px',
          background: 'rgba(34,197,94,0.15)',
          border: '1px solid rgba(34,197,94,0.3)',
          color: '#22c55e',
          fontSize: '14px',
          fontWeight: '500',
          animation: 'fadeIn 0.5s ease'
        }}>
          {notification.message}
        </div>
      )}

      {aiDecision && (
        <div style={{
          marginBottom: '20px',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid ' + (aiDecision.decision === 'switch' ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.3)'),
          background: aiDecision.decision === 'switch' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '36px' }}>{aiDecision.decision === 'switch' ? '🔄' : '✅'}</span>
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>
                {aiDecision.decision === 'switch' ? '⚠️ AI recommends switching!' : '✅ Network is optimal'}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '4px' }}>
                {aiDecision.reason}
              </div>
              {aiDecision.decision === 'switch' && (
                <div style={{ marginTop: '8px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    background: 'rgba(99,102,241,0.2)',
                    color: '#818cf8',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    🔄 Switching from {aiDecision.from} to {aiDecision.to}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {interfaces.map((iface) => {
          const signal = iface.signal || 50;
          return (
            <div key={iface.name} style={{
              padding: '16px 20px',
              borderRadius: '12px',
              background: active === iface.name ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)',
              border: active === iface.name ? '2px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: 'white' }}>
                    {iface.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                    {iface.ip || 'No IP'} • {iface.speed_mbps || 0} Mbps
                  </div>
                </div>
                <span style={{
                  padding: '2px 10px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '600',
                  background: 'rgba(' + (iface.status === 'online' ? '34,197,94' : '239,68,68') + ', 0.15)',
                  color: getStatusColor(iface.status)
                }}>
                  {iface.status}
                </span>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
                  <span>Signal Strength</span>
                  <span style={{ color: getSignalColor(signal) }}>
                    {Math.round(signal)}%
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: signal + '%',
                    height: '100%',
                    background: getSignalColor(signal),
                    borderRadius: '3px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
              {active === iface.name && (
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#22c55e' }}>
                  ✅ Active Connection
                </div>
              )}
              {iface.status === 'online' && active !== iface.name && (
                <button
                  onClick={() => triggerSwitch(active, iface.name)}
                  disabled={isSwitching || !active}
                  style={{
                    marginTop: '8px',
                    padding: '6px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: 'rgba(99,102,241,0.5)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(99,102,241,0.7)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(99,102,241,0.5)'}
                >
                  {isSwitching ? '⏳ Switching...' : '🔀 Switch to this'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '12px' }}>
        📋 AI Switch History
      </h3>
      <div style={{
        padding: '16px 20px',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        maxHeight: '200px',
        overflowY: 'auto',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
      }}>
        {history.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '20px' }}>
            No switches yet. Click "Switch to this" or wait for AI to auto-switch.
          </div>
        ) : (
          history.map((entry, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: idx < history.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
            }}>
              <div>
                <span style={{ fontWeight: '500', color: 'white' }}>
                  🔄 {entry.from} → {entry.to}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginLeft: '8px' }}>
                  {entry.reason || 'AI Auto-Switch'}
                </span>
              </div>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
                {entry.timestamp}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Presentation Notes */}
      <div style={{
        marginTop: '20px',
        padding: '12px 16px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.3)',
        fontSize: '12px',
        textAlign: 'center'
      }}>
        💡 Real data from psutil · AI auto-switches when signal drops below 40%
      </div>
    </div>
  );
}

export default NetworkStatusPage;
