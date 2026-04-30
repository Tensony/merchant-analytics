import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ThemeProvider } from './ThemeProvider';
import { AnomalyToast } from '../ui/AnomalyToast';
import { OnboardingWizard } from '../ui/OnboardingWizard';
import { useAuthStore } from '../../store/useAuthStore';
import { Menu,} from 'lucide-react';

export function AppLayout() {
  const { hasCompletedOnboarding } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div
        className="flex min-h-screen relative"
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <AnomalyToast />
        {!hasCompletedOnboarding && <OnboardingWizard />}
        
        {/* Mobile menu button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        >
          <Menu size={20} />
        </button>

        {/* Sidebar - hidden on mobile, shown when toggled */}
        <div
          className={`
            fixed md:sticky top-0 left-0 z-40 h-screen
            transform transition-transform duration-300
            md:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 overflow-auto md:ml-0 pt-14 md:pt-0">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}