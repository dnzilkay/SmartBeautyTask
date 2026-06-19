'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ApiError, fetchProduct } from '@/lib/api';
import {
  SKIN_TYPE_LABELS,
  type Product,
  type ProductDetailResponse,
} from '@/lib/types';
import { selectQuantityOf, useCartStore } from '@/store/cartStore';
import { ProductCard } from './ProductCard';
import { ProductDetailSkeleton } from './ProductDetailSkeleton';
import { ProductGallery } from './ProductGallery';

interface ProductDetailProps {
  productId: string;
}

type DetailState =
  | { status: 'loading' }
  | { status: 'ready'; data: ProductDetailResponse }
  | { status: 'error'; message: string };

const priceFormatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const SKIN_BADGE_CLASS = {
  dry: 'border-sky-200 bg-sky-50 text-sky-700',
  oily: 'border-amber-200 bg-amber-50 text-amber-700',
  combination: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
} as const;

export function ProductDetail({ productId }: ProductDetailProps) {
  const [state, setState] = useState<DetailState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();

    void fetchProduct(productId, controller.signal)
      .then((data) => setState({ status: 'ready', data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        const message =
          error instanceof ApiError
            ? error.message
            : 'Ürün bilgileri yüklenirken bir hata oluştu.';
        setState({ status: 'error', message });
      });

    return () => controller.abort();
  }, [productId]);

  if (state.status === 'loading') {
    return <ProductDetailSkeleton />;
  }

  if (state.status === 'error') {
    return (
      <section className="mx-auto max-w-xl py-16 text-center" aria-live="polite">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-100 text-rose-500">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-slate-900">
          Ürüne ulaşamadık
        </h1>
        <p className="mt-2 text-slate-600">{state.message}</p>
        <Link
          href="/"
          className="mt-7 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-rose-500"
        >
          Önerilere geri dön
        </Link>
      </section>
    );
  }

  const { product, relatedProducts } = state.data;

  return (
    <div className="product-detail-enter">
      <nav aria-label="Sayfa yolu" className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="transition-colors hover:text-rose-500">
          Ana Sayfa
        </Link>
        <span aria-hidden>/</span>
        <span className="truncate text-slate-800" aria-current="page">
          {product.name}
        </span>
      </nav>

      <section className="grid items-start gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <ProductGallery key={product.id} product={product} />
        <ProductInformation product={product} />
      </section>

      <ProductStory product={product} />

      {relatedProducts.length > 0 && (
        <section className="mt-20 border-t border-white/60 pt-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-rose-500">
                Rutini tamamla
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">
                Bunları da sevebilirsin
              </h2>
            </div>
            <Link
              href="/"
              className="hidden text-sm font-medium text-slate-600 transition-colors hover:text-rose-500 sm:inline"
            >
              Tüm öneriler
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((relatedProduct, index) => (
              <ProductCard
                key={relatedProduct.id}
                product={relatedProduct}
                enterIndex={index}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductInformation({ product }: { product: Product }) {
  const quantity = useCartStore(selectQuantityOf(product.id));
  const addItem = useCartStore((state) => state.addItem);
  const decrement = useCartStore((state) => state.decrement);
  const openDrawer = useCartStore((state) => state.openDrawer);
  const profile = useMemo(() => getProductProfile(product), [product]);

  const handlePrimaryAction = () => {
    addItem(product);
    openDrawer();
  };

  return (
    <div className="lg:sticky lg:top-28">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-rose-500">
          {product.brand}
        </p>
        {product.tag && (
          <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-medium text-rose-600">
            {product.tag}
          </span>
        )}
      </div>

      <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-slate-900 md:text-5xl">
        {product.name}
      </h1>
      <p className="mt-5 text-base leading-7 text-slate-600 md:text-lg">
        {product.description}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {product.skinTypes.map((skinType) => (
          <span
            key={skinType}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${SKIN_BADGE_CLASS[skinType]}`}
          >
            {SKIN_TYPE_LABELS[skinType]} cilt
          </span>
        ))}
      </div>

      <div className="mt-8 flex items-end justify-between border-y border-white/70 py-6">
        <div>
          <p className="text-xs text-slate-500">KDV dahil</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
            {priceFormatter.format(product.price)}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Stokta
        </div>
      </div>

      {quantity === 0 ? (
        <button
          type="button"
          onClick={handlePrimaryAction}
          className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-slate-900 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-rose-300/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
        >
          Sepete Ekle
          <ArrowIcon />
        </button>
      ) : (
        <div className="mt-7 flex gap-3">
          <div
            role="group"
            aria-label={`${product.name} adet kontrolü`}
            className="flex flex-1 items-center justify-between rounded-full border border-white/80 bg-white/65 p-1.5 shadow-lg backdrop-blur-xl"
          >
            <button
              type="button"
              onClick={() => decrement(product.id)}
              aria-label="Adeti azalt"
              className="grid h-11 w-11 place-items-center rounded-full text-lg text-slate-700 transition-colors hover:bg-rose-50"
            >
              −
            </button>
            <span className="font-semibold tabular-nums text-slate-900" aria-live="polite">
              {quantity} adet
            </span>
            <button
              type="button"
              onClick={() => addItem(product)}
              aria-label="Adeti artır"
              className="grid h-11 w-11 place-items-center rounded-full text-lg text-slate-700 transition-colors hover:bg-rose-50"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={openDrawer}
            className="rounded-full bg-slate-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-rose-500"
          >
            Sepetim
          </button>
        </div>
      )}

      <div className="mt-7 grid grid-cols-3 gap-3">
        <TrustItem icon="sparkle" label="Özenle seçildi" />
        <TrustItem icon="leaf" label="Cilt dostu" />
        <TrustItem icon="truck" label="Hızlı teslimat" />
      </div>

      <div className="mt-8 rounded-3xl border border-white/70 bg-white/45 p-5 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Kullanım önerisi
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-700">{profile.usage}</p>
      </div>
    </div>
  );
}

function ProductStory({ product }: { product: Product }) {
  const profile = getProductProfile(product);

  return (
    <section className="mt-20 grid gap-5 md:grid-cols-3">
      <StoryCard
        number="01"
        title="Bakım adımı"
        description={profile.step}
      />
      <StoryCard
        number="02"
        title="Doku ve his"
        description={profile.texture}
      />
      <StoryCard
        number="03"
        title="Neden sana uygun?"
        description={`${product.skinTypes.map((type) => SKIN_TYPE_LABELS[type].toLocaleLowerCase('tr-TR')).join(', ')} cilt ihtiyaçlarını gözeten dengeli bir formül.`}
      />
    </section>
  );
}

function StoryCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-3xl border border-white/70 bg-white/45 p-6 shadow-lg shadow-rose-100/30 backdrop-blur-xl">
      <span className="text-xs font-semibold tracking-[0.2em] text-rose-400">
        {number}
      </span>
      <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
}

function TrustItem({ icon, label }: { icon: 'sparkle' | 'leaf' | 'truck'; label: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/50 px-2 py-4 text-center backdrop-blur-lg">
      <TrustIcon name={icon} />
      <p className="mt-2 text-[11px] font-medium leading-tight text-slate-600">
        {label}
      </p>
    </div>
  );
}

function TrustIcon({ name }: { name: 'sparkle' | 'leaf' | 'truck' }) {
  const path = {
    sparkle: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.445-7.188L18 9.75l-.258-1.034a3.375 3.375 0 00-2.458-2.458L14.25 6l1.034-.258a3.375 3.375 0 002.458-2.458L18 2.25l.258 1.034a3.375 3.375 0 002.458 2.458L21.75 6l-1.034.258a3.375 3.375 0 00-2.458 2.458z',
    leaf: 'M12 21a9.004 9.004 0 008.716-6.747c.165-.641-.407-1.19-1.06-1.083a8.995 8.995 0 00-7.526 6.829M12 21a9.004 9.004 0 01-8.716-6.747c-.165-.641.407-1.19 1.06-1.083A8.995 8.995 0 0112 20.999M12 21V10.5m0 0c0-3.866 3.134-7 7-7 .552 0 1 .448 1 1 0 3.866-3.134 7-7 7h-1z',
    truck: 'M8.25 18.75a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7.5 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM3 4.5h10.5v10.125H3V4.5zm10.5 4.5h3.879a1.5 1.5 0 011.2.6L21 12.825v1.8h-7.5V9z',
  }[name];

  return (
    <svg
      className="mx-auto h-5 w-5 text-rose-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.6}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

function getProductProfile(product: Product) {
  const name = product.name.toLocaleLowerCase('tr-TR');

  if (name.includes('serum') || name.includes('yağı')) {
    return {
      step: 'Temizleme ve tonik sonrasında, nemlendiriciden önce uygulanır.',
      texture: 'Ciltle hızlı bütünleşen, ipeksi ve katmanlanabilir konsantre doku.',
      usage: 'Temiz cilde 2-3 damla uygulayın. Yüz ve boyun bölgesine nazikçe bastırarak yayın.',
    };
  }

  if (name.includes('tonik')) {
    return {
      step: 'Temizleme sonrasında cildi bakım adımlarına hazırlamak için kullanılır.',
      texture: 'Ferahlık veren, hafif ve kalıntı bırakmayan su bazlı doku.',
      usage: 'Akşam rutininde temiz cilde pamukla veya avuç içine alarak uygulayın. Göz çevresinden kaçının.',
    };
  }

  if (name.includes('maske')) {
    return {
      step: 'Haftalık arındırma adımında temiz cilde uygulanır.',
      texture: 'Kolay yayılan, cildi kurutmadan arındırmaya yardımcı krem doku.',
      usage: 'Temiz cilde ince bir tabaka halinde uygulayın, 10 dakika bekletip ılık suyla durulayın.',
    };
  }

  if (name.includes('spf') || name.includes('güneş')) {
    return {
      step: 'Sabah bakım rutininin son ve koruyucu adımıdır.',
      texture: 'Kolay dağılan, ağırlık hissi bırakmayan konforlu koruyucu doku.',
      usage: 'Güneşe çıkmadan 15 dakika önce yüz ve boyun bölgesine bolca uygulayın. Gün içinde yenileyin.',
    };
  }

  return {
    step: 'Serumdan sonra cildin nemini desteklemek için sabah ve akşam kullanılır.',
    texture: 'Yumuşak bitişli, konforlu ve cilt bariyerini saran nemlendirici doku.',
    usage: 'Temiz cilde, serumdan sonra nohut büyüklüğünde uygulayın. Yüz ve boyun bölgesine nazikçe yayın.',
  };
}
