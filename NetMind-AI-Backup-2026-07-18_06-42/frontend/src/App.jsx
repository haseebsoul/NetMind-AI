import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import Dashboard from './pages/Dashboard';
import NetworkPage from './pages/NetworkPage';
import AICorePage from './pages/AICorePage';
import SelfHealingPage from './pages/SelfHealingPage';
import TeamPage from './pages/TeamPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NetworkStatusPage from './pages/NetworkStatusPage';
import Particles from './components/Particles';
import './App.css';
import './styles/global.css';
import './styles/animations.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [devices, setDevices] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('netmind_user');
    if (saved) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    ws.current = new WebSocket('ws://localhost:8000/ws');
    ws.current.onmessage = (event) => {
      try { setDevices(JSON.parse(event.data)); } catch (e) {}
    };
    ws.current.onerror = () => console.warn('WebSocket error');
    return () => { if (ws.current) ws.current.close(); };
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('netmind_user', JSON.stringify({ username: 'haseeb' }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('netmind_user');
    if (ws.current) ws.current.close();
  };

  const toggleDark = () => setIsDark(!isDark);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'network': return <NetworkPage />;
      case 'ai-core': return <AICorePage />;
      case 'healing': return <SelfHealingPage />;
      case 'team': return <TeamPage />;
      case 'reports': return <ReportsPage />;
      case 'network-manager': return <NetworkStatusPage />;
      case 'settings': return <SettingsPage isDark={isDark} toggleDark={toggleDark} />;
      default: return <Dashboard />;
    }
  };

  // LOGIN PAGE (Light themed)
  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: '#f0f4f8'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4f8 100%)',
          zIndex: 0
        }} />
        <div style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '420px',
          width: '100%',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px',
          padding: '40px 35px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px' }}>🧠</div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e' }}>NetMind AI</h1>
            <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: '14px' }}>AI-Powered Network Operations Center</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); const u = e.target.username.value; const p = e.target.password.value; if (u === 'haseeb' && p === '1234') handleLogin(); else alert('Invalid credentials'); }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>Username</label>
              <input name="username" type="text" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#1a1a2e', fontSize: '15px', outline: 'none' }} placeholder="Enter username" required />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'rgba(0,0,0,0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase' }}>Password</label>
              <input name="password" type="password" style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', color: '#1a1a2e', fontSize: '15px', outline: 'none' }} placeholder="Enter password" required />
            </div>
            <button type="submit" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4f46e5, #6366f1)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(79,70,229,0.3)' }}>Sign In</button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px', color: 'rgba(0,0,0,0.3)', fontSize: '12px' }}>Demo: <strong style={{ color: 'rgba(0,0,0,0.6)' }}>haseeb</strong> / <strong style={{ color: 'rgba(0,0,0,0.6)' }}>1234</strong></div>
        </div>
      </div>
    );
  }

  // DASHBOARD LAYOUT - Light theme
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff 0%, #f0f4f8 100%)',
      display: 'flex',
      fontFamily: 'Segoe UI, sans-serif',
      position: 'relative'
    }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <div style={{
        marginLeft: '220px',
        flex: 1,
        padding: '24px 32px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '24px', flexWrap: 'wrap', gap: '12px'
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e' }}>
              {activePage.charAt(0).toUpperCase() + activePage.slice(1).replace('-', ' ')}
            </h1>
            <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '14px' }}>Network Operations Center</p>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '6px 14px', borderRadius: '20px',
            background: 'rgba(34,197,94,0.1)',
            color: '#16a34a', fontSize: '13px', fontWeight: '500',
            border: '1px solid rgba(34,197,94,0.15)'
          }}>
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#22c55e', display: 'inline-block',
              animation: 'pulse 1.5s infinite'
            }} /> All Systems Online
          </div>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
