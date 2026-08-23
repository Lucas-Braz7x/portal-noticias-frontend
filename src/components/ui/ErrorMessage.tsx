import styles from './ErrorMessage.module.scss';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({
  title = 'Algo deu errado',
  message,
}: ErrorMessageProps) {
  return (
    <div className={styles.error} role="alert">
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
    </div>
  );
}
