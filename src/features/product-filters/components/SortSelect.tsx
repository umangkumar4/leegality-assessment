import { SORT_OPTIONS, type SortOption } from '../utils/sortProducts';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="flex shrink-0 items-center gap-2 text-[14px] text-slate-600">
      <span className="hidden sm:inline">Sort by:</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortOption)}
          aria-label="Sort products"
          className="h-10 cursor-pointer appearance-none rounded-md border border-slate-300 bg-white py-0 pr-9 pl-3 text-[14px] font-medium text-slate-800 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-slate-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </label>
  );
}
