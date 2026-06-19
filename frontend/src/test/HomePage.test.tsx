import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';
import { mockProduct } from './fixtures';

const { fetchProductsMock } = vi.hoisted(() => ({
  fetchProductsMock: vi.fn(),
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
    fetchProducts: fetchProductsMock,
  };
});

vi.mock('@/components/IntroScreen', () => ({
  IntroScreen: ({ onStart }: { onStart: () => void }) => (
    <button type="button" onClick={onStart}>
      Analizi başlat
    </button>
  ),
}));

vi.mock('@/components/SkinTypeSelector', () => ({
  SkinTypeSelector: ({ onSelect }: { onSelect: (skinType: 'dry') => void }) => (
    <button type="button" onClick={() => onSelect('dry')}>
      Kuru cildi seç
    </button>
  ),
}));

vi.mock('@/components/ProductSkeleton', () => ({
  ProductSkeleton: () => <div>Analiz sürüyor</div>,
}));

vi.mock('@/components/ProductGrid', () => ({
  ProductGrid: ({ products }: { products: Array<{ name: string }> }) => (
    <div>{products.map((product) => product.name).join(', ')}</div>
  ),
}));

describe('HomePage flow', () => {
  beforeEach(() => {
    fetchProductsMock.mockReset();
  });

  it('giriş ekranından cilt tipi seçimine geçer', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Analizi başlat' }));

    expect(
      screen.getByRole('button', { name: 'Kuru cildi seç' }),
    ).toBeInTheDocument();
  });

  it('seçim sonrası loading gösterip ürün sonucuna geçer', async () => {
    const payload = {
      skinType: 'dry',
      count: 1,
      products: [mockProduct],
    };
    let resolveRequest!: (value: typeof payload) => void;
    fetchProductsMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Analizi başlat' }));
    await user.click(screen.getByRole('button', { name: 'Kuru cildi seç' }));

    expect(screen.getByText('Analiz sürüyor')).toBeInTheDocument();
    await act(async () => resolveRequest(payload));
    expect(await screen.findByText(mockProduct.name)).toBeInTheDocument();
    expect(fetchProductsMock).toHaveBeenCalledWith('dry', expect.any(AbortSignal));
  });

  it('API hatasında hata ekranını ve tekrar deneme aksiyonunu gösterir', async () => {
    const { ApiError } = await import('@/lib/api');
    fetchProductsMock.mockRejectedValue(new ApiError(503, 'Servis kullanılamıyor.'));
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Analizi başlat' }));
    await user.click(screen.getByRole('button', { name: 'Kuru cildi seç' }));

    expect(
      await screen.findByRole('heading', { name: 'Bir şeyler ters gitti' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Servis kullanılamıyor.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Tekrar dene' }),
    ).toBeInTheDocument();
  });
});
