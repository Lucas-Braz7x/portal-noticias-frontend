import { describe, expect, it } from 'vitest';

import {
  articlesCacheOptions,
  CACHE_REVALIDATE,
  CACHE_TAGS,
  categoriesCacheOptions,
  tagsCacheOptions,
} from '@/lib/api/cache';

describe('cache options', () => {
  it('articlesCacheOptions returns articles revalidate and tag', () => {
    expect(articlesCacheOptions()).toEqual({
      next: {
        revalidate: CACHE_REVALIDATE.articles,
        tags: [CACHE_TAGS.articles],
      },
    });
  });

  it('categoriesCacheOptions returns categories revalidate and tag', () => {
    expect(categoriesCacheOptions()).toEqual({
      next: {
        revalidate: CACHE_REVALIDATE.categories,
        tags: [CACHE_TAGS.categories],
      },
    });
  });

  it('tagsCacheOptions returns tags revalidate and tag', () => {
    expect(tagsCacheOptions()).toEqual({
      next: {
        revalidate: CACHE_REVALIDATE.tags,
        tags: [CACHE_TAGS.tags],
      },
    });
  });
});
