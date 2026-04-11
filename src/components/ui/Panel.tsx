import { type ReactNode } from 'react';
import { clsx } from 'clsx';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className }: PanelProps) {
  return (
    <div className={clsx('bg-[#161920] border border-[#2a2f3d] rounded-xl overflow-hidden', className)}>
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
    <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-[#2a2f3d]">
      <h3 className="font-['Syne',sans-serif] text-[13px] font-semibold text-[#e8eaf0] tracking-tight">
        {title}
      </h3>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}