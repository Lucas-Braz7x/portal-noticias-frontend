import styles from './ArticleListSkeleton.module.scss';

const PLACEHOLDER_COUNT = 3;

export function ArticleListSkeleton() {
  return (
    <ul
      className={styles.list}
      aria-busy="true"
      aria-label="Carregando artigos"
    >
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <li key={index} className={styles.item}>
          <div className={styles.card}>
            <div className={`${styles.skeleton} ${styles.meta}`} />
            <div className={`${styles.skeleton} ${styles.title}`} />
            <div className={`${styles.skeleton} ${styles.summary}`} />
            <div className={`${styles.skeleton} ${styles.footer}`} />
          </div>
        </li>
      ))}
    </ul>
  );
}
