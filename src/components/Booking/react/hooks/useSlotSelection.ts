import { useState, type RefObject } from 'react';
import type { BookingDay, BookingSlot } from '../../../../lib/booking/types';
import type { SelectedSlot } from './types';

type Options = {
  formRef: RefObject<HTMLElement | null>;
  onSelectExtra?: () => void;
};

export function useSlotSelection({ formRef, onSelectExtra }: Options) {
  const [selected, setSelected] = useState<SelectedSlot | null>(null);

  const select = (day: BookingDay, slot: BookingSlot) => {
    if (!slot.bookable) return;
    setSelected({ day, slot });
    onSelectExtra?.();

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (window.matchMedia('(max-width: 1023px)').matches && formRef.current) {
      formRef.current.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      });
    }
  };

  const clear = () => setSelected(null);

  return { selected, select, clear };
}
