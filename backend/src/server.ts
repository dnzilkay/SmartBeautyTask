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

app.get('/api/products', async (req: Request, res: Response) => {
  const { skinType } = req.query;

  if (!isSkinType(skinType)) {
    return res.status(400).json({
      error: 'Geçersiz skinType. Beklenen: dry | oily | combination',
    });
  }

  await wait(SIMULATED_DELAY_MS);

  const filtered = PRODUCTS.filter((p) => p.skinTypes.includes(skinType));
  res.json({ skinType, count: filtered.length, products: filtered });
});

app.listen(PORT, () => {
  console.log(`[smart-beauty-backend] http://localhost:${PORT}`);
});
