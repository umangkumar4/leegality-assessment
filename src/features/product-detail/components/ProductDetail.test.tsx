import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { Product } from '@/entities/product';
import { ProductInfo } from './ProductInfo';
import { ProductReviews } from './ProductReviews';

const product: Product = {
  id: 1,
  title: 'iPhone 13 Pro',
  description: 'A great phone.',
  category: 'smartphones',
  price: 1099.99,
  discountPercentage: 5,
  rating: 4.12,
  stock: 3,
  brand: 'Apple',
  thumbnail: '',
  images: [],
  reviews: [
    {
      rating: 4,
      comment: 'Excellent phone!',
      date: '2025-01-01T00:00:00.000Z',
      reviewerName: 'Emily Johnson',
      reviewerEmail: 'emily@x.com',
    },
  ],
};

describe('ProductInfo', () => {
  it('shows title, price, rating, brand, category and description', () => {
    render(
      <MemoryRouter>
        <ProductInfo product={product} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'iPhone 13 Pro' })
    ).toBeInTheDocument();
    expect(screen.getByText('$1,099.99')).toBeInTheDocument();
    expect(screen.getByText('(4.1)')).toBeInTheDocument();
    expect(screen.getByText('Brand:').nextSibling).toHaveTextContent('Apple');
    expect(screen.getByText('Category:').nextSibling).toHaveTextContent('Smartphones');
    expect(screen.getByText('A great phone.')).toBeInTheDocument();
  });

  it('shows the original price, saving and stock status', () => {
    render(
      <MemoryRouter>
        <ProductInfo
          product={{ ...product, price: 95, discountPercentage: 5, stock: 3 }}
        />
      </MemoryRouter>
    );
    expect(screen.getByText('$100.00')).toHaveClass('line-through');
    expect(screen.getByText('Save 5%')).toBeInTheDocument();
    expect(screen.getByText('Only 3 left')).toBeInTheDocument();
  });

  it('labels products without a brand', () => {
    render(
      <MemoryRouter>
        <ProductInfo product={{ ...product, brand: undefined }} />
      </MemoryRouter>
    );
    expect(screen.getByText('Brand:').nextSibling).toHaveTextContent('Unbranded');
  });
});

describe('ProductReviews', () => {
  it('lists each review with name, rating and comment', () => {
    render(<ProductReviews reviews={product.reviews} />);

    const list = screen.getByRole('list', { name: 'Customer reviews' });
    const [item] = within(list).getAllByRole('listitem');
    expect(
      within(item).getByRole('heading', { name: 'Emily Johnson' })
    ).toBeInTheDocument();
    expect(within(item).getByText('(4.0)')).toBeInTheDocument();
    expect(within(item).getByText('Excellent phone!')).toBeInTheDocument();
    expect(within(item).getByText('Jan 1, 2025')).toBeInTheDocument();
  });

  it('summarises the rating breakdown', () => {
    render(<ProductReviews reviews={product.reviews} rating={4.12} />);
    expect(screen.getByText('4.1')).toBeInTheDocument();
    expect(screen.getByText('1 review')).toBeInTheDocument();
  });

  it('shows an empty message when there are no reviews', () => {
    render(<ProductReviews reviews={[]} />);
    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
  });
});
