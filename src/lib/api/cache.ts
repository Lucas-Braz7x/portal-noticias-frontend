import type { FetchOptions } from './client';

export const CACHE_TAGS = {
  articles: 'articles',
  categories: 'categories',
  tags: 'tags',
} as const;

export const CACHE_REVALIDATE = {
  articles: 60,
  categories: 300,
  tags: 300,
} as const;

export function articlesCacheOptions(): FetchOptions {
  return {
    next: {
      revalidate: CACHE_REVALIDATE.articles,
      tags: [CACHE_TAGS.articles],
    },
  };
}

export function categoriesCacheOptions(): FetchOptions {
  return {
    next: {
      revalidate: CACHE_REVALIDATE.categories,
      tags: [CACHE_TAGS.categories],
    },
  };
}

export function tagsCacheOptions(): FetchOptions {
  return {
    next: {
      revalidate: CACHE_REVALIDATE.tags,
      tags: [CACHE_TAGS.tags],
    },
  };
}
