import {
  DEFAULT_PAGE_LIMIT,
  MAX_PAGE_LIMIT,
} from '@/lib/constants/pagination';
import type { ListArticlesParams } from '@/types/article';

type RawSearchParams = Record<string, string | string[] | undefined>;

function getParam(raw: RawSearchParams, key: string): string | undefined {
  const value = raw[key];
  if (Array.isArray(value)) {
    return value[0]?.trim() || undefined;
  }
  const trimmed = value?.trim();
  return trimmed || undefined;
}

function parsePage(raw: RawSearchParams): number {
  const value = getParam(raw, 'page');
  if (!value) return 1;
  const page = Number.parseInt(value, 10);
  return Number.isFinite(page) && page >= 1 ? page : 1;
}

function parseLimit(raw: RawSearchParams): number {
  const value = getParam(raw, 'limit');
  if (!value) return DEFAULT_PAGE_LIMIT;
  const limit = Number.parseInt(value, 10);
  if (!Number.isFinite(limit) || limit < 1 || limit > MAX_PAGE_LIMIT) {
    return DEFAULT_PAGE_LIMIT;
  }
  return limit;
}

export function parseListSearchParams(raw: RawSearchParams): ListArticlesParams {
  const params: ListArticlesParams = {
    page: parsePage(raw),
    limit: parseLimit(raw),
  };

  const q = getParam(raw, 'q');
  const category = getParam(raw, 'category');
  const tag = getParam(raw, 'tag');

  if (q) params.q = q;
  if (category) params.category = category;
  if (tag) params.tag = tag;

  return params;
}

export function buildArticlesListUrl(params: ListArticlesParams): string {
  const searchParams = new URLSearchParams();

  if (params.q) searchParams.set('q', params.q);
  if (params.category) searchParams.set('category', params.category);
  if (params.tag) searchParams.set('tag', params.tag);
  if (params.page != null && params.page > 1) {
    searchParams.set('page', String(params.page));
  }
  if (params.limit != null && params.limit !== DEFAULT_PAGE_LIMIT) {
    searchParams.set('limit', String(params.limit));
  }

  const query = searchParams.toString();
  return query ? `/?${query}` : '/';
}

export function buildListFiltersKey(params: ListArticlesParams): string {
  return [params.q ?? '', params.category ?? '', params.tag ?? ''].join('|');
}
