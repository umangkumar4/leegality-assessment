import { apiClient } from '@/shared/lib/axios';
import type { ProductsResponse } from '@/entities/product';

export const getProducts = async (category: string | null): Promise<ProductsResponse> => {
  const url = category
    ? `/products/category/${encodeURIComponent(category)}`
    : '/products';
  const { data } = await apiClient.get<ProductsResponse>(url, { params: { limit: 0 } });
  return data;
};
