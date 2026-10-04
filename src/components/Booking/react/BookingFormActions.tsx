import { ApiError } from '../../../lib/booking/http';
import styles from './BookingApp.module.scss';

type Props = {
  canSubmit: boolean;
  isPending: boolean;
  successMessage: string | null;
  error: Error | null;
};

export default function BookingFormActions({
  canSubmit,
  isPending,
  successMessage,
  error,
}: Props) {
  return (
    <div className={styles.actions}>
      <button
        type="submit"
        className={styles.submit}
        disabled={!canSubmit || isPending}
      >
        {isPending ? 'Отправляем…' : 'Подтвердить запись'}
      </button>
      {successMessage ? (
        <p className={styles.message} role="status">
          {successMessage}
        </p>
      ) : null}
      {error ? (
        <p className={styles.errorText} role="alert">
          {error instanceof ApiError ? error.detail : 'Не удалось создать бронь'}
        </p>
      ) : null}
    </div>
  );
}
