import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { productKeys } from '@/entities/product';
import { getProductById } from '../api/detail.api';

export function usePrefetchProduct() {
  const queryClient = useQueryClient();
  return useCallback(
    (id: number) =>
      queryClient.prefetchQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => getProductById(id),
      }),
    [queryClient]
  );
}
