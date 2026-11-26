import type { Product } from './types';

export function getOriginalPrice(
  price: number,
  discountPercentage: number
): number | null {
  if (!discountPercentage || discountPercentage <= 0 || discountPercentage >= 100)
    return null;
  return Math.round((price / (1 - discountPercentage / 100)) * 100) / 100;
}

export type StockTone = 'success' | 'warning' | 'danger';

export function getStockStatus(product: Pick<Product, 'stock' | 'availabilityStatus'>): {
  label: string;
  tone: StockTone;
} {
  if (product.stock <= 0 || product.availabilityStatus === 'Out of Stock') {
    return { label: 'Out of stock', tone: 'danger' };
  }
  if (product.stock < 10 || product.availabilityStatus === 'Low Stock') {
    return { label: `Only ${product.stock} left`, tone: 'warning' };
  }
  return { label: 'In stock', tone: 'success' };
}
