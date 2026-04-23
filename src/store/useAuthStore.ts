import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../types';
import { authService } from './authService';

// ── Types ─────────────────────────────────────────────────────────────────────

interface AuthStore {
  user:                   AuthUser | null;
  token:                  string | null;
  isAuth:                 boolean;
  isLoading:              boolean;
  hasCompletedOnboarding: boolean;

  login:              (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register:           (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout:             () => void;
  upgradePlan:        (plan: AuthUser['plan']) => void;
  completeOnboarding: () => void;
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user:                   null,
      token:                  null,
      isAuth:                 false,
      isLoading:              false,
      hasCompletedOnboarding: false,

      // ── Login ──────────────────────────────────────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const data = await authService.login({ email, password });
          set({
            user:      data.user as AuthUser,
            token:     data.token.access_token,
            isAuth:    true,
            isLoading: false,
          });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return {
            success: false,
            error:   err instanceof Error ? err.message : 'Login failed.',
          };
        }
      },

      // ── Register ───────────────────────────────────────────────────────────
      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const data = await authService.register({ name, email, password });
          set({
            user:                   data.user as AuthUser,
            token:                  data.token.access_token,
            isAuth:                 true,
            isLoading:              false,
            hasCompletedOnboarding: false,
          });
          return { success: true };
        } catch (err) {
          set({ isLoading: false });
          return {
            success: false,
            error:   err instanceof Error ? err.message : 'Registration failed.',
          };
        }
      },

      // ── Logout ─────────────────────────────────────────────────────────────
      logout: () => {
        set({
          user:                   null,
          token:                  null,
          isAuth:                 false,
          hasCompletedOnboarding: false,
        });
      },

      // ── Upgrade plan ───────────────────────────────────────────────────────
      upgradePlan: (plan) => {
        set((state) => ({
          user: state.user ? { ...state.user, plan } : null,
        }));
      },

      // ── Complete onboarding ────────────────────────────────────────────────
      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },
    }),
    {
      name: 'merchant-auth',
      partialize: (state) => ({
        user:                   state.user,
        token:                  state.token,
        isAuth:                 state.isAuth,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);