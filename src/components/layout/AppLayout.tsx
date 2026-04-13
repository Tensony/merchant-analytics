import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ThemeProvider } from './ThemeProvider';
import { AnomalyToast } from '../ui/AnomalyToast';

export function AppLayout() {
  return (
    <ThemeProvider>
      <div
        className="flex min-h-screen"
        style={{
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <AnomalyToast />
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}