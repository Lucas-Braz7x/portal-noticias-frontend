'use client';

import { useRouter } from 'next/navigation';
import { useTransition, type ChangeEvent, type MouseEvent, type ReactNode } from 'react';

import { PAGE_SIZE_OPTIONS } from '@/lib/constants/pagination';
import { buildArticlesListUrl } from '@/lib/utils/list-params';
import { getVisiblePageNumbers } from '@/lib/utils/pagination';
import type { ListArticlesParams, PaginationMeta } from '@/types/article';

import styles from './Pagination.module.scss';

interface PaginationProps {
  meta: PaginationMeta;
  listParams: ListArticlesParams;
}

function buildPageUrl(listParams: ListArticlesParams, page: number): string {
  return buildArticlesListUrl({ ...listParams, page });
}

interface PaginationLinkProps {
  href: string;
  className: string;
  ariaLabel?: string;
  children: ReactNode;
  onNavigate: (href: string) => void;
}

function PaginationLink({ href, className, ariaLabel, children, onNavigate }: PaginationLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    onNavigate(href);
  };

  return (
    <a href={href} className={className} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </a>
  );
}

export function Pagination({ meta, listParams }: PaginationProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const pageItems = getVisiblePageNumbers(meta.page, meta.totalPages);
  const hasPrevious = meta.page > 1;
  const hasNext = meta.page < meta.totalPages;

  const navigate = (href: string) => {
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  };

  const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const limit = Number.parseInt(event.target.value, 10);
    const href = buildArticlesListUrl({ ...listParams, page: 1, limit });
    navigate(href);
  };

  return (
    <nav className={styles.pagination} aria-label="Paginação">
      <div className={styles.pageSize}>
        <label htmlFor="page-limit" className={styles.pageSizeLabel}>
          Itens por página
        </label>
        <select
          id="page-limit"
          className={styles.pageSizeSelect}
          value={meta.limit}
          onChange={handleLimitChange}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {meta.totalPages > 1 ? (
        <>
          <p className={styles.summary}>
            Página {meta.page} de {meta.totalPages}
          </p>

          <ul className={styles.list}>
            <li>
              {hasPrevious ? (
                <PaginationLink
                  href={buildPageUrl(listParams, meta.page - 1)}
                  className={styles.control}
                  ariaLabel="Página anterior"
                  onNavigate={navigate}
                >
                  Anterior
                </PaginationLink>
              ) : (
                <span
                  className={`${styles.control} ${styles.disabled}`}
                  aria-disabled="true"
                  aria-label="Página anterior"
                >
                  Anterior
                </span>
              )}
            </li>

            {pageItems.map((item, index) => (
              <li key={item === 'ellipsis' ? `ellipsis-${index}` : item}>
                {item === 'ellipsis' ? (
                  <span className={styles.ellipsis} aria-hidden="true">
                    …
                  </span>
                ) : item === meta.page ? (
                  <span
                    className={`${styles.page} ${styles.current}`}
                    aria-current="page"
                    aria-label={`Página ${item}, página atual`}
                  >
                    {item}
                  </span>
                ) : (
                  <PaginationLink
                    href={buildPageUrl(listParams, item)}
                    className={styles.page}
                    ariaLabel={`Ir para página ${item}`}
                    onNavigate={navigate}
                  >
                    {item}
                  </PaginationLink>
                )}
              </li>
            ))}

            <li>
              {hasNext ? (
                <PaginationLink
                  href={buildPageUrl(listParams, meta.page + 1)}
                  className={styles.control}
                  ariaLabel="Próxima página"
                  onNavigate={navigate}
                >
                  Próxima
                </PaginationLink>
              ) : (
                <span
                  className={`${styles.control} ${styles.disabled}`}
                  aria-disabled="true"
                  aria-label="Próxima página"
                >
                  Próxima
                </span>
              )}
            </li>
          </ul>
        </>
      ) : null}
    </nav>
  );
}
