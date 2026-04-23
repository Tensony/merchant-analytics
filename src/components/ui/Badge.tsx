import { type ReactNode } from 'react';

interface BadgeProps {
  children:  ReactNode;
  variant?:  'green' | 'red' | 'amber' | 'blue' | 'default';
  size?:     'sm' | 'xs';
}

const VARIANT_STYLES: Record<string, { bg: string; color: string }> = {
  green:   { bg: 'var(--green-dim)',  color: 'var(--green)'  },
  red:     { bg: 'var(--red-dim)',    color: 'var(--red)'    },
  amber:   { bg: 'var(--amber-dim)', color: 'var(--amber)' },
  blue:    { bg: 'var(--blue-dim)',   color: 'var(--blue)'   },
  default: { bg: 'var(--surface3)',   color: 'var(--text2)'  },
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
}: BadgeProps) {
  const { bg, color } = VARIANT_STYLES[variant];

  return (
    <span
      className="inline-flex items-center font-mono font-medium rounded"
      style={{
        fontSize:        size === 'xs' ? '10px' : '11px',
        padding:         size === 'xs' ? '2px 6px' : '2px 8px',
        backgroundColor: bg,
        color,
      }}
    >
      {children}
    </span>
  );
}