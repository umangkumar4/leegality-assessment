import { useLocation, useParams } from 'react-router';
import {
  ProductBreadcrumb,
  ProductDetailSkeleton,
  ProductGallery,
  ProductInfo,
  ProductInfoSkeleton,
  ProductReviews,
  ProductSpecs,
  useProductQuery,
} from '@/features/product-detail';
import { ProductGrid, useProductsQuery } from '@/features/product-listing';
import { ErrorState } from '@/shared/components';
import { ApiError } from '@/shared/lib/axios';
import { toCategoryLabel } from '@/shared/utils/format';
import NotFoundPage from './NotFoundPage';

interface LocationState {
  from?: string;
}

const RELATED_COUNT = 4;

export default function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);
  const location = useLocation();
  const from = (location.state as LocationState | null)?.from;

  const {
    data: product,
    isPending,
    isError,
    error,
    refetch,
  } = useProductQuery(productId);

  const related = useProductsQuery(product ? [product.category] : [], {
    enabled: Boolean(product),
  });
  const relatedProducts = product
    ? related.data.filter((p) => p.id !== product.id).slice(0, RELATED_COUNT)
    : [];

  const isNotFound =
    !Number.isInteger(productId) ||
    productId <= 0 ||
    (isError && error instanceof ApiError && error.status === 404);

  if (isNotFound) return <NotFoundPage message="We couldn’t find that product." />;

  return (
    <div className="bg-slate-50/60">
      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[minmax(0,620fr)_minmax(0,710fr)]">
        <div className="px-4 pt-4 pb-6 sm:px-9 sm:pt-6 sm:pb-8 lg:border-r lg:border-slate-200 lg:pb-12">
          <div className="lg:sticky lg:top-[96px] lg:z-20">
            <div className="mb-4 sm:mb-5">
              <ProductBreadcrumb
                backTo={from}
                category={product?.category}
                title={product?.title}
              />
            </div>
            {isPending ? (
              <ProductDetailSkeleton />
            ) : isError ? null : (
              <ProductGallery
                key={product.id}
                images={product.images.length ? product.images : [product.thumbnail]}
                title={product.title}
                discountPercentage={product.discountPercentage}
              />
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 px-4 pt-5 pb-10 sm:px-10 sm:pt-6 sm:pb-12 lg:border-t-0 lg:pr-12">
          {isPending ? (
            <ProductInfoSkeleton />
          ) : isError ? (
            <ErrorState
              title="Couldn’t load product"
              message={error.message}
              onRetry={() => refetch()}
            />
          ) : (
            <>
              <ProductInfo product={product} />
              <ProductSpecs product={product} />
              <ProductReviews reviews={product.reviews} rating={product.rating} />
            </>
          )}
        </div>
      </div>

      {product && relatedProducts.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="border-t border-slate-200 bg-white px-4 py-8 sm:px-9 sm:py-10"
        >
          <h2
            id="related-heading"
            className="mb-4 text-[18px] font-semibold text-slate-900 sm:text-[20px]"
          >
            More from {toCategoryLabel(product.category)}
          </h2>
          <ProductGrid products={relatedProducts} backTo={from} />
        </section>
      )}
    </div>
  );
}
