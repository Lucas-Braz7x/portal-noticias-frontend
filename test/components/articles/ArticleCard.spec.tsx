import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArticleCard } from '@/components/articles/ArticleCard';
import type { ArticleSummary } from '@/types/article';

const mockArticle: ArticleSummary = {
  slug: 'test-article',
  title: 'Título do Artigo',
  summary: 'Resumo do artigo de teste.',
  publishedAt: '2026-01-15T10:00:00Z',
  author: 'Maria Silva',
  category: { name: 'Tecnologia', slug: 'tecnologia' },
  tags: [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'Next.js', slug: 'nextjs' },
  ],
};

describe('ArticleCard', () => {
  it('renders all RF01 fields', () => {
    render(<ArticleCard article={mockArticle} />);

    expect(
      screen.getByRole('link', { name: 'Título do Artigo' }),
    ).toHaveAttribute('href', '/articles/test-article');
    expect(screen.getByText('Resumo do artigo de teste.')).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(screen.getByText('Tecnologia')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Ver mais' })).toHaveAttribute(
      'href',
      '/articles/test-article',
    );
  });

  it('truncates long summaries', () => {
    const longSummary = 'A'.repeat(200);
    render(
      <ArticleCard
        article={{
          ...mockArticle,
          summary: longSummary,
        }}
      />,
    );

    expect(screen.getByText(`${'A'.repeat(140)}…`)).toBeInTheDocument();
  });
});
