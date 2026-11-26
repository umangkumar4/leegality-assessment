import { useState, type FormEvent } from 'react';
import { Button } from '@/shared/components';
import { parsePrice, priceToInput, validatePriceRange } from '../utils/priceRange';
import { FilterSection } from './FilterSection';

interface PriceFilterProps {
  minPrice: number | null;
  maxPrice: number | null;
  onApply: (minPrice: number | null, maxPrice: number | null) => void;
}

export function PriceFilter({ minPrice, maxPrice, onApply }: PriceFilterProps) {
  const [min, setMin] = useState(priceToInput(minPrice));
  const [max, setMax] = useState(priceToInput(maxPrice));
  const [touched, setTouched] = useState(false);

  const [synced, setSynced] = useState({ minPrice, maxPrice });
  if (synced.minPrice !== minPrice || synced.maxPrice !== maxPrice) {
    setSynced({ minPrice, maxPrice });
    setMin(priceToInput(minPrice));
    setMax(priceToInput(maxPrice));
    setTouched(false);
  }

  const error = validatePriceRange(min, max);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (error) return;
    onApply(parsePrice(min), parsePrice(max));
  };

  const inputClass =
    'h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-4 text-[17px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none';

  return (
    <FilterSection title="Price Range">
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-3">
          <label className="flex-1">
            <span className="sr-only">Minimum price</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="Min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className={inputClass}
              aria-invalid={touched && Boolean(error)}
            />
          </label>
          <label className="flex-1">
            <span className="sr-only">Maximum price</span>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              placeholder="Max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className={inputClass}
              aria-invalid={touched && Boolean(error)}
            />
          </label>
        </div>
        {touched && error && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <Button type="submit" className="mt-4 h-11 w-full text-[18px] font-normal">
          Apply
        </Button>
      </form>
    </FilterSection>
  );
}
