'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Hydration guard recommended by next-themes: theme is unknown on the server,
  // so we only render the resolved icon after mount to avoid a mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition-colors hover:bg-accent"
    >
      {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
