import { Outlet } from 'react-router-dom';
import { ThemeProvider } from './ThemeProvider';
import { AnomalyToast } from '../ui/AnomalyToast';

export function PublicLayout() {
  return (
    <ThemeProvider>
      <div
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
          fontFamily: "'DM Sans', sans-serif",
          minHeight: '100vh',
        }}
      >
        <AnomalyToast />
        <Outlet />
      </div>
    </ThemeProvider>
  );
}