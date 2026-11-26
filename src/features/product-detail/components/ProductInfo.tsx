import clsx from 'clsx';
import {
  getOriginalPrice,
  getStockStatus,
  type Product,
  type StockTone,
} from '@/entities/product';
import { Rating, ReturnIcon, ShieldIcon, TruckIcon } from '@/shared/components';
import { formatPrice, toCategoryLabel } from '@/shared/utils/format';
import { DetailSection } from './DetailSection';

const toneClasses: Record<StockTone, string> = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-800 ring-amber-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
};

const dotClasses: Record<StockTone, string> = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
};

export function ProductInfo({ product }: { product: Product }) {
  const originalPrice = getOriginalPrice(product.price, product.discountPercentage);
  const stock = getStockStatus(product);
  const reviewCount = product.reviews?.length ?? 0;

  const highlights = [
    { icon: TruckIcon, label: 'Shipping', value: product.shippingInformation },
    { icon: ShieldIcon, label: 'Warranty', value: product.warrantyInformation },
    { icon: ReturnIcon, label: 'Returns', value: product.returnPolicy },
  ].filter((h) => h.value);

  return (
    <div>
      <h1 className="text-[22px] leading-snug font-semibold text-slate-900 sm:text-[26px]">
        {product.title}
      </h1>

      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]">
        <Rating
          value={product.rating}
          size={15}
          labelClassName="text-[14px] text-slate-600"
        />
        {reviewCount > 0 && (
          <>
            <span className="text-slate-300" aria-hidden="true">
              |
            </span>
            <a
              href="#reviews"
              onClick={(event) => {
                event.preventDefault();
                document
                  .getElementById('reviews')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-blue-600 hover:underline"
            >
              {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
            </a>
          </>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2">
        <span className="text-[26px] leading-none font-bold text-slate-900 sm:text-[28px]">
          {formatPrice(product.price)}
        </span>
        {originalPrice && (
          <>
            <span className="text-[15px] text-slate-400 line-through">
              {formatPrice(originalPrice)}
            </span>
            <span className="rounded bg-emerald-600 px-1.5 py-0.5 text-[12px] font-semibold text-white">
              Save {Math.round(product.discountPercentage)}%
            </span>
          </>
        )}
        <span
          className={clsx(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[13px] font-medium ring-1 ring-inset',
            toneClasses[stock.tone]
          )}
        >
          <span className={clsx('h-1.5 w-1.5 rounded-full', dotClasses[stock.tone])} />
          {stock.label}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[15px]">
        <dt className="font-semibold text-slate-900">Brand:</dt>
        <dd className="text-slate-700">{product.brand ?? 'Unbranded'}</dd>
        <dt className="font-semibold text-slate-900">Category:</dt>
        <dd className="text-slate-700">{toCategoryLabel(product.category)}</dd>
      </dl>

      {product.tags && product.tags.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
          {product.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[13px] text-slate-600"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}

      {highlights.length > 0 && (
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-3">
          {highlights.map(({ icon: Icon, label, value }) => (
            <li
              key={label}
              className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Icon width={16} height={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-medium tracking-wide text-slate-500 uppercase">
                  {label}
                </span>
                <span className="block text-[13px] leading-snug font-medium text-slate-800">
                  {value}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <DetailSection id="description" title="Description" className="mt-5">
        <p className="text-[15px] leading-relaxed text-slate-700">
          {product.description}
        </p>
      </DetailSection>
    </div>
  );
}
