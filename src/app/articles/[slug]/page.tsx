import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ArticleDetailView } from '@/components/articles/ArticleDetailView';
import { Container } from '@/components/layout/Container';
import { getArticleBySlug } from '@/lib/api/articles';
import { ApiClientError } from '@/types/article';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(slug);
    return {
      title: article.title,
      description: article.summary,
    };
  } catch (error) {
    if (error instanceof ApiClientError && error.code === 'ARTICLE_NOT_FOUND') {
      return { title: 'Artigo não encontrado' };
    }
    return { title: slug.replace(/-/g, ' ') };
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;

  let article;
  try {
    article = await getArticleBySlug(slug);
  } catch (error) {
    if (error instanceof ApiClientError && error.code === 'ARTICLE_NOT_FOUND') {
      notFound();
    }
    throw error;
  }

  return (
    <Container>
      <ArticleDetailView article={article} />
    </Container>
  );
}
