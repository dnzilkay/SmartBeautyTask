'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  SKIN_TYPES,
  SKIN_TYPE_DESCRIPTIONS,
  SKIN_TYPE_LABELS,
  SKIN_TYPE_THEMES,
  type SkinType,
} from '@/lib/types';

interface SkinTypeSelectorProps {
  onSelect: (skinType: SkinType) => void;
  selected?: SkinType | null;
  disabled?: boolean;
}

type Slot = 'left' | 'center' | 'right';

function getSlot(cardIndex: number, activeIndex: number, total: number): Slot {
  if (cardIndex === activeIndex) return 'center';
  const next = (activeIndex + 1) % total;
  if (cardIndex === next) return 'right';
  return 'left';
}

const TITLE_GRADIENT: Record<SkinType, string> = {
  dry: 'from-sky-600 via-cyan-600 to-blue-700',
  oily: 'from-amber-600 via-orange-600 to-rose-600',
  combination: 'from-violet-600 via-fuchsia-600 to-pink-600',
};

const SECTION_LABEL = 'C i l t   T i p i';

export function SkinTypeSelector({
  onSelect,
  selected = null,
  disabled = false,
}: SkinTypeSelectorProps) {
  const initialIndex = selected ? SKIN_TYPES.indexOf(selected) : 0;
  const [index, setIndex] = useState(initialIndex >= 0 ? initialIndex : 0);

  const total = SKIN_TYPES.length;
  const goNext = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const goPrev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [disabled, goNext, goPrev]);

  const activeType = SKIN_TYPES[index];
  const activeTheme = SKIN_TYPE_THEMES[activeType];

  const handleQuizResult = useCallback((type: SkinType) => {
    const idx = SKIN_TYPES.indexOf(type);
    if (idx >= 0) setIndex(idx);
  }, []);

  return (
    <section
      aria-labelledby="skin-type-heading"
      className="w-full max-w-5xl mx-auto"
    >
      <header className="text-center mb-10">
        <p
          className={`text-xs font-medium uppercase tracking-[0.25em] mb-3 transition-colors duration-700 ${activeTheme.accentText}`}
        >
          Adım 1
        </p>
        <h2
          id="skin-type-heading"
          className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight"
        >
          Cildine en yakın olanı seç
        </h2>
        <p className="mt-3 text-slate-600 max-w-xl mx-auto">
          Oklarla veya klavye ile cilt tipleri arasında gezin, sana uygun olanla
          devam et.
        </p>
      </header>

      <div className="relative">
        <button
          type="button"
          onClick={goNext}
          aria-label="Sonraki cilt tipi"
          disabled={disabled}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-40 h-12 w-12 grid place-items-center rounded-full bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          type="button"
          onClick={goPrev}
          aria-label="Önceki cilt tipi"
          disabled={disabled}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-40 h-12 w-12 grid place-items-center rounded-full bg-white/80 backdrop-blur-xl border border-white/70 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <svg className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div
          role="group"
          aria-roledescription="Cilt tipi seçici"
          aria-live="polite"
          className="orbit-stage"
        >
          {SKIN_TYPES.map((type, i) => {
            const slot = getSlot(i, index, total);
            const isCenter = slot === 'center';
            const handleClick = () => {
              if (disabled) return;
              if (slot === 'right') goNext();
              else if (slot === 'left') goPrev();
            };

            return (
              <article
                key={type}
                data-slot={slot}
                aria-hidden={!isCenter}
                onClick={isCenter ? undefined : handleClick}
                className={[
                  'orbit-card',
                  'relative overflow-hidden rounded-3xl border border-white/70 shadow-xl',
                  'w-full max-w-2xl mx-auto',
                  'px-8 py-10 md:px-12 md:py-12',
                  isCenter ? 'cursor-default' : 'cursor-pointer',
                ].join(' ')}
              >
                <CardSurface type={type} />
                <CardContent
                  type={type}
                  isCenter={isCenter}
                  disabled={disabled}
                  onSelect={onSelect}
                />
              </article>
            );
          })}
        </div>
      </div>

      <div
        className="mt-8 flex items-center justify-center gap-3"
        role="tablist"
        aria-label="Cilt tipi göstergesi"
      >
        {SKIN_TYPES.map((type, i) => {
          const active = i === index;
          return (
            <button
              key={type}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={SKIN_TYPE_LABELS[type]}
              onClick={() => setIndex(i)}
              className={[
                'h-2 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400',
                active
                  ? `w-10 ${SKIN_TYPE_THEMES[type].accentBg}`
                  : 'w-2 bg-slate-300 hover:bg-slate-400',
              ].join(' ')}
            />
          );
        })}
      </div>

      <SkinTypeQuiz onResult={handleQuizResult} disabled={disabled} />
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Card surface — gradient + glow + per-type background pattern
// ─────────────────────────────────────────────────────────────────────────────

function CardSurface({ type }: { type: SkinType }) {
  const theme = SKIN_TYPE_THEMES[type];
  return (
    <>
      <div aria-hidden className={`absolute inset-0 bg-gradient-to-br ${theme.surfaceGradient}`} />
      <div aria-hidden className={`absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br ${theme.glow} blur-3xl opacity-70`} />
      <div aria-hidden className={`absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gradient-to-br ${theme.glow} blur-3xl opacity-60`} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Unified card content — Karma dili, bakım odağı yok
// ─────────────────────────────────────────────────────────────────────────────

interface CardContentProps {
  type: SkinType;
  isCenter: boolean;
  disabled: boolean;
  onSelect: (type: SkinType) => void;
}

function CardContent({ type, isCenter, disabled, onSelect }: CardContentProps) {
  const theme = SKIN_TYPE_THEMES[type];
  const Hero = HERO_BY_TYPE[type];

  return (
    <>
      <div className="relative flex flex-col items-center text-center">
        <Hero />
        <p className={`mt-6 text-[10px] font-medium uppercase tracking-[0.4em] mb-3 ${theme.accentText}`}>
          {SECTION_LABEL}
        </p>
        <h3
          className="text-5xl md:text-6xl font-light text-slate-900 tracking-tighter leading-none"
          style={{ fontFeatureSettings: '"ss01"' }}
        >
          <span className={`bg-gradient-to-r ${TITLE_GRADIENT[type]} bg-clip-text text-transparent`}>
            {SKIN_TYPE_LABELS[type]}
          </span>
        </h3>
        <p className="mt-4 text-slate-600 max-w-md italic font-light">
          {SKIN_TYPE_DESCRIPTIONS[type]}
        </p>
      </div>

      <div className="orbit-extras">
        <div className="relative mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
          {theme.features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/60 border border-white/70 backdrop-blur-md"
            >
              <span aria-hidden className={`h-2 w-2 rounded-full ${theme.accentBg} flex-shrink-0`} />
              <span className="text-sm text-slate-700">{feature}</span>
            </div>
          ))}
        </div>

        {isCenter && (
          <ContinueButton
            type={type}
            disabled={disabled}
            onSelect={onSelect}
          />
        )}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hero illustrations — same orb shape, different surface finishes (Yaklaşım A)
// ─────────────────────────────────────────────────────────────────────────────

function DryHero() {
  return (
    <div className="relative h-28 w-28 grid place-items-center">
      <span aria-hidden className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-sky-200/60 via-cyan-200/50 to-blue-200/40 blur-2xl" />
      <svg viewBox="0 0 100 100" className="relative h-24 w-24 orb-breathe" aria-hidden>
        <defs>
          <radialGradient id="dry-matte" cx="0.42" cy="0.42" r="0.7">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="55%" stopColor="#7DD3FC" />
            <stop offset="100%" stopColor="#0369A1" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="32" fill="url(#dry-matte)" />
        <path
          d="M40 30 Q44 42 41 52 Q39 60 44 68"
          stroke="white"
          strokeWidth="0.6"
          opacity="0.3"
          fill="none"
        />
        <path
          d="M58 32 Q55 45 60 55 Q63 62 59 70"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.22"
          fill="none"
        />
        <path
          d="M48 24 Q50 35 47 42"
          stroke="white"
          strokeWidth="0.4"
          opacity="0.2"
          fill="none"
        />
        <g className="dry-particles">
          <circle cx="18" cy="34" r="1.2" fill="#7DD3FC" opacity="0.6" />
          <circle cx="82" cy="28" r="0.9" fill="#7DD3FC" opacity="0.5" />
          <circle cx="86" cy="62" r="1.4" fill="#7DD3FC" opacity="0.6" />
          <circle cx="14" cy="68" r="1" fill="#7DD3FC" opacity="0.5" />
          <circle cx="78" cy="80" r="0.8" fill="#7DD3FC" opacity="0.45" />
        </g>
      </svg>
    </div>
  );
}

function OilyHero() {
  return (
    <div className="relative h-28 w-28 grid place-items-center">
      <span aria-hidden className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-amber-200/70 via-orange-200/60 to-rose-200/50 blur-2xl" />
      <svg viewBox="0 0 100 100" className="relative h-24 w-24 orb-breathe" aria-hidden>
        <defs>
          <radialGradient id="oily-glossy" cx="0.5" cy="0.55" r="0.55">
            <stop offset="0%" stopColor="#FED7AA" />
            <stop offset="55%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#7C2D12" />
          </radialGradient>
          <radialGradient id="oily-highlight" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="oily-rim" cx="0.5" cy="0.85" r="0.45">
            <stop offset="0%" stopColor="#FCD34D" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FCD34D" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="32" fill="url(#oily-glossy)" />
        <ellipse cx="50" cy="72" rx="22" ry="6" fill="url(#oily-rim)" />
        <g className="oily-highlight-shift">
          <ellipse cx="40" cy="36" rx="10" ry="14" fill="url(#oily-highlight)" />
          <circle cx="56" cy="32" r="2.5" fill="white" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

function CombinationHero() {
  return (
    <div className="relative h-28 w-28 grid place-items-center">
      <span aria-hidden className="absolute inset-0 -m-2 rounded-full bg-gradient-to-br from-violet-200/70 via-fuchsia-200/60 to-pink-200/50 blur-2xl" />
      <svg viewBox="0 0 100 100" className="relative h-24 w-24 orb-breathe" aria-hidden>
        <defs>
          <radialGradient id="combo-matte" cx="0.3" cy="0.42" r="0.7">
            <stop offset="0%" stopColor="#DDD6FE" />
            <stop offset="55%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#5B21B6" />
          </radialGradient>
          <radialGradient id="combo-glossy" cx="0.7" cy="0.55" r="0.55">
            <stop offset="0%" stopColor="#FBCFE8" />
            <stop offset="55%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#831843" />
          </radialGradient>
          <radialGradient id="combo-shine" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <clipPath id="combo-left">
            <rect x="0" y="0" width="50" height="100" />
          </clipPath>
          <clipPath id="combo-right">
            <rect x="50" y="0" width="50" height="100" />
          </clipPath>
        </defs>
        <g clipPath="url(#combo-left)">
          <circle cx="50" cy="50" r="32" fill="url(#combo-matte)" />
        </g>
        <g clipPath="url(#combo-right)">
          <circle cx="50" cy="50" r="32" fill="url(#combo-glossy)" />
          <ellipse cx="62" cy="38" rx="7" ry="10" fill="url(#combo-shine)" />
          <circle cx="69" cy="34" r="1.8" fill="white" opacity="0.7" />
        </g>
        <line
          x1="50"
          y1="20"
          x2="50"
          y2="80"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.35"
        />
      </svg>
    </div>
  );
}

export const HERO_BY_TYPE: Record<SkinType, () => React.ReactElement> = {
  dry: DryHero,
  oily: OilyHero,
  combination: CombinationHero,
};

// ─────────────────────────────────────────────────────────────────────────────
// Continue button
// ─────────────────────────────────────────────────────────────────────────────

function ContinueButton({
  type,
  disabled,
  onSelect,
}: {
  type: SkinType;
  disabled: boolean;
  onSelect: (t: SkinType) => void;
}) {
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (confirming || disabled) return;
    setConfirming(true);
    window.setTimeout(() => onSelect(type), 520);
  };

  const theme = SKIN_TYPE_THEMES[type];

  return (
    <div className="relative mt-8 flex justify-center">
      {confirming && (
        <span
          aria-hidden
          className={`absolute inset-0 -m-10 rounded-full bg-gradient-to-br ${theme.glow} blur-3xl opacity-80 confirm-glow`}
        />
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || confirming}
        aria-label={`${SKIN_TYPE_LABELS[type]} cilt tipiyle devam et`}
        className={[
          'inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium shadow-lg',
          'transition-all duration-300 disabled:cursor-not-allowed',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2',
          confirming
            ? 'continue-confirming bg-emerald-600 text-white shadow-emerald-500/30 scale-[1.04]'
            : 'bg-slate-900 text-white hover:bg-rose-500 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50',
        ].join(' ')}
      >
        {confirming ? (
          <>
            <svg className="h-4 w-4 confirm-tick" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Hazır
          </>
        ) : (
          <>
            {SKIN_TYPE_LABELS[type]} ile devam et
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mini Quiz
// ─────────────────────────────────────────────────────────────────────────────

type QuizIconId =
  | 'tense'
  | 'zone-shine'
  | 'all-glow'
  | 'clean-paper'
  | 'one-spot'
  | 'many-spots'
  | 'snowflake'
  | 'split-weather'
  | 'sun'
  | 'cracked-cake'
  | 'partial-slip'
  | 'full-slip';

interface QuizOption {
  type: SkinType;
  label: string;
  subtitle: string;
  icon: QuizIconId;
}

interface QuizQuestion {
  id: string;
  prompt: string;
  hint: string;
  options: QuizOption[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'Yüzünü yıkadıktan yaklaşık bir saat sonra cildin nasıl hissediyor?',
    hint: 'İlk düşünceni seç — doğru ya da yanlış cevap yok.',
    options: [
      { type: 'dry', icon: 'tense', label: 'Gergin ve mat', subtitle: 'Sıkışıyor gibi hissediyor' },
      { type: 'combination', icon: 'zone-shine', label: 'T-bölgesi parlak', subtitle: 'Yanaklar rahat' },
      { type: 'oily', icon: 'all-glow', label: 'Her yer ışıl', subtitle: 'Cilt hızla nem üretiyor' },
    ],
  },
  {
    id: 'q2',
    prompt: 'Öğleden sonra alnına bir mendil bastırırsan neyle karşılaşırsın?',
    hint: 'Sebumun nereye yoğunlaştığını gösteriyor.',
    options: [
      { type: 'dry', icon: 'clean-paper', label: 'Mendil tertemiz', subtitle: 'Hemen hiç iz yok' },
      { type: 'combination', icon: 'one-spot', label: 'Sadece T-bölgesinde iz', subtitle: 'Yanaklar bıraktığı izsiz' },
      { type: 'oily', icon: 'many-spots', label: 'Mendil yağa bulanmış', subtitle: 'Her noktada belirgin' },
    ],
  },
  {
    id: 'q3',
    prompt: 'Soğuk veya kuru havalarda cildin nasıl tepki veriyor?',
    hint: 'Mevsim değişikliği cildin karakterini ele verir.',
    options: [
      { type: 'dry', icon: 'snowflake', label: 'Pul pul ve gergin', subtitle: 'Yoğun nemlendirici şart' },
      { type: 'combination', icon: 'split-weather', label: 'T-bölgesi dengelenir', subtitle: 'Yanaklar kuruyabilir' },
      { type: 'oily', icon: 'sun', label: 'Pek değişmez', subtitle: 'Bazen rahatlamış hisseder' },
    ],
  },
  {
    id: 'q4',
    prompt: 'Makyajın gün sonunda nasıl duruyor?',
    hint: 'Cildinle ürünlerin uyumu ipucu veriyor.',
    options: [
      { type: 'dry', icon: 'cracked-cake', label: 'Pul pul birikiyor', subtitle: 'Kuru bölgelere yapışır' },
      { type: 'combination', icon: 'partial-slip', label: 'T-bölgesinde kayar', subtitle: 'Yanaklarda durur' },
      { type: 'oily', icon: 'full-slip', label: 'Hızlı kayar', subtitle: 'Gün ortasında tazeleme ister' },
    ],
  },
];

function SkinTypeQuiz({
  onResult,
  disabled,
}: {
  onResult: (type: SkinType) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<SkinType[]>([]);
  const [result, setResult] = useState<SkinType | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const totalSteps = QUIZ_QUESTIONS.length;

  const handleAnswer = (type: SkinType) => {
    if (transitioning) return;
    const updated = [...answers, type];
    setAnswers(updated);
    setTransitioning(true);

    window.setTimeout(() => {
      if (step + 1 < totalSteps) {
        setStep(step + 1);
        setTransitioning(false);
        return;
      }
      const counts: Record<SkinType, number> = { dry: 0, oily: 0, combination: 0 };
      for (const t of updated) counts[t] += 1;
      const winner = (Object.entries(counts) as [SkinType, number][]).reduce(
        (best, current) => (current[1] > best[1] ? current : best),
      )[0];
      setResult(winner);
      onResult(winner);
      setTransitioning(false);
    }, 320);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setTransitioning(false);
  };

  const progress = result ? 100 : ((step + (transitioning ? 1 : 0)) / totalSteps) * 100;

  return (
    <div className="mt-12 max-w-3xl mx-auto">
      {!open ? (
        <div className="text-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            disabled={disabled}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-rose-500 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 rounded-full px-3 py-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 17h.01" />
            </svg>
            Cilt tipini bilmiyor musun?
            <span className="font-medium underline underline-offset-4 group-hover:translate-x-0.5 transition-transform">
              Birkaç soruyla bulalım →
            </span>
          </button>
        </div>
      ) : (
        <div className="relative rounded-3xl border border-white/70 bg-white/70 backdrop-blur-xl shadow-xl p-6 md:p-9 overflow-hidden">
          <div aria-hidden className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br from-rose-200/50 via-pink-200/40 to-amber-200/30 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-gradient-to-br from-violet-200/40 via-fuchsia-200/30 to-sky-200/30 blur-3xl" />

          <header className="relative flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-rose-500/80">
                Cilt Analizi
              </p>
              <h3 className="text-xl font-semibold text-slate-900 mt-1.5 tracking-tight">
                {result
                  ? 'Sonuç hazır'
                  : `Adım ${step + 1} / ${totalSteps}`}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                reset();
              }}
              aria-label="Mini quiz'i kapat"
              className="h-9 w-9 grid place-items-center rounded-full hover:bg-slate-100 transition-colors text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="relative mb-7">
            <div className="h-1.5 w-full rounded-full bg-slate-200/70 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Başla</span>
              <span>{result ? 'Tamamlandı' : `${Math.round(progress)}%`}</span>
            </div>
          </div>

          <div className="relative">
            {result ? (
              <QuizResult
                type={result}
                onReset={reset}
                onClose={() => setOpen(false)}
              />
            ) : (
              <div key={step} className="quiz-step-enter">
                <QuizStep
                  question={QUIZ_QUESTIONS[step]}
                  onAnswer={handleAnswer}
                  disabled={disabled || transitioning}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function QuizStep({
  question,
  onAnswer,
  disabled,
}: {
  question: QuizQuestion;
  onAnswer: (type: SkinType) => void;
  disabled: boolean;
}) {
  const [picked, setPicked] = useState<SkinType | null>(null);

  const handleClick = (type: SkinType) => {
    if (disabled || picked) return;
    setPicked(type);
    onAnswer(type);
  };

  return (
    <div>
      <p className="text-base md:text-lg text-slate-900 font-medium leading-snug">
        {question.prompt}
      </p>
      <p className="mt-1 text-xs text-slate-500">{question.hint}</p>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {question.options.map((opt, i) => {
          const active = picked === opt.type;
          const inactive = picked && picked !== opt.type;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => handleClick(opt.type)}
              disabled={disabled}
              aria-pressed={active}
              style={{ animationDelay: `${i * 70}ms` }}
              className={[
                'quiz-option group relative text-left p-4 rounded-2xl border bg-white/70 backdrop-blur-md',
                'transition-all duration-300',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2',
                'disabled:cursor-not-allowed',
                active
                  ? 'border-rose-400 ring-2 ring-rose-200 scale-[1.02] shadow-lg'
                  : 'border-slate-200 hover:border-rose-300 hover:bg-white hover:shadow-md hover:-translate-y-0.5',
                inactive ? 'opacity-50' : '',
              ].join(' ')}
            >
              <QuizIcon id={opt.icon} />
              <p className="mt-3 font-medium text-slate-900 text-sm leading-tight">
                {opt.label}
              </p>
              <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                {opt.subtitle}
              </p>
              {active && (
                <span
                  aria-hidden
                  className="absolute top-3 right-3 h-5 w-5 rounded-full bg-rose-500 grid place-items-center"
                >
                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function QuizResult({
  type,
  onReset,
  onClose,
}: {
  type: SkinType;
  onReset: () => void;
  onClose: () => void;
}) {
  const Hero = HERO_BY_TYPE[type];
  const theme = SKIN_TYPE_THEMES[type];

  return (
    <div className="text-center quiz-result-enter">
      <div className="relative flex justify-center mb-2">
        <div className="quiz-result-orb">
          <Hero />
        </div>
        <span aria-hidden className={`absolute inset-0 rounded-full bg-gradient-to-br ${theme.glow} blur-3xl opacity-50 -z-10`} />
      </div>

      <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
        Yanıtların gösteriyor ki
      </p>
      <p className="mt-2 text-5xl md:text-6xl font-light tracking-tighter leading-none">
        <span
          className={`bg-gradient-to-r ${TITLE_GRADIENT[type]} bg-clip-text text-transparent`}
        >
          {SKIN_TYPE_LABELS[type]}
        </span>
      </p>
      <p className="mt-4 text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
        Yukarıdaki seçici şimdiden{' '}
        <strong className="text-slate-900">{SKIN_TYPE_LABELS[type]}</strong> kartına
        geçti. Tamam&apos;a basıp önerilerle devam edebilirsin.
      </p>

      <div className="mt-7 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="px-5 py-2.5 rounded-full text-sm font-medium text-slate-700 border border-slate-300 hover:bg-white hover:shadow-sm transition-all"
        >
          Tekrar yap
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2.5 rounded-full text-sm font-medium text-white bg-slate-900 hover:bg-rose-500 hover:shadow-lg transition-all"
        >
          Önerilere geç
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QuizIcon — scenario-driven monokrom mini SVGs (cilt tipini ele vermez)
// ─────────────────────────────────────────────────────────────────────────────

function QuizIcon({ id }: { id: QuizIconId }) {
  const baseClass = 'h-10 w-10 text-slate-700';
  switch (id) {
    case 'tense':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <rect x="6" y="6" width="28" height="28" rx="6" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10 14 Q20 9 30 14" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
          <path d="M10 20 Q20 15 30 20" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
          <path d="M10 26 Q20 21 30 26" stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'zone-shine':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <path d="M20 6 C28 6 32 12 32 20 C32 28 27 34 20 34 C13 34 8 28 8 20 C8 12 12 6 20 6 Z" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <path d="M14 14 L26 14 L26 16 L21 16 L21 26 L19 26 L19 16 L14 16 Z" fill="currentColor" opacity="0.85" />
        </svg>
      );
    case 'all-glow':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <circle cx="20" cy="20" r="14" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="14" cy="14" r="1.6" fill="currentColor" />
          <circle cx="26" cy="14" r="1.6" fill="currentColor" />
          <circle cx="14" cy="26" r="1.6" fill="currentColor" />
          <circle cx="26" cy="26" r="1.6" fill="currentColor" />
          <circle cx="20" cy="20" r="2.2" fill="currentColor" />
          <path d="M20 10 L20 7 M20 33 L20 30 M10 20 L7 20 M33 20 L30 20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
      );
    case 'clean-paper':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <rect x="10" y="6" width="20" height="28" rx="2" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <line x1="14" y1="12" x2="26" y2="12" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
          <line x1="14" y1="16" x2="26" y2="16" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
          <line x1="14" y1="20" x2="22" y2="20" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
          <line x1="14" y1="24" x2="26" y2="24" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
        </svg>
      );
    case 'one-spot':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <rect x="10" y="6" width="20" height="28" rx="2" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="20" cy="18" r="4" fill="currentColor" opacity="0.55" />
          <line x1="14" y1="26" x2="26" y2="26" stroke="currentColor" strokeWidth="0.7" opacity="0.4" />
        </svg>
      );
    case 'many-spots':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <rect x="10" y="6" width="20" height="28" rx="2" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="16" cy="13" r="2.4" fill="currentColor" opacity="0.55" />
          <circle cx="23" cy="17" r="3" fill="currentColor" opacity="0.55" />
          <circle cx="14" cy="22" r="1.8" fill="currentColor" opacity="0.45" />
          <circle cx="25" cy="25" r="2.4" fill="currentColor" opacity="0.55" />
          <circle cx="18" cy="29" r="2" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case 'snowflake':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none">
            <line x1="20" y1="6" x2="20" y2="34" />
            <line x1="6" y1="20" x2="34" y2="20" />
            <line x1="10" y1="10" x2="30" y2="30" />
            <line x1="30" y1="10" x2="10" y2="30" />
            <path d="M17 9 L20 12 L23 9" />
            <path d="M17 31 L20 28 L23 31" />
            <path d="M9 17 L12 20 L9 23" />
            <path d="M31 17 L28 20 L31 23" />
          </g>
        </svg>
      );
    case 'split-weather':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <defs>
            <clipPath id="quiz-split-left">
              <rect x="0" y="0" width="20" height="40" />
            </clipPath>
            <clipPath id="quiz-split-right">
              <rect x="20" y="0" width="20" height="40" />
            </clipPath>
          </defs>
          <g clipPath="url(#quiz-split-left)" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none">
            <line x1="20" y1="8" x2="20" y2="32" />
            <line x1="10" y1="14" x2="20" y2="20" />
            <line x1="10" y1="26" x2="20" y2="20" />
          </g>
          <g clipPath="url(#quiz-split-right)">
            <circle cx="26" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
              <line x1="26" y1="11" x2="26" y2="13" />
              <line x1="26" y1="27" x2="26" y2="29" />
              <line x1="32" y1="20" x2="34" y2="20" />
              <line x1="31" y1="15" x2="33" y2="13" />
              <line x1="31" y1="25" x2="33" y2="27" />
            </g>
          </g>
          <line x1="20" y1="6" x2="20" y2="34" stroke="currentColor" strokeWidth="0.6" opacity="0.4" strokeDasharray="2 2" />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <circle cx="20" cy="20" r="7" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
            <line x1="20" y1="5" x2="20" y2="9" />
            <line x1="20" y1="31" x2="20" y2="35" />
            <line x1="5" y1="20" x2="9" y2="20" />
            <line x1="31" y1="20" x2="35" y2="20" />
            <line x1="9.5" y1="9.5" x2="12" y2="12" />
            <line x1="28" y1="28" x2="30.5" y2="30.5" />
            <line x1="30.5" y1="9.5" x2="28" y2="12" />
            <line x1="9.5" y1="30.5" x2="12" y2="28" />
          </g>
        </svg>
      );
    case 'cracked-cake':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <rect x="6" y="6" width="28" height="28" rx="6" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <g stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round">
            <path d="M14 10 L18 16 L14 22 L18 28" />
            <path d="M22 8 L26 14 L22 20 L26 26 L22 32" />
            <path d="M10 16 L16 18 M24 18 L30 16" opacity="0.6" />
            <path d="M10 28 L16 26 M24 26 L30 28" opacity="0.6" />
          </g>
        </svg>
      );
    case 'partial-slip':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <rect x="6" y="6" width="28" height="28" rx="6" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <line x1="20" y1="8" x2="20" y2="32" stroke="currentColor" strokeWidth="0.6" opacity="0.4" strokeDasharray="2 2" />
          <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none">
            <path d="M13 12 Q11 17 14 22 Q12 27 14 31" />
            <path d="M11 14 Q9 19 12 24" opacity="0.6" />
          </g>
          <g stroke="currentColor" strokeWidth="0.9" fill="none" opacity="0.5">
            <line x1="24" y1="14" x2="30" y2="14" />
            <line x1="24" y1="20" x2="30" y2="20" />
            <line x1="24" y1="26" x2="30" y2="26" />
          </g>
        </svg>
      );
    case 'full-slip':
      return (
        <svg viewBox="0 0 40 40" className={baseClass} aria-hidden>
          <rect x="6" y="6" width="28" height="28" rx="6" fill="#F8FAFC" stroke="currentColor" strokeWidth="1.4" />
          <g stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none">
            <path d="M12 10 Q10 16 13 22 Q11 28 13 32" />
            <path d="M20 10 Q18 16 21 22 Q19 28 21 32" />
            <path d="M28 10 Q26 16 29 22 Q27 28 29 32" />
          </g>
        </svg>
      );
  }
}
