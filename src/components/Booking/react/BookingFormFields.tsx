import type { BookingFormState } from './hooks/types';
import styles from './BookingApp.module.scss';

type Props = {
  formId: string;
  form: BookingFormState;
  playerOptions: number[];
  setField: <K extends keyof BookingFormState>(
    key: K,
    value: BookingFormState[K],
  ) => void;
};

export default function BookingFormFields({
  formId,
  form,
  playerOptions,
  setField,
}: Props) {
  return (
    <fieldset className={styles.fieldset}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-first-name`}>
          Имя
        </label>
        <input
          className={styles.input}
          id={`${formId}-first-name`}
          name="first_name"
          type="text"
          autoComplete="given-name"
          maxLength={100}
          required
          value={form.firstName}
          onChange={(e) => setField('firstName', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-last-name`}>
          Фамилия
        </label>
        <input
          className={styles.input}
          id={`${formId}-last-name`}
          name="last_name"
          type="text"
          autoComplete="family-name"
          maxLength={100}
          value={form.lastName}
          onChange={(e) => setField('lastName', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-phone`}>
          Телефон
        </label>
        <input
          className={styles.input}
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="+7 (___) ___-__-__"
          maxLength={32}
          required
          value={form.phone}
          onChange={(e) => setField('phone', e.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={`${formId}-email`}>
          Email
        </label>
        <input
          className={styles.input}
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
        />
      </div>

      <div className={`${styles.field} ${styles.fieldFull}`}>
        <label className={styles.label} htmlFor={`${formId}-players`}>
          Число игроков
        </label>
        <select
          className={styles.select}
          id={`${formId}-players`}
          name="player_count"
          required
          value={form.playerCount}
          onChange={(e) => setField('playerCount', Number(e.target.value))}
        >
          {playerOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  );
}
