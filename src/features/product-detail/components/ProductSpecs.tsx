import type { Product } from '@/entities/product';
import { formatDate } from '../utils/productDetails';
import { DetailSection } from './DetailSection';

export function ProductSpecs({ product }: { product: Product }) {
  const d = product.dimensions;
  const rows: [string, string | undefined][] = [
    ['SKU', product.sku],
    ['Dimensions', d ? `W ${d.width} × H ${d.height} × D ${d.depth}` : undefined],
    [
      'Minimum order',
      product.minimumOrderQuantity
        ? `${product.minimumOrderQuantity} unit(s)`
        : undefined,
    ],
    ['Barcode', product.meta?.barcode],
    [
      'Listed on',
      product.meta?.createdAt ? formatDate(product.meta.createdAt) : undefined,
    ],
  ];
  const visible = rows.filter(([, value]) => Boolean(value));
  if (visible.length === 0) return null;

  return (
    <DetailSection id="specs" title="Specifications">
      <dl className="overflow-hidden rounded-lg border border-slate-200 bg-white text-[14px]">
        {visible.map(([label, value]) => (
          <div
            key={label}
            className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-3.5 py-2 even:bg-slate-50"
          >
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-medium break-words text-slate-800">{value}</dd>
          </div>
        ))}
      </dl>
    </DetailSection>
  );
}
