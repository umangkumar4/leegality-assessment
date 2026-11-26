import clsx from 'clsx';
import type { ReactNode } from 'react';

interface FilterSectionProps {
  title: string;
  strong?: boolean;
  children: ReactNode;
}

export function FilterSection({ title, strong = false, children }: FilterSectionProps) {
  return (
    <fieldset className="border-t border-slate-200 pt-5 pb-5">
      <legend className="sr-only">{title}</legend>
      <h3
        aria-hidden="true"
        className={clsx(
          'mb-3 text-[19px] text-slate-900',
          strong ? 'font-semibold' : 'font-normal'
        )}
      >
        {title}
      </h3>
      {children}
    </fieldset>
  );
}
