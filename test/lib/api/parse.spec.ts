import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { ApiValidationError, parseApiResponse } from '@/lib/api/parse';
import { articleSummarySchema } from '@/lib/api/schemas/article';

describe('parseApiResponse', () => {
  it('returns parsed data when schema matches', () => {
    const data = {
      slug: 'test',
      title: 'Title',
      summary: 'Summary',
      publishedAt: '2026-01-15T10:00:00Z',
      author: 'Author',
      category: { name: 'Tech', slug: 'tech' },
      tags: [],
    };

    const result = parseApiResponse(articleSummarySchema, data, 'testContext');

    expect(result).toEqual(data);
  });

  it('throws ApiValidationError when schema does not match', () => {
    const invalidData = { slug: 'test', title: 'Title' };

    expect(() =>
      parseApiResponse(articleSummarySchema, invalidData, 'listArticles'),
    ).toThrow(ApiValidationError);

    try {
      parseApiResponse(articleSummarySchema, invalidData, 'listArticles');
    } catch (error) {
      expect(error).toBeInstanceOf(ApiValidationError);
      expect((error as ApiValidationError).context).toBe('listArticles');
      expect((error as ApiValidationError).message).toContain(
        'Invalid API response',
      );
    }
  });

  it('includes field paths in error message', () => {
    const schema = z.object({ name: z.string() });

    expect(() => parseApiResponse(schema, { name: 123 }, 'test')).toThrow(
      /name/,
    );
  });
});
