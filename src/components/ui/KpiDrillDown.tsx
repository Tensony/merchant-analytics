import { useMemo } from 'react';
import { Modal } from './Modal';
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import type { DailyDataPoint, MetricKey } from '../../types';
import { formatCompact, formatPct, formatAOV } from '../../utils/formatters';

interface KpiDrillDownProps {
  metricKey:    MetricKey;
  label:        string;
  data:         DailyDataPoint[];
  previousData: DailyDataPoint[];
  color:        string;
  onClose:      () => void;
}

const METRIC_FORMAT: Record<MetricKey, (v: number) => string> = {
  revenue: formatCompact,
  orders:  (v) => v.toLocaleString(),
  aov:     formatAOV,
  churn:   formatPct,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DrillTooltip({ active, payload, label, color, metricKey }: any) {
  if (!active || !payload?.length) return null;
  const fmt = METRIC_FORMAT[metricKey as MetricKey];
  const cur  = payload.find((p: any) => p.dataKey === 'current')?.value;
  const prev = payload.find((p: any) => p.dataKey === 'previous')?.value;

  return (
    <div
      className="rounded-lg p-3 text-xs min-w-[140px]"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border2)',
      }}
    >
      <p className="font-mono text-[10px] mb-2" style={{ color: 'var(--text3)' }}>
        {label}
      </p>
      {cur !== undefined && (
        <div className="flex items-center justify-between gap-4">
          <span style={{ color: 'var(--text2)' }}>Current</span>
          <span className="font-mono font-medium" style={{ color }}>
            {fmt(cur)}
          </span>
        </div>
      )}
      {prev !== undefined && (
        <div className="flex items-center justify-between gap-4 mt-1">
          <span style={{ color: 'var(--text2)' }}>Previous</span>
          <span className="font-mono" style={{ color: 'var(--text3)' }}>
            {fmt(prev)}
          </span>
        </div>
      )}
    </div>
  );
}

export function KpiDrillDown({
  metricKey, label, data, previousData, color, onClose,
}: KpiDrillDownProps) {
  const fmt = METRIC_FORMAT[metricKey];

  const chartData = useMemo(() => {
    return data.map((d, i) => ({
      date:     d.date,
      current:  d[metricKey],
      previous: previousData[i]?.[metricKey] ?? null,
    }));
  }, [data, previousData, metricKey]);

  const currentTotal  = useMemo(() => data.reduce((a, d) => a + d[metricKey], 0) / (metricKey === 'churn' || metricKey === 'aov' ? data.length : 1), [data, metricKey]);
  const previousTotal = useMemo(() => previousData.reduce((a, d) => a + d[metricKey], 0) / (metricKey === 'churn' || metricKey === 'aov' ? previousData.length : 1), [previousData, metricKey]);

  const pctChange = previousTotal > 0
    ? ((currentTotal - previousTotal) / previousTotal) * 100
    : 0;

  const peak    = useMemo(() => Math.max(...data.map((d) => d[metricKey])), [data, metricKey]);
  const trough  = useMemo(() => Math.min(...data.map((d) => d[metricKey])), [data, metricKey]);
  const average = useMemo(() => data.reduce((a, d) => a + d[metricKey], 0) / data.length, [data, metricKey]);

  const peakDay   = data.find((d) => d[metricKey] === peak);
  const troughDay = data.find((d) => d[metricKey] === trough);

  return (
    <Modal title={`${label} — detailed breakdown`} onClose={onClose}>
      <div className="flex flex-col gap-4">

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Current period', value: fmt(currentTotal),  color },
            { label: 'Previous period', value: fmt(previousTotal), color: 'var(--text3)' as string },
            {
              label: 'Change',
              value: (pctChange >= 0 ? '+' : '') + pctChange.toFixed(1) + '%',
              color: pctChange >= 0 ? '#22d98a' : '#ff5757',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
              }}
            >
              <p
                className="font-mono text-[9px] tracking-widest uppercase mb-1"
                style={{ color: 'var(--text3)' }}
              >
                {s.label}
              </p>
              <p
                className="font-['Syne',sans-serif] text-base font-bold"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div>
          <p
            className="font-mono text-[10px] tracking-widest uppercase mb-2"
            style={{ color: 'var(--text3)' }}
          >
            Current vs previous period
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="drill-cur" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="drill-prev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%"   stopColor="#555c70" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#555c70" stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#2a2f3d" strokeWidth={0.5} vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#555c70', fontSize: 9, fontFamily: 'DM Mono' }}
                axisLine={false} tickLine={false} interval={4}
              />
              <YAxis
                tickFormatter={(v) => fmt(v)}
                tick={{ fill: '#555c70', fontSize: 9, fontFamily: 'DM Mono' }}
                axisLine={false} tickLine={false} width={44}
              />
              <Tooltip
                content={<DrillTooltip color={color} metricKey={metricKey} />}
                cursor={{ stroke: '#363d50', strokeWidth: 1 }}
              />
              <Area
                type="monotone" dataKey="previous"
                stroke="#555c70" strokeWidth={1.5} strokeDasharray="4 2"
                fill="url(#drill-prev)" dot={false}
              />
              <Area
                type="monotone" dataKey="current"
                stroke={color} strokeWidth={2}
                fill="url(#drill-cur)" dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Peak',    value: fmt(peak),    day: peakDay?.date,   color: '#22d98a' },
            { label: 'Average', value: fmt(average), day: 'period avg',    color },
            { label: 'Trough',  value: fmt(trough),  day: troughDay?.date, color: '#ff5757' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-3"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
              }}
            >
              <p
                className="font-mono text-[9px] tracking-widest uppercase mb-1"
                style={{ color: 'var(--text3)' }}
              >
                {s.label}
              </p>
              <p
                className="font-mono text-sm font-medium"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: 'var(--text3)' }}>
                {s.day}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}