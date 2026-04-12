import type { GeoRegion } from '../../types';

interface GeoListProps {
  regions: GeoRegion[];
}

export function GeoList({ regions }: GeoListProps) {
  return (
    <div className="py-2">
      {regions.map((r) => (
        <div
          key={r.name}
          className="flex items-center gap-2.5 px-[18px] py-1.5 hover:bg-[#1e222b] transition-colors cursor-default"
        >
          <span className="text-base w-5 text-center leading-none">{r.flag}</span>
          <span className="flex-1 text-xs text-[#e8eaf0]">{r.name}</span>
          <div className="w-[70px] h-1 bg-[#252a35] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${r.pct}%`, backgroundColor: r.color }}
            />
          </div>
          <span className="font-mono text-[11px] text-[#8b90a0] w-8 text-right">
            {r.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}