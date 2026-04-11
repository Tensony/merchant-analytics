import type { Product } from '../../types';
import { clsx } from 'clsx';

interface ProductsTableProps {
  products: Product[];
}

const maxRevenue = 71360;

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <table className="w-full text-xs">
      <thead>
        <tr>
          {['Product', 'Sales', 'Trend', 'Revenue'].map((h) => (
            <th
              key={h}
              className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] px-[18px] pb-3 text-left last:text-right"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {products.map((p) => {
          const barPct = Math.round((p.revenue / maxRevenue) * 100);
          return (
            <tr key={p.id} className="border-t border-[#2a2f3d] hover:bg-[#1e222b] transition-colors">
              <td className="px-[18px] py-2.5">
                <span className="text-[#e8eaf0] font-medium block">{p.name}</span>
                <span className="text-[10px] font-mono text-[#555c70]">{p.category}</span>
              </td>
              <td className="px-[18px] py-2.5 text-[#8b90a0]">
                {p.sales.toLocaleString()}
              </td>
              <td className="px-[18px] py-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-16 h-1 bg-[#252a35] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${barPct}%` }}
                    />
                  </div>
                  <span className={clsx('font-mono text-[10px]', p.delta >= 0 ? 'text-emerald-400' : 'text-red-400')}>
                    {p.delta >= 0 ? '▲' : '▼'} {Math.abs(p.delta)}%
                  </span>
                </div>
              </td>
              <td className="px-[18px] py-2.5 text-right font-mono text-[11px] text-[#e8eaf0]">
                ${p.revenue.toLocaleString()}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}