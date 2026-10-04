import type {
  BookingDay,
  BookingSlot,
  PriceLegendItem,
  PriceTier,
  PublicSlot,
  Quest,
  SlotScheduleResponse,
} from './types';

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const;
const MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
] as const;

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Parse ISO datetime; prefer +03:00 calendar date for Moscow. */
function getDateParts(iso: string): {
  dateKey: string;
  hour: number;
  minute: number;
  label: string;
} {
  const match = iso.match(
    /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2})/,
  );
  if (match) {
    const [, dateKey, hh, mm] = match;
    return {
      dateKey,
      hour: Number(hh),
      minute: Number(mm),
      label: `${hh}:${mm}`,
    };
  }

  const d = new Date(iso);
  return {
    dateKey: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    hour: d.getHours(),
    minute: d.getMinutes(),
    label: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
  };
}

function formatPrice(value: string): string {
  const n = Number(value);
  if (Number.isNaN(n)) return value;
  return `${new Intl.NumberFormat('ru-RU').format(n)} ₽`;
}

function relativeLabelForDate(dateKey: string, todayKey: string): string | undefined {
  const parse = (key: string) => {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d).getTime();
  };
  const diffDays = Math.round((parse(dateKey) - parse(todayKey)) / 86_400_000);
  if (diffDays === 0) return 'Сегодня';
  if (diffDays === 1) return 'Завтра';
  if (diffDays === 2) return 'Послезавтра';
  return undefined;
}

/**
 * Heuristic price tier until API exposes per-slot pricing.
 * TODO: replace with backend price when available on PublicSlot.
 */
function resolveTier(
  slot: PublicSlot,
  hour: number,
  dateKey: string,
): PriceTier {
  if (!slot.bookable || slot.status === 'занято') return 'unavailable';

  const [y, m, d] = dateKey.split('-').map(Number);
  const weekday = new Date(y, m - 1, d).getDay();
  const isWeekend = weekday === 0 || weekday === 6;
  const isEvening = hour >= 18;
  return isWeekend || isEvening ? 'peak' : 'standard';
}

function priceForTier(tier: PriceTier, quest: Quest): string {
  if (tier === 'unavailable') return '—';
  const base = Number(quest.base_price);
  const extra = Number(quest.extra_player_price) || 0;
  if (tier === 'peak') {
    return formatPrice(String(base + extra * 1.5));
  }
  return formatPrice(quest.base_price);
}

export function buildPriceLegend(quest: Quest): PriceLegendItem[] {
  const base = Number(quest.base_price);
  const extra = Number(quest.extra_player_price) || 0;
  return [
    { tier: 'standard', priceLabel: formatPrice(quest.base_price) },
    {
      tier: 'peak',
      priceLabel: formatPrice(String(base + extra * 1.5)),
    },
  ];
}

export function mapSlotScheduleToDays(
  schedule: SlotScheduleResponse,
  quest: Quest,
): BookingDay[] {
  const today = new Date();
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

  const byDate = new Map<string, BookingSlot[]>();

  for (const slot of schedule.slots) {
    const { dateKey, hour, label } = getDateParts(slot.starts_at);
    const tier = resolveTier(slot, hour, dateKey);
    const bookingSlot: BookingSlot = {
      id: `${dateKey}-${label}`,
      startsAt: slot.starts_at,
      label,
      tier,
      bookable: slot.bookable && slot.status === 'свободно',
      priceLabel: priceForTier(tier, quest),
    };

    const list = byDate.get(dateKey) ?? [];
    list.push(bookingSlot);
    byDate.set(dateKey, list);
  }

  const days: BookingDay[] = [];

  for (const [dateKey, slots] of [...byDate.entries()].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    const [y, m, d] = dateKey.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    days.push({
      date: dateKey,
      weekdayLabel: WEEKDAYS[date.getDay()],
      dateLabel: `${date.getDate()} ${MONTHS[date.getMonth()]}`,
      relativeLabel: relativeLabelForDate(dateKey, todayKey),
      slots: slots.sort((a, b) => a.label.localeCompare(b.label)),
    });
  }

  return days;
}
