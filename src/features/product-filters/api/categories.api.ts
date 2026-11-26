import { apiClient } from '@/shared/lib/axios';
import type { Category } from '@/entities/product';

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await apiClient.get<Category[]>('/products/categories');
  return data;
};
