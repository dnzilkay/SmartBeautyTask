'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SkinTypeSelector } from '@/components/SkinTypeSelector';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductSkeleton } from '@/components/ProductSkeleton';
import { ApiError, fetchProducts } from '@/lib/api';
import {
  SKIN_TYPE_LABELS,
  type Product,
  type SkinType,
} from '@/lib/types';

type Phase =
  | { status: 'selecting' }
  | { status: 'loading'; skinType: SkinType }
  | { status: 'results'; skinType: SkinType; products: Product[] }
  | { status: 'error'; skinType: SkinType; message: string };

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>({ status: 'selecting' });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const runFetch = useCallback(async (skinType: SkinType) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setPhase({ status: 'loading', skinType });

    try {
      const data = await fetchProducts(skinType, controller.signal);
      if (controller.signal.aborted) return;
      setPhase({ status: 'results', skinType, products: data.products });
    } catch (err) {
      if (controller.signal.aborted) return;
      if (err instanceof DOMException && err.name === 'AbortError') return;
      const message =
        err instanceof ApiError ? err.message : 'Beklenmeyen bir hata oluştu.';
      setPhase({ status: 'error', skinType, message });
    }
  }, []);

  const handleSelect = useCallback(
    (skinType: SkinType) => {
      void runFetch(skinType);
    },
    [runFetch],
  );

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setPhase({ status: 'selecting' });
  }, []);

  if (phase.status === 'selecting') {
    return <SkinTypeSelector onSelect={handleSelect} />;
  }

  if (phase.status === 'loading') {
    return <ProductSkeleton />;
  }

  if (phase.status === 'error') {
    return (
      <section className="text-center max-w-md mx-auto" aria-live="polite">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-4">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 mb-2">
          Bir şeyler ters gitti
        </h2>
        <p className="text-slate-600 mb-6">{phase.message}</p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => runFetch(phase.skinType)}
            className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-rose-500 transition-colors"
          >
            Tekrar dene
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-2.5 rounded-full border border-slate-300 text-sm font-medium text-slate-700 hover:bg-white/60 transition-colors"
          >
            Geri dön
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-500/80 mb-2">
            Sana özel
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
            {SKIN_TYPE_LABELS[phase.skinType]} cilt için öneriler
          </h2>
          <p className="mt-2 text-slate-600">
            {phase.products.length} ürün senin için seçildi.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 bg-white/60 backdrop-blur-md text-sm font-medium text-slate-700 hover:bg-white/90 transition-colors"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Cilt tipini değiştir
        </button>
      </header>

      <ProductGrid products={phase.products} />
    </section>
  );
}
