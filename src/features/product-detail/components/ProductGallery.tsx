import clsx from 'clsx';
import { useRef, useState, type MouseEvent, type UIEvent } from 'react';
import { ExpandIcon } from '@/shared/components';
import { ImageLightbox } from './ImageLightbox';

interface ProductGalleryProps {
  images: string[];
  title: string;
  discountPercentage?: number;
}

const ZOOM = 2.5;
const ZOOM_MEDIA = '(hover: hover) and (pointer: fine) and (min-width: 1024px)';

interface ZoomState {
  lens: { left: number; top: number; width: number; height: number };
  frame: { width: number; height: number };
}

export function ProductGallery({
  images,
  title,
  discountPercentage,
}: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<ZoomState | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLUListElement>(null);

  const count = images.length;
  const discount = discountPercentage ? Math.round(discountPercentage) : 0;

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const frame = frameRef.current;
    if (!frame || !window.matchMedia(ZOOM_MEDIA).matches) return;
    const rect = frame.getBoundingClientRect();
    const width = rect.width / ZOOM;
    const height = rect.height / ZOOM;
    const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);
    setZoom({
      lens: {
        left: clamp(event.clientX - rect.left - width / 2, rect.width - width),
        top: clamp(event.clientY - rect.top - height / 2, rect.height - height),
        width,
        height,
      },
      frame: { width: rect.width, height: rect.height },
    });
  };

  const handleCarouselScroll = (event: UIEvent<HTMLUListElement>) => {
    const el = event.currentTarget;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    if (index !== active) setActive(index);
  };

  const scrollCarouselTo = (index: number) => {
    const el = carouselRef.current;
    el?.scrollTo?.({ left: index * el.clientWidth, behavior: 'smooth' });
  };

  const badge = discount > 0 && (
    <span className="pointer-events-none absolute top-3 left-3 z-10 rounded-md bg-red-500 px-2 py-1 text-[13px] font-semibold text-white shadow-sm">
      -{discount}%
    </span>
  );

  return (
    <>
      <div className="sm:hidden">
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {badge}
          {count > 1 && (
            <span className="absolute top-3 right-3 z-10 rounded-full bg-slate-900/70 px-2.5 py-0.5 text-[12px] font-medium text-white">
              {active + 1} / {count}
            </span>
          )}
          <ul
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label={`${title} images`}
          >
            {images.map((src, i) => (
              <li key={src} className="w-full shrink-0 snap-center">
                <button
                  type="button"
                  className="flex h-[300px] w-full items-center justify-center p-5"
                  onClick={() => setLightboxOpen(true)}
                  aria-label={`Open full view of image ${i + 1}`}
                >
                  <img
                    src={src}
                    alt={`${title} – image ${i + 1} of ${count}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    className="max-h-full max-w-full object-contain"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
        {count > 1 && (
          <div
            className="mt-3 flex justify-center gap-2"
            role="tablist"
            aria-label="Choose image"
          >
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Image ${i + 1}`}
                onClick={() => scrollCarouselTo(i)}
                className={clsx(
                  'h-2 rounded-full transition-all',
                  i === active ? 'w-5 bg-blue-500' : 'w-2 bg-slate-300'
                )}
              />
            ))}
          </div>
        )}
        <p className="mt-2 text-center text-[13px] text-slate-500">
          Tap image to see full view
        </p>
      </div>

      <div className="hidden sm:block">
        <div className="relative min-w-0 flex-1">
          <div
            ref={frameRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoom(null)}
            onClick={() => setLightboxOpen(true)}
            className={clsx(
              'relative flex aspect-square max-h-[500px] w-full items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm',
              zoom ? 'cursor-crosshair' : 'cursor-zoom-in'
            )}
          >
            {badge}
            <img
              data-testid="gallery-main-image"
              src={images[active]}
              alt={count > 1 ? `${title} – image ${active + 1} of ${count}` : title}
              className="pointer-events-none max-h-full max-w-full object-contain select-none"
            />
            {zoom && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute border border-blue-400 bg-blue-200/25"
                style={zoom.lens}
              />
            )}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setLightboxOpen(true);
              }}
              aria-label="Open full view"
              className="absolute right-3 bottom-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-600 shadow-sm hover:text-slate-900"
            >
              <ExpandIcon width={18} height={18} />
            </button>
          </div>

          {zoom && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-0 left-[calc(100%+24px)] z-30 hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl lg:block"
              style={{ width: zoom.frame.width * 1.15, height: zoom.frame.height }}
            >
              <div
                className="absolute flex items-center justify-center p-6"
                style={{
                  width: zoom.frame.width * ZOOM,
                  height: zoom.frame.height * ZOOM,
                  transform: `translate(${-zoom.lens.left * ZOOM}px, ${-zoom.lens.top * ZOOM}px)`,
                }}
              >
                <img
                  src={images[active]}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                  style={{ padding: 24 * (ZOOM - 1) }}
                />
              </div>
            </div>
          )}

          {count > 1 && (
            <ul
              className="mt-4 flex flex-wrap justify-center gap-2.5"
              aria-label="Image thumbnails"
            >
              {images.map((src, i) => (
                <li key={src}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-current={i === active}
                    className={clsx(
                      'flex h-[68px] w-[68px] items-center justify-center overflow-hidden rounded-lg border bg-white p-1.5 transition-shadow',
                      i === active
                        ? 'border-blue-500 shadow-[0_0_0_3px_rgba(59,130,246,0.25)]'
                        : 'border-slate-200 hover:border-slate-400'
                    )}
                  >
                    <img
                      src={src}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-3 text-center text-[13px] text-slate-500">
            <span className="hidden lg:inline">Roll over image to zoom in · </span>
            Click to see full view
          </p>
        </div>
      </div>

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          title={title}
          index={active}
          onIndexChange={(i) => {
            setActive(i);
            scrollCarouselTo(i);
          }}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
