const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const formatPrice = (value: number) => currency.format(value);

export const toCategoryLabel = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
