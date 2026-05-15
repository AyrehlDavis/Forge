"use client";

import { useEffect, useRef } from "react";
import { StatCountUp } from "./StatCountUp";
import type { V2RecommendationOutput } from "../_lib/types";

interface ResultPanelProps {
  output: V2RecommendationOutput;
  onReset: () => void;
}

const RECOMMENDATION_LABELS: Record<V2RecommendationOutput["recommendation"], string> = {
  broker: "Use a broker",
  direct: "Go direct",
  hybrid: "Hybrid approach",
  regulated: "Regulated market",
};

const COMPLEXITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

function fmtSavings(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export function ResultPanel({ output, onReset }: ResultPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.focus({ preventScroll: reduce });
    if (!reduce) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const savings = output.metrics.estAnnualSavings;

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-live="polite"
      aria-label={`Recommendation: ${RECOMMENDATION_LABELS[output.recommendation]}`}
      className="result-panel relative overflow-hidden rounded-2xl border border-[var(--v2-border-default)] bg-gradient-to-br from-white/80 via-white/65 to-[rgba(212,243,243,0.4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),var(--v2-shadow-hero)] backdrop-blur-2xl focus:outline-none"
    >
      <div className="px-8 pb-2 pt-10 sm:px-12 sm:pt-12">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--v2-accent-soft)] px-3 py-1 text-xs font-medium text-[var(--v2-accent)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" aria-hidden />
          {RECOMMENDATION_LABELS[output.recommendation]}
        </div>
        <div className="result-headline">
          <h2 className="max-w-2xl text-[28px] font-semibold leading-[1.18] tracking-[-0.018em] text-[var(--v2-text-primary)] sm:text-[36px]">
            {output.headline}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-8 pb-10 pt-8 sm:grid-cols-3 sm:gap-8 sm:px-12 sm:pb-12">
        <StatBlock
          label={savings === null ? "Action area" : "Est. savings / yr"}
          tone="warm"
          value={
            savings === null ? (
              <span className="text-[var(--v2-text-primary)]">—</span>
            ) : (
              <span style={{ color: "var(--v2-accent-warm)" }}>
                <StatCountUp value={savings} formatter={(n) => fmtSavings(n)} />
              </span>
            )
          }
          hint={savings === null ? "Tariff + efficiency" : "directional"}
        />
        <StatBlock
          label="Complexity"
          tone="cool"
          value={
            <span style={{ color: "var(--v2-accent-cool)" }}>
              {COMPLEXITY_LABELS[output.metrics.complexity]}
            </span>
          }
        />
        <StatBlock
          label="Time to act"
          tone="primary"
          value={
            <span className="text-[var(--v2-text-primary)]">{output.metrics.daysToAct}</span>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-8 border-t border-[var(--v2-border-subtle)] px-8 py-10 sm:px-12 sm:py-12 md:grid-cols-2">
        <div className="result-section">
          <h3 className="mb-3 text-sm font-semibold text-[var(--v2-text-primary)]">Why</h3>
          <ul className="space-y-2.5 text-[15px] leading-relaxed text-[var(--v2-text-secondary)]">
            {output.why.map((line, i) => (
              <li key={i} className="flex gap-2.5">
                <span
                  className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--v2-text-tertiary)]"
                  aria-hidden
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="advisor-note relative rounded-2xl bg-[var(--v2-accent-soft)] p-6">
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--v2-accent)]">What we&apos;d do</h3>
            <span className="text-xs text-[var(--v2-text-tertiary)]">— from the Arise team</span>
          </div>
          <p className="text-[15px] leading-relaxed text-[var(--v2-text-primary)]">
            {output.whatWedDo}
          </p>
        </div>
      </div>

      <div className="action-ladder flex flex-col gap-3 border-t border-[var(--v2-border-subtle)] bg-white/40 px-8 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <button
            type="button"
            className="v2-pill-accent group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Talk to an Arise advisor
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1.5 text-sm text-[var(--v2-text-secondary)] underline-offset-4 hover:text-[var(--v2-text-primary)] hover:underline focus:outline-none focus-visible:text-[var(--v2-accent)] focus-visible:underline"
          >
            Download PDF
          </button>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-[var(--v2-text-tertiary)] underline-offset-4 transition-colors hover:text-[var(--v2-text-primary)] hover:underline focus:outline-none focus-visible:underline"
        >
          Edit my answers
        </button>
      </div>
    </section>
  );
}

function StatBlock({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: "warm" | "cool" | "primary";
}) {
  const toneBg =
    tone === "warm"
      ? "bg-[var(--v2-accent-warm-soft)]"
      : tone === "cool"
        ? "bg-[var(--v2-accent-cool-soft)]"
        : "bg-[var(--v2-accent-soft)]";

  return (
    <div className={`stat-block rounded-2xl border border-[var(--v2-border-default)] ${toneBg} p-5 backdrop-blur-md`}>
      <div className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--v2-text-tertiary)]">
        {label}
      </div>
      <div className="text-[32px] font-semibold tracking-tight tabular-nums leading-none sm:text-[36px]">
        {value}
      </div>
      {hint && (
        <div className="mt-1.5 text-[11px] text-[var(--v2-text-tertiary)]">{hint}</div>
      )}
    </div>
  );
}
