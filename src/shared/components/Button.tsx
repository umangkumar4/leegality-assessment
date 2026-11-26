import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-50',
  outline: 'border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50',
  ghost: 'text-slate-700 hover:bg-slate-100',
};

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
        'focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
