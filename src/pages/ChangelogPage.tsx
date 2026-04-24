import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle';

interface ChangelogEntry {
  version:  string;
  date:     string;
  type:     'major' | 'minor' | 'patch';
  changes:  { type: 'new' | 'improved' | 'fixed'; text: string }[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: '1.4.0', date: 'Mar 30, 2024', type: 'major',
    changes: [
      { type: 'new',      text: 'Real-time order feed via WebSocket' },
      { type: 'new',      text: 'Chart drill-down — click any bar for day breakdown' },
      { type: 'new',      text: 'KPI drill-down modal with current vs previous period' },
      { type: 'new',      text: 'Chart annotations — pin notes on specific dates' },
      { type: 'new',      text: 'Comparison mode overlay on revenue chart' },
      { type: 'improved', text: 'Mobile responsive layout across all pages' },
    ],
  },
  {
    version: '1.3.0', date: 'Mar 22, 2024', type: 'major',
    changes: [
      { type: 'new',      text: 'Store switcher — manage multiple stores' },
      { type: 'new',      text: 'Global search with Cmd+K keyboard shortcut' },
      { type: 'new',      text: 'Notifications center with unread badge' },
      { type: 'new',      text: 'Date range picker for custom time windows' },
      { type: 'new',      text: 'Pagination on all data tables' },
      { type: 'improved', text: 'Funnel chart with animated bars' },
    ],
  },
  {
    version: '1.2.0', date: 'Mar 15, 2024', type: 'major',
    changes: [
      { type: 'new',      text: 'Pricing page with payment modal' },
      { type: 'new',      text: 'Plan upgrade flow (Starter → Growth → Pro)' },
      { type: 'new',      text: 'Auth guard — dashboard protected from unauthenticated access' },
      { type: 'new',      text: 'Register page with form validation' },
      { type: 'new',      text: 'Settings page — profile, notifications, danger zone' },
      { type: 'fixed',    text: 'Sign out now correctly clears auth state' },
    ],
  },
  {
    version: '1.1.0', date: 'Mar 8, 2024', type: 'minor',
    changes: [
      { type: 'new',      text: 'Zustand global store with localStorage persistence' },
      { type: 'new',      text: 'Dark / light theme toggle that persists on refresh' },
      { type: 'new',      text: 'CSV export for orders and products' },
      { type: 'new',      text: 'Shareable URL state — filters saved in query params' },
      { type: 'improved', text: 'Anomaly toast notifications on dashboard load' },
    ],
  },
  {
    version: '1.0.0', date: 'Mar 1, 2024', type: 'major',
    changes: [
      { type: 'new', text: 'Initial launch — Overview, Products, Customers, Campaigns pages' },
      { type: 'new', text: 'KPI cards with sparklines and delta indicators' },
      { type: 'new', text: 'Revenue chart with bar and line toggle' },
      { type: 'new', text: 'Conversion funnel chart' },
      { type: 'new', text: 'Channel donut chart' },
      { type: 'new', text: 'Cohort retention heatmap' },
      { type: 'new', text: 'FastAPI backend with SQLite database' },
    ],
  },
];

const TYPE_CONFIG = {
  new:      { label: 'New',      color: '#22d98a' },
  improved: { label: 'Improved', color: '#4d9cf8' },
  fixed:    { label: 'Fixed',    color: '#f5a623' },
};

const VERSION_CONFIG = {
  major: { label: 'Major',  color: '#22d98a' },
  minor: { label: 'Minor',  color: '#4d9cf8' },
  patch: { label: 'Patch',  color: '#f5a623' },
};

export function ChangelogPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Link to="/">
          <span
            className="font-['Syne',sans-serif] text-base font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            merchant<span className="text-emerald-400">.</span>analytics
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            to="/app"
            className="text-sm px-4 py-1.5 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] transition-colors"
          >
            Go to dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-14">
          <p
            className="font-mono text-[11px] tracking-widest uppercase mb-3"
            style={{ color: 'var(--text3)' }}
          >
            Product updates
          </p>
          <h1
            className="font-['Syne',sans-serif] text-4xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--text)' }}
          >
            Changelog
          </h1>
          <p className="text-base" style={{ color: 'var(--text2)' }}>
            All notable changes, improvements and fixes to Merchant Analytics.
          </p>
        </div>

        {/* Entries */}
        <div className="flex flex-col gap-0">
          {CHANGELOG.map((entry, i) => {
            const vConfig = VERSION_CONFIG[entry.type];
            return (
              <div
                key={entry.version}
                className="flex gap-8"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center w-4 flex-shrink-0 pt-1">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: vConfig.color }}
                  />
                  {i < CHANGELOG.length - 1 && (
                    <div
                      className="flex-1 w-px mt-2"
                      style={{ backgroundColor: 'var(--border)' }}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-12">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="font-['Syne',sans-serif] text-lg font-bold tracking-tight"
                      style={{ color: 'var(--text)' }}
                    >
                      v{entry.version}
                    </span>
                    <span
                      className="font-mono text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: vConfig.color + '22',
                        color:           vConfig.color,
                      }}
                    >
                      {vConfig.label}
                    </span>
                    <span
                      className="font-mono text-[11px]"
                      style={{ color: 'var(--text3)' }}
                    >
                      {entry.date}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {entry.changes.map((change, j) => {
                      const cConfig = TYPE_CONFIG[change.type];
                      return (
                        <div key={j} className="flex items-start gap-3">
                          <span
                            className="font-mono text-[10px] font-medium px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                            style={{
                              backgroundColor: cConfig.color + '22',
                              color:           cConfig.color,
                            }}
                          >
                            {cConfig.label}
                          </span>
                          <span
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--text2)' }}
                          >
                            {change.text}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}