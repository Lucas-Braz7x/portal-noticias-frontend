import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { listCategories } from '@/lib/api/categories';

describe('categories API', () => {
  beforeEach(() => {
    process.env.API_URL = 'http://localhost:3000/api/v1';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('listCategories parses reference items', async () => {
    const mockResponse = [
      { name: 'Política', slug: 'politica' },
      { name: 'Tecnologia', slug: 'tecnologia' },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await listCategories();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/categories',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      }),
    );
    expect(result).toEqual(mockResponse);
  });
});
