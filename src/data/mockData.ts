import type {
  DailyDataPoint, Product, GeoRegion,
  Order, FunnelStep, ChannelData
} from '../types';

function genDays(n: number): string[] {
  const labels: string[] = [];
  const now = new Date('2024-03-30');
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    labels.push(d.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
  }
  return labels;
}

export function generateDailyData(n = 90): DailyDataPoint[] {
  const dates = genDays(n);
  let base = 7200;
  return dates.map((date, i) => {
    const raw = base + Math.sin(i * 0.4) * 800 + Math.random() * 600 - 300;
    const isAnomaly = i === 14;
    const revenue = Math.round(isAnomaly ? raw * 2.87 : raw);
    base += Math.random() * 100 - 40;
    const orders = Math.round(revenue / 59.1 + Math.random() * 10 - 5);
    const aov = parseFloat((revenue / orders).toFixed(2));
    const churn = parseFloat((2.8 - i * 0.015 + Math.random() * 0.1).toFixed(2));
    return { date, revenue, orders, aov, churn, isAnomaly };
  });
}

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Pro Wireless Headphones', category: 'Electronics', sales: 892, revenue: 71360, delta: 8.2 },
  { id: '2', name: 'Ergonomic Desk Chair',    category: 'Furniture',   sales: 341, revenue: 58970, delta: 14.7 },
  { id: '3', name: 'Mechanical Keyboard',     category: 'Electronics', sales: 654, revenue: 45780, delta: -2.1 },
  { id: '4', name: 'USB-C Hub (7-port)',       category: 'Accessories', sales: 1203,revenue: 36090, delta: 22.3 },
  { id: '5', name: 'Monitor Stand',           category: 'Furniture',   sales: 477, revenue: 19080, delta: 5.6 },
];

export const GEO_REGIONS: GeoRegion[] = [
  { flag: '🇺🇸', name: 'United States',  pct: 42, color: '#22d98a' },
  { flag: '🇬🇧', name: 'United Kingdom', pct: 18, color: '#4d9cf8' },
  { flag: '🇩🇪', name: 'Germany',        pct: 11, color: '#a78bfa' },
  { flag: '🇨🇦', name: 'Canada',         pct: 9,  color: '#f5a623' },
  { flag: '🇦🇺', name: 'Australia',      pct: 7,  color: '#f06291' },
  { flag: '🇿🇲', name: 'Zambia',         pct: 4,  color: '#4dd0e1' },
  { flag: '🌍', name: 'Other',           pct: 9,  color: '#555c70' },
];

export const ORDERS: Order[] = [
  { id: '#48291', customer: 'Alex Mwale',      amount: 247.00, status: 'completed', date: 'Mar 30' },
  { id: '#48290', customer: 'Sarah Chen',      amount: 89.99,  status: 'pending',   date: 'Mar 30' },
  { id: '#48289', customer: 'James Osei',      amount: 412.50, status: 'completed', date: 'Mar 29' },
  { id: '#48288', customer: 'Maria Santos',    amount: 63.00,  status: 'refunded',  date: 'Mar 29' },
  { id: '#48287', customer: 'Tom Nakamura',    amount: 188.00, status: 'completed', date: 'Mar 28' },
  { id: '#48286', customer: 'Fatima Al-Hassan',amount: 320.00, status: 'completed', date: 'Mar 28' },
  { id: '#48285', customer: 'David Park',      amount: 55.50,  status: 'pending',   date: 'Mar 27' },
  { id: '#48284', customer: 'Chioma Eze',      amount: 740.00, status: 'completed', date: 'Mar 27' },
];

export const FUNNEL_STEPS: FunnelStep[] = [
  { name: 'Store visitors',   count: 84210, pct: 100, color: '#4d9cf8' },
  { name: 'Product views',    count: 52340, pct: 62,  color: '#a78bfa' },
  { name: 'Add to cart',      count: 18920, pct: 22,  color: '#22d98a' },
  { name: 'Checkout started', count: 7840,  pct: 9.3, color: '#f5a623' },
  { name: 'Orders placed',    count: 4821,  pct: 5.7, color: '#22d98a' },
];

export const CHANNEL_DATA: ChannelData[] = [
  { name: 'Organic Search', value: 34, color: '#22d98a' },
  { name: 'Paid Ads',       value: 28, color: '#4d9cf8' },
  { name: 'Email',          value: 18, color: '#a78bfa' },
  { name: 'Social',         value: 10, color: '#f5a623' },
  { name: 'Direct',         value: 6,  color: '#f06291' },
  { name: 'Referral',       value: 4,  color: '#4dd0e1' },
];