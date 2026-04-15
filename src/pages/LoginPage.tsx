import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { FormField, Input } from '../components/ui/FormField';

export function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isLoading } = useAuthStore();

  const from = (location.state as { from?: string })?.from ?? '/app';

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);

  async function handleLogin() {
    if (!email.trim()) { setError('Email is required.');    return; }
    if (!password)     { setError('Password is required.'); return; }
    setError('');

    const result = await login(email.trim(), password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? 'Login failed. Please try again.');
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <span
              className="font-['Syne',sans-serif] text-2xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              merchant<span className="text-emerald-400">.</span>analytics
            </span>
          </Link>
          <p className="text-sm mt-2" style={{ color: 'var(--text3)' }}>
            Sign in to your dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-6 flex flex-col gap-4"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          {error && (
            <div className="bg-red-950/40 border border-red-500/40 rounded-lg px-3 py-2 text-xs text-red-400">
              {error}
            </div>
          )}

          <FormField label="Email">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </FormField>

          <FormField label="Password">
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
                style={{ color: 'var(--text3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
              >
                {showPass ? 'Hide' : 'Show'}
              </button>
            </div>
          </FormField>

          <div className="flex items-center justify-between">
            <label
              className="flex items-center gap-2 text-xs cursor-pointer select-none"
              style={{ color: 'var(--text2)' }}
            >
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: isLoading ? 'var(--surface3)' : '#22d98a',
              color:           isLoading ? 'var(--text3)'    : '#0d0f12',
              cursor:          isLoading ? 'not-allowed'      : 'pointer',
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="text-center text-xs" style={{ color: 'var(--text3)' }}>
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              Create one free
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div
          className="mt-4 rounded-lg px-4 py-3 text-xs"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text3)',
          }}
        >
          <p className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: 'var(--text3)' }}>
            Demo credentials
          </p>
          <p>Email: <span style={{ color: 'var(--text2)' }}>tenson@merchant.io</span></p>
          <p>Password: <span style={{ color: 'var(--text2)' }}>demo1234</span></p>
          <p className="mt-1" style={{ color: 'var(--text3)' }}>Or use any email + password</p>
        </div>
      </div>
    </div>
  );
}