import type { Product } from '@/entities/product';

export function extractBrands(products: Product[]): string[] {
  const brands = new Set<string>();
  for (const product of products) {
    if (product.brand) brands.add(product.brand);
  }
  return [...brands].sort((a, b) => a.localeCompare(b));
}
