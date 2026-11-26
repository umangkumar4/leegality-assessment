import { Link } from 'react-router';
import { EmptyState } from '@/shared/components';

export default function NotFoundPage({
  message = 'This page doesn’t exist.',
}: {
  message?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <EmptyState
        title="Not found"
        description={message}
        action={
          <Link to="/" className="text-sm font-medium text-blue-700 hover:underline">
            Go to all products
          </Link>
        }
      />
    </div>
  );
}
