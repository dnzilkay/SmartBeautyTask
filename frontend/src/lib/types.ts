export type SkinType = 'dry' | 'oily' | 'combination';

export const SKIN_TYPES: readonly SkinType[] = ['dry', 'oily', 'combination'] as const;

export const SKIN_TYPE_LABELS: Record<SkinType, string> = {
  dry: 'Kuru',
  oily: 'Yağlı',
  combination: 'Karma',
};

export const SKIN_TYPE_DESCRIPTIONS: Record<SkinType, string> = {
  dry: 'Yoğun nem ve onarıcı bakım arayanlar için',
  oily: 'Dengeleyici ve mat bitişli formüller',
  combination: 'Hem T-bölgesi hem yanaklar için denge',
};

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

export interface ProductsResponse {
  skinType: SkinType;
  count: number;
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
