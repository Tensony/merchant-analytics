import { clsx } from 'clsx';
import type { Product } from '../../types';

type SortKey = 'revenue' | 'sales' | 'delta';
type SortDir = 'asc' | 'desc';

interface ProductsTableProps {
  products: Product[];
  sortKey:  SortKey;
  sortDir:  SortDir;
  onSort:   (key: SortKey) => void;
}

const MAX_REVENUE = 71360;

const COLUMNS: { label: string; key: SortKey | null; align: string }[] = [
  { label: 'Product', key: null,      align: 'text-left'  },
  { label: 'Sales',   key: 'sales',   align: 'text-left'  },
  { label: 'Trend',   key: 'delta',   align: 'text-left'  },
  { label: 'Revenue', key: 'revenue', align: 'text-right' },
];

export function ProductsTable({ products, sortKey, sortDir, onSort }: ProductsTableProps) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr>
          {COLUMNS.map((col) => (
            <th
              key={col.label}
              onClick={() => col.key && onSort(col.key)}
              className={clsx(
                'font-mono text-[10px] tracking-widest uppercase px-[18px] pb-3',
                col.align,
                col.key
                  ? 'cursor-pointer select-none transition-colors'
                  : ''
              )}
              style={{ color: 'var(--text3)' }}
            >
              {col.label}
              {col.key && sortKey === col.key && (
                <span className="ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td
              colSpan={4}
              className="px-[18px] py-8 text-center text-xs"
              style={{ color: 'var(--text3)' }}
            >
              No products found.
            </td>
          </tr>
        ) : (
          products.map((p) => {
            const barPct = Math.round((p.revenue / MAX_REVENUE) * 100);
            return (
              <tr
                key={p.id}
                className="transition-colors cursor-default"
                style={{ borderTop: '1px solid var(--border)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--surface2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                }}
              >
                <td className="px-[18px] py-2.5">
                  <span
                    className="font-medium block text-xs"
                    style={{ color: 'var(--text)' }}
                  >
                    {p.name}
                  </span>
                  <span
                    className="text-[10px] font-mono"
                    style={{ color: 'var(--text3)' }}
                  >
                    {p.category}
                  </span>
                </td>
                <td
                  className="px-[18px] py-2.5 text-xs"
                  style={{ color: 'var(--text2)' }}
                >
                  {p.sales.toLocaleString()}
                </td>
                <td className="px-[18px] py-2.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-16 h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--surface3)' }}
                    >
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${barPct}%` }}
                      />
                    </div>
                    <span
                      className={clsx(
                        'font-mono text-[10px]',
                        p.delta >= 0 ? 'text-emerald-400' : 'text-red-400'
                      )}
                    >
                      {p.delta >= 0 ? '▲' : '▼'} {Math.abs(p.delta)}%
                    </span>
                  </div>
                </td>
                <td
                  className="px-[18px] py-2.5 text-right font-mono text-[11px]"
                  style={{ color: 'var(--text)' }}
                >
                  ${p.revenue.toLocaleString()}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}