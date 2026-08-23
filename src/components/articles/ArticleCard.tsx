import Link from 'next/link';

import { formatPublishedAt } from '@/lib/utils/format-date';
import { buildArticlesListUrl } from '@/lib/utils/list-params';
import {
  ARTICLE_SUMMARY_MAX_LENGTH,
  truncateText,
} from '@/lib/utils/truncate-text';
import type { ArticleSummary } from '@/types/article';

import styles from './ArticleCard.module.scss';

interface ArticleCardProps {
  article: ArticleSummary;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const summary = truncateText(article.summary, ARTICLE_SUMMARY_MAX_LENGTH);

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <Link
          href={buildArticlesListUrl({ category: article.category.slug })}
          className={styles.category}
        >
          {article.category.name}
        </Link>
        <time className={styles.date} dateTime={article.publishedAt}>
          {formatPublishedAt(article.publishedAt)}
        </time>
      </header>

      <h2 className={styles.title}>
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>

      <p className={styles.summary}>{summary}</p>

      <footer className={styles.footer}>
        <span className={styles.author}>{article.author}</span>

        <div className={styles.footerRow}>
          {article.tags.length > 0 ? (
            <ul className={styles.tags} aria-label="Tags">
              {article.tags.map((tag) => (
                <li key={tag.slug}>
                  <Link
                    href={buildArticlesListUrl({ tag: tag.slug })}
                    className={styles.tag}
                  >
                    {tag.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <span className={styles.tagsPlaceholder} />
          )}

          <Link href={`/articles/${article.slug}`} className={styles.readMore}>
            Ver mais
          </Link>
        </div>
      </footer>
    </article>
  );
}
