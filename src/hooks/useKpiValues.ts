import { useMemo } from 'react';
import type { DailyDataPoint, KpiConfig, MetricKey } from '../types';

function sumRevenue(data: DailyDataPoint[]) {
  return data.reduce((acc, d) => acc + d.revenue, 0);
}
function sumOrders(data: DailyDataPoint[]) {
  return data.reduce((acc, d) => acc + d.orders, 0);
}
function avgAOV(data: DailyDataPoint[]) {
  const total = sumRevenue(data);
  const orders = sumOrders(data);
  return orders > 0 ? total / orders : 0;
}
function avgChurn(data: DailyDataPoint[]) {
  return data.reduce((acc, d) => acc + d.churn, 0) / data.length;
}

export function useKpiValues(
  current: DailyDataPoint[],
  previous: DailyDataPoint[]
): KpiConfig[] {
  return useMemo(() => {
    const rev     = sumRevenue(current);
    const prevRev = sumRevenue(previous);
    const revDelta = prevRev > 0 ? ((rev - prevRev) / prevRev) * 100 : 0;

    const ord     = sumOrders(current);
    const prevOrd = sumOrders(previous);
    const ordDelta = prevOrd > 0 ? ((ord - prevOrd) / prevOrd) * 100 : 0;

    const aov     = avgAOV(current);
    const prevAov = avgAOV(previous);
    const aovDelta = prevAov > 0 ? ((aov - prevAov) / prevAov) * 100 : 0;

    const churn     = avgChurn(current);
    const prevChurn = avgChurn(previous);
    const churnDelta = prevChurn > 0 ? ((churn - prevChurn) / prevChurn) * 100 : 0;

    const kpis: KpiConfig[] = [
      {
        key: 'revenue' as MetricKey,
        label: 'Total Revenue',
        value: '$' + Math.round(rev).toLocaleString(),
        delta: Math.abs(revDelta).toFixed(1) + '%',
        deltaType: revDelta >= 0 ? 'up' : 'down',
        subtext: 'vs prev period',
      },
      {
        key: 'orders' as MetricKey,
        label: 'Orders',
        value: ord.toLocaleString(),
        delta: Math.abs(ordDelta).toFixed(1) + '%',
        deltaType: ordDelta >= 0 ? 'up' : 'down',
        subtext: 'vs prev period',
      },
      {
        key: 'aov' as MetricKey,
        label: 'Avg Order Value',
        value: '$' + aov.toFixed(2),
        delta: Math.abs(aovDelta).toFixed(1) + '%',
        deltaType: aovDelta >= 0 ? 'up' : 'down',
        subtext: 'vs prev period',
      },
      {
        key: 'churn' as MetricKey,
        label: 'Churn Rate',
        value: churn.toFixed(2) + '%',
        delta: Math.abs(churnDelta).toFixed(2) + 'pp',
        deltaType: churnDelta <= 0 ? 'up' : 'down',
        subtext: 'vs prev period',
      },
    ];

    return kpis;
  }, [current, previous]);
}