import type { InputHTMLAttributes, ReactNode } from 'react';
import { CheckIcon } from './Icons';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: ReactNode;
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2 text-[16px] lg:py-1 lg:text-[17px] text-slate-800 select-none">
      <span className="relative inline-flex h-[18px] w-[18px] shrink-0">
        <input
          type="checkbox"
          className="peer h-full w-full cursor-pointer appearance-none rounded-[3px] border border-slate-300 bg-white transition-colors checked:border-blue-500 checked:bg-blue-500 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-1 focus-visible:outline-none"
          {...props}
        />
        <CheckIcon className="pointer-events-none absolute inset-0.5 hidden h-[14px] w-[14px] text-white peer-checked:block" />
      </span>
      <span className={className}>{label}</span>
    </label>
  );
}
