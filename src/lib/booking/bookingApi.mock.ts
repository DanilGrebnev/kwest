import { MOCK_QUEST_ID } from './config';
import { generateMockSlots } from './mockSchedule';
import type {
  BookingCreatedResponse,
  CreateWebsiteBooking,
  Quest,
  SlotScheduleResponse,
} from './types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function randomDelay(min = 300, max = 600): Promise<void> {
  return delay(min + Math.floor(Math.random() * (max - min + 1)));
}

export async function getQuestMock(): Promise<Quest> {
  await randomDelay();
  return {
    id: MOCK_QUEST_ID,
    title: 'И гаснет свет',
    description:
      'Хоррор-перформанс в темноте: актёры, зеркала и час, который сложно забыть.',
    summary: '60 минут в полной темноте. 2–6 игроков. 18+.',
    min_players: 2,
    max_players: 6,
    standard_players: 4,
    base_price: '5000.00',
    extra_player_price: '1000.00',
    age_rating: '18+',
    duration_minutes: 60,
    difficulty: 3,
    scariness: 5,
    categories: ['horror', 'performance'],
    photo_urls: [],
    media: [],
    schedules: [],
  };
}

export async function getSlotsMock(
  questId: number,
  fromDate?: string,
  toDate?: string,
): Promise<SlotScheduleResponse> {
  await randomDelay();
  return generateMockSlots(questId, fromDate, toDate);
}

export async function createBookingMock(
  body: CreateWebsiteBooking,
): Promise<BookingCreatedResponse> {
  await delay(800);
  return {
    booking_id: Math.floor(1000 + Math.random() * 9000),
    session_id: Math.floor(100 + Math.random() * 900),
    player_count: body.player_count,
    starts_at: body.starts_at,
  };
}
