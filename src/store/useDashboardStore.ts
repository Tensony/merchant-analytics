import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import type { MetricKey, TimeRange, ChartType } from '../types';

interface DashboardState {
  // Dashboard preferences
  activeMetric: MetricKey;
  timeRange:    TimeRange;
  chartType:    ChartType;
  theme:        'dark' | 'light';

  // Actions
  setActiveMetric: (m: MetricKey)    => void;
  setTimeRange:    (r: TimeRange)    => void;
  setChartType:    (t: ChartType)    => void;
  toggleTheme:     ()                => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    ((set) => ({
      activeMetric: 'revenue',
      timeRange:    '30d',
      chartType:    'bar',
      theme:        'dark',

      setActiveMetric: (activeMetric) => set({ activeMetric }),
      setTimeRange:    (timeRange)    => set({ timeRange }),
      setChartType:    (chartType)    => set({ chartType }),
      toggleTheme:     ()             => set((s: DashboardState) => ({
        theme: s.theme === 'dark' ? 'light' : 'dark',
      })),
    })) as StateCreator<DashboardState, [], [['zustand/persist', unknown]]>,
    {
      name: 'merchant-dashboard',
    },
  )
);