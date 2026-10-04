/**
 * Generates OpenAPI-shaped slot schedule for mock API.
 * Not imported by UI — only by bookingApi.mock.
 */

import type { PublicSlot, SlotScheduleResponse } from './types';

const SLOT_HOURS = [10, 12, 14, 16, 18, 20, 21, 22] as const;

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

function buildSlot(
  date: Date,
  hour: number,
  dayIndex: number,
  slotIndex: number,
): PublicSlot {
  const minutes = hour === 21 ? 30 : 0;
  const label = `${pad(hour)}:${pad(minutes)}`;
  const dateKey = toDateKey(date);
  const starts_at = `${dateKey}T${label}:00+03:00`;

  const endHour = hour + 1;
  const ends_at = `${dateKey}T${pad(endHour)}:${pad(minutes)}:00+03:00`;

  const unavailable =
    (dayIndex + slotIndex) % 5 === 0 || (dayIndex === 0 && hour < 14);

  return {
    starts_at,
    ends_at,
    session_id: unavailable ? dayIndex * 100 + slotIndex : null,
    status: unavailable ? 'занято' : 'свободно',
    bookable: !unavailable,
  };
}

export function generateMockSlots(
  questId: number,
  fromDate?: string,
  toDate?: string,
): SlotScheduleResponse {
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  const from = fromDate ? parseDateKey(fromDate) : today;
  const to = toDate ? parseDateKey(toDate) : addDays(today, 11);

  const slots: PublicSlot[] = [];
  let dayIndex = 0;

  for (
    let cursor = new Date(from);
    cursor <= to;
    cursor = addDays(cursor, 1), dayIndex += 1
  ) {
    const hours =
      dayIndex % 3 === 0
        ? SLOT_HOURS.filter((_, i) => i % 2 === 0)
        : [...SLOT_HOURS];

    hours.forEach((hour, slotIndex) => {
      slots.push(buildSlot(cursor, hour, dayIndex, slotIndex));
    });
  }

  return {
    quest_id: questId,
    from_date: toDateKey(from),
    to_date: toDateKey(to),
    slots,
  };
}
