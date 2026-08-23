import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ArticleList } from '@/components/articles/ArticleList';
import { Pagination } from '@/components/articles/Pagination';
import { BackToTop } from '@/components/ui/BackToTop';
import { EmptyState } from '@/components/ui/EmptyState';
import emptyStateStyles from '@/components/ui/EmptyState.module.scss';
import { listArticles } from '@/lib/api/articles';
import { buildArticlesListUrl, parseListSearchParams } from '@/lib/utils/list-params';
import type { ListArticlesParams } from '@/types/article';

interface ArticleListSectionProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export async function ArticleListSection({ searchParams }: ArticleListSectionProps) {
  const currentParams = parseListSearchParams(await searchParams);
  const page = currentParams.page ?? 1;
  const limit = currentParams.limit ?? 10;
  const { data, meta } = await listArticles({ ...currentParams, limit, page });

  if (meta.totalPages > 0 && page > meta.totalPages) {
    redirect(buildArticlesListUrl({ ...currentParams, page: meta.totalPages }));
  }

  const hasActiveFilters = Boolean(currentParams.q || currentParams.category || currentParams.tag);
  const listParams: ListArticlesParams = {
    q: currentParams.q,
    category: currentParams.category,
    tag: currentParams.tag,
    limit,
  };

  if (data.length === 0) {
    return (
      <EmptyState
        title={hasActiveFilters ? 'Nenhum artigo encontrado' : 'Nenhum artigo publicado'}
        description={
          hasActiveFilters
            ? 'Tente ajustar os termos de busca ou remover alguns filtros.'
            : 'Novos artigos aparecerão aqui quando forem publicados.'
        }
        action={
          hasActiveFilters ? (
            <Link href="/" className={emptyStateStyles.actionLink}>
              Limpar filtros
            </Link>
          ) : undefined
        }
      />
    );
  }

  return (
    <>
      <ArticleList articles={data} />
      <Pagination meta={meta} listParams={listParams} />
      <BackToTop />
    </>
  );
}
