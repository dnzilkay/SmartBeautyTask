'use client';

import { useEffect, useState } from 'react';
import { HERO_BY_TYPE } from './SkinTypeSelector';
import { SKIN_TYPE_LABELS, SKIN_TYPE_THEMES, type SkinType } from '@/lib/types';

interface ProductSkeletonProps {
  skinType?: SkinType;
}

const STEPS = [
  'Cilt yapını okuyorum',
  'Sana özel ürünleri tarıyorum',
  'Önerileri sıralıyorum',
];

const SCAN_COLOR: Record<SkinType, string> = {
  dry: '#0EA5E9',
  oily: '#F59E0B',
  combination: '#D946EF',
};

export function ProductSkeleton({ skinType }: ProductSkeletonProps) {
  const [step, setStep] = useState(0);
  const theme = skinType ? SKIN_TYPE_THEMES[skinType] : null;
  const label = skinType ? SKIN_TYPE_LABELS[skinType] : null;
  const Hero = skinType ? HERO_BY_TYPE[skinType] : null;
  const scanColor = skinType ? SCAN_COLOR[skinType] : '#94A3B8';

  useEffect(() => {
    const t1 = window.setTimeout(() => setStep(1), 950);
    const t2 = window.setTimeout(() => setStep(2), 1900);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <section
      aria-label="Yapay zeka analiz ediyor"
      aria-busy="true"
      aria-live="polite"
      className="relative w-full max-w-3xl mx-auto py-10 md:py-16"
    >
      <div className="relative flex flex-col items-center text-center">
        <div className="relative grid place-items-center h-56 w-56 md:h-64 md:w-64">
          {theme && (
            <>
              <span
                aria-hidden
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${theme.glow} blur-3xl opacity-70`}
              />
              <span
                aria-hidden
                className="scan-ring scan-ring-1 absolute h-32 w-32 md:h-36 md:w-36 rounded-full border"
                style={{ borderColor: scanColor }}
              />
              <span
                aria-hidden
                className="scan-ring scan-ring-2 absolute h-32 w-32 md:h-36 md:w-36 rounded-full border"
                style={{ borderColor: scanColor }}
              />
              <span
                aria-hidden
                className="scan-ring scan-ring-3 absolute h-32 w-32 md:h-36 md:w-36 rounded-full border"
                style={{ borderColor: scanColor }}
              />
            </>
          )}
          <div className="relative z-10 scale-110 md:scale-125">
            {Hero && <Hero />}
          </div>
        </div>

        {label && (
          <p className={`mt-2 text-[10px] font-medium uppercase tracking-[0.4em] ${theme?.accentText ?? 'text-slate-500'}`}>
            {label} Cilt Analizi
          </p>
        )}

        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
          Yapay zeka senin için çalışıyor
        </h2>

        <div className="relative mt-6 min-h-7">
          <p key={step} className="step-text-fresh text-slate-600">
            {STEPS[step]}
          </p>
        </div>

        <div className="mt-5 flex items-center gap-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={[
                'h-1.5 rounded-full transition-all duration-500',
                i <= step ? `w-8 ${theme?.accentBg ?? 'bg-slate-700'}` : 'w-1.5 bg-slate-300',
              ].join(' ')}
            />
          ))}
        </div>

        <div className="mt-6 w-56 md:w-72 h-1 rounded-full bg-slate-200/70 overflow-hidden">
          <div
            className={[
              'h-full',
              theme ? `bg-gradient-to-r ${theme.glow}` : 'bg-rose-300',
              'analysis-progress',
            ].join(' ')}
          />
        </div>
      </div>
    </section>
  );
}
