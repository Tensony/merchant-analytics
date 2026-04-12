import { useMemo, useEffect } from 'react';
import { useMetric } from './hooks/useMetric';
import { useOrderFilter } from './hooks/useOrderFilter';
import { useProductSort } from './hooks/useProductSort';
import { useKpiValues } from './hooks/useKpiValues';
import { Topbar } from './components/layout/Topbar';
import { KpiCard } from './components/ui/KPICard';
import { Panel, PanelHeader } from './components/ui/Panel';
import { RevenueChart } from './components/charts/RevenueChart';
import { FunnelChart } from './components/charts/FunnelChart';
import { ChannelDonut } from './components/charts/ChannelDonut';
import { ProductsTable } from './components/ui/ProductsTable';
import { GeoList } from './components/ui/GeoList';
import { OrdersTable } from './components/ui/OrdersTable';
import { AnomalyToast, triggerAnomalyToast } from './components/ui/AnomalyToast';
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

const ALL_DATA = generateDailyData(90);

const SPARK_COLORS: Record<MetricKey, string> = {
  revenue: '#22d98a',
  orders:  '#4d9cf8',
  aov:     '#a78bfa',
  churn:   '#ff5757',
};

const CHART_TITLE: Record<MetricKey, string> = {
  revenue: 'Revenue over time',
  orders:  'Order volume over time',
  aov:     'Average order value over time',
  churn:   'Churn rate over time',
};

export default function App() {
  const {
    activeMetric, timeRange, chartType,
    filteredData,
    setActiveMetric, setTimeRange, setChartType,
  } = useMetric();

  const {
    search, statusFilter, filteredOrders,
    setSearch, setStatusFilter,
  } = useOrderFilter(ORDERS);

  const {
    sortKey, sortDir, sortedProducts, toggleSort,
  } = useProductSort(PRODUCTS);

  // compute previous period slice for KPI deltas
  const days = filteredData.length;
  const previousData = useMemo(
    () => ALL_DATA.slice(-(days * 2), -days),
    [days]
  );

  const kpis = useKpiValues(filteredData, previousData);

  const sparkData = useMemo(() => ({
    revenue: filteredData.slice(-14).map((d) => d.revenue),
    orders:  filteredData.slice(-14).map((d) => d.orders),
    aov:     filteredData.slice(-14).map((d) => d.aov),
    churn:   filteredData.slice(-14).map((d) => d.churn),
  }), [filteredData]);

  const hasAnomaly = activeMetric === 'revenue' &&
    filteredData.some((d) => d.isAnomaly);

  // Fire anomaly toast when switching to revenue and anomaly exists
  useEffect(() => {
    if (hasAnomaly) {
      triggerAnomalyToast('Revenue spike detected — Mar 15 (+187% vs 7-day avg)');
    }
  }, [hasAnomaly]);

  return (
    <div
      className="min-h-screen bg-[#0d0f12] text-[#e8eaf0]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <AnomalyToast />
      <Topbar timeRange={timeRange} onTimeRangeChange={setTimeRange} />

      <main className="flex flex-col gap-3 p-6">

        {/* KPI Row */}
        <div className="grid grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <KpiCard
              key={kpi.key}
              metricKey={kpi.key}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaType={kpi.deltaType}
              subtext={kpi.subtext}
              sparkData={sparkData[kpi.key]}
              sparkColor={SPARK_COLORS[kpi.key]}
              isActive={activeMetric === kpi.key}
              onClick={setActiveMetric}
            />
          ))}
        </div>

        {/* Main chart + Geo */}
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
                <strong>Anomaly detected:</strong>&nbsp;
                Revenue spike on Mar 15 (+187% vs 7-day avg). Likely flash sale event.
              </div>
            )}

            <div className="p-4">
              <RevenueChart
                data={filteredData}
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
            <PanelHeader title="Top products" />
            <ProductsTable
              products={sortedProducts}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            />
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
              <span className="font-mono text-[10px] text-[#555c70]">
                {filteredOrders.length} results
              </span>
            </PanelHeader>
            <OrdersTable
              orders={filteredOrders}
              search={search}
              statusFilter={statusFilter}
              onSearchChange={setSearch}
              onStatusChange={setStatusFilter}
            />
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