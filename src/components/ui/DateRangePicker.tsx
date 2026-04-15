import { useState, useRef, useEffect } from 'react';

export interface DateRange {
  from: string;
  to:   string;
}

interface DateRangePickerProps {
  value:    DateRange | null;
  onChange: (range: DateRange | null) => void;
  onClose:  () => void;
}

export function DateRangePicker({ value, onChange, onClose }: DateRangePickerProps) {
  const [from, setFrom] = useState(value?.from ?? '');
  const [to,   setTo]   = useState(value?.to   ?? '');
  const ref             = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  function handleApply() {
    if (from && to && from <= to) {
      onChange({ from, to });
      onClose();
    }
  }

  function handleClear() {
    setFrom('');
    setTo('');
    onChange(null);
    onClose();
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-10 z-50 rounded-xl p-4 flex flex-col gap-3 w-72"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border2)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <p
        className="font-mono text-[10px] tracking-widest uppercase"
        style={{ color: 'var(--text3)' }}
      >
        Custom date range
      </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--text3)' }}
          >
            From
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="rounded-lg px-3 py-2 text-xs outline-none"
            style={{
              backgroundColor: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            className="font-mono text-[10px] tracking-widest uppercase"
            style={{ color: 'var(--text3)' }}
          >
            To
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="rounded-lg px-3 py-2 text-xs outline-none"
            style={{
              backgroundColor: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>
      </div>

      {from && to && from > to && (
        <p className="text-[11px] text-red-400">
          End date must be after start date.
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleClear}
          className="flex-1 py-1.5 rounded-lg text-xs transition-all"
          style={{
            border: '1px solid var(--border)',
            color: 'var(--text2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--surface2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          disabled={!from || !to || from > to}
          className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            backgroundColor: from && to && from <= to ? '#22d98a' : 'var(--surface3)',
            color:           from && to && from <= to ? '#0d0f12' : 'var(--text3)',
            cursor:          from && to && from <= to ? 'pointer' : 'not-allowed',
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}