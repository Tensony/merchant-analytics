import { clsx } from 'clsx';
import type { LiveOrder } from '../../hooks/useRealtimeOrders';

interface LiveOrderFeedProps {
  orders:    LiveOrder[];
  connected: boolean;
  onClear:   () => void;
}

export function LiveOrderFeed({ orders, connected, onClear }: LiveOrderFeedProps) {
  return (
    <div className="flex flex-col h-full">

      {/* Header row */}
      <div
        className="flex items-center justify-between px-[18px] py-3"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{
              backgroundColor: connected ? 'var(--green)' : 'var(--red)',
              animation: connected ? 'pulse 1.5s ease-in-out infinite' : 'none',
            }}
          />
          <span
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--text3)' }}
          >
            {connected ? 'Live feed' : 'Reconnecting...'}
          </span>
        </div>
        {orders.length > 0 && (
          <button
            onClick={onClear}
            className="font-mono text-[10px] transition-colors"
            style={{ color: 'var(--text3)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Orders list */}
      <div className="flex-1 overflow-y-auto max-h-[280px]">
        {orders.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-32 gap-2"
            style={{ color: 'var(--text3)' }}
          >
            <span className="text-lg">◎</span>
            <p className="text-xs font-mono">
              {connected ? 'Waiting for orders...' : 'Connecting...'}
            </p>
          </div>
        ) : (
          orders.map((order, i) => {
            return (
              <div
                key={`${order.id}-${order.ts}`}
                className="flex items-center gap-3 px-[18px] py-2.5 transition-all"
                style={{
                  borderBottom: '1px solid var(--border)',
                  animation: i === 0 ? 'slideIn 0.3s ease-out' : 'none',
                  opacity: 1 - i * 0.04,
                }}
              >
                {/* Status dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      order.status === 'completed' ? 'var(--green)' :
                      order.status === 'pending'   ? 'var(--amber)' :
                      'var(--red)',
                  }}
                />

                {/* Order info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs font-medium truncate"
                      style={{ color: 'var(--text)' }}
                    >
                      {order.customer}
                    </span>
                    <span
                      className="font-mono text-[11px] flex-shrink-0"
                      style={{ color: 'var(--text)' }}
                    >
                      ${order.amount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span
                      className="text-[10px] truncate"
                      style={{ color: 'var(--text3)' }}
                    >
                      {order.product}
                    </span>
                    <span
                      className="font-mono text-[9px] px-1.5 py-0.5 rounded flex-shrink-0"
                      style={{
                        backgroundColor:
                          order.status === 'completed' ? 'var(--green-dim)' :
                          order.status === 'pending'   ? 'var(--amber-dim)' :
                          'var(--red-dim)',
                        color:
                          order.status === 'completed' ? 'var(--green)' :
                          order.status === 'pending'   ? 'var(--amber)' :
                          'var(--red)',
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <span
                  className="font-mono text-[9px] flex-shrink-0"
                  style={{ color: 'var(--text3)' }}
                >
                  {order.date.split(', ')[1] ?? order.date}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}