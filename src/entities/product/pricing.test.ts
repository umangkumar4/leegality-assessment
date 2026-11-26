import { getOriginalPrice, getStockStatus } from './pricing';

describe('pricing helpers', () => {
  it('works out the price before discount', () => {
    expect(getOriginalPrice(90, 10)).toBe(100);
    expect(getOriginalPrice(90, 0)).toBeNull();
  });

  it('maps stock to a status', () => {
    expect(getStockStatus({ stock: 56, availabilityStatus: 'In Stock' })).toEqual({
      label: 'In stock',
      tone: 'success',
    });
    expect(getStockStatus({ stock: 3, availabilityStatus: 'Low Stock' }).tone).toBe(
      'warning'
    );
    expect(getStockStatus({ stock: 0 }).tone).toBe('danger');
  });
});
