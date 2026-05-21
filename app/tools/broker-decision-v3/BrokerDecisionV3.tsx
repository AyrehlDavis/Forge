"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Interstitial } from "./_components/Interstitial";
import { LeadMagnet } from "./_components/LeadMagnet";
import { ResultCard } from "./_components/ResultCard";
import { SmartForm } from "./_components/SmartForm";
import { recommend } from "./_lib/recommend";
import type { V3Inputs, V3Recommendation } from "./_lib/types";

type Phase = "form" | "analyzing" | "result";
const ANALYZE_DURATION_MS = 900;

const EMPTY: V3Inputs = {
  spend: null,
  locationCount: null,
  states: [],
  priority: null,
  situation: null,
};

export function BrokerDecisionV3() {
  const [phase, setPhase] = useState<Phase>("form");
  const [formInputs, setFormInputs] = useState<V3Inputs>(EMPTY);
  const [result, setResult] = useState<V3Recommendation | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const handleSubmit = useCallback((submitted: V3Inputs) => {
    setFormInputs(submitted);
    setPhase("analyzing");
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduce ? 0 : ANALYZE_DURATION_MS;
    timerRef.current = window.setTimeout(() => {
      setResult(recommend(submitted));
      setPhase("result");
    }, delay);
  }, []);

  const handleReset = useCallback(() => {
    setPhase("form");
    setResult(null);
  }, []);

  return (
    <section id="broker-check" className="relative pb-10 pt-2 sm:pb-12 sm:pt-2 lg:pb-12 lg:pt-4">
      <div className="relative mx-auto max-w-[1184px] px-5 sm:px-8">
        {phase === "form" && (
          <div className="mx-auto max-w-[820px]">
            {/* Tool framing — signals "this is the tool" so the form doesn't
                read as just another card. Left-aligned to match all other
                section headers on the page. */}
            <div className="mb-6 sm:mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
                The check · 5 questions
              </p>
              <h2 className="mt-3 text-balance text-[28px] font-semibold leading-[1.1] tracking-[-0.022em] text-slate-900 sm:text-[32px] lg:text-[36px]">
                Find your <span className="text-[#006bc5]">move</span>.
              </h2>
              <p className="mt-2 max-w-[440px] text-[14px] leading-6 text-slate-600 sm:text-[15px]">
                Use a broker, go direct, or stick with your local utility — answer five questions to see what fits.
              </p>
            </div>
            <div className="rounded-[20px] border border-white/60 bg-white/55 p-4 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:p-6 lg:p-8">
              <SmartForm onChange={setFormInputs} onSubmit={handleSubmit} />
            </div>
          </div>
        )}

        {phase === "analyzing" && <Interstitial />}

        {phase === "result" && result && (
          <ResultCard
            result={result}
            onReset={handleReset}
            magnet={<LeadMagnet result={result} inputs={formInputs} />}
          />
        )}
      </div>
    </section>
  );
}
