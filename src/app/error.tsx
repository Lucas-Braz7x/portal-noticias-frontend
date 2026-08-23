'use client';

import { Container } from '@/components/layout/Container';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

import styles from './error.module.scss';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <Container>
      <ErrorMessage message={error.message || 'Não foi possível carregar a página.'} />
      <button type="button" onClick={reset} className={styles.retry}>
        Tentar novamente
      </button>
    </Container>
  );
}
