import clsx from 'clsx';
import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { getOriginalPrice, getStockStatus, type Product } from '@/entities/product';
import { Rating } from '@/shared/components';
import { formatPrice } from '@/shared/utils/format';

interface ProductCardProps {
  product: Product;
  backTo?: string;
  onIntent?: (product: Product) => void;
}

export function ProductCard({ product, backTo, onIntent }: ProductCardProps) {
  const location = useLocation();
  const [hovered, setHovered] = useState(false);

  const discount = Math.round(product.discountPercentage);
  const originalPrice = getOriginalPrice(product.price, product.discountPercentage);
  const stock = getStockStatus(product);
  const secondImage = product.images.length > 1 ? product.images[1] : undefined;

  const handleIntent = () => {
    setHovered(true);
    onIntent?.(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      state={{ from: backTo ?? location.search }}
      onMouseEnter={handleIntent}
      onFocus={handleIntent}
      onTouchStart={handleIntent}
      className="group flex w-full flex-col rounded-md border border-slate-200 bg-white px-3 pt-3 pb-4 shadow-[0_1px_3px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-md focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none sm:px-3.5 sm:pt-4 sm:pb-5"
    >
      <div className="relative flex h-[130px] items-center justify-center border-b border-slate-200 pb-3 sm:h-[185px] sm:pb-4">
        {discount >= 1 && (
          <span className="absolute top-0 left-0 z-10 rounded bg-red-500 px-1.5 py-0.5 text-[11px] font-semibold text-white sm:text-[12px]">
            -{discount}%
          </span>
        )}
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className={clsx(
            'max-h-full max-w-full object-contain transition-opacity duration-300',
            secondImage && hovered && 'group-hover:opacity-0'
          )}
        />
        {secondImage && hovered && (
          <img
            src={secondImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 m-auto max-h-[calc(100%-12px)] max-w-full object-contain opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:max-h-[calc(100%-16px)]"
          />
        )}
        {stock.tone === 'danger' && (
          <span className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-full bg-slate-900/75 px-2.5 py-0.5 text-[11px] font-medium text-white sm:bottom-4">
            Out of stock
          </span>
        )}
      </div>
      <h3
        className="mt-3 truncate text-[15px] font-medium text-slate-900 sm:mt-4 sm:text-[18px]"
        title={product.title}
      >
        {product.title}
      </h3>
      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 sm:mt-2.5">
        <span
          data-testid="product-price"
          className="text-[16px] font-semibold text-slate-900 sm:text-[18px]"
        >
          {formatPrice(product.price)}
        </span>
        <Rating value={product.rating} size={12} />
      </div>
      {(originalPrice || stock.tone === 'warning') && (
        <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[12px] sm:text-[13px]">
          {originalPrice && (
            <span className="text-slate-500">
              List: <span className="line-through">{formatPrice(originalPrice)}</span>
            </span>
          )}
          {stock.tone === 'warning' && (
            <span className="font-medium text-amber-700">{stock.label}</span>
          )}
        </div>
      )}
    </Link>
  );
}
