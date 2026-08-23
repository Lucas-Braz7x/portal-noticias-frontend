import styles from './ArticleFiltersSkeleton.module.scss';

export function ArticleFiltersSkeleton() {
  return (
    <div
      className={styles.filters}
      aria-busy="true"
      aria-label="Carregando filtros"
    >
      <div className={styles.field}>
        <div className={`${styles.skeleton} ${styles.label}`} />
        <div className={`${styles.skeleton} ${styles.input}`} />
      </div>
      <div className={styles.field}>
        <div className={`${styles.skeleton} ${styles.label}`} />
        <div className={`${styles.skeleton} ${styles.input}`} />
      </div>
      <div className={styles.field}>
        <div className={`${styles.skeleton} ${styles.label}`} />
        <div className={`${styles.skeleton} ${styles.input}`} />
      </div>
      <div className={styles.actions}>
        <div className={`${styles.skeleton} ${styles.button}`} />
      </div>
    </div>
  );
}
