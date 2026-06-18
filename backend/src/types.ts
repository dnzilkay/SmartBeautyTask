export type SkinType = 'dry' | 'oily' | 'combination';

export const SKIN_TYPES: readonly SkinType[] = ['dry', 'oily', 'combination'] as const;

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  currency: 'TRY';
  description: string;
  imageUrl: string;
  skinTypes: SkinType[];
  tag?: string;
}

export const isSkinType = (value: unknown): value is SkinType =>
  typeof value === 'string' && (SKIN_TYPES as readonly string[]).includes(value);
