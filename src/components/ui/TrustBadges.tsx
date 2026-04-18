import { Shield, Zap, Lock, Globe } from 'lucide-react';

const BADGES = [
  { icon: Shield, label: 'GDPR Compliant', color: '#22d98a' },
  { icon: Lock, label: 'POPIA Ready', color: '#4d9cf8' },
  { icon: Zap, label: '99.9% Uptime SLA', color: '#f5a623' },
  { icon: Globe, label: '14 Countries', color: '#a78bfa' },
];

export function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {BADGES.map(({ icon: Icon, label, color }) => (
        <div
          key={label}
          className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all hover:scale-105 cursor-default"
          style={{
            backgroundColor: 'var(--surface2)',
            borderColor: 'var(--border)',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.backgroundColor = color + '11';
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.backgroundColor = 'var(--surface2)';
          }}
        >
          <Icon size={14} style={{ color }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text2)' }}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}