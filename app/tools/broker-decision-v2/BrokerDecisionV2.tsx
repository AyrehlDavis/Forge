"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Interstitial } from "./_components/Interstitial";
import { ProgressDots } from "./_components/ProgressDots";
import { ResultPanel } from "./_components/ResultPanel";
import { SmartForm } from "./_components/SmartForm";
import { recommend } from "./_lib/recommend";
import type { V2Inputs, V2RecommendationOutput } from "./_lib/types";

type Phase = "form" | "analyzing" | "result";

const EMPTY_INPUTS: V2Inputs = {
  annualSpend: 480_000,
  siteCount: 3,
  states: [],
  priority: null,
  situation: null,
};

const ANALYZE_DURATION_MS = 900;

export function BrokerDecisionV2() {
  const [phase, setPhase] = useState<Phase>("form");
  const [inputs, setInputs] = useState<V2Inputs>(EMPTY_INPUTS);
  const [output, setOutput] = useState<V2RecommendationOutput | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleChange = useCallback((next: V2Inputs) => {
    setInputs(next);
  }, []);

  const handleSubmit = useCallback((submitted: V2Inputs) => {
    setInputs(submitted);
    setPhase("analyzing");
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduce ? 0 : ANALYZE_DURATION_MS;
    timerRef.current = window.setTimeout(() => {
      setOutput(recommend(submitted));
      setPhase("result");
    }, delay);
  }, []);

  const handleReset = useCallback(() => {
    setPhase("form");
    setOutput(null);
  }, []);

  return (
    <div className="relative min-h-screen text-[var(--v2-text-primary)]">
      {/* Hero mesh: ambient layered radial gradients in Arise teal family.
          Fixed behind page, very subtle; not decoration but atmosphere. */}
      <div className="v2-mesh fixed inset-0 -z-10" aria-hidden />

      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6 sm:px-8">
        <a
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80 focus:outline-none focus-visible:opacity-80"
        >
          <Image
            src="/arise-logo.svg"
            alt="Arise Energy"
            width={100}
            height={40}
            priority
            className="h-7 w-auto"
          />
          <span className="text-sm font-normal text-[var(--v2-text-tertiary)]">
            / Forge
          </span>
        </a>
        <nav className="hidden items-center gap-7 text-sm text-[var(--v2-text-secondary)] sm:flex">
          <a
            href="#"
            className="transition-colors hover:text-[var(--v2-text-primary)]"
          >
            Tools
          </a>
          <a
            href="#"
            className="transition-colors hover:text-[var(--v2-text-primary)]"
          >
            About
          </a>
          <a
            href="#"
            className="rounded-full bg-[var(--v2-text-primary)] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--v2-accent)]"
          >
            Talk to us
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-24 sm:px-8">
        <section className="hero pt-12 pb-16 sm:pt-20 sm:pb-24">
          <h1 className="max-w-3xl text-[44px] font-semibold leading-[1.04] tracking-[-0.025em] text-[var(--v2-text-primary)] sm:text-[64px]">
            Should you use an
            <br />
            <span className="text-[var(--v2-accent)]">energy broker?</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-relaxed text-[var(--v2-text-secondary)] sm:text-xl">
            Tell us about your portfolio. We&apos;ll tell you what to do — and what
            we&apos;d do if it were us.
          </p>
        </section>

        <section id="decide">
          {phase === "form" && (
            <SmartForm onChange={handleChange} onSubmit={handleSubmit} />
          )}
          {phase === "analyzing" && <Interstitial />}
          {phase === "result" && output && (
            <ResultPanel output={output} onReset={handleReset} />
          )}
        </section>
        {phase === "form" && <ProgressDots inputs={inputs} />}
      </main>

      <footer className="mx-auto max-w-5xl px-6 pb-10 sm:px-8">
        <div className="border-t border-[var(--v2-border-subtle)] pt-6 text-xs text-[var(--v2-text-tertiary)]">
          Arise Energy · A free decision tool for commercial energy buyers
        </div>
      </footer>
    </div>
  );
}
