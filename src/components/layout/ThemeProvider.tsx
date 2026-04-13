import { useEffect } from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useDashboardStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  return <>{children}</>;
}