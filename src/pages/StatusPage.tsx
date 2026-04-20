import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../components/ui/ThemeToggle';

interface Service {
  name:    string;
  status:  'operational' | 'degraded' | 'outage';
  latency: number;
  uptime:  string;
}

const SERVICES: Service[] = [
  { name: 'Dashboard API',      status: 'operational', latency: 42,  uptime: '99.98%' },
  { name: 'WebSocket Feed',     status: 'operational', latency: 18,  uptime: '99.95%' },
  { name: 'Authentication',     status: 'operational', latency: 65,  uptime: '100%'   },
  { name: 'Data Pipeline',      status: 'operational', latency: 120, uptime: '99.91%' },
  { name: 'Email Delivery',     status: 'operational', latency: 280, uptime: '99.87%' },
  { name: 'Export Service',     status: 'operational', latency: 340, uptime: '99.94%' },
];

interface Incident {
  date:    string;
  title:   string;
  status:  'resolved' | 'monitoring' | 'investigating';
  updates: { time: string; text: string }[];
}

const INCIDENTS: Incident[] = [
  {
    date: 'Mar 15, 2024', status: 'resolved',
    title: 'Elevated latency on Dashboard API',
    updates: [
      { time: '14:22 UTC', text: 'Issue resolved. API latency returned to normal levels.' },
      { time: '13:45 UTC', text: 'Investigating elevated latency. Average response time 340ms vs normal 42ms.' },
      { time: '13:30 UTC', text: 'Monitoring alerts triggered for Dashboard API.' },
    ],
  },
  {
    date: 'Mar 3, 2024', status: 'resolved',
    title: 'WebSocket connections dropping intermittently',
    updates: [
      { time: '09:12 UTC', text: 'Issue resolved. All WebSocket connections stable.' },
      { time: '08:40 UTC', text: 'Deploying fix for connection pool exhaustion.' },
      { time: '08:15 UTC', text: 'Identified root cause — connection pool limit reached during traffic spike.' },
    ],
  },
];

const STATUS_CONFIG = {
  operational:   { label: 'Operational',   color: '#22d98a', bg: '#22d98a22' },
  degraded:      { label: 'Degraded',      color: '#f5a623', bg: '#f5a62322' },
  outage:        { label: 'Outage',        color: '#ff5757', bg: '#ff575722' },
};

const INCIDENT_STATUS = {
  resolved:      { label: 'Resolved',      color: '#22d98a' },
  monitoring:    { label: 'Monitoring',    color: '#4d9cf8' },
  investigating: { label: 'Investigating', color: '#f5a623' },
};

function UptimeBar() {
  const days = Array.from({ length: 90 }, (_, i) => ({
    day: i,
    status: i === 14 || i === 76 ? 'degraded' : 'operational' as const,
  }));

  return (
    <div className="flex items-end gap-0.5 h-8">
      {days.map((d) => (
        <div
          key={d.day}
          className="flex-1 rounded-sm"
          style={{
            height:          d.status === 'degraded' ? '60%' : '100%',
            backgroundColor: d.status === 'degraded' ? '#f5a623' : '#22d98a44',
            minWidth:        '2px',
          }}
          title={`Day ${d.day + 1}: ${d.status}`}
        />
      ))}
    </div>
  );
}

export function StatusPage() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const allOperational = SERVICES.every((s) => s.status === 'operational');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>

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
            Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Overall status */}
        <div
          className="rounded-2xl p-8 text-center mb-10"
          style={{
            backgroundColor: allOperational ? '#22d98a11' : '#f5a62311',
            border:          `1px solid ${allOperational ? '#22d98a33' : '#f5a62333'}`,
          }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{
              backgroundColor: allOperational ? '#22d98a22' : '#f5a62322',
              color:           allOperational ? '#22d98a'   : '#f5a623',
            }}
          >
            {allOperational ? '✓' : '⚠'}
          </div>
          <h1
            className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight mb-2"
            style={{ color: 'var(--text)' }}
          >
            {allOperational ? 'All systems operational' : 'Some systems degraded'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text3)' }}>
            Last updated: {now.toUTCString()}
          </p>
        </div>

        {/* 90-day uptime */}
        <div
          className="rounded-xl p-5 mb-6"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p
              className="font-['Syne',sans-serif] text-sm font-semibold"
              style={{ color: 'var(--text)' }}
            >
              90-day uptime
            </p>
            <span className="font-mono text-sm text-emerald-400 font-medium">
              99.96%
            </span>
          </div>
          <UptimeBar />
          <div className="flex items-center justify-between mt-2">
            <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
              90 days ago
            </span>
            <span className="font-mono text-[10px]" style={{ color: 'var(--text3)' }}>
              Today
            </span>
          </div>
        </div>

        {/* Services */}
        <div
          className="rounded-xl overflow-hidden mb-8"
          style={{ border: '1px solid var(--border)' }}
        >
          <div
            className="px-5 py-3"
            style={{
              backgroundColor: 'var(--surface)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <p
              className="font-['Syne',sans-serif] text-sm font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Services
            </p>
          </div>
          {SERVICES.map((service, i) => {
            const config = STATUS_CONFIG[service.status];
            return (
              <div
                key={service.name}
                className="flex items-center justify-between px-5 py-4"
                style={{
                  borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                  backgroundColor: 'var(--surface)',
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: config.color }}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {service.name}
                    </p>
                    <p className="text-[11px] font-mono" style={{ color: 'var(--text3)' }}>
                      {service.latency}ms avg · {service.uptime} uptime
                    </p>
                  </div>
                </div>
                <span
                  className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: config.bg,
                    color:           config.color,
                  }}
                >
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Incident history */}
        <div>
          <p
            className="font-['Syne',sans-serif] text-sm font-semibold mb-4"
            style={{ color: 'var(--text)' }}
          >
            Incident history
          </p>
          <div className="flex flex-col gap-4">
            {INCIDENTS.map((incident) => {
              const iConfig = INCIDENT_STATUS[incident.status];
              return (
                <div
                  key={incident.title}
                  className="rounded-xl overflow-hidden"
                  style={{ border: '1px solid var(--border)' }}
                >
                  <div
                    className="flex items-center justify-between px-5 py-3"
                    style={{
                      backgroundColor: 'var(--surface)',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>
                        {incident.title}
                      </p>
                      <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--text3)' }}>
                        {incident.date}
                      </p>
                    </div>
                    <span
                      className="font-mono text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: iConfig.color + '22',
                        color:           iConfig.color,
                      }}
                    >
                      {iConfig.label}
                    </span>
                  </div>
                  <div style={{ backgroundColor: 'var(--surface)' }}>
                    {incident.updates.map((update, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 px-5 py-3"
                        style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}
                      >
                        <span
                          className="font-mono text-[10px] flex-shrink-0 mt-0.5"
                          style={{ color: 'var(--text3)' }}
                        >
                          {update.time}
                        </span>
                        <p className="text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
                          {update.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}