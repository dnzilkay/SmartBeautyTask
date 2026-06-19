'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  selectQuantityOf,
  useCartStore,
} from '@/store/cartStore';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  featured?: boolean;
  enterIndex?: number;
}

const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const SLIDE_INTERVAL_MS = 1200;

export function ProductCard({
  product,
  featured = false,
  enterIndex,
}: ProductCardProps) {
  const quantity = useCartStore(selectQuantityOf(product.id));
  const addItem = useCartStore((s) => s.addItem);
  const decrement = useCartStore((s) => s.decrement);
  const openDrawer = useCartStore((s) => s.openDrawer);

  const images = product.images.length > 0 ? product.images : [''];
  const hasMultiple = images.length > 1;

  const [imageIndex, setImageIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const stopCycle = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startCycle = () => {
    if (!hasMultiple) return;
    stopCycle();
    intervalRef.current = window.setInterval(() => {
      setImageIndex((i) => (i + 1) % images.length);
    }, SLIDE_INTERVAL_MS);
  };

  const handleEnter = () => startCycle();
  const handleLeave = () => {
    stopCycle();
    setImageIndex(0);
  };

  useEffect(() => () => stopCycle(), []);

  const handleAdd = () => {
    addItem(product);
    openDrawer();
  };

  const enterStyle =
    enterIndex !== undefined
      ? ({ animationDelay: `${enterIndex * 70}ms` } as React.CSSProperties)
      : undefined;

  return (
    <article
      style={enterStyle}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className={[
        'group relative flex flex-col overflow-hidden',
        'rounded-3xl border border-white/60 bg-white/50 backdrop-blur-xl',
        'shadow-lg hover:shadow-2xl transition-all duration-300',
        featured ? 'md:row-span-2 md:col-span-2' : '',
        enterIndex !== undefined ? 'product-card-enter' : '',
      ].join(' ')}
    >
      <div
        className={[
          'relative w-full overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50',
          featured ? 'aspect-[4/3] md:aspect-auto md:flex-1' : 'aspect-[4/3]',
        ].join(' ')}
      >
        <Link
          href={`/products/${product.id}`}
          aria-label={`${product.name} ürün detayını görüntüle`}
          className="absolute inset-0 z-[1]"
        >
          {images.map((url, i) => (
            <Image
              key={url + i}
              src={url}
              alt={i === imageIndex ? product.name : ''}
              fill
              sizes={
                featured
                  ? '(min-width: 768px) 50vw, 100vw'
                  : '(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw'
              }
              className={[
                'absolute inset-0 object-cover transition-all duration-700 ease-out',
                i === imageIndex
                  ? 'opacity-100 scale-105'
                  : 'opacity-0 scale-100',
              ].join(' ')}
            />
          ))}
        </Link>

        {product.tag && (
          <span className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-medium bg-white/85 backdrop-blur-md text-rose-600 border border-white/60 shadow-sm">
            {product.tag}
          </span>
        )}

        {hasMultiple && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className={[
                  'h-1.5 rounded-full transition-all duration-300',
                  i === imageIndex
                    ? 'w-6 bg-white shadow-sm'
                    : 'w-1.5 bg-white/60',
                ].join(' ')}
              />
            ))}
          </div>
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
            <Link
              href={`/products/${product.id}`}
              className="transition-colors hover:text-rose-500 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              {product.name}
            </Link>
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
