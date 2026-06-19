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

export interface SkinTypeTheme {
  orbGradient: string;
  surfaceGradient: string;
  accentBg: string;
  accentText: string;
  glow: string;
  features: string[];
  focus: string;
}

export const SKIN_TYPE_THEMES: Record<SkinType, SkinTypeTheme> = {
  dry: {
    orbGradient: 'from-sky-300 via-cyan-300 to-blue-400',
    surfaceGradient: 'from-sky-100/80 via-cyan-50/60 to-white/40',
    accentBg: 'bg-sky-500',
    accentText: 'text-sky-700',
    glow: 'from-sky-200/60 via-cyan-200/60 to-blue-200/60',
    features: [
      'Gün boyu gerginlik hissi',
      'Pul pul dökülme eğilimi',
      'Mat ve sönük görünüm',
      'Yoğun nem ihtiyacı',
    ],
    focus: 'Hyaluronik asit, seramid ve onarıcı yağlar',
  },
  oily: {
    orbGradient: 'from-amber-300 via-orange-300 to-rose-300',
    surfaceGradient: 'from-amber-100/80 via-orange-50/60 to-white/40',
    accentBg: 'bg-amber-500',
    accentText: 'text-amber-700',
    glow: 'from-amber-200/60 via-orange-200/60 to-rose-200/60',
    features: [
      'T-bölgesinde belirgin parlama',
      'Geniş gözenekler',
      'Sivilce eğilimi',
      'Sebum kontrolü ihtiyacı',
    ],
    focus: 'Niasinamid, salisilik asit ve mat bitiş losyonları',
  },
  combination: {
    orbGradient: 'from-violet-300 via-fuchsia-300 to-pink-300',
    surfaceGradient: 'from-violet-100/80 via-fuchsia-50/60 to-white/40',
    accentBg: 'bg-fuchsia-500',
    accentText: 'text-fuchsia-700',
    glow: 'from-violet-200/60 via-fuchsia-200/60 to-pink-200/60',
    features: [
      'T-bölgesi yağlı, yanaklar normal',
      'Bölgesel bakım gereksinimi',
      'Mevsimsel değişimler',
      'Dengeli rutin ihtiyacı',
    ],
    focus: 'Dengeleyici serumlar ve hafif nemlendiriciler',
  },
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
