import { describe, expect, it } from 'vitest';

import { formatPublishedAt } from '@/lib/utils/format-date';

describe('formatPublishedAt', () => {
  it('formats ISO date in pt-BR', () => {
    const result = formatPublishedAt('2026-01-15T10:00:00Z');
    expect(result).toMatch(/15/);
    expect(result).toMatch(/01/);
    expect(result).toMatch(/2026/);
  });

  it('returns empty string for invalid date', () => {
    expect(formatPublishedAt('invalid')).toBe('');
  });
});
