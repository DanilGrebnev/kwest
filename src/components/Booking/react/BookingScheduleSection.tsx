import type { BookingDay, BookingSlot } from '../../../lib/booking/types';
import styles from './BookingApp.module.scss';
import BookingDayRow from './BookingDayRow';

type Props = {
  days: BookingDay[];
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  selectedSlotId: string | undefined;
  onSelect: (day: BookingDay, slot: BookingSlot) => void;
  onRetry: () => void;
};

export default function BookingScheduleSection({
  days,
  isLoading,
  isError,
  errorMessage,
  selectedSlotId,
  onSelect,
  onRetry,
}: Props) {
  return (
    <section className={styles.schedule} aria-labelledby="schedule-title">
      <h2 id="schedule-title" className={styles.srOnly}>
        Расписание слотов
      </h2>

      {isLoading ? (
        <p className={styles.statusBlock} role="status">
          Загружаем расписание…
        </p>
      ) : null}

      {isError ? (
        <div className={styles.errorBlock} role="alert">
          <p>{errorMessage}</p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={onRetry}
          >
            Повторить
          </button>
        </div>
      ) : null}

      {!isLoading && !isError ? (
        <div className={styles.dayList}>
          {days.map((day) => (
            <BookingDayRow
              key={day.date}
              day={day}
              selectedSlotId={selectedSlotId}
              onSelect={onSelect}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
