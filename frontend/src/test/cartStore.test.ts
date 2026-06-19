import { describe, it, expect, beforeEach } from 'vitest';
import {
  selectCartItems,
  selectQuantityOf,
  selectTotalCount,
  selectTotalPrice,
  useCartStore,
} from '@/store/cartStore';
import { mockProduct, mockProduct2 } from './fixtures';

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: {}, isOpen: false });
  });

  describe('addItem', () => {
    it('yeni ürün eklendiğinde quantity 1 olur', () => {
      useCartStore.getState().addItem(mockProduct);
      const items = selectCartItems(useCartStore.getState());

      expect(items).toHaveLength(1);
      expect(items[0]).toEqual({ product: mockProduct, quantity: 1 });
    });

    it('aynı ürün tekrar eklendiğinde quantity artar', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);
      addItem(mockProduct);

      expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(3);
      expect(selectCartItems(useCartStore.getState())).toHaveLength(1);
    });

    it('farklı ürünler ayrı ayrı eklenir', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct2);

      expect(selectCartItems(useCartStore.getState())).toHaveLength(2);
    });
  });

  describe('decrement', () => {
    it('quantity 1 iken decrement çağrılınca ürün listeden çıkar', () => {
      const { addItem, decrement } = useCartStore.getState();
      addItem(mockProduct);
      decrement(mockProduct.id);

      expect(selectCartItems(useCartStore.getState())).toHaveLength(0);
      expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(0);
    });

    it('quantity > 1 iken decrement bir azaltır', () => {
      const { addItem, decrement } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);
      addItem(mockProduct);
      decrement(mockProduct.id);

      expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(2);
    });

    it('sepette olmayan ürünü decrement etmek state değiştirmez', () => {
      const before = useCartStore.getState();
      useCartStore.getState().decrement('p-yok');

      expect(useCartStore.getState().items).toBe(before.items);
    });
  });

  describe('removeItem', () => {
    it('belirtilen ürünü tamamen siler (quantity ne olursa olsun)', () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);
      addItem(mockProduct);

      removeItem(mockProduct.id);

      expect(selectQuantityOf(mockProduct.id)(useCartStore.getState())).toBe(0);
    });
  });

  describe('clear', () => {
    it('tüm ürünleri temizler', () => {
      const { addItem, clear } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct2);
      clear();

      expect(selectCartItems(useCartStore.getState())).toHaveLength(0);
    });
  });

  describe('selectTotalCount', () => {
    it('tüm ürünlerin adetlerinin toplamını döner', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);
      addItem(mockProduct2);

      expect(selectTotalCount(useCartStore.getState())).toBe(3);
    });

    it('boş sepet için 0 döner', () => {
      expect(selectTotalCount(useCartStore.getState())).toBe(0);
    });
  });

  describe('selectTotalPrice — KRİTİK İŞ MANTIĞI', () => {
    it('boş sepet için 0 döner', () => {
      expect(selectTotalPrice(useCartStore.getState())).toBe(0);
    });

    it('tek ürün ve tek adet için doğru toplam', () => {
      useCartStore.getState().addItem(mockProduct);
      expect(selectTotalPrice(useCartStore.getState())).toBe(250);
    });

    it('tek ürünün adeti arttığında fiyat orantılı artar', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);
      addItem(mockProduct);

      expect(selectTotalPrice(useCartStore.getState())).toBe(750);
    });

    it('birden fazla farklı ürün için doğru toplam (250*2 + 400*1 = 900)', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);
      addItem(mockProduct2);

      expect(selectTotalPrice(useCartStore.getState())).toBe(900);
    });

    it('decrement sonrası toplam doğru güncellenir', () => {
      const { addItem, decrement } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);
      addItem(mockProduct2);
      decrement(mockProduct.id);

      expect(selectTotalPrice(useCartStore.getState())).toBe(250 + 400);
    });

    it('removeItem sonrası ürün toplama dahil edilmez', () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockProduct);
      addItem(mockProduct);
      addItem(mockProduct2);
      removeItem(mockProduct.id);

      expect(selectTotalPrice(useCartStore.getState())).toBe(400);
    });
  });

  describe('drawer state', () => {
    it('openDrawer açar, closeDrawer kapatır', () => {
      const { openDrawer, closeDrawer } = useCartStore.getState();

      openDrawer();
      expect(useCartStore.getState().isOpen).toBe(true);

      closeDrawer();
      expect(useCartStore.getState().isOpen).toBe(false);
    });

    it('toggleDrawer state\'i tersine çevirir', () => {
      const { toggleDrawer } = useCartStore.getState();
      expect(useCartStore.getState().isOpen).toBe(false);

      toggleDrawer();
      expect(useCartStore.getState().isOpen).toBe(true);

      toggleDrawer();
      expect(useCartStore.getState().isOpen).toBe(false);
    });
  });
});
