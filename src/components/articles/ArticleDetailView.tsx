import Link from 'next/link';

import { formatPublishedAt } from '@/lib/utils/format-date';
import { buildArticlesListUrl } from '@/lib/utils/list-params';
import type { ArticleDetail } from '@/types/article';

import styles from './ArticleDetailView.module.scss';

interface ArticleDetailViewProps {
  article: ArticleDetail;
}

export function ArticleDetailView({ article }: ArticleDetailViewProps) {
  return (
    <article className={styles.article}>
      <Link href="/" className={styles.backLink} aria-label="Voltar para a home">
        <svg className={styles.backIcon} viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
          <path
            fill="currentColor"
            d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"
          />
        </svg>
        <span>Voltar</span>
      </Link>

      <header className={styles.header}>
        <Link
          href={buildArticlesListUrl({ category: article.category.slug })}
          className={styles.category}
        >
          {article.category.name}
        </Link>

        <h1 className={styles.title}>{article.title}</h1>

        <div className={styles.meta}>
          <span>{article.author}</span>
          <time dateTime={article.publishedAt}>{formatPublishedAt(article.publishedAt)}</time>
        </div>

        {article.tags.length > 0 ? (
          <ul className={styles.tags} aria-label="Tags">
            {article.tags.map((tag) => (
              <li key={tag.slug}>
                <Link href={buildArticlesListUrl({ tag: tag.slug })} className={styles.tag}>
                  {tag.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <p className={styles.summary}>{article.summary}</p>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
