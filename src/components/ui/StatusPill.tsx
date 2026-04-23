import type { OrderStatus } from '../../types';

interface StatusPillProps {
  status: OrderStatus;
}

const CONFIG: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  completed: {
    label: 'completed',
    bg:    'var(--green-dim)',
    color: 'var(--green)',
  },
  pending: {
    label: 'pending',
    bg:    'var(--amber-dim)',
    color: 'var(--amber)',
  },
  refunded: {
    label: 'refunded',
    bg:    'var(--red-dim)',
    color: 'var(--red)',
  },
};

export function StatusPill({ status }: StatusPillProps) {
  const { label, bg, color } = CONFIG[status];
  return (
    <span
      className="inline-block font-mono text-[10px] font-medium px-2 py-0.5 rounded"
      style={{ backgroundColor: bg, color }}
    >
      {label}
    </span>
  );
}