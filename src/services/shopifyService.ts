const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function authPost<T>(path: string, body: unknown, token: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:  `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail ?? 'Request failed');
  }

  return data;
}

export const shopifyService = {
  startOAuth: (shop: string, token: string) =>
    authPost<{ authorization_url: string }>(
      '/api/integrations/shopify/oauth/start',
      { shop },
      token
    ),

  syncOrders: (shop: string, accessToken: string, jwtToken: string) =>
    authPost<{ synced: number; total: number }>(
      '/api/integrations/shopify/sync/orders',
      { shop, access_token: accessToken },
      jwtToken
    ),

  syncProducts: (shop: string, accessToken: string, jwtToken: string) =>
    authPost<{ synced: number; total: number }>(
      '/api/integrations/shopify/sync/products',
      { shop, access_token: accessToken },
      jwtToken
    ),
};