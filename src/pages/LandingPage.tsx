import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { CountUp } from '../components/ui/CountUp';
import { TrustBadges } from '../components/ui/TrustBadges';
import { ParticleBackground } from '../components/ui/ParticleBackground';
import { TiltCard } from '../components/ui/TiltCard';
import { ArrowRight, Sparkles, BarChart3, LineChart, PieChart, TrendingUp, Users, Globe, Zap, Shield, CheckCircle, Play, Star, ArrowUpRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Features',     href: '#features'     },
  { label: 'How it Works', href: '#how-it-works' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Testimonials', href: '#testimonials' },
];

const STATS = [
  { value: 2400, label: 'Active Stores',    icon: TrendingUp, color: '#22d98a', suffix: '+' },
  { value: 48,  label: 'Revenue Tracked',   icon: BarChart3,  color: '#4d9cf8', prefix: '$', suffix: 'M+' },
  { value: 14,  label: 'African Countries', icon: Globe,      color: '#a78bfa' },
  { value: 99.9, label: 'Uptime SLA',       icon: Shield,     color: '#22d98a', suffix: '%' },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Real-Time Dashboard',
    desc: 'Watch your revenue, orders, and customer metrics update live. No refresh needed. Make decisions with confidence.',
    color: '#22d98a',
    highlights: ['Live data streaming', 'Customizable widgets', 'Multi-store view'],
  },
  {
    icon: Zap,
    title: 'AI Anomaly Detection',
    desc: 'Our AI automatically detects unusual patterns in your data and alerts you before they impact your business.',
    color: '#f5a623',
    highlights: ['Real-time alerts', 'Pattern recognition', 'Predictive insights'],
  },
  {
    icon: Users,
    title: 'Customer Intelligence',
    desc: 'Understand who your customers are, what they buy, and when they\'re likely to churn. Cohort analysis made simple.',
    color: '#4d9cf8',
    highlights: ['Cohort retention', 'RFM segmentation', 'Churn prediction'],
  },
  {
    icon: TrendingUp,
    title: 'Campaign Analytics',
    desc: 'Measure ROAS, CTR, and conversion rates across all your marketing channels in one unified view.',
    color: '#f06291',
    highlights: ['Multi-channel tracking', 'Attribution modeling', 'ROI calculator'],
  },
  {
    icon: PieChart,
    title: 'Product Performance',
    desc: 'Identify your top-performing products, spot trends, and optimize your inventory based on real data.',
    color: '#a78bfa',
    highlights: ['Product rankings', 'Trend analysis', 'Inventory insights'],
  },
  {
    icon: LineChart,
    title: 'Custom Reports & Export',
    desc: 'Build custom reports, schedule automated exports, and share insights with your team via CSV, PDF, or shareable links.',
    color: '#4dd0e1',
    highlights: ['Custom dashboards', 'Scheduled exports', 'Team sharing'],
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Connect Your Store',
    desc: 'Link your Shopify, WooCommerce, or custom store in under 2 minutes. No coding required.',
    icon: '🔌',
  },
  {
    step: '02',
    title: 'Data Auto-Syncs',
    desc: 'Your historical data imports automatically. See trends from day one, not day 30.',
    icon: '🔄',
  },
  {
    step: '03',
    title: 'Customize Your View',
    desc: 'Drag and drop widgets, set custom alerts, and create the dashboard that works for you.',
    icon: '✨',
  },
  {
    step: '04',
    title: 'Get Smart Insights',
    desc: 'Receive AI-powered recommendations, anomaly alerts, and weekly digest reports.',
    icon: '🎯',
  },
];

const TESTIMONIALS = [
  {
    name: 'Chioma Eze',
    role: 'Founder, ShopLagos',
    country: '🇳🇬 Nigeria',
    quote: 'We cut reporting time from 3 hours to zero. The anomaly detection caught a payment gateway issue that would have cost us thousands during Black Friday.',
    metric: '3hrs → 0',
    metricLabel: 'reporting time saved weekly',
    color: '#22d98a',
  },
  {
    name: 'Kwame Asante',
    role: 'Head of E-commerce, Accra Mart',
    country: '🇬🇭 Ghana',
    quote: 'Finally, analytics that understands African payment methods and currencies. Our churn dropped 18% in two months using the cohort analysis.',
    metric: '−18%',
    metricLabel: 'churn reduction',
    color: '#4d9cf8',
  },
  {
    name: 'Amara Diallo',
    role: 'CEO, DakarStore',
    country: '🇸🇳 Senegal',
    quote: 'Clean, fast, and actually affordable. We tested 4 analytics platforms before finding this. The ROI was immediate.',
    metric: '4.2x',
    metricLabel: 'ROI in first quarter',
    color: '#a78bfa',
  },
];

const INTEGRATIONS = [
  { name: 'Shopify',     icon: '🛍️', color: '#96bf48' },
  { name: 'WooCommerce', icon: '🛒', color: '#7f54b3' },
  { name: 'Flutterwave', icon: '💳', color: '#f5a623' },
  { name: 'M-Pesa',      icon: '📱', color: '#22d98a' },
  { name: 'Paystack',    icon: '💰', color: '#00c3f7' },
  { name: 'Jumia',       icon: '📦', color: '#f68b1e' },
  { name: 'Google Analytics', icon: '📊', color: '#e37400' },
  { name: 'Meta Ads',    icon: '📢', color: '#1877f2' },
];

// ─── Components ──────────────────────────────────────────────────────────────

function FloatingBadge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`absolute z-10 animate-float ${className}`}>
      <div className="backdrop-blur-xl px-4 py-2 rounded-full border shadow-xl" style={{ backgroundColor: 'var(--surface)', borderColor: '#22d98a33' }}>
        {children}
      </div>
    </div>
  );
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuth } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 px-4 md:px-6 py-4 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''}`}
      style={{ backgroundColor: 'var(--bg)', borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-emerald-500/25">
            M
          </div>
          <span className="font-['Syne',sans-serif] text-base md:text-lg font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            merchant<span className="text-emerald-400">.</span>analytics
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((item) => (
            <a key={item.label} href={item.href} className="text-sm px-3 py-2 rounded-lg transition-all hover:bg-[var(--surface2)]" style={{ color: 'var(--text2)' }}>
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuth ? (
            <Link to="/app" className="text-sm px-4 py-2 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-400 text-white transition-all hover:scale-105 flex items-center gap-2">
              Dashboard <ArrowUpRight size={14} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden md:block text-sm px-4 py-2 rounded-lg transition-all hover:bg-[var(--surface2)]" style={{ color: 'var(--text2)' }}>
                Sign in
              </Link>
              <Link to="/register" className="text-sm px-4 py-2 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-400 text-white transition-all hover:scale-105">
                Start free
              </Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg" style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-3 rounded-xl p-3 flex flex-col gap-1 animate-slide-up" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
          {[...NAV_LINKS, { label: 'Sign in', href: '/login' }].map((item) => (
            <Link key={item.label} to={item.href} onClick={() => setMenuOpen(false)} className="px-3 py-2.5 rounded-lg text-sm" style={{ color: 'var(--text2)' }}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  const { isAuth } = useAuthStore();

  return (
    <section className="relative px-4 md:px-6 pt-16 md:pt-24 pb-16 md:pb-24 overflow-hidden">
      <ParticleBackground />
      <div className="absolute inset-0 bg-grid-pattern animate-grid-pulse pointer-events-none" style={{ opacity: 0.3 }} />
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-blue-950/20 animate-gradient" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <FloatingBadge className="top-20 left-4 md:left-12 hidden lg:block">
        <span className="text-emerald-400 font-bold text-sm">📈 +187%</span>
        <span className="text-text2 text-xs ml-2">Avg. revenue lift</span>
      </FloatingBadge>
      <FloatingBadge className="bottom-32 right-4 md:right-12 hidden lg:block">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {['CE','KA','AD','TM'].map((init, i) => (
              <div key={init} className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold border-2" style={{ backgroundColor: ['#22d98a22','#4d9cf822','#a78bfa22','#f5a62322'][i], color: ['#22d98a','#4d9cf8','#a78bfa','#f5a623'][i], borderColor: 'var(--bg)' }}>
                {init}
              </div>
            ))}
          </div>
          <span className="text-text2 text-xs">2,400+ merchants</span>
        </div>
      </FloatingBadge>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 animate-slide-in-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit animate-pulse-glow" style={{ backgroundColor: 'var(--surface2)', border: '1px solid #22d98a33', color: 'var(--text2)' }}>
              <Sparkles size={14} className="text-emerald-400" />
              <span className="font-mono text-[10px] tracking-wide">#1 Analytics Platform for African E-commerce</span>
            </div>

            <h1 className="font-['Syne',sans-serif] text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]" style={{ color: 'var(--text)' }}>
              Turn your store data into{' '}
              <span className="text-emerald-400 relative">
                revenue.
                <span className="absolute -bottom-2 left-0 w-full h-1 bg-emerald-400/30 rounded-full" />
              </span>
            </h1>

            <p className="text-base md:text-lg leading-relaxed max-w-lg" style={{ color: 'var(--text2)' }}>
              The all-in-one analytics platform built for African online stores. Track revenue, understand customers, and grow faster — <span className="font-semibold" style={{ color: 'var(--text)' }}>no spreadsheet required.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="group px-6 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-emerald-500/30 text-center inline-flex items-center justify-center gap-2">
                Start free — no credit card
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to={isAuth ? '/app' : '/login'} className="px-6 py-3.5 rounded-xl text-sm font-medium transition-all hover:scale-105 text-center inline-flex items-center justify-center gap-2" style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
                <Play size={14} className="text-emerald-400" />
                {isAuth ? 'Go to dashboard' : 'Watch demo'}
              </Link>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map((s) => <Star key={s} size={14} className="text-amber-400 fill-amber-400" />)}
                <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>4.9</span>
                <span className="text-xs" style={{ color: 'var(--text3)' }}>(500+ reviews)</span>
              </div>
              <div className="w-px h-5" style={{ backgroundColor: 'var(--border)' }} />
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-emerald-400" />
                <span className="text-xs" style={{ color: 'var(--text3)' }}>GDPR & POPIA compliant</span>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block animate-slide-in-right">
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-3xl blur-2xl" />
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-2xl" style={{ border: '1px solid var(--border)', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
      <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400/70" />
          <div className="w-3 h-3 rounded-full bg-amber-400/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
        </div>
        <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-md" style={{ backgroundColor: 'var(--surface2)', border: '1px solid var(--border)' }}>
          <span className="text-[10px]" style={{ color: 'var(--text3)' }}>🔒</span>
          <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>app.merchant.analytics</span>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <div style={{ backgroundColor: '#0d0f12' }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #2a2f3d' }}>
          <span className="font-['Syne',sans-serif] text-xs font-bold text-[#e8eaf0]">Overview</span>
          <div className="flex gap-0.5 p-0.5 rounded-md" style={{ backgroundColor: '#1e222b', border: '1px solid #2a2f3d' }}>
            {['7d','30d','90d'].map((r, i) => (
              <div key={r} className="font-mono text-[9px] px-2 py-0.5 rounded" style={{ backgroundColor: i===1?'#252a35':'transparent', color: i===1?'#e8eaf0':'#555c70' }}>{r}</div>
            ))}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div className="grid grid-cols-4 gap-2">
            {[{ label:'Revenue', value:'$284,920', delta:'+12.4%', color:'#22d98a' },{ label:'Orders', value:'4,821', delta:'+8.1%', color:'#4d9cf8' },{ label:'Avg Order', value:'$59.10', delta:'+3.9%', color:'#a78bfa' },{ label:'Churn', value:'2.4%', delta:'−0.3pp', color:'#ff5757' }].map(kpi => (
              <div key={kpi.label} className="rounded-lg p-2.5" style={{ backgroundColor:'#161920', border:'1px solid #2a2f3d' }}>
                <p className="font-mono text-[8px] tracking-widest uppercase text-[#555c70] mb-1">{kpi.label}</p>
                <p className="font-['Syne',sans-serif] text-sm font-bold text-[#e8eaf0]">{kpi.value}</p>
                <span className="font-mono text-[9px] px-1 py-0.5 rounded mt-1 inline-block" style={{ backgroundColor:kpi.color+'22', color:kpi.color }}>{kpi.delta}</span>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-3" style={{ backgroundColor:'#161920', border:'1px solid #2a2f3d' }}>
            <p className="font-['Syne',sans-serif] text-[10px] font-semibold text-[#e8eaf0] mb-2">Revenue over time</p>
            <div className="flex items-end gap-0.5 h-16">
              {[35,52,38,65,48,72,55,68,82,78,88,187,62,58,55,68,72,63,77,82,70,75,80,68,76,71,83,78,75,80].map((h,i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height:`${Math.min(h/2,100)}%`, backgroundColor:i===11?'#f5a623':'#22d98a44', minHeight:'2px' }} />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[9px]">
            {[{ label:'ShopLagos', flag:'🇳🇬', pct:32, color:'#22d98a' },{ label:'Accra Mart', flag:'🇬🇭', pct:24, color:'#4d9cf8' },{ label:'DakarStore', flag:'🇸🇳', pct:18, color:'#a78bfa' }].map(r => (
              <div key={r.label} className="flex items-center gap-1.5">
                <span>{r.flag}</span>
                <span className="text-[#8b90a0] truncate">{r.label}</span>
                <span className="font-mono ml-auto" style={{ color:r.color }}>{r.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogoMarquee() {
  const logos = ['ShopLagos 🇳🇬', 'Accra Mart 🇬🇭', 'DakarStore 🇸🇳', 'NairobiShop 🇰🇪', 'ZedCommerce 🇿🇲', 'CapeTrade 🇿🇦', 'KigaliMart 🇷🇼', 'AddisTrade 🇪🇹'];

  return (
    <section className="py-8 overflow-hidden" style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <p className="text-center font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: 'var(--text3)' }}>Trusted by stores across Africa</p>
      <div className="flex animate-marquee">
        {[...logos, ...logos].map((logo, i) => (
          <div key={i} className="flex items-center gap-2 mx-6 opacity-50 hover:opacity-100 transition-all cursor-default">
            <span className="font-['Syne',sans-serif] text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text2)' }}>{logo}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 md:py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-mono text-[11px] tracking-widest uppercase mb-3" style={{ color: 'var(--text3)' }}>By the numbers</p>
          <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Trusted by merchants{' '}
            <span className="text-emerald-400">across Africa</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="rounded-xl p-6 text-center transition-all hover:scale-105 animate-fade-in" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', animationDelay: `${i*100}ms` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: stat.color + '22' }}>
                <stat.icon size={22} style={{ color: stat.color }} />
              </div>
              <p className="text-3xl md:text-4xl font-bold tracking-tight mb-1" style={{ color: stat.color }}>
                <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 md:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-mono text-[11px] tracking-widest uppercase mb-3" style={{ color: 'var(--text3)' }}>Powerful features</p>
          <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>
            Everything you need to{' '}
            <span className="text-emerald-400">grow smarter</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--text2)' }}>
            Built for how African e-commerce actually works — mobile money, multi-currency, local timezones, and the metrics that matter.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <TiltCard key={f.title} className="rounded-xl p-6 flex flex-col gap-4 animate-fade-in group" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', animationDelay: `${i*75}ms` }}>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{ backgroundColor: f.color + '22' }}>
                  <f.icon size={22} style={{ color: f.color }} />
                </div>
                <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: f.color }} />
              </div>
              <div>
                <h3 className="font-['Syne',sans-serif] text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text2)' }}>{f.desc}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {f.highlights.map(h => (
                  <span key={h} className="text-[10px] font-mono px-2 py-1 rounded-full" style={{ backgroundColor: f.color + '11', color: f.color }}>{h}</span>
                ))}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 px-4 md:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-mono text-[11px] tracking-widest uppercase mb-3" style={{ color: 'var(--text3)' }}>Get started in minutes</p>
          <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            From signup to insights in{' '}
            <span className="text-emerald-400">under 5 minutes</span>
          </h2>
        </div>

        <div className="relative">
          <div className="absolute top-14 left-0 right-0 h-0.5 hidden md:block" style={{ backgroundColor: 'var(--border)' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative animate-fade-in text-center" style={{ animationDelay: `${i*150}ms` }}>
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold relative z-10 shadow-lg" style={{ backgroundColor: 'var(--surface)', border: '2px solid #22d98a33', color: 'var(--text)' }}>
                    {step.icon}
                  </div>
                </div>
                <p className="font-mono text-[10px] tracking-widest uppercase mb-2" style={{ color: '#22d98a' }}>Step {step.step}</p>
                <h4 className="font-['Syne',sans-serif] text-base font-semibold mb-2" style={{ color: 'var(--text)' }}>{step.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white transition-all hover:scale-105">
            Start your free journey <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function IntegrationsSection() {
  return (
    <section id="integrations" className="py-16 md:py-24 px-4 md:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-4xl mx-auto text-center">
        <p className="font-mono text-[11px] tracking-widest uppercase mb-3" style={{ color: 'var(--text3)' }}>Integrations</p>
        <h2 className="font-['Syne',sans-serif] text-3xl font-bold tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Works with your{' '}
          <span className="text-emerald-400">existing stack</span>
        </h2>
        <p className="text-sm mb-12" style={{ color: 'var(--text2)' }}>One-click connections. No developers needed.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {INTEGRATIONS.map((int) => (
            <TiltCard key={int.name} className="rounded-xl p-5 flex flex-col items-center gap-3 transition-all hover:scale-105" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: int.color + '22' }}>{int.icon}</div>
              <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>{int.name}</span>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 md:py-24 px-4 md:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="font-mono text-[11px] tracking-widest uppercase mb-3" style={{ color: 'var(--text3)' }}>Testimonials</p>
          <h2 className="font-['Syne',sans-serif] text-3xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
            Loved by{' '}
            <span className="text-emerald-400">merchants across Africa</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <TiltCard key={t.name} className="rounded-xl p-6 flex flex-col gap-5 animate-fade-in" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', animationDelay: `${i*100}ms` }}>
              <div className="rounded-lg p-4 text-center" style={{ backgroundColor: t.color + '11', border: `1px solid ${t.color}33` }}>
                <p className="font-['Syne',sans-serif] text-3xl font-bold" style={{ color: t.color }}>{t.metric}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text3)' }}>{t.metricLabel}</p>
              </div>
              <p className="text-sm leading-relaxed italic flex-1" style={{ color: 'var(--text2)' }}>"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: t.color + '22', color: t.color }}>{t.name.split(' ').map(n=>n[0]).join('')}</div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text3)' }}>{t.role} · {t.country}</p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { isAuth } = useAuthStore();

  return (
    <section className="py-16 md:py-24 px-4 md:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-3xl mx-auto text-center">
        <div className="rounded-2xl p-10 md:p-14 relative overflow-hidden animate-border-glow" style={{ backgroundColor: 'var(--surface)', border: '1px solid #22d98a33' }}>
          <div className="absolute inset-0 opacity-5" style={{ background: 'radial-gradient(ellipse at 50% 0%, #22d98a, transparent 70%)' }} />
          <div className="relative flex flex-col items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Zap size={24} className="text-emerald-400" />
            </div>
            <h2 className="font-['Syne',sans-serif] text-3xl md:text-4xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>
              Start growing your store today
            </h2>
            <p className="text-base max-w-md" style={{ color: 'var(--text2)' }}>
              Join 2,400+ African merchants already using Merchant Analytics. Free forever. No credit card.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white transition-all hover:scale-105">
                Create free account
              </Link>
              <Link to={isAuth ? '/app' : '/login'} className="px-8 py-3.5 rounded-xl text-sm font-medium transition-all hover:scale-105" style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}>
                {isAuth ? 'Go to dashboard' : 'View live demo'}
              </Link>
            </div>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>
              <CheckCircle size={12} className="inline mr-1 text-emerald-400" />
              Free forever · No credit card · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-4 md:px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-['Syne',sans-serif] text-sm font-bold tracking-tight" style={{ color: 'var(--text)' }}>merchant<span className="text-emerald-400">.</span>analytics</span>
            </Link>
            <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--text3)' }}>The analytics platform built for African e-commerce.</p>
            <p className="text-xs" style={{ color: 'var(--text3)' }}>Built in Zambia 🇿🇲</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Integrations', 'Changelog', 'Status'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Resources', links: ['Documentation', 'API Reference', 'Community', 'Help Center'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'GDPR', 'POPIA'] },
          ].map(col => (
            <div key={col.title}>
              <p className="font-mono text-[10px] tracking-widest uppercase mb-4" style={{ color: 'var(--text3)' }}>{col.title}</p>
              <div className="flex flex-col gap-2.5">
                {col.links.map(link => (
                  <a key={link} href="#" className="text-xs transition-colors hover:translate-x-1" style={{ color: 'var(--text2)' }}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 gap-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text3)' }}>© 2026 Merchant Analytics Ltd. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs" style={{ color: 'var(--text3)' }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <HeroSection />
      <LogoMarquee />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <IntegrationsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}