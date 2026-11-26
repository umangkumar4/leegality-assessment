import clsx from 'clsx';
import type { ReactNode } from 'react';

interface DetailSectionProps {
  id: string;
  title: string;
  className?: string;
  children: ReactNode;
}

export function DetailSection({ id, title, className, children }: DetailSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={clsx('scroll-mt-24 border-t border-slate-200 py-5', className)}
    >
      <h2 id={`${id}-heading`} className="mb-3 text-[18px] font-semibold text-slate-900">
        {title}
      </h2>
      {children}
    </section>
  );
}
