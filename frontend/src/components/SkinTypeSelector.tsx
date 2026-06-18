'use client';

import {
  SKIN_TYPES,
  SKIN_TYPE_DESCRIPTIONS,
  SKIN_TYPE_LABELS,
  type SkinType,
} from '@/lib/types';

interface SkinTypeSelectorProps {
  onSelect: (skinType: SkinType) => void;
  selected?: SkinType | null;
  disabled?: boolean;
}

const ORB_GRADIENTS: Record<SkinType, string> = {
  dry: 'from-sky-300 via-cyan-300 to-blue-400',
  oily: 'from-amber-300 via-orange-300 to-rose-300',
  combination: 'from-violet-300 via-fuchsia-300 to-pink-300',
};

export function SkinTypeSelector({
  onSelect,
  selected = null,
  disabled = false,
}: SkinTypeSelectorProps) {
  return (
    <section
      aria-labelledby="skin-type-heading"
      className="w-full max-w-5xl mx-auto"
    >
      <header className="text-center mb-10">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-rose-500/80 mb-3">
          1. Adım
        </p>
        <h2
          id="skin-type-heading"
          className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight"
        >
          Cilt tipini seç
        </h2>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          Sana en uygun cilt bakım rutinini birlikte bulalım. Yapay zekamız
          seçimine göre öneriler hazırlayacak.
        </p>
      </header>

      <div
        role="radiogroup"
        aria-label="Cilt tipi seçenekleri"
        className="grid grid-cols-1 md:grid-cols-3 gap-5"
      >
        {SKIN_TYPES.map((skinType) => {
          const isSelected = selected === skinType;
          return (
            <button
              key={skinType}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={disabled}
              onClick={() => onSelect(skinType)}
              className={[
                'group relative overflow-hidden text-left',
                'rounded-3xl p-7 transition-all duration-300',
                'bg-white/50 backdrop-blur-xl border shadow-lg',
                'hover:-translate-y-1 hover:shadow-2xl hover:bg-white/70',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg',
                isSelected
                  ? 'border-rose-300 ring-2 ring-rose-200'
                  : 'border-white/60',
              ].join(' ')}
            >
              <span
                aria-hidden
                className={[
                  'block h-14 w-14 rounded-full mb-6',
                  'bg-gradient-to-br shadow-inner',
                  'transition-transform duration-500 group-hover:scale-110',
                  ORB_GRADIENTS[skinType],
                ].join(' ')}
              />

              <h3 className="text-xl font-semibold text-slate-900">
                {SKIN_TYPE_LABELS[skinType]}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {SKIN_TYPE_DESCRIPTIONS[skinType]}
              </p>

              <span
                aria-hidden
                className="mt-6 inline-flex items-center text-sm font-medium text-rose-500 opacity-0 -translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
              >
                Seç
                <svg
                  className="ml-1.5 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
