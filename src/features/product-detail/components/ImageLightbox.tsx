import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@/shared/components';

interface ImageLightboxProps {
  images: string[];
  title: string;
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  title,
  index,
  onIndexChange,
  onClose,
}: ImageLightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = images.length;
  const go = (delta: number) => onIndexChange((index + delta + count) % count);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (count > 1 && event.key === 'ArrowRight') onIndexChange((index + 1) % count);
      if (count > 1 && event.key === 'ArrowLeft')
        onIndexChange((index - 1 + count) % count);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [count, index, onClose, onIndexChange]);

  const arrow =
    'absolute top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md hover:bg-white focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none';

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} images`}
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-4 sm:px-6">
        <p className="min-w-0 truncate text-[16px] font-medium text-slate-900">
          {title}
          {count > 1 && (
            <span className="ml-2 text-slate-500">
              {index + 1} / {count}
            </span>
          )}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close full view"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
        >
          <CloseIcon width={24} height={24} />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-10">
        {count > 1 && (
          <button
            type="button"
            className={clsx(arrow, 'left-3 sm:left-6')}
            onClick={() => go(-1)}
            aria-label="Previous image"
          >
            <ChevronLeftIcon width={24} height={24} />
          </button>
        )}
        <img
          src={images[index]}
          alt={`${title} – image ${index + 1} of ${count}`}
          className="max-h-full max-w-full object-contain"
        />
        {count > 1 && (
          <button
            type="button"
            className={clsx(arrow, 'right-3 sm:right-6')}
            onClick={() => go(1)}
            aria-label="Next image"
          >
            <ChevronRightIcon width={24} height={24} />
          </button>
        )}
      </div>

      {count > 1 && (
        <ul className="flex shrink-0 justify-center gap-2 overflow-x-auto border-t border-slate-200 p-3">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => onIndexChange(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === index}
                className={clsx(
                  'h-16 w-16 overflow-hidden rounded-md border bg-white p-1',
                  i === index
                    ? 'border-blue-500 ring-2 ring-blue-500/30'
                    : 'border-slate-200 hover:border-slate-400'
                )}
              >
                <img src={src} alt="" className="h-full w-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>,
    document.body
  );
}
