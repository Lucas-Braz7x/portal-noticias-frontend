import styles from './Spinner.module.scss';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Carregando...' }: SpinnerProps) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

export function SpinnerCentered({ label }: SpinnerProps) {
  return (
    <div className={styles.centered}>
      <Spinner label={label} />
    </div>
  );
}
