export function ProductDetailSkeleton() {
  return (
    <div
      className="flex animate-pulse gap-4"
      aria-busy="true"
      aria-label="Loading product"
    >
      <div className="hidden w-[68px] shrink-0 flex-col gap-2.5 sm:flex">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-[68px] rounded-lg bg-slate-200" />
        ))}
      </div>
      <div className="aspect-square max-h-[500px] flex-1 rounded-2xl bg-slate-200" />
    </div>
  );
}

export function ProductInfoSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-hidden="true">
      <div className="h-9 w-2/3 rounded bg-slate-200" />
      <div className="h-9 w-1/3 rounded bg-slate-200" />
      <div className="h-5 w-1/4 rounded bg-slate-200" />
      <div className="h-5 w-1/3 rounded bg-slate-200" />
      <div className="h-px bg-slate-200" />
      <div className="h-7 w-1/4 rounded bg-slate-200" />
      <div className="h-24 w-full rounded bg-slate-200" />
      <div className="h-px bg-slate-200" />
      <div className="h-7 w-1/5 rounded bg-slate-200" />
      <div className="h-16 w-full rounded bg-slate-200" />
    </div>
  );
}
