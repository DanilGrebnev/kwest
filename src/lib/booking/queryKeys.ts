export const bookingKeys = {
  all: ['booking'] as const,
  quest: () => [...bookingKeys.all, 'quest'] as const,
  slots: (questId: number, from: string, to: string) =>
    [...bookingKeys.all, 'slots', questId, from, to] as const,
};
