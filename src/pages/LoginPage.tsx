import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FormField, Input } from '../components/ui/FormField';

export function LoginPage() {
  const navigate = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  function handleLogin() {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate auth — replace with real API call later
    setTimeout(() => {
      setLoading(false);
      navigate('/app');
    }, 1000);
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
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </FormField>

          <div className="flex items-center justify-between">
            <label
              className="flex items-center gap-2 text-xs cursor-pointer"
              style={{ color: 'var(--text2)' }}
            >
              <input type="checkbox" className="rounded" />
              Remember me
            </label>
            <button
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: loading ? 'var(--surface3)' : '#22d98a',
              color: loading ? 'var(--text3)' : '#0d0f12',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p
            className="text-center text-xs"
            style={{ color: 'var(--text3)' }}
          >
            Don't have an account?{' '}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Start for free
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <p
          className="text-center text-xs mt-4"
          style={{ color: 'var(--text3)' }}
        >
          Demo: enter any email + password to access the dashboard
        </p>
      </div>
    </div>
  );
}