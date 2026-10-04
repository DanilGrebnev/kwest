import { queryOptions } from '@tanstack/react-query';
import { getQuest, getSlotSchedule } from '../bookingApi';
import { bookingKeys } from '../queryKeys';

export function questQueryOptions() {
  return queryOptions({
    queryKey: bookingKeys.quest(),
    queryFn: getQuest,
  });
}

export function slotScheduleQueryOptions(
  questId: number,
  fromDate: string,
  toDate: string,
) {
  return queryOptions({
    queryKey: bookingKeys.slots(questId, fromDate, toDate),
    queryFn: () =>
      getSlotSchedule({
        questId,
        fromDate,
        toDate,
      }),
  });
}
