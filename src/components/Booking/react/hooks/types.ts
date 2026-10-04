import type { BookingDay, BookingSlot } from '../../../../lib/booking/types';

export type SelectedSlot = {
  day: BookingDay;
  slot: BookingSlot;
};

export type BookingFormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  playerCount: number;
};
