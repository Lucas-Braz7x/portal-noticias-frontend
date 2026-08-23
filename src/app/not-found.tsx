import Link from 'next/link';

import { Container } from '@/components/layout/Container';
import { EmptyState } from '@/components/ui/EmptyState';

import styles from '@/components/ui/EmptyState.module.scss';

export default function NotFound() {
  return (
    <Container>
      <EmptyState
        title="Página não encontrada"
        description="O endereço acessado não existe ou foi movido."
        action={
          <Link href="/" className={styles.actionLink}>
            Voltar para a listagem
          </Link>
        }
      />
    </Container>
  );
}
