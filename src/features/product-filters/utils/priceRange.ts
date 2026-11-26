import { formatPrice } from '@/shared/utils/format';

export const parsePrice = (value: string): number | null =>
  value.trim() === '' ? null : Number(value);

export const priceToInput = (value: number | null) =>
  value === null ? '' : String(value);

export function validatePriceRange(min: string, max: string): string | null {
  const lo = parsePrice(min);
  const hi = parsePrice(max);
  if ((lo !== null && Number.isNaN(lo)) || (hi !== null && Number.isNaN(hi)))
    return 'Enter a valid number.';
  if ((lo !== null && lo < 0) || (hi !== null && hi < 0))
    return 'Prices can’t be negative.';
  if (lo !== null && hi !== null && lo > hi)
    return 'Min price must be less than max price.';
  return null;
}

export function formatPriceRange(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) return `${formatPrice(min)} – ${formatPrice(max)}`;
  if (min !== null) return `Over ${formatPrice(min)}`;
  if (max !== null) return `Under ${formatPrice(max)}`;
  return null;
}
