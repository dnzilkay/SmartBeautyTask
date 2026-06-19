import type { Product } from '@/lib/types';

export const mockProduct: Product = {
  id: 'p-test-1',
  name: 'Test Serum',
  brand: 'Test Brand',
  price: 250,
  currency: 'TRY',
  description: 'Test ürünü.',
  images: ['https://example.com/test.jpg'],
  skinTypes: ['dry'],
};

export const mockProduct2: Product = {
  id: 'p-test-2',
  name: 'Test Krem',
  brand: 'Test Brand',
  price: 400,
  currency: 'TRY',
  description: 'İkinci test ürünü.',
  images: ['https://example.com/test2.jpg'],
  skinTypes: ['oily'],
};
