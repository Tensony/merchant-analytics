import { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import type { DailyDataPoint, MetricKey, ChartType } from '../../types';
import { formatCompact, formatPct, formatAOV } from '../../utils/formatters';

interface RevenueChartProps {
  data: DailyDataPoint[];
  activeMetric: MetricKey;
  chartType: ChartType;
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
function CustomTooltip({ active, payload, label, metric }: any) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload as DailyDataPoint;
  const value = payload[0].value as number;
  const color = METRIC_COLOR[metric as MetricKey];

  const displayValue =
    metric === 'revenue' ? formatCompact(value) :
    metric === 'aov'     ? formatAOV(value) :
    metric === 'churn'   ? formatPct(value) :
    value.toLocaleString();

  return (
    <div className="bg-[#161920] border border-[#363d50] rounded-lg p-3 shadow-xl text-sm min-w-[150px]">
      <p className="font-mono text-[10px] text-[#555c70] mb-1">{label}</p>
      <p className="font-['Syne',sans-serif] text-lg font-bold" style={{ color }}>
        {displayValue}
      </p>
      {metric === 'revenue' && (
        <p className="text-[11px] text-[#8b90a0] mt-0.5">
          {point.orders.toLocaleString()} orders
        </p>
      )}
      {point.isAnomaly && (
        <p className="text-[11px] text-amber-400 mt-2 pt-2 border-t border-[#2a2f3d]">
          ⚠ Anomaly detected
        </p>
      )}
    </div>
  );
}

export function RevenueChart({ data, activeMetric, chartType }: RevenueChartProps) {
  const color = METRIC_COLOR[activeMetric];

  const yFormatter = useMemo(
    () => (v: number) => formatYAxis(v, activeMetric),
    [activeMetric]
  );

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#2a2f3d" strokeWidth={0.5} vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: '#555c70', fontSize: 10, fontFamily: 'DM Mono' }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        <YAxis
          tickFormatter={yFormatter}
          tick={{ fill: '#555c70', fontSize: 10, fontFamily: 'DM Mono' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          content={<CustomTooltip metric={activeMetric} />}
          cursor={{ fill: 'rgba(255,255,255,0.03)' }}
        />
        {chartType === 'bar' ? (
          <Bar dataKey={activeMetric} radius={[3, 3, 0, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isAnomaly ? '#f5a623' : color + '99'}
                stroke={entry.isAnomaly ? '#f5a623' : 'none'}
              />
            ))}
          </Bar>
        ) : (
          <Line
            type="monotone"
            dataKey={activeMetric}
            stroke={color}
            strokeWidth={2}
            dot={(props) => {
              const point = props.payload as DailyDataPoint;
              if (!point.isAnomaly) return <g key={props.key} />;
              return (
                <circle
                  key={props.key}
                  cx={props.cx}
                  cy={props.cy}
                  r={5}
                  fill="#f5a623"
                  stroke="#f5a623"
                />
              );
            }}
            activeDot={{ r: 4, fill: color }}
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}