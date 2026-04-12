import type { Order } from '../../types';
import { StatusPill } from './StatusPill';

interface OrdersTableProps {
  orders: Order[];
}

export function OrdersTable({ orders }: OrdersTableProps) {
  return (
    <div className="overflow-y-auto max-h-[210px]">
      <table className="w-full text-xs">
        <thead className="sticky top-0 bg-[#161920]">
          <tr>
            {['Order', 'Customer', 'Amount', 'Status'].map((h) => (
              <th
                key={h}
                className="font-mono text-[10px] tracking-widest uppercase text-[#555c70] px-[18px] pb-3 text-left"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t border-[#2a2f3d] hover:bg-[#1e222b] transition-colors">
              <td className="px-[18px] py-2 font-mono text-[11px] text-[#e8eaf0]">{o.id}</td>
              <td className="px-[18px] py-2 text-[#8b90a0]">{o.customer}</td>
              <td className="px-[18px] py-2 font-mono text-[11px] text-[#e8eaf0]">
                ${o.amount.toFixed(2)}
              </td>
              <td className="px-[18px] py-2">
                <StatusPill status={o.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}