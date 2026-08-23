'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import { DEFAULT_PAGE_LIMIT } from '@/lib/constants/pagination';
import {
  buildListFiltersKey,
  parseListSearchParams,
} from '@/lib/utils/list-params';
import type { ReferenceItem } from '@/types/article';

import styles from './ArticleFilters.module.scss';

interface ArticleFiltersProps {
  categories: ReferenceItem[];
  tags: ReferenceItem[];
}

export function ArticleFilters({ categories, tags }: ArticleFiltersProps) {
  const searchParams = useSearchParams();
  const currentParams = useMemo(
    () => parseListSearchParams(Object.fromEntries(searchParams.entries())),
    [searchParams],
  );
  const hasActiveFilters = Boolean(
    currentParams.q || currentParams.category || currentParams.tag,
  );
  const formKey = buildListFiltersKey(currentParams);

  return (
    <form key={formKey} className={styles.filters} method="GET" action="/">
      {currentParams.limit != null &&
      currentParams.limit !== DEFAULT_PAGE_LIMIT ? (
        <input type="hidden" name="limit" value={currentParams.limit} />
      ) : null}
      <div className={styles.field}>
        <label htmlFor="q" className={styles.label}>
          Buscar
        </label>
        <input
          id="q"
          name="q"
          type="search"
          className={styles.input}
          placeholder="Título, resumo, conteúdo ou tags..."
          defaultValue={currentParams.q ?? ''}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="category" className={styles.label}>
          Categoria
        </label>
        <select
          id="category"
          name="category"
          className={styles.select}
          defaultValue={currentParams.category ?? ''}
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="tag" className={styles.label}>
          Tag
        </label>
        <select
          id="tag"
          name="tag"
          className={styles.select}
          defaultValue={currentParams.tag ?? ''}
        >
          <option value="">Todas</option>
          {tags.map((tag) => (
            <option key={tag.slug} value={tag.slug}>
              {tag.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit}>
          Buscar
        </button>
        {hasActiveFilters ? (
          <Link
            href="/"
            className={styles.clear}
            aria-label="Limpar filtros"
            data-tooltip="Limpar filtros"
          >
            <svg
              className={styles.clearIcon}
              viewBox="0 0 24 24"
              width="20"
              height="20"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="M12.5 8c-2.65 0-5.05 1.04-6.9 2.7L2 7v9h9l-2.91-2.91C8.97 13.67 10.66 13 12.5 13c3.04 0 5.5 2.46 5.5 5.5h2C20 11.36 16.64 8 12.5 8z"
              />
            </svg>
          </Link>
        ) : null}
      </div>
    </form>
  );
}
