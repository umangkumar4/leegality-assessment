import { useQuery } from '@tanstack/react-query';
import { productKeys } from '@/entities/product';
import { getCategories } from '../api/categories.api';

export const useCategoriesQuery = () =>
  useQuery({
    queryKey: productKeys.categories(),
    queryFn: getCategories,
    staleTime: Infinity,
  });
