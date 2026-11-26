import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productKeys, type Product, type ProductsResponse } from '@/entities/product';
import { getProductById } from '../api/detail.api';

export const useProductQuery = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => getProductById(id),
    enabled: Number.isInteger(id) && id > 0,
    placeholderData: (): Product | undefined =>
      queryClient
        .getQueriesData<ProductsResponse>({ queryKey: productKeys.lists() })
        .flatMap(([, data]) => data?.products ?? [])
        .find((p) => p.id === id),
  });
};
