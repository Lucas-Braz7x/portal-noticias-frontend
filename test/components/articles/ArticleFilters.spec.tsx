import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ArticleFilters } from '@/components/articles/ArticleFilters';
import type { ReferenceItem } from '@/types/article';

const categories: ReferenceItem[] = [
  { name: 'Política', slug: 'politica' },
  { name: 'Tecnologia', slug: 'tecnologia' },
];

const tags: ReferenceItem[] = [
  { name: 'Eleições', slug: 'eleicoes' },
  { name: 'JavaScript', slug: 'javascript' },
];

const useSearchParams = vi.fn(
  () =>
    new URLSearchParams(
      'q=inteligencia&category=tecnologia&tag=eleicoes&page=2',
    ),
);

vi.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParams(),
}));

describe('ArticleFilters', () => {
  it('renders form with current search params', () => {
    render(<ArticleFilters categories={categories} tags={tags} />);

    expect(screen.getByLabelText('Buscar')).toHaveValue('inteligencia');
    expect(screen.getByLabelText('Categoria')).toHaveValue('tecnologia');
    expect(screen.getByLabelText('Tag')).toHaveValue('eleicoes');
  });

  it('renders category options with slugs', () => {
    useSearchParams.mockReturnValueOnce(new URLSearchParams());

    render(<ArticleFilters categories={categories} tags={tags} />);

    const categorySelect = screen.getByLabelText('Categoria');
    expect(categorySelect).toContainHTML('value="politica"');
    expect(categorySelect).toContainHTML('value="tecnologia"');
  });
});
