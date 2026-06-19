import { describe, expect, it, vi } from 'vitest';
import { ApiError, fetchProduct, fetchProducts } from '@/lib/api';
import { mockProduct, mockProduct2 } from './fixtures';

function jsonResponse(payload: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(payload),
  } as unknown as Response;
}

describe('API helpers', () => {
  it('fetchProducts seçilen cilt tipini doğru endpoint ile getirir', async () => {
    const payload = {
      skinType: 'dry' as const,
      count: 1,
      products: [mockProduct],
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchProducts('dry')).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/api/products?skinType=dry',
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('fetchProducts 400 yanıtını anlamlı ApiError olarak döndürür', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 400)));

    await expect(fetchProducts('dry')).rejects.toMatchObject<ApiError>({
      name: 'ApiError',
      status: 400,
      message: 'Geçersiz cilt tipi.',
    });
  });

  it('ağ hatasını status 0 ApiError ile sarmalar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')));

    await expect(fetchProducts('oily')).rejects.toMatchObject<ApiError>({
      status: 0,
      message: 'Sunucuya ulaşılamadı. Backend çalışıyor mu?',
    });
  });

  it('abort hatasını değiştirmeden yukarı taşır', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abortError));

    await expect(fetchProducts('combination')).rejects.toBe(abortError);
  });

  it('fetchProduct ürün ve ilişkili ürünleri döndürür', async () => {
    const payload = {
      product: mockProduct,
      relatedProducts: [mockProduct2],
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(payload));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchProduct('p-test-1')).resolves.toEqual(payload);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:4000/api/products/p-test-1',
      expect.objectContaining({ cache: 'no-store' }),
    );
  });

  it('fetchProduct 404 yanıtını ürün bulunamadı hatasına çevirir', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, 404)));

    await expect(fetchProduct('bilinmeyen')).rejects.toMatchObject<ApiError>({
      status: 404,
      message: 'Aradığın ürün bulunamadı.',
    });
  });
});
