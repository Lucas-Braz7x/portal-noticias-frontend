import { describe, expect, it } from 'vitest';

import { getVisiblePageNumbers } from '@/lib/utils/pagination';

describe('getVisiblePageNumbers', () => {
  it('returns empty array when totalPages is 0 or 1', () => {
    expect(getVisiblePageNumbers(1, 0)).toEqual([]);
    expect(getVisiblePageNumbers(1, 1)).toEqual([]);
  });

  it('returns all pages when totalPages is small', () => {
    expect(getVisiblePageNumbers(2, 3)).toEqual([1, 2, 3]);
    expect(getVisiblePageNumbers(3, 4)).toEqual([1, 2, 3, 4]);
  });

  it('shows ellipsis around the current page in large sets', () => {
    expect(getVisiblePageNumbers(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
    expect(getVisiblePageNumbers(1, 10)).toEqual([1, 2, 'ellipsis', 10]);
    expect(getVisiblePageNumbers(10, 10)).toEqual([1, 'ellipsis', 9, 10]);
  });
});
