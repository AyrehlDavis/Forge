"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StateMap } from "./StateMap";
import type {
  LocationCount,
  Priority,
  Situation,
  Spend,
  V2Inputs,
} from "../_lib/types";

interface SmartFormProps {
  onChange: (input: V2Inputs) => void;
  onSubmit: (input: V2Inputs) => void;
}

const SPEND_OPTIONS: Array<{ value: Spend; label: string; descriptor: string }> = [
  { value: "under_50k", label: "Under $50K", descriptor: "A small office, retail location, or single light-industrial site" },
  { value: "50k_250k", label: "$50K–$250K", descriptor: "A small business with a few locations, or one site with steady usage" },
  { value: "250k_1m", label: "$250K–$1M", descriptor: "A growing portfolio, or one large facility" },
  { value: "over_1m", label: "Over $1M", descriptor: "A multi-site operation, or one very large facility" },
];

const LOCATION_OPTIONS: Array<{ value: LocationCount; label: string }> = [
  { value: "1", label: "1" },
  { value: "2-10", label: "2-10" },
  { value: "11-50", label: "11-50" },
  { value: "50+", label: "50+" },
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

export function SmartForm({ onChange, onSubmit }: SmartFormProps) {
  const [spend, setSpend] = useState<Spend | null>(null);
  const [locationCount, setLocationCount] = useState<LocationCount | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [priority, setPriority] = useState<Priority | null>(null);
  const [situation, setSituation] = useState<Situation | null>(null);

  const currentInputs = useMemo<V2Inputs>(
    () => ({ spend, locationCount, states, priority, situation }),
    [spend, locationCount, states, priority, situation],
  );

  const broadcast = useCallback(
    (patch: Partial<V2Inputs>) => {
      onChange({ ...currentInputs, ...patch });
    },
    [currentInputs, onChange],
  );

  function handleSpend(v: Spend) {
    setSpend(v);
    broadcast({ spend: v });
  }

  function handleLocationCount(v: LocationCount) {
    setLocationCount(v);
    broadcast({ locationCount: v });
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
    spend !== null &&
    locationCount !== null &&
    states.length > 0 &&
    priority !== null &&
    situation !== null;

  // Auto-scroll micro-interaction: when a required step is just completed,
  // smoothly guide the user to the next unfilled section (or submit).
  const prevDone = useRef({
    spend: false,
    location: false,
    states: false,
    priority: false,
    situation: false,
  });
  useEffect(() => {
    const spDone = spend !== null;
    const lDone = locationCount !== null;
    const sDone = states.length > 0;
    const pDone = priority !== null;
    const tDone = situation !== null;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Find the next unfilled step relative to the one that just advanced.
    function nextTarget(): string | null {
      if (!lDone) return "step-location";
      if (!sDone) return "step-states";
      if (!pDone) return "step-priority";
      if (!tDone) return "step-timing";
      return "step-submit";
    }

    let target: string | null = null;
    if (spDone && !prevDone.current.spend) target = nextTarget();
    else if (lDone && !prevDone.current.location) target = nextTarget();
    else if (sDone && !prevDone.current.states) target = nextTarget();
    else if (pDone && !prevDone.current.priority) target = nextTarget();
    else if (tDone && !prevDone.current.situation) target = "step-submit";

    if (target && !reduce) {
      const el = document.getElementById(target);
      if (el) {
        const id = window.setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "start" }),
          320,
        );
        prevDone.current = {
          spend: spDone,
          location: lDone,
          states: sDone,
          priority: pDone,
          situation: tDone,
        };
        return () => window.clearTimeout(id);
      }
    }

    prevDone.current = {
      spend: spDone,
      location: lDone,
      states: sDone,
      priority: pDone,
      situation: tDone,
    };
  }, [spend, locationCount, states.length, priority, situation]);

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
      <Field label="Annual energy spend" id="step-spend">
        <div
          role="radiogroup"
          aria-label="Annual energy spend"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {SPEND_OPTIONS.map((o) => {
            const selected = spend === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleSpend(o.value)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    handleSpend(o.value);
                  }
                }}
                className={`group/card relative overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--v2-background)] ${
                  selected
                    ? "v2-card-soft-selected border-[var(--v2-accent)] shadow-[var(--v2-shadow-card)]"
                    : "v2-card-soft border-[var(--arise-100)] hover:border-[var(--v2-accent)] hover:shadow-[var(--v2-shadow-soft)]"
                }`}
              >
                <div className="relative text-sm font-medium text-[var(--v2-text-primary)]">{o.label}</div>
                <div className="relative mt-1 text-xs text-[var(--v2-text-secondary)]">{o.descriptor}</div>
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Number of locations" id="step-location">
        <div role="radiogroup" aria-label="Number of locations" className="flex flex-wrap gap-2">
          {LOCATION_OPTIONS.map((o) => {
            const selected = locationCount === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => handleLocationCount(o.value)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    handleLocationCount(o.value);
                  }
                }}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all duration-200 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--v2-background)] ${
                  selected
                    ? "border-[var(--v2-accent)] bg-[var(--arise-50)] text-[var(--v2-accent)] shadow-[var(--v2-shadow-soft)]"
                    : "border-[var(--arise-100)] bg-white/70 text-[var(--v2-text-secondary)] hover:border-[var(--v2-accent)] hover:bg-white hover:text-[var(--v2-text-primary)] hover:shadow-[var(--v2-shadow-soft)]"
                }`}
              >
                {o.label}
              </button>
            );
          })}
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
              spend === null && "pick a spend range",
              locationCount === null && "pick a location count",
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
