import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Shortcuts {
  onSearch:    () => void;
  onShortcuts: () => void;
  onTheme:     () => void;
  onExport:    () => void;
}

export function useKeyboardShortcuts({
  onSearch, onShortcuts, onTheme, onExport,
}: Shortcuts) {
  const navigate = useNavigate();

  useEffect(() => {
    let gPressed = false;
    let gTimer: ReturnType<typeof setTimeout>;

    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;

      // Cmd+K — search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onSearch();
        return;
      }

      // Cmd+E — export
      if ((e.metaKey || e.ctrlKey) && e.key === 'e') {
        e.preventDefault();
        onExport();
        return;
      }

      // ? — shortcuts modal
      if (e.key === '?') { onShortcuts(); return; }

      // T — toggle theme
      if (e.key === 't' || e.key === 'T') { onTheme(); return; }

      // G sequences — navigation
      if (e.key === 'g' || e.key === 'G') {
        gPressed = true;
        gTimer = setTimeout(() => { gPressed = false; }, 1000);
        return;
      }

      if (gPressed) {
        clearTimeout(gTimer);
        gPressed = false;
        const routes: Record<string, string> = {
          o: '/app', p: '/app/products',
          c: '/app/customers', a: '/app/campaigns', s: '/app/settings',
        };
        const route = routes[e.key.toLowerCase()];
        if (route) navigate(route);
      }
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [navigate, onSearch, onShortcuts, onTheme, onExport]);
}