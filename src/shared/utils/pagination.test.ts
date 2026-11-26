import { getPageItems } from './pagination';
import { paginate } from './paginate';

describe('paginate', () => {
  const list = Array.from({ length: 25 }, (_, i) => i + 1);

  it('returns the requested page', () => {
    expect(paginate(list, 2, 10)).toEqual({
      items: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      page: 2,
      totalPages: 3,
      totalItems: 25,
    });
  });

  it('clamps an out-of-range page (e.g. stale ?page=9 after filtering)', () => {
    expect(paginate(list, 9, 10).page).toBe(3);
    expect(paginate([], 4, 10)).toMatchObject({ items: [], page: 1, totalPages: 1 });
  });
});

describe('getPageItems', () => {
  it('lists every page when there are few', () => {
    expect(getPageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses long ranges with gaps', () => {
    expect(getPageItems(5, 10)).toEqual([1, null, 4, 5, 6, null, 10]);
  });
});
