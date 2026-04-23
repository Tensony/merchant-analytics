import { useDashboardStore } from '../../store/useDashboardStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useDashboardStore();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-200 flex-shrink-0"
      style={{
        border:          '1px solid var(--border)',
        color:           'var(--text2)',
        backgroundColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--surface2)';
        e.currentTarget.style.color           = 'var(--text)';
        e.currentTarget.style.borderColor     = 'var(--border2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color           = 'var(--text2)';
        e.currentTarget.style.borderColor     = 'var(--border)';
      }}
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}