import { clsx } from 'clsx';
import type { TimeRange } from '../../types';

interface TopbarProps {
  timeRange: TimeRange;
  onTimeRangeChange: (r: TimeRange) => void;
}

const TIME_RANGES: TimeRange[] = ['7d', '30d', '90d', 'ytd'];
const NAV_ITEMS = ['Overview', 'Products', 'Customers', 'Campaigns'];

export function Topbar({ timeRange, onTimeRangeChange }: TopbarProps) {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-[#2a2f3d] bg-[#161920] sticky top-0 z-10">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <span className="font-['Syne',sans-serif] text-base font-bold tracking-tight text-[#e8eaf0]">
          merchant<span className="text-emerald-400">.</span>analytics
        </span>
        <span className="bg-emerald-950 text-emerald-400 font-mono text-[10px] font-medium px-2 py-0.5 rounded tracking-widest">
          LIVE
        </span>
      </div>

      {/* Nav */}
      <nav className="flex gap-1">
        {NAV_ITEMS.map((item, i) => (
          <button
            key={item}
            className={clsx(
              'text-[13px] px-3 py-1.5 rounded-md transition-colors duration-150',
              i === 0
                ? 'bg-[#252a35] text-[#e8eaf0]'
                : 'text-[#8b90a0] hover:bg-[#1e222b] hover:text-[#e8eaf0]'
            )}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Controls */}
      <div className="flex items-center gap-2.5">
        <div className="flex gap-0.5 bg-[#1e222b] p-0.5 rounded-lg border border-[#2a2f3d]">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => onTimeRangeChange(r)}
              className={clsx(
                'font-mono text-[11px] px-2.5 py-1 rounded-md transition-all duration-150',
                timeRange === r
                  ? 'bg-[#252a35] text-[#e8eaf0] border border-[#363d50]'
                  : 'text-[#555c70] hover:text-[#8b90a0]'
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <button className="w-8 h-8 flex items-center justify-center border border-[#2a2f3d] rounded-lg text-[#8b90a0] hover:bg-[#1e222b] hover:text-[#e8eaf0] transition-colors text-sm">
          ↓
        </button>
        <button className="w-8 h-8 flex items-center justify-center border border-[#2a2f3d] rounded-lg text-[#8b90a0] hover:bg-[#1e222b] hover:text-[#e8eaf0] transition-colors text-sm">
          ◎
        </button>
      </div>
    </header>
  );
}