import { fireEvent, render, screen } from '@testing-library/react';
import { formatPriceRange } from '../utils/priceRange';
import { ActiveFilters } from './ActiveFilters';

const handlers = () => ({
  onRemoveQuery: vi.fn(),
  onRemoveCategory: vi.fn(),
  onRemovePrice: vi.fn(),
  onRemoveBrand: vi.fn(),
  onClearAll: vi.fn(),
});

describe('ActiveFilters', () => {
  it('renders a removable chip per active filter', () => {
    const h = handlers();
    render(
      <ActiveFilters
        filters={{
          query: 'pro',
          categories: ['smartphones', 'home-decoration'],
          minPrice: 500,
          maxPrice: null,
          brands: ['Apple'],
        }}
        {...h}
      />
    );

    expect(
      screen.getByRole('button', { name: 'Remove search filter “pro”' })
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove category filter Home Decoration' })
    );
    expect(h.onRemoveCategory).toHaveBeenCalledWith('home-decoration');
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove price filter Over $500.00' })
    );
    expect(h.onRemovePrice).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Remove brand filter Apple' }));
    expect(h.onRemoveBrand).toHaveBeenCalledWith('Apple');
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(h.onClearAll).toHaveBeenCalled();
  });

  it('renders nothing without active filters', () => {
    const { container } = render(
      <ActiveFilters
        filters={{
          query: '',
          categories: [],
          minPrice: null,
          maxPrice: null,
          brands: [],
        }}
        {...handlers()}
      />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('formats price ranges', () => {
    expect(formatPriceRange(10, 50)).toBe('$10.00 – $50.00');
    expect(formatPriceRange(null, 50)).toBe('Under $50.00');
    expect(formatPriceRange(null, null)).toBeNull();
  });
});
