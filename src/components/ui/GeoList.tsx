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
          className="flex items-center gap-2.5 px-[18px] py-1.5 transition-colors cursor-default"
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.backgroundColor = 'var(--surface2)';
          }}
          onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <span className="text-base w-5 text-center leading-none">{r.flag}</span>
          <span className="flex-1 text-xs" style={{ color: 'var(--text)' }}>{r.name}</span>
          <div 
            className="w-[70px] h-1 rounded-full overflow-hidden"
            style={{ backgroundColor: 'var(--surface3)' }}
          >
            <div
              className="h-full rounded-full"
              style={{ width: `${r.pct}%`, backgroundColor: r.color }}
            />
          </div>
          <span className="font-mono text-[11px] w-8 text-right" style={{ color: 'var(--text2)' }}>
            {r.pct}%
          </span>
        </div>
      ))}
    </div>
  );
}