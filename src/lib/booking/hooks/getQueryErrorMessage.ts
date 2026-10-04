import { ApiError } from '../http';

export function getQueryErrorMessage(
  errors: unknown[],
  fallback = 'Не удалось загрузить расписание',
): string {
  for (const error of errors) {
    if (error instanceof ApiError && error.detail) return error.detail;
  }
  for (const error of errors) {
    if (error instanceof Error && error.message) return error.message;
  }
  return fallback;
}
