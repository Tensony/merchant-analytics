const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

interface LoginPayload    { email: string; password: string; }
interface RegisterPayload { name: string; email: string; password: string; }

interface AuthResponse {
  token: { access_token: string; token_type: string };
  user:  { id: string; name: string; email: string; plan: string; avatar: string };
}

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail ?? 'Request failed');
  }

  return data;
}

async function get<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail ?? 'Request failed');
  }

  return data;
}

export const authService = {
  login:    (payload: LoginPayload)    => post<AuthResponse>('/api/auth/login',    payload),
  register: (payload: RegisterPayload) => post<AuthResponse>('/api/auth/register', payload),
  me:       (token: string)            => get('/api/auth/me', token),
};