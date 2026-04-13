import { clsx } from 'clsx';
import { Sparkline } from '../charts/Sparkline';
import type { MetricKey } from '../../types';

interface KpiCardProps {
  title?: string;
  value: string;
  change?: number;
  metricKey?: MetricKey;
  label?: string;
  delta?: string;
  deltaType?: 'up' | 'down';
  subtext?: string;
  sparkData?: number[];
  sparkColor?: string;
  isActive?: boolean;
  onClick?: (key: MetricKey) => void;
}

export function KpiCard({
  title,
  value,
  change,
  metricKey,
  label,
  delta,
  deltaType,
  subtext,
  sparkData,
  sparkColor,
  isActive,
  onClick,
}: KpiCardProps) {
  const displayLabel = label || title || '';
  const displayDelta = delta || (change ? `${change > 0 ? '+' : ''}${change}%` : '');
  const displayDeltaType = deltaType || (change ? (change > 0 ? 'up' : 'down') : 'up');
  const displaySubtext = subtext || '';
  const displaySparkData = sparkData || [];
  const displaySparkColor = sparkColor || '#e8eaf0';
  const displayIsActive = isActive || false;
  const displayOnClick = onClick || (() => {});

  return (
    <button
      onClick={() => displayOnClick(metricKey || 'revenue')}
      className={clsx(
        'text-left bg-[#161920] border rounded-xl p-4 transition-all duration-150 w-full',
        displayIsActive
          ? 'border-emerald-500 shadow-[0_0_0_1px_rgba(34,217,138,0.15)]'
          : 'border-[#2a2f3d] hover:border-[#363d50]'
      )}
    >
      <p className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] mb-2">
        {displayLabel}
      </p>
      <p className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight text-[#e8eaf0] leading-none">
        {value}
      </p>
      <div className="flex items-center gap-1.5 mt-1.5">
        <span
          className={clsx(
            'font-mono text-[11px] font-medium px-1.5 py-0.5 rounded',
            displayDeltaType === 'up'
              ? 'bg-emerald-950 text-emerald-400'
              : 'bg-red-950 text-red-400'
          )}
        >
          {displayDeltaType === 'up' ? '▲' : '▼'} {displayDelta}
        </span>
        <span className="text-[11px] text-[#555c70]">{displaySubtext}</span>
      </div>
      {displaySparkData.length > 0 && (
        <div className="mt-2.5">
          <Sparkline data={displaySparkData} color={displaySparkColor} />
        </div>
      )}
    </button>
  );
}