import { useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router';
import { SearchIcon } from '@/shared/components';
import { SEARCH_DEBOUNCE_MS } from '@/shared/config/constants';
import { useDebouncedCallback } from '@/shared/hooks/useDebouncedCallback';
import { FILTER_PARAMS, useProductFilters } from '../hooks/useProductFilters';

export function ProductSearchBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setQuery } = useProductFilters();

  const isListing = pathname === '/';
  const urlQuery = isListing ? (searchParams.get(FILTER_PARAMS.query) ?? '') : '';

  const [value, setValue] = useState(urlQuery);
  const [synced, setSynced] = useState(urlQuery);
  if (synced !== urlQuery) {
    setSynced(urlQuery);
    setValue(urlQuery);
  }

  const commit = useDebouncedCallback((next: string) => {
    if (isListing) setQuery(next);
  }, SEARCH_DEBOUNCE_MS);

  const submit = () => {
    if (!isListing) {
      const params = new URLSearchParams();
      if (value.trim()) params.set(FILTER_PARAMS.query, value.trim());
      navigate({ pathname: '/', search: params.toString() });
    } else {
      setQuery(value);
    }
  };

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <label>
        <span className="sr-only">Search products</span>
        <SearchIcon
          width={22}
          height={22}
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-500"
        />
        <input
          type="search"
          placeholder="Search products..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            commit(e.target.value);
          }}
          className="h-[50px] w-full rounded-md border-0 bg-white pr-4 pl-14 text-[18px] text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </label>
    </form>
  );
}
