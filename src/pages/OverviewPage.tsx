import { useMemo, useEffect } from 'react';
import { useState } from 'react';
import { useRealtimeOrders } from '../hooks/useRealtimeOrders';
import { LiveOrderFeed } from '../components/ui/LiveOrderFeed';
import { DrillDownModal } from '../components/ui/DrillDownModal';
import type { DailyDataPoint as DrillPoint } from '../types';
import { useApi } from '../hooks/useApi';
import { api } from '../services/api';
import { useDashboardStore } from '../store/useDashboardStore';
import { useUrlState } from '../hooks/useUrlState';
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
import { exportToCsv } from '../utils/exportCsv';
import {
  generateDailyData,
  PRODUCTS,
  GEO_REGIONS,
  ORDERS,
  FUNNEL_STEPS,
  CHANNEL_DATA,
} from '../data/mockData';
import type { MetricKey, DailyDataPoint, Order, Product } from '../types';
import { clsx } from 'clsx';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_DATA = generateDailyData(90);

const RANGE_DAYS: Record<string, number> = {
  '7d': 7, '30d': 30, '90d': 90, 'ytd': 90,
};

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function OverviewPage() {
  // ── 1. URL state sync ────────────────────────────────────────────────────
  useUrlState();
  const { orders: liveOrders_, connected, orderCount, clearOrders } = useRealtimeOrders();
  const [drillPoint, setDrillPoint] = useState<DrillPoint | null>(null);

  // ── 2. Global store ──────────────────────────────────────────────────────
  const {
    activeMetric,
    timeRange,
    chartType,
    setActiveMetric,
    setTimeRange,
    setChartType,
  } = useDashboardStore();

  // ── 3. Local filter state (must be declared before API calls that use it)
  const {
    search,
    statusFilter,
    filteredOrders,
    setSearch,
    setStatusFilter,
  } = useOrderFilter(ORDERS);

  // ── 4. API calls ─────────────────────────────────────────────────────────
  const { data: metricsData, loading: metricsLoading } = useApi(
    () => api.getMetrics(timeRange),
    [timeRange]
  );

  const { data: ordersData } = useApi(
    () => api.getOrders(
      statusFilter !== 'all' ? statusFilter : undefined,
      search || undefined
    ),
    [statusFilter, search]
  );

  const { data: productsData } = useApi(
    () => api.getProducts(),
    []
  );

  // ── 5. Resolve live vs mock data ─────────────────────────────────────────
  const liveOrders   = (ordersData   as Order[]   | null) ?? ORDERS;
  const liveProducts = (productsData as Product[] | null) ?? PRODUCTS;

  // ── 6. Derived data ──────────────────────────────────────────────────────
  const { sortKey, sortDir, sortedProducts, toggleSort } = useProductSort(liveProducts);

  const filteredData = useMemo<DailyDataPoint[]>(() => {
    if (metricsData) {
      return (metricsData as { series: DailyDataPoint[] }).series;
    }
    const days = RANGE_DAYS[timeRange] ?? 30;
    return ALL_DATA.slice(-days);
  }, [metricsData, timeRange]);

  const days = filteredData.length;

  const previousData = useMemo<DailyDataPoint[]>(
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

  const hasAnomaly =
    activeMetric === 'revenue' &&
    filteredData.some((d: DailyDataPoint) => d.isAnomaly);

  // ── 7. Side effects ──────────────────────────────────────────────────────
  useEffect(() => {
    if (hasAnomaly) {
      triggerAnomalyToast('Revenue spike detected — Mar 15 (+187% vs 7-day avg)');
    }
  }, [hasAnomaly]);

  // ── 8. Handlers ──────────────────────────────────────────────────────────
  function handleExport() {
    exportToCsv(
      'orders-export',
      (ordersData ? liveOrders : filteredOrders).map((o) => ({
        id:       o.id,
        customer: o.customer,
        amount:   o.amount,
        status:   o.status,
        date:     o.date,
      }))
    );
  }

  function handleShareView() {
    navigator.clipboard.writeText(window.location.href);
    triggerAnomalyToast('Link copied to clipboard!');
  }

  // ── 9. Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 p-6">

      {/* Loading indicator */}
      {metricsLoading && (
        <div
          className="fixed top-4 right-4 font-mono text-[11px] px-3 py-1.5 rounded-lg z-50"
          style={{
            backgroundColor: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text3)',
          }}
        >
          ⟳ Loading...
        </div>
      )}

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1
            className="font-['Syne',sans-serif] text-xl font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Overview
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
            Last updated: Mar 30, 2024 · 14:22 UTC
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Export CSV */}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ↓ Export CSV
          </button>

          {/* Share view */}
          <button
            onClick={handleShareView}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all"
            style={{
              borderColor: 'var(--border)',
              color: 'var(--text2)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            ⎋ Share view
          </button>

          {/* Time range selector */}
          <div
            className="flex gap-0.5 p-0.5 rounded-lg"
            style={{
              backgroundColor: 'var(--surface2)',
              border: '1px solid var(--border)',
            }}
          >
            {(['7d', '30d', '90d', 'ytd'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className="font-mono text-[11px] px-3 py-1.5 rounded-md transition-all duration-150"
                style={{
                  backgroundColor: timeRange === r ? 'var(--surface3)' : 'transparent',
                  color:           timeRange === r ? 'var(--text)'  : 'var(--text3)',
                  border:          timeRange === r
                    ? '1px solid var(--border2)'
                    : '1px solid transparent',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KPI cards ───────────────────────────────────────────────────── */}
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

      {/* ── Main chart + Geo ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-[1fr_300px] gap-3">
        <Panel>
          <PanelHeader title={CHART_TITLE[activeMetric]}>
            <div
              className="flex gap-0.5 p-0.5 rounded-md"
              style={{ backgroundColor: 'var(--surface2)' }}
            >
              {(['bar', 'line'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setChartType(t)}
                  className="font-mono text-[11px] px-2.5 py-1 rounded transition-all duration-150 capitalize"
                  style={{
                    backgroundColor: chartType === t ? 'var(--surface3)' : 'transparent',
                    color:           chartType === t ? 'var(--text)'  : 'var(--text3)',
                  }}
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
              onBarClick={(point) => setDrillPoint(point)}
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Revenue by region" />
          <GeoList regions={GEO_REGIONS} />
        </Panel>
      </div>

      {/* ── Products + Funnel ────────────────────────────────────────────── */}
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

      {/* ── Orders + Live Feed + Channel ────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        <Panel>
          <PanelHeader title="Recent orders">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
                {ordersData ? liveOrders.length : filteredOrders.length} results
              </span>
              <button
                onClick={handleExport}
                className="font-mono text-[10px] px-2 py-0.5 rounded border transition-all"
                style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                ↓ CSV
              </button>
            </div>
          </PanelHeader>
          <OrdersTable
            orders={ordersData ? liveOrders : filteredOrders}
            search={search}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
          />
        </Panel>

        <Panel>
          <PanelHeader title="Live order feed">
            <div className="flex items-center gap-2">
              {orderCount > 0 && (
                <span
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: '#22d98a22',
                    color: '#22d98a',
                  }}
                >
                  +{orderCount} today
                </span>
              )}
            </div>
          </PanelHeader>
          <LiveOrderFeed
            orders={liveOrders_}
            connected={connected}
            onClear={clearOrders}
          />
        </Panel>

        <Panel>
          <PanelHeader title="Channel performance" />
          <ChannelDonut data={CHANNEL_DATA} />
        </Panel>
      </div>

      {/* ── Drill-down modal ─────────────────────────────────────────────── */}
      {drillPoint && (
        <DrillDownModal
          point={drillPoint}
          onClose={() => setDrillPoint(null)}
        />
      )}
    </div>
  );
}