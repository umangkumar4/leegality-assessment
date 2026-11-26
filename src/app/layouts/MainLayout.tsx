import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { Spinner } from '@/shared/components';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Suspense fallback={<Spinner />}>
          <Outlet />
        </Suspense>
      </main>
      <ScrollRestoration />
    </div>
  );
}
