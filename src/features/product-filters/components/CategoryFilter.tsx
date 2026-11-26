import { Checkbox, Spinner } from '@/shared/components';
import { useCategoriesQuery } from '../hooks/useCategoriesQuery';
import { FilterSection } from './FilterSection';

interface CategoryFilterProps {
  selected: string[];
  onChange: (categories: string[]) => void;
  listQuery: string;
}

export function CategoryFilter({ selected, onChange, listQuery }: CategoryFilterProps) {
  const { data: categories, isPending, isError, refetch } = useCategoriesQuery();

  const toggle = (slug: string) =>
    onChange(
      selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]
    );

  const needle = listQuery.trim().toLowerCase();
  const visible = categories
    ?.filter(
      (c) => !needle || c.name.toLowerCase().includes(needle) || selected.includes(c.slug)
    )
    .sort(
      (a, b) => Number(selected.includes(b.slug)) - Number(selected.includes(a.slug))
    );

  return (
    <FilterSection title="Categories" strong>
      {isPending && <Spinner label="Loading categories…" />}
      {isError && (
        <p className="text-sm text-red-600">
          Couldn’t load categories.{' '}
          <button type="button" className="underline" onClick={() => refetch()}>
            Retry
          </button>
        </p>
      )}
      {visible && (
        <ul className="max-h-64 space-y-0.5 overflow-y-auto">
          {visible.map((c) => (
            <li key={c.slug}>
              <Checkbox
                label={c.name}
                checked={selected.includes(c.slug)}
                onChange={() => toggle(c.slug)}
              />
            </li>
          ))}
          {visible.length === 0 && (
            <li className="text-sm text-slate-500">No category matches “{listQuery}”.</li>
          )}
        </ul>
      )}
    </FilterSection>
  );
}
