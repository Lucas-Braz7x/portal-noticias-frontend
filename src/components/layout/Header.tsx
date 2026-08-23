import Link from 'next/link';

import { ThemeToggle } from './ThemeToggle';
import { Container } from './Container';
import styles from './Header.module.scss';

export function Header() {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand}>
            Portal de Notícias
          </Link>
          <div className={styles.actions}>
            <nav aria-label="Principal">
              <Link href="/" className={styles.navLink}>
                Artigos
              </Link>
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
