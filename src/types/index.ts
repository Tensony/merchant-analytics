export type MetricKey = 'revenue' | 'orders' | 'aov' | 'churn';
export type TimeRange = '7d' | '30d' | '90d' | 'ytd';
export type ChartType = 'bar' | 'line';
export type OrderStatus = 'completed' | 'pending' | 'refunded';

export interface DailyDataPoint {
  date: string;
  revenue: number;
  orders: number;
  aov: number;
  churn: number;
  isAnomaly?: boolean;
}

export interface KpiConfig {
  key: MetricKey;
  label: string;
  value: string;
  delta: string;
  deltaType: 'up' | 'down';
  subtext: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  delta: number;
}

export interface GeoRegion {
  flag: string;
  name: string;
  pct: number;
  color: string;
}

export interface Order {
  id: string;
  customer: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

export interface FunnelStep {
  name: string;
  count: number;
  pct: number;
  color: string;
}

export interface ChannelData {
  name: string;
  value: number;
  color: string;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  country: string;
  totalSpend: number;
  orders: number;
  lastOrder: string;
  status: 'active' | 'at-risk' | 'churned';
}

export interface CohortRow {
  month: string;
  newCustomers: number;
  retention: number[];
}

export interface Campaign {
  id: string;
  name: string;
  channel: 'email' | 'paid' | 'social' | 'sms';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  startDate: string;
  endDate: string;
}
export interface DrillDownData {
  date:    string;
  revenue: number;
  orders:  number;
  aov:     number;
}// Type definitions 
