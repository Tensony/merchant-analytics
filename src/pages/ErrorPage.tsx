import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';

export function ErrorPage() {
  const error = useRouteError();

  const status  = isRouteErrorResponse(error) ? error.status  : 500;
  const message = isRouteErrorResponse(error) ? error.statusText : 'Something went wrong';

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ backgroundColor: 'var(--bg)', fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="text-center flex flex-col items-center gap-6 max-w-md">

        {/* Status code */}
        <div>
          <p
            className="font-['Syne',sans-serif] text-8xl font-bold tracking-tight"
            style={{ color: 'var(--surface3)' }}
          >
            {status}
          </p>
          <p
            className="font-['Syne',sans-serif] text-xl font-bold tracking-tight mt-2"
            style={{ color: 'var(--text)' }}
          >
            {status === 404 ? 'Page not found' : message}
          </p>
        </div>

        {/* Description */}
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text2)' }}
        >
          {status === 404
            ? "The page you're looking for doesn't exist or has been moved."
            : 'An unexpected error occurred. Please try again.'}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors bg-emerald-500 hover:bg-emerald-400 text-[#0d0f12]"
          >
            Go home
          </Link>
          <Link
            to="/app"
            className="px-5 py-2.5 rounded-xl text-sm transition-all"
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
            Go to dashboard
          </Link>
        </div>

        {/* Logo */}
        <p
          className="font-['Syne',sans-serif] text-sm font-bold tracking-tight mt-4"
          style={{ color: 'var(--text3)' }}
        >
          merchant<span className="text-emerald-400">.</span>analytics
        </p>
      </div>
    </div>
  );
}