import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { ProductFilters } from '../types';
import { DEFAULT_SORT, isSortOption, type SortOption } from '../utils/sortProducts';

export const FILTER_PARAMS = {
  query: 'q',
  categories: 'categories',
  minPrice: 'minPrice',
  maxPrice: 'maxPrice',
  brands: 'brands',
  sort: 'sort',
  page: 'page',
} as const;

const toNumber = (value: string | null): number | null => {
  if (value === null || value.trim() === '') return null;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

const toList = (value: string | null) => value?.split(',').filter(Boolean) ?? [];

export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ProductFilters>(
    () => ({
      query: searchParams.get(FILTER_PARAMS.query) ?? '',
      categories: toList(searchParams.get(FILTER_PARAMS.categories)),
      minPrice: toNumber(searchParams.get(FILTER_PARAMS.minPrice)),
      maxPrice: toNumber(searchParams.get(FILTER_PARAMS.maxPrice)),
      brands: toList(searchParams.get(FILTER_PARAMS.brands)),
    }),
    [searchParams]
  );

  const rawSort = searchParams.get(FILTER_PARAMS.sort);
  const sort: SortOption = isSortOption(rawSort) ? rawSort : DEFAULT_SORT;

  const page = Math.max(
    1,
    Math.floor(toNumber(searchParams.get(FILTER_PARAMS.page)) ?? 1)
  );

  const update = useCallback(
    (mutate: (params: URLSearchParams) => void, { resetPage = true } = {}) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          mutate(next);
          if (resetPage) next.delete(FILTER_PARAMS.page);
          return next;
        },
        { replace: resetPage }
      );
    },
    [setSearchParams]
  );

  const setOrDelete = (params: URLSearchParams, key: string, value: string | null) => {
    if (value === null || value === '') params.delete(key);
    else params.set(key, value);
  };

  const setQuery = useCallback(
    (query: string) => update((p) => setOrDelete(p, FILTER_PARAMS.query, query.trim())),
    [update]
  );

  const setCategories = useCallback(
    (categories: string[]) =>
      update((p) => setOrDelete(p, FILTER_PARAMS.categories, categories.join(','))),
    [update]
  );

  const setPriceRange = useCallback(
    (minPrice: number | null, maxPrice: number | null) =>
      update((p) => {
        setOrDelete(
          p,
          FILTER_PARAMS.minPrice,
          minPrice === null ? null : String(minPrice)
        );
        setOrDelete(
          p,
          FILTER_PARAMS.maxPrice,
          maxPrice === null ? null : String(maxPrice)
        );
      }),
    [update]
  );

  const setBrands = useCallback(
    (brands: string[]) =>
      update((p) => setOrDelete(p, FILTER_PARAMS.brands, brands.join(','))),
    [update]
  );

  const setSort = useCallback(
    (next: SortOption) =>
      update((p) =>
        setOrDelete(p, FILTER_PARAMS.sort, next === DEFAULT_SORT ? null : next)
      ),
    [update]
  );

  const setPage = useCallback(
    (nextPage: number) =>
      update(
        (p) => setOrDelete(p, FILTER_PARAMS.page, nextPage > 1 ? String(nextPage) : null),
        { resetPage: false }
      ),
    [update]
  );

  const clearFilters = useCallback(
    () =>
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams();
          const keepSort = prev.get(FILTER_PARAMS.sort);
          if (keepSort) next.set(FILTER_PARAMS.sort, keepSort);
          return next;
        },
        { replace: true }
      ),
    [setSearchParams]
  );

  const activeFilterCount =
    (filters.query ? 1 : 0) +
    filters.categories.length +
    (filters.minPrice !== null || filters.maxPrice !== null ? 1 : 0) +
    filters.brands.length;

  return {
    filters,
    page,
    sort,
    activeFilterCount,
    setQuery,
    setCategories,
    setPriceRange,
    setBrands,
    setSort,
    setPage,
    clearFilters,
  };
}
