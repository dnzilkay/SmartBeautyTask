import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductGallery } from '@/components/ProductGallery';
import { mockProduct } from './fixtures';

vi.mock('next/image', () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

describe('ProductGallery', () => {
  it('thumbnail seçildiğinde aktif büyük görseli değiştirir', async () => {
    const product = {
      ...mockProduct,
      images: ['/products/first.png', '/products/second.png'],
    };
    const user = userEvent.setup();
    render(<ProductGallery product={product} />);

    expect(screen.getByRole('img', { name: product.name })).toHaveAttribute(
      'src',
      product.images[0],
    );

    await user.click(
      screen.getByRole('button', { name: `${product.name} görsel 2` }),
    );

    expect(screen.getByRole('img', { name: product.name })).toHaveAttribute(
      'src',
      product.images[1],
    );
  });
});
