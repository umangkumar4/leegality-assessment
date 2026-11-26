import { QueryClient } from '@tanstack/react-query';
import { ApiError } from '@/shared/lib/axios';
import { STALE_TIME_MS } from '@/shared/config/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status && error.status < 500) return false;
        return failureCount < 2;
      },
    },
  },
});
