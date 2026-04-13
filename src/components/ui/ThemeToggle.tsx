import { useDashboardStore } from '../../store/useDashboardStore';

export function ThemeToggle() {
  const { theme, toggleTheme } = useDashboardStore();

  return (
    <button
      onClick={toggleTheme}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-8 h-8 flex items-center justify-center border border-[var(--border)] rounded-lg text-[var(--text2)] hover:bg-[var(--surface2)] hover:text-[var(--text)] transition-all text-sm"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}