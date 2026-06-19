'use client';

import Image from 'next/image';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section
      aria-labelledby="intro-heading"
      className="relative isolate mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/40 px-5 py-8 shadow-2xl shadow-rose-200/25 backdrop-blur-xl sm:px-8 md:rounded-[2.75rem] md:px-10 md:py-10 lg:px-14 lg:py-12"
    >
      <div
        aria-hidden
        className="absolute -left-28 -top-32 -z-10 h-80 w-80 rounded-full bg-rose-200/45 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-24 top-0 -z-10 h-96 w-96 rounded-full bg-sky-200/45 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-amber-100/60 blur-3xl"
      />

      <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 px-3 py-2 shadow-sm backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
              AI destekli bakım eşleşmesi
            </span>
          </div>

          <h1
            id="intro-heading"
            className="mt-6 max-w-2xl text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-[4.65rem]"
          >
            Cildini tanı.
            <span className="mt-1 block bg-gradient-to-r from-rose-500 via-fuchsia-500 to-sky-500 bg-clip-text text-transparent">
              Rutinini sadeleştir.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
            Cilt tipini seç, kısa analizini tamamla. Sana gerçekten uygun bakım
            ürünlerini tek bir kişisel rutinde buluşturalım.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onStart}
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-slate-950 px-6 py-4 text-sm font-semibold text-white shadow-xl shadow-slate-900/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-rose-300/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
            >
              Cilt analizini başlat
              <ArrowIcon />
            </button>
            <div className="flex items-center justify-center gap-2 px-3 text-xs text-slate-500 sm:justify-start">
              <ClockIcon />
              Yalnızca birkaç saniye
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Cilt tipleri</span>
            <SkinPill color="bg-sky-400" label="Kuru" />
            <SkinPill color="bg-amber-400" label="Yağlı" />
            <SkinPill color="bg-fuchsia-400" label="Karma" />
          </div>
        </div>

        <ProductShowcase />
      </div>

      <div className="mt-10 grid border-t border-white/70 pt-7 sm:grid-cols-3 lg:mt-12">
        <JourneyStep
          number="01"
          title="Cildini seç"
          description="Kuru, yağlı veya karma"
        />
        <JourneyStep
          number="02"
          title="Analizi tamamla"
          description="3 saniyelik akıllı eşleşme"
        />
        <JourneyStep
          number="03"
          title="Rutinini keşfet"
          description="Sana özel ürün seçkisi"
        />
      </div>
    </section>
  );
}

function ProductShowcase() {
  return (
    <div
      aria-hidden
      className="relative mx-auto min-h-[420px] w-full max-w-[36rem] sm:min-h-[500px] lg:min-h-[540px]"
    >
      <div className="absolute inset-x-[9%] top-[4%] h-[83%] rounded-[2.5rem] border border-white/80 bg-gradient-to-br from-white/65 via-rose-50/45 to-sky-50/60 shadow-2xl shadow-slate-300/25 backdrop-blur-2xl" />

      <div className="hero-product-float absolute left-[19%] top-[8%] z-20 aspect-square w-[62%] overflow-hidden rounded-[2.2rem] border border-white/80 bg-white/55 shadow-2xl shadow-rose-200/35">
        <Image
          src="/products/hydra-boost-cream.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 34vw, 70vw"
          className="object-cover"
        />
        <span className="absolute left-4 top-4 rounded-full border border-white/80 bg-white/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-sky-700 backdrop-blur-xl">
          Nem desteği
        </span>
      </div>

      <div className="hero-product-float-delayed absolute bottom-[8%] left-[1%] z-30 aspect-square w-[34%] overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/65 shadow-xl shadow-slate-300/30">
        <Image
          src="/products/vitamin-c-serum.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 16vw, 35vw"
          className="object-cover"
        />
      </div>

      <div className="hero-product-float-slow absolute bottom-[2%] right-[1%] z-30 aspect-square w-[38%] overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/65 shadow-xl shadow-slate-300/30">
        <Image
          src="/products/mineral-spf-50.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 18vw, 38vw"
          className="object-cover"
        />
      </div>

      <div className="absolute right-[2%] top-[17%] z-40 rounded-2xl border border-white/80 bg-white/72 p-3 shadow-xl backdrop-blur-xl sm:p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-rose-100 to-sky-100 text-rose-500">
            <SparkleIcon />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-900">Kişisel eşleşme</p>
            <p className="mt-0.5 text-[10px] text-slate-500">Cilt tipine göre seçim</p>
          </div>
        </div>
      </div>

      <div className="absolute left-[4%] top-[3%] z-40 rounded-full border border-white/80 bg-white/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-lg backdrop-blur-xl">
        12 ürün · 3 cilt tipi
      </div>
    </div>
  );
}

function JourneyStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 border-white/70 py-4 sm:border-r sm:px-6 sm:py-1 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0">
      <span className="text-xs font-semibold tracking-[0.18em] text-rose-400">
        {number}
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}

function SkinPill({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/55 px-3 py-1.5 text-xs font-medium text-slate-700 backdrop-blur-lg">
      <span className={`h-2 w-2 rounded-full ${color}`} />
      {label}
    </span>
  );
}

function ArrowIcon() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
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

function ClockIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.7}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zm8.445-7.188L18 9.75l-.258-1.034a3.375 3.375 0 00-2.458-2.458L14.25 6l1.034-.258a3.375 3.375 0 002.458-2.458L18 2.25l.258 1.034a3.375 3.375 0 002.458 2.458L21.75 6l-1.034.258a3.375 3.375 0 00-2.458 2.458z" />
    </svg>
  );
}
