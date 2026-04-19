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
        <div className="flex-1 overflow-auto md:ml-0 mt-[52px] md:mt-0">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
}