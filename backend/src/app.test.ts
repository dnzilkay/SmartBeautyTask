import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import { createApp } from './app';
import type { Product, SkinType } from './types';

interface ProductsPayload {
  skinType: SkinType;
  count: number;
  products: Product[];
}

interface ProductDetailPayload {
  product: Product;
  relatedProducts: Product[];
}

describe('Smart Beauty API', () => {
  let server: Server;
  let baseUrl: string;

  before(async () => {
    const app = createApp({ simulatedDelayMs: 0 });
    server = app.listen(0);

    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  after(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  });

  it('health endpoint durum bilgisini döndürür', async () => {
    const response = await fetch(`${baseUrl}/health`);

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
  });

  it('geçersiz cilt tipi için 400 döndürür', async () => {
    const response = await fetch(`${baseUrl}/api/products?skinType=normal`);
    const payload = (await response.json()) as { error: string };

    assert.equal(response.status, 400);
    assert.match(payload.error, /Geçersiz skinType/);
  });

  it('ürünleri cilt tipine göre filtreleyip öncelikli etikete göre sıralar', async () => {
    const response = await fetch(`${baseUrl}/api/products?skinType=dry`);
    const payload = (await response.json()) as ProductsPayload;

    assert.equal(response.status, 200);
    assert.equal(payload.count, payload.products.length);
    assert.ok(payload.products.length > 0);
    assert.ok(payload.products.every((product) => product.skinTypes.includes('dry')));
    assert.equal(payload.products[0].tag, 'Olmazsa Olmaz');
  });

  it('ürün detayını ve ortak cilt tipine sahip ilişkili ürünleri döndürür', async () => {
    const response = await fetch(`${baseUrl}/api/products/p-001`);
    const payload = (await response.json()) as ProductDetailPayload;

    assert.equal(response.status, 200);
    assert.equal(payload.product.id, 'p-001');
    assert.ok(payload.relatedProducts.length <= 4);
    assert.ok(
      payload.relatedProducts.every(
        (product) =>
          product.id !== payload.product.id &&
          product.skinTypes.some((skinType) =>
            payload.product.skinTypes.includes(skinType),
          ),
      ),
    );
  });

  it('bulunamayan ürün için 404 döndürür', async () => {
    const response = await fetch(`${baseUrl}/api/products/bilinmeyen`);

    assert.equal(response.status, 404);
    assert.deepEqual(await response.json(), { error: 'Ürün bulunamadı.' });
  });
});
