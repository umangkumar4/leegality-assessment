import { useCallback, useEffect, useMemo } from 'react';
import type { Product } from '@/entities/product';
import { usePrefetchProduct } from '@/features/product-detail';
import {
  ActiveFilters,
  FilterPanel,
  SortSelect,
  applyFilters,
  extractBrands,
  sortProducts,
  useProductFilters,
} from '@/features/product-filters';
import {
  ProductGrid,
  ProductGridSkeleton,
  useProductsQuery,
} from '@/features/product-listing';
import {
  Button,
  Drawer,
  EmptyState,
  ErrorState,
  Pagination,
  SearchIcon,
  SlidersIcon,
} from '@/shared/components';
import { PAGE_SIZE } from '@/shared/config/constants';
import { paginate } from '@/shared/utils/paginate';
import { useUiStore } from '@/store/ui.store';

export default function ProductListingPage() {
  const {
    filters,
    page,
    sort,
    setQuery,
    setSort,
    setCategories,
    setPriceRange,
    setBrands,
    setPage,
    clearFilters,
    activeFilterCount,
  } = useProductFilters();

  const {
    data: products,
    isPending,
    isError,
    error,
    refetch,
    isPlaceholderData,
  } = useProductsQuery(filters.categories);

  const availableBrands = useMemo(() => extractBrands(products), [products]);

  useEffect(() => {
    if (isPending || isPlaceholderData || filters.brands.length === 0) return;
    const stillAvailable = filters.brands.filter((b) => availableBrands.includes(b));
    if (stillAvailable.length !== filters.brands.length) setBrands(stillAvailable);
  }, [availableBrands, filters.brands, isPending, isPlaceholderData, setBrands]);

  const filtered = useMemo(() => applyFilters(products, filters), [products, filters]);
  const sorted = useMemo(() => sortProducts(filtered, sort), [filtered, sort]);
  const { items, totalPages, page: currentPage } = paginate(sorted, page, PAGE_SIZE);

  const prefetchProduct = usePrefetchProduct();
  const handleProductIntent = useCallback(
    (product: Product) => {
      void prefetchProduct(product.id);
      void import('./ProductDetailPage');
    },
    [prefetchProduct]
  );

  const { isSidebarOpen, isFilterDrawerOpen, openFilterDrawer, closeFilterDrawer } =
    useUiStore();

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const onChange = () => desktop.matches && closeFilterDrawer();
    desktop.addEventListener('change', onChange);
    return () => desktop.removeEventListener('change', onChange);
  }, [closeFilterDrawer]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const filterPanel = (
    <FilterPanel
      filters={filters}
      availableBrands={availableBrands}
      onCategoriesChange={setCategories}
      onPriceApply={setPriceRange}
      onBrandsChange={setBrands}
    />
  );

  const renderResults = () => {
    if (isPending) return <ProductGridSkeleton />;
    if (isError) {
      return (
        <ErrorState
          title="Couldn’t load products"
          message={error?.message}
          onRetry={() => refetch()}
        />
      );
    }
    if (items.length === 0) {
      return (
        <EmptyState
          title="No products match your filters"
          description="Try a different search, widen the price range or remove a brand."
          action={<Button onClick={clearFilters}>Clear all filters</Button>}
        />
      );
    }
    return (
      <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : undefined}>
        <ProductGrid products={items} onProductIntent={handleProductIntent} />
      </div>
    );
  };

  return (
    <div className="flex">
      {isSidebarOpen && (
        <aside className="hidden w-[340px] shrink-0 border-r border-slate-200 bg-slate-50 lg:block">
          <div className="sticky top-[72px] max-h-[calc(100vh-72px)] overflow-y-auto px-9 pt-6 pb-8">
            {filterPanel}
          </div>
        </aside>
      )}

      <Drawer
        open={isFilterDrawerOpen}
        onClose={closeFilterDrawer}
        title="Filters"
        footer={
          <div className="flex gap-3">
            {activeFilterCount > 0 && (
              <Button variant="secondary" className="h-11 flex-1" onClick={clearFilters}>
                Clear all
              </Button>
            )}
            <Button className="h-11 flex-[2]" onClick={closeFilterDrawer}>
              Show {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </Button>
          </div>
        }
      >
        {filterPanel}
      </Drawer>

      <section className="min-w-0 flex-1 px-4 pt-6 pb-10 sm:px-8 sm:pt-8 sm:pb-12">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="flex items-center gap-2 text-[22px] font-semibold text-slate-900 sm:text-[26px]">
            <SearchIcon
              className="h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]"
              strokeWidth={3}
            />
            Filters
          </h1>
          <Button variant="outline" className="h-10 lg:hidden" onClick={openFilterDrawer}>
            <SlidersIcon width={18} height={18} />
            Filters
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs text-white">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-[14px] text-slate-600" aria-live="polite">
              {isPending ? (
                'Loading products…'
              ) : (
                <>
                  <span className="font-semibold text-slate-900">{filtered.length}</span>{' '}
                  {filtered.length === 1 ? 'result' : 'results'}
                  {filters.query && (
                    <>
                      {' '}
                      for{' '}
                      <span className="font-semibold text-slate-900">
                        “{filters.query}”
                      </span>
                    </>
                  )}
                </>
              )}
            </p>
            <ActiveFilters
              filters={filters}
              onRemoveQuery={() => setQuery('')}
              onRemoveCategory={(slug) =>
                setCategories(filters.categories.filter((c) => c !== slug))
              }
              onRemovePrice={() => setPriceRange(null, null)}
              onRemoveBrand={(brand) =>
                setBrands(filters.brands.filter((b) => b !== brand))
              }
              onClearAll={clearFilters}
            />
          </div>
          <SortSelect value={sort} onChange={setSort} />
        </div>

        {renderResults()}

        {!isPending && !isError && (
          <div className="mt-8">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </section>
    </div>
  );
}
