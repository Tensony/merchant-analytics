import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MetricKey, TimeRange, ChartType, Product, Campaign } from '../types';
import { PRODUCTS, CAMPAIGNS } from '../data/mockData';

interface UserProfile {
  displayName: string;
  email:       string;
  timezone:    string;
  currency:    string;
}

interface NotificationSettings {
  anomalyAlerts:       boolean;
  weeklyDigest:        boolean;
  newOrderAlerts:      boolean;
  campaignPerformance: boolean;
}

interface DashboardState {
  // Dashboard preferences
  activeMetric:  MetricKey;
  timeRange:     TimeRange;
  chartType:     ChartType;
  theme:         'dark' | 'light';

  // Data
  products:  Product[];
  campaigns: Campaign[];

  // User settings
  profile:       UserProfile;
  notifications: NotificationSettings;

  // Actions — preferences
  setActiveMetric: (m: MetricKey)    => void;
  setTimeRange:    (r: TimeRange)    => void;
  setChartType:    (t: ChartType)    => void;
  toggleTheme:     ()                => void;

  // Actions — data
  addProduct:  (p: Product)  => void;
  addCampaign: (c: Campaign) => void;

  // Actions — settings
  updateProfile:       (p: Partial<UserProfile>)       => void;
  updateNotifications: (n: Partial<NotificationSettings>) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Defaults
      activeMetric: 'revenue',
      timeRange:    '30d',
      chartType:    'bar',
      theme:        'dark',

      products:  PRODUCTS,
      campaigns: CAMPAIGNS,

      profile: {
        displayName: 'Tenson M.',
        email:       'tenson@merchant.io',
        timezone:    'Africa/Lusaka (CAT)',
        currency:    'USD ($)',
      },

      notifications: {
        anomalyAlerts:       true,
        weeklyDigest:        true,
        newOrderAlerts:      false,
        campaignPerformance: true,
      },

      // Preference actions
      setActiveMetric: (activeMetric) => set({ activeMetric }),
      setTimeRange:    (timeRange)    => set({ timeRange }),
      setChartType:    (chartType)    => set({ chartType }),
      toggleTheme:     ()             => set((s) => ({
        theme: s.theme === 'dark' ? 'light' : 'dark',
      })),

      // Data actions
      addProduct: (product) =>
        set((s) => ({ products: [product, ...s.products] })),

      addCampaign: (campaign) =>
        set((s) => ({ campaigns: [campaign, ...s.campaigns] })),

      // Settings actions
      updateProfile: (partial) =>
        set((s) => ({ profile: { ...s.profile, ...partial } })),

      updateNotifications: (partial) =>
        set((s) => ({ notifications: { ...s.notifications, ...partial } })),
    }),
    {
      name: 'merchant-dashboard',
    }
  )
);