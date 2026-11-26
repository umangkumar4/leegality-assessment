import type { Product } from '@/entities/product';
import { isSortOption, sortProducts } from './sortProducts';

const make = (id: number, price: number, rating: number, discountPercentage = 0) =>
  ({ id, price, rating, discountPercentage }) as Product;

const list = [make(1, 30, 4.1, 5), make(2, 10, 4.8, 15), make(3, 20, 4.8, 1)];
const ids = (p: Product[]) => p.map((x) => x.id);

describe('sortProducts', () => {
  it('keeps the API order for "featured"', () => {
    expect(ids(sortProducts(list, 'featured'))).toEqual([1, 2, 3]);
  });

  it('sorts by price both ways', () => {
    expect(ids(sortProducts(list, 'price-asc'))).toEqual([2, 3, 1]);
    expect(ids(sortProducts(list, 'price-desc'))).toEqual([1, 3, 2]);
  });

  it('sorts by rating with a stable tie-break on id', () => {
    expect(ids(sortProducts(list, 'rating'))).toEqual([2, 3, 1]);
  });

  it('sorts by biggest discount', () => {
    expect(ids(sortProducts(list, 'discount'))).toEqual([2, 1, 3]);
  });

  it('does not mutate the input', () => {
    sortProducts(list, 'price-asc');
    expect(ids(list)).toEqual([1, 2, 3]);
  });

  it('validates URL values', () => {
    expect(isSortOption('rating')).toBe(true);
    expect(isSortOption('cheapest')).toBe(false);
    expect(isSortOption(null)).toBe(false);
  });
});
