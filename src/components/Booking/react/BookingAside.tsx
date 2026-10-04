import { forwardRef, type FormEvent } from 'react';
import styles from './BookingApp.module.scss';
import BookingFormActions from './BookingFormActions';
import BookingFormFields from './BookingFormFields';
import BookingSelectedSlotGrid from './BookingSelectedSlotGrid';
import BookingSelectionCard from './BookingSelectionCard';
import type { BookingFormState, SelectedSlot } from './hooks/types';

type Props = {
  selected: SelectedSlot | null;
  formId: string;
  form: BookingFormState;
  playerOptions: number[];
  setField: <K extends keyof BookingFormState>(
    key: K,
    value: BookingFormState[K],
  ) => void;
  onSubmit: (event: FormEvent) => void;
  isPending: boolean;
  successMessage: string | null;
  mutationError: Error | null;
};

const BookingAside = forwardRef<HTMLElement, Props>(function BookingAside(
  {
    selected,
    formId,
    form,
    playerOptions,
    setField,
    onSubmit,
    isPending,
    successMessage,
    mutationError,
  },
  ref,
) {
  return (
    <aside className={styles.aside} ref={ref}>
      <p className={styles.asideTitle}>Ваша запись</p>

      <BookingSelectionCard selected={selected} />

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <BookingSelectedSlotGrid selected={selected} />

        <BookingFormFields
          formId={formId}
          form={form}
          playerOptions={playerOptions}
          setField={setField}
        />

        <input
          type="hidden"
          name="starts_at"
          value={selected?.slot.startsAt ?? ''}
        />

        <BookingFormActions
          canSubmit={Boolean(selected)}
          isPending={isPending}
          successMessage={successMessage}
          error={mutationError}
        />
      </form>
    </aside>
  );
});

export default BookingAside;
