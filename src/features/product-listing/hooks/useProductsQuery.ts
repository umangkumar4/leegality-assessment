import { useQueries, useQueryClient } from '@tanstack/react-query';
import { productKeys, type Product, type ProductsResponse } from '@/entities/product';
import { getProducts } from '../api/listing.api';

export const useProductsQuery = (categories: string[], { enabled = true } = {}) => {
  const queryClient = useQueryClient();
  const keys: (string | null)[] = categories.length ? categories : [null];

  const placeholderFor =
    (category: string | null) => (): ProductsResponse | undefined => {
      if (category === null) return undefined;
      const all = queryClient.getQueryData<ProductsResponse>(productKeys.list(null));
      if (!all) return undefined;
      const products = all.products.filter((p) => p.category === category);
      return { products, total: products.length, skip: 0, limit: 0 };
    };

  return useQueries({
    queries: keys.map((category) => ({
      queryKey: productKeys.list(category),
      queryFn: () => getProducts(category),
      placeholderData: placeholderFor(category),
      enabled,
    })),
    combine: (results) => {
      const seen = new Set<number>();
      const products: Product[] = [];
      for (const result of results) {
        for (const product of result.data?.products ?? []) {
          if (!seen.has(product.id)) {
            seen.add(product.id);
            products.push(product);
          }
        }
      }
      products.sort((a, b) => a.id - b.id);

      const failed = results.find((r) => r.isError);
      return {
        data: products,
        isPending: results.some((r) => r.isPending),
        isError: Boolean(failed),
        error: failed?.error ?? null,
        isPlaceholderData: results.some((r) => r.isPlaceholderData),
        refetch: () =>
          Promise.all(results.filter((r) => r.isError).map((r) => r.refetch())),
      };
    },
  });
};
