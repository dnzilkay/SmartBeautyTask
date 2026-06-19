'use client';

import { selectTotalCount, useCartStore } from '@/store/cartStore';

export function CartButton() {
  const totalCount = useCartStore(selectTotalCount);
  const toggleDrawer = useCartStore((s) => s.toggleDrawer);

  if (totalCount === 0) return null;

  return (
    <button
      type="button"
      onClick={toggleDrawer}
      aria-label={`Sepeti aç — ${totalCount} ürün`}
      className="cart-button-enter relative inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg px-4 py-2.5 hover:bg-white/90 hover:shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
    >
      <svg
        className="h-5 w-5 text-slate-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
      <span className="text-sm font-medium text-slate-800">Sepet</span>

      {totalCount > 0 && (
        <span
          aria-hidden
          className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1.5 grid place-items-center rounded-full bg-rose-500 text-white text-xs font-semibold shadow-md"
        >
          {totalCount}
        </span>
      )}
    </button>
  );
}
