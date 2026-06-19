import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductDetail } from '@/components/ProductDetail';
import { selectQuantityOf, useCartStore } from '@/store/cartStore';
import { mockProduct, mockProduct2 } from './fixtures';

const { fetchProductMock } = vi.hoisted(() => ({
  fetchProductMock: vi.fn(),
}));

vi.mock('@/lib/api', () => {
  class MockApiError extends Error {
    constructor(
      public readonly status: number,
      message: string,
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }

  return {
    ApiError: MockApiError,
    fetchProduct: fetchProductMock,
  };
});

vi.mock('@/components/ProductGallery', () => ({
  ProductGallery: ({ product }: { product: { name: string } }) => (
    <div>{product.name} galerisi</div>
  ),
}));

vi.mock('@/components/ProductCard', () => ({
  ProductCard: ({ product }: { product: { name: string } }) => (
    <article>{product.name}</article>
  ),
}));

describe('ProductDetail', () => {
  beforeEach(() => {
    fetchProductMock.mockReset();
  });

  it('istek tamamlanana kadar loading görünümünü gösterir', () => {
    fetchProductMock.mockReturnValue(new Promise(() => {}));

    render(<ProductDetail productId={mockProduct.id} />);

    expect(
      screen.getByLabelText('Ürün bilgileri yükleniyor'),
    ).toBeInTheDocument();
  });

  it('ürün bilgilerini ve ilişkili ürünleri gösterir', async () => {
    fetchProductMock.mockResolvedValue({
      product: mockProduct,
      relatedProducts: [mockProduct2],
    });

    render(<ProductDetail productId={mockProduct.id} />);

    expect(
      await screen.findByRole('heading', { level: 1, name: mockProduct.name }),
    ).toBeInTheDocument();
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(screen.getByText('Kuru cilt')).toBeInTheDocument();
    expect(screen.getByText(mockProduct2.name)).toBeInTheDocument();
  });

  it('sepete ekleme ürün adedini artırır ve drawerı açar', async () => {
    fetchProductMock.mockResolvedValue({
      product: mockProduct,
      relatedProducts: [],
    });
    const user = userEvent.setup();
    render(<ProductDetail productId={mockProduct.id} />);

    await user.click(
      await screen.findByRole('button', { name: 'Sepete Ekle' }),
    );

    expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(1);
    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it('API hatasını kullanıcıya gösterir', async () => {
    const { ApiError } = await import('@/lib/api');
    fetchProductMock.mockRejectedValue(
      new ApiError(404, 'Aradığın ürün bulunamadı.'),
    );

    render(<ProductDetail productId="bilinmeyen" />);

    expect(
      await screen.findByRole('heading', { name: 'Ürüne ulaşamadık' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Aradığın ürün bulunamadı.')).toBeInTheDocument();
  });

  it('component kaldırıldığında devam eden isteği iptal eder', () => {
    let requestSignal: AbortSignal | undefined;
    fetchProductMock.mockImplementation(
      (_productId: string, signal?: AbortSignal) => {
        requestSignal = signal;
        return new Promise(() => {});
      },
    );

    const { unmount } = render(<ProductDetail productId={mockProduct.id} />);
    unmount();

    expect(requestSignal?.aborted).toBe(true);
  });
});
