import { useState, useEffect, useRef } from 'react';
import type { DailyDataPoint } from '../types';

interface UseRealtimeChartReturn {
  liveData:    DailyDataPoint[];
  isAnimating: boolean;
  lastUpdate:  string;
}

function generateTick(base: DailyDataPoint): DailyDataPoint {
  const variance = 0.05;
  const factor   = 1 + (Math.random() * variance * 2 - variance);
  return {
    ...base,
    revenue: Math.round(base.revenue * factor),
    orders:  Math.max(1, Math.round(base.orders * factor)),
    aov:     parseFloat((base.revenue * factor / Math.max(1, base.orders * factor)).toFixed(2)),
    churn:   parseFloat(Math.max(0, base.churn + (Math.random() * 0.1 - 0.05)).toFixed(2)),
    isAnomaly: false,
  };
}

export function useRealtimeChart(
  initialData: DailyDataPoint[],
  enabled: boolean = true,
  intervalMs: number = 3000
): UseRealtimeChartReturn {
  const [liveData,    setLiveData]    = useState<DailyDataPoint[]>(initialData);
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastUpdate,  setLastUpdate]  = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setLiveData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (!enabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setIsAnimating(true);
      setLiveData((prev) => {
        if (prev.length === 0) return prev;
        const last    = prev[prev.length - 1];
        const updated = generateTick(last);
        return [...prev.slice(0, -1), updated];
      });
      setLastUpdate(new Date().toLocaleTimeString());
      setTimeout(() => setIsAnimating(false), 500);
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, intervalMs]);

  return { liveData, isAnimating, lastUpdate };
}