import { describe, expect, it } from 'vitest';

import { truncateText } from '@/lib/utils/truncate-text';

describe('truncateText', () => {
  it('returns text unchanged when within limit', () => {
    expect(truncateText('Curto', 10)).toBe('Curto');
  });

  it('truncates and adds ellipsis when exceeding limit', () => {
    expect(truncateText('abcdefghij', 5)).toBe('abcde…');
  });

  it('trims whitespace before truncating', () => {
    expect(truncateText('  abcdef  ', 4)).toBe('abcd…');
  });
});
