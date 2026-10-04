import { useQuery } from '@tanstack/react-query';
import { slotScheduleQueryOptions } from './queryOptions';

export function useSlotScheduleQuery(
  questId: number | undefined,
  fromDate: string,
  toDate: string,
) {
  return useQuery({
    ...slotScheduleQueryOptions(questId ?? 0, fromDate, toDate),
    enabled: typeof questId === 'number',
  });
}
