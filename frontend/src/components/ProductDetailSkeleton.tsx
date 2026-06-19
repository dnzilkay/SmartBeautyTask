export function ProductDetailSkeleton() {
  return (
    <div aria-label="Ürün bilgileri yükleniyor" aria-busy="true">
      <div className="mb-8 h-4 w-44 animate-pulse rounded-full bg-white/70" />
      <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
        <div className="aspect-[4/5] animate-pulse rounded-[2rem] bg-white/65 shadow-xl" />
        <div className="flex flex-col justify-center">
          <div className="h-3 w-24 animate-pulse rounded-full bg-rose-200/70" />
          <div className="mt-5 h-12 w-4/5 animate-pulse rounded-2xl bg-white/75" />
          <div className="mt-4 h-4 w-full animate-pulse rounded-full bg-white/60" />
          <div className="mt-2 h-4 w-2/3 animate-pulse rounded-full bg-white/60" />
          <div className="mt-8 h-10 w-32 animate-pulse rounded-xl bg-white/75" />
          <div className="mt-8 h-14 w-full animate-pulse rounded-full bg-slate-200/80" />
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-24 animate-pulse rounded-2xl bg-white/65"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
