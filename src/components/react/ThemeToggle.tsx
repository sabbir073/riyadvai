import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'reyad-theme';

type Theme = 'dark' | 'light';

const readTheme = (): Theme => {
  if (typeof document === 'undefined') return 'dark';
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  return 'dark';
};

export default function ThemeToggle() {
  // Initialise from the DOM (the inline bootstrap script in BaseLayout sets
  // data-theme synchronously before hydration), so the icon is correct on first paint.
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-full border border-[var(--border-hair)] bg-[var(--bg-glass)] backdrop-blur transition-colors hover:border-[var(--border-bright)] hover:bg-[var(--bg-elevated)]"
    >
      <Moon
        aria-hidden
        className="absolute h-4 w-4 text-[var(--brand)] transition-all duration-300"
        style={{
          opacity: isDark ? 1 : 0,
          transform: isDark ? 'rotate(0) scale(1)' : 'rotate(-90deg) scale(0.4)',
        }}
      />
      <Sun
        aria-hidden
        className="absolute h-4 w-4 text-[var(--accent-gold)] transition-all duration-300"
        style={{
          opacity: isDark ? 0 : 1,
          transform: isDark ? 'rotate(90deg) scale(0.4)' : 'rotate(0) scale(1)',
        }}
      />
    </button>
  );
}
