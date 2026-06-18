import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/types';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-slate-500 py-12">
        Bu cilt tipi için ürün bulunamadı.
      </p>
    );
  }

  const [featured, ...rest] = products;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-fr">
      <ProductCard product={featured} featured />
      {rest.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
