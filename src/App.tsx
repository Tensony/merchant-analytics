import { useMemo } from 'react';
import { useMetric } from './hooks/useMetric';
import { Topbar } from './components/layout/Topbar';
import { KpiCard } from './components/ui/KpiCard';
import { Panel, PanelHeader } from './components/ui/Panel';
import { RevenueChart } from './components/charts/RevenueChart';
import { FunnelChart } from './components/charts/FunnelChart';
import { ChannelDonut } from './components/charts/ChannelDonut';
import { ProductsTable } from './components/ui/ProductsTable';
import { GeoList } from './components/ui/GeoList';
import { OrdersTable } from './components/ui/OrdersTable';
import {
  generateDailyData,
  PRODUCTS,
  GEO_REGIONS,
  ORDERS,
  FUNNEL_STEPS,
  CHANNEL_DATA,
} from './data/mockData';
import type { MetricKey } from './types';
import { clsx } from 'clsx';

const DAILY_DATA = generateDailyData(30);

interface KpiDefinition {
  key: MetricKey;
  label: string;
  value: string;
  delta: string;
  deltaType: 'up' | 'down';
  subtext: string;
  sparkColor: string;
}

const KPI_DEFS: KpiDefinition[] = [
  {
    key: 'revenue', label: 'Total Revenue', value: '$284,920',
    delta: '12.4%', deltaType: 'up', subtext: 'vs prev period', sparkColor: '#22d98a',
  },
  {
    key: 'orders', label: 'Orders', value: '4,821',
    delta: '8.1%', deltaType: 'up', subtext: 'vs prev period', sparkColor: '#4d9cf8',
  },
  {
    key: 'aov', label: 'Avg Order Value', value: '$59.10',
    delta: '3.9%', deltaType: 'up', subtext: 'vs prev period', sparkColor: '#a78bfa',
  },
  {
    key: 'churn', label: 'Churn Rate', value: '2.4%',
    delta: '0.3pp', deltaType: 'down', subtext: 'vs prev period', sparkColor: '#ff5757',
  },
];

const CHART_TITLE: Record<MetricKey, string> = {
  revenue: 'Revenue over time',
  orders:  'Order volume over time',
  aov:     'Average order value over time',
  churn:   'Churn rate over time',
};

export default function App() {
  const { activeMetric, timeRange, chartType, setActiveMetric, setTimeRange, setChartType } = useMetric();

  const sparkData = useMemo(() => ({
    revenue: DAILY_DATA.slice(-14).map((d) => d.revenue),
    orders:  DAILY_DATA.slice(-14).map((d) => d.orders),
    aov:     DAILY_DATA.slice(-14).map((d) => d.aov),
    churn:   DAILY_DATA.slice(-14).map((d) => d.churn),
  }), []);

  const hasAnomaly = activeMetric === 'revenue';

  return (
    <div className="min-h-screen bg-[#0d0f12] text-[#e8eaf0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Topbar timeRange={timeRange} onTimeRangeChange={setTimeRange} />

      <main className="flex flex-col gap-3 p-6">

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-3">
          {KPI_DEFS.map((kpi) => (
            <KpiCard
              key={kpi.key}
              metricKey={kpi.key}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaType={kpi.deltaType}
              subtext={kpi.subtext}
              sparkData={sparkData[kpi.key]}
              sparkColor={kpi.sparkColor}
              isActive={activeMetric === kpi.key}
              onClick={setActiveMetric}
            />
          ))}
        </div>

        {/* Main + Geo */}
        <div className="grid grid-cols-[1fr_300px] gap-3">
          <Panel>
            <PanelHeader title={CHART_TITLE[activeMetric]}>
              <div className="flex gap-0.5 bg-[#1e222b] p-0.5 rounded-md">
                {(['bar', 'line'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className={clsx(
                      'font-mono text-[11px] px-2.5 py-1 rounded transition-all duration-150 capitalize',
                      chartType === t
                        ? 'bg-[#252a35] text-[#e8eaf0]'
                        : 'text-[#555c70] hover:text-[#8b90a0]'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </PanelHeader>

            {hasAnomaly && (
              <div className="mx-[18px] mt-3 flex items-center gap-2 bg-amber-950/40 border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
                <strong>Anomaly detected:</strong>&nbsp;Revenue spike on Mar 15 (+187% vs 7-day avg). Likely flash sale event.
              </div>
            )}

            <div className="p-4">
              <RevenueChart
                data={DAILY_DATA}
                activeMetric={activeMetric}
                chartType={chartType}
              />
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Revenue by region" />
            <GeoList regions={GEO_REGIONS} />
          </Panel>
        </div>

        {/* Products + Funnel */}
        <div className="grid grid-cols-[1fr_320px] gap-3">
          <Panel>
            <PanelHeader title="Top products">
              <div className="flex gap-0.5 bg-[#1e222b] p-0.5 rounded-md">
                {['Revenue', 'Units', 'Margin'].map((t) => (
                  <button
                    key={t}
                    className="font-mono text-[11px] px-2.5 py-1 rounded text-[#555c70] hover:text-[#8b90a0] first:bg-[#252a35] first:text-[#e8eaf0] transition-all duration-150"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </PanelHeader>
            <ProductsTable products={PRODUCTS} />
          </Panel>

          <Panel>
            <PanelHeader title="Conversion funnel" />
            <FunnelChart steps={FUNNEL_STEPS} />
          </Panel>
        </div>

        {/* Orders + Channel */}
        <div className="grid grid-cols-2 gap-3">
          <Panel>
            <PanelHeader title="Recent orders">
              <button className="text-[11px] text-[#8b90a0] hover:text-[#e8eaf0] transition-colors">
                View all ↗
              </button>
            </PanelHeader>
            <OrdersTable orders={ORDERS} />
          </Panel>

          <Panel>
            <PanelHeader title="Channel performance" />
            <ChannelDonut data={CHANNEL_DATA} />
          </Panel>
        </div>

      </main>
    </div>
  );
}