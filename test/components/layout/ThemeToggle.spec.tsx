import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';

import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { THEME_STORAGE_KEY } from '@/lib/theme';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(THEME_STORAGE_KEY, 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  });

  it('toggles data-theme and persists preference', () => {
    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: 'Ativar tema escuro' });
    fireEvent.click(button);

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    expect(
      screen.getByRole('button', { name: 'Ativar tema claro' }),
    ).toBeInTheDocument();
  });
});
