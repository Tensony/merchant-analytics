import { useState, useMemo } from 'react';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { CUSTOMERS, COHORT_DATA } from '../data/mockData';
import { clsx } from 'clsx';
import type { Customer } from '../types';

type CustomerStatus = Customer['status'] | 'all';

const STATUS_CONFIG = {
  active:   { label: 'Active',   className: 'bg-emerald-950 text-emerald-400' },
  'at-risk':{ label: 'At risk',  className: 'bg-amber-950 text-amber-400'     },
  churned:  { label: 'Churned',  className: 'bg-red-950 text-red-400'         },
};

export function CustomersPage() {
  const [statusFilter, setStatusFilter] = useState<CustomerStatus>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() =>
    CUSTOMERS.filter((c) => {
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    }),
    [statusFilter, search]
  );

  const active  = CUSTOMERS.filter((c) => c.status === 'active').length;
  const atRisk  = CUSTOMERS.filter((c) => c.status === 'at-risk').length;
  const churned = CUSTOMERS.filter((c) => c.status === 'churned').length;
  const totalLTV = CUSTOMERS.reduce((a, c) => a + c.totalSpend, 0);

  return (
    <div className="flex flex-col gap-4 p-6">

      {/* Header */}
      <div>
        <h1 className="font-['Syne',sans-serif] text-xl font-bold text-[#e8eaf0] tracking-tight">
          Customers
        </h1>
        <p className="text-xs text-[#555c70] mt-0.5">
          {CUSTOMERS.length} total · ${totalLTV.toLocaleString()} lifetime value
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Customers', value: CUSTOMERS.length, color: '#4d9cf8'  },
          { label: 'Active',          value: active,           color: '#22d98a'  },
          { label: 'At Risk',         value: atRisk,           color: '#f5a623'  },
          { label: 'Churned',         value: churned,          color: '#ff5757'  },
        ].map((card) => (
          <div key={card.label} className="bg-[#161920] border border-[#2a2f3d] rounded-xl p-4">
            <p className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] mb-2">
              {card.label}
            </p>
            <p
              className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Cohort retention */}
      <Panel>
        <PanelHeader title="Cohort retention analysis" />
        <div className="p-[18px] overflow-x-auto">
          <table className="text-xs w-full">
            <thead>
              <tr>
                <th className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] pb-3 text-left pr-6">
                  Cohort
                </th>
                <th className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] pb-3 text-right pr-6">
                  New users
                </th>
                {['Month 0','Month 1','Month 2','Month 3','Month 4','Month 5'].map((m) => (
                  <th key={m} className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] pb-3 text-center px-2">
                    {m}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COHORT_DATA.map((row) => (
                <tr key={row.month} className="border-t border-[#2a2f3d]">
                  <td className="py-2.5 pr-6 text-[#e8eaf0] font-medium">{row.month}</td>
                  <td className="py-2.5 pr-6 text-right font-mono text-[11px] text-[#8b90a0]">
                    {row.newCustomers.toLocaleString()}
                  </td>
                  {Array.from({ length: 6 }).map((_, i) => {
                    const val = row.retention[i];
                    const opacity = val === undefined ? 0 :
                      val >= 80 ? 0.9 : val >= 60 ? 0.7 : val >= 40 ? 0.5 : val >= 20 ? 0.3 : 0.15;
                    return (
                      <td key={i} className="py-2.5 px-2 text-center">
                        {val !== undefined ? (
                          <span
                            className="inline-block w-14 py-1 rounded font-mono text-[11px] font-medium"
                            style={{
                              background: `rgba(34,217,138,${opacity})`,
                              color: opacity > 0.5 ? '#0d3d25' : '#22d98a',
                            }}
                          >
                            {val}%
                          </span>
                        ) : (
                          <span className="text-[#2a2f3d]">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Customer table */}
      <Panel>
        <PanelHeader title="All customers">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="bg-[#1e222b] border border-[#2a2f3d] rounded-lg px-3 py-1.5 text-xs text-[#e8eaf0] placeholder-[#555c70] outline-none focus:border-[#363d50] w-40"
            />
            <div className="flex gap-1">
              {(['all', 'active', 'at-risk', 'churned'] as CustomerStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={clsx(
                    'font-mono text-[10px] px-2.5 py-1 rounded capitalize transition-all duration-150',
                    statusFilter === s
                      ? 'bg-[#252a35] text-[#e8eaf0] border border-[#363d50]'
                      : 'text-[#555c70] hover:text-[#8b90a0]'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </PanelHeader>

        <table className="w-full text-xs">
          <thead>
            <tr>
              {['Customer', 'Country', 'Orders', 'Total Spend', 'Last Order', 'Status'].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] px-[18px] py-3 text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-[18px] py-8 text-center text-[#555c70]">
                  No customers match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-t border-[#2a2f3d] hover:bg-[#1e222b] transition-colors cursor-pointer"
                >
                  <td className="px-[18px] py-3">
                    <span className="text-[#e8eaf0] font-medium block">{c.name}</span>
                    <span className="text-[10px] font-mono text-[#555c70]">{c.email}</span>
                  </td>
                  <td className="px-[18px] py-3 text-[#8b90a0]">{c.country}</td>
                  <td className="px-[18px] py-3 font-mono text-[11px] text-[#8b90a0]">
                    {c.orders}
                  </td>
                  <td className="px-[18px] py-3 font-mono text-[11px] text-[#e8eaf0]">
                    ${c.totalSpend.toLocaleString()}
                  </td>
                  <td className="px-[18px] py-3 font-mono text-[10px] text-[#555c70]">
                    {c.lastOrder}
                  </td>
                  <td className="px-[18px] py-3">
                    <span className={clsx(
                      'font-mono text-[10px] px-2 py-0.5 rounded',
                      STATUS_CONFIG[c.status].className
                    )}>
                      {STATUS_CONFIG[c.status].label}
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