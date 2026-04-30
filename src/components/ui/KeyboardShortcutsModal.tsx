import { useState } from 'react';
import { Modal } from './Modal';

interface ShortcutsModalProps {
  onClose: () => void;
}

const SHORTCUTS = [
  {
    category: 'Navigation',
    items: [
      { keys: ['G', 'O'], desc: 'Go to Overview'  },
      { keys: ['G', 'P'], desc: 'Go to Products'  },
      { keys: ['G', 'C'], desc: 'Go to Customers' },
      { keys: ['G', 'A'], desc: 'Go to Campaigns' },
      { keys: ['G', 'S'], desc: 'Go to Settings'  },
    ],
  },
  {
    category: 'Dashboard',
    items: [
      { keys: ['⌘', 'K'],   desc: 'Open search'          },
      { keys: ['1'],         desc: 'Switch to Revenue'     },
      { keys: ['2'],         desc: 'Switch to Orders'      },
      { keys: ['3'],         desc: 'Switch to AOV'         },
      { keys: ['4'],         desc: 'Switch to Churn'       },
      { keys: ['B'],         desc: 'Toggle Bar / Line'     },
      { keys: ['C'],         desc: 'Toggle comparison'     },
      { keys: ['L'],         desc: 'Toggle live chart'     },
    ],
  },
  {
    category: 'General',
    items: [
      { keys: ['?'],         desc: 'Show keyboard shortcuts' },
      { keys: ['T'],         desc: 'Toggle theme'            },
      { keys: ['Esc'],       desc: 'Close modal / panel'     },
      { keys: ['⌘', 'E'],   desc: 'Export CSV'              },
    ],
  },
];

function Key({ label }: { label: string }) {
  return (
    <kbd
      className="inline-flex items-center justify-center font-mono text-[11px] font-medium px-2 py-0.5 rounded"
      style={{
        backgroundColor: 'var(--surface3)',
        border: '1px solid var(--border2)',
        color: 'var(--text2)',
        minWidth: '24px',
      }}
    >
      {label}
    </kbd>
  );
}

export function KeyboardShortcutsModal({ onClose }: ShortcutsModalProps) {
  return (
    <Modal title="Keyboard shortcuts" onClose={onClose}>
      <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-1">
        {SHORTCUTS.map((section) => (
          <div key={section.category}>
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-3"
              style={{ color: 'var(--text3)' }}
            >
              {section.category}
            </p>
            <div className="flex flex-col gap-0">
              {section.items.map((item) => (
                <div
                  key={item.desc}
                  className="flex items-center justify-between py-2"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <span className="text-xs" style={{ color: 'var(--text2)' }}>
                    {item.desc}
                  </span>
                  <div className="flex items-center gap-1">
                    {item.keys.map((k, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <Key label={k} />
                        {i < item.keys.length - 1 && (
                          <span
                            className="font-mono text-[10px]"
                            style={{ color: 'var(--text3)' }}
                          >
                            +
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p
        className="text-[11px] text-center mt-2"
        style={{ color: 'var(--text3)' }}
      >
        Press <Key label="?" /> anywhere to open this panel
      </p>
    </Modal>
  );
}