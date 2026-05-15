"use client";

import { forwardRef, useState, type ReactNode } from "react";
import type { RecommendationOutput } from "../_lib/types";
import { TRACK_CONTENT } from "../_config/track-templates";

interface ResultsProps {
  result: RecommendationOutput;
  /**
   * Optional slot rendered between the headline card and the detail grid.
   * Used to surface the EmailCapture at peak motivation (right after the
   * verdict) instead of after all the detail.
   */
  emailCapture?: ReactNode;
}

// NOTE: accent keys still named blue/cyan/violet to match track-templates.ts
// (`accent: "blue" | "cyan" | "violet"`). Track A's "blue" was retoned to arise
// teal per design feedback. Future cleanup: rename the union to
// teal/cyan/violet or primary/secondary/tertiary.
const ACCENT_STYLES = {
  blue: {
    border: "border-arise-300/60",
    bg: "bg-gradient-to-br from-arise-50/70 via-white/60 to-white/50",
    eyebrow: "text-arise-700",
    label: "text-arise-700",
    glyph: "bg-arise-600 text-white",
  },
  // Track B (Go Direct) — per Ayrehl, V1 outcome system is blue / cyan / purple.
  cyan: {
    border: "border-cyan-300/60",
    bg: "bg-gradient-to-br from-cyan-50/70 via-white/60 to-white/50",
    eyebrow: "text-cyan-700",
    label: "text-cyan-700",
    glyph: "bg-cyan-600 text-white",
  },
  violet: {
    border: "border-violet-300/60",
    bg: "bg-gradient-to-br from-violet-50/70 via-white/60 to-white/50",
    eyebrow: "text-violet-700",
    label: "text-violet-700",
    glyph: "bg-violet-600 text-white",
  },
} as const;

const TRACK_LABEL = {
  A_use_broker: "Use a Broker",
  B_go_direct: "Go Direct",
  C_hybrid: "Hybrid Approach",
} as const;

export const Results = forwardRef<HTMLDivElement, ResultsProps>(function Results(
  { result, emailCapture },
  ref,
) {
  const content = TRACK_CONTENT[result.track];
  const accent = ACCENT_STYLES[content.accent];
  const explanation = content.explanation(result.variables);
  const whyBullets = content.whyBullets(result.variables);

  return (
    <section
      ref={ref}
      tabIndex={-1}
      aria-live="polite"
      aria-label={`Recommendation: ${TRACK_LABEL[result.track]}`}
      className="mt-10 scroll-mt-20 focus:outline-none rounded-3xl border border-white/60 bg-white/45 backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-8 shadow-[0_12px_40px_-16px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.9)]"
    >
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Your Recommendation
        </p>
        <p className="mt-1 text-slate-600">Based on what you told us, here&apos;s our take.</p>
      </header>

      <article
        className={`rounded-2xl border ${accent.border} ${accent.bg} backdrop-blur-xl backdrop-saturate-150 p-8 sm:p-10 shadow-[0_8px_32px_-12px_rgba(28, 138, 239,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]`}
      >
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${accent.eyebrow}`}>
          {content.eyebrow}
        </p>
        <h3
          className={`mt-3 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight ${accent.label}`}
        >
          {TRACK_LABEL[result.track]}
        </h3>
        <p className="mt-3 text-lg sm:text-xl font-medium text-slate-900 leading-snug">
          {content.headline}
        </p>
        <p className="mt-5 text-slate-700 text-base leading-relaxed max-w-2xl">{explanation}</p>
      </article>

      {emailCapture && <div className="mt-6">{emailCapture}</div>}

      <div className="mt-8 grid gap-10">
        <WhySection bullets={whyBullets} />

        <ActionChecklist items={content.actionChecklist} />

        <FlagsTable redFlags={content.redFlags} greenFlags={content.greenFlags} />
      </div>
    </section>
  );
});

/**
 * Why section — 3 "moments" in a responsive grid. Each moment carries a small
 * arise dot marker + bold takeaway label + supporting body. Breaks the wall of
 * paragraphs into scannable visual units.
 */
function WhySection({ bullets }: { bullets: Array<{ label: string; body: string }> }) {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-arise-700">
        Why this recommendation
      </p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {bullets.map((b, i) => (
          <article
            key={i}
            className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-md p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]"
          >
            <p className="text-sm font-semibold text-slate-900 leading-snug">{b.label}</p>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{b.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActionChecklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));

  const toggle = (i: number) =>
    setChecked((arr) => {
      const next = arr.slice();
      next[i] = !next[i];
      return next;
    });

  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-arise-700">
        Your action checklist
      </p>
      <ul role="list" className="mt-4 space-y-1">
        {items.map((item, i) => {
          const isChecked = checked[i];
          return (
            <li key={i} role="listitem">
              <button
                type="button"
                role="checkbox"
                aria-checked={isChecked}
                onClick={() => toggle(i)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggle(i);
                  }
                }}
                className="w-full text-left flex items-start gap-3 py-2 px-2 -mx-2 rounded-md hover:bg-arise-50/50 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-arise-500"
              >
                {/* Checkbox slot — empty square at rest, bare SVG check (with v1-check-pop) when checked. */}
                <span
                  aria-hidden="true"
                  className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors duration-150 ${
                    isChecked ? "border-arise-600 bg-arise-50" : "border-slate-300 bg-white/70"
                  }`}
                >
                  {isChecked && (
                    <svg
                      className="v1-check-pop w-3.5 h-3.5 text-arise-600"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span
                  className={`text-sm leading-relaxed transition-colors duration-150 ${
                    isChecked ? "line-through text-slate-400" : "text-slate-700"
                  }`}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Flags table — semantic color lives in tiny dot markers instead of full panel
 * backgrounds. Reads cleaner against the outer glass container and stops
 * competing with the rest of the page chrome.
 */
function FlagsTable({ redFlags, greenFlags }: { redFlags: string[]; greenFlags: string[] }) {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-arise-700">
        How to vet them
      </p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <FlagColumn
          title="Deal-breakers"
          flags={redFlags}
          dotClass="bg-red-500"
          titleClass="text-red-700"
        />
        <FlagColumn
          title="Deal-makers"
          flags={greenFlags}
          dotClass="bg-emerald-500"
          titleClass="text-emerald-700"
        />
      </div>
    </section>
  );
}

function FlagColumn({
  title,
  flags,
  dotClass,
  titleClass,
}: {
  title: string;
  flags: string[];
  dotClass: string;
  titleClass: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-md p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.85)]">
      <h4 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${titleClass}`}>
        {title}
      </h4>
      <ul className="space-y-2.5">
        {flags.map((flag, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700 leading-relaxed">
            <span
              aria-hidden
              className={`flex-shrink-0 mt-[7px] w-1.5 h-1.5 rounded-full ${dotClass}`}
            />
            <span>{flag}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
