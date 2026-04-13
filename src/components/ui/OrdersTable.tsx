import { clsx } from 'clsx';
import { StatusPill } from './StatusPill';
import type { Order, OrderStatus } from '../../types';

type FilterStatus = OrderStatus | 'all';

interface OrdersTableProps {
  orders:          Order[];
  search:          string;
  statusFilter:    FilterStatus;
  onSearchChange:  (s: string) => void;
  onStatusChange:  (s: FilterStatus) => void;
}

const STATUS_OPTIONS: { label: string; value: FilterStatus }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Refunded',  value: 'refunded'  },
];

const TABLE_HEADERS = ['Order', 'Customer', 'Amount', 'Date', 'Status'];

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
      <div
        className="flex items-center gap-2 px-[18px] py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search orders..."
          className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none transition-colors"
          style={{
            backgroundColor: 'var(--surface2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        />
        <div className="flex gap-1">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(opt.value)}
              className="font-mono text-[10px] px-2 py-1 rounded transition-all duration-150"
              style={{
                backgroundColor: statusFilter === opt.value ? 'var(--surface3)' : 'transparent',
                color: statusFilter === opt.value ? 'var(--text)' : 'var(--text3)',
                border: statusFilter === opt.value
                  ? '1px solid var(--border2)'
                  : '1px solid transparent',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-y-auto max-h-[200px]">
        <table className="w-full text-xs">
          <thead
            className="sticky top-0"
            style={{ backgroundColor: 'var(--surface)' }}
          >
            <tr>
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="font-mono text-[10px] tracking-widest uppercase px-[18px] py-2.5 text-left"
                  style={{ color: 'var(--text3)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-[18px] py-6 text-center text-xs"
                  style={{ color: 'var(--text3)' }}
                >
                  No orders match your filter.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="transition-colors"
                  style={{ borderTop: '1px solid var(--border)' }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'var(--surface2)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <td
                    className="px-[18px] py-2 font-mono text-[11px]"
                    style={{ color: 'var(--text)' }}
                  >
                    {o.id}
                  </td>
                  <td
                    className="px-[18px] py-2 text-xs"
                    style={{ color: 'var(--text2)' }}
                  >
                    {o.customer}
                  </td>
                  <td
                    className="px-[18px] py-2 font-mono text-[11px]"
                    style={{ color: 'var(--text)' }}
                  >
                    ${o.amount.toFixed(2)}
                  </td>
                  <td
                    className="px-[18px] py-2 font-mono text-[10px]"
                    style={{ color: 'var(--text3)' }}
                  >
                    {o.date}
                  </td>
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