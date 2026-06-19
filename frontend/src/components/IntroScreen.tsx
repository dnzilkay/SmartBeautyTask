'use client';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section
      aria-labelledby="intro-heading"
      className="relative w-full max-w-4xl mx-auto text-center py-8 md:py-12"
    >
      <div className="relative inline-flex items-center justify-center mb-8">
        <span
          aria-hidden
          className="absolute inset-0 -m-6 rounded-full bg-gradient-to-br from-rose-200/60 via-amber-200/60 to-violet-200/60 blur-2xl"
        />
        <span
          aria-hidden
          className="relative h-16 w-16 rounded-full bg-gradient-to-br from-rose-400 via-pink-400 to-amber-300 shadow-xl"
        />
      </div>

      <p className="text-xs font-medium uppercase tracking-[0.3em] text-rose-500/80 mb-4">
        Yapay Zeka Destekli Cilt Analizi
      </p>

      <h1
        id="intro-heading"
        className="text-4xl md:text-6xl font-semibold text-slate-900 tracking-tight leading-[1.05]"
      >
        Cildine özel
        <br />
        <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 bg-clip-text text-transparent">
          bakım önerileri
        </span>
      </h1>

      <p className="mt-6 text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
        Cilt tipini birkaç saniyede analiz edelim, sana özel seçilmiş ürünleri
        keşfet.
      </p>

      <div className="mt-10 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-slate-900 text-white text-sm font-medium shadow-lg hover:bg-rose-500 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2"
        >
          Önerileri gör
          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>
        <p className="text-xs text-slate-500">Ücretsiz · Birkaç saniye sürer</p>
      </div>

      <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto">
        <Feature
          gradient="from-sky-300 via-cyan-300 to-blue-400"
          title="Kişiselleştirme"
          description="Cilt tipine özel seçim"
        />
        <Feature
          gradient="from-amber-300 via-orange-300 to-rose-300"
          title="Hızlı"
          description="Saniyeler içinde sonuç"
        />
        <Feature
          gradient="from-violet-300 via-fuchsia-300 to-pink-300"
          title="Premium"
          description="Özenle seçilmiş ürünler"
        />
      </div>
    </section>
  );
}

function Feature({
  gradient,
  title,
  description,
}: {
  gradient: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        aria-hidden
        className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradient} shadow-inner`}
      />
      <p className="text-sm font-medium text-slate-900">{title}</p>
      <p className="text-xs text-slate-500 leading-tight">{description}</p>
    </div>
  );
}
