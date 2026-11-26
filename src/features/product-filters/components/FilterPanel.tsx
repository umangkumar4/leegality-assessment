import { useState } from 'react';
import { SearchIcon } from '@/shared/components';
import type { ProductFilters } from '../types';
import { BrandFilter } from './BrandFilter';
import { CategoryFilter } from './CategoryFilter';
import { PriceFilter } from './PriceFilter';

interface FilterPanelProps {
  filters: ProductFilters;
  availableBrands: string[];
  onCategoriesChange: (categories: string[]) => void;
  onPriceApply: (min: number | null, max: number | null) => void;
  onBrandsChange: (brands: string[]) => void;
}

export function FilterPanel({
  filters,
  availableBrands,
  onCategoriesChange,
  onPriceApply,
  onBrandsChange,
}: FilterPanelProps) {
  const [listQuery, setListQuery] = useState('');

  return (
    <div>
      <label className="relative mb-5 block">
        <span className="sr-only">Search filters</span>
        <SearchIcon
          width={20}
          height={20}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
        />
        <input
          type="search"
          placeholder="Search..."
          value={listQuery}
          onChange={(e) => setListQuery(e.target.value)}
          className="h-[52px] w-full rounded-md border border-slate-300 bg-white pr-4 pl-12 text-[17px] text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </label>

      <CategoryFilter
        selected={filters.categories}
        onChange={onCategoriesChange}
        listQuery={listQuery}
      />
      <PriceFilter
        minPrice={filters.minPrice}
        maxPrice={filters.maxPrice}
        onApply={onPriceApply}
      />
      <BrandFilter
        brands={availableBrands}
        selected={filters.brands}
        onChange={onBrandsChange}
        listQuery={listQuery}
      />
    </div>
  );
}
