import { useState } from 'react';
import { clsx } from 'clsx';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { NotificationsPanel } from '../ui/NotificationsPanel';
import { GlobalSearch } from '../ui/GlobalSearch';
import { useDashboardStore } from '../../store/useDashboardStore';
import { useAuthStore } from '../../store/useAuthStore';

interface NavItem {
  label: string;
  path:  string;
  icon:  string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview',  path: '/app',           icon: '▦' },
  { label: 'Products',  path: '/app/products',  icon: '◫' },
  { label: 'Customers', path: '/app/customers', icon: '◉' },
  { label: 'Campaigns', path: '/app/campaigns', icon: '◈' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'Settings', path: '/app/settings', icon: '◎' },
];

export function Sidebar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, profile } = useDashboardStore();

  const initials = profile.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className="w-[220px] flex-shrink-0 flex flex-col h-screen sticky top-0"
      style={{
        backgroundColor: 'var(--surface)',
        borderRight: '1px solid var(--border)',
      }}
    >
     {/* Logo */}
<div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
  <Link to="/">
    <span
      className="font-['Syne',sans-serif] text-[15px] font-bold tracking-tight"
      style={{ color: 'var(--text)' }}
    >
      merchant<span className="text-emerald-400">.</span>analytics
    </span>
  </Link>
  <div className="mt-1.5 flex items-center gap-2">
    <span className="bg-emerald-950 text-emerald-400 font-mono text-[9px] font-medium px-1.5 py-0.5 rounded tracking-widest">
      LIVE
    </span>
    <Link
      to="/"
      className="font-mono text-[9px] transition-colors"
      style={{ color: 'var(--text3)' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
    >
      ← Back to site
    </Link>
  </div>
</div>

      {/* Global Search */}
      <div className="px-3 pt-3">
        <button
          onClick={() => setShowSearch(true)}
          className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
          style={{
            backgroundColor: 'var(--surface2)',
            color: 'var(--text3)',
            border: '1px solid var(--border)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface2)';
          }}
        >
          <span>⌘</span>
          <span>Search...</span>
          <span className="ml-auto font-mono text-[10px]">⌘K</span>
        </button>
      </div>

      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}

      {/* Main nav */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-0.5">
        <p
          className="font-mono text-[9px] tracking-widest uppercase px-2 mb-2"
          style={{ color: 'var(--text3)' }}
        >
          Main
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/app'}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60'
                  : 'hover:bg-[var(--surface2)]'
              )
            }
            style={({ isActive }) => ({
              color: isActive ? undefined : 'var(--text2)',
            })}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav */}
      <div
        className="px-3 py-4 flex flex-col gap-0.5"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60'
                  : 'hover:bg-[var(--surface2)]'
              )
            }
            style={({ isActive }) => ({
              color: isActive ? undefined : 'var(--text2)',
            })}
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* Notifications button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
            style={{ color: 'var(--text2)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="text-base leading-none relative">
              ◐
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full flex items-center justify-center font-mono text-[8px] text-[#0d0f12] font-bold">
                  {unreadCount}
                </span>
              )}
            </span>
            <span>Notifications</span>
          </button>

          {showNotifications && (
            <NotificationsPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* Theme toggle + user chip + sign out */}
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg flex-1 min-w-0"
              style={{ border: '1px solid var(--border)' }}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 font-mono text-[10px] font-medium flex-shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                  {profile.displayName}
                </p>
                <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text3)' }}>
                  {user?.plan ?? 'starter'} plan
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>

          {/* Sign out */}
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
            style={{ color: 'var(--text3)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface2)';
              e.currentTarget.style.color = '#ff5757';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text3)';
            }}
          >
            <span>↩</span>
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}