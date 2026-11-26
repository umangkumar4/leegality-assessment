import { Link } from 'react-router';
import { ChevronRightIcon } from '@/shared/components';
import { toCategoryLabel } from '@/shared/utils/format';

interface ProductBreadcrumbProps {
  backTo?: string;
  category?: string;
  title?: string;
}

export function ProductBreadcrumb({ backTo, category, title }: ProductBreadcrumbProps) {
  const link =
    'rounded hover:text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none';

  return (
    <nav aria-label="Breadcrumb" className="text-[14px] text-slate-500 sm:text-[15px]">
      <ol className="flex min-w-0 items-center gap-1.5">
        <li className="shrink-0">
          <Link to={{ pathname: '/', search: backTo ?? '' }} className={link}>
            Home
          </Link>
        </li>
        {category && (
          <>
            <li aria-hidden="true" className="shrink-0">
              <ChevronRightIcon width={14} height={14} />
            </li>
            <li className="shrink-0">
              <Link
                to={{ pathname: '/', search: `?categories=${category}` }}
                className={link}
              >
                {toCategoryLabel(category)}
              </Link>
            </li>
          </>
        )}
        {title && (
          <>
            <li aria-hidden="true" className="shrink-0">
              <ChevronRightIcon width={14} height={14} />
            </li>
            <li
              aria-current="page"
              className="min-w-0 truncate font-medium text-slate-700"
            >
              {title}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
