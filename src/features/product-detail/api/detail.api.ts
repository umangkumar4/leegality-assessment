import { apiClient } from '@/shared/lib/axios';
import type { Product } from '@/entities/product';

export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await apiClient.get<Product>(`/products/${id}`);
  return data;
};
