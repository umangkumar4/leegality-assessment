export interface ProductFilters {
  query: string;
  categories: string[];
  minPrice: number | null;
  maxPrice: number | null;
  brands: string[];
}
