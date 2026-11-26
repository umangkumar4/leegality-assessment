import type { Review } from '@/entities/product';
import { Rating, StarIcon } from '@/shared/components';
import { formatDate, getInitials, getRatingDistribution } from '../utils/productDetails';
import { DetailSection } from './DetailSection';

const avatarColors = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-700',
];

const colorFor = (name: string) =>
  avatarColors[
    [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % avatarColors.length
  ];

function ReviewItem({ review }: { review: Review }) {
  return (
    <li className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-3.5">
      <span
        aria-hidden="true"
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${colorFor(review.reviewerName)}`}
      >
        {getInitials(review.reviewerName)}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <h3 className="text-[15px] font-semibold text-slate-900">
            {review.reviewerName}
          </h3>
          <Rating
            value={review.rating}
            size={13}
            labelClassName="text-[13px] text-slate-600"
          />
        </div>
        {review.date && (
          <time dateTime={review.date} className="block text-[12px] text-slate-500">
            {formatDate(review.date)}
          </time>
        )}
        <p className="mt-1.5 text-[15px] leading-relaxed text-slate-700">
          {review.comment}
        </p>
      </div>
    </li>
  );
}

interface ProductReviewsProps {
  reviews?: Review[];
  rating?: number;
}

export function ProductReviews({ reviews = [], rating }: ProductReviewsProps) {
  const distribution = getRatingDistribution(reviews);
  const average =
    rating ??
    (reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0);

  return (
    <DetailSection id="reviews" title="Reviews" className="pb-0">
      {reviews.length === 0 ? (
        <p className="text-[15px] text-slate-500">No reviews yet.</p>
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-3.5 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex shrink-0 flex-col items-center sm:w-28">
              <span className="text-[32px] leading-none font-bold text-slate-900">
                {average.toFixed(1)}
              </span>
              <Rating value={average} size={14} labelClassName="sr-only" />
              <span className="mt-1 text-[12px] text-slate-500">
                {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            </div>
            <ul className="flex-1 space-y-1" aria-label="Rating breakdown">
              {distribution.map(({ stars, count }) => (
                <li
                  key={stars}
                  className="flex items-center gap-2 text-[12px] text-slate-600"
                >
                  <span className="inline-flex w-6 items-center gap-0.5">
                    {stars}
                    <StarIcon width={11} height={11} className="text-amber-400" />
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <span
                      className="block h-full rounded-full bg-amber-400"
                      style={{ width: `${(count / reviews.length) * 100}%` }}
                    />
                  </span>
                  <span className="w-3 text-right tabular-nums">{count}</span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="mt-3 space-y-2.5" aria-label="Customer reviews">
            {reviews.map((review) => (
              <ReviewItem
                key={`${review.reviewerEmail}-${review.date}`}
                review={review}
              />
            ))}
          </ul>
        </>
      )}
    </DetailSection>
  );
}
