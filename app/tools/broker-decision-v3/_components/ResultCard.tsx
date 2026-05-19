"use client";

import { useEffect, useRef } from "react";
import { getStateName } from "../_config/states";
import { TRACK_ACCENTS } from "../_config/track-templates";
import type { Track, V3Inputs, V3Recommendation } from "../_lib/types";

interface ResultCardProps {
  result: V3Recommendation;
  onReset: () => void;
}

// Time-saved derivation — directional hours/year the buyer gets back by
// following the track's recommendation. Track A is highest (broker runs the
// bidding/negotiation); Track B lower (still doing the work with our
// guidance); Track C is research-heavy (utility programs + tariffs).
// Scales with site count + spend tier, since multi-site portfolios eat
// proportionally more procurement time. Rounded to nearest 5 for the
// directional feel — same posture the old "directional savings" stat carried.
const TIME_BASE_BY_TRACK: Record<Track, number> = {
  A_use_broker: 20,
  B_go_direct: 6,
  C_regulated: 12,
};
const SITE_FACTOR: Record<NonNullable<V3Inputs["locationCount"]>, number> = {
  "1": 1,
  "2-10": 1.6,
  "11-50": 2.4,
  "50+": 3.5,
};
const SPEND_FACTOR: Record<NonNullable<V3Inputs["spend"]>, number> = {
  under_25k: 0.8,
  "25k_100k": 1,
  "100k_500k": 1.6,
  over_500k: 2.4,
};

function estTimeSavedHours(inputs: V3Inputs, track: Track): number {
  const sf = inputs.locationCount ? SITE_FACTOR[inputs.locationCount] : 1;
  const pf = inputs.spend ? SPEND_FACTOR[inputs.spend] : 1;
  const raw = TIME_BASE_BY_TRACK[track] * sf * pf;
  return Math.max(5, Math.round(raw / 5) * 5);
}

// One-line trace condensing the chip-trail. Format: "sites · states · spend · priority · timing"
// Lets the user see exactly what the engine read off their answers without re-opening the form.
const PRIORITY_TRACE: Record<NonNullable<V3Inputs["priority"]>, string> = {
  balanced_price_risk: "Risk-aware",
  price_first: "Price focus",
  budget_certainty: "Lock & forget",
  handled_for_me: "Managed lean",
};
const SITUATION_TRACE: Record<NonNullable<V3Inputs["situation"]>, string> = {
  shopping_now: "Active buy",
  renewal_soon: "Window opening",
  contract_6_plus_months: "Watching",
  always_in_market: "Always live",
};
const SPEND_TRACE: Record<NonNullable<V3Inputs["spend"]>, string> = {
  under_25k: "Under $25K",
  "25k_100k": "$25K–$100K",
  "100k_500k": "$100K–$500K",
  over_500k: "Over $500K",
};
const LOCATION_TRACE: Record<NonNullable<V3Inputs["locationCount"]>, string> = {
  "1": "1 site",
  "2-10": "2–10 sites",
  "11-50": "11–50 sites",
  "50+": "50+ sites",
};

function buildRuleTrace(inputs: V3Inputs): string {
  const parts: string[] = [];
  if (inputs.locationCount) parts.push(LOCATION_TRACE[inputs.locationCount]);
  if (inputs.states.length === 1) parts.push(getStateName(inputs.states[0]));
  else if (inputs.states.length > 1) parts.push(`${inputs.states.length} states`);
  if (inputs.spend) parts.push(SPEND_TRACE[inputs.spend]);
  if (inputs.priority) parts.push(PRIORITY_TRACE[inputs.priority]);
  if (inputs.situation) parts.push(SITUATION_TRACE[inputs.situation]);
  return parts.join(" · ");
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
      className="v3-verdict-rise overflow-hidden rounded-[16px] border border-slate-200/70 shadow-[0_32px_80px_-20px_rgba(15,23,42,0.18)] focus:outline-none"
    >
      {/* Verdict band — track-specific gradient hero. Larger than the previous
          header so this reads as the signature moment of the page. */}
      <header
        style={{ background: accent.headerBg }}
        className="px-6 py-10 text-white sm:px-10 sm:py-12 lg:px-12 lg:py-14"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/75">
          Your path
        </p>
        <h3 className="mt-3 text-[40px] font-semibold leading-[1.02] tracking-tight sm:text-[52px] lg:text-[60px]">
          {result.trackLabel}
        </h3>
        <p className="mt-5 max-w-[640px] text-base leading-relaxed text-white/90 sm:text-lg">
          {result.headline}
        </p>
        {result.timingChip && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
            {result.timingChip}
          </p>
        )}
      </header>

      <div className="space-y-7 px-6 py-7 sm:px-8 sm:py-8">
        {/* Rule trace — chip-trail collapsed to a single line so the user sees
            exactly what the engine read off their answers. */}
        <div className="flex flex-col gap-1.5 rounded-[12px] border border-slate-200/80 bg-white/70 px-4 py-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Here&apos;s how we got here
          </span>
          <span className="text-sm leading-snug text-slate-700">
            {buildRuleTrace(result.inputs)}
          </span>
        </div>

        {/* Single stat — hours of your life back, not dollars. Track-scaled
            (broker = highest, direct = lower, regulated = research-heavy). */}
        <div className="grid grid-cols-1" data-temp="result-stat-time-saved">
          <StatBlock
            label="Time saved"
            value={`${estTimeSavedHours(result.inputs, result.track)} hrs / yr`}
            hint="directional"
            tone="brand"
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
  brand: {
    bg: "bg-arise-50",
    label: "text-[#006bc5]",
    value: "text-[#006bc5]",
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
