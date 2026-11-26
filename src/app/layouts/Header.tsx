import { useLocation, useNavigate } from 'react-router';
import { ProductSearchBar } from '@/features/product-filters';
import { CartIcon, MenuIcon, UserCircleIcon, UserIcon } from '@/shared/components';
import { useUiStore } from '@/store/ui.store';

const DESKTOP_QUERY = '(min-width: 1024px)';

const iconButton =
  'inline-flex h-11 w-11 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none';

export function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toggleSidebar, openFilterDrawer } = useUiStore();

  const handleMenu = () => {
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    if (pathname !== '/') {
      if (!isDesktop) openFilterDrawer();
      navigate('/');
      return;
    }
    if (isDesktop) toggleSidebar();
    else openFilterDrawer();
  };

  return (
    <header className="sticky top-0 z-30 bg-[#344255] shadow-sm">
      <div className="grid h-[72px] grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:grid-cols-[1fr_minmax(0,620px)_1fr] sm:px-8 lg:px-14">
        <button
          type="button"
          className={`${iconButton} justify-self-start`}
          onClick={handleMenu}
          aria-label="Toggle filters"
        >
          <MenuIcon width={30} height={30} strokeWidth={2.5} />
        </button>

        <div className="w-full min-w-0">
          <ProductSearchBar />
        </div>

        <div className="hidden items-center gap-3 justify-self-end sm:flex">
          <button type="button" className={iconButton} aria-label="Cart (coming soon)">
            <CartIcon width={30} height={30} />
          </button>
          <button type="button" className={iconButton} aria-label="Account (coming soon)">
            <UserCircleIcon width={30} height={30} />
          </button>
          <button type="button" className={iconButton} aria-label="Profile (coming soon)">
            <UserIcon width={30} height={30} />
          </button>
        </div>
      </div>
    </header>
  );
}
