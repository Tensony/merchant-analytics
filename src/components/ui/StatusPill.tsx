import { clsx } from 'clsx';
import type { OrderStatus } from '../../types';

interface StatusPillProps {
  status: OrderStatus;
}

const CONFIG: Record<OrderStatus, { label: string; className: string }> = {
  completed: { label: 'completed', className: 'bg-emerald-950 text-emerald-400' },
  pending:   { label: 'pending',   className: 'bg-amber-950  text-amber-400'   },
  refunded:  { label: 'refunded',  className: 'bg-red-950    text-red-400'     },
};

export function StatusPill({ status }: StatusPillProps) {
  const { label, className } = CONFIG[status];
  return (
    <span className={clsx('inline-block font-mono text-[10px] font-medium px-2 py-0.5 rounded', className)}>
      {label}
    </span>
  );
}