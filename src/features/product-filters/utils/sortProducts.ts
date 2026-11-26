import type { Product } from '@/entities/product';

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Rating' },
  { value: 'discount', label: 'Biggest Discount' },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]['value'];

export const DEFAULT_SORT: SortOption = 'featured';

export const isSortOption = (value: string | null): value is SortOption =>
  SORT_OPTIONS.some((o) => o.value === value);

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  if (sort === 'featured') return products;
  const compare: Record<
    Exclude<SortOption, 'featured'>,
    (a: Product, b: Product) => number
  > = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    discount: (a, b) => b.discountPercentage - a.discountPercentage,
  };
  return [...products].sort((a, b) => compare[sort](a, b) || a.id - b.id);
}
