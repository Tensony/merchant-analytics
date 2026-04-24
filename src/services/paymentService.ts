const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

async function authPost<T>(path: string, body: unknown, token: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      Authorization:   `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail ?? 'Payment request failed');
  }

  return data;
}

export const paymentService = {
  initializePayment: (plan: string, token: string) =>
    authPost<{ authorization_url: string; reference: string }>(
      '/api/payments/initialize',
      { plan },
      token
    ),

  verifyPayment: (reference: string, plan: string, token: string) =>
    authPost<{ success: boolean; plan: string }>(
      '/api/payments/verify',
      { reference, plan },
      token
    ),
};