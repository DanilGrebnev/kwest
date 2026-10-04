import type { PriceLegendItem } from '../../../lib/booking/types';
import { BOOKING_HINT } from './hooks/constants';
import styles from './BookingApp.module.scss';

type Props = {
  priceLegend: PriceLegendItem[];
  teamSizeLabel: string;
  extraPlayerLabel: string;
  ageLabel: string;
  showMeta: boolean;
};

export default function BookingLegend({
  priceLegend,
  teamSizeLabel,
  extraPlayerLabel,
  ageLabel,
  showMeta,
}: Props) {
  return (
    <div className={styles.legend}>
      {priceLegend.length > 0 ? (
        <div className={styles.chips}>
          {priceLegend.map((item) => (
            <span
              key={item.tier}
              className={[
                styles.chip,
                item.tier === 'peak' ? styles.chipPeak : styles.chipStandard,
              ].join(' ')}
            >
              {item.priceLabel}
            </span>
          ))}
          <span className={styles.teamNote}>{teamSizeLabel}</span>
        </div>
      ) : null}
      {showMeta ? (
        <div className={styles.meta}>
          <span>{extraPlayerLabel}</span>
          <span>{ageLabel}</span>
        </div>
      ) : null}
      <p className={styles.hint}>
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 9h18M8 3v4M16 3v4" />
        </svg>
        <span>{BOOKING_HINT}</span>
      </p>
    </div>
  );
}
