import { fireEvent, render, screen, within } from '@testing-library/react';
import { ProductGallery } from './ProductGallery';

const images = ['a.png', 'b.png', 'c.png'];

describe('ProductGallery', () => {
  it('switches the main image when a thumbnail is hovered or clicked', () => {
    render(<ProductGallery images={images} title="Perfume" />);
    const thumbs = within(screen.getByRole('list', { name: 'Image thumbnails' }));

    fireEvent.mouseEnter(thumbs.getByRole('button', { name: 'Show image 3' }));
    const main = screen.getByTestId('gallery-main-image');
    expect(main).toHaveAttribute('src', 'c.png');
    expect(main).toHaveAttribute('alt', 'Perfume – image 3 of 3');

    fireEvent.click(thumbs.getByRole('button', { name: 'Show image 2' }));
    expect(thumbs.getByRole('button', { name: 'Show image 2' })).toHaveAttribute(
      'aria-current',
      'true'
    );
  });

  it('opens the full view and closes it with Escape', () => {
    render(<ProductGallery images={images} title="Perfume" discountPercentage={17.2} />);
    expect(screen.getAllByText('-17%').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'Open full view' }));
    expect(screen.getByRole('dialog', { name: 'Perfume images' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(within(screen.getByRole('dialog')).getByText('2 / 3')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('hides thumbnails for a single image', () => {
    render(<ProductGallery images={['only.png']} title="Mug" />);
    expect(
      screen.queryByRole('list', { name: 'Image thumbnails' })
    ).not.toBeInTheDocument();
  });
});
