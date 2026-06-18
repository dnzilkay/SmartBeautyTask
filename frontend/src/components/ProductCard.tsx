'use client';

import Image from 'next/image';
import {
  selectQuantityOf,
  useCartStore,
} from '@/store/cartStore';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
}

const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const quantity = useCartStore(selectQuantityOf(product.id));
  const addItem = useCartStore((s) => s.addItem);
  const decrement = useCartStore((s) => s.decrement);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const handleAdd = () => {
    addItem(product);
    openDrawer();
  };

  return (
    <article
      className={[
        'group relative flex flex-col overflow-hidden',
        'rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl',
        'shadow-lg hover:shadow-2xl transition-all duration-300',
        featured ? 'md:row-span-2 md:col-span-2' : '',
      ].join(' ')}
    >
      <div
        className={[
          'relative w-full overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50',
          featured ? 'aspect-[4/3] md:aspect-auto md:flex-1' : 'aspect-[4/3]',
        ].join(' ')}
      >
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes={featured ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw'}
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {product.tag && (
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium bg-white/80 backdrop-blur-md text-rose-600 border border-white/60 shadow-sm">
            {product.tag}
          </span>
        )}
      </div>

      <div className="flex flex-col p-5 gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
            {product.brand}
          </p>
          <h3
            className={[
              'font-semibold text-slate-900 mt-1 leading-tight',
              featured ? 'text-xl md:text-2xl' : 'text-base',
            ].join(' ')}
          >
            {product.name}
          </h3>
        </div>

        {featured && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="text-lg font-semibold text-slate-900">
            {priceFormatter.format(product.price)}
          </span>

          {quantity === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className="px-4 py-2 rounded-full text-sm font-medium text-white bg-slate-900 hover:bg-rose-500 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
            >
              Sepete Ekle
            </button>
          ) : (
            <div
              role="group"
              aria-label={`${product.name} adet kontrolü`}
              className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/70 backdrop-blur-md p-1"
            >
              <button
                type="button"
                onClick={() => decrement(product.id)}
                aria-label="Adeti azalt"
                className="h-7 w-7 grid place-items-center rounded-full text-slate-700 hover:bg-rose-50 transition-colors"
              >
                −
              </button>
              <span
                aria-live="polite"
                aria-label={`Sepette ${quantity} adet`}
                className="min-w-6 text-center text-sm font-medium tabular-nums text-slate-900"
              >
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => addItem(product)}
                aria-label="Adeti artır"
                className="h-7 w-7 grid place-items-center rounded-full text-slate-700 hover:bg-rose-50 transition-colors"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
