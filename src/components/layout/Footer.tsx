import { Container } from './Container';
import styles from './Footer.module.scss';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <p className={styles.text}>© {year} Portal de Notícias — Desafio técnico Gazeta do Povo</p>
      </Container>
    </footer>
  );
}
