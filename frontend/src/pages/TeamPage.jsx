import GlassCard from '../components/GlassCard';

export default function Team() {
  const members = [
    { name: 'Haseeb Khan', role: 'Lead Developer', initials: 'HK', color: '#6366f1' },
    { name: 'AI Assistant', role: 'Self-Healing Agent', initials: 'AI', color: '#8b5cf6' },
    { name: 'Network Monitor', role: 'Anomaly Detection', initials: 'NM', color: '#22c55e' },
  ];
  return (
    <div style={{ animation: 'fadeInUp 0.6s ease' }}>
      <h2 style={{ color: 'white' }}>👥 Team</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '16px' }}>
        {members.map(m => (
          <GlassCard key={m.name} style={{ textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: m.color, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>{m.initials}</div>
            <div style={{ color: 'white', fontWeight: '600' }}>{m.name}</div>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{m.role}</div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
