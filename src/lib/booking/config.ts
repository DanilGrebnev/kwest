function env(name: string): string | undefined {
  const value = import.meta.env[name];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

export const bookingConfig = {
  apiBaseUrl: env('PUBLIC_API_BASE_URL')?.replace(/\/$/, ''),
  questId: Number(env('PUBLIC_QUEST_ID') ?? '') || undefined,
  /** Force mock when 'true'; force real when 'false'. Default: mock if no base URL. */
  mockFlag: env('PUBLIC_API_MOCK'),
};

/** Mock by default unless PUBLIC_API_MOCK=false and PUBLIC_API_BASE_URL is set. */
export function shouldMock(): boolean {
  if (bookingConfig.mockFlag === 'false') {
    return !bookingConfig.apiBaseUrl;
  }
  if (bookingConfig.mockFlag === 'true') return true;
  return !bookingConfig.apiBaseUrl;
}

export const MOCK_QUEST_ID = 1;
