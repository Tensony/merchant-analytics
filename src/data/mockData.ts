import type { Customer, CohortRow, Campaign } from '../types';
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

export function generateDailyData(n = 30): DailyDataPoint[] {
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

export const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Alex Mwale',       email: 'alex@email.com',   country: '🇿🇲 Zambia',         totalSpend: 2840,  orders: 12, lastOrder: 'Mar 30', status: 'active'   },
  { id: 'c2', name: 'Sarah Chen',       email: 'sarah@email.com',  country: '🇨🇳 China',          totalSpend: 1290,  orders: 6,  lastOrder: 'Mar 30', status: 'active'   },
  { id: 'c3', name: 'James Osei',       email: 'james@email.com',  country: '🇬🇭 Ghana',          totalSpend: 4120,  orders: 18, lastOrder: 'Mar 29', status: 'active'   },
  { id: 'c4', name: 'Maria Santos',     email: 'maria@email.com',  country: '🇧🇷 Brazil',         totalSpend: 340,   orders: 2,  lastOrder: 'Mar 29', status: 'at-risk'  },
  { id: 'c5', name: 'Tom Nakamura',     email: 'tom@email.com',    country: '🇯🇵 Japan',          totalSpend: 6780,  orders: 31, lastOrder: 'Mar 28', status: 'active'   },
  { id: 'c6', name: 'Fatima Al-Hassan', email: 'fatima@email.com', country: '🇦🇪 UAE',            totalSpend: 5200,  orders: 24, lastOrder: 'Mar 28', status: 'active'   },
  { id: 'c7', name: 'David Park',       email: 'david@email.com',  country: '🇰🇷 South Korea',   totalSpend: 890,   orders: 4,  lastOrder: 'Feb 14', status: 'at-risk'  },
  { id: 'c8', name: 'Chioma Eze',       email: 'chioma@email.com', country: '🇳🇬 Nigeria',        totalSpend: 9100,  orders: 44, lastOrder: 'Mar 27', status: 'active'   },
  { id: 'c9', name: 'Lucas Bernard',    email: 'lucas@email.com',  country: '🇫🇷 France',         totalSpend: 210,   orders: 1,  lastOrder: 'Jan 05', status: 'churned'  },
  { id:'c10', name: 'Amara Diallo',     email: 'amara@email.com',  country: '🇸🇳 Senegal',        totalSpend: 1540,  orders: 8,  lastOrder: 'Mar 25', status: 'active'   },
  { id:'c11', name: 'Nina Petrova',     email: 'nina@email.com',   country: '🇷🇺 Russia',         totalSpend: 3300,  orders: 15, lastOrder: 'Mar 20', status: 'active'   },
  { id:'c12', name: 'Omar Hassan',      email: 'omar@email.com',   country: '🇪🇬 Egypt',          totalSpend: 450,   orders: 3,  lastOrder: 'Jan 18', status: 'churned'  },
];

export const COHORT_DATA: CohortRow[] = [
  { month: 'Oct 23', newCustomers: 312, retention: [100, 62, 48, 41, 35, 31] },
  { month: 'Nov 23', newCustomers: 284, retention: [100, 58, 44, 38, 33]     },
  { month: 'Dec 23', newCustomers: 401, retention: [100, 71, 55, 47]          },
  { month: 'Jan 24', newCustomers: 356, retention: [100, 64, 50]              },
  { month: 'Feb 24', newCustomers: 298, retention: [100, 60]                  },
  { month: 'Mar 24', newCustomers: 341, retention: [100]                      },
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'camp1', name: 'Spring Sale Email Blast', channel: 'email',
    status: 'completed', budget: 2000, spent: 1840,
    impressions: 48200, clicks: 3840, conversions: 412, revenue: 24720,
    startDate: 'Mar 01', endDate: 'Mar 15',
  },
  {
    id: 'camp2', name: 'Google Ads — Headphones', channel: 'paid',
    status: 'active', budget: 5000, spent: 3120,
    impressions: 124000, clicks: 6200, conversions: 310, revenue: 18600,
    startDate: 'Mar 10', endDate: 'Apr 10',
  },
  {
    id: 'camp3', name: 'Instagram Reels — Chairs', channel: 'social',
    status: 'active', budget: 1500, spent: 890,
    impressions: 84000, clicks: 2100, conversions: 98, revenue: 8820,
    startDate: 'Mar 20', endDate: 'Apr 20',
  },
  {
    id: 'camp4', name: 'SMS Flash Sale', channel: 'sms',
    status: 'completed', budget: 800, spent: 800,
    impressions: 12400, clicks: 1860, conversions: 224, revenue: 13440,
    startDate: 'Mar 15', endDate: 'Mar 15',
  },
  {
    id: 'camp5', name: 'Retargeting — Cart Abandon', channel: 'paid',
    status: 'paused', budget: 3000, spent: 1200,
    impressions: 56000, clicks: 2800, conversions: 140, revenue: 8400,
    startDate: 'Mar 05', endDate: 'Apr 05',
  },
];