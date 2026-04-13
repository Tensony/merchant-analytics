import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview',   path: '/',           icon: '▦' },
  { label: 'Products',   path: '/products',   icon: '◫' },
  { label: 'Customers',  path: '/customers',  icon: '◉' },
  { label: 'Campaigns',  path: '/campaigns',  icon: '◈' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'Settings', path: '/settings', icon: '◎' },
];

export function Sidebar() {
  return (
    <aside className="w-[220px] flex-shrink-0 bg-[#161920] border-r border-[#2a2f3d] flex flex-col h-screen sticky top-0">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#2a2f3d]">
        <span className="font-['Syne',sans-serif] text-[15px] font-bold tracking-tight text-[#e8eaf0]">
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
        <p className="font-mono text-[9px] tracking-widest uppercase text-[#555c70] px-2 mb-2">
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
                  : 'text-[#8b90a0] hover:bg-[#1e222b] hover:text-[#e8eaf0]'
              )
            }
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 py-4 border-t border-[#2a2f3d] flex flex-col gap-0.5">
        {BOTTOM_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150',
                isActive
                  ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/60'
                  : 'text-[#8b90a0] hover:bg-[#1e222b] hover:text-[#e8eaf0]'
              )
            }
          >
            <span className="text-base leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}

        {/* User chip */}
        <div className="mt-3 flex items-center gap-2.5 px-3 py-2 rounded-lg border border-[#2a2f3d]">
          <div className="w-7 h-7 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 font-mono text-[11px] font-medium flex-shrink-0">
            TM
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-[#e8eaf0] font-medium truncate">Tenson M.</p>
            <p className="text-[10px] text-[#555c70] font-mono truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}