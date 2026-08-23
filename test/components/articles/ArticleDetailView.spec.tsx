import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArticleDetailView } from '@/components/articles/ArticleDetailView';
import type { ArticleDetail } from '@/types/article';

const mockArticle: ArticleDetail = {
  slug: 'test-article',
  title: 'Título Completo',
  summary: 'Resumo do artigo.',
  content: '<p>Conteúdo completo do artigo.</p>',
  publishedAt: '2026-01-15T10:00:00Z',
  author: 'Maria Silva',
  category: { name: 'Tecnologia', slug: 'tecnologia' },
  tags: [{ name: 'JavaScript', slug: 'javascript' }],
};

describe('ArticleDetailView', () => {
  it('renders title and content', () => {
    render(<ArticleDetailView article={mockArticle} />);

    expect(
      screen.getByRole('heading', { name: 'Título Completo' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Conteúdo completo do artigo.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Maria Silva')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Voltar para a home' }),
    ).toHaveAttribute('href', '/');
    expect(screen.getByText('Voltar')).toBeInTheDocument();
  });
});
