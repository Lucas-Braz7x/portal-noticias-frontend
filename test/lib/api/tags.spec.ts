import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { listTags } from '@/lib/api/tags';

describe('tags API', () => {
  beforeEach(() => {
    process.env.API_URL = 'http://localhost:3000/api/v1';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('listTags parses reference items', async () => {
    const mockResponse = [
      { name: 'Eleições', slug: 'eleicoes' },
      { name: 'JavaScript', slug: 'javascript' },
    ];

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await listTags();

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/tags',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      }),
    );
    expect(result).toEqual(mockResponse);
  });
});
