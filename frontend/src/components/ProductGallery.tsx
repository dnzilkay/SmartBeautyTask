'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';

interface ProductGalleryProps {
  product: Product;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = product.images.length > 0 ? product.images : [''];

  return (
    <div className="grid gap-4 lg:grid-cols-[5rem_1fr]">
      <div className="order-2 flex gap-3 lg:order-1 lg:flex-col">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`${product.name} görsel ${index + 1}`}
            aria-pressed={activeIndex === index}
            className={[
              'relative aspect-square w-16 overflow-hidden rounded-2xl border bg-white/60 transition-all duration-300 lg:w-20',
              activeIndex === index
                ? 'border-rose-300 shadow-lg ring-2 ring-rose-200/70'
                : 'border-white/70 opacity-65 hover:opacity-100',
            ].join(' ')}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/70 bg-white/50 shadow-2xl shadow-rose-200/30 lg:order-2">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-rose-100/70 via-white/20 to-sky-100/60"
        />
        {images.map((image, index) => (
          <Image
            key={`${image}-large`}
            src={image}
            alt={index === activeIndex ? product.name : ''}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className={[
              'object-cover transition-all duration-700 ease-out',
              activeIndex === index
                ? 'scale-100 opacity-100'
                : 'scale-105 opacity-0',
            ].join(' ')}
          />
        ))}
        <span className="absolute bottom-5 right-5 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-xs font-medium text-slate-700 shadow-lg backdrop-blur-xl">
          {activeIndex + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}
