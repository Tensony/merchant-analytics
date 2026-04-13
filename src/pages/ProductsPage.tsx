import { useState, useMemo } from 'react';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { useProductSort } from '../hooks/useProductSort';
import { PRODUCTS } from '../data/mockData';
import { clsx } from 'clsx';

const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Accessories'];

export function ProductsPage() {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    PRODUCTS.filter((p) => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    }),
    [categoryFilter, search]
  );

  const { sortKey, sortDir, sortedProducts, toggleSort } = useProductSort(filtered);

  const totalRevenue = sortedProducts.reduce((a, p) => a + p.revenue, 0);
  const totalSales   = sortedProducts.reduce((a, p) => a + p.sales, 0);

  return (
    <div className="flex flex-col gap-4 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['Syne',sans-serif] text-xl font-bold text-[#e8eaf0] tracking-tight">
            Products
          </h1>
          <p className="text-xs text-[#555c70] mt-0.5">
            {sortedProducts.length} products · ${totalRevenue.toLocaleString()} total revenue
          </p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12] font-medium text-xs px-4 py-2 rounded-lg transition-colors">
          + Add product
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Products',  value: PRODUCTS.length.toString(),          color: '#4d9cf8' },
          { label: 'Total Sales',     value: totalSales.toLocaleString(),          color: '#22d98a' },
          { label: 'Total Revenue',   value: '$' + totalRevenue.toLocaleString(),  color: '#a78bfa' },
        ].map((card) => (
          <div key={card.label} className="bg-[#161920] border border-[#2a2f3d] rounded-xl p-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] mb-2">
              {card.label}
            </p>
            <p className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Panel>
        <PanelHeader title="All products">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-[#1e222b] border border-[#2a2f3d] rounded-lg px-3 py-1.5 text-xs text-[#e8eaf0] placeholder-[#555c70] outline-none focus:border-[#363d50] transition-colors w-40"
            />
            <div className="flex gap-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={clsx(
                    'font-mono text-[10px] px-2.5 py-1 rounded transition-all duration-150',
                    categoryFilter === cat
                      ? 'bg-[#252a35] text-[#e8eaf0] border border-[#363d50]'
                      : 'text-[#555c70] hover:text-[#8b90a0]'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </PanelHeader>

        <table className="w-full text-xs">
          <thead>
            <tr>
              {[
                { label: 'Product',  key: null       },
                { label: 'Category', key: null       },
                { label: 'Sales',    key: 'sales'    },
                { label: 'Revenue',  key: 'revenue'  },
                { label: 'Trend',    key: 'delta'    },
              ].map((col) => (
                <th
                  key={col.label}
                  onClick={() => col.key && toggleSort(col.key as 'sales' | 'revenue' | 'delta')}
                  className={clsx(
                    'font-mono text-[10px] tracking-widest uppercase text-[#555c70] px-[18px] py-3 text-left',
                    col.key && 'cursor-pointer hover:text-[#8b90a0] select-none transition-colors'
                  )}
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
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-[18px] py-8 text-center text-[#555c70] text-xs">
                  No products match your search.
                </td>
              </tr>
            ) : (
              sortedProducts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-[#2a2f3d] hover:bg-[#1e222b] transition-colors cursor-pointer"
                >
                  <td className="px-[18px] py-3 text-[#e8eaf0] font-medium">{p.name}</td>
                  <td className="px-[18px] py-3">
                    <span className="font-mono text-[10px] bg-[#252a35] text-[#8b90a0] px-2 py-0.5 rounded">
                      {p.category}
                    </span>
                  </td>
                  <td className="px-[18px] py-3 text-[#8b90a0]">{p.sales.toLocaleString()}</td>
                  <td className="px-[18px] py-3 font-mono text-[11px] text-[#e8eaf0]">
                    ${p.revenue.toLocaleString()}
                  </td>
                  <td className="px-[18px] py-3">
                    <span className={clsx(
                      'font-mono text-[11px]',
                      p.delta >= 0 ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {p.delta >= 0 ? '▲' : '▼'} {Math.abs(p.delta)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}