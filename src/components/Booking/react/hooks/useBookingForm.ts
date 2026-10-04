import { useEffect, useState } from 'react';
import type { Quest } from '../../../../lib/booking/types';
import type { BookingFormState } from './types';

const INITIAL_FORM: BookingFormState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  playerCount: 2,
};

export function useBookingForm(quest: Quest | undefined) {
  const [form, setForm] = useState<BookingFormState>(INITIAL_FORM);

  useEffect(() => {
    if (!quest) return;
    const { min_players: min, max_players: max } = quest;
    setForm((prev) => {
      if (prev.playerCount >= min && prev.playerCount <= max) return prev;
      return { ...prev, playerCount: min };
    });
  }, [quest]);

  const setField = <K extends keyof BookingFormState>(
    key: K,
    value: BookingFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const reset = (defaultPlayerCount = 2) => {
    setForm({
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      playerCount: defaultPlayerCount,
    });
  };

  return { form, setField, reset };
}
