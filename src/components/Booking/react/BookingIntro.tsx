import styles from './BookingApp.module.scss';

export default function BookingIntro() {
  return (
    <div>
      <p className={styles.eyebrow}>Бронирование</p>
      <h1 className={styles.title} id="booking-page-title">
        Запись на игру
      </h1>
      <p className={styles.lead}>
        Выберите дату и время — и зайдите в дом, где отражения живут своей
        жизнью. Мест немного, темнота не любит толпу.
      </p>
    </div>
  );
}
