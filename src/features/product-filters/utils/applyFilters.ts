import type { Product } from '@/entities/product';
import type { ProductFilters } from '../types';

export function applyFilters(products: Product[], filters: ProductFilters): Product[] {
  const { query, categories, minPrice, maxPrice, brands } = filters;
  const categorySet = new Set(categories);
  const brandSet = new Set(brands);
  const needle = query.trim().toLowerCase();

  return products.filter((product) => {
    if (categorySet.size > 0 && !categorySet.has(product.category)) return false;
    if (minPrice !== null && product.price < minPrice) return false;
    if (maxPrice !== null && product.price > maxPrice) return false;
    if (brandSet.size > 0 && (!product.brand || !brandSet.has(product.brand)))
      return false;
    if (
      needle &&
      !product.title.toLowerCase().includes(needle) &&
      !product.brand?.toLowerCase().includes(needle)
    ) {
      return false;
    }
    return true;
  });
}
