# ShopLite – Product Listing & Detail (Leegality Frontend Assessment)

An Amazon-style product catalogue built with React + TypeScript on top of the
[DummyJSON products API](https://dummyjson.com/docs/products).

- **Live demo:** https://sage-crepe-7df013.netlify.app/
- **Repository:** https://github.com/umangkumar4/leegality-assessment

## Features

- Listing UI built to match the provided mockups: header with product search, filter sidebar, 4-column grid, numbered pagination
- **☰** toggles the filter sidebar on desktop (mockup 1 vs mockup 2) and opens it as a drawer on mobile
- Filters: **search** (title/brand), **categories** (multi-select, fetched from the API), **price range** (min/max + Apply) and **brands** (multi-select)
- The sidebar "Search…" box narrows the category/brand option lists
- Filters combine (AND across filters, OR within categories/brands) and reset pagination
- **Sorting**: Featured, price (low → high / high → low), customer rating, biggest discount — stored in the URL
- **Result count and removable filter chips** above the grid (one click per filter, plus *Clear all*, which keeps the chosen sort)
- **Product cards** show a discount badge, the list price, low-stock and out-of-stock labels, and the second image on hover
- **Instant detail pages**: hovering or focusing a card prefetches the product data and the detail page's code
- Filters and page live in the URL → preserved on **Back**, on refresh, and shareable as a link
- Product detail page (`/product/:id`) built on the mockup's layout (large image, price, rating, brand, category, description, reviews), extended with more API data:
  - Breadcrumb **Home › Category › Product** above the image. *Home* returns to the exact filtered listing and page the user came from, so it does the job of the Back button; the browser Back button works too
  - Amazon-style image gallery: thumbnails under the image (hover or click), hover-zoom with a lens and a zoomed pane beside the image, a full-screen viewer (arrows, ←/→ keys, Esc), and a swipeable carousel with dots and a counter on phones
  - breadcrumb, discount badge, original price and "Save x%", stock status (in stock / only N left / out of stock), tags
  - shipping, warranty and return-policy tiles, plus a specifications table (SKU, dimensions, minimum order, barcode, listing date)
  - review summary (average score and a bar per star level) and review cards with initials avatars and dates
  - "More from {category}" related products; *Home* from a related product still returns to the original filtered listing
- Loading skeletons, error states with retry, empty state with "Clear all filters", 404 handling
- Responsive (checked at 320–1440px): sidebar on desktop; on phones and tablets a **Filters** button with an active-filter count opens a drawer (Esc/backdrop to close, page scroll locked, sticky *Clear all / Show N results*). Two-column grid and scaled-down detail page on phones. Header icons are placeholders
- Unit + component tests

## Deployment

Deployed on Netlify (build command `npm run build`, publish directory `dist`).
`public/_redirects` sends every path to `index.html`, so deep links such as `/product/7`
work on refresh and when shared.

## Tech stack

| Concern | Choice | Why |
|---|---|---|
| Build | Vite | Fast dev server and builds |
| Language | TypeScript | Typed API contracts and safer refactors |
| Routing | React Router | `useSearchParams` for URL-driven filters, lazy routes |
| Server state | TanStack Query | Caching, loading/error states, retries, cache reuse across pages |
| Client UI state | Zustand | Tiny store for UI-only state (mobile filter drawer) |
| HTTP | Axios | One configured instance with a normalising error interceptor |
| Styling | Tailwind CSS | Utility-first, no heavy UI library |
| Testing | Vitest + React Testing Library; Playwright | Unit/component tests; end-to-end tests of real user flows |
| Quality | oxlint + Prettier | Linting and consistent formatting |

## Getting started

Requires Node 20+.

```bash
npm install
cp .env.example .env    # optional – defaults to https://dummyjson.com
npm run dev             # http://localhost:5173
```

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm test` / `npm run test:run` | Run unit and component tests (watch / once) |
| `npm run test:e2e` | Run end-to-end tests in Chromium (desktop and mobile). Needs network access; first run `npx playwright install chromium` |
| `npm run lint` | Lint with oxlint |
| `npm run format` | Format with Prettier |

## Project structure

Feature-based, inspired by Feature-Sliced Design (simplified for an app of this size).

```
src/
├── app/                 # App shell: providers, router, layout
├── pages/               # Thin route components that compose features
├── features/
│   ├── product-listing/ # Product grid and cards, products query
│   ├── product-filters/ # Filter/sort UI, URL filter state, pure filter logic
│   └── product-detail/  # Product query, gallery, info, specs, reviews
├── entities/product/    # Shared domain types + query-key factory
├── shared/              # Business-agnostic: UI kit, hooks, axios, utils, config
├── store/               # Zustand (UI-only state)
└── styles/
```

Every feature has the same shape:

```
<feature>/
├── api/          # plain request functions (*.api.ts), no React
├── hooks/        # all React hooks, including TanStack Query hooks
├── components/   # UI
├── utils/        # pure helpers (only when the feature has any)
├── types.ts      # feature-specific types (only when needed)
└── index.ts      # public API
```

Rules:

1. Features expose a public API through `index.ts`; nothing imports a feature's internals.
2. Dependencies flow one way: `app → pages → features → entities → shared`.
3. `shared/` has no product knowledge and could move to another project unchanged.
4. Imports use the `@/` alias, never long relative paths.

## Architectural decisions

### 1. Three-layer data access
`shared/lib/axios.ts` (HTTP client) → `features/*/api/*.api.ts` (plain async functions) →
`features/*/api/*.queries.ts` (TanStack Query hooks). Components only use the hooks, so they never
deal with URLs or error parsing, and the API functions can be tested or reused without React.

### 2. Where each piece of state lives
| State | Location | Reason |
|---|---|---|
| Products, categories, product detail | TanStack Query | Server data needs caching and refetching, not a global store |
| Filters + current page | URL query string | Survives Back/refresh, shareable, needs no extra persistence |
| Sidebar / mobile drawer open | Zustand | Global, client-only UI state shared by header and page |

### 3. Client-side price/brand filtering
DummyJSON can filter **only by category** on the server. Paging on the server while filtering
price and brand on the client would give wrong results (a "page" of 12 might contain 2 matches, and
page counts would be wrong). The full catalogue is ~194 products, so the app fetches the whole
(category-scoped) list with `limit=0` and filters and paginates on the client. This keeps results
correct and filter changes instant. With a large catalogue I'd move filtering to the backend.

The category filter still uses the dedicated `/products/category/{slug}` endpoint, as the spec
requires. Several selected categories are fetched in parallel (`useQueries`) and merged; each
category is cached separately, so toggling one never refetches the others.

### 4. Cache reuse
A shared query-key factory (`entities/product/queryKeys.ts`) lets the detail page show a product
from the cached listing instantly (`placeholderData`) while it fetches the full record.

### 5. Other details
- Header search is debounced (300 ms) and works from any page (it navigates to the listing).
- Price inputs are validated (no negatives, min ≤ max) and applied with **Apply** or Enter.
- Selected brands that don't exist in newly selected categories are dropped automatically.
- Filter changes use `replace` navigation so they don't flood browser history; page changes push entries.
- A stale `?page=` that no longer exists after filtering is clamped to the last page.
- The detail route is lazy-loaded (separate chunk).
- An `ErrorBoundary` catches unexpected render errors.

## Testing

- **Unit and component tests** (Vitest + Testing Library, `src/**/*.test.ts(x)`): filtering, sorting,
  pagination, price validation, URL-independent UI pieces (cards, chips, gallery, reviews, breadcrumb).
- **End-to-end tests** (Playwright, `e2e/`), run against the real DummyJSON API:
  - every filter combination, checked against an independent calculation from the full API catalogue
  - pagination reset, brand pruning, refresh persistence, chips, sorting, empty state
  - listing ↔ detail navigation keeps filters (breadcrumb, browser Back, related products), 404
  - image gallery (thumbnails, hover zoom, full view with keyboard)
  - mobile: filter drawer, carousel, no horizontal scrolling

## Assumptions

- **The mockups are the source of truth for the UI.** Where they differ from the written brief:
  - Categories use checkboxes, so several can be selected.
  - Price uses an Apply button. Categories, brands and search still update immediately.
  - The grid heading reads "Filters", exactly as in the mockup.
  - The mockup's numbered pagination under the detail image was replaced by Amazon-style thumbnails,
    which do the same job (switching between the product's images) in a more familiar way.
  - The brief asks for a Back button. The detail page uses a breadcrumb instead, whose *Home* link
    returns to the listing with the previous filters and page still applied.
  - The detail page shows reviews (from the API's `reviews` field), which the mockup includes but the
    written brief doesn't list.
- **Brand options come from the selected categories' products**, so only brands that actually exist
  there are listed.
- **About half of DummyJSON products have no brand** (e.g. groceries). They are hidden when a brand
  filter is active, and the brand filter shows an empty message for categories with no brands.
- **The price range is inclusive**, and an empty field means "no limit".
- **Multiple categories or brands use OR**, while different filters combine with AND.
- **Page size is 8** (two rows of four, as in the mockup).
- **Cart / account icons in the header are visual only**; there is no cart or auth in scope.
- **Prices are shown in USD**, as returned by the API.

## Improvements with more time

- Sorting (price, rating), also stored in the URL; working cart and account pages
- Price slider with a histogram of the current category
- Prefetch product details when a card is hovered
- Virtualised grid or infinite scroll for large catalogues; server-side filtering
- Accessibility audit (focus trap in the mobile drawer, axe checks in CI)
- CI pipeline (lint, type-check, test, build) and Husky pre-commit hooks
