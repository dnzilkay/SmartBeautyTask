import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartDrawer } from '@/components/CartDrawer';
import { selectQuantityOf, useCartStore } from '@/store/cartStore';
import { mockProduct, mockProduct2 } from './fixtures';

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

describe('CartDrawer', () => {
  beforeEach(() => {
    useCartStore.setState({
      isOpen: true,
      items: {
        [mockProduct.id]: { product: mockProduct, quantity: 2 },
        [mockProduct2.id]: { product: mockProduct2, quantity: 1 },
      },
    });
  });

  it('ürünleri, toplam adedi ve toplam fiyatı gösterir', () => {
    render(<CartDrawer />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct2.name)).toBeInTheDocument();
    expect(screen.getByText('3 ürün')).toBeInTheDocument();
    expect(screen.getByText(/900/)).toBeInTheDocument();
  });

  it('adet kontrolleri sepet miktarını günceller', async () => {
    useCartStore.setState({
      isOpen: true,
      items: {
        [mockProduct.id]: { product: mockProduct, quantity: 1 },
      },
    });
    const user = userEvent.setup();
    render(<CartDrawer />);

    await user.click(screen.getByRole('button', { name: 'Adeti artır' }));
    expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(2);

    await user.click(screen.getByRole('button', { name: 'Adeti azalt' }));
    expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(1);
  });

  it('ürünü sepetten tamamen çıkarır', async () => {
    const user = userEvent.setup();
    render(<CartDrawer />);

    await user.click(
      screen.getByRole('button', {
        name: `${mockProduct.name} ürününü sepetten çıkar`,
      }),
    );

    expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(0);
    expect(screen.queryByText(mockProduct.name)).not.toBeInTheDocument();
  });

  it('Escape ile kapanır ve body scroll kilidini temizler', async () => {
    const user = userEvent.setup();
    render(<CartDrawer />);

    expect(document.body.style.overflow).toBe('hidden');
    await user.keyboard('{Escape}');

    expect(useCartStore.getState().isOpen).toBe(false);
    expect(document.body.style.overflow).toBe('');
  });

  it('sepeti tamamen boşaltır', async () => {
    const user = userEvent.setup();
    render(<CartDrawer />);

    await user.click(screen.getByRole('button', { name: 'Sepeti boşalt' }));

    expect(screen.getByText('Sepetin boş')).toBeInTheDocument();
    expect(useCartStore.getState().items).toEqual({});
  });
});
