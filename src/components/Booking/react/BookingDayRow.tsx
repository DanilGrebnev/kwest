import type { BookingDay, BookingSlot } from '../../../lib/booking/types';
import styles from './BookingApp.module.scss';
import SlotButton from './SlotButton';

type Props = {
  day: BookingDay;
  selectedSlotId: string | undefined;
  onSelect: (day: BookingDay, slot: BookingSlot) => void;
};

export default function BookingDayRow({
  day,
  selectedSlotId,
  onSelect,
}: Props) {
  return (
    <div className={styles.dayRow}>
      <div className={styles.dateCol}>
        <p className={styles.dateMain}>{day.dateLabel}</p>
        <p className={styles.dateMeta}>
          <span>{day.weekdayLabel}</span>
          {day.relativeLabel ? (
            <span className={styles.relative}>{day.relativeLabel}</span>
          ) : null}
        </p>
      </div>
      <div
        className={styles.slots}
        role="group"
        aria-label={`Слоты на ${day.dateLabel}`}
      >
        {day.slots.map((slot) => (
          <SlotButton
            key={slot.id}
            day={day}
            slot={slot}
            selected={selectedSlotId === slot.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
