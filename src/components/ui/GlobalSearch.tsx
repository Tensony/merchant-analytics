import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS, ORDERS, CUSTOMERS } from '../../data/mockData';

interface SearchResult {
  id:       string;
  type:     'product' | 'order' | 'customer';
  title:    string;
  subtitle: string;
  path:     string;
}

interface GlobalSearchProps {
  onClose: () => void;
}

export function GlobalSearch({ onClose }: GlobalSearchProps) {
  const [query,   setQuery]   = useState('');
  const [focused, setFocused] = useState(0);
  const navigate              = useNavigate();
  const inputRef              = useRef<HTMLInputElement>(null);
  const ref                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const results = useMemo((): SearchResult[] => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();

    const productResults: SearchResult[] = PRODUCTS
      .filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
      .slice(0, 3)
      .map((p) => ({
        id:       p.id,
        type:     'product',
        title:    p.name,
        subtitle: `${p.category} · $${p.revenue.toLocaleString()} revenue`,
        path:     '/app/products',
      }));

    const orderResults: SearchResult[] = ORDERS
      .filter((o) => o.customer.toLowerCase().includes(q) || o.id.toLowerCase().includes(q))
      .slice(0, 3)
      .map((o) => ({
        id:       o.id,
        type:     'order',
        title:    o.id,
        subtitle: `${o.customer} · $${o.amount.toFixed(2)} · ${o.status}`,
        path:     '/app',
      }));

    const customerResults: SearchResult[] = CUSTOMERS
      .filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({
        id:       c.id,
        type:     'customer',
        title:    c.name,
        subtitle: `${c.email} · ${c.country}`,
        path:     '/app/customers',
      }));

    return [...productResults, ...orderResults, ...customerResults];
  }, [query]);

  useEffect(() => { setFocused(0); }, [results]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocused((f) => Math.min(f + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocused((f) => Math.max(f - 1, 0));
    }
    if (e.key === 'Enter' && results[focused]) {
      navigate(results[focused].path);
      onClose();
    }
  }

  const TYPE_ICON = { product: '◫', order: '◎', customer: '◉' };
  const TYPE_COLOR = {
    product:  '#4d9cf8',
    order:    '#22d98a',
    customer: '#a78bfa',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
    >
      <div
        ref={ref}
        className="w-full max-w-lg rounded-xl overflow-hidden"
        style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border2)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
        }}
      >
        {/* Input */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <span style={{ color: 'var(--text3)' }}>⌕</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, orders, customers..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text)' }}
          />
          <kbd
            className="font-mono text-[10px] px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: 'var(--surface2)',
              border: '1px solid var(--border)',
              color: 'var(--text3)',
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        {query.trim().length >= 2 && (
          <div className="py-1">
            {results.length === 0 ? (
              <div
                className="px-4 py-6 text-center text-xs"
                style={{ color: 'var(--text3)' }}
              >
                No results for "{query}"
              </div>
            ) : (
              results.map((r, i) => (
                <div
                  key={r.id + r.type}
                  onClick={() => { navigate(r.path); onClose(); }}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: focused === i ? 'var(--surface2)' : 'transparent',
                  }}
                  onMouseEnter={() => setFocused(i)}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0"
                    style={{
                      backgroundColor: TYPE_COLOR[r.type] + '22',
                      color:           TYPE_COLOR[r.type],
                    }}
                  >
                    {TYPE_ICON[r.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: 'var(--text)' }}
                    >
                      {r.title}
                    </p>
                    <p
                      className="text-[11px] truncate"
                      style={{ color: 'var(--text3)' }}
                    >
                      {r.subtitle}
                    </p>
                  </div>
                  <span
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{
                      backgroundColor: TYPE_COLOR[r.type] + '22',
                      color:           TYPE_COLOR[r.type],
                    }}
                  >
                    {r.type}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer hint */}
        <div
          className="flex items-center gap-4 px-4 py-2"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {[
            { key: '↑↓', label: 'Navigate' },
            { key: '↵',  label: 'Select'   },
            { key: 'ESC', label: 'Close'   },
          ].map((hint) => (
            <div key={hint.label} className="flex items-center gap-1.5">
              <kbd
                className="font-mono text-[9px] px-1.5 py-0.5 rounded"
                style={{
                  backgroundColor: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text3)',
                }}
              >
                {hint.key}
              </kbd>
              <span
                className="text-[10px]"
                style={{ color: 'var(--text3)' }}
              >
                {hint.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}