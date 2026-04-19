import { useState, useMemo } from 'react';
import { Panel, PanelHeader } from '../components/ui/Panel';
import { Modal } from '../components/ui/Modal';
import { FormField, Input, Select } from '../components/ui/FormField';
import { useProductSort } from '../hooks/useProductSort';
import { useDashboardStore } from '../store/useDashboardStore';
import { clsx } from 'clsx';
import type { Product } from '../types';

const CATEGORIES = ['All', 'Electronics', 'Furniture', 'Accessories'];

const CATEGORY_OPTIONS = [
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Furniture',   value: 'Furniture'   },
  { label: 'Accessories', value: 'Accessories' },
];

interface ProductForm {
  name:     string;
  category: string;
  sales:    string;
  revenue:  string;
  delta:    string;
}

const EMPTY_FORM: ProductForm = {
  name:     '',
  category: 'Electronics',
  sales:    '',
  revenue:  '',
  delta:    '',
};

export function ProductsPage() {
  const { products, addProduct } = useDashboardStore();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [search,         setSearch]         = useState('');
  const [showModal,      setShowModal]      = useState(false);
  const [form,           setForm]           = useState<ProductForm>(EMPTY_FORM);
  const [errors,         setErrors]         = useState<Partial<ProductForm>>({});

  const filtered = useMemo(() =>
    products.filter((p) => {
      const matchCat    = categoryFilter === 'All' || p.category === categoryFilter;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    }),
    [products, categoryFilter, search]
  );

  const { sortKey, sortDir, sortedProducts, toggleSort } = useProductSort(filtered);

  const totalRevenue = products.reduce((a, p) => a + p.revenue, 0);
  const totalSales   = products.reduce((a, p) => a + p.sales, 0);

  function validate(): boolean {
    const e: Partial<ProductForm> = {};
    if (!form.name.trim())           e.name    = 'Name is required';
    if (!form.sales || isNaN(Number(form.sales)))   e.sales   = 'Valid number required';
    if (!form.revenue || isNaN(Number(form.revenue))) e.revenue = 'Valid number required';
    if (form.delta && isNaN(Number(form.delta)))     e.delta   = 'Valid number required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    const newProduct: Product = {
      id:       Date.now().toString(),
      name:     form.name.trim(),
      category: form.category,
      sales:    Number(form.sales),
      revenue:  Number(form.revenue),
      delta:    Number(form.delta) || 0,
    };

    addProduct(newProduct);
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(false);
  }

  function handleClose() {
    setForm(EMPTY_FORM);
    setErrors({});
    setShowModal(false);
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1
            className="font-['Syne',sans-serif] text-xl font-bold tracking-tight"
            style={{ color: 'var(--text)' }}
          >
            Products
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text3)' }}>
            {sortedProducts.length} products · ${totalRevenue.toLocaleString()} total revenue
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 font-medium text-xs px-4 py-2 rounded-lg transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
        >
          + Add product
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Total Products', value: products.length.toString(),         color: '#4d9cf8' },
          { label: 'Total Sales',    value: totalSales.toLocaleString(),         color: '#22d98a' },
          { label: 'Total Revenue',  value: '$' + totalRevenue.toLocaleString(), color: '#a78bfa' },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl p-4"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <p
              className="font-mono text-[10px] tracking-widest uppercase mb-2"
              style={{ color: 'var(--text3)' }}
            >
              {card.label}
            </p>
            <p
              className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight"
              style={{ color: card.color }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <Panel>
        <PanelHeader title="All products">
          <div className="flex items-center gap-2 flex-wrap">
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              style={{ width: '140px' }}
            />
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className="font-mono text-[10px] px-2.5 py-1 rounded transition-all duration-150"
                  style={{
                    backgroundColor: categoryFilter === cat ? 'var(--surface3)' : 'transparent',
                    color:           categoryFilter === cat ? 'var(--text)'     : 'var(--text3)',
                    border:          categoryFilter === cat
                      ? '1px solid var(--border2)'
                      : '1px solid transparent',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </PanelHeader>

        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[600px]">
            <thead>
              <tr>
                {[
                  { label: 'Product',  key: null       },
                  { label: 'Category', key: null       },
                  { label: 'Sales',    key: 'sales'    },
                  { label: 'Revenue',  key: 'revenue'  },
                  { label: 'Trend',    key: 'delta'    },
                ].map((col) => (
                  <th
                    key={col.label}
                    onClick={() =>
                      col.key &&
                      toggleSort(col.key as 'sales' | 'revenue' | 'delta')
                    }
                    className={clsx(
                      'font-mono text-[10px] tracking-widest uppercase px-[18px] py-3 text-left',
                      col.key && 'cursor-pointer select-none transition-colors'
                    )}
                    style={{ color: 'var(--text3)' }}
                  >
                    {col.label}
                    {col.key && sortKey === col.key && (
                      <span className="ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-[18px] py-8 text-center text-xs"
                    style={{ color: 'var(--text3)' }}
                  >
                    No products match your search.
                  </td>
                </tr>
              ) : (
                sortedProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="transition-colors cursor-default"
                    style={{ borderTop: '1px solid var(--border)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        'var(--surface2)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                        'transparent';
                    }}
                  >
                    <td className="px-[18px] py-3">
                      <span
                        className="font-medium block text-xs"
                        style={{ color: 'var(--text)' }}
                      >
                        {p.name}
                      </span>
                    </td>
                    <td className="px-[18px] py-3">
                      <span
                        className="font-mono text-[10px] px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: 'var(--surface3)',
                          color: 'var(--text2)',
                        }}
                      >
                        {p.category}
                      </span>
                    </td>
                    <td
                      className="px-[18px] py-3 text-xs"
                      style={{ color: 'var(--text2)' }}
                    >
                      {p.sales.toLocaleString()}
                    </td>
                    <td
                      className="px-[18px] py-3 font-mono text-[11px]"
                      style={{ color: 'var(--text)' }}
                    >
                      ${p.revenue.toLocaleString()}
                    </td>
                    <td className="px-[18px] py-3">
                      <span
                        className={clsx(
                          'font-mono text-[11px]',
                          p.delta >= 0 ? 'text-emerald-400' : 'text-red-400'
                        )}
                      >
                        {p.delta >= 0 ? '▲' : '▼'} {Math.abs(p.delta)}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* Add Product Modal */}
      {showModal && (
        <Modal title="Add new product" onClose={handleClose}>
          <div className="flex flex-col gap-3">
            <FormField label="Product name" required error={errors.name}>
              <Input
                type="text"
                placeholder="e.g. Wireless Mouse"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </FormField>

            <FormField label="Category" required>
              <Select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                options={CATEGORY_OPTIONS}
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField label="Sales (units)" required error={errors.sales}>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.sales}
                  onChange={(e) => setForm({ ...form, sales: e.target.value })}
                />
              </FormField>

              <FormField label="Revenue ($)" required error={errors.revenue}>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={form.revenue}
                  onChange={(e) => setForm({ ...form, revenue: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Trend % (optional)" error={errors.delta}>
              <Input
                type="number"
                placeholder="e.g. 8.5 or -2.1"
                value={form.delta}
                onChange={(e) => setForm({ ...form, delta: e.target.value })}
              />
            </FormField>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={handleClose}
              className="text-xs px-4 py-2 rounded-lg transition-all"
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
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="text-xs px-4 py-2 rounded-lg font-medium transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
            >
              Add product
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}