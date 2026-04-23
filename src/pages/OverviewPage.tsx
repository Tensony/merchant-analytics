import { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useRealtimeChart } from '../hooks/useRealtimeChart';
import { useChartAnnotations } from '../hooks/useChartAnnotations';
import { KpiDrillDown } from '../components/ui/KpiDrillDown';
import { AnnotationPanel } from '../components/ui/AnnotationPanel';
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
import { 
  TrendingUp, TrendingDown, Users, Clock, Zap, 
  ArrowRight, Activity, BarChart3, Eye, DollarSign,
  Sparkles, Gift, Rocket, Target, Award, Crown,
  Bell, ShoppingBag, Globe, Smartphone, Monitor
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALL_DATA = generateDailyData(90);

const RANGE_DAYS: Record<string, number> = {
  '7d': 7, '30d': 30, '90d': 90, 'ytd': 90,
};

const SPARK_COLORS: Record<MetricKey, string> = {
  revenue: '#22d98a',
  orders: '#4d9cf8',
  aov: '#a78bfa',
  churn: '#ff5757',
};

const DRILL_COLORS: Record<MetricKey, string> = {
  revenue: '#22d98a',
  orders: '#4d9cf8',
  aov: '#a78bfa',
  churn: '#ff5757',
};

const CHART_TITLE: Record<MetricKey, string> = {
  revenue: 'Revenue over time',
  orders: 'Order volume over time',
  aov: 'Average order value over time',
  churn: 'Churn rate over time',
};

// ---------------------------------------------------------------------------
// Animated Number Component
// ---------------------------------------------------------------------------

function AnimatedNumber({ value, prefix = '', suffix = '', className = '', duration = 800, style }: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  style?: React.CSSProperties;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setIsAnimating(true);
      const startValue = prevValueRef.current;
      const diff = value - startValue;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = startValue + diff * easeOutQuart;
        
        setDisplayValue(Math.round(current));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          prevValueRef.current = value;
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      prevValueRef.current = value;
    }
  }, [value, duration]);

  return (
    <span className={clsx(className, isAnimating && 'animate-pulse')} style={style}>
      {prefix}{displayValue.toLocaleString()}{suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Enhanced Live Stats Ticker with Confetti
// ---------------------------------------------------------------------------

function LiveStatsTicker() {
  const [stats, setStats] = useState({
    activeVisitors: 247,
    todayOrders: 89,
    todayRevenue: 12450,
    conversionRate: 3.8,
  });
  const [celebrating, setCelebrating] = useState<string | null>(null);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22d98a', '#4d9cf8', '#a78bfa', '#f5a623'],
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const newOrders = Math.random() > 0.7 ? 1 : 0;
        const newRevenue = Math.random() > 0.7 ? Math.floor(Math.random() * 200) + 50 : 0;
        
        // Trigger celebration on milestone
        if (prev.todayOrders + newOrders >= 100 && prev.todayOrders < 100) {
          setCelebrating('orders');
          triggerConfetti();
          setTimeout(() => setCelebrating(null), 3000);
        }
        if (prev.todayRevenue + newRevenue >= 15000 && prev.todayRevenue < 15000) {
          setCelebrating('revenue');
          triggerConfetti();
          setTimeout(() => setCelebrating(null), 3000);
        }
        
        return {
          activeVisitors: Math.max(100, prev.activeVisitors + Math.floor(Math.random() * 20) - 10),
          todayOrders: prev.todayOrders + newOrders,
          todayRevenue: prev.todayRevenue + newRevenue,
          conversionRate: Math.min(8, Math.max(2, prev.conversionRate + (Math.random() * 0.4 - 0.2))),
        };
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [triggerConfetti]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
      {/* Live Visitors */}
      <div 
        className={clsx(
          "flex items-center gap-3 p-3 rounded-xl border transition-all duration-500",
          "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
          celebrating === 'visitors' && "animate-border-glow"
        )}
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-400/20 rounded-lg animate-ping" />
          <div className="relative p-2 rounded-lg" style={{ backgroundColor: '#22d98a22' }}>
            <Eye size={16} className="text-emerald-400" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text3)' }}>
            Live Visitors
          </p>
          <div className="flex items-center gap-2">
            <AnimatedNumber value={stats.activeVisitors} className="text-lg font-bold" style={{ color: 'var(--text)' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <TrendingUp size={12} className="text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Orders Today */}
      <div 
        className={clsx(
          "flex items-center gap-3 p-3 rounded-xl border transition-all duration-500",
          "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
          celebrating === 'orders' && "animate-border-glow"
        )}
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="relative">
          {celebrating === 'orders' && (
            <div className="absolute -top-1 -right-1 animate-bounce">
              <Crown size={14} className="text-amber-400" />
            </div>
          )}
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#4d9cf822' }}>
            <ShoppingBag size={16} className="text-blue-400" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text3)' }}>
            Orders Today
          </p>
          <div className="flex items-center gap-1">
            <AnimatedNumber value={stats.todayOrders} className="text-lg font-bold" style={{ color: 'var(--text)' }} />
            {stats.todayOrders >= 100 && <Award size={14} className="text-amber-400" />}
          </div>
        </div>
      </div>

      {/* Revenue Today */}
      <div 
        className={clsx(
          "flex items-center gap-3 p-3 rounded-xl border transition-all duration-500",
          "hover:scale-[1.02] hover:shadow-lg cursor-pointer",
          celebrating === 'revenue' && "animate-border-glow"
        )}
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="relative">
          {celebrating === 'revenue' && (
            <div className="absolute -top-1 -right-1">
              <Sparkles size={14} className="text-amber-400 animate-spin" />
            </div>
          )}
          <div className="p-2 rounded-lg" style={{ backgroundColor: '#a78bfa22' }}>
            <DollarSign size={16} className="text-purple-400" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text3)' }}>
            Revenue Today
          </p>
          <AnimatedNumber 
            value={stats.todayRevenue} 
            prefix="$" 
            className="text-lg font-bold" 
            style={{ color: 'var(--text)' }} 
          />
        </div>
      </div>

      {/* Conversion Rate */}
      <div 
        className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 hover:scale-[1.02] hover:shadow-lg cursor-pointer"
        style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#f5a62322' }}>
          <Target size={16} className="text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text3)' }}>
            Conversion
          </p>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              {stats.conversionRate.toFixed(1)}%
            </span>
            {stats.conversionRate >= 4 ? (
              <TrendingUp size={12} className="text-emerald-400" />
            ) : (
              <TrendingDown size={12} className="text-red-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Enhanced Live Activity Feed with Animations
// ---------------------------------------------------------------------------

function LiveActivityFeed() {
  const [activities, setActivities] = useState([
    { id: 1, type: 'order', message: 'New order from Chioma E.', amount: '$740', time: 'Just now', color: '#22d98a', icon: ShoppingBag },
    { id: 2, type: 'visitor', message: 'Visitor from Lagos, NG', time: '2m ago', color: '#4d9cf8', icon: Globe },
    { id: 3, type: 'product', message: 'Wireless Headphones trending', time: '5m ago', color: '#a78bfa', icon: Zap },
    { id: 4, type: 'campaign', message: 'Spring Sale campaign launched', time: '12m ago', color: '#f06291', icon: Rocket },
  ]);
  const [newActivityId, setNewActivityId] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const icons = [ShoppingBag, Globe, Zap, Rocket, Bell, Gift];
      const messages = [
        'New order from Sarah K.', 
        'Visitor from Nairobi, KE', 
        'Smart Watch trending',
        'Flash Sale started',
        'Milestone: 1000 orders!',
        'New customer signed up'
      ];
      const colors = ['#22d98a', '#4d9cf8', '#a78bfa', '#f5a623', '#f06291', '#4dd0e1'];
      
      const newActivity = {
        id: Date.now(),
        type: ['order', 'visitor', 'product', 'campaign', 'milestone'][Math.floor(Math.random() * 5)] as any,
        message: messages[Math.floor(Math.random() * messages.length)],
        amount: Math.random() > 0.5 ? '$' + (Math.floor(Math.random() * 500) + 50) : undefined,
        time: 'Just now',
        color: colors[Math.floor(Math.random() * colors.length)],
        icon: icons[Math.floor(Math.random() * icons.length)],
      };
      
      setNewActivityId(newActivity.id);
      setActivities(prev => [newActivity, ...prev.slice(0, 5)]);
      
      setTimeout(() => setNewActivityId(null), 2000);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Panel>
      <PanelHeader title="Live Activity">
        <div className="flex items-center gap-1">
          <Zap size={14} className="text-emerald-400 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
      </PanelHeader>
      <div className="p-2">
        {activities.map((activity, i) => {
          const IconComponent = activity.icon;
          const isNew = activity.id === newActivityId;
          
          return (
            <div
              key={activity.id}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-500",
                isNew && "animate-slideIn bg-gradient-to-r from-emerald-400/10 to-transparent"
              )}
              style={{ 
                borderBottom: i < activities.length - 1 ? '1px solid var(--border)' : 'none'
              }}
            >
              <div className="relative">
                <div 
                  className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    isNew && "animate-scale-pulse"
                  )}
                  style={{ backgroundColor: activity.color + '22' }}
                >
                  <IconComponent size={14} style={{ color: activity.color }} />
                </div>
                {isNew && (
                  <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate font-medium" style={{ color: 'var(--text)' }}>
                  {activity.message}
                </p>
                {activity.amount && (
                  <p className="text-[11px] font-mono font-bold" style={{ color: activity.color }}>
                    {activity.amount}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-[10px] font-mono" style={{ color: 'var(--text3)' }}>
                  {activity.time}
                </span>
                {isNew && (
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 animate-pulse">
                    NEW
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Floating Action Button with Quick Actions
// ---------------------------------------------------------------------------

function QuickActionFab() {
  const [isOpen, setIsOpen] = useState(false);
  const { addNotification } = useDashboardStore();

  const actions = [
    { icon: TrendingUp, label: 'Export Report', color: '#22d98a', action: () => {
      addNotification({ type: 'system', title: 'Report Exported', message: 'Your report has been generated.' });
      triggerAnomalyToast('📊 Report exported successfully!');
    }},
    { icon: Bell, label: 'Set Alert', color: '#f5a623', action: () => {
      addNotification({ type: 'anomaly', title: 'Alert Set', message: 'You will be notified of anomalies.' });
      triggerAnomalyToast('🔔 Alert configured!');
    }},
    { icon: Sparkles, label: 'Quick Insight', color: '#a78bfa', action: () => {
      addNotification({ type: 'system', title: 'AI Insight', message: 'Revenue expected to grow 12% this week.' });
      triggerAnomalyToast('✨ AI Insight generated!');
    }},
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Action buttons */}
      <div className="flex flex-col-reverse items-end gap-3">
        {isOpen && actions.map((action, i) => {
          const Icon = action.icon;
          return (
            <button
              key={i}
              onClick={() => {
                action.action();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl transition-all animate-slide-up hover:scale-105"
              style={{ 
                backgroundColor: 'var(--surface)', 
                border: '1px solid var(--border)',
                animationDelay: `${i * 50}ms`
              }}
            >
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                {action.label}
              </span>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: action.color + '22' }}
              >
                <Icon size={18} style={{ color: action.color }} />
              </div>
            </button>
          );
        })}
        
        {/* Main FAB */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300",
            "hover:scale-110 hover:shadow-emerald-500/30",
            isOpen ? "rotate-45 bg-red-500" : "bg-gradient-to-br from-emerald-500 to-emerald-600"
          )}
          style={{ boxShadow: '0 8px 32px #22d98a44' }}
        >
          <Sparkles size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Welcome Banner with Streak Counter
// ---------------------------------------------------------------------------

function WelcomeBanner() {
  const [streak, setStreak] = useState(7);
  const { profile } = useDashboardStore();

  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-4 mb-3 animate-gradient"
      style={{
        background: 'linear-gradient(135deg, #22d98a11, #4d9cf811, #a78bfa11)',
        border: '1px solid var(--border)',
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 rounded-full blur-2xl" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              Welcome back, {profile.displayName.split(' ')[0]}!
            </h2>
            <p className="text-xs" style={{ color: 'var(--text2)' }}>
              Your store is performing well today
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-2xl">🔥</span>
              <span className="text-xl font-bold" style={{ color: 'var(--text)' }}>{streak}</span>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text3)' }}>
                Day Streak
              </p>
              <p className="text-[11px] font-medium text-emerald-400">
                +12% vs yesterday
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function OverviewPage() {
  // ── 1. URL state sync ────────────────────────────────────────────────────
  useUrlState();
  const { orders: liveOrders_, connected, orderCount, clearOrders } = useRealtimeOrders();
  const [drillPoint, setDrillPoint] = useState<DrillPoint | null>(null);
  
  // New state for enhanced features
  const [kpiDrillKey, setKpiDrillKey] = useState<MetricKey | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [liveChartEnabled, setLiveChartEnabled] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('Just now');
  const [pageLoaded, setPageLoaded] = useState(false);

  const { annotations, addAnnotation, removeAnnotation, clearAll } = useChartAnnotations();

  // ── 2. Global store ──────────────────────────────────────────────────────
  const {
    activeMetric,
    timeRange,
    chartType,
    setActiveMetric,
    setTimeRange,
    setChartType,
  } = useDashboardStore();

  // ── 3. Local filter state ─────────────────────────────────────────────────
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
  const liveOrders = (ordersData as Order[] | null) ?? ORDERS;
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
    orders: filteredData.slice(-14).map((d: DailyDataPoint) => d.orders),
    aov: filteredData.slice(-14).map((d: DailyDataPoint) => d.aov),
    churn: filteredData.slice(-14).map((d: DailyDataPoint) => d.churn),
  }), [filteredData]);

  const hasAnomaly = activeMetric === 'revenue' && filteredData.some((d: DailyDataPoint) => d.isAnomaly);

  // Real-time chart hook
  const { liveData, isAnimating, lastUpdate } = useRealtimeChart(
    filteredData,
    liveChartEnabled,
    4000
  );

  // Update last update time
  useEffect(() => {
    if (lastUpdate) {
      setLastUpdateTime(lastUpdate);
    }
  }, [lastUpdate]);

  // Page load animation
  useEffect(() => {
    setPageLoaded(true);
  }, []);

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
        id: o.id,
        customer: o.customer,
        amount: o.amount,
        status: o.status,
        date: o.date,
      }))
    );
    triggerAnomalyToast('📊 CSV exported successfully!');
  }

  function handleShareView() {
    navigator.clipboard.writeText(window.location.href);
    triggerAnomalyToast('🔗 Link copied to clipboard!');
  }

  // ── 9. Render ─────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-3 p-3 md:p-6">
      {/* Loading indicator */}
      {metricsLoading && (
        <div
          className="fixed top-4 right-4 font-mono text-[11px] px-3 py-1.5 rounded-lg z-50 animate-pulse"
          style={{
            backgroundColor: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text3)',
          }}
        >
          <Sparkles size={14} className="inline mr-1 animate-spin" />
          Loading...
        </div>
      )}

      {/* Welcome Banner */}
      <WelcomeBanner />

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 mb-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden md:flex items-center gap-1.5 text-[11px] font-mono transition-colors hover:translate-x-[-2px]"
              style={{ color: 'var(--text3)' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.color = 'var(--text3)';
              }}
            >
              ← Home
            </Link>
            <div>
              <h1
                className="font-['Syne',sans-serif] text-xl md:text-2xl font-bold tracking-tight"
                style={{ color: 'var(--text)' }}
              >
                Overview
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] md:text-xs" style={{ color: 'var(--text3)' }}>
                  Last updated: {lastUpdateTime}
                </p>
                {liveChartEnabled && (
                  <span className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">LIVE</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Export CSV */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1 text-xs px-2 md:px-3 py-1.5 rounded-lg border transition-all hover:scale-105 hover:shadow-lg"
              style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ↓ <span className="hidden sm:inline">Export</span>
            </button>

            {/* Share view */}
            <button
              onClick={handleShareView}
              className="flex items-center gap-1 text-xs px-2 md:px-3 py-1.5 rounded-lg border transition-all hover:scale-105 hover:shadow-lg"
              style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--surface2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              ⎋ <span className="hidden sm:inline">Share</span>
            </button>

            {/* Time range selector */}
            <div
              className="flex gap-0.5 p-0.5 rounded-lg"
              style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}
            >
              {(['7d', '30d', '90d', 'ytd'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className="font-mono text-[10px] md:text-[11px] px-1.5 md:px-3 py-1.5 rounded-md transition-all duration-150 hover:scale-105"
                  style={{
                    backgroundColor: timeRange === r ? 'var(--surface3)' : 'transparent',
                    color: timeRange === r ? 'var(--text)' : 'var(--text3)',
                    border: timeRange === r ? '1px solid var(--border2)' : '1px solid transparent',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Stats Ticker */}
        <LiveStatsTicker />
      </div>

      {/* ── KPI cards with staggered animation ───────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.key}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
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

      {/* ── Main chart + Live Activity ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-3">
        <Panel>
          <PanelHeader title={CHART_TITLE[activeMetric]}>
            <div className="flex flex-wrap items-center gap-1 md:gap-2">
              {/* Comparison toggle */}
              <button
                onClick={() => setShowComparison((v) => !v)}
                className={clsx(
                  "font-mono text-[10px] md:text-[11px] px-2 py-1 rounded transition-all hover:scale-105",
                  showComparison && "animate-pulse"
                )}
                style={{
                  backgroundColor: showComparison ? '#4d9cf822' : 'transparent',
                  border: showComparison ? '1px solid #4d9cf855' : '1px solid var(--border)',
                  color: showComparison ? '#4d9cf8' : 'var(--text3)',
                }}
              >
                vs prev
              </button>

              {/* Live toggle */}
              <button
                onClick={() => setLiveChartEnabled((v) => !v)}
                className="font-mono text-[10px] md:text-[11px] px-2 py-1 rounded transition-all hover:scale-105 flex items-center gap-1"
                style={{
                  backgroundColor: liveChartEnabled ? '#22d98a22' : 'transparent',
                  border: liveChartEnabled ? '1px solid #22d98a55' : '1px solid var(--border)',
                  color: liveChartEnabled ? '#22d98a' : 'var(--text3)',
                }}
              >
                {liveChartEnabled && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                )}
                <span className="hidden sm:inline">Live</span>
              </button>

              {/* Annotations */}
              <AnnotationPanel
                annotations={annotations}
                availableDates={filteredData.map((d) => d.date)}
                onAdd={addAnnotation}
                onRemove={removeAnnotation}
                onClearAll={clearAll}
              />

              {/* Bar/Line toggle */}
              <div className="flex gap-0.5 p-0.5 rounded-md" style={{ backgroundColor: 'var(--surface2)' }}>
                {(['bar', 'line'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartType(t)}
                    className="font-mono text-[10px] md:text-[11px] px-1.5 md:px-2.5 py-1 rounded transition-all duration-150 capitalize hover:scale-105"
                    style={{
                      backgroundColor: chartType === t ? 'var(--surface3)' : 'transparent',
                      color: chartType === t ? 'var(--text)' : 'var(--text3)',
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
              className="mx-3 md:mx-[18px] mt-3 flex items-center gap-2 rounded-lg px-2 md:px-3 py-2 text-xs animate-border-glow"
              style={{
                backgroundColor: 'var(--amber-dim)',
                border: '1px solid var(--amber)',
                color: 'var(--amber)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </span>
              <span className="truncate">
                <strong>Anomaly detected:</strong> Mar 15 spike +187%
              </span>
            </div>
          )}

          <div className="p-2 md:p-4">
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

        {/* Live Activity Feed */}
        <LiveActivityFeed />
      </div>

      {/* ── Geo + Funnel Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Panel>
          <PanelHeader title="Revenue by region">
            <Globe size={14} style={{ color: 'var(--text3)' }} />
          </PanelHeader>
          <GeoList regions={GEO_REGIONS} />
        </Panel>

        <Panel>
          <PanelHeader title="Conversion funnel">
            <Target size={14} style={{ color: 'var(--text3)' }} />
          </PanelHeader>
          <FunnelChart steps={FUNNEL_STEPS} />
        </Panel>
      </div>

      {/* ── Products + Channel ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-3">
        <Panel>
          <PanelHeader title="Top products">
            <BarChart3 size={14} style={{ color: 'var(--text3)' }} />
          </PanelHeader>
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
          <PanelHeader title="Channel performance">
            <Monitor size={14} style={{ color: 'var(--text3)' }} />
          </PanelHeader>
          <ChannelDonut data={CHANNEL_DATA} />
        </Panel>
      </div>

      {/* ── Orders + Live Feed ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Panel>
          <PanelHeader title="Recent orders">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] md:text-[10px]" style={{ color: 'var(--text3)' }}>
                {ordersData ? liveOrders.length : filteredOrders.length} results
              </span>
              <button
                onClick={handleExport}
                className="font-mono text-[9px] md:text-[10px] px-2 py-0.5 rounded border transition-all hover:scale-105"
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

        <Panel>
          <PanelHeader title="Live order feed">
            <div className="flex items-center gap-2">
              {orderCount > 0 && (
                <span
                  className="font-mono text-[9px] md:text-[10px] px-1.5 py-0.5 rounded animate-pulse"
                  style={{ backgroundColor: '#22d98a22', color: '#22d98a' }}
                >
                  +{orderCount} today
                </span>
              )}
              {connected && (
                <span className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold">LIVE</span>
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

      {/* ── Quick Action FAB ─────────────────────────────────────────────── */}
      <QuickActionFab />

      {/* ── Drill-down modals ─────────────────────────────────────────────── */}
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