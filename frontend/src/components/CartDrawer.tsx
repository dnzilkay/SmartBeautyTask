'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { useShallow } from 'zustand/react/shallow';
import {
  selectCartItems,
  selectTotalCount,
  selectTotalPrice,
  useCartStore,
} from '@/store/cartStore';

const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore(useShallow(selectCartItems));
  const totalCount = useCartStore(selectTotalCount);
  const totalPrice = useCartStore(selectTotalPrice);
  const addItem = useCartStore((s) => s.addItem);
  const decrement = useCartStore((s) => s.decrement);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, closeDrawer]);

  return (
    <>
      <button
        type="button"
        aria-label="Sepeti kapat"
        tabIndex={isOpen ? 0 : -1}
        onClick={closeDrawer}
        className={[
          'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-heading"
        className={[
          'fixed top-0 right-0 z-50 h-full w-full max-w-md',
          'bg-white/90 backdrop-blur-2xl border-l border-white/60 shadow-2xl',
          'flex flex-col',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <header className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60">
          <div>
            <h2
              id="cart-heading"
              className="text-lg font-semibold text-slate-900"
            >
              Sepetim
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {totalCount === 0 ? 'Henüz ürün yok' : `${totalCount} ürün`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Sepeti kapat"
            className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <svg
              className="h-5 w-5 text-slate-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="h-full grid place-items-center text-center">
              <div>
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-rose-100 to-amber-100 grid place-items-center mb-4">
                  <svg
                    className="h-7 w-7 text-rose-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-slate-700 font-medium">Sepetin boş</p>
                <p className="text-sm text-slate-500 mt-1">
                  Beğendiğin ürünleri ekleyince burada görünecekler.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(({ product, quantity }) => (
                <li
                  key={product.id}
                  className="flex gap-4 p-3 rounded-2xl bg-white/60 border border-white/70"
                >
                  <div className="relative h-20 w-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-rose-50 to-amber-50">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-medium text-slate-900 leading-snug truncate">
                      {product.name}
                    </h3>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-0.5">
                        <button
                          type="button"
                          onClick={() => decrement(product.id)}
                          aria-label="Adeti azalt"
                          className="h-6 w-6 grid place-items-center rounded-full hover:bg-rose-50 text-slate-700 transition-colors"
                        >
                          −
                        </button>
                        <span
                          aria-live="polite"
                          className="min-w-5 text-center text-xs font-medium tabular-nums text-slate-900"
                        >
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => addItem(product)}
                          aria-label="Adeti artır"
                          className="h-6 w-6 grid place-items-center rounded-full hover:bg-rose-50 text-slate-700 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-slate-900 tabular-nums">
                        {priceFormatter.format(product.price * quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(product.id)}
                    aria-label={`${product.name} ürününü sepetten çıkar`}
                    className="self-start h-7 w-7 grid place-items-center rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-slate-200/60 px-6 py-5 space-y-4 bg-white/60">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Toplam</span>
              <span
                className="text-2xl font-semibold text-slate-900 tabular-nums"
                aria-live="polite"
              >
                {priceFormatter.format(totalPrice)}
              </span>
            </div>
            <button
              type="button"
              className="w-full py-3 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-rose-500 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
            >
              Ödemeye Geç
            </button>
            <button
              type="button"
              onClick={clear}
              className="w-full text-xs font-medium text-slate-500 hover:text-rose-500 transition-colors"
            >
              Sepeti boşalt
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
