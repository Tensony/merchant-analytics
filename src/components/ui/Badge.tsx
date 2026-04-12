import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: ReactNode;
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'default';
  size?: 'sm' | 'xs';
}

export function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center font-mono font-medium rounded',
        size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-[11px] px-2 py-0.5',
        {
          'bg-emerald-950 text-emerald-400':  variant === 'green',
          'bg-red-950    text-red-400':       variant === 'red',
          'bg-amber-950  text-amber-400':     variant === 'amber',
          'bg-blue-950   text-blue-400':      variant === 'blue',
          'bg-zinc-800   text-zinc-400':      variant === 'default',
        }
      )}
    >
      {children}
    </span>
  );
}