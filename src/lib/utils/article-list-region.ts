export const ARTICLE_LIST_REGION_ID = 'article-list';

export function scrollToArticleList(): void {
  document.getElementById(ARTICLE_LIST_REGION_ID)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
