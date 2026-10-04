/** OpenAPI-shaped types for public booking API. */

export type PublicSlotStatus = 'свободно' | 'занято';

export type PublicSlot = {
  starts_at: string;
  ends_at: string;
  session_id: number | null;
  status: PublicSlotStatus;
  bookable: boolean;
};

export type SlotScheduleResponse = {
  quest_id: number;
  from_date: string;
  to_date: string;
  slots: PublicSlot[];
};

export type Quest = {
  id: number;
  title: string;
  description: string;
  summary: string;
  min_players: number;
  max_players: number;
  standard_players: number | null;
  base_price: string;
  extra_player_price: string;
  age_rating: string;
  duration_minutes: number;
  difficulty: number;
  scariness: number;
  categories: string[];
  photo_urls: string[];
  media: unknown[];
  schedules: unknown[];
};

export type CreateWebsiteBooking = {
  quest_id: number;
  starts_at: string;
  player_count: number;
  first_name: string;
  last_name?: string;
  phone: string;
  email: string;
  min_player_age?: number | null;
};

export type BookingCreatedResponse = {
  booking_id: number;
  session_id: number;
  player_count: number;
  starts_at: string;
};

/** UI models after mapping slots → day grid. */

export type PriceTier = 'standard' | 'peak' | 'unavailable';

export type BookingSlot = {
  id: string;
  startsAt: string;
  label: string;
  tier: PriceTier;
  bookable: boolean;
  priceLabel: string;
};

export type BookingDay = {
  date: string;
  weekdayLabel: string;
  dateLabel: string;
  relativeLabel?: string;
  slots: BookingSlot[];
};

export type PriceLegendItem = {
  tier: Exclude<PriceTier, 'unavailable'>;
  priceLabel: string;
};
