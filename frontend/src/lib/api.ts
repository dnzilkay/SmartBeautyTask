import type {
  ProductDetailResponse,
  ProductsResponse,
  SkinType,
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function fetchProducts(
  skinType: SkinType,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  const url = `${API_URL}/api/products?skinType=${encodeURIComponent(skinType)}`;

  let response: Response;
  try {
    response = await fetch(url, { signal, cache: 'no-store' });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause;
    }
    throw new ApiError(0, 'Sunucuya ulaşılamadı. Backend çalışıyor mu?');
  }

  if (!response.ok) {
    const message =
      response.status === 400
        ? 'Geçersiz cilt tipi.'
        : `Beklenmeyen sunucu hatası (${response.status}).`;
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as ProductsResponse;
}

export async function fetchProduct(
  productId: string,
  signal?: AbortSignal,
): Promise<ProductDetailResponse> {
  const url = `${API_URL}/api/products/${encodeURIComponent(productId)}`;

  let response: Response;
  try {
    response = await fetch(url, { signal, cache: 'no-store' });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause;
    }
    throw new ApiError(0, 'Sunucuya ulaşılamadı. Backend çalışıyor mu?');
  }

  if (!response.ok) {
    const message =
      response.status === 404
        ? 'Aradığın ürün bulunamadı.'
        : `Beklenmeyen sunucu hatası (${response.status}).`;
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as ProductDetailResponse;
}
