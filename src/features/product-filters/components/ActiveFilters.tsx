import { CloseIcon } from '@/shared/components';
import { toCategoryLabel } from '@/shared/utils/format';
import type { ProductFilters } from '../types';
import { formatPriceRange } from '../utils/priceRange';

interface ActiveFiltersProps {
  filters: ProductFilters;
  onRemoveQuery: () => void;
  onRemoveCategory: (slug: string) => void;
  onRemovePrice: () => void;
  onRemoveBrand: (brand: string) => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  filters,
  onRemoveQuery,
  onRemoveCategory,
  onRemovePrice,
  onRemoveBrand,
  onClearAll,
}: ActiveFiltersProps) {
  const price = formatPriceRange(filters.minPrice, filters.maxPrice);
  const chips = [
    ...(filters.query
      ? [
          {
            key: 'q',
            label: `“${filters.query}”`,
            kind: 'Search',
            onRemove: onRemoveQuery,
          },
        ]
      : []),
    ...filters.categories.map((slug) => ({
      key: `c-${slug}`,
      label: toCategoryLabel(slug),
      kind: 'Category',
      onRemove: () => onRemoveCategory(slug),
    })),
    ...(price
      ? [{ key: 'price', label: price, kind: 'Price', onRemove: onRemovePrice }]
      : []),
    ...filters.brands.map((brand) => ({
      key: `b-${brand}`,
      label: brand,
      kind: 'Brand',
      onRemove: () => onRemoveBrand(brand),
    })),
  ];

  if (chips.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Remove ${chip.kind.toLowerCase()} filter ${chip.label}`}
            className="group inline-flex h-8 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 pr-2 pl-3 text-[13px] font-medium text-blue-800 transition-colors hover:border-blue-300 hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            {chip.label}
            <CloseIcon
              width={14}
              height={14}
              className="text-blue-500 group-hover:text-blue-700"
            />
          </button>
        </li>
      ))}
      {chips.length > 1 && (
        <li>
          <button
            type="button"
            onClick={onClearAll}
            className="h-8 px-1 text-[13px] font-medium text-slate-600 underline-offset-2 hover:text-slate-900 hover:underline"
          >
            Clear all
          </button>
        </li>
      )}
    </ul>
  );
}
