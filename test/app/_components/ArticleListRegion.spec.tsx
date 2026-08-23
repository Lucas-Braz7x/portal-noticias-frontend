import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ArticleListRegion } from '@/app/_components/ArticleListRegion';
import { scrollToArticleList } from '@/lib/utils/article-list-region';

const useSearchParams = vi.fn(() => new URLSearchParams('page=1'));

vi.mock('next/navigation', () => ({
  useSearchParams: () => useSearchParams(),
}));

vi.mock('@/lib/utils/article-list-region', async () => {
  const actual = await vi.importActual<
    typeof import('@/lib/utils/article-list-region')
  >('@/lib/utils/article-list-region');

  return {
    ...actual,
    scrollToArticleList: vi.fn(),
  };
});

describe('ArticleListRegion', () => {
  it('scrolls to the article list when page changes after mount', () => {
    const { rerender } = render(
      <ArticleListRegion>
        <p>Lista</p>
      </ArticleListRegion>,
    );

    useSearchParams.mockReturnValue(new URLSearchParams('page=2'));
    rerender(
      <ArticleListRegion>
        <p>Lista</p>
      </ArticleListRegion>,
    );

    expect(scrollToArticleList).toHaveBeenCalledTimes(1);
  });

  it('does not scroll on the initial render', () => {
    vi.mocked(scrollToArticleList).mockClear();
    useSearchParams.mockReturnValue(new URLSearchParams('page=3'));

    render(
      <ArticleListRegion>
        <p>Lista</p>
      </ArticleListRegion>,
    );

    expect(scrollToArticleList).not.toHaveBeenCalled();
  });
});
