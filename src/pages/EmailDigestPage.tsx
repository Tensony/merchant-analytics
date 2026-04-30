import { Link } from 'react-router-dom';
import { PRODUCTS } from '../data/mockData';

const DIGEST_DATE = 'Week of Mar 25–30, 2024';

interface MetricRow {
  label:   string;
  current: string;
  prev:    string;
  delta:   string;
  up:      boolean;
}

const METRICS: MetricRow[] = [
  { label: 'Total Revenue',    current: '$284,920', prev: '$253,800', delta: '+12.4%', up: true  },
  { label: 'Orders',           current: '4,821',    prev: '4,460',    delta: '+8.1%',  up: true  },
  { label: 'Avg Order Value',  current: '$59.10',   prev: '$56.88',   delta: '+3.9%',  up: true  },
  { label: 'Churn Rate',       current: '2.4%',     prev: '2.7%',     delta: '−0.3pp', up: true  },
  { label: 'New Customers',    current: '341',      prev: '298',      delta: '+14.4%', up: true  },
  { label: 'Refund Rate',      current: '1.8%',     prev: '2.1%',     delta: '−0.3pp', up: true  },
];

export function EmailDigestPage() {
  function handleDownload() {
    window.print();
  }

  return (
    <div className="flex flex-col gap-4 p-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="font-['Syne',sans-serif] text-xl font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Email digest preview
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
            This is how your weekly report looks in your inbox
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="text-xs px-4 py-2 rounded-lg transition-all flex items-center gap-1.5"
            style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            ↓ Download PDF
          </button>
          <button
            className="text-xs px-4 py-2 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] transition-colors"
          >
            ✉ Send test email
          </button>
        </div>
      </div>

      {/* Email preview wrapper */}
      <div className="max-w-2xl mx-auto w-full">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border)' }}
        >

          {/* Email chrome */}
          <div
            className="px-5 py-3 flex items-center gap-3 text-xs"
            style={{
              backgroundColor: 'var(--surface2)',
              borderBottom: '1px solid var(--border)',
              color: 'var(--text3)',
            }}
          >
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex gap-2">
                <span className="font-medium" style={{ color: 'var(--text2)' }}>From:</span>
                <span>digest@merchant.analytics</span>
              </div>
              <div className="flex gap-2">
                <span className="font-medium" style={{ color: 'var(--text2)' }}>Subject:</span>
                <span style={{ color: 'var(--text)' }}>
                  📊 Your weekly report — {DIGEST_DATE}
                </span>
              </div>
            </div>
          </div>

          {/* Email body */}
          <div style={{ backgroundColor: 'var(--bg)', padding: '32px' }}>

            {/* Email header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: '#22d98a22', color: '#22d98a' }}
                >
                  M
                </div>
                <span
                  className="font-['Syne',sans-serif] text-base font-bold tracking-tight"
                  style={{ color: 'var(--text)' }}
                >
                  merchant<span className="text-emerald-400">.</span>analytics
                </span>
              </div>
              <h2
                className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight mb-1"
                style={{ color: 'var(--text)' }}
              >
                Weekly Performance Report
              </h2>
              <p className="text-sm" style={{ color: 'var(--text3)' }}>
                {DIGEST_DATE}
              </p>
            </div>

            {/* Highlight banner */}
            <div
              className="rounded-xl p-4 mb-6 text-center"
              style={{
                backgroundColor: '#22d98a11',
                border: '1px solid #22d98a33',
              }}
            >
              <p className="text-sm" style={{ color: 'var(--text2)' }}>
                Revenue this week
              </p>
              <p
                className="font-['Syne',sans-serif] text-3xl font-bold tracking-tight my-1"
                style={{ color: '#22d98a' }}
              >
                $284,920
              </p>
              <p className="text-xs" style={{ color: '#22d98a' }}>
                ▲ 12.4% compared to last week
              </p>
            </div>

            {/* Metrics table */}
            <div
              className="rounded-xl overflow-hidden mb-6"
              style={{ border: '1px solid var(--border)' }}
            >
              <div
                className="px-4 py-3"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <p
                  className="font-['Syne',sans-serif] text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Key metrics
                </p>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ backgroundColor: 'var(--surface2)' }}>
                    {['Metric', 'This week', 'Last week', 'Change'].map((h) => (
                      <th
                        key={h}
                        className="font-mono text-[10px] tracking-widest uppercase px-4 py-2.5 text-left"
                        style={{ color: 'var(--text3)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {METRICS.map((m) => (
                    <tr
                      key={m.label}
                      style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
                    >
                      <td className="px-4 py-2.5" style={{ color: 'var(--text2)' }}>
                        {m.label}
                      </td>
                      <td
                        className="px-4 py-2.5 font-mono font-medium"
                        style={{ color: 'var(--text)' }}
                      >
                        {m.current}
                      </td>
                      <td
                        className="px-4 py-2.5 font-mono"
                        style={{ color: 'var(--text3)' }}
                      >
                        {m.prev}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="font-mono text-[11px] px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: m.up ? '#22d98a22' : '#ff575722',
                            color:           m.up ? '#22d98a'   : '#ff5757',
                          }}
                        >
                          {m.delta}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top products */}
            <div
              className="rounded-xl overflow-hidden mb-6"
              style={{ border: '1px solid var(--border)' }}
            >
              <div
                className="px-4 py-3"
                style={{
                  backgroundColor: 'var(--surface)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <p
                  className="font-['Syne',sans-serif] text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Top 3 products this week
                </p>
              </div>
              {PRODUCTS.slice(0, 3).map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    backgroundColor: 'var(--surface)',
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold flex-shrink-0"
                    style={{
                      backgroundColor: ['#22d98a22','#4d9cf822','#a78bfa22'][i],
                      color:           ['#22d98a','#4d9cf8','#a78bfa'][i],
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                      {p.name}
                    </p>
                    <p className="text-[10px] font-mono" style={{ color: 'var(--text3)' }}>
                      {p.sales.toLocaleString()} units
                    </p>
                  </div>
                  <p
                    className="font-mono text-xs font-medium flex-shrink-0"
                    style={{ color: 'var(--text)' }}
                  >
                    ${p.revenue.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Anomaly alert */}
            <div
              className="rounded-xl p-4 mb-6 flex items-start gap-3"
              style={{
                backgroundColor: '#f5a62311',
                border: '1px solid #f5a62333',
              }}
            >
              <span className="text-amber-400 text-base flex-shrink-0">⚠</span>
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>
                  Anomaly detected
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
                  Revenue on Mar 15 was 187% above the 7-day average ($20,664 vs $7,200 avg).
                  This appears to be related to a flash sale event.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to="/app"
                className="inline-block px-8 py-3 rounded-xl text-sm font-semibold transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
              >
                View full dashboard →
              </Link>
              <p className="text-[10px] mt-4" style={{ color: 'var(--text3)' }}>
                You are receiving this because you enabled weekly digests in{' '}
                <Link to="/app/settings" className="text-emerald-400 hover:underline">
                  Settings
                </Link>
                . · <a href="#" className="text-emerald-400 hover:underline">Unsubscribe</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}