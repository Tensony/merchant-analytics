import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { FormField, Input } from '../components/ui/FormField';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, isAuth } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuth) {
      navigate('/app', { replace: true });
    }
  }, [isAuth, navigate]);

  const [name,      setName]      = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [agreed,    setAgreed]    = useState(false);
  const [error,     setError]     = useState('');
  const [showPass,  setShowPass]  = useState(false);

  async function handleRegister() {
    setError('');
    if (!name.trim())            { setError('Full name is required.');               return; }
    if (!email.trim())           { setError('Email is required.');                   return; }
    if (password.length < 8)     { setError('Password must be at least 8 chars.');   return; }
    if (password !== confirm)    { setError('Passwords do not match.');              return; }
    if (!agreed)                 { setError('Please accept the terms to continue.'); return; }

    const result = await register(name.trim(), email.trim(), password);
    if (result.success) {
      navigate('/app', { replace: true });
    } else {
      setError(result.error ?? 'Registration failed. Please try again.');
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <Link to="/">
            <span
              className="font-['Syne',sans-serif] text-xl md:text-2xl font-bold tracking-tight"
              style={{ color: 'var(--text)' }}
            >
              merchant<span className="text-emerald-400">.</span>analytics
            </span>
          </Link>
          <p className="text-xs md:text-sm mt-2" style={{ color: 'var(--text3)' }}>
            Create your free account
          </p>
        </div>

        {/* Plan badge */}
        <div
          className="flex items-center justify-center gap-2 mb-4 py-2 px-3 rounded-lg"
          style={{
            backgroundColor: '#22d98a22',
            border: '1px solid #22d98a44',
          }}
        >
          <span className="text-emerald-400 text-xs">✓</span>
          <span className="text-[11px] md:text-xs text-emerald-400 font-medium text-center">
            Free Starter plan — no credit card required
          </span>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-5 sm:p-6 flex flex-col gap-4 w-full"
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

          <FormField label="Full name">
            <Input
              type="text"
              placeholder="Alex Mwale"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormField>

          <FormField label="Email">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormField>

          <FormField label="Password">
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <FormField label="Confirm password">
            <Input
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
            />
          </FormField>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded flex-shrink-0"
            />
            <span className="text-[11px] md:text-xs leading-relaxed" style={{ color: 'var(--text2)' }}>
              I agree to the{' '}
              <a href="#" className="text-emerald-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-emerald-400 hover:underline">Privacy Policy</a>
            </span>
          </label>

          <button
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-sm font-medium transition-all"
            style={{
              backgroundColor: isLoading ? 'var(--surface3)' : '#22d98a',
              color:           isLoading ? 'var(--text3)'    : '#0d0f12',
              cursor:          isLoading ? 'not-allowed'     : 'pointer',
            }}
          >
            {isLoading ? 'Creating account...' : 'Create free account'}
          </button>

          <p className="text-center text-xs" style={{ color: 'var(--text3)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-[10px]">🔒</span>
            <span className="text-[10px] md:text-xs" style={{ color: 'var(--text3)' }}>Secure</span>
          </div>
          <div className="w-0.5 h-0.5 rounded-full bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-[10px]">✓</span>
            <span className="text-[10px] md:text-xs" style={{ color: 'var(--text3)' }}>Free forever</span>
          </div>
          <div className="w-0.5 h-0.5 rounded-full bg-border" />
          <div className="flex items-center gap-1.5">
            <span className="text-emerald-400 text-[10px]">↻</span>
            <span className="text-[10px] md:text-xs" style={{ color: 'var(--text3)' }}>Cancel anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}