import { describe, expect, it } from 'vitest';

import { DEFAULT_PAGE_LIMIT } from '@/lib/constants/pagination';
import {
  buildArticlesListUrl,
  buildListFiltersKey,
  parseListSearchParams,
} from '@/lib/utils/list-params';

describe('parseListSearchParams', () => {
  it('parses valid search params', () => {
    expect(
      parseListSearchParams({
        q: 'inteligencia',
        category: 'tecnologia',
        tag: 'eleicoes',
        page: '2',
        limit: '20',
      }),
    ).toEqual({
      q: 'inteligencia',
      category: 'tecnologia',
      tag: 'eleicoes',
      page: 2,
      limit: 20,
    });
  });

  it('defaults page and limit when missing or invalid', () => {
    expect(parseListSearchParams({})).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_LIMIT,
    });
    expect(parseListSearchParams({ page: '0' })).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_LIMIT,
    });
    expect(parseListSearchParams({ page: 'abc' })).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_LIMIT,
    });
    expect(parseListSearchParams({ limit: '0' })).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_LIMIT,
    });
    expect(parseListSearchParams({ limit: '99' })).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_LIMIT,
    });
  });

  it('ignores empty strings', () => {
    expect(parseListSearchParams({ q: '', category: '  ', tag: '' })).toEqual({
      page: 1,
      limit: DEFAULT_PAGE_LIMIT,
    });
  });

  it('takes first value when param is an array', () => {
    expect(parseListSearchParams({ q: ['first', 'second'] })).toEqual({
      q: 'first',
      page: 1,
      limit: DEFAULT_PAGE_LIMIT,
    });
  });
});

describe('buildArticlesListUrl', () => {
  it('builds query string with active filters', () => {
    expect(
      buildArticlesListUrl({
        q: 'ia',
        category: 'tecnologia',
        tag: 'eleicoes',
        page: 2,
        limit: 20,
      }),
    ).toBe('/?q=ia&category=tecnologia&tag=eleicoes&page=2&limit=20');
  });

  it('omits page 1 and default limit from url', () => {
    expect(
      buildArticlesListUrl({ q: 'ia', page: 1, limit: DEFAULT_PAGE_LIMIT }),
    ).toBe('/?q=ia');
  });

  it('returns root path when no params', () => {
    expect(buildArticlesListUrl({})).toBe('/');
    expect(buildArticlesListUrl({ page: 1, limit: DEFAULT_PAGE_LIMIT })).toBe(
      '/',
    );
  });
});

describe('buildListFiltersKey', () => {
  it('builds stable key from filter params', () => {
    expect(buildListFiltersKey({ q: 'ia', category: 'tech', tag: 'js' })).toBe(
      'ia|tech|js',
    );
    expect(buildListFiltersKey({})).toBe('||');
  });
});
