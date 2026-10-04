import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { createBooking } from '../bookingApi';
import { bookingKeys } from '../queryKeys';
import type { BookingCreatedResponse, CreateWebsiteBooking } from '../types';

type Options = Omit<
  UseMutationOptions<BookingCreatedResponse, Error, CreateWebsiteBooking>,
  'mutationFn'
>;

export function useCreateBookingMutation(options?: Options) {
  const queryClient = useQueryClient();
  const { onSuccess, ...rest } = options ?? {};

  return useMutation({
    mutationFn: createBooking,
    ...rest,
    onSuccess: (data, variables, onMutateResult, context) => {
      void queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}
