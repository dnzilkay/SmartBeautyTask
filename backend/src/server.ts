import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PRODUCTS } from './data/products';
import { isSkinType } from './types';

const PORT = Number(process.env.PORT) || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const SIMULATED_DELAY_MS = Number(process.env.SIMULATED_DELAY_MS) || 3000;

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const TAG_PRIORITY: Record<string, number> = {
  'Olmazsa Olmaz': 5,
  'Editor’s Pick': 4,
  Bestseller: 3,
  Yeni: 2,
};

const tagWeight = (tag?: string): number =>
  tag ? TAG_PRIORITY[tag] ?? 0 : 0;

app.get('/api/products', async (req: Request, res: Response) => {
  const { skinType } = req.query;

  if (!isSkinType(skinType)) {
    return res.status(400).json({
      error: 'Geçersiz skinType. Beklenen: dry | oily | combination',
    });
  }

  await wait(SIMULATED_DELAY_MS);

  const filtered = PRODUCTS.filter((p) => p.skinTypes.includes(skinType));
  const sorted = [...filtered].sort(
    (a, b) => tagWeight(b.tag) - tagWeight(a.tag),
  );
  res.json({ skinType, count: sorted.length, products: sorted });
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
    .sort((a, b) => tagWeight(b.tag) - tagWeight(a.tag))
    .slice(0, 4);

  res.json({ product, relatedProducts });
});

app.listen(PORT, () => {
  console.log(`[smart-beauty-backend] http://localhost:${PORT}`);
});
