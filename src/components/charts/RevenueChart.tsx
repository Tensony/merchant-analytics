import { useMemo } from 'react';
import {
  ResponsiveContainer, ComposedChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';
import type { DailyDataPoint, MetricKey, ChartType } from '../../types';
import { formatCompact, formatPct, formatAOV } from '../../utils/formatters';

interface RevenueChartProps {
  data:          DailyDataPoint[];
  activeMetric:  MetricKey;
  chartType:     ChartType;
  onBarClick?:   (point: DailyDataPoint) => void;
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
  const value = payload[0].value  as number;
  const color = METRIC_COLOR[metric as MetricKey];

  const displayValue =
    metric === 'revenue' ? formatCompact(value)   :
    metric === 'aov'     ? formatAOV(value)        :
    metric === 'churn'   ? formatPct(value)        :
    value.toLocaleString();

  return (
    <div
      className="rounded-lg p-3 shadow-xl text-sm min-w-[160px]"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border2)',
      }}
    >
      <p className="font-mono text-[10px] mb-1" style={{ color: 'var(--text3)' }}>
        {label}
      </p>
      <p
        className="font-['Syne',sans-serif] text-lg font-bold"
        style={{ color }}
      >
        {displayValue}
      </p>
      {metric === 'revenue' && (
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--text2)' }}>
          {point.orders.toLocaleString()} orders
        </p>
      )}
      {point.isAnomaly && (
        <p className="text-[11px] mt-2 pt-2 text-amber-400" style={{ borderTop: '1px solid var(--border)' }}>
          ⚠ Anomaly detected
        </p>
      )}
      <p className="text-[10px] mt-2" style={{ color: 'var(--text3)' }}>
        Click to drill down
      </p>
    </div>
  );
}

export function RevenueChart({ data, activeMetric, chartType, onBarClick }: RevenueChartProps) {
  const color = METRIC_COLOR[activeMetric];

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
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart
        data={data}
        margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
        onClick={handleClick}
        style={{ cursor: onBarClick ? 'pointer' : 'default' }}
      >
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