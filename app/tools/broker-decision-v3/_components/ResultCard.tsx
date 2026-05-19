"use client";

import { useEffect, useRef } from "react";
import { TRACK_ACCENTS } from "../_config/track-templates";
import type { V3Recommendation } from "../_lib/types";

interface ResultCardProps {
  result: V3Recommendation;
  onReset: () => void;
}

const COMPLEXITY_LABELS = { low: "Low", medium: "Medium", high: "High" } as const;

function fmtSavings(n: number | null): string {
  if (n === null) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const ref = useRef<HTMLElement>(null);
  const accent = TRACK_ACCENTS[result.track];

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.focus({ preventScroll: reduce });
    if (!reduce) {
      ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, []);

  return (
    <article
      ref={ref}
      tabIndex={-1}
      aria-live="polite"
      aria-label={`Recommendation: ${result.trackLabel}`}
      style={{ backgroundColor: accent.bodyBg }}
      className="overflow-hidden rounded-[16px] border border-slate-200/70 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12)] focus:outline-none"
    >
      {/* Header band — track-specific gradient hero. */}
      <header
        style={{ background: accent.headerBg }}
        className="px-6 py-7 text-white sm:px-8 sm:py-8"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
          Your path
        </p>
        <h3 className="mt-3 text-[32px] font-semibold leading-[1.05] tracking-tight sm:text-[40px]">
          {result.trackLabel}
        </h3>
        {result.timingChip && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
            {result.timingChip}
          </p>
        )}
      </header>

      <div className="space-y-7 px-6 py-7 sm:px-8 sm:py-8">
        <p className="text-base font-semibold leading-snug text-[#0A1F1F] sm:text-lg">
          {result.headline}
        </p>

        {/* Stat row — colored tinted blocks per image-5 reference. Two-up; the
            savings block carries the brand color and complexity carries indigo. */}
        <div className="grid grid-cols-2 gap-3">
          <StatBlock
            label={result.metrics.estAnnualSavings === null ? "Focus area" : "Est. savings / yr"}
            value={
              result.metrics.estAnnualSavings === null
                ? "Tariff + efficiency"
                : fmtSavings(result.metrics.estAnnualSavings)
            }
            hint={result.metrics.estAnnualSavings === null ? null : "directional"}
            tone="cyan"
          />
          <StatBlock
            label="Complexity"
            value={COMPLEXITY_LABELS[result.metrics.complexity]}
            tone="indigo"
          />
        </div>

        <section>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            Why this recommendation
          </h4>
          <ul className="mt-3 space-y-2.5">
            {result.whyBullets.map((b, i) => (
              <li key={i} className="text-sm leading-6 text-slate-700">
                <p className="font-semibold text-slate-900">{b.label}</p>
                <p className="mt-1 text-slate-600">{b.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="presumptive-close-heading"
          style={{ backgroundColor: accent.chipBg }}
          className="rounded-[14px] p-5"
        >
          <div className="flex items-center gap-2">
            <h4
              id="presumptive-close-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: accent.chipText }}
            >
              What we&apos;d do
            </h4>
            <span className="text-[11px] text-slate-500">— from the Arise team</span>
          </div>
          <p className="mt-2.5 text-sm leading-6 text-[#0A1F1F]">
            {result.presumptiveClose.body}
          </p>
          <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              className="v3-pill-primary inline-flex h-10 items-center justify-center gap-2 px-5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
            >
              {result.presumptiveClose.cta}
              <span aria-hidden>→</span>
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center justify-center gap-1.5 text-sm text-slate-700 underline-offset-4 hover:text-[#0A1F1F] hover:underline focus:outline-none focus-visible:underline"
            >
              Download PDF
            </button>
          </div>
        </section>

        <div className="flex flex-col items-start gap-3 border-t border-slate-200/80 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="#how-to-vet"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#006bc5] transition-colors hover:text-arise-800 focus:outline-none focus-visible:underline"
          >
            See questions to ask
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
          </a>
          <button
            type="button"
            onClick={onReset}
            className="text-sm text-slate-500 underline-offset-4 transition-colors hover:text-[#0A1F1F] hover:underline focus:outline-none focus-visible:underline"
          >
            Edit my answers
          </button>
        </div>
      </div>
    </article>
  );
}

const STAT_TONES = {
  cyan: {
    bg: "bg-[#ECFEFF]",
    label: "text-[#0e7490]",
    value: "text-[#0e7490]",
  },
  indigo: {
    bg: "bg-[#EEF0FB]",
    label: "text-[#4F5CB8]",
    value: "text-[#4F5CB8]",
  },
  neutral: {
    bg: "bg-slate-100",
    label: "text-slate-600",
    value: "text-slate-900",
  },
} as const;

function StatBlock({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: string;
  hint?: string | null;
  tone: keyof typeof STAT_TONES;
}) {
  const t = STAT_TONES[tone];
  return (
    <div className={`rounded-[12px] ${t.bg} p-4`}>
      <div className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${t.label}`}>
        {label}
      </div>
      <div className={`mt-2 text-[26px] font-semibold leading-none tracking-tight tabular-nums sm:text-[30px] ${t.value}`}>
        {value}
      </div>
      {hint && (
        <div className="mt-1.5 text-[10px] text-slate-500">{hint}</div>
      )}
    </div>
  );
}
