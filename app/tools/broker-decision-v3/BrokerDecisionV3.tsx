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
    <section id="broker-check" className="relative pb-14 pt-14 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20">
      <div className="relative mx-auto max-w-[1184px] px-5 sm:px-8">
        {phase === "form" && (
          <>
            {/* Section header — at the page's left rail, matches every other
                section header on the page. */}
            <div className="mb-6 max-w-[760px] sm:mb-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
                The check · 5 questions
              </p>
              <h2 className="mt-3 text-balance text-[34px] font-semibold leading-[1.06] tracking-[-0.025em] text-slate-900 sm:text-[44px] lg:text-[52px]">
                Find your <span className="text-[#006bc5]">move</span>.
              </h2>
              <p className="mt-4 max-w-[560px] text-[14px] leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
                Broker, direct, or local utility — and the math behind the call. No email required.
              </p>
            </div>

            <div className="mx-auto max-w-[820px] rounded-[24px] border border-white/60 bg-white/55 p-5 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:p-8 lg:p-10">
              <SmartForm onChange={setFormInputs} onSubmit={handleSubmit} />
            </div>
          </>
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

