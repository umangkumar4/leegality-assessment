import clsx from 'clsx';
import { getPageItems } from '@/shared/utils/pagination';
import { ArrowLeftIcon, ArrowRightIcon } from './Icons';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  align?: 'center' | 'start';
}

const box =
  'inline-flex h-10 items-center justify-center rounded-md border text-[15px] shadow-sm sm:text-[16px] transition-colors disabled:cursor-not-allowed disabled:opacity-50';
const idle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50';
const active = 'border-blue-500 bg-blue-500 font-medium text-white';

export function Pagination({
  page,
  totalPages,
  onPageChange,
  align = 'center',
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={clsx(
        'flex flex-wrap items-center gap-1.5',
        align === 'center' ? 'justify-center' : 'justify-start'
      )}
    >
      <button
        type="button"
        className={clsx(box, idle, 'mr-0.5 gap-2 px-3 sm:mr-1.5 sm:px-4')}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ArrowLeftIcon width={16} height={16} />
        Previous
      </button>

      {getPageItems(page, totalPages).map((item, index) =>
        item === null ? (
          <span key={`gap-${index}`} className="px-1 text-slate-400">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            className={clsx(box, 'min-w-9 px-3', item === page ? active : idle)}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        )
      )}

      <button
        type="button"
        className={clsx(box, idle, 'ml-0.5 gap-2 px-3 sm:ml-1.5 sm:px-4')}
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
        <ArrowRightIcon width={16} height={16} />
      </button>
    </nav>
  );
}
