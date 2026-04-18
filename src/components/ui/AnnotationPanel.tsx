import { useState } from 'react';
import type { Annotation } from '../../hooks/useChartAnnotations';

interface AnnotationPanelProps {
  annotations:      Annotation[];
  availableDates:   string[];
  onAdd:            (date: string, note: string) => void;
  onRemove:         (id: string) => void;
  onClearAll:       () => void;
}

export function AnnotationPanel({
  annotations, availableDates, onAdd, onRemove, onClearAll,
}: AnnotationPanelProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [note,         setNote]         = useState('');
  const [isOpen,       setIsOpen]       = useState(false);

  function handleAdd() {
    if (!selectedDate || !note.trim()) return;
    onAdd(selectedDate, note.trim());
    setNote('');
    setSelectedDate('');
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 font-mono text-[11px] px-2.5 py-1 rounded transition-all"
        style={{
          backgroundColor: isOpen ? 'var(--surface3)' : 'transparent',
          border: '1px solid var(--border)',
          color: isOpen ? 'var(--text)' : 'var(--text3)',
        }}
      >
        📌 {annotations.length > 0 ? `${annotations.length} note${annotations.length > 1 ? 's' : ''}` : 'Annotate'}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-9 z-50 rounded-xl w-72 overflow-hidden"
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
              Chart annotations
            </span>
            {annotations.length > 0 && (
              <button
                onClick={onClearAll}
                className="font-mono text-[10px] transition-colors"
                style={{ color: 'var(--text3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ff5757'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
              >
                Clear all
              </button>
            )}
          </div>

          {/* Existing annotations */}
          {annotations.length > 0 && (
            <div style={{ borderBottom: '1px solid var(--border)' }}>
              {annotations.map((ann) => (
                <div
                  key={ann.id}
                  className="flex items-start gap-2 px-4 py-2.5"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                    style={{ backgroundColor: ann.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-mono text-[10px] mb-0.5"
                      style={{ color: ann.color }}
                    >
                      {ann.date}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: 'var(--text2)' }}
                    >
                      {ann.note}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemove(ann.id)}
                    className="text-[11px] flex-shrink-0 transition-colors"
                    style={{ color: 'var(--text3)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#ff5757'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new annotation */}
          <div className="p-4 flex flex-col gap-2">
            <p
              className="font-mono text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--text3)' }}
            >
              Add note
            </p>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-lg px-3 py-1.5 text-xs outline-none"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              <option value="">Select date...</option>
              {availableDates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="w-full rounded-lg px-3 py-1.5 text-xs outline-none"
              style={{
                backgroundColor: 'var(--surface2)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!selectedDate || !note.trim()}
              className="w-full py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: selectedDate && note.trim() ? '#22d98a' : 'var(--surface3)',
                color:           selectedDate && note.trim() ? '#0d0f12' : 'var(--text3)',
                cursor:          selectedDate && note.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Add annotation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}