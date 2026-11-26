import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { Product } from '@/entities/product';
import { ProductCard } from './ProductCard';

const product: Product = {
  id: 42,
  title: 'Essence Mascara',
  description: 'A mascara',
  category: 'beauty',
  price: 9.99,
  discountPercentage: 0,
  rating: 4.5,
  stock: 10,
  brand: 'Essence',
  thumbnail: 'https://example.com/thumb.png',
  images: [],
};

describe('ProductCard', () => {
  it('shows image, title, price and rating, and links to the detail page', () => {
    render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>
    );

    expect(screen.getByRole('img', { name: 'Essence Mascara' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Essence Mascara' })).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByLabelText('Rated 4.5 out of 5')).toBeInTheDocument();
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/product/42');
  });
});
