import { useState } from 'react';
import { useDashboardStore } from '../../store/useDashboardStore';
import { Modal } from './Modal';
import { FormField, Input, Select } from './FormField';
import type { Store } from '../../types';

const COUNTRY_OPTIONS = [
  { label: '🇿🇲 Zambia',       value: 'Zambia'       },
  { label: '🇳🇬 Nigeria',      value: 'Nigeria'      },
  { label: '🇬🇭 Ghana',        value: 'Ghana'        },
  { label: '🇰🇪 Kenya',        value: 'Kenya'        },
  { label: '🇿🇦 South Africa', value: 'South Africa' },
  { label: '🇸🇳 Senegal',      value: 'Senegal'      },
  { label: '🇬🇧 UK',           value: 'UK'           },
  { label: '🇺🇸 USA',          value: 'USA'          },
];

const CURRENCY_OPTIONS = [
  { label: 'ZMW (K)',  value: 'ZMW' },
  { label: 'NGN (₦)', value: 'NGN' },
  { label: 'GHS (₵)', value: 'GHS' },
  { label: 'KES (Ksh)',value: 'KES' },
  { label: 'ZAR (R)', value: 'ZAR' },
  { label: 'USD ($)', value: 'USD' },
  { label: 'GBP (£)', value: 'GBP' },
];

const FLAG_MAP: Record<string, string> = {
  Zambia: '🇿🇲', Nigeria: '🇳🇬', Ghana: '🇬🇭', Kenya: '🇰🇪',
  'South Africa': '🇿🇦', Senegal: '🇸🇳', UK: '🇬🇧', USA: '🇺🇸',
};

interface NewStoreForm {
  name:     string;
  country:  string;
  currency: string;
}

const EMPTY_FORM: NewStoreForm = {
  name:     '',
  country:  'Zambia',
  currency: 'ZMW',
};

export function StoreSwitcher() {
  const { stores, activeStore, switchStore, addStore } = useDashboardStore();

  const [isOpen,     setIsOpen]     = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState<NewStoreForm>(EMPTY_FORM);
  const [error,      setError]      = useState('');

  const active = stores.find((s) => s.id === activeStore) ?? stores[0];

  function handleAddStore() {
    if (!form.name.trim()) { setError('Store name is required.'); return; }
    const newStore: Store = {
      id:       Date.now().toString(),
      name:     form.name.trim(),
      country:  form.country,
      flag:     FLAG_MAP[form.country] ?? '🌍',
      currency: form.currency,
      plan:     'starter',
    };
    addStore(newStore);
    switchStore(newStore.id);
    setForm(EMPTY_FORM);
    setError('');
    setShowModal(false);
    setIsOpen(false);
  }

  return (
    <>
      <div className="relative px-3 pb-2">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all"
          style={{
            backgroundColor: 'var(--surface2)',
            border: '1px solid var(--border)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)';  }}
        >
          <span className="text-base">{active?.flag}</span>
          <div className="flex-1 text-left min-w-0">
            <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
              {active?.name}
            </p>
            <p className="text-[10px] font-mono truncate" style={{ color: 'var(--text3)' }}>
              {active?.currency} · {active?.plan}
            </p>
          </div>
          <span
            className="font-mono text-[10px] flex-shrink-0 transition-transform"
            style={{
              color: 'var(--text3)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          >
            ↓
          </span>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            className="absolute left-3 right-3 top-full mt-1 z-50 rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border2)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => { switchStore(store.id); setIsOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left transition-all"
                style={{
                  backgroundColor: store.id === activeStore
                    ? '#22d98a11' : 'transparent',
                  borderLeft: store.id === activeStore
                    ? '2px solid #22d98a' : '2px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (store.id !== activeStore)
                    e.currentTarget.style.backgroundColor = 'var(--surface2)';
                }}
                onMouseLeave={(e) => {
                  if (store.id !== activeStore)
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="text-base">{store.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>
                    {store.name}
                  </p>
                  <p className="text-[10px] font-mono" style={{ color: 'var(--text3)' }}>
                    {store.country} · {store.currency}
                  </p>
                </div>
                {store.id === activeStore && (
                  <span className="text-emerald-400 text-xs">✓</span>
                )}
              </button>
            ))}

            <div style={{ borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => { setShowModal(true); setIsOpen(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left text-xs transition-all"
                style={{ color: 'var(--text2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--surface3)', color: 'var(--text3)' }}
                >
                  +
                </span>
                Add new store
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add store modal */}
      {showModal && (
        <Modal title="Add new store" onClose={() => { setShowModal(false); setError(''); }}>
          <div className="flex flex-col gap-3">
            {error && (
              <div className="bg-red-950/40 border border-red-500/40 rounded-lg px-3 py-2 text-xs text-red-400">
                {error}
              </div>
            )}
            <FormField label="Store name" required>
              <Input
                type="text"
                placeholder="e.g. My Accra Store"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </FormField>
            <FormField label="Country">
              <Select
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                options={COUNTRY_OPTIONS}
              />
            </FormField>
            <FormField label="Currency">
              <Select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                options={CURRENCY_OPTIONS}
              />
            </FormField>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => { setShowModal(false); setError(''); }}
              className="text-xs px-4 py-2 rounded-lg transition-all"
              style={{ border: '1px solid var(--border)', color: 'var(--text2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Cancel
            </button>
            <button
              onClick={handleAddStore}
              className="text-xs px-4 py-2 rounded-lg font-medium bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
            >
              Add store
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}