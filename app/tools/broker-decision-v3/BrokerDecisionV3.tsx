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
    <section id="broker-check" className="relative pb-16 pt-2 sm:pb-20 sm:pt-2 lg:pb-24 lg:pt-4">
      <div className="relative mx-auto max-w-[1184px] px-5 sm:px-8">
        {phase === "form" && (
          <div className="rounded-[20px] border border-white/60 bg-white/55 p-5 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:p-7 lg:p-10">
            <SmartForm onChange={setFormInputs} onSubmit={handleSubmit} />
          </div>
        )}

        {phase === "analyzing" && <Interstitial />}

        {phase === "result" && result && (
          <div className="space-y-6">
            <ResultCard result={result} onReset={handleReset} />
            <div className="rounded-[20px] border border-white/60 bg-white/55 p-5 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:p-7 lg:p-10">
              <LeadMagnet result={result} inputs={formInputs} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
