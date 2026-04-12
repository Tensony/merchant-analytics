import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import type { FunnelStep } from '../../types';

interface FunnelChartProps {
  steps: FunnelStep[];
}

export function FunnelChart({ steps }: FunnelChartProps) {
  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      barRefs.current.forEach((el, i) => {
        if (el) el.style.width = steps[i].pct + '%';
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [steps]);

  return (
    <div className="flex flex-col gap-3 p-[18px]">
      {steps.map((step, i) => (
        <div key={step.name}>
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-xs text-[#8b90a0]">{step.name}</span>
            <span className="font-mono text-[11px] text-[#555c70]">
              {step.count.toLocaleString()}
            </span>
          </div>
          <div className="h-2 bg-[#252a35] rounded-full overflow-hidden">
            <div
              ref={(el) => { barRefs.current[i] = el; }}
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: '0%', backgroundColor: step.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}