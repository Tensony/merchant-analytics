import { useMemo, useEffect } from 'react';
import { useMetric } from '../hooks/useMetric';
import { useOrderFilter } from '../hooks/useOrderFilter';
import { useProductSort } from '../hooks/useProductSort';
import { useKpiValues } from '../hooks/useKpiValues';
import { KpiCard } from '../components/ui/KpiCard';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { RevenueChart } from '../components/charts/RevenueChart';
import { FunnelChart } from '../components/charts/FunnelChart';
import { ChannelDonut } from '../components/charts/ChannelDonut';
import { ProductsTable } from '../components/ui/ProductsTable';
import { GeoList } from '../components/ui/GeoList';
import { OrdersTable } from '../components/ui/OrdersTable';
import { triggerAnomalyToast } from '../components/ui/AnomalyToast';
import type { MetricKey, DailyDataPoint } from '../types';
import {
  generateDailyData,
  PRODUCTS,
  GEO_REGIONS,
  ORDERS,
  FUNNEL_STEPS,
  CHANNEL_DATA,
} from '../data/mockData';
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

export function OverviewPage() {
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

  const days = filteredData.length;
  const previousData = useMemo(
    () => ALL_DATA.slice(-(days * 2), -days),
    [days]
  );

  const kpis = useKpiValues(filteredData, previousData);

  const sparkData = useMemo(() => ({
  revenue: filteredData.slice(-14).map((d: DailyDataPoint) => d.revenue),
  orders:  filteredData.slice(-14).map((d: DailyDataPoint) => d.orders),
  aov:     filteredData.slice(-14).map((d: DailyDataPoint) => d.aov),
  churn:   filteredData.slice(-14).map((d: DailyDataPoint) => d.churn),
}), [filteredData]);

  const hasAnomaly = activeMetric === 'revenue' &&
    filteredData.some((d) => d.isAnomaly);

  useEffect(() => {
    if (hasAnomaly) {
      triggerAnomalyToast('Revenue spike detected — Mar 15 (+187% vs 7-day avg)');
    }
  }, [hasAnomaly]);

  return (
    <div className="flex flex-col gap-3 p-6">

      {/* Page header */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="font-['Syne',sans-serif] text-xl font-bold text-[#e8eaf0] tracking-tight">
            Overview
          </h1>
          <p className="text-xs text-[#555c70] mt-0.5">
            Last updated: Mar 30, 2024 · 14:22 UTC
          </p>
        </div>
        {/* Time range */}
        <div className="flex gap-0.5 bg-[#1e222b] p-0.5 rounded-lg border border-[#2a2f3d]">
          {(['7d', '30d', '90d', 'ytd'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={clsx(
                'font-mono text-[11px] px-3 py-1.5 rounded-md transition-all duration-150',
                timeRange === r
                  ? 'bg-[#252a35] text-[#e8eaf0] border border-[#363d50]'
                  : 'text-[#555c70] hover:text-[#8b90a0]'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

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
          />
        </Panel>

        <Panel>
          <PanelHeader title="Channel performance" />
          <ChannelDonut data={CHANNEL_DATA} />
        </Panel>
      </div>
    </div>
  );
}