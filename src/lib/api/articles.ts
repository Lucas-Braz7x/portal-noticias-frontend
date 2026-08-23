import type { ArticleDetail, ArticleSummary, ListArticlesParams, PaginatedResponse } from '@/types/article';

import { articlesCacheOptions } from './cache';
import { apiFetch, type FetchOptions } from './client';
import { articleDetailSchema, paginatedArticlesSchema } from './schemas/article';

function buildQuery(params: ListArticlesParams): string {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  if (params.category) searchParams.set('category', params.category);
  if (params.tag) searchParams.set('tag', params.tag);
  if (params.page != null) searchParams.set('page', String(params.page));
  if (params.limit != null) searchParams.set('limit', String(params.limit));

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export async function listArticles(
  params: ListArticlesParams = {},
  options?: FetchOptions,
): Promise<PaginatedResponse<ArticleSummary>> {
  return apiFetch<PaginatedResponse<ArticleSummary>>(
    `/articles${buildQuery(params)}`,
    paginatedArticlesSchema,
    { ...articlesCacheOptions(), ...options },
  );
}

export async function getArticleBySlug(
  slug: string,
  options?: FetchOptions,
): Promise<ArticleDetail> {
  return apiFetch<ArticleDetail>(`/articles/${encodeURIComponent(slug)}`, articleDetailSchema, {
    ...articlesCacheOptions(),
    ...options,
  });
}
