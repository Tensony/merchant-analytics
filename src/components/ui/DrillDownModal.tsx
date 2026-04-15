import { Modal } from './Modal';
import type { DailyDataPoint } from '../../types';
import { ORDERS } from '../../data/mockData';

interface DrillDownModalProps {
  point:   DailyDataPoint;
  onClose: () => void;
}

export function DrillDownModal({ point, onClose }: DrillDownModalProps) {
  // In production this would fetch real orders for the date
  // For now we show sample orders with realistic amounts
  const sampleOrders = ORDERS.slice(0, Math.min(
    Math.max(2, Math.round(point.orders * 0.1)),
    ORDERS.length
  ));

  return (
    <Modal title={`Orders — ${point.date}`} onClose={onClose}>
      <div className="flex flex-col gap-4">

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Revenue', value: '$' + Math.round(point.revenue).toLocaleString(), color: '#22d98a' },
            { label: 'Orders',  value: point.orders.toLocaleString(),                    color: '#4d9cf8' },
            { label: 'Avg AOV', value: '$' + point.aov.toFixed(2),                      color: '#a78bfa' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg p-3 text-center"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
              }}
            >
              <p
                className="font-mono text-[9px] tracking-widest uppercase mb-1"
                style={{ color: 'var(--text3)' }}
              >
                {s.label}
              </p>
              <p
                className="font-['Syne',sans-serif] text-base font-bold"
                style={{ color: s.color }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Anomaly warning */}
        {point.isAnomaly && (
          <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            Anomaly detected — revenue {Math.round(point.revenue / 7200 * 100 - 100)}% above 7-day average
          </div>
        )}

        {/* Sample orders table */}
        <div>
          <p
            className="font-mono text-[10px] tracking-widest uppercase mb-2"
            style={{ color: 'var(--text3)' }}
          >
            Sample orders for this day
          </p>
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid var(--border)' }}
          >
            <table className="w-full text-xs">
              <thead>
                <tr style={{ backgroundColor: 'var(--surface2)' }}>
                  {['Order', 'Customer', 'Amount', 'Status'].map((h) => (
                    <th
                      key={h}
                      className="font-mono text-[9px] tracking-widest uppercase px-3 py-2 text-left"
                      style={{ color: 'var(--text3)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sampleOrders.map((o) => (
                  <tr
                    key={o.id}
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <td
                      className="px-3 py-2 font-mono text-[10px]"
                      style={{ color: 'var(--text)' }}
                    >
                      {o.id}
                    </td>
                    <td
                      className="px-3 py-2 text-[11px]"
                      style={{ color: 'var(--text2)' }}
                    >
                      {o.customer}
                    </td>
                    <td
                      className="px-3 py-2 font-mono text-[10px]"
                      style={{ color: 'var(--text)' }}
                    >
                      ${o.amount.toFixed(2)}
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${
                          o.status === 'completed' ? 'bg-emerald-950 text-emerald-400' :
                          o.status === 'pending'   ? 'bg-amber-950 text-amber-400'    :
                          'bg-red-950 text-red-400'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p
            className="text-[10px] mt-2"
            style={{ color: 'var(--text3)' }}
          >
            Showing sample · {point.orders} total orders on this day
          </p>
        </div>
      </div>
    </Modal>
  );
}