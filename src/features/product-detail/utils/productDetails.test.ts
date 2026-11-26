import type { Review } from '@/entities/product';
import { formatDate, getInitials, getRatingDistribution } from './productDetails';

const review = (rating: number): Review => ({
  rating,
  comment: '',
  date: '2025-04-30T09:41:02.054Z',
  reviewerName: 'A B',
  reviewerEmail: 'a@b.c',
});

describe('product detail helpers', () => {
  it('counts reviews per star level', () => {
    const counts = getRatingDistribution([review(5), review(5), review(3)]);
    expect(counts).toEqual([
      { stars: 5, count: 2 },
      { stars: 4, count: 0 },
      { stars: 3, count: 1 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ]);
  });

  it('formats initials and dates', () => {
    expect(getInitials('Christian  Perez')).toBe('CP');
    expect(formatDate('2025-04-30T09:41:02.054Z')).toBe('Apr 30, 2025');
    expect(formatDate('nope')).toBe('');
  });
});
