import { bookingConfig, MOCK_QUEST_ID, shouldMock } from './config';
import {
  createBookingMock,
  getQuestMock,
  getSlotsMock,
} from './bookingApi.mock';
import { fetchJson } from './http';
import type {
  BookingCreatedResponse,
  CreateWebsiteBooking,
  Quest,
  SlotScheduleResponse,
} from './types';

function resolveQuestId(): number {
  return bookingConfig.questId ?? MOCK_QUEST_ID;
}

export async function getQuest(): Promise<Quest> {
  if (shouldMock()) return getQuestMock();

  if (bookingConfig.questId) {
    return fetchJson<Quest>(`/quests/${bookingConfig.questId}/`);
  }

  const list = await fetchJson<Quest[]>('/quests/');
  const found =
    list.find((q) => /гаснет\s+свет/i.test(q.title)) ?? list[0];
  if (!found) throw new Error('Квест не найден');
  return found;
}

export async function getSlotSchedule(params: {
  questId: number;
  fromDate?: string;
  toDate?: string;
}): Promise<SlotScheduleResponse> {
  if (shouldMock()) {
    return getSlotsMock(params.questId, params.fromDate, params.toDate);
  }

  const search = new URLSearchParams({
    quest_id: String(params.questId),
  });
  if (params.fromDate) search.set('from_date', params.fromDate);
  if (params.toDate) search.set('to_date', params.toDate);

  return fetchJson<SlotScheduleResponse>(`/slots/?${search.toString()}`);
}

export async function createBooking(
  body: CreateWebsiteBooking,
): Promise<BookingCreatedResponse> {
  // TODO: when backend is ready: if (!shouldMock()) return fetchJson POST /bookings/
  return createBookingMock(body);
}

export function getDefaultQuestId(): number {
  return resolveQuestId();
}

/** Default schedule window: today … +11 days (Moscow calendar keys). */
export function getDefaultSlotRange(): { fromDate: string; toDate: string } {
  const pad = (n: number) => String(n).padStart(2, '0');
  const today = new Date();
  const to = new Date(today);
  to.setDate(to.getDate() + 11);

  const key = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  return { fromDate: key(today), toDate: key(to) };
}
