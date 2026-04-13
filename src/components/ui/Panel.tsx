import { type ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className }: PanelProps) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${className ?? ''}`}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
    >
      {children}
    </div>
  );
}

interface PanelHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PanelHeader({ title, children }: PanelHeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-[18px] py-3.5"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <h3
        className="font-['Syne',sans-serif] text-[13px] font-semibold tracking-tight"
        style={{ color: 'var(--text)' }}
      >
        {title}
      </h3>
      {children && (
        <div className="flex items-center gap-2">{children}</div>
      )}
    </div>
  );
}