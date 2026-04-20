import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MetricKey, TimeRange, ChartType, Product, Campaign, AppNotification, Store } from '../types';
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

  // Onboarding
  hasCompletedDashboardTour: boolean;
  completeDashboardTour:     () => void;
  resetDashboardTour:        () => void;

  // Store management
  stores:       Store[];
  activeStore:  string | null;
  switchStore:  (storeId: string) => void;
  addStore:     (store: Store) => void;

  // Data
  products:  Product[];
  campaigns: Campaign[];

  // User settings
  profile:       UserProfile;
  notifications: NotificationSettings;

  // Notifications
  notifications_list:    AppNotification[];
  unreadCount:           number;
  addNotification:       (n: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markAllRead:           () => void;
  clearNotifications:    () => void;

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

// Default stores
const DEFAULT_STORES: Store[] = [
  {
    id:       'store-1',
    name:     'Lusaka Flagship',
    country:  'Zambia',
    flag:     '🇿🇲',
    currency: 'ZMW',
    plan:     'growth',
  },
  {
    id:       'store-2',
    name:     'Accra Digital',
    country:  'Ghana',
    flag:     '🇬🇭',
    currency: 'GHS',
    plan:     'starter',
  },
];

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      // Defaults
      activeMetric: 'revenue',
      timeRange:    '30d',
      chartType:    'bar',
      theme:        'dark',

      // Onboarding state
      hasCompletedDashboardTour: false,
      completeDashboardTour: () => set({ hasCompletedDashboardTour: true }),
      resetDashboardTour: () => set({ hasCompletedDashboardTour: false }),

      // Store management
      stores:      DEFAULT_STORES,
      activeStore: 'store-1',
      switchStore: (storeId) => set({ activeStore: storeId }),
      addStore:    (store) => set((s) => ({ 
        stores: [...s.stores, store],
        activeStore: store.id,
      })),

      products:  PRODUCTS,
      campaigns: CAMPAIGNS,

      profile: {
        displayName: 'Tenson C.',
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

      // Notifications state
      notifications_list: [
        {
          id: '1', type: 'anomaly' as const, read: false,
          title: 'Revenue spike detected',
          message: 'Mar 15 revenue was 187% above 7-day average.',
          timestamp: '2 hours ago',
        },
        {
          id: '2', type: 'order' as const, read: false,
          title: 'Large order received',
          message: 'Chioma Eze placed a $740 order.',
          timestamp: '4 hours ago',
        },
        {
          id: '3', type: 'campaign' as const, read: true,
          title: 'Campaign completed',
          message: 'Spring Sale Email Blast ended with 4.2x ROAS.',
          timestamp: '1 day ago',
        },
        {
          id: '4', type: 'system' as const, read: true,
          title: 'Weekly digest ready',
          message: 'Your week of Mar 25–30 summary is available.',
          timestamp: '2 days ago',
        },
      ],
      unreadCount: 2,

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

      // Notification actions
      addNotification: (n) =>
        set((s) => {
          const newNotif: AppNotification = {
            ...n,
            id:        Date.now().toString(),
            timestamp: 'just now',
            read:      false,
          };
          return {
            notifications_list: [newNotif, ...s.notifications_list],
            unreadCount:        s.unreadCount + 1,
          };
        }),

      markAllRead: () =>
        set((s) => ({
          notifications_list: s.notifications_list.map((n) => ({ ...n, read: true })),
          unreadCount:        0,
        })),

      clearNotifications: () =>
        set({ notifications_list: [], unreadCount: 0 }),
    }),
    {
      name: 'merchant-dashboard',
    }
  )
);