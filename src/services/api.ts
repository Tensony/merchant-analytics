const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function request<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json();
}

export const api = {
  getMetrics:   (range: string)                          => request('/api/metrics',   { range }),
  getOrders:    (status?: string, search?: string)       => request('/api/orders',    { status: status ?? '', search: search ?? '' }),
  getProducts:  (category?: string, sortBy?: string)     => request('/api/products',  { category: category ?? '', sort_by: sortBy ?? 'revenue' }),
  getCustomers: (status?: string, search?: string)       => request('/api/customers', { status: status ?? '', search: search ?? '' }),
  getCampaigns: (status?: string, channel?: string)      => request('/api/campaigns', { status: status ?? '', channel: channel ?? '' }),
};