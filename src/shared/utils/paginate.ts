export interface PaginatedResult<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export function paginate<T>(
  list: T[],
  page: number,
  pageSize: number
): PaginatedResult<T> {
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: list.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems: list.length,
  };
}
