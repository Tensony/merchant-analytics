import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthUser {
  id:     string;
  name:   string;
  email:  string;
  plan:   'starter' | 'growth' | 'pro';
  avatar: string;
}

interface AuthStore {
  user:      AuthUser | null;
  isAuth:    boolean;
  isLoading: boolean;

  login:    (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout:   () => void;
  upgradePlan: (plan: AuthUser['plan']) => void;
}

// Simulated user database — replace with real API later
const MOCK_USERS: (AuthUser & { password: string })[] = [
  {
    id:       'u1',
    name:     'Tenson C.',
    email:    'tenson@merchant.io',
    password: '1234',
    plan:     'growth',
    avatar:   'TM',
  },
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:      null,
      isAuth:    false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });

        // Simulate network delay
        await new Promise((r) => setTimeout(r, 900));

        const found = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (found) {
          const { password: _, ...user } = found;
          set({ user, isAuth: true, isLoading: false });
          return { success: true };
        }

        // Allow any email/password for demo
        const demoUser: AuthUser = {
          id:     'demo-' + Date.now(),
          name:   email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email,
          plan:   'starter',
          avatar: email.slice(0, 2).toUpperCase(),
        };
        set({ user: demoUser, isAuth: true, isLoading: false });
        return { success: true };
      },

      register: async (name, email, _password) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000));

        const exists = MOCK_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );

        if (exists) {
          set({ isLoading: false });
          return { success: false, error: 'An account with this email already exists.' };
        }

        const newUser: AuthUser = {
          id:     'u-' + Date.now(),
          name,
          email,
          plan:   'starter',
          avatar: name.slice(0, 2).toUpperCase(),
        };

        set({ user: newUser, isAuth: true, isLoading: false });
        return { success: true };
      },

      logout: () => {
        set({ user: null, isAuth: false });
      },

      upgradePlan: (plan) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, plan } });
        }
      },
    }),
    {
      name: 'merchant-auth',
      partialize: (state) => ({ user: state.user, isAuth: state.isAuth }),
    }
  )
);