import type { SelectedSlot } from './hooks/types';
import styles from './BookingApp.module.scss';

type Props = {
  selected: SelectedSlot | null;
};

export default function BookingSelectionCard({ selected }: Props) {
  return (
    <div className={styles.selection} aria-live="polite">
      {selected ? (
        <div className={styles.selectionFilled}>
          <span className={styles.selectionLabel}>Вы выбрали</span>
          <p className={styles.selectionValue}>
            {selected.day.dateLabel}, {selected.slot.label}
          </p>
          <p className={styles.selectionPrice}>{selected.slot.priceLabel}</p>
        </div>
      ) : (
        <p className={styles.selectionEmpty}>
          Сначала выберите свободное время в расписании
        </p>
      )}
    </div>
  );
}
