import { useQuery } from '@tanstack/react-query';
import { questQueryOptions } from './queryOptions';

export function useQuestQuery() {
  return useQuery(questQueryOptions());
}
