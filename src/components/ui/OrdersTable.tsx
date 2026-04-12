import type { Order, OrderStatus } from '../../types';
import { StatusPill } from './StatusPill';
import { clsx } from 'clsx';

type FilterStatus = OrderStatus | 'all';

interface OrdersTableProps {
  orders: Order[];
  search: string;
  statusFilter: FilterStatus;
  onSearchChange: (s: string) => void;
  onStatusChange: (s: FilterStatus) => void;
}

const STATUS_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Refunded',  value: 'refunded'  },
];

export function OrdersTable({
  orders,
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: OrdersTableProps) {
  return (
    <div className="flex flex-col">
      {/* Filter bar */}
      <div className="flex items-center gap-2 px-[18px] py-3 border-b border-[#2a2f3d]">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search orders..."
          className="flex-1 bg-[#1e222b] border border-[#2a2f3d] rounded-lg px-3 py-1.5 text-xs text-[#e8eaf0] placeholder-[#555c70] outline-none focus:border-[#363d50] transition-colors"
        />
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className={clsx(
                'font-mono text-[10px] px-2 py-1 rounded transition-all duration-150',
                statusFilter === opt.value
                  ? 'bg-[#252a35] text-[#e8eaf0] border border-[#363d50]'
                  : 'text-[#555c70] hover:text-[#8b90a0]'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-y-auto max-h-[200px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-[#161920]">
            <tr>
              {['Order', 'Customer', 'Amount', 'Date', 'Status'].map((h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] px-[18px] py-2.5 text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-[18px] py-6 text-center text-[#555c70] text-xs">
                  No orders match your filter.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-[#2a2f3d] hover:bg-[#1e222b] transition-colors"
                >
                  <td className="px-[18px] py-2 font-mono text-[11px] text-[#e8eaf0]">{o.id}</td>
                  <td className="px-[18px] py-2 text-[#8b90a0]">{o.customer}</td>
                  <td className="px-[18px] py-2 font-mono text-[11px] text-[#e8eaf0]">
                    ${o.amount.toFixed(2)}
                  </td>
                  <td className="px-[18px] py-2 font-mono text-[10px] text-[#555c70]">{o.date}</td>
                  <td className="px-[18px] py-2">
                    <StatusPill status={o.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}