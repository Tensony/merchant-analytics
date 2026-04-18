import { useMemo, useState } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  ReferenceLine,
} from 'recharts';
import type { DailyDataPoint, MetricKey, ChartType } from '../../types';
import { formatCompact, formatPct, formatAOV } from '../../utils/formatters';
import type { Annotation } from '../../hooks/useChartAnnotations';

interface RevenueChartProps {
  data:           DailyDataPoint[];
  previousData?:  DailyDataPoint[];
  activeMetric:   MetricKey;
  chartType:      ChartType;
  annotations?:   Annotation[];
  showComparison: boolean;
  isLive?:        boolean;
  lastUpdate?:    string;
  onBarClick?:    (point: DailyDataPoint) => void;
}

const METRIC_COLOR: Record<MetricKey, string> = {
  revenue: '#22d98a',
  orders:  '#4d9cf8',
  aov:     '#a78bfa',
  churn:   '#ff5757',
};

function formatYAxis(value: number, metric: MetricKey): string {
  if (metric === 'revenue') return formatCompact(value);
  if (metric === 'churn')   return formatPct(value);
  return String(Math.round(value));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label, metric, annotations }: any) {
  if (!active || !payload?.length) return null;

  const point      = payload[0].payload as DailyDataPoint;
  const color      = METRIC_COLOR[metric as MetricKey];
  const annotation = (annotations as Annotation[])?.find((a) => a.date === label);

  const fmt = (v: number) =>
    metric === 'revenue' ? formatCompact(v)   :
    metric === 'aov'     ? formatAOV(v)        :
    metric === 'churn'   ? formatPct(v)        :
    v.toLocaleString();

  return (
    <div
      className="rounded-lg p-3 shadow-xl text-xs min-w-[160px]"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border2)',
      }}
    >
      <p className="font-mono text-[10px] mb-2" style={{ color: 'var(--text3)' }}>
        {label}
      </p>

      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4 mb-1">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: p.color }}
            />
            <span style={{ color: 'var(--text2)' }}>
              {p.dataKey === 'previous' ? 'Previous' : 'Current'}
            </span>
          </div>
          <span className="font-mono font-medium" style={{ color: p.color }}>
            {fmt(p.value)}
          </span>
        </div>
      ))}

      {metric === 'revenue' && (
        <p className="text-[10px] mt-1 pt-1" style={{ color: 'var(--text3)', borderTop: '1px solid var(--border)' }}>
          {point.orders.toLocaleString()} orders
        </p>
      )}

      {point.isAnomaly && (
        <p className="text-[10px] mt-1 text-amber-400">
          ⚠ Anomaly detected
        </p>
      )}

      {annotation && (
        <div
          className="mt-2 pt-2 text-[10px]"
          style={{
            borderTop: `1px solid ${annotation.color}44`,
            color: annotation.color,
          }}
        >
          📌 {annotation.note}
        </div>
      )}

      <p className="text-[10px] mt-2" style={{ color: 'var(--text3)' }}>
        Click to drill down
      </p>
    </div>
  );
}

export function RevenueChart({
  data, previousData = [], activeMetric, chartType,
  annotations = [], showComparison, isLive, lastUpdate,
  onBarClick,
}: RevenueChartProps) {
  const color = METRIC_COLOR[activeMetric];

  const chartData = useMemo(() => {
    return data.map((d, i) => ({
      ...d,
      previous: previousData[i]?.[activeMetric] ?? undefined,
    }));
  }, [data, previousData, activeMetric]);

  const yFormatter = useMemo(
    () => (v: number) => formatYAxis(v, activeMetric),
    [activeMetric]
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleClick(chartData: any) {
    if (chartData?.activePayload?.[0]?.payload && onBarClick) {
      onBarClick(chartData.activePayload[0].payload as DailyDataPoint);
    }
  }

  return (
    <div className="relative">
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-0 right-0 flex items-center gap-1.5 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
            {lastUpdate ? `Updated ${lastUpdate}` : 'Live'}
          </span>
        </div>
      )}

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 4, left: 0, bottom: 0 }}
          onClick={handleClick}
          style={{ cursor: onBarClick ? 'pointer' : 'default' }}
        >
          <defs>
            <linearGradient id="rev-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0}   />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#2a2f3d" strokeWidth={0.5} vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#555c70', fontSize: 10, fontFamily: 'DM Mono' }}
            axisLine={false} tickLine={false} interval={3}
          />
          <YAxis
            tickFormatter={yFormatter}
            tick={{ fill: '#555c70', fontSize: 10, fontFamily: 'DM Mono' }}
            axisLine={false} tickLine={false} width={48}
          />
          <Tooltip
            content={
              <CustomTooltip
                metric={activeMetric}
                annotations={annotations}
              />
            }
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />

          {/* Annotation reference lines */}
          {annotations.map((ann) => (
            <ReferenceLine
              key={ann.id}
              x={ann.date}
              stroke={ann.color}
              strokeWidth={1.5}
              strokeDasharray="3 2"
              label={{
                value: '📌',
                position: 'top',
                fontSize: 10,
              }}
            />
          ))}

          {/* Previous period comparison line */}
          {showComparison && previousData.length > 0 && (
            <Line
              type="monotone"
              dataKey="previous"
              stroke="#555c70"
              strokeWidth={1.5}
              strokeDasharray="4 2"
              dot={false}
              activeDot={false}
            />
          )}

          {/* Main chart */}
          {chartType === 'bar' ? (
            <Bar dataKey={activeMetric} radius={[3, 3, 0, 0]} maxBarSize={28}>
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.isAnomaly ? '#f5a623' : color + '99'}
                  stroke={entry.isAnomaly ? '#f5a623' : 'none'}
                />
              ))}
            </Bar>
          ) : (
            <Area
              type="monotone"
              dataKey={activeMetric}
              stroke={color}
              strokeWidth={2}
              fill="url(#rev-gradient)"
              dot={(props) => {
                const point = props.payload as DailyDataPoint;
                if (!point.isAnomaly) return <g key={props.key} />;
                return (
                  <circle
                    key={props.key}
                    cx={props.cx} cy={props.cy} r={5}
                    fill="#f5a623" stroke="#f5a623"
                  />
                );
              }}
              activeDot={{ r: 4, fill: color }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}