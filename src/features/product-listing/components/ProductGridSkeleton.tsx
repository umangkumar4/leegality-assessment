export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <ul
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }, (_, i) => (
        <li
          key={i}
          className="animate-pulse rounded-md border border-slate-200 bg-white px-3 pt-3 pb-4 sm:px-3.5 sm:pt-4 sm:pb-5"
        >
          <div className="h-[130px] rounded bg-slate-200 sm:h-[185px]" />
          <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
          <div className="mt-3 h-5 w-1/2 rounded bg-slate-200" />
        </li>
      ))}
    </ul>
  );
}
