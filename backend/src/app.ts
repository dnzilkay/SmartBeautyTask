import express, { Request, Response } from 'express';
import cors from 'cors';
import { PRODUCTS } from './data/products';
import { isSkinType } from './types';

interface AppOptions {
  corsOrigin?: string;
  simulatedDelayMs?: number;
}

const TAG_PRIORITY: Record<string, number> = {
  'Olmazsa Olmaz': 5,
  'Editor’s Pick': 4,
  Bestseller: 3,
  Yeni: 2,
};

const tagWeight = (tag?: string): number =>
  tag ? TAG_PRIORITY[tag] ?? 0 : 0;

const wait = (milliseconds: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, milliseconds));

export function createApp({
  corsOrigin = process.env.CORS_ORIGIN || '*',
  simulatedDelayMs = Number(process.env.SIMULATED_DELAY_MS) || 3000,
}: AppOptions = {}) {
  const app = express();

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/products', async (req: Request, res: Response) => {
    const { skinType } = req.query;

    if (!isSkinType(skinType)) {
      return res.status(400).json({
        error: 'Geçersiz skinType. Beklenen: dry | oily | combination',
      });
    }

    await wait(simulatedDelayMs);

    const filtered = PRODUCTS.filter((product) =>
      product.skinTypes.includes(skinType),
    );
    const sorted = [...filtered].sort(
      (first, second) => tagWeight(second.tag) - tagWeight(first.tag),
    );

    return res.json({ skinType, count: sorted.length, products: sorted });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = PRODUCTS.find((item) => item.id === req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Ürün bulunamadı.' });
    }

    const relatedProducts = PRODUCTS.filter(
      (item) =>
        item.id !== product.id &&
        item.skinTypes.some((skinType) => product.skinTypes.includes(skinType)),
    )
      .sort((first, second) => tagWeight(second.tag) - tagWeight(first.tag))
      .slice(0, 4);

    return res.json({ product, relatedProducts });
  });

  return app;
}

const app = createApp();

export default app;
