import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  title:    string;
  onClose:  () => void;
  children: ReactNode;
}

export function Modal({ title, onClose, children }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-xl p-6 flex flex-col gap-4"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border2)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            className="font-['Syne',sans-serif] text-base font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-all"
            style={{ color: 'var(--text3)', border: '1px solid var(--border)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--surface2)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text3)';
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}