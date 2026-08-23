import type { ArticleSummary } from '@/types/article';

import { ArticleCard } from './ArticleCard';
import styles from './ArticleList.module.scss';

interface ArticleListProps {
  articles: ArticleSummary[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <ul className={styles.list}>
      {articles.map((article) => (
        <li key={article.slug} className={styles.item}>
          <ArticleCard article={article} />
        </li>
      ))}
    </ul>
  );
}
