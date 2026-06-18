interface ProductSkeletonProps {
  count?: number;
}

function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={[
        'rounded-3xl border border-white/60 bg-white/40 backdrop-blur-xl overflow-hidden shadow-lg',
        featured ? 'md:row-span-2 md:col-span-2' : '',
      ].join(' ')}
      aria-hidden
    >
      <div
        className={[
          'w-full bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse',
          featured ? 'aspect-[4/3] md:aspect-[3/2]' : 'aspect-[4/3]',
        ].join(' ')}
      />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-4 w-3/4 rounded-full bg-slate-200 animate-pulse" />
        {featured && (
          <div className="space-y-2 pt-1">
            <div className="h-3 w-full rounded-full bg-slate-200 animate-pulse" />
            <div className="h-3 w-5/6 rounded-full bg-slate-200 animate-pulse" />
          </div>
        )}
        <div className="flex items-center justify-between pt-3">
          <div className="h-5 w-16 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-9 w-24 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ProductSkeleton({ count = 8 }: ProductSkeletonProps) {
  return (
    <section aria-label="Ürünler yükleniyor" aria-busy="true">
      <div className="text-center mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-500/80 mb-3 animate-pulse">
          Yapay zeka analiz ediyor
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">
          Sana özel öneriler hazırlanıyor…
        </h2>
        <p className="mt-3 text-slate-500 max-w-xl mx-auto">
          Cilt tipine uygun ürünleri seçiyoruz. Bu işlem birkaç saniye sürebilir.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-fr">
        <SkeletonCard featured />
        {Array.from({ length: Math.max(0, count - 1) }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}
