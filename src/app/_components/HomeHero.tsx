import styles from '../page.module.scss';

export function HomeHero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Portal de Notícias</h1>
      <p className={styles.subtitle}>
        Informação com contexto, do que acontece no Congresso às ruas do país.
        Um portal que acompanha o Brasil todos os dias, com a seriedade de quem
        leva notícia a sério.
      </p>
    </section>
  );
}
