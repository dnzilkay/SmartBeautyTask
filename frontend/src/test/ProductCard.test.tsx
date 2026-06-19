import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '@/components/ProductCard';
import {
  selectCartItems,
  selectQuantityOf,
  useCartStore,
} from '@/store/cartStore';
import { mockProduct } from './fixtures';

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

describe('ProductCard', () => {
  it('ürün bilgilerini doğru gösterir', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(/250/)).toBeInTheDocument();
    expect(
      screen.getByRole('link', {
        name: `${mockProduct.name} ürün detayını görüntüle`,
      }),
    ).toHaveAttribute('href', `/products/${mockProduct.id}`);
  });

  it('"Sepete Ekle" tıklanınca ürün store\'a eklenir', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    await user.click(screen.getByRole('button', { name: /Sepete Ekle/i }));

    expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(1);
    expect(selectCartItems(useCartStore.getState())).toHaveLength(1);
  });

  it('"Sepete Ekle" tıklanınca drawer açılır', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    await user.click(screen.getByRole('button', { name: /Sepete Ekle/i }));

    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it('quantity > 0 olduğunda adet kontrolü gösterir', () => {
    useCartStore.setState({
      items: { [mockProduct.id]: { product: mockProduct, quantity: 2 } },
    });

    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Sepete Ekle/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Adeti azalt/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Adeti artır/i }),
    ).toBeInTheDocument();
  });

  it('"+" butonu quantity\'i artırır', async () => {
    const user = userEvent.setup();
    useCartStore.setState({
      items: { [mockProduct.id]: { product: mockProduct, quantity: 1 } },
    });

    render(<ProductCard product={mockProduct} />);
    await user.click(screen.getByRole('button', { name: /Adeti artır/i }));

    expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(2);
  });

  it('"−" butonu quantity\'i azaltır; 0 olunca üründen çıkar', async () => {
    const user = userEvent.setup();
    useCartStore.setState({
      items: { [mockProduct.id]: { product: mockProduct, quantity: 1 } },
    });

    render(<ProductCard product={mockProduct} />);
    await user.click(screen.getByRole('button', { name: /Adeti azalt/i }));

    expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(0);
  });
});
