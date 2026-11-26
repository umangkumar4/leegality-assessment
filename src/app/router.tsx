import { createBrowserRouter } from 'react-router';
import NotFoundPage from '@/pages/NotFoundPage';
import { Spinner } from '@/shared/components';
import ProductListingPage from '@/pages/ProductListingPage';
import { MainLayout } from './layouts/MainLayout';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    hydrateFallbackElement: <Spinner />,
    children: [
      { index: true, element: <ProductListingPage /> },
      {
        path: 'product/:id',
        lazy: async () => ({
          Component: (await import('@/pages/ProductDetailPage')).default,
        }),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
