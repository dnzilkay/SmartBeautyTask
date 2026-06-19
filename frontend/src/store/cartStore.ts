import { create } from 'zustand';
import type { CartItem, Product } from '@/lib/types';

interface CartState {
  items: Record<string, CartItem>;
  isOpen: boolean;
  addItem: (product: Product) => void;
  decrement: (productId: string) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: {},
  isOpen: false,

  addItem: (product) =>
    set((state) => {
      const existing = state.items[product.id];
      const quantity = existing ? existing.quantity + 1 : 1;
      return {
        items: {
          ...state.items,
          [product.id]: { product, quantity },
        },
      };
    }),

  decrement: (productId) =>
    set((state) => {
      const existing = state.items[productId];
      if (!existing) return state;

      if (existing.quantity <= 1) {
        return {
          items: Object.fromEntries(
            Object.entries(state.items).filter(([id]) => id !== productId),
          ),
        };
      }

      return {
        items: {
          ...state.items,
          [productId]: { ...existing, quantity: existing.quantity - 1 },
        },
      };
    }),

  removeItem: (productId) =>
    set((state) => {
      if (!state.items[productId]) return state;
      return {
        items: Object.fromEntries(
          Object.entries(state.items).filter(([id]) => id !== productId),
        ),
      };
    }),

  clear: () => set({ items: {} }),

  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),
  toggleDrawer: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export const selectCartItems = (state: CartState): CartItem[] =>
  Object.values(state.items);

export const selectTotalCount = (state: CartState): number =>
  Object.values(state.items).reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalPrice = (state: CartState): number =>
  Object.values(state.items).reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

export const selectQuantityOf =
  (productId: string) =>
  (state: CartState): number =>
    state.items[productId]?.quantity ?? 0;
