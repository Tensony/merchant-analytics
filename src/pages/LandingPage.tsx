import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { CountUp } from '../components/ui/CountUp';
import { TrustBadges } from '../components/ui/TrustBadges';
import { ParticleBackground } from '../components/ui/ParticleBackground';
import { TiltCard } from '../components/ui/TiltCard';
import { ArrowRight, Sparkles } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
  label:  string;
  href:   string;
  isHash: boolean;
}

interface Feature {
  icon:  string;
  title: string;
  desc:  string;
  color: string;
  tag:   string;
}

interface PricingTier {
  name:     string;
  price:    string;
  sub:      string;
  color:    string;
  popular:  boolean;
  features: string[];
  cta:      string;
  path:     string;
}

interface Testimonial {
  name:        string;
  role:        string;
  country:     string;
  avatar:      string;
  color:       string;
  quote:       string;
  metric:      string;
  metricLabel: string;
}

interface Stat {
  value: number;
  label: string;
  color: string;
  suffix?: string;
  prefix?: string;
}

interface Logo {
  name:    string;
  country: string;
}

interface Integration {
  name:  string;
  icon:  string;
  color: string;
}

interface DashboardScreen {
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface TimelineStep {
  step: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
  { label: 'Features',     href: '#features',     isHash: true  },
  { label: 'Pricing',      href: '#pricing',      isHash: true  },
  { label: 'Testimonials', href: '#testimonials', isHash: true  },
  { label: 'Integrations', href: '#integrations', isHash: true  },
];

const FEATURES: Feature[] = [
  {
    icon: '▦', title: 'Real-time overview',
    desc: 'Revenue, orders, AOV and churn live on one screen. No refresh needed.',
    color: '#22d98a', tag: 'Live data',
  },
  {
    icon: '◈', title: 'Anomaly detection',
    desc: 'Automatic spike and drop alerts catch problems before your customers do.',
    color: '#f5a623', tag: 'AI powered',
  },
  {
    icon: '◫', title: 'Product intelligence',
    desc: 'Know which products are trending, declining, and where margin comes from.',
    color: '#4d9cf8', tag: 'Insights',
  },
  {
    icon: '◉', title: 'Customer cohorts',
    desc: 'Month-by-month retention heatmaps. Spot churn risk before it costs you.',
    color: '#a78bfa', tag: 'Retention',
  },
  {
    icon: '◐', title: 'Campaign analytics',
    desc: 'ROAS, CTR and CVR across email, paid, social and SMS in one place.',
    color: '#f06291', tag: 'Marketing',
  },
  {
    icon: '↓', title: 'Export & sharing',
    desc: 'CSV export and shareable filtered URLs. Send reports in seconds.',
    color: '#4dd0e1', tag: 'Productivity',
  },
];

const PRICING: PricingTier[] = [
  {
    name: 'Starter', price: 'Free', sub: 'forever',
    color: '#8b90a0', popular: false,
    features: ['1 store', '30-day history', 'Core dashboard', 'CSV export', 'Email support'],
    cta: 'Start for free', path: '/register',
  },
  {
    name: 'Growth', price: '$19', sub: '/month',
    color: '#22d98a', popular: true,
    features: ['3 stores', '90-day history', 'Anomaly alerts', 'Email reports', 'Priority support'],
    cta: 'Start free trial', path: '/register',
  },
  {
    name: 'Pro', price: '$49', sub: '/month',
    color: '#4d9cf8', popular: false,
    features: ['Unlimited stores', 'Full history', 'Real-time feed', 'API access', 'Dedicated support'],
    cta: 'Start free trial', path: '/register',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Chioma Eze', role: 'Founder, ShopLagos', country: '🇳🇬',
    avatar: 'CE', color: '#22d98a',
    quote: 'We went from 3 hours of weekly reports to having everything live. The anomaly alerts saved us during Black Friday.',
    metric: '3hrs → 0', metricLabel: 'reporting time',
  },
  {
    name: 'Kwame Asante', role: 'Head of E-commerce, Accra Mart', country: '🇬🇭',
    avatar: 'KA', color: '#4d9cf8',
    quote: 'Finally a tool that understands African timezones and currencies. Cut churn by 18% in two months.',
    metric: '−18%', metricLabel: 'churn reduction',
  },
  {
    name: 'Amara Diallo', role: 'CEO, DakarStore', country: '🇸🇳',
    avatar: 'AD', color: '#a78bfa',
    quote: 'Clean, fast, affordable. We tried everything else. This gives us what we need at a fraction of the cost.',
    metric: '4.2x', metricLabel: 'ROI on Growth plan',
  },
];

const STATS: Stat[] = [
  { value: 2400, label: 'Stores tracked',    color: '#22d98a', suffix: '+' },
  { value: 48,  label: 'Revenue monitored',  color: '#4d9cf8', prefix: '$', suffix: 'M+' },
  { value: 14,   label: 'African countries', color: '#a78bfa' },
  { value: 99.9, label: 'Uptime SLA',        color: '#f5a623', suffix: '%' },
];

const LOGOS: Logo[] = [
  { name: 'ShopLagos',   country: '🇳🇬' },
  { name: 'Accra Mart',  country: '🇬🇭' },
  { name: 'DakarStore',  country: '🇸🇳' },
  { name: 'NairobiShop', country: '🇰🇪' },
  { name: 'ZedCommerce', country: '🇿🇲' },
  { name: 'CapeTrade',   country: '🇿🇦' },
  { name: 'KigaliMart',  country: '🇷🇼' },
  { name: 'AddisTrade',  country: '🇪🇹' },
];

const INTEGRATIONS: Integration[] = [
  { name: 'Shopify',     icon: '◈', color: '#96bf48' },
  { name: 'WooCommerce', icon: '◫', color: '#7f54b3' },
  { name: 'Flutterwave', icon: '◉', color: '#f5a623' },
  { name: 'M-Pesa',      icon: '▦', color: '#22d98a' },
  { name: 'Paystack',    icon: '◐', color: '#00c3f7' },
  { name: 'Jumia',       icon: '◑', color: '#f68b1e' },
];

const AVATAR_COLORS = ['#22d98a', '#4d9cf8', '#a78bfa', '#f5a623', '#f06291'];
const AVATAR_BG     = ['#22d98a22', '#4d9cf822', '#a78bfa22', '#f5a62322', '#f0629122'];
const AVATAR_INIT   = ['CE', 'KA', 'AD', 'TN', 'FH'];

const CHECKLIST = [
  'Works with Shopify, WooCommerce and more',
  'Supports ZMW, KES, NGN, GHS and 20+ currencies',
  'African timezone support built in',
  'GDPR and POPIA compliant',
];

const WHY_LOVE_US = [
  {
    icon: '⚡',
    title: 'Real-time analytics',
    desc: 'See your data update instantly as orders come in. No more waiting for end-of-day reports.',
    color: '#22d98a',
  },
  {
    icon: '🌍',
    title: 'African-first design',
    desc: 'Built for local payment methods, currencies, and timezones from day one.',
    color: '#4d9cf8',
  },
  {
    icon: '🔔',
    title: 'Smart alerts',
    desc: 'Get notified about anomalies and opportunities before they impact your bottom line.',
    color: '#f5a623',
  },
  {
    icon: '📊',
    title: 'Beautiful dashboards',
    desc: 'Professional, customizable reports that make you look good in every meeting.',
    color: '#a78bfa',
  },
  {
    icon: '🔌',
    title: 'Seamless integrations',
    desc: 'Connect with Shopify, WooCommerce, Flutterwave, M-Pesa, and more in minutes.',
    color: '#f06291',
  },
  {
    icon: '🤝',
    title: 'Dedicated support',
    desc: 'Real humans, real help. We\'re here when you need us, with African timezone coverage.',
    color: '#4dd0e1',
  },
];

const DASHBOARD_SCREENS: DashboardScreen[] = [
  {
    title: 'Overview Dashboard',
    description: 'All your key metrics in one beautiful place',
    color: '#22d98a',
    icon: '📊',
  },
  {
    title: 'Product Analytics',
    description: 'Track top-performing products and inventory',
    color: '#4d9cf8',
    icon: '📦',
  },
  {
    title: 'Customer Insights',
    description: 'Understand behavior and retention patterns',
    color: '#a78bfa',
    icon: '👥',
  },
  {
    title: 'Campaign Tracking',
    description: 'Measure marketing ROI across all channels',
    color: '#f06291',
    icon: '📈',
  },
];

const TIMELINE_STEPS: TimelineStep[] = [
  { step: 1, title: 'Connect your store', description: 'One-click integration with your platform', icon: '🔌', color: '#22d98a' },
  { step: 2, title: 'Data syncs automatically', description: 'Historical data imported in minutes', icon: '🔄', color: '#4d9cf8' },
  { step: 3, title: 'Customize your dashboard', description: 'Choose the metrics that matter', icon: '✨', color: '#a78bfa' },
  { step: 4, title: 'Get actionable insights', description: 'AI-powered recommendations', icon: '🎯', color: '#f06291' },
];

// ─── Floating Stats Badge ─────────────────────────────────────────────────────

function FloatingBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`absolute z-10 animate-float ${className}`}>
      <div
        className="backdrop-blur-xl px-4 py-2 rounded-full border shadow-xl"
        style={{
          backgroundColor: 'var(--surface)',
          borderColor: '#22d98a33',
        }}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 px-4 md:px-6 py-4 backdrop-blur-xl"
      style={{
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all group-hover:scale-110 group-hover:rotate-3"
            style={{ backgroundColor: '#22d98a22', color: '#22d98a' }}
          >
            M
          </div>
          <span
            className="font-['Syne',sans-serif] text-sm md:text-[15px] font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            merchant<span className="text-emerald-400">.</span>analytics
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm px-3 py-1.5 rounded-lg transition-all"
              style={{ color: 'var(--text2)' }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.backgroundColor = 'var(--surface2)';
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--text2)';
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/login"
            className="hidden md:block text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{
              color: 'var(--text2)',
              border: '1px solid var(--border)',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.backgroundColor = 'var(--surface2)';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-xs md:text-sm px-3 md:px-4 py-1.5 rounded-lg font-medium transition-all bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/25"
          >
            Get started free
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text2)',
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mt-3 rounded-xl p-3 flex flex-col gap-1 animate-slide-up"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          {['Features', 'Pricing', 'Testimonials'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-sm transition-all"
              style={{ color: 'var(--text2)' }}
            >
              {item}
            </a>
          ))}
          <Link
            to="/login"
            className="px-3 py-2 rounded-lg text-sm"
            style={{ color: 'var(--text2)' }}
          >
            Sign in
          </Link>
        </div>
      )}
    </nav>
  );
}

// ─── Dashboard preview ────────────────────────────────────────────────────────

function DashboardPreview() {
  const BAR_DATA = [
    35, 52, 38, 65, 48, 72, 55, 68, 82, 78, 88, 187,
    62, 58, 55, 68, 72, 63, 77, 82, 70, 75, 80, 68,
    76, 71, 83, 78, 75, 80,
  ];

  const GEO_DATA = [
    { flag: '🇳🇬', pct: 32, color: '#22d98a' },
    { flag: '🇰🇪', pct: 24, color: '#4d9cf8' },
    { flag: '🇿🇦', pct: 18, color: '#a78bfa' },
    { flag: '🇿🇲', pct: 8,  color: '#4dd0e1' },
  ];

  const KPI_DATA = [
    { label: 'Revenue',   value: '$284,920', delta: '+12.4%', color: '#22d98a' },
    { label: 'Orders',    value: '4,821',    delta: '+8.1%',  color: '#4d9cf8' },
    { label: 'Avg Order', value: '$59.10',   delta: '+3.9%',  color: '#a78bfa' },
    { label: 'Churn',     value: '2.4%',     delta: '−0.3pp', color: '#ff5757' },
  ];

  const ORDER_DATA = [
    { id: '#48291', customer: 'Alex Mwale', amount: '$247.00', status: 'completed', color: '#22d98a' },
    { id: '#48290', customer: 'Sarah Chen', amount: '$89.99',  status: 'pending',   color: '#f5a623' },
    { id: '#48289', customer: 'Chioma Eze', amount: '$740.00', status: 'completed', color: '#22d98a' },
  ];

  return (
    <div
      className="w-full rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-2xl duration-500"
      style={{
        border: '1px solid var(--border)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
      }}
    >
      {/* Browser chrome */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-amber-400/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
        </div>
        <div
          className="flex-1 flex items-center gap-2 px-3 py-1 rounded-md"
          style={{
            backgroundColor: 'var(--surface2)',
            border: '1px solid var(--border)',
          }}
        >
          <span className="text-[10px]" style={{ color: 'var(--text3)' }}>🔒</span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
            app.merchant.analytics
          </span>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      {/* Dashboard body */}
      <div style={{ backgroundColor: '#0d0f12' }}>

        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '1px solid #2a2f3d' }}
        >
          <span className="font-['Syne',sans-serif] text-xs font-bold text-[#e8eaf0]">
            Overview
          </span>
          <div
            className="flex gap-0.5 p-0.5 rounded-md"
            style={{ backgroundColor: '#1e222b', border: '1px solid #2a2f3d' }}
          >
            {['7d', '30d', '90d'].map((r, i) => (
              <div
                key={r}
                className="font-mono text-[9px] px-2 py-0.5 rounded"
                style={{
                  backgroundColor: i === 1 ? '#252a35' : 'transparent',
                  color:           i === 1 ? '#e8eaf0' : '#555c70',
                }}
              >
                {r}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">

          {/* KPI row */}
          <div className="grid grid-cols-4 gap-2">
            {KPI_DATA.map((kpi) => (
              <div
                key={kpi.label}
                className="rounded-lg p-2.5 transition-all hover:scale-105 cursor-pointer"
                style={{ backgroundColor: '#161920', border: '1px solid #2a2f3d' }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.borderColor = kpi.color;
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.borderColor = '#2a2f3d';
                }}
              >
                <p className="font-mono text-[8px] tracking-widest uppercase text-[#555c70] mb-1">
                  {kpi.label}
                </p>
                <p className="font-['Syne',sans-serif] text-sm font-bold tracking-tight text-[#e8eaf0]">
                  {kpi.value}
                </p>
                <span
                  className="font-mono text-[9px] px-1 py-0.5 rounded mt-1 inline-block"
                  style={{ backgroundColor: kpi.color + '22', color: kpi.color }}
                >
                  {kpi.delta}
                </span>
              </div>
            ))}
          </div>

          {/* Chart + geo */}
          <div className="grid grid-cols-[1fr_120px] gap-2">
            <div
              className="rounded-lg p-3"
              style={{ backgroundColor: '#161920', border: '1px solid #2a2f3d' }}
            >
              <p className="font-['Syne',sans-serif] text-[10px] font-semibold text-[#e8eaf0] mb-2">
                Revenue over time
              </p>
              <div
                className="flex items-center gap-1.5 rounded px-2 py-1 mb-2 text-[9px] text-amber-400 animate-pulse"
                style={{ backgroundColor: '#3d280022', border: '1px solid #f5a62344' }}
              >
                <span className="w-1 h-1 rounded-full bg-amber-400" />
                Anomaly detected: Mar 15 spike +187%
              </div>
              <div className="flex items-end gap-0.5 h-16">
                {BAR_DATA.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm transition-all hover:opacity-80 cursor-pointer"
                    style={{
                      height:          `${Math.min(h / 2, 100)}%`,
                      backgroundColor: i === 11 ? '#f5a623' : '#22d98a44',
                      minHeight:       '2px',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Geo mini */}
            <div
              className="rounded-lg p-3 flex flex-col gap-1.5"
              style={{ backgroundColor: '#161920', border: '1px solid #2a2f3d' }}
            >
              <p className="font-['Syne',sans-serif] text-[9px] font-semibold text-[#e8eaf0] mb-1">
                By region
              </p>
              {GEO_DATA.map((r) => (
                <div key={r.flag} className="flex items-center gap-1.5 group cursor-pointer">
                  <span className="text-[10px] group-hover:scale-110 transition-transform">
                    {r.flag}
                  </span>
                  <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: '#252a35' }}>
                    <div
                      className="h-full rounded-full transition-all group-hover:opacity-80"
                      style={{ width: `${r.pct}%`, backgroundColor: r.color }}
                    />
                  </div>
                  <span className="font-mono text-[8px] text-[#555c70]">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders preview */}
          <div
            className="rounded-lg overflow-hidden"
            style={{ backgroundColor: '#161920', border: '1px solid #2a2f3d' }}
          >
            <div
              className="px-3 py-2 flex items-center justify-between"
              style={{ borderBottom: '1px solid #2a2f3d' }}
            >
              <span className="font-['Syne',sans-serif] text-[10px] font-semibold text-[#e8eaf0]">
                Recent orders
              </span>
              <span
                className="font-mono text-[8px] px-1.5 py-0.5 rounded animate-pulse"
                style={{ backgroundColor: '#22d98a22', color: '#22d98a' }}
              >
                LIVE
              </span>
            </div>
            {ORDER_DATA.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between px-3 py-1.5 transition-all hover:bg-[#1e222b] cursor-pointer"
                style={{ borderBottom: '1px solid #2a2f3d' }}
              >
                <span className="font-mono text-[9px] text-[#555c70]">{o.id}</span>
                <span className="text-[9px] text-[#8b90a0]">{o.customer}</span>
                <span className="font-mono text-[9px] text-[#e8eaf0]">{o.amount}</span>
                <span
                  className="font-mono text-[8px] px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: o.color + '22', color: o.color }}
                >
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative px-4 md:px-6 pt-12 md:pt-16 pb-16 md:pb-20 overflow-hidden">
        {/* Particle background */}
        <ParticleBackground />
        
        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 bg-grid-pattern animate-grid-pulse pointer-events-none"
          style={{ opacity: 0.3 }}
        />

        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-blue-950/20 animate-gradient" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Floating badges */}
        <FloatingBadge className="top-20 left-4 md:left-8 hidden lg:block">
          <span className="text-emerald-400 font-bold text-sm">📈 +187%</span>
          <span className="text-text2 text-xs ml-2">Revenue growth</span>
        </FloatingBadge>

        <FloatingBadge className="bottom-32 right-4 md:right-8 hidden lg:block">
          <span className="text-amber-400 font-bold text-sm">🏆 #1</span>
          <span className="text-text2 text-xs ml-2">In Zambia</span>
        </FloatingBadge>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

            {/* Left — copy */}
            <div className="flex flex-col gap-4 md:gap-6 animate-slide-in-left">

              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit animate-pulse-glow"
                style={{
                  backgroundColor: 'var(--surface2)',
                  border: '1px solid #22d98a33',
                  color: 'var(--text2)',
                }}
              >
                <Sparkles size={14} className="text-emerald-400" />
                <span className="font-mono text-[9px] md:text-[10px] tracking-wide">
                  Built for African e-commerce · Free to start
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-['Syne',sans-serif] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
                style={{ color: 'var(--text)' }}
              >
                Know your
                <br />
                numbers.
                <br />
                <span className="text-emerald-400 relative">
                  Grow faster.
                  <span className="absolute -bottom-2 left-0 w-full h-1 bg-emerald-400/30 rounded-full" />
                </span>
              </h1>

              {/* Sub */}
              <p
                className="text-sm md:text-base lg:text-lg leading-relaxed max-w-md"
                style={{ color: 'var(--text2)' }}
              >
                Merchant Analytics gives African online stores a real-time dashboard to
                track revenue, products, customers and campaigns.
                <span className="font-semibold text-emerald-400"> No spreadsheets, no guessing.</span>
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/register"
                  className="group relative px-6 py-3 rounded-xl text-sm font-semibold transition-all bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 text-center"
                >
                  Start for free
                  <ArrowRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/app"
                  className="px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 hover:scale-105"
                  style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface2)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  View live demo
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 md:pt-4">
                <TrustBadges />
              </div>

              {/* Social proof */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2 md:pt-4">
                <div className="flex -space-x-2">
                  {AVATAR_INIT.map((init, i) => (
                    <div
                      key={init}
                      className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-medium border-2 transition-all hover:scale-110 hover:z-10"
                      style={{
                        backgroundColor: AVATAR_BG[i],
                        color:           AVATAR_COLORS[i],
                        borderColor:     'var(--bg)',
                      }}
                    >
                      {init}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5 mb-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-amber-400 text-xs">★</span>
                    ))}
                    <span className="text-xs ml-1" style={{ color: 'var(--text)' }}>4.9</span>
                  </div>
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>
                    Trusted by 2,400+ stores across Africa
                  </p>
                </div>
              </div>
            </div>

            {/* Right — dashboard preview */}
            <div className="relative hidden lg:block animate-slide-in-right">
              <div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, #22d98a11, transparent 70%)',
                  transform: 'scale(1.1)',
                }}
              />
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee Logo bar ──────────────────────────────────────────────────── */}
      <section
        className="py-6 md:py-8 overflow-hidden"
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="flex animate-marquee">
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, i) => (
            <div
              key={i}
              className="flex items-center gap-2 md:gap-3 mx-4 md:mx-8 opacity-50 hover:opacity-100 transition-all hover:scale-110 cursor-default"
            >
              <span className="text-lg md:text-xl">{logo.country}</span>
              <span
                className="font-['Syne',sans-serif] text-xs md:text-sm font-semibold whitespace-nowrap"
                style={{ color: 'var(--text2)' }}
              >
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 px-4 md:px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="rounded-xl p-4 md:p-5 text-center transition-all hover:scale-105 animate-fade-in"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                animationDelay: `${i * 100}ms`,
              }}
            >
              <p
                className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-1"
                style={{ color: s.color }}
              >
                <CountUp end={s.value} prefix={s.prefix} suffix={s.suffix} />
              </p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section
        id="features"
        className="py-16 md:py-20 px-4 md:px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

            {/* Left sticky text */}
            <div className="lg:sticky lg:top-24">
              <p
                className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase mb-4"
                style={{ color: 'var(--text3)' }}
              >
                Features
              </p>
              <h2
                className="font-['Syne',sans-serif] text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight mb-4"
                style={{ color: 'var(--text)' }}
              >
                Everything you need to
                <span className="text-emerald-400"> run smarter.</span>
              </h2>
              <p
                className="text-sm md:text-base leading-relaxed mb-8"
                style={{ color: 'var(--text2)' }}
              >
                Built specifically for how African e-commerce works — mobile money,
                multi-currency, local timezones, and the metrics that actually matter.
              </p>
              <div className="flex flex-col gap-2.5">
                {CHECKLIST.map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <span className="text-emerald-400 text-xs">✓</span>
                    <span className="text-xs md:text-sm" style={{ color: 'var(--text2)' }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <TiltCard
                  key={f.title}
                  className="rounded-xl p-4 md:p-5 flex flex-col gap-3 cursor-default"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-sm md:text-base"
                      style={{ backgroundColor: f.color + '22', color: f.color }}
                    >
                      {f.icon}
                    </div>
                    <span
                      className="font-mono text-[8px] md:text-[9px] px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: f.color + '15', color: f.color }}
                    >
                      {f.tag}
                    </span>
                  </div>
                  <h3
                    className="font-['Syne',sans-serif] text-sm font-semibold"
                    style={{ color: 'var(--text)' }}
                  >
                    {f.title}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
                    {f.desc}
                  </p>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Dashboard Screenshots Gallery ────────────────────────────────────── */}
      <section
        className="py-16 md:py-20 px-4 md:px-6 overflow-hidden"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <p
              className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase mb-3"
              style={{ color: 'var(--text3)' }}
            >
              Beautiful by design
            </p>
            <h2
              className="font-['Syne',sans-serif] text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Everything you need,{' '}
              <span className="text-emerald-400">beautifully designed</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {DASHBOARD_SCREENS.map((screen, i) => (
              <TiltCard
                key={screen.title}
                className="rounded-2xl overflow-hidden cursor-pointer animate-fade-in"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <div className="relative group">
                  {/* Mock browser chrome */}
                  <div
                    className="px-3 md:px-4 py-2 flex items-center gap-2"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-red-400/60" />
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-amber-400/60" />
                      <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-400/60" />
                    </div>
                    <span className="text-[9px] md:text-[10px] font-mono ml-2" style={{ color: 'var(--text3)' }}>
                      {screen.title.toLowerCase().replace(' ', '-')}
                    </span>
                  </div>

                  {/* Screenshot placeholder with gradient */}
                  <div className="relative h-40 md:h-48 overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(135deg, ${screen.color}11, ${screen.color}05)`,
                      }}
                    />
                    
                    {/* Mock chart elements */}
                    <div className="absolute inset-0 p-3 md:p-4">
                      <div className="flex gap-1 mb-3">
                        <div className="w-12 md:w-16 h-2 md:h-3 rounded" style={{ backgroundColor: screen.color + '44' }} />
                        <div className="w-6 md:w-8 h-2 md:h-3 rounded" style={{ backgroundColor: screen.color + '22' }} />
                      </div>
                      <div className="flex items-end gap-1 h-20 md:h-24">
                        {[60, 45, 80, 35, 70, 55, 90, 50].map((h, j) => (
                          <div
                            key={j}
                            className="flex-1 rounded-sm transition-all group-hover:opacity-80"
                            style={{
                              height: `${h}%`,
                              backgroundColor: screen.color + '66',
                            }}
                          />
                        ))}
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 md:mt-4">
                        <div className="h-6 md:h-8 rounded" style={{ backgroundColor: screen.color + '22' }} />
                        <div className="h-6 md:h-8 rounded" style={{ backgroundColor: screen.color + '22' }} />
                        <div className="h-6 md:h-8 rounded" style={{ backgroundColor: screen.color + '22' }} />
                      </div>
                    </div>

                    {/* Overlay on hover */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      style={{ backgroundColor: '#0d0f12cc', backdropFilter: 'blur(4px)' }}
                    >
                      <span
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{ backgroundColor: screen.color, color: '#0d0f12' }}
                      >
                        {screen.icon} {screen.title}
                      </span>
                    </div>
                  </div>

                  {/* Caption */}
                  <div className="p-3 md:p-4">
                    <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>
                      {screen.title}
                    </h4>
                    <p className="text-xs" style={{ color: 'var(--text3)' }}>
                      {screen.description}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Timeline ────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-20 px-4 md:px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <p
              className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase mb-3"
              style={{ color: 'var(--text3)' }}
            >
              Get started in minutes
            </p>
            <h2
              className="font-['Syne',sans-serif] text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              From zero to insights{' '}
              <span className="text-emerald-400">in 4 simple steps</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute top-12 left-0 right-0 h-0.5 hidden md:block"
              style={{ backgroundColor: 'var(--border)' }}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative">
              {TIMELINE_STEPS.map((step, i) => (
                <div
                  key={step.step}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Step number circle */}
                  <div className="flex justify-center mb-4 md:mb-6">
                    <div
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-base md:text-lg relative z-10 animate-scale-pulse"
                      style={{
                        backgroundColor: step.color,
                        color: '#0d0f12',
                        boxShadow: `0 0 30px ${step.color}66`,
                      }}
                    >
                      {step.step}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl mb-2 md:mb-3">{step.icon}</div>
                    <h4
                      className="font-['Syne',sans-serif] text-sm md:text-base font-semibold mb-2"
                      style={{ color: 'var(--text)' }}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-10 md:mt-12">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 md:px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] transition-all hover:scale-105"
              >
                Start your free journey
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Merchants Love Us ────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-20 px-4 md:px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <p
              className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase mb-3"
              style={{ color: 'var(--text3)' }}
            >
              Why merchants love us
            </p>
            <h2
              className="font-['Syne',sans-serif] text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Built for African e-commerce
            </h2>
            <p className="text-xs md:text-sm mt-3 max-w-2xl mx-auto" style={{ color: 'var(--text2)' }}>
              We understand the unique challenges and opportunities of selling online in Africa.
              Here's what sets us apart.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {WHY_LOVE_US.map((item, i) => (
              <TiltCard
                key={item.title}
                className="rounded-xl p-5 md:p-6 flex flex-col gap-3 animate-fade-in"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 50}ms`,
                }}
              >
                <div
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-xl md:text-2xl"
                  style={{ backgroundColor: item.color + '22' }}
                >
                  {item.icon}
                </div>
                <h3
                  className="font-['Syne',sans-serif] text-sm md:text-base font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text2)' }}>
                  {item.desc}
                </p>
              </TiltCard>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-10 md:mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-xs md:text-sm">✓</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text2)' }}>2,400+ active stores</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-xs md:text-sm">✓</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text2)' }}>14 African countries</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-xs md:text-sm">✓</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text2)' }}>99.9% uptime SLA</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <span className="text-emerald-400 text-xs md:text-sm">✓</span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text2)' }}>GDPR & POPIA compliant</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Integrations ──────────────────────────────────────────────────── */}
      <section
        id="integrations"
        className="py-16 md:py-20 px-4 md:px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase mb-3"
            style={{ color: 'var(--text3)' }}
          >
            Integrations
          </p>
          <h2
            className="font-['Syne',sans-serif] text-2xl md:text-3xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--text)' }}
          >
            Connects with the tools you already use
          </h2>
          <p className="text-xs md:text-sm mb-10 md:mb-12" style={{ color: 'var(--text2)' }}>
            One-click integrations with Africa's most popular commerce and payment platforms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {INTEGRATIONS.map((int) => (
              <TiltCard
                key={int.name}
                className="rounded-xl p-4 md:p-5 flex items-center gap-3 md:gap-4"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-base md:text-lg flex-shrink-0"
                  style={{ backgroundColor: int.color + '22', color: int.color }}
                >
                  {int.icon}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                    {int.name}
                  </p>
                  <p className="text-[10px] md:text-xs" style={{ color: 'var(--text3)' }}>
                    One-click connect
                  </p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="py-16 md:py-20 px-4 md:px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <p
              className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase mb-3"
              style={{ color: 'var(--text3)' }}
            >
              Customer stories
            </p>
            <h2
              className="font-['Syne',sans-serif] text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Real results from real African stores
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {TESTIMONIALS.map((t, i) => (
              <TiltCard
                key={t.name}
                className="rounded-xl p-5 md:p-6 flex flex-col gap-4 md:gap-5 animate-fade-in"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <div
                  className="rounded-lg p-3 text-center"
                  style={{
                    backgroundColor: t.color + '11',
                    border: `1px solid ${t.color}33`,
                  }}
                >
                  <p
                    className="font-['Syne',sans-serif] text-xl md:text-2xl font-bold"
                    style={{ color: t.color }}
                  >
                    {t.metric}
                  </p>
                  <p className="text-[10px] md:text-[11px]" style={{ color: 'var(--text3)' }}>
                    {t.metricLabel}
                  </p>
                </div>

                <p
                  className="text-xs md:text-sm leading-relaxed italic flex-1"
                  style={{ color: 'var(--text2)' }}
                >
                  "{t.quote}"
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center font-mono text-xs font-medium flex-shrink-0"
                    style={{ backgroundColor: t.color + '22', color: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--text)' }}>
                      {t.country} {t.name}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-16 md:py-20 px-4 md:px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-14">
            <p
              className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase mb-3"
              style={{ color: 'var(--text3)' }}
            >
              Pricing
            </p>
            <h2
              className="font-['Syne',sans-serif] text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Start free. Scale when ready.
            </h2>
            <p className="text-xs md:text-sm mt-3" style={{ color: 'var(--text2)' }}>
              No credit card required. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {PRICING.map((tier, i) => (
              <TiltCard
                key={tier.name}
                className="rounded-xl p-5 md:p-6 flex flex-col gap-4 md:gap-5 relative animate-fade-in"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: tier.popular
                    ? `2px solid ${tier.color}`
                    : '1px solid var(--border)',
                  animationDelay: `${i * 100}ms`,
                }}
              >
                {tier.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] md:text-[10px] font-medium px-3 py-1 rounded-full whitespace-nowrap animate-pulse"
                    style={{ backgroundColor: tier.color, color: '#0d0f12' }}
                  >
                    Most popular
                  </div>
                )}

                <div>
                  <p
                    className="font-['Syne',sans-serif] text-sm font-semibold mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-['Syne',sans-serif] text-3xl md:text-4xl font-bold tracking-tight"
                      style={{ color: tier.color }}
                    >
                      {tier.price}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text3)' }}>
                      {tier.sub}
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2 md:gap-2.5 flex-1">
                  {tier.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-center gap-2 text-xs"
                      style={{ color: 'var(--text2)' }}
                    >
                      <span style={{ color: tier.color }}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  to={tier.path}
                  className="w-full py-2.5 rounded-lg text-sm font-medium text-center transition-all block"
                  style={{
                    backgroundColor: tier.popular ? tier.color : 'transparent',
                    color:           tier.popular ? '#0d0f12' : tier.color,
                    border:          tier.popular ? 'none' : `1px solid ${tier.color}`,
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!tier.popular) {
                      e.currentTarget.style.backgroundColor = tier.color + '22';
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    if (!tier.popular) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  {tier.cta}
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ────────────────────────────────────────────────────── */}
      <section
        className="py-16 md:py-20 px-4 md:px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-12 flex flex-col items-center text-center gap-4 md:gap-6 relative overflow-hidden animate-border-glow"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid #22d98a33',
            }}
          >
            <div
              className="absolute inset-0 opacity-10"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, #22d98a, transparent 70%)',
              }}
            />
            <div className="relative flex flex-col items-center gap-4 md:gap-6">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <h2
                className="font-['Syne',sans-serif] text-3xl md:text-4xl font-bold tracking-tight"
                style={{ color: 'var(--text)' }}
              >
                Ready to grow your store?
              </h2>
              <p className="text-sm md:text-base max-w-lg" style={{ color: 'var(--text2)' }}>
                Join 2,400+ African online stores already using Merchant Analytics
                to make faster, smarter business decisions. Start free today.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/register"
                  className="group px-6 md:px-8 py-3 rounded-xl text-sm font-semibold transition-all bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 text-center"
                >
                  Get started for free
                  <ArrowRight size={16} className="inline ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/app"
                  className="px-6 py-3 rounded-xl text-sm font-medium transition-all hover:scale-105 text-center"
                  style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}
                  onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.backgroundColor = 'var(--surface2)';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  View live demo →
                </Link>
              </div>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>
                No credit card · Free forever plan · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="py-10 md:py-12 px-4 md:px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div className="col-span-1 flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2 group">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all group-hover:scale-110 group-hover:rotate-3"
                  style={{ backgroundColor: '#22d98a22', color: '#22d98a' }}
                >
                  M
                </div>
                <span
                  className="font-['Syne',sans-serif] text-sm font-bold tracking-tight"
                  style={{ color: 'var(--text)' }}
                >
                  merchant<span className="text-emerald-400">.</span>analytics
                </span>
              </Link>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text3)' }}>
                The analytics platform built for African e-commerce.
                Know your numbers, grow your business.
              </p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>
                Built in Zambia 🇿🇲
              </p>
            </div>

            {/* Product */}
            <div>
              <p
                className="font-mono text-[10px] tracking-widest uppercase mb-4"
                style={{ color: 'var(--text3)' }}
              >
                Product
              </p>
              <div className="flex flex-col gap-2.5">
                {['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-xs transition-colors hover:translate-x-1"
                    style={{ color: 'var(--text2)' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.style.color = 'var(--text2)';
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <p
                className="font-mono text-[10px] tracking-widest uppercase mb-4"
                style={{ color: 'var(--text3)' }}
              >
                Company
              </p>
              <div className="flex flex-col gap-2.5">
                {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-xs transition-colors hover:translate-x-1"
                    style={{ color: 'var(--text2)' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.style.color = 'var(--text2)';
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <p
                className="font-mono text-[10px] tracking-widest uppercase mb-4"
                style={{ color: 'var(--text3)' }}
              >
                Legal
              </p>
              <div className="flex flex-col gap-2.5">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'POPIA'].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-xs transition-colors hover:translate-x-1"
                    style={{ color: 'var(--text2)' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.style.color = 'var(--text)';
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.currentTarget.style.color = 'var(--text2)';
                    }}
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text3)' }}>
              © 2026 Merchant Analytics Ltd. All rights reserved.
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs" style={{ color: 'var(--text3)' }}>
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}