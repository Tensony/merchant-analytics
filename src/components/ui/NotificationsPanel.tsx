import { useRef, useEffect } from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { clsx } from 'clsx';
import type { AppNotification } from '../../types';

interface NotificationsPanelProps {
  onClose: () => void;
}

const TYPE_CONFIG: Record<AppNotification['type'], { icon: string; color: string }> = {
  anomaly:  { icon: '⚠', color: '#f5a623' },
  order:    { icon: '◎', color: '#22d98a' },
  campaign: { icon: '◈', color: '#4d9cf8' },
  system:   { icon: '◉', color: '#a78bfa' },
};

export function NotificationsPanel({ onClose }: NotificationsPanelProps) {
  const {
    notifications_list,
    markAllRead,
    clearNotifications,
  } = useDashboardStore();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-10 z-50 rounded-xl w-80 overflow-hidden"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <span
          className="font-['Syne',sans-serif] text-sm font-semibold"
          style={{ color: 'var(--text)' }}
        >
          Notifications
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllRead}
            className="font-mono text-[10px] transition-colors"
            style={{ color: 'var(--text3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
          >
            Mark all read
          </button>
          <button
            onClick={clearNotifications}
            className="font-mono text-[10px] transition-colors"
            style={{ color: 'var(--text3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ff5757'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-80">
        {notifications_list.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-10 gap-2"
            style={{ color: 'var(--text3)' }}
          >
            <span className="text-2xl">◎</span>
            <p className="text-xs font-mono">No notifications</p>
          </div>
        ) : (
          notifications_list.map((n) => {
            const config = TYPE_CONFIG[n.type];
            return (
              <div
                key={n.id}
                className="flex items-start gap-3 px-4 py-3 transition-colors"
                style={{
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: n.read ? 'transparent' : 'var(--surface2)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    'var(--surface2)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.backgroundColor =
                    n.read ? 'transparent' : 'var(--surface2)';
                }}
              >
                {/* Icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5"
                  style={{
                    backgroundColor: config.color + '22',
                    color: config.color,
                  }}
                >
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={clsx(
                        'text-xs',
                        n.read ? 'font-normal' : 'font-medium'
                      )}
                      style={{ color: 'var(--text)' }}
                    >
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p
                    className="text-[11px] mt-0.5 leading-relaxed"
                    style={{ color: 'var(--text2)' }}
                  >
                    {n.message}
                  </p>
                  <p
                    className="font-mono text-[10px] mt-1"
                    style={{ color: 'var(--text3)' }}
                  >
                    {n.timestamp}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}