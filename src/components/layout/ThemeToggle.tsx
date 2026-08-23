'use client';

import { useEffect, useState } from 'react';

import { applyTheme, getPreferredTheme, type Theme } from '@/lib/theme';

import styles from './ThemeToggle.module.scss';

function SunIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12m0-16a1 1 0 0 1 1 1v1.17a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1m0 17.83a1 1 0 0 1-1 1H9.83a1 1 0 1 1 0-2H11a1 1 0 0 1 1 1m7.17-8.83a1 1 0 0 1-1 1h-1.17a1 1 0 1 1 0-2H20a1 1 0 0 1 1 1M5 12a1 1 0 0 1-1-1H3.83a1 1 0 1 1 0-2H4a1 1 0 0 1 1 1m12.07 5.07a1 1 0 0 1-1.41 0l-.83-.83a1 1 0 1 1 1.41-1.41l.83.83a1 1 0 0 1 0 1.41M7.76 7.76a1 1 0 0 1-1.41 0l-.83-.83a1 1 0 0 1 1.41-1.41l.83.83a1 1 0 0 1 0 1.41m9.9 0a1 1 0 0 1 0-1.41l.83-.83a1 1 0 0 1 1.41 1.41l-.83.83a1 1 0 0 1-1.41 0M7.76 16.24a1 1 0 0 1 0 1.41l-.83.83a1 1 0 1 1-1.41-1.41l.83-.83a1 1 0 0 1 1.41 0"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.1 3a9 9 0 1 0 8.9 11.32A7 7 0 0 1 12.1 3"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(getPreferredTheme());
    setReady(true);
  }, []);

  const toggleTheme = () => {
    if (!ready) {
      return;
    }

    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    setTheme(nextTheme);
  };

  const label = theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro';

  return (
    <button
      type="button"
      className={ready ? `${styles.toggle} ${styles.ready}` : styles.toggle}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}
