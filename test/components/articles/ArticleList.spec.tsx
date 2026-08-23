import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArticleList } from '@/components/articles/ArticleList';
import type { ArticleSummary } from '@/types/article';

const articles: ArticleSummary[] = [
  {
    slug: 'article-1',
    title: 'Primeiro Artigo',
    summary: 'Resumo 1',
    publishedAt: '2026-01-10T10:00:00Z',
    author: 'Autor 1',
    category: { name: 'Tecnologia', slug: 'tecnologia' },
    tags: [{ name: 'JavaScript', slug: 'javascript' }],
  },
  {
    slug: 'article-2',
    title: 'Segundo Artigo',
    summary: 'Resumo 2',
    publishedAt: '2026-01-12T10:00:00Z',
    author: 'Autor 2',
    category: { name: 'Economia', slug: 'economia' },
    tags: [{ name: 'AWS', slug: 'aws' }],
  },
];

describe('ArticleList', () => {
  it('renders a card for each article', () => {
    render(<ArticleList articles={articles} />);

    expect(screen.getByRole('link', { name: 'Primeiro Artigo' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Segundo Artigo' })).toBeInTheDocument();
  });
});
