import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDashboardStore } from '../store/useDashboardStore';
import type { MetricKey, TimeRange, ChartType } from '../types';

const VALID_METRICS:    MetricKey[] = ['revenue', 'orders', 'aov', 'churn'];
const VALID_RANGES:     TimeRange[] = ['7d', '30d', '90d', 'ytd'];
const VALID_CHARTTYPES: ChartType[] = ['bar', 'line'];

function isMetricKey(v: string): v is MetricKey {
  return VALID_METRICS.includes(v as MetricKey);
}
function isTimeRange(v: string): v is TimeRange {
  return VALID_RANGES.includes(v as TimeRange);
}
function isChartType(v: string): v is ChartType {
  return VALID_CHARTTYPES.includes(v as ChartType);
}

export function useUrlState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeMetric, timeRange, chartType, setActiveMetric, setTimeRange, setChartType } =
    useDashboardStore();

  // On mount — read URL params and sync into store
  useEffect(() => {
    const m = searchParams.get('metric');
    const r = searchParams.get('range');
    const c = searchParams.get('chart');

    if (m && isMetricKey(m))    setActiveMetric(m);
    if (r && isTimeRange(r))    setTimeRange(r);
    if (c && isChartType(c))    setChartType(c);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When store changes — write back to URL
  useEffect(() => {
    setSearchParams(
      { metric: activeMetric, range: timeRange, chart: chartType },
      { replace: true }
    );
  }, [activeMetric, timeRange, chartType, setSearchParams]);
}