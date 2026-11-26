import type { Product } from '@/entities/product';
import type { ProductFilters } from '../types';
import { applyFilters } from './applyFilters';
import { extractBrands } from './extractBrands';
import { validatePriceRange } from './priceRange';

const make = (overrides: Partial<Product>): Product => ({
  id: 1,
  title: 'Item',
  description: '',
  category: 'beauty',
  price: 10,
  discountPercentage: 0,
  rating: 4,
  stock: 1,
  thumbnail: '',
  images: [],
  ...overrides,
});

const products = [
  make({ id: 1, title: 'MacBook Pro', category: 'laptops', brand: 'Apple', price: 1999 }),
  make({ id: 2, title: 'Zenbook', category: 'laptops', brand: 'Asus', price: 999 }),
  make({
    id: 3,
    title: 'iPhone 13',
    category: 'smartphones',
    brand: 'Apple',
    price: 799,
  }),
  make({ id: 4, title: 'Apple juice', category: 'groceries', price: 2 }),
];

const none: ProductFilters = {
  query: '',
  categories: [],
  minPrice: null,
  maxPrice: null,
  brands: [],
};

const ids = (list: Product[]) => list.map((p) => p.id);

describe('applyFilters', () => {
  it('returns everything when no filter is active', () => {
    expect(applyFilters(products, none)).toHaveLength(4);
  });

  it('matches any of several selected categories', () => {
    expect(
      ids(applyFilters(products, { ...none, categories: ['laptops', 'groceries'] }))
    ).toEqual([1, 2, 4]);
  });

  it('treats the price range as inclusive', () => {
    expect(
      ids(applyFilters(products, { ...none, minPrice: 799, maxPrice: 999 }))
    ).toEqual([2, 3]);
  });

  it('matches any selected brand and excludes brandless products', () => {
    expect(ids(applyFilters(products, { ...none, brands: ['Apple', 'Asus'] }))).toEqual([
      1, 2, 3,
    ]);
  });

  it('searches title and brand, case-insensitively', () => {
    expect(ids(applyFilters(products, { ...none, query: '  apple ' }))).toEqual([
      1, 3, 4,
    ]);
    expect(ids(applyFilters(products, { ...none, query: 'zen' }))).toEqual([2]);
  });

  it('combines all filters with AND', () => {
    const result = applyFilters(products, {
      query: 'mac',
      categories: ['laptops'],
      minPrice: 1000,
      maxPrice: null,
      brands: ['Apple'],
    });
    expect(ids(result)).toEqual([1]);
  });
});

describe('extractBrands', () => {
  it('returns unique sorted brands and skips missing ones', () => {
    expect(extractBrands(products)).toEqual(['Apple', 'Asus']);
  });
});

describe('validatePriceRange', () => {
  it('accepts empty and valid ranges', () => {
    expect(validatePriceRange('', '')).toBeNull();
    expect(validatePriceRange('10', '')).toBeNull();
    expect(validatePriceRange('10', '50')).toBeNull();
  });

  it('rejects negative numbers and min > max', () => {
    expect(validatePriceRange('-1', '')).toMatch(/negative/);
    expect(validatePriceRange('100', '10')).toMatch(/less than/);
  });
});
