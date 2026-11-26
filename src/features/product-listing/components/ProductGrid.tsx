import type { Product } from '@/entities/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  backTo?: string;
  onProductIntent?: (product: Product) => void;
}

export function ProductGrid({ products, backTo, onProductIntent }: ProductGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="flex">
          <ProductCard product={product} backTo={backTo} onIntent={onProductIntent} />
        </li>
      ))}
    </ul>
  );
}
