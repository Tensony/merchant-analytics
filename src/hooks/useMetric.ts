import { useState } from 'react';
import type { MetricKey, TimeRange, ChartType } from '../types';

interface UseMetricReturn {
  activeMetric: MetricKey;
  timeRange: TimeRange;
  chartType: ChartType;
  setActiveMetric: (m: MetricKey) => void;
  setTimeRange: (r: TimeRange) => void;
  setChartType: (t: ChartType) => void;
}

export function useMetric(): UseMetricReturn {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('revenue');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [chartType, setChartType] = useState<ChartType>('bar');

  return {
    activeMetric,
    timeRange,
    chartType,
    setActiveMetric,
    setTimeRange,
    setChartType,
  };
}