import { ArticleFilters } from '@/components/articles/ArticleFilters';
import { listCategories } from '@/lib/api/categories';
import { listTags } from '@/lib/api/tags';

export async function ArticleFiltersSection() {
  const [categories, tags] = await Promise.all([listCategories(), listTags()]);

  return <ArticleFilters categories={categories} tags={tags} />;
}
