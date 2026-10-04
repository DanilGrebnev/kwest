import type { BookingDay, BookingSlot } from '../../../lib/booking/types';
import styles from './BookingApp.module.scss';

type Props = {
  day: BookingDay;
  slot: BookingSlot;
  selected: boolean;
  onSelect: (day: BookingDay, slot: BookingSlot) => void;
};

export default function SlotButton({ day, slot, selected, onSelect }: Props) {
  const tierClass =
    slot.tier === 'peak'
      ? styles.slotPeak
      : slot.tier === 'standard'
        ? styles.slotStandard
        : styles.slotUnavailable;

  const ariaLabel = slot.bookable
    ? `${slot.label}, ${day.dateLabel}, ${slot.priceLabel}`
    : `${slot.label}, ${day.dateLabel}, занято`;

  return (
    <button
      type="button"
      className={[
        styles.slot,
        tierClass,
        selected ? styles.slotSelected : '',
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={!slot.bookable}
      aria-pressed={selected}
      aria-label={ariaLabel}
      onClick={() => onSelect(day, slot)}
    >
      {slot.label}
    </button>
  );
}
