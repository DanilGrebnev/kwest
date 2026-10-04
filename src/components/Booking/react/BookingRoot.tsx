import BookingApp from './BookingApp';
import BookingProviders from './BookingProviders';

/** Single Astro island: QueryClientProvider + booking UI. */
export default function BookingRoot() {
  return (
    <BookingProviders>
      <BookingApp />
    </BookingProviders>
  );
}
