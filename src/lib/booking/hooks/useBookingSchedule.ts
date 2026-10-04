import { useMemo } from 'react';
import { getDefaultSlotRange } from '../bookingApi';
import {
  buildPriceLegend,
  mapSlotScheduleToDays,
} from '../mapSlotsToDays';
import type { BookingDay, PriceLegendItem, Quest } from '../types';
import { getQueryErrorMessage } from './getQueryErrorMessage';
import { useQuestQuery } from './useQuestQuery';
import { useSlotScheduleQuery } from './useSlotScheduleQuery';

export type BookingScheduleResult = {
  quest: Quest | undefined;
  days: BookingDay[];
  priceLegend: PriceLegendItem[];
  playerOptions: number[];
  teamSizeLabel: string;
  extraPlayerLabel: string;
  ageLabel: string;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  refetchAll: () => void;
};

export function useBookingSchedule(): BookingScheduleResult {
  const slotRange = useMemo(() => getDefaultSlotRange(), []);
  const questQuery = useQuestQuery();
  const questId = questQuery.data?.id;

  const slotsQuery = useSlotScheduleQuery(
    questId,
    slotRange.fromDate,
    slotRange.toDate,
  );

  const days = useMemo(() => {
    if (!questQuery.data || !slotsQuery.data) return [];
    return mapSlotScheduleToDays(slotsQuery.data, questQuery.data);
  }, [questQuery.data, slotsQuery.data]);

  const priceLegend = useMemo(
    () => (questQuery.data ? buildPriceLegend(questQuery.data) : []),
    [questQuery.data],
  );

  const playerOptions = useMemo(() => {
    const min = questQuery.data?.min_players ?? 2;
    const max = questQuery.data?.max_players ?? 6;
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [questQuery.data]);

  const teamSizeLabel = questQuery.data
    ? `Цена для команды из ${questQuery.data.min_players}–${questQuery.data.standard_players ?? questQuery.data.max_players} человек`
    : 'Цена для команды';

  const extraPlayerLabel = questQuery.data
    ? `Доп. игрок — ${new Intl.NumberFormat('ru-RU').format(Number(questQuery.data.extra_player_price))} ₽`
    : '';

  const ageLabel = questQuery.data
    ? `${questQuery.data.age_rating} · строгий возрастной рейтинг`
    : '';

  return {
    quest: questQuery.data,
    days,
    priceLegend,
    playerOptions,
    teamSizeLabel,
    extraPlayerLabel,
    ageLabel,
    isLoading: questQuery.isPending || slotsQuery.isPending,
    isError: questQuery.isError || slotsQuery.isError,
    errorMessage: getQueryErrorMessage([questQuery.error, slotsQuery.error]),
    refetchAll: () => {
      void questQuery.refetch();
      void slotsQuery.refetch();
    },
  };
}
