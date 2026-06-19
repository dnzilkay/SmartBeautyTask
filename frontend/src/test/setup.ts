import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { useCartStore } from '@/store/cartStore';

afterEach(() => {
  cleanup();
  useCartStore.setState({ items: {}, isOpen: false });
  document.body.style.overflow = '';
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
