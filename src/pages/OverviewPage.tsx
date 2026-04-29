import { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimeChart }    from '../hooks/useRealtimeChart';
import { useChartAnnotations } from '../hooks/useChartAnnotations';
import { KpiDrillDown }        from '../components/ui/KpiDrillDown';
import { AnnotationPanel }     from '../components/ui/AnnotationPanel';
import { useRealtimeOrders }   from '../hooks/useRealtimeOrders';
import { LiveOrderFeed }       from '../components/ui/LiveOrderFeed';
import { DrillDownModal }      from '../components/ui/DrillDownModal';
import type { DailyDataPoint as DrillPoint } from '../types';
import { useApi }              from '../hooks/useApi';
import { api }                 from '../services/api';
import { useDashboardStore }   from '../store/useDashboardStore';
import { useUrlState }         from '../hooks/useUrlState';
import { useOrderFilter }      from '../hooks/useOrderFilter';
import { useProductSort }      from '../hooks/useProductSort';
import { useKpiValues }        from '../hooks/useKpiValues';
import { KpiCard }             from '../components/ui/KpiCard';
import { Panel, PanelHeader }  from '../components/ui/Panel';
import { RevenueChart }        from '../components/charts/RevenueChart';
import { FunnelChart }         from '../components/charts/FunnelChart';
import { ChannelDonut }        from '../components/charts/ChannelDonut';
import { ProductsTable }       from '../components/ui/ProductsTable';
import { GeoList }             from '../components/ui/GeoList';
import { OrdersTable }         from '../components/ui/OrdersTable';
import { triggerAnomalyToast } from '../components/ui/AnomalyToast';
import { exportToCsv }         from '../utils/exportCsv';
import {
  generateDailyData, PRODUCTS, GEO_REGIONS,
  ORDERS, FUNNEL_STEPS, CHANNEL_DATA,
} from '../data/mockData';
import type { MetricKey, DailyDataPoint, Order, Product } from '../types';
import { clsx }                from 'clsx';
import confetti                from 'canvas-confetti';

// ── Constants ─────────────────────────────────────────────────────────────────

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

const DRILL_COLORS: Record<MetricKey, string> = {
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

// ── Animated number ───────────────────────────────────────────────────────────

function AnimatedNumber({
  value, prefix = '', suffix = '', className = '', style,
}: {
  value:     number;
  prefix?:   string;
  suffix?:   string;
  className?: string;
  style?:    React.CSSProperties;
}) {
  const [display,     setDisplay]     = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevRef                       = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) { prevRef.current = value; return; }
    setIsAnimating(true);
    const start     = prevRef.current;
    const diff      = value - start;
    const startTime = Date.now();
    const duration  = 600;

    function tick() {
      const elapsed  = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * ease));
      if (progress < 1) requestAnimationFrame(tick);
      else { setIsAnimating(false); prevRef.current = value; }
    }
    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span className={clsx(className, isAnimating && 'text-emerald-400')} style={style}>
      {prefix}{display.toLocaleString()}{suffix}
    </span>
  );
}

// ── Live stats ticker ─────────────────────────────────────────────────────────

function LiveStatsTicker() {
  const [stats, setStats] = useState({
    visitors:    247,
    orders:      89,
    revenue:     12450,
    conversion:  3.8,
  });

  const fireConfetti = useCallback(() => {
    confetti({
      particleCount: 80,
      spread:        60,
      origin:        { y: 0.6 },
      colors:        ['#22d98a', '#4d9cf8', '#a78bfa', '#f5a623'],
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setStats((prev) => {
        const newOrders  = Math.random() > 0.65 ? 1 : 0;
        const newRevenue = newOrders ? Math.floor(Math.random() * 180 + 40) : 0;

        if (prev.orders + newOrders === 100 && prev.orders < 100) fireConfetti();
        if (prev.revenue + newRevenue >= 15000 && prev.revenue < 15000) fireConfetti();

        return {
          visitors:   Math.max(80, prev.visitors + Math.floor(Math.random() * 14) - 7),
          orders:     prev.orders + newOrders,
          revenue:    prev.revenue + newRevenue,
          conversion: parseFloat(Math.min(9, Math.max(1.5, prev.conversion + (Math.random() * 0.3 - 0.15))).toFixed(1)),
        };
      });
    }, 4000);
    return () => clearInterval(t);
  }, [fireConfetti]);

  const tiles = [
    {
      icon:  '◎',
      label: 'Live visitors',
      color: '#22d98a',
      value: <AnimatedNumber value={stats.visitors} className="text-base font-bold font-['Syne',sans-serif]" style={{ color: 'var(--text)' }} />,
      sub:   <span className="text-[10px] text-emerald-400">● Live</span>,
      ping:  true,
    },
    {
      icon:  '◈',
      label: 'Orders today',
      color: '#4d9cf8',
      value: <AnimatedNumber value={stats.orders} className="text-base font-bold font-['Syne',sans-serif]" style={{ color: 'var(--text)' }} />,
      sub:   stats.orders >= 100 ? <span className="text-[10px] text-amber-400">🏆 Milestone!</span> : null,
      ping:  false,
    },
    {
      icon:  '$',
      label: 'Revenue today',
      color: '#a78bfa',
      value: <AnimatedNumber value={stats.revenue} prefix="$" className="text-base font-bold font-['Syne',sans-serif]" style={{ color: 'var(--text)' }} />,
      sub:   null,
      ping:  false,
    },
    {
      icon:  '%',
      label: 'Conversion',
      color: '#f5a623',
      value: <span className="text-base font-bold font-['Syne',sans-serif]" style={{ color: 'var(--text)' }}>{stats.conversion}%</span>,
      sub:   <span className={clsx('text-[10px]', stats.conversion >= 4 ? 'text-emerald-400' : 'text-red-400')}>
               {stats.conversion >= 4 ? '▲ above avg' : '▼ below avg'}
             </span>,
      ping:  false,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: 'var(--surface)',
            border:          '1px solid var(--border)',
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 relative"
            style={{ backgroundColor: tile.color + '22', color: tile.color }}
          >
            {tile.icon}
            {tile.ping && (
              <span className="absolute top-0 right-0 w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: tile.color }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: tile.color }} />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[9px] tracking-widest uppercase mb-0.5" style={{ color: 'var(--text3)' }}>
              {tile.label}
            </p>
            {tile.value}
            {tile.sub && <div className="mt-0.5">{tile.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Live activity feed ────────────────────────────────────────────────────────

const ACTIVITY_COLORS = ['#22d98a', '#4d9cf8', '#a78bfa', '#f5a623', '#f06291', '#4dd0e1'];
const ACTIVITY_MESSAGES = [
  { icon: '◎', text: 'New order from Alex M.',      amount: '$247', type: 'order'    },
  { icon: '◉', text: 'Visitor from Lagos, Nigeria', amount: null,   type: 'visitor'  },
  { icon: '◈', text: 'Wireless Headphones trending', amount: null,   type: 'product'  },
  { icon: '◐', text: 'Campaign ROAS hit 4.2x',      amount: null,   type: 'campaign' },
  { icon: '▦', text: 'New customer registered',      amount: null,   type: 'customer' },
  { icon: '↑', text: 'Revenue milestone reached',    amount: '$15k', type: 'milestone'},
];

interface ActivityItem {
  id:      number;
  icon:    string;
  text:    string;
  amount:  string | null;
  type:    string;
  color:   string;
  time:    string;
  isNew:   boolean;
}

function LiveActivityFeed() {
  const [items, setItems] = useState<ActivityItem[]>([
    { id: 1, ...ACTIVITY_MESSAGES[0], color: '#22d98a', time: 'Just now', isNew: false },
    { id: 2, ...ACTIVITY_MESSAGES[1], color: '#4d9cf8', time: '2m ago',   isNew: false },
    { id: 3, ...ACTIVITY_MESSAGES[2], color: '#a78bfa', time: '5m ago',   isNew: false },
    { id: 4, ...ACTIVITY_MESSAGES[3], color: '#f5a623', time: '11m ago',  isNew: false },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      const src   = ACTIVITY_MESSAGES[Math.floor(Math.random() * ACTIVITY_MESSAGES.length)];
      const color = ACTIVITY_COLORS[Math.floor(Math.random() * ACTIVITY_COLORS.length)];
      setItems((prev) => [
        { id: Date.now(), ...src, color, time: 'Just now', isNew: true },
        ...prev.slice(0, 5).map((i) => ({ ...i, isNew: false })),
      ]);
    }, 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <Panel>
      <PanelHeader title="Live activity">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono text-[10px] text-emerald-400">Real-time</span>
        </div>
      </PanelHeader>

      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-3 px-[18px] py-3 transition-all duration-500"
            style={{
              borderBottom:    i < items.length - 1 ? '1px solid var(--border)' : 'none',
              backgroundColor: item.isNew ? item.color + '08' : 'transparent',
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
              style={{ backgroundColor: item.color + '22', color: item.color }}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate font-medium" style={{ color: 'var(--text)' }}>
                {item.text}
              </p>
              {item.amount && (
                <p className="text-[11px] font-mono font-bold" style={{ color: item.color }}>
                  {item.amount}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
              <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
                {item.time}
              </span>
              {item.isNew && (
                <span
                  className="font-mono text-[8px] px-1.5 py-0.5 rounded-full animate-pulse"
                  style={{ backgroundColor: item.color + '22', color: item.color }}
                >
                  new
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ── Welcome banner ────────────────────────────────────────────────────────────

function WelcomeBanner({ name, lastUpdate }: { name: string; lastUpdate: string }) {
  const hour    = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' :
    hour < 17 ? 'Good afternoon' :
    'Good evening';

  const messages = [
    'Your store is performing above average today.',
    'Revenue is trending up this week.',
    'You have 3 campaigns running right now.',
    'Customer retention improved 4% this month.',
  ];
  const msg = messages[new Date().getDay() % messages.length];

  return (
    <div
      className="relative overflow-hidden rounded-2xl px-5 py-4"
      style={{
        background: 'linear-gradient(135deg, var(--surface), var(--surface2))',
        border:     '1px solid var(--border)',
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none"
        style={{ backgroundColor: '#22d98a08', transform: 'translate(30%, -30%)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full blur-2xl pointer-events-none"
        style={{ backgroundColor: '#4d9cf808', transform: 'translate(-20%, 30%)' }}
      />

      <div className="relative flex items-center justify-between flex-wrap gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: '#22d98a22' }}
          >
            {hour < 12 ? '🌅' : hour < 17 ? '☀' : '🌙'}
          </div>
          <div>
            <h2
              className="font-['Syne',sans-serif] text-lg font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              {greeting}, {name.split(' ')[0]}!
            </h2>
            <p className="text-xs" style={{ color: 'var(--text2)' }}>
              {msg}
            </p>
          </div>
        </div>

        {/* Right — streak + update */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="text-xl">🔥</span>
              <span
                className="font-['Syne',sans-serif] text-2xl font-bold"
                style={{ color: 'var(--text)' }}
              >
                7
              </span>
            </div>
            <p className="font-mono text-[10px] tracking-wider" style={{ color: 'var(--text3)' }}>
              DAY STREAK
            </p>
          </div>

          <div
            className="h-8 w-px"
            style={{ backgroundColor: 'var(--border)' }}
          />

          <div className="text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-mono text-[11px] text-emerald-400 font-bold">LIVE</span>
            </div>
            <p className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
              {lastUpdate || 'Syncing...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Quick actions FAB ─────────────────────────────────────────────────────────

function QuickActionFab({ onExport, onShare }: {
  onExport: () => void;
  onShare:  () => void;
}) {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: '↓', label: 'Export CSV',    color: '#22d98a', fn: () => { onExport(); setOpen(false); } },
    { icon: '⎋', label: 'Share view',   color: '#4d9cf8', fn: () => { onShare();  setOpen(false); } },
    { icon: '◎', label: 'Set alert',    color: '#f5a623', fn: () => { triggerAnomalyToast('🔔 Alert feature coming soon!'); setOpen(false); } },
    { icon: '✦', label: 'AI Insight',   color: '#a78bfa', fn: () => { triggerAnomalyToast('✨ Revenue expected +12% this week'); setOpen(false); } },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-2">
      {open && (
        <div
          className="fixed inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {open && actions.map((a, i) => (
        <button
          key={a.label}
          onClick={a.fn}
          className="relative z-10 flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-xl transition-all hover:scale-105 animate-slide-up"
          style={{
            backgroundColor: 'var(--surface)',
            border:          '1px solid var(--border)',
            animationDelay:  `${i * 40}ms`,
          }}
        >
          <span className="text-sm" style={{ color: 'var(--text)' }}>{a.label}</span>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ backgroundColor: a.color + '22', color: a.color }}
          >
            {a.icon}
          </div>
        </button>
      ))}

      <button
        onClick={() => setOpen((v) => !v)}
        className="relative z-10 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 text-xl text-white"
        style={{
          background:  open
            ? '#ff5757'
            : 'linear-gradient(135deg, #22d98a, #16b974)',
          boxShadow:   '0 8px 32px #22d98a55',
          transform:   open ? 'rotate(45deg)' : 'rotate(0deg)',
        }}
      >
        {open ? '✕' : '✦'}
      </button>
    </div>
  );
}

// ── Insight cards ─────────────────────────────────────────────────────────────

function InsightCards({ filteredData }: { filteredData: DailyDataPoint[] }) {
  const totalRev  = filteredData.reduce((a, d) => a + d.revenue, 0);
  const totalOrd  = filteredData.reduce((a, d) => a + d.orders, 0);
  const peakDay   = filteredData.reduce((a, d) => d.revenue > a.revenue ? d : a, filteredData[0]);
  const avgRev    = totalRev / filteredData.length;
  const anomalies = filteredData.filter((d) => d.isAnomaly).length;

  const insights = [
    {
      icon:  '📈',
      label: 'Best day',
      value: peakDay?.date ?? '—',
      sub:   `$${Math.round(peakDay?.revenue ?? 0).toLocaleString()}`,
      color: '#22d98a',
    },
    {
      icon:  '◎',
      label: 'Daily average',
      value: `$${Math.round(avgRev).toLocaleString()}`,
      sub:   `${totalOrd} total orders`,
      color: '#4d9cf8',
    },
    {
      icon:  '⚠',
      label: 'Anomalies',
      value: anomalies.toString(),
      sub:   anomalies > 0 ? 'Requires attention' : 'All clear',
      color: anomalies > 0 ? '#f5a623' : '#22d98a',
    },
    {
      icon:  '↗',
      label: 'Trend',
      value: totalRev > avgRev * filteredData.length * 0.5 ? 'Positive' : 'Stable',
      sub:   'vs previous period',
      color: '#a78bfa',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {insights.map((ins) => (
        <div
          key={ins.label}
          className="rounded-xl p-3 flex items-center gap-3 transition-all hover:scale-[1.02]"
          style={{
            backgroundColor: 'var(--surface)',
            border:          '1px solid var(--border)',
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
            style={{ backgroundColor: ins.color + '22' }}
          >
            {ins.icon}
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'var(--text3)' }}>
              {ins.label}
            </p>
            <p
              className="font-['Syne',sans-serif] text-sm font-bold truncate"
              style={{ color: ins.color }}
            >
              {ins.value}
            </p>
            <p className="text-[10px] truncate" style={{ color: 'var(--text3)' }}>
              {ins.sub}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function OverviewPage() {
  useUrlState();

  const { orders: liveOrders_, connected, orderCount, clearOrders } = useRealtimeOrders();
  const [drillPoint,        setDrillPoint]        = useState<DrillPoint | null>(null);
  const [kpiDrillKey,       setKpiDrillKey]       = useState<MetricKey | null>(null);
  const [showComparison,    setShowComparison]    = useState(false);
  const [liveChartEnabled,  setLiveChartEnabled]  = useState(true);

  const { annotations, addAnnotation, removeAnnotation, clearAll } = useChartAnnotations();

  const {
    activeMetric, timeRange, chartType,
    setActiveMetric, setTimeRange, setChartType,
  } = useDashboardStore();

  const { profile } = useDashboardStore();

  // Filter state — must be declared before API calls that use it
  const {
    search, statusFilter, filteredOrders,
    setSearch, setStatusFilter,
  } = useOrderFilter(ORDERS);

  // API calls
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

  // Resolve data
  const liveOrders   = (ordersData   as Order[]   | null) ?? ORDERS;
  const liveProducts = (productsData as Product[] | null) ?? PRODUCTS;

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

  const { liveData, lastUpdate } = useRealtimeChart(
    filteredData, liveChartEnabled, 4000
  );

  useEffect(() => {
    if (hasAnomaly) {
      triggerAnomalyToast('⚠ Revenue spike detected — Mar 15 (+187% vs 7-day avg)');
    }
  }, [hasAnomaly]);

  function handleExport() {
    exportToCsv(
      'orders-export',
      (ordersData ? liveOrders : filteredOrders).map((o) => ({
        id: o.id, customer: o.customer,
        amount: o.amount, status: o.status, date: o.date,
      }))
    );
    triggerAnomalyToast('📊 CSV exported successfully!');
  }

  function handleShareView() {
    navigator.clipboard.writeText(window.location.href);
    triggerAnomalyToast('🔗 Link copied to clipboard!');
  }

  return (
    <div className="flex flex-col gap-3 p-3 md:p-5">

      {/* Loading */}
      {metricsLoading && (
        <div
          className="fixed top-4 right-4 font-mono text-[11px] px-3 py-1.5 rounded-lg z-50 flex items-center gap-2"
          style={{
            backgroundColor: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text3)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Syncing data...
        </div>
      )}

      {/* ── Welcome banner ──────────────────────────────────────────────── */}
      <WelcomeBanner
        name={profile.displayName}
        lastUpdate={lastUpdate}
      />

      {/* ── Page header + controls ──────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="font-mono text-[11px] transition-colors flex items-center gap-1"
            style={{ color: 'var(--text3)' }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { e.currentTarget.style.color = 'var(--text3)'; }}
          >
            ← Back to site
          </Link>
          <div
            className="h-4 w-px"
            style={{ backgroundColor: 'var(--border)' }}
          />
          <div>
            <h1
              className="font-['Syne',sans-serif] text-xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Overview
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExport}
            className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:scale-105"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            ↓ Export CSV
          </button>

          <button
            onClick={handleShareView}
            className="text-xs px-3 py-1.5 rounded-lg border transition-all hover:scale-105"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            ⎋ Share
          </button>

          {/* Time range */}
          <div
            className="flex gap-0.5 p-0.5 rounded-lg"
            style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}
          >
            {(['7d', '30d', '90d', 'ytd'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className="font-mono text-[11px] px-3 py-1.5 rounded-md transition-all duration-150"
                style={{
                  backgroundColor: timeRange === r ? 'var(--surface3)' : 'transparent',
                  color:           timeRange === r ? 'var(--text)'     : 'var(--text3)',
                  border:          timeRange === r ? '1px solid var(--border2)' : '1px solid transparent',
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Live stats ticker ────────────────────────────────────────────── */}
      <LiveStatsTicker />

      {/* ── KPI cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.key}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <KpiCard
              metricKey={kpi.key}
              label={kpi.label}
              value={kpi.value}
              delta={kpi.delta}
              deltaType={kpi.deltaType}
              subtext={kpi.subtext}
              sparkData={sparkData[kpi.key]}
              sparkColor={SPARK_COLORS[kpi.key]}
              isActive={activeMetric === kpi.key}
              onClick={(key) => {
                setActiveMetric(key);
                setKpiDrillKey(key);
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Insight strip ────────────────────────────────────────────────── */}
      <InsightCards filteredData={filteredData} />

      {/* ── Main chart + Live activity ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">
        <Panel>
          <PanelHeader title={CHART_TITLE[activeMetric]}>
            <div className="flex flex-wrap items-center gap-1.5">
              {/* Comparison */}
              <button
                onClick={() => setShowComparison((v) => !v)}
                className="font-mono text-[10px] px-2 py-1 rounded transition-all"
                style={{
                  backgroundColor: showComparison ? '#4d9cf822' : 'transparent',
                  border:          showComparison ? '1px solid #4d9cf855' : '1px solid var(--border)',
                  color:           showComparison ? '#4d9cf8'             : 'var(--text3)',
                }}
              >
                vs prev
              </button>

              {/* Live */}
              <button
                onClick={() => setLiveChartEnabled((v) => !v)}
                className="font-mono text-[10px] px-2 py-1 rounded transition-all flex items-center gap-1"
                style={{
                  backgroundColor: liveChartEnabled ? '#22d98a22' : 'transparent',
                  border:          liveChartEnabled ? '1px solid #22d98a55' : '1px solid var(--border)',
                  color:           liveChartEnabled ? '#22d98a'             : 'var(--text3)',
                }}
              >
                {liveChartEnabled && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
                Live
              </button>

              {/* Annotations */}
              <AnnotationPanel
                annotations={annotations}
                availableDates={filteredData.map((d) => d.date)}
                onAdd={addAnnotation}
                onRemove={removeAnnotation}
                onClearAll={clearAll}
              />

              {/* Bar / Line */}
              <div
                className="flex gap-0.5 p-0.5 rounded-md"
                style={{ backgroundColor: 'var(--surface2)' }}
              >
                {(['bar', 'line'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className="font-mono text-[10px] px-2 py-1 rounded capitalize transition-all"
                    style={{
                      backgroundColor: chartType === t ? 'var(--surface3)' : 'transparent',
                      color:           chartType === t ? 'var(--text)'     : 'var(--text3)',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </PanelHeader>

          {hasAnomaly && (
            <div
              className="mx-[18px] mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs"
              style={{
                backgroundColor: 'var(--amber-dim)',
                border:          '1px solid var(--amber)',
                color:           'var(--amber)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
              <strong>Anomaly detected:</strong>&nbsp;
              Revenue spike on Mar 15 (+187% vs 7-day avg). Likely flash sale event.
            </div>
          )}

          <div className="p-4">
            <RevenueChart
              data={liveData}
              previousData={showComparison ? previousData : []}
              activeMetric={activeMetric}
              chartType={chartType}
              annotations={annotations}
              showComparison={showComparison}
              isLive={liveChartEnabled}
              lastUpdate={lastUpdate}
              onBarClick={(point) => setDrillPoint(point)}
            />
          </div>
        </Panel>

        <LiveActivityFeed />
      </div>

      {/* ── Geo + Funnel ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Panel>
          <PanelHeader title="Revenue by region" />
          <GeoList regions={GEO_REGIONS} />
        </Panel>

        <Panel>
          <PanelHeader title="Conversion funnel" />
          <FunnelChart steps={FUNNEL_STEPS} />
        </Panel>
      </div>

      {/* ── Products + Channel ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-3">
        <Panel>
          <PanelHeader title="Top products" />
          <div className="overflow-x-auto">
            <ProductsTable
              products={sortedProducts}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={toggleSort}
            />
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Channel performance" />
          <ChannelDonut data={CHANNEL_DATA} />
        </Panel>
      </div>

      {/* ── Orders + Live feed ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
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
            <div className="overflow-x-auto">
              <OrdersTable
                orders={ordersData ? liveOrders : filteredOrders}
                search={search}
                statusFilter={statusFilter}
                onSearchChange={setSearch}
                onStatusChange={setStatusFilter}
              />
            </div>
          </Panel>
        </div>

        <Panel>
          <PanelHeader title="Live order feed">
            <div className="flex items-center gap-1.5">
              {orderCount > 0 && (
                <span
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: '#22d98a22', color: '#22d98a' }}
                >
                  +{orderCount}
                </span>
              )}
              {connected && (
                <span className="flex items-center gap-1">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
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
      </div>

      {/* ── Quick action FAB ─────────────────────────────────────────────── */}
      <QuickActionFab
        onExport={handleExport}
        onShare={handleShareView}
      />

      {/* ── Modals ───────────────────────────────────────────────────────── */}
      {drillPoint && (
        <DrillDownModal
          point={drillPoint}
          onClose={() => setDrillPoint(null)}
        />
      )}

      {kpiDrillKey && (
        <KpiDrillDown
          metricKey={kpiDrillKey}
          label={kpis.find((k) => k.key === kpiDrillKey)?.label ?? kpiDrillKey}
          data={filteredData}
          previousData={previousData}
          color={DRILL_COLORS[kpiDrillKey]}
          onClose={() => setKpiDrillKey(null)}
        />
      )}
    </div>
  );
}