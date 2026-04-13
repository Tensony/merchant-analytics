import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';
import { ThemeToggle } from '../ui/ThemeToggle';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview',  path: '/',          icon: '▦' },
  { label: 'Products',  path: '/products',  icon: '◫' },
  { label: 'Customers', path: '/customers', icon: '◉' },
  { label: 'Campaigns', path: '/campaigns', icon: '◈' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'Settings', path: '/settings', icon: '◎' },
];

export function Sidebar() {
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
        <span
          className="font-['Syne',sans-serif] text-[15px] font-bold tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          merchant<span className="text-emerald-400">.</span>analytics
        </span>
        <div className="mt-1.5">
          <span className="bg-emerald-950 text-emerald-400 font-mono text-[9px] font-medium px-1.5 py-0.5 rounded tracking-widest">
            LIVE
          </span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
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
            end={item.path === '/'}
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

        {/* Theme toggle + user chip */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg flex-1 min-w-0"
            style={{ border: '1px solid var(--border)' }}
          >
            <div className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 font-mono text-[10px] font-medium flex-shrink-0">
              TM
            </div>
            <div className="overflow-hidden">
              <p
                className="text-xs font-medium truncate"
                style={{ color: 'var(--text)' }}
              >
                Tenson M.
              </p>
              <p
                className="text-[10px] font-mono truncate"
                style={{ color: 'var(--text3)' }}
              >
                Admin
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}