"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getState, getStateName } from "../_config/states";
import { TRACK_ACCENTS } from "../_config/track-templates";
import type { Track, V3Inputs, V3Recommendation } from "../_lib/types";

interface ResultCardProps {
  result: V3Recommendation;
  onReset: () => void;
  // Inline meeting-kit content rendered as the final section of the card.
  // Lets the verdict + recommendation + meeting kit live in one continuous
  // artifact instead of two stacked cards.
  magnet?: ReactNode;
}

// Time-saved derivation — directional hours the buyer gets back by following
// the track's recommendation. Track A is highest (broker runs bidding); Track
// B lower (still doing the work with our guidance); Track C is research-heavy
// (utility programs + tariffs). Scales with site count + spend tier.
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

// Comparative chip — translates hours into a working-days frame at 8 hrs/day.
// Floors to nearest 0.5 day so the chip stays directional (and matches the
// Mage spec: A=9, B=7.5, C=10 for the 75/60/80-hour bases).
function workingDays(hours: number): string {
  const days = hours / 8;
  const rounded = Math.floor(days * 2) / 2;
  return rounded % 1 === 0 ? `${rounded}` : rounded.toFixed(1);
}

// Per-track subtext qualifies the time-saved stat — names the work Arise
// absorbs so the value doesn't read as a free dollar figure.
const TIME_SAVED_SUBTEXT: Record<Track, string> = {
  A_use_broker:
    "Broker research, supplier calls, and quote comparison you don't need to start from scratch.",
  B_go_direct:
    "Supplier RFP authoring, bid review, and contract comparison you don't need to do solo.",
  C_regulated:
    "Portfolio mechanics setup, utility program research, and tariff analysis we handle.",
};

// Track-accent color extends beyond the verdict band — used for the
// presumptive-close left rule, why-trace numerals, stat meter, footer link.
// Pulls from TRACK_ACCENTS.chipText so accents stay in sync with the band.
function trackAccent(track: Track): string {
  return TRACK_ACCENTS[track].chipText;
}

// Mono metadata rail content — names the regulatory frame the verdict
// applies to. ERCOT for Texas; PJM/CAISO/ISO-NE etc. for other dereg states
// would slot in here when multi-state support lands. Renewal-window label
// reads off the situation input.
const SITUATION_RAIL: Record<NonNullable<V3Inputs["situation"]>, string> = {
  shopping_now: "ACTIVE WINDOW",
  renewal_soon: "RENEWAL WINDOW",
  contract_6_plus_months: "WATCH WINDOW",
  always_in_market: "CONTINUOUS",
};
const TRACK_RAIL: Record<Track, string> = {
  A_use_broker: "TRACK A",
  B_go_direct: "TRACK B",
  C_regulated: "TRACK C",
};

function buildMetadataRail(inputs: V3Inputs, track: Track): string {
  const parts = [TRACK_RAIL[track]];
  if (inputs.states.length === 1) {
    const s = getState(inputs.states[0]);
    if (s?.isDeregulated && s.code === "TX") parts.push("ERCOT");
    else if (s) parts.push(s.code);
  } else if (inputs.states.length > 1) {
    parts.push(`${inputs.states.length} STATES`);
  }
  if (inputs.situation) parts.push(SITUATION_RAIL[inputs.situation]);
  return parts.join(" · ");
}

// Source-stamp footer — transforms the card from feature-checklist to
// generated document. Date formatted en-US locale per spec.
const SOURCE_STAMP_DATE = "May 20, 2026";

function buildSourceStamp(inputs: V3Inputs): string {
  const inputCount =
    (inputs.locationCount ? 1 : 0) +
    (inputs.states.length > 0 ? 1 : 0) +
    (inputs.spend ? 1 : 0) +
    (inputs.priority ? 1 : 0) +
    (inputs.situation ? 1 : 0);

  const marketDescriptor =
    inputs.states.length === 0
      ? "no market selected"
      : inputs.states.length === 1
        ? (() => {
            const s = getState(inputs.states[0]);
            const name = getStateName(inputs.states[0]);
            if (!s) return name.toLowerCase();
            if (s.isDeregulated) return `${name.toLowerCase()} open market`;
            if (s.isPartial) return `${name.toLowerCase()} partial market`;
            return `${name.toLowerCase()} regulated market`;
          })()
        : `${inputs.states.length} states`;

  return `Generated from ${inputCount} inputs · ${marketDescriptor} · ${SOURCE_STAMP_DATE}`;
}

export function ResultCard({ result, onReset, magnet }: ResultCardProps) {
  const ref = useRef<HTMLElement>(null);
  const accentColor = trackAccent(result.track);
  const hours = estTimeSavedHours(result.inputs, result.track);

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
      className="v3-verdict-rise overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_8px_32px_rgba(15,23,42,0.04)] focus:outline-none"
    >
      {/* Verdict band — opening editorial block. 4px track-accent top rule
          is the only color signal; typography carries the moment. Tighter
          padding so the band introduces but doesn't dominate. */}
      <header
        style={{ borderTopColor: accentColor }}
        className="border-t-4 px-6 pb-7 pt-6 sm:px-8 sm:pb-8 sm:pt-7 lg:px-10"
      >
        <p
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500"
          data-temp="verdict-metadata-rail"
        >
          {buildMetadataRail(result.inputs, result.track)}
        </p>
        <h2 className="mt-3 text-[28px] font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-[32px] lg:text-[40px]">
          {result.trackLabel}
        </h2>
        <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-slate-600">
          {result.headline}
        </p>
        {result.timingChip && (
          <p className="mt-4 inline-flex items-center gap-2 text-[13px] text-slate-500">
            <span
              aria-hidden
              style={{ backgroundColor: accentColor }}
              className="h-1.5 w-1.5 rounded-full"
            />
            {result.timingChip}
          </p>
        )}
      </header>

      {/* Body sections — separated by hairlines, not chrome. Each section
          flows as typography, no nested cards. */}
      <div className="px-6 sm:px-8 lg:px-10">
        {/* Stat — two-column KPI panel with subtle arise-50 tint. Hours on
            left, working-days on right. Pill strip below visualizes the
            "days saved" literally. Caption full-width underneath. */}
        <section
          data-temp="result-stat-time-saved"
          className="-mx-6 border-t border-slate-100 bg-arise-50/40 px-6 py-7 sm:-mx-8 sm:px-8 sm:py-8 lg:-mx-10 lg:px-10"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#006bc5]">
                Decision time saved
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className="text-[36px] font-semibold leading-none tracking-[-0.02em] tabular-nums sm:text-[44px] lg:text-[52px]"
                  style={{ color: accentColor }}
                >
                  ~{hours}
                </span>
                <span className="text-[15px] font-medium text-slate-600">
                  hours
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-500">
                ≈ Working days
              </span>
              <p className="mt-2 text-[36px] font-semibold leading-none tabular-nums text-slate-900 sm:text-[44px] lg:text-[52px]">
                {workingDays(hours)}
              </p>
            </div>
          </div>
          <WorkingDaysStrip
            days={Number(workingDays(hours))}
            accentColor={accentColor}
          />
          <p className="mt-5 text-[14px] leading-relaxed text-slate-600">
            {TIME_SAVED_SUBTEXT[result.track]}
          </p>
        </section>

        {/* Why-trace — mono numbered signal rows, hairline between. */}
        <section aria-label="Reasoning" className="border-t border-slate-100 py-2">
          <ol className="divide-y divide-slate-100">
            {result.whyBullets.map((b, i) => (
              <li
                key={i}
                className="grid grid-cols-[36px_1fr] gap-x-4 py-4"
              >
                <span
                  className="label-number"
                  style={{ color: accentColor }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[14px] leading-relaxed text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {b.label.replace(/[.]\s*$/, "")}
                  </span>
                  <span aria-hidden> — </span>
                  {b.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* Presumptive close — V5 receipt-style mono-tracked pattern per
            Ayrehl's pick. Elongated body (no max-w), uppercase mono eyebrow,
            arrow-first uppercase mono text-link CTA. */}
        <section
          aria-labelledby="presumptive-close-heading"
          className="border-t border-slate-100 py-7 sm:py-8"
        >
          <h3
            id="presumptive-close-heading"
            className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500"
          >
            What we&apos;d do
          </h3>
          <p className="mt-3 text-[15px] leading-[1.6] text-slate-700">
            {result.presumptiveClose.body}
          </p>
          <button
            type="button"
            data-temp="check-risk-plan-target"
            className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5] transition-colors hover:text-arise-800 focus:outline-none focus-visible:underline"
          >
            <span aria-hidden>→</span>
            {result.presumptiveClose.cta}
          </button>
        </section>

        {/* Meeting-kit handoff — subtle arise-50 tint to give the conversion
            zone visual weight without breaking the editorial register.
            Negative margins break out to card edge so the bg fills the full
            width; px re-applied to match body padding. */}
        {magnet && (
          <section className="-mx-6 border-t border-slate-100 bg-arise-50/40 px-6 py-7 sm:-mx-8 sm:px-8 sm:py-8 lg:-mx-10 lg:px-10">
            {magnet}
          </section>
        )}

        {/* Footer ladder + source stamp. */}
        <div className="border-t border-slate-100 py-5">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="#how-to-vet"
              className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-[#006bc5] underline-offset-4 transition-colors hover:underline focus:outline-none focus-visible:underline"
            >
              See questions to ask
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
            <button
              type="button"
              onClick={onReset}
              className="text-[12px] text-slate-500 underline-offset-2 transition-colors hover:text-slate-700 hover:underline focus:outline-none focus-visible:underline"
            >
              Edit my answers
            </button>
          </div>
          <p
            data-temp="result-source-stamp"
            className="mt-3 max-w-[480px] font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400"
          >
            {buildSourceStamp(result.inputs)}
          </p>
        </div>
      </div>
    </article>
  );
}

// Stat block — Wealthfront pattern: the massive number IS the identity.
// Eyebrow → value → inline sub-label → caption. No ticks, no progress rule,
// no instrument-panel chrome. Working-days reads as a quiet qualifier of
// the hours value, baseline-aligned to it, not a floating chip below.
function ValueBlock({
  label,
  value,
  subLabel,
  caption,
  accentColor,
}: {
  label: string;
  value: string;
  subLabel: string;
  caption: string;
  accentColor: string;
}) {
  return (
    <div
      data-temp="result-stat-time-saved"
      className="rounded-[10px] border border-[#D7E3F0] bg-white p-5 sm:p-6"
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
        {label}
      </span>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span
          className="text-[40px] font-semibold leading-none tracking-[-0.02em] tabular-nums sm:text-[48px] lg:text-[56px]"
          style={{ color: accentColor }}
        >
          {value}
        </span>
        <span className="text-[13px] text-slate-500">{subLabel}</span>
      </div>
      <p className="mt-4 max-w-[560px] text-[13px] leading-snug text-slate-600">
        {caption}
      </p>
    </div>
  );
}

// Working-days pill strip — one pill per working day saved. Each pill is a
// small rounded brand-blue chip; the first N-1 are filled (the work we
// absorb), the last is darker (the one day you're left to make the decision).
// Literal mapping of the "≈ N working days" sub-label.
function WorkingDaysStrip({
  days,
  accentColor,
}: {
  days: number;
  accentColor: string;
}) {
  // Cap at 14 pills so the strip stays compact on edge-case high values.
  // Half-day values (e.g. 7.5) round up to a full pill since we can't
  // render a half-pill cleanly at this scale.
  const total = Math.min(14, Math.max(1, Math.ceil(days)));
  return (
    <ul
      aria-label={`${days} working days saved`}
      className="mt-5 grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }).map((_, i) => {
        const isLast = i === total - 1;
        return (
          <li
            key={i}
            style={
              isLast
                ? { backgroundColor: accentColor }
                : { backgroundColor: accentColor, opacity: 0.22 }
            }
            className="h-3.5 rounded-full"
            aria-hidden
          />
        );
      })}
    </ul>
  );
}
