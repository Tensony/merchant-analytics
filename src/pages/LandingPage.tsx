import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle';

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '▦',
    title: 'Real-time overview',
    desc: 'See revenue, orders, AOV and churn at a glance. KPIs update live as your store processes orders.',
    color: '#22d98a',
  },
  {
    icon: '◈',
    title: 'Anomaly detection',
    desc: 'Automatic spike and drop alerts. Know immediately when something unusual happens in your data.',
    color: '#f5a623',
  },
  {
    icon: '◫',
    title: 'Product intelligence',
    desc: 'Track which products are trending, which are declining, and where your margin is coming from.',
    color: '#4d9cf8',
  },
  {
    icon: '◉',
    title: 'Customer cohorts',
    desc: 'Understand retention month by month. Identify at-risk customers before they churn.',
    color: '#a78bfa',
  },
  {
    icon: '◐',
    title: 'Campaign analytics',
    desc: 'Track ROAS, CTR and CVR across email, paid, social and SMS campaigns in one place.',
    color: '#f06291',
  },
  {
    icon: '↓',
    title: 'CSV export & sharing',
    desc: 'Export any dataset to CSV instantly. Share filtered dashboard views via URL.',
    color: '#4dd0e1',
  },
];

const PRICING_TIERS = [
  {
    name:    'Starter',
    price:   'Free',
    sub:     'forever',
    color:   '#8b90a0',
    popular: false,
    features: [
      '1 store connected',
      '30-day data history',
      'Core dashboard',
      'CSV export',
      'Email support',
    ],
    cta:     'Get started free',
    ctaPath: '/register',
  },
  {
    name:    'Growth',
    price:   '$19',
    sub:     'per month',
    color:   '#22d98a',
    popular: true,
    features: [
      '3 stores connected',
      '90-day data history',
      'Everything in Starter',
      'Anomaly alerts',
      'Scheduled email reports',
      'Priority support',
    ],
    cta:     'Start free trial',
    ctaPath: '/pricing',
  },
  {
    name:    'Pro',
    price:   '$49',
    sub:     'per month',
    color:   '#4d9cf8',
    popular: false,
    features: [
      'Unlimited stores',
      'Full data history',
      'Everything in Growth',
      'Real-time order feed',
      'API access',
      'Custom anomaly rules',
      'Dedicated support',
    ],
    cta:     'Start free trial',
    ctaPath: '/pricing',
  },
];

const TESTIMONIALS = [
  {
    name:    'Chioma Eze',
    role:    'Founder, ShopLagos',
    country: '🇳🇬',
    quote:   'We went from spending 3 hours on weekly reports to having everything live on screen. The anomaly alerts alone saved us during our Black Friday sale.',
  },
  {
    name:    'Kwame Asante',
    role:    'Head of E-commerce, Accra Mart',
    country: '🇬🇭',
    quote:   'Finally an analytics tool that understands African market timezones and currencies. The cohort retention chart helped us cut churn by 18% in two months.',
  },
  {
    name:    'Amara Diallo',
    role:    'CEO, DakarStore',
    country: '🇸🇳',
    quote:   'Clean, fast, and actually affordable. We tried Shopify Analytics and Mixpanel — this gives us what we need at a fraction of the cost.',
  },
];

const STATS = [
  { value: '2,400+', label: 'Stores tracked'    },
  { value: '$48M+',  label: 'Revenue monitored' },
  { value: '14',     label: 'African countries' },
  { value: '99.9%',  label: 'Uptime'            },
];

const NAV_LINKS = ['Features', 'Pricing', 'Testimonials'];
const FOOTER_LINKS = ['Privacy', 'Terms', 'Contact', 'Status'];

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{
        backgroundColor: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <Link to="/">
        <span
          className="font-['Syne',sans-serif] text-lg font-bold tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          merchant<span className="text-emerald-400">.</span>analytics
        </span>
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6">
        {NAV_LINKS.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-sm transition-colors"
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

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/login"
          className="text-sm px-3 py-1.5 rounded-lg transition-all"
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
          className="text-sm px-4 py-1.5 rounded-lg font-medium transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
        >
          Get started free
        </Link>
      </div>
    </nav>
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-6 pt-24 pb-20 gap-6">

        {/* Eyebrow badge */}
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono"
          style={{
            backgroundColor: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text2)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Built for African e-commerce · Free to start
        </div>

        {/* Headline */}
        <h1
          className="font-['Syne',sans-serif] text-5xl font-bold tracking-tight max-w-3xl leading-tight"
          style={{ color: 'var(--text)' }}
        >
          Know your numbers.{' '}
          <span className="text-emerald-400">Grow your business.</span>
        </h1>

        {/* Sub headline */}
        <p
          className="text-lg max-w-xl leading-relaxed"
          style={{ color: 'var(--text2)' }}
        >
          Merchant Analytics gives African online stores a real-time dashboard
          to track revenue, products, customers and campaigns — all in one place.
          No spreadsheets. No guessing.
        </p>

        {/* CTA buttons */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
          >
            Start for free — no credit card
          </Link>
          <Link
            to="/app"
            className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
            style={{
              border: '1px solid var(--border)',
              color: 'var(--text2)',
            }}
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

        {/* Trust line */}
        <p className="text-xs" style={{ color: 'var(--text3)' }}>
          Trusted by 2,400+ stores across 14 African countries
        </p>

        {/* Dashboard preview mockup */}
        <div
          className="w-full max-w-5xl rounded-2xl overflow-hidden mt-4"
          style={{ border: '1px solid var(--border)' }}
        >
          {/* Browser chrome */}
          <div
            className="px-4 py-2.5 flex items-center gap-2"
            style={{
              backgroundColor: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span
              className="ml-2 font-mono text-[11px]"
              style={{ color: 'var(--text3)' }}
            >
              app.merchant.analytics/app
            </span>
          </div>

          {/* Mini dashboard */}
          <div
            className="p-6 grid gap-3"
            style={{ backgroundColor: 'var(--bg)' }}
          >
            {/* KPI row */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Revenue',    value: '$284,920', delta: '+12.4%', color: '#22d98a' },
                { label: 'Orders',     value: '4,821',    delta: '+8.1%',  color: '#4d9cf8' },
                { label: 'Avg Order',  value: '$59.10',   delta: '+3.9%',  color: '#a78bfa' },
                { label: 'Churn Rate', value: '2.4%',     delta: '-0.3pp', color: '#ff5757' },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-xl p-3"
                  style={{
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <p
                    className="font-mono text-[9px] tracking-widest uppercase mb-1.5"
                    style={{ color: 'var(--text3)' }}
                  >
                    {kpi.label}
                  </p>
                  <p
                    className="font-['Syne',sans-serif] text-lg font-bold tracking-tight"
                    style={{ color: 'var(--text)' }}
                  >
                    {kpi.value}
                  </p>
                  <span
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded mt-1 inline-block"
                    style={{
                      backgroundColor: kpi.color + '22',
                      color: kpi.color,
                    }}
                  >
                    {kpi.delta}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart bars */}
            <div
              className="rounded-xl p-4 h-32 flex items-end gap-1"
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              {[40,65,45,70,55,80,60,75,90,85,95,187,70,65,
                60,75,80,70,85,90,78,82,88,76,84,79,91,86,83,88]
                .map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${Math.min(h * 0.45, 100)}%`,
                      backgroundColor: i === 11 ? '#f5a623' : '#22d98a44',
                      minHeight: '4px',
                    }}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section
        className="py-14 px-6"
        style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-['Syne',sans-serif] text-3xl font-bold tracking-tight text-emerald-400">
                {s.value}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="font-mono text-[11px] tracking-widest uppercase mb-3"
              style={{ color: 'var(--text3)' }}
            >
              Everything you need
            </p>
            <h2
              className="font-['Syne',sans-serif] text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Built for how African stores actually work
            </h2>
            <p
              className="text-base mt-3 max-w-xl mx-auto"
              style={{ color: 'var(--text2)' }}
            >
              From Lusaka to Lagos, our dashboard speaks your business language —
              mobile money, multi-currency, local timezones.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-5 flex flex-col gap-3 transition-all duration-200"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.borderColor = f.color + '66';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{
                    backgroundColor: f.color + '22',
                    color: f.color,
                  }}
                >
                  {f.icon}
                </div>
                <h3
                  className="font-['Syne',sans-serif] text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: 'var(--text2)' }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-20 px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="font-mono text-[11px] tracking-widest uppercase mb-3"
              style={{ color: 'var(--text3)' }}
            >
              Pricing
            </p>
            <h2
              className="font-['Syne',sans-serif] text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Start free. Scale when you're ready.
            </h2>
            <p className="text-base mt-3" style={{ color: 'var(--text2)' }}>
              No credit card required. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className="rounded-xl p-6 flex flex-col gap-5 relative"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: tier.popular
                    ? `2px solid ${tier.color}`
                    : '1px solid var(--border)',
                }}
              >
                {tier.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[10px] font-medium px-3 py-1 rounded-full whitespace-nowrap"
                    style={{
                      backgroundColor: tier.color,
                      color: '#0d0f12',
                    }}
                  >
                    Most popular
                  </div>
                )}

                <div>
                  <p
                    className="font-['Syne',sans-serif] text-sm font-semibold mb-3"
                    style={{ color: 'var(--text)' }}
                  >
                    {tier.name}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span
                      className="font-['Syne',sans-serif] text-4xl font-bold tracking-tight"
                      style={{ color: tier.color }}
                    >
                      {tier.price}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text3)' }}>
                      {tier.sub}
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
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
                  to={tier.ctaPath}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section
        id="testimonials"
        className="py-20 px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p
              className="font-mono text-[11px] tracking-widest uppercase mb-3"
              style={{ color: 'var(--text3)' }}
            >
              Testimonials
            </p>
            <h2
              className="font-['Syne',sans-serif] text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              Loved by stores across Africa
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-xl p-5 flex flex-col gap-4"
                style={{
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
              >
                <p
                  className="text-sm leading-relaxed italic flex-1"
                  style={{ color: 'var(--text2)' }}
                >
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-mono text-xs font-medium flex-shrink-0"
                    style={{
                      backgroundColor: '#22d98a22',
                      color: '#22d98a',
                    }}
                  >
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p
                      className="text-xs font-medium"
                      style={{ color: 'var(--text)' }}
                    >
                      {t.country} {t.name}
                    </p>
                    <p className="text-[10px]" style={{ color: 'var(--text3)' }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section
        className="py-20 px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div
          className="max-w-3xl mx-auto text-center rounded-2xl p-12 flex flex-col items-center gap-5"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <h2
            className="font-['Syne',sans-serif] text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Start tracking your store today
          </h2>
          <p className="text-base max-w-md" style={{ color: 'var(--text2)' }}>
            Join 2,400+ African online stores already using Merchant Analytics
            to make smarter, faster business decisions.
          </p>
          <div className="flex items-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
            >
              Get started free
            </Link>
            <Link
              to="/app"
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                border: '1px solid var(--border)',
                color: 'var(--text2)',
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.backgroundColor = 'var(--surface2)';
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              View demo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer
        className="py-10 px-6"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <span
            className="font-['Syne',sans-serif] text-sm font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            merchant<span className="text-emerald-400">.</span>analytics
          </span>

          <div className="flex items-center gap-6">
            {FOOTER_LINKS.map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors"
                style={{ color: 'var(--text3)' }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.color = 'var(--text)';
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  e.currentTarget.style.color = 'var(--text3)';
                }}
              >
                {item}
              </a>
            ))}
          </div>

          <p className="text-xs" style={{ color: 'var(--text3)' }}>
            © 2026 Merchant Analytics · Built in Zambia 🇿🇲
          </p>
        </div>
      </footer>
    </div>
  );
}