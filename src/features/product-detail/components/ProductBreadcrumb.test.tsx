import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ProductBreadcrumb } from './ProductBreadcrumb';

describe('ProductBreadcrumb', () => {
  it('links Home back to the filtered listing and shows category and product', () => {
    render(
      <MemoryRouter>
        <ProductBreadcrumb
          backTo="?categories=fragrances&page=2"
          category="fragrances"
          title="Coco Noir"
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/?categories=fragrances&page=2'
    );
    expect(screen.getByRole('link', { name: 'Fragrances' })).toHaveAttribute(
      'href',
      '/?categories=fragrances'
    );
    expect(screen.getByText('Coco Noir')).toHaveAttribute('aria-current', 'page');
  });

  it('falls back to the plain listing when there is no saved listing URL', () => {
    render(
      <MemoryRouter>
        <ProductBreadcrumb />
      </MemoryRouter>
    );
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
  });
});
