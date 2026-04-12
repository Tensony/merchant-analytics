import { useState, useMemo } from 'react';
import type { MetricKey, TimeRange, ChartType } from '../types';
import { generateDailyData } from '../data/mockData';

const ALL_DATA = generateDailyData(90);

const RANGE_DAYS: Record<TimeRange, number> = {
  '7d':  7,
  '30d': 30,
  '90d': 90,
  'ytd': 90,
};

interface UseMetricReturn {
  activeMetric: MetricKey;
  timeRange: TimeRange;
  chartType: ChartType;
  filteredData: ReturnType<typeof generateDailyData>;
  setActiveMetric: (m: MetricKey) => void;
  setTimeRange: (r: TimeRange) => void;
  setChartType: (t: ChartType) => void;
}

export function useMetric(): UseMetricReturn {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('revenue');
  const [timeRange, setTimeRange]       = useState<TimeRange>('30d');
  const [chartType, setChartType]       = useState<ChartType>('bar');

  const filteredData = useMemo(() => {
    const days = RANGE_DAYS[timeRange];
    return ALL_DATA.slice(-days);
  }, [timeRange]);

  return {
    activeMetric,
    timeRange,
    chartType,
    filteredData,
    setActiveMetric,
    setTimeRange,
    setChartType,
  };
}