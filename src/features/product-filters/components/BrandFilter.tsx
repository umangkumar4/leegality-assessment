import { Checkbox } from '@/shared/components';
import { FilterSection } from './FilterSection';

interface BrandFilterProps {
  brands: string[];
  selected: string[];
  onChange: (brands: string[]) => void;
  listQuery: string;
}

export function BrandFilter({ brands, selected, onChange, listQuery }: BrandFilterProps) {
  const toggle = (brand: string) =>
    onChange(
      selected.includes(brand)
        ? selected.filter((b) => b !== brand)
        : [...selected, brand]
    );

  const needle = listQuery.trim().toLowerCase();
  const visible = brands.filter(
    (b) => !needle || b.toLowerCase().includes(needle) || selected.includes(b)
  );

  return (
    <FilterSection title="Brands">
      {brands.length === 0 ? (
        <p className="text-sm text-slate-500">No brands available for these products.</p>
      ) : (
        <ul className="max-h-72 space-y-0.5 overflow-y-auto">
          {visible.map((brand) => (
            <li key={brand}>
              <Checkbox
                label={brand}
                checked={selected.includes(brand)}
                onChange={() => toggle(brand)}
              />
            </li>
          ))}
          {visible.length === 0 && (
            <li className="text-sm text-slate-500">No brand matches “{listQuery}”.</li>
          )}
        </ul>
      )}
    </FilterSection>
  );
}
