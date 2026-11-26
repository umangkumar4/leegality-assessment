export function getPageItems(page: number, totalPages: number): (number | null)[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items: (number | null)[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) items.push(null);
  for (let p = start; p <= end; p++) items.push(p);
  if (end < totalPages - 1) items.push(null);
  items.push(totalPages);

  return items;
}
