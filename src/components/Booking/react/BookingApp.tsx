import { useId, useRef, useState } from 'react';
import {
  useBookingSchedule,
  useCreateBookingMutation,
} from '../../../lib/booking/hooks';
import type { BookingDay, BookingSlot } from '../../../lib/booking/types';
import styles from './BookingApp.module.scss';
import BookingAside from './BookingAside';
import BookingIntro from './BookingIntro';
import BookingLegend from './BookingLegend';
import BookingScheduleSection from './BookingScheduleSection';
import {
  useBookingForm,
  useBookingSubmit,
  useSlotSelection,
} from './hooks';

export default function BookingApp() {
  const formId = useId();
  const formRef = useRef<HTMLElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const schedule = useBookingSchedule();
  const { form, setField, reset } = useBookingForm(schedule.quest);
  const { selected, select, clear } = useSlotSelection({ formRef });

  const bookingMutation = useCreateBookingMutation({
    onSuccess: (data) => {
      setSuccessMessage(
        `Заявка принята (mock). Номер брони: ${data.booking_id}`,
      );
      clear();
      reset(schedule.quest?.min_players ?? 2);
    },
  });

  const handleSelect = (day: BookingDay, slot: BookingSlot) => {
    setSuccessMessage(null);
    bookingMutation.reset();
    select(day, slot);
  };

  const { handleSubmit } = useBookingSubmit({
    selected,
    quest: schedule.quest,
    form,
    formRef,
    mutate: bookingMutation.mutate,
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.intro}>
          <BookingIntro />
          <BookingLegend
            priceLegend={schedule.priceLegend}
            teamSizeLabel={schedule.teamSizeLabel}
            extraPlayerLabel={schedule.extraPlayerLabel}
            ageLabel={schedule.ageLabel}
            showMeta={Boolean(schedule.quest)}
          />
        </header>

        <div className={styles.layout}>
          <BookingScheduleSection
            days={schedule.days}
            isLoading={schedule.isLoading}
            isError={schedule.isError}
            errorMessage={schedule.errorMessage}
            selectedSlotId={selected?.slot.id}
            onSelect={handleSelect}
            onRetry={schedule.refetchAll}
          />

          <BookingAside
            ref={formRef}
            selected={selected}
            formId={formId}
            form={form}
            playerOptions={schedule.playerOptions}
            setField={setField}
            onSubmit={handleSubmit}
            isPending={bookingMutation.isPending}
            successMessage={successMessage}
            mutationError={
              bookingMutation.isError ? bookingMutation.error : null
            }
          />
        </div>
      </div>
    </div>
  );
}
