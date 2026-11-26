import clsx from 'clsx';
import { StarIcon } from './Icons';

interface RatingProps {
  value: number;
  max?: number;
  size?: number;
  labelClassName?: string;
}

export function Rating({
  value,
  max = 5,
  size = 15,
  labelClassName = 'text-[13px] text-slate-500',
}: RatingProps) {
  const clamped = Math.min(max, Math.max(0, value));

  return (
    <span
      className="inline-flex items-center gap-1"
      aria-label={`Rated ${value.toFixed(1)} out of ${max}`}
    >
      <span className="inline-flex" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => {
          const fill = Math.min(1, Math.max(0, clamped - i));
          return (
            <span
              key={i}
              className="relative inline-block"
              style={{ width: size, height: size }}
            >
              <StarIcon
                width={size}
                height={size}
                className="absolute inset-0 text-slate-300"
              />
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <StarIcon width={size} height={size} className="text-amber-400" />
              </span>
            </span>
          );
        })}
      </span>
      <span className={clsx(labelClassName, 'whitespace-nowrap')}>
        ({value.toFixed(1)})
      </span>
    </span>
  );
}
