import type { FormEvent, RefObject } from 'react';
import type { CreateWebsiteBooking, Quest } from '../../../../lib/booking/types';
import type { BookingFormState, SelectedSlot } from './types';

type Options = {
  selected: SelectedSlot | null;
  quest: Quest | undefined;
  form: BookingFormState;
  formRef: RefObject<HTMLElement | null>;
  mutate: (payload: CreateWebsiteBooking) => void;
};

export function useBookingSubmit({
  selected,
  quest,
  form,
  formRef,
  mutate,
}: Options) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selected || !quest) {
      formRef.current?.scrollIntoView({ block: 'center' });
      return;
    }

    mutate({
      quest_id: quest.id,
      starts_at: selected.slot.startsAt,
      player_count: form.playerCount,
      first_name: form.firstName,
      last_name: form.lastName,
      phone: form.phone,
      email: form.email,
    });
  };

  return { handleSubmit };
}
