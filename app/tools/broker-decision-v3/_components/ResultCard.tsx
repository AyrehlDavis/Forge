"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { getState, getStateName } from "../_config/states";
import { TRACK_ACCENTS } from "../_config/track-templates";
import type { Track, V3Inputs, V3Recommendation } from "../_lib/types";
import { TexasOutline } from "./TexasOutline";

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

// Per-track meter progress percentages — the gauge fill behind the stat
// value. Per Forge LP1 V3.5 spec defaults; data-temp until product confirms.
const METER_PROGRESS: Record<Track, number> = {
  A_use_broker: 62,
  B_go_direct: 50,
  C_regulated: 67,
};

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
  const accent = TRACK_ACCENTS[result.track];
  const accentColor = trackAccent(result.track);
  const hours = estTimeSavedHours(result.inputs, result.track);
  const meterPct = METER_PROGRESS[result.track];

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
      className="v3-verdict-rise overflow-hidden rounded-[16px] border border-[#D7E3F0] bg-[#F8FBFE] shadow-[0_24px_70px_rgba(15,35,60,0.10)] focus:outline-none"
    >
      {/* Verdict band — instrument panel posture. TX linework right-side
          watermark; mono metadata rail above title; outlined timing chip.
          Trimmed: padding scaled down + title comes down from 60→48 max
          so the band doesn't dominate the merged artifact. */}
      <header
        style={{ background: accent.headerBg }}
        className="relative overflow-hidden px-6 py-7 text-white sm:px-8 sm:py-8 lg:px-10 lg:py-10"
      >
        {/* Texas linework watermark — only for TX results. Right side, faint. */}
        {result.inputs.states.length === 1 &&
          result.inputs.states[0] === "TX" && (
            <div
              aria-hidden
              data-temp="verdict-band-tx-overlay"
              className="absolute right-5 top-5 hidden h-[130px] w-[145px] text-white opacity-20 sm:block lg:right-6 lg:top-6"
            >
              <TexasOutline className="h-full w-full" strokeWidth={1.5} />
              <span className="absolute bottom-1 left-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
                TX · OPEN MARKET
              </span>
            </div>
          )}

        <p
          className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/60"
          data-temp="verdict-metadata-rail"
        >
          {buildMetadataRail(result.inputs, result.track)}
        </p>
        <h2 className="mt-3 text-[32px] font-semibold leading-[1.02] tracking-tight sm:text-[40px] lg:text-[48px]">
          {result.trackLabel}
        </h2>
        <p className="mt-3 max-w-[520px] text-sm leading-relaxed text-white/90 sm:text-base">
          {result.headline}
        </p>
        {result.timingChip && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-transparent px-3 py-1 text-xs font-medium text-white">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
            {result.timingChip}
          </p>
        )}
      </header>

      <div className="space-y-7 px-6 py-6 sm:space-y-8 sm:px-8 sm:py-7">
        {/* Meter-gauge stat block — 12 ticks behind the value, filled progress
            rule, comparative-day chip. Track-accent color carries through. */}
        <MeterStat
          label="Decision time saved"
          value={`~${hours} hours`}
          caption={TIME_SAVED_SUBTEXT[result.track]}
          comparative={`≈ ${workingDays(hours)} working days`}
          progressPct={meterPct}
          accentColor={accentColor}
        />

        {/* Why-trace — mono numbered signal rows. No eyebrow; hairline
            separators between rows. Compressed py-4 → py-3. */}
        <section aria-label="Reasoning">
          <ol className="divide-y divide-[#D8E6F5] border-t border-[#D8E6F5]">
            {result.whyBullets.map((b, i) => (
              <li
                key={i}
                className="grid grid-cols-[40px_1fr] gap-x-4 py-3"
              >
                <span
                  className="label-number"
                  style={{ color: accentColor }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-slate-600">
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

        {/* Presumptive close — advisor note posture. 5px brand-blue left
            rule, monogram circle, paragraph hangs from the rule.
            Heading promoted h4 → h3 to nest correctly under the H2 verdict. */}
        <section
          aria-labelledby="presumptive-close-heading"
          style={{ borderLeftColor: accentColor }}
          className="rounded-[10px] border-l-[5px] bg-[#F6FAFD] p-5 pl-6"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              style={{ backgroundColor: accentColor }}
              className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
            >
              A
            </span>
            <h3
              id="presumptive-close-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: accentColor }}
            >
              What we&apos;d do
              <span className="ml-2 text-[11px] font-normal tracking-normal text-slate-500">
                — from the Arise team
              </span>
            </h3>
          </div>
          <p className="mt-3 max-w-[560px] text-sm leading-relaxed text-[#0A1F1F]">
            {result.presumptiveClose.body}
          </p>
          <div className="mt-4">
            <button
              type="button"
              data-temp="check-risk-plan-target"
              className="v3-pill-primary inline-flex h-10 items-center justify-center gap-2 px-5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
            >
              {result.presumptiveClose.cta}
              <span aria-hidden>→</span>
            </button>
          </div>
        </section>

        {/* Meeting-kit handoff — inline LeadMagnet rendered as the final
            section. Separator above it visually links the verdict + kit. */}
        {magnet && (
          <section className="-mx-6 border-t border-slate-200/80 px-6 pt-6 sm:-mx-8 sm:px-8 sm:pt-7">
            {magnet}
          </section>
        )}

        {/* Footer ladder + source stamp. Track-accent on the See-questions
            link. Edit-answers demoted. Source stamp reads as a generated
            document footer below the action row. */}
        <div className="space-y-4 border-t border-slate-200/80 pt-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <a
              href="#how-to-vet"
              style={{ color: accentColor }}
              className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80 focus:outline-none focus-visible:underline"
            >
              See questions to ask
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
            <button
              type="button"
              onClick={onReset}
              className="text-xs text-slate-500 underline-offset-4 transition-colors hover:text-slate-700 hover:underline focus:outline-none focus-visible:underline"
            >
              Edit my answers
            </button>
          </div>
          <p
            data-temp="result-source-stamp"
            className="label-artifact"
          >
            {buildSourceStamp(result.inputs)}
          </p>
        </div>
      </div>
    </article>
  );
}

// Meter-gauge stat block — replaces the previous flat stat tone. 12 vertical
// ticks behind the value, filled progress rule below it, comparative chip
// after the subtext. Track-accent color drives ticks + progress + value tint.
function MeterStat({
  label,
  value,
  caption,
  comparative,
  progressPct,
  accentColor,
}: {
  label: string;
  value: string;
  caption: string;
  comparative: string;
  progressPct: number;
  accentColor: string;
}) {
  return (
    <div
      data-temp="result-stat-time-saved"
      className="relative overflow-hidden rounded-[10px] border border-[#D7E3F0] bg-white p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
          {progressPct}% absorbed
        </span>
      </div>

      {/* Value + meter ticks layered */}
      <div className="relative mt-3">
        <div
          aria-hidden
          className="absolute inset-x-0 top-1/2 flex h-[46px] -translate-y-1/2 items-center justify-between"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              style={{
                backgroundColor: accentColor,
                opacity: 0.16,
                height: i % 2 === 0 ? "46px" : "28px",
                width: "1px",
              }}
              className="block"
            />
          ))}
        </div>
        <div
          className="relative text-[40px] font-semibold leading-none tracking-[-0.02em] tabular-nums sm:text-[48px] lg:text-[56px]"
          style={{ color: accentColor }}
        >
          {value}
        </div>
      </div>

      {/* Progress rule */}
      <div className="relative mt-4 h-[3px] w-full rounded-full bg-[#E5EEF7]">
        <div
          className="absolute left-0 top-0 h-full rounded-full"
          style={{
            width: `${progressPct}%`,
            backgroundColor: accentColor,
          }}
          aria-hidden
        />
      </div>

      <p className="mt-3 max-w-[560px] text-[13px] leading-snug text-slate-600">
        {caption}
      </p>
      <span className="mt-2 inline-flex items-center rounded-full border border-[#D7E3F0] bg-white px-3 py-1 text-[11px] font-medium text-slate-700">
        {comparative}
      </span>
    </div>
  );
}
