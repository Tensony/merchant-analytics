import { useMemo } from 'react';
import { Sparkline } from '../charts/Sparkline';
import type { MetricKey } from '../../types';
import { clsx } from 'clsx';

interface KpiCardProps {
  metricKey:   MetricKey;
  label:       string;
  value:       string;
  delta:       string;
  deltaType:   'up' | 'down' | 'neutral';
  subtext?:    string;
  sparkData?:  number[];
  sparkColor?: string;
  isActive?:   boolean;
  onClick?:    (key: MetricKey) => void;
}

export function KpiCard({
  metricKey,
  label,
  value,
  delta,
  deltaType,
  subtext,
  sparkData,
  sparkColor = '#22d98a',
  isActive = false,
  onClick,
}: KpiCardProps) {
  const isUp = deltaType === 'up';
  const isDown = deltaType === 'down';
  
  const deltaColor = isUp ? 'var(--green)' : isDown ? 'var(--red)' : 'var(--text3)';

  const sparklineData = useMemo(() => sparkData ?? [], [sparkData]);

  return (
    <div
      onClick={() => onClick?.(metricKey)}
      className={clsx(
        'rounded-xl p-3 md:p-4 transition-all cursor-pointer',
        'border hover:scale-[1.02] hover:shadow-lg',
        isActive ? 'border-emerald-400 shadow-md' : ''
      )}
      style={{
        backgroundColor: 'var(--surface)',
        borderColor: isActive ? 'var(--green)' : 'var(--border)',
        boxShadow: isActive ? '0 0 0 1px var(--green)' : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <p
          className="font-mono text-[9px] md:text-[10px] tracking-widest uppercase"
          style={{ color: 'var(--text3)' }}
        >
          {label}
        </p>
        {isActive && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        )}
      </div>

      {/* Value */}
      <p
        className="font-['Syne',sans-serif] text-lg md:text-2xl font-bold tracking-tight mb-1"
        style={{ color: 'var(--text)' }}
      >
        {value}
      </p>

      {/* Delta */}
      <div className="flex items-center gap-2 mb-2">
        <span
          className="font-mono text-[11px] md:text-xs font-medium"
          style={{ color: deltaColor }}
        >
          {isUp ? '▲' : isDown ? '▼' : '◆'} {delta}
        </span>
        {subtext && (
          <span className="text-[9px] md:text-[10px]" style={{ color: 'var(--text3)' }}>
            {subtext}
          </span>
        )}
      </div>

      {/* Sparkline */}
      {sparklineData.length > 0 && (
        <div className="h-8 md:h-10">
          <Sparkline data={sparklineData} color={sparkColor} />
        </div>
      )}
    </div>
  );
}