import type { SelectedSlot } from './hooks/types';
import styles from './BookingApp.module.scss';

type Props = {
  selected: SelectedSlot | null;
};

export default function BookingSelectedSlotGrid({ selected }: Props) {
  return (
    <div
      className={[
        styles.selectedSlotBox,
        selected ? '' : styles.selectedSlotBoxEmpty,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {selected ? (
        <div className={styles.selectedSlotGrid}>
          <div className={styles.selectedSlotItem}>
            <span className={styles.selectedSlotCaption}>Дата</span>
            <p className={styles.selectedSlotText}>
              {selected.day.dateLabel}
              {selected.day.relativeLabel
                ? ` · ${selected.day.relativeLabel}`
                : ''}
            </p>
          </div>
          <div className={styles.selectedSlotItem}>
            <span className={styles.selectedSlotCaption}>Время</span>
            <p className={styles.selectedSlotText}>{selected.slot.label}</p>
          </div>
          <div className={styles.selectedSlotItem}>
            <span className={styles.selectedSlotCaption}>Цена</span>
            <p className={styles.selectedSlotText}>
              {selected.slot.priceLabel}
            </p>
          </div>
          <div className={styles.selectedSlotItem}>
            <span className={styles.selectedSlotCaption}>День</span>
            <p className={styles.selectedSlotText}>
              {selected.day.weekdayLabel}
            </p>
          </div>
        </div>
      ) : (
        <p className={styles.selectedSlotHint}>
          Дата и время появятся здесь после выбора слота
        </p>
      )}
    </div>
  );
}
