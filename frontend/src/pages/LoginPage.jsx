import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ElectricBorder from '../components/ElectricBorder';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Try: haseeb / 1234');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#0a0505'
    }}>
      <img src="/deadpool.jpg" alt="Deadpool" style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(5, 2, 2, 0.7)',
        zIndex: 1
      }} />

      <ElectricBorder
        color="#7df9ff"
        speed={1}
        chaos={0.12}
        borderRadius={28}
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '420px',
          width: '100%',
          animation: 'fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      >
        <div style={{
          background: 'rgba(10, 5, 5, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          padding: '40px 35px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '48px', marginBottom: '8px' }}>🧠</div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'white' }}>
              NetMind <span style={{ background: 'linear-gradient(135deg, #ff0000, #ff4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '4px' }}>AI-Powered Network Operations Center</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>👤 Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{
                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'white',
                fontSize: '15px', outline: 'none', transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(255,50,50,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              placeholder="Enter username" required />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: '600', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '1px' }}>🔑 Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{
                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', color: 'white',
                fontSize: '15px', outline: 'none', transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(255,50,50,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              placeholder="Enter password" required />
            </div>
            {error && <div style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)', borderRadius: '8px', padding: '10px', color: '#ff6b6b', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
            <button type="submit" disabled={isLoading} style={{
              width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ff0000, #cc0000)',
              border: 'none', borderRadius: '12px', color: 'white', fontSize: '16px', fontWeight: '700',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(255,0,0,0.3)', transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              {isLoading ? '⏳ Logging in...' : '🚀 Sign In'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: '16px', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
            <span style={{ color: '#ff6b6b' }}>🔑</span> Demo: <strong style={{ color: 'rgba(255,255,255,0.6)' }}>haseeb</strong> / <strong style={{ color: 'rgba(255,255,255,0.6)' }}>1234</strong>
          </div>
        </div>
      </ElectricBorder>
    </div>
  );
}

export default LoginPage;
