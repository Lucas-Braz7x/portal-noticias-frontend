import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getArticleBySlug, listArticles } from '@/lib/api/articles';
import { ApiValidationError } from '@/lib/api/parse';
import { ApiClientError } from '@/types/article';

describe('articles API', () => {
  beforeEach(() => {
    process.env.API_URL = 'http://localhost:3000/api/v1';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('listArticles parses paginated response', async () => {
    const mockResponse = {
      data: [
        {
          slug: 'test-article',
          title: 'Test',
          summary: 'Summary',
          publishedAt: '2026-01-15T10:00:00Z',
          author: 'Author',
          category: { name: 'tech', slug: 'tech' },
          tags: [{ name: 'ai', slug: 'ai' }],
        },
      ],
      meta: { page: 1, limit: 10, total: 1, totalPages: 1 },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      }),
    );

    const result = await listArticles(
      { page: 1, limit: 10 },
      { next: { revalidate: 0 } },
    );

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/v1/articles?page=1&limit=10',
      expect.objectContaining({
        headers: { Accept: 'application/json' },
      }),
    );
    expect(result).toEqual(mockResponse);
  });

  it('listArticles throws ApiValidationError on malformed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({ data: [{ slug: 'only-slug' }], meta: {} }),
      }),
    );

    await expect(
      listArticles({}, { next: { revalidate: 0 } }),
    ).rejects.toBeInstanceOf(ApiValidationError);
  });

  it('getArticleBySlug throws ApiClientError on ARTICLE_NOT_FOUND', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: () =>
          Promise.resolve({
            error: {
              code: 'ARTICLE_NOT_FOUND',
              message: 'Artigo não encontrado',
            },
          }),
      }),
    );

    await expect(
      getArticleBySlug('missing', { next: { revalidate: 0 } }),
    ).rejects.toBeInstanceOf(ApiClientError);
    await expect(
      getArticleBySlug('missing', { next: { revalidate: 0 } }),
    ).rejects.toMatchObject({
      code: 'ARTICLE_NOT_FOUND',
      status: 404,
      message: 'Artigo não encontrado',
    });
  });
});
