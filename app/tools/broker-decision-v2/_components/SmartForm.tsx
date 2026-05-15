"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StateMap } from "./StateMap";
import type { Priority, Situation, V2Inputs } from "../_lib/types";

interface SmartFormProps {
  onChange: (input: V2Inputs) => void;
  onSubmit: (input: V2Inputs) => void;
}

const SPEND_MIN = 25_000;
const SPEND_MAX = 5_000_000;
const SPEND_DEFAULT = 480_000;

const SPEND_PRESETS: Array<{ label: string; value: number }> = [
  { label: "$50K", value: 50_000 },
  { label: "$250K", value: 250_000 },
  { label: "$1M", value: 1_000_000 },
  { label: "$5M", value: 5_000_000 },
];

// Each card gets its own gradient variation (A/B/C/D) — same three pastel
// accents arranged differently. Reads as a series, not identical clones.
const PRIORITIES: Array<{
  value: Priority;
  label: string;
  descriptor: string;
  variant: "a" | "b" | "c" | "d";
  dot: string;
}> = [
  { value: "lowest_cost",    label: "Lowest cost",     descriptor: "Headline rate is the number that matters",       variant: "a", dot: "var(--v2-accent-warm)" },
  { value: "risk_management",label: "Risk management", descriptor: "Predictable, no surprises, hedge volatility",     variant: "b", dot: "var(--v2-accent-cool)" },
  { value: "simplicity",     label: "Simplicity",      descriptor: "Less administrative overhead, fewer vendors",     variant: "c", dot: "var(--v2-accent)" },
  { value: "sustainability", label: "Sustainability",  descriptor: "Renewable mix, reporting, ESG alignment",         variant: "d", dot: "var(--v2-accent)" },
];

const SITUATIONS: Array<{ value: Situation; label: string }> = [
  { value: "exploring", label: "Just exploring" },
  { value: "renewal", label: "Renewal coming up" },
  { value: "active", label: "Contract active" },
  { value: "unhappy", label: "Unhappy with current" },
];

const SITE_PRESETS = [1, 3, 10, 25];

function siteDescriptor(n: number): string {
  if (n === 1) return "Single location";
  if (n <= 5) return "Small portfolio";
  if (n <= 20) return "Mid-sized portfolio";
  return "Large portfolio";
}

function fmtSpendInline(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  return `$${Math.round(n / 1_000)}K`;
}

function clampSpend(n: number): number {
  return Math.max(SPEND_MIN, Math.min(SPEND_MAX, n));
}

function parseSpendInput(raw: string): number | null {
  const cleaned = raw.replace(/[$,\s]/g, "").toLowerCase();
  if (cleaned === "") return null;
  let multiplier = 1;
  let numericPart = cleaned;
  if (cleaned.endsWith("m")) {
    multiplier = 1_000_000;
    numericPart = cleaned.slice(0, -1);
  } else if (cleaned.endsWith("k")) {
    multiplier = 1_000;
    numericPart = cleaned.slice(0, -1);
  }
  const n = Number(numericPart);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * multiplier);
}

export function SmartForm({ onChange, onSubmit }: SmartFormProps) {
  const [annualSpend, setAnnualSpend] = useState<number>(SPEND_DEFAULT);
  const [spendInput, setSpendInput] = useState<string>(fmtSpendInline(SPEND_DEFAULT));
  const [siteCount, setSiteCount] = useState<number>(3);
  const [siteInput, setSiteInput] = useState<string>("3");
  const [states, setStates] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [situation, setSituation] = useState<Situation | null>(null);

  const currentInputs = useMemo<V2Inputs>(
    () => ({ annualSpend, siteCount, states, priority, situation }),
    [annualSpend, siteCount, states, priority, situation],
  );

  const broadcast = useCallback(
    (patch: Partial<V2Inputs>) => {
      onChange({ ...currentInputs, ...patch });
    },
    [currentInputs, onChange],
  );

  function commitSpend(n: number) {
    const v = clampSpend(n);
    setAnnualSpend(v);
    setSpendInput(fmtSpendInline(v));
    broadcast({ annualSpend: v });
  }

  function handleSpendInputChange(raw: string) {
    setSpendInput(raw);
    const parsed = parseSpendInput(raw);
    if (parsed !== null) {
      const clamped = clampSpend(parsed);
      setAnnualSpend(clamped);
      broadcast({ annualSpend: clamped });
    }
  }

  function handleSpendInputBlur() {
    setSpendInput(fmtSpendInline(annualSpend));
  }

  function handleSiteCount(n: number) {
    const clamped = Math.max(1, Math.min(500, n));
    setSiteCount(clamped);
    setSiteInput(String(clamped));
    broadcast({ siteCount: clamped });
  }

  function handleSiteInputChange(raw: string) {
    setSiteInput(raw);
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 500) {
      setSiteCount(Math.round(parsed));
      broadcast({ siteCount: Math.round(parsed) });
    }
  }

  function handleSiteInputBlur() {
    setSiteInput(String(siteCount));
  }

  function handleStates(next: string[]) {
    setStates(next);
    broadcast({ states: next });
  }

  function handlePriority(v: Priority) {
    setPriority(v);
    broadcast({ priority: v });
  }

  function handleSituation(v: Situation) {
    setSituation(v);
    broadcast({ situation: v });
  }

  const isValid =
    states.length > 0 && priority !== null && situation !== null;

  // Auto-scroll micro-interaction: when a required step is just completed,
  // smoothly guide the user to the next unfilled section (or submit).
  const prevDone = useRef({ states: false, priority: false, situation: false });
  useEffect(() => {
    const sDone = states.length > 0;
    const pDone = priority !== null;
    const tDone = situation !== null;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let target: string | null = null;
    if (sDone && !prevDone.current.states) {
      target = pDone ? (tDone ? "step-submit" : "step-timing") : "step-priority";
    } else if (pDone && !prevDone.current.priority) {
      target = tDone ? "step-submit" : "step-timing";
    } else if (tDone && !prevDone.current.situation) {
      target = "step-submit";
    }

    if (target && !reduce) {
      const el = document.getElementById(target);
      if (el) {
        const id = window.setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          320,
        );
        // Update refs after schedule (effect cleanup not needed for one-shot setTimeout)
        prevDone.current = { states: sDone, priority: pDone, situation: tDone };
        return () => window.clearTimeout(id);
      }
    }

    prevDone.current = { states: sDone, priority: pDone, situation: tDone };
  }, [states.length, priority, situation]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(currentInputs);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[var(--v2-border-default)] bg-gradient-to-br from-white/70 via-white/55 to-[rgba(212,243,243,0.4)] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(10,31,31,0.04),0_4px_12px_rgba(10,31,31,0.05),0_16px_40px_rgba(10,31,31,0.07)] backdrop-blur-xl sm:p-10 space-y-9"
      aria-label="Portfolio details"
    >
      <Field label="Annual energy spend">
        <div className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-[var(--v2-text-tertiary)]">$</span>
              <input
                type="text"
                inputMode="numeric"
                value={spendInput.replace(/^\$/, "")}
                onChange={(e) => handleSpendInputChange(e.target.value)}
                onBlur={handleSpendInputBlur}
                aria-label="Annual energy spend in dollars"
                className="w-32 border-0 bg-transparent p-0 text-3xl font-semibold tabular-nums tracking-tight text-[var(--v2-text-primary)] focus:outline-none sm:w-40 sm:text-4xl"
              />
              <span className="text-sm text-[var(--v2-text-tertiary)]">/ year</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SPEND_PRESETS.map((p) => {
                const active = annualSpend === p.value;
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => commitSpend(p.value)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--v2-background)] ${
                      active
                        ? "border-[var(--v2-accent)] bg-[var(--arise-50)] text-[var(--v2-accent)] shadow-[var(--v2-shadow-soft)]"
                        : "border-[var(--arise-100)] bg-white/70 text-[var(--v2-text-secondary)] backdrop-blur-sm hover:border-[var(--v2-accent)] hover:bg-white hover:text-[var(--v2-text-primary)] hover:shadow-[var(--v2-shadow-soft)]"
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
          <input
            type="range"
            min={SPEND_MIN}
            max={SPEND_MAX}
            step={10_000}
            value={annualSpend}
            onChange={(e) => commitSpend(Number(e.target.value))}
            aria-label="Annual energy spend slider"
            className="v2-slider w-full accent-[var(--v2-accent)]"
          />
          <div className="flex justify-between text-xs text-[var(--v2-text-tertiary)]">
            <span>{fmtSpendInline(SPEND_MIN)}</span>
            <span>{fmtSpendInline(SPEND_MAX)}+</span>
          </div>
        </div>
      </Field>

      <Field label="Sites">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSiteCount(siteCount - 1)}
                aria-label="Decrease site count"
                className="h-9 w-9 rounded-full border border-[var(--v2-border-default)] bg-white/60 text-base text-[var(--v2-text-primary)] transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
              >
                <span aria-hidden>−</span>
              </button>
              <input
                type="text"
                inputMode="numeric"
                value={siteInput}
                onChange={(e) => handleSiteInputChange(e.target.value)}
                onBlur={handleSiteInputBlur}
                aria-label="Number of sites"
                className="w-16 border-0 bg-transparent p-0 text-center text-3xl font-semibold tabular-nums tracking-tight text-[var(--v2-text-primary)] focus:outline-none sm:text-4xl"
              />
              <button
                type="button"
                onClick={() => handleSiteCount(siteCount + 1)}
                aria-label="Increase site count"
                className="h-9 w-9 rounded-full border border-[var(--v2-border-default)] bg-white/60 text-base text-[var(--v2-text-primary)] transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)]"
              >
                <span aria-hidden>+</span>
              </button>
              <span className="ml-1 text-sm text-[var(--v2-text-secondary)]">
                {siteCount === 1 ? "location" : "locations"}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SITE_PRESETS.map((n) => {
                const active = siteCount === n;
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => handleSiteCount(n)}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--v2-background)] ${
                      active
                        ? "border-[var(--v2-accent)] bg-[var(--arise-50)] text-[var(--v2-accent)] shadow-[var(--v2-shadow-soft)]"
                        : "border-[var(--arise-100)] bg-white/70 text-[var(--v2-text-secondary)] backdrop-blur-sm hover:border-[var(--v2-accent)] hover:bg-white hover:text-[var(--v2-text-primary)] hover:shadow-[var(--v2-shadow-soft)]"
                    }`}
                  >
                    {n === 25 ? "25+" : n}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="text-xs text-[var(--v2-text-tertiary)]">{siteDescriptor(siteCount)}</div>
        </div>
      </Field>

      <div id="step-states" className="scroll-mt-24">
        <Field label="States">
          <StateMap value={states} onChange={handleStates} />
        </Field>
      </div>

      <Field label="What matters most?" id="step-priority">
        <div
          role="radiogroup"
          aria-label="Top priority"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {PRIORITIES.map((p) => {
            const selected = priority === p.value;
            return (
              <button
                key={p.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handlePriority(p.value)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    handlePriority(p.value);
                  }
                }}
                className={`group/card relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--v2-background)] ${
                  selected
                    ? "v2-card-soft-selected border-[var(--v2-accent)] shadow-[var(--v2-shadow-card)]"
                    : "v2-card-soft border-[var(--arise-100)] hover:border-[var(--v2-accent)] hover:shadow-[var(--v2-shadow-soft)]"
                }`}
              >
                <div className="relative flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full ring-2 ring-white/60"
                    style={{ backgroundColor: p.dot }}
                    aria-hidden
                  />
                  <div className="text-sm font-medium text-[var(--v2-text-primary)]">{p.label}</div>
                </div>
                <div className="relative ml-4 mt-1 text-xs text-[var(--v2-text-secondary)]">{p.descriptor}</div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="When are you deciding?" id="step-timing">
        <div role="radiogroup" aria-label="Situation" className="flex flex-wrap gap-2">
          {SITUATIONS.map((s) => {
            const selected = situation === s.value;
            return (
              <button
                key={s.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleSituation(s.value)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    handleSituation(s.value);
                  }
                }}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--v2-background)] ${
                  selected
                    ? "border-[var(--v2-accent)] bg-[var(--arise-50)] text-[var(--v2-accent)] shadow-[var(--v2-shadow-soft)]"
                    : "border-[var(--arise-100)] bg-white/70 text-[var(--v2-text-secondary)] hover:border-[var(--v2-accent)] hover:bg-white hover:text-[var(--v2-text-primary)] hover:shadow-[var(--v2-shadow-soft)]"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </Field>

      <div id="step-submit" className="scroll-mt-24 space-y-2 pt-2">
        <button
          type="submit"
          disabled={!isValid}
          className="v2-pill-primary group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-background)] disabled:cursor-not-allowed sm:w-auto"
        >
          Get my recommendation
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </button>
        {!isValid && (
          <p className="text-xs text-[var(--v2-text-tertiary)]">
            {[
              states.length === 0 && "select at least one state",
              priority === null && "pick what matters most",
              situation === null && "tell us your timing",
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
  id,
}: {
  label: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 space-y-3">
      <span className="block text-xs font-medium uppercase tracking-[0.08em] text-[var(--v2-text-tertiary)]">
        {label}
      </span>
      {children}
    </div>
  );
}
