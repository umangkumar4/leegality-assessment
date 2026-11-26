import { useEffect, useRef, type ReactNode } from 'react';
import { CloseIcon } from './Icons';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Drawer({ open, onClose, title, children, footer }: DrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 flex w-[340px] max-w-[88vw] flex-col bg-slate-50 shadow-xl">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 px-5">
          <h2 className="text-[19px] font-semibold text-slate-900">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 inline-flex h-10 w-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
          >
            <CloseIcon width={22} height={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-5">
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-slate-200 bg-white px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
