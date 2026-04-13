import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AnomalyToast } from '../ui/AnomalyToast';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[#0d0f12] text-[#e8eaf0]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <AnomalyToast />
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}