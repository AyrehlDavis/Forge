"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SelectionCard } from "./SelectionCard";
import { StateMap } from "./StateMap";
import {
  LOCATION_OPTIONS,
  PRIORITY_OPTIONS,
  SITUATION_OPTIONS,
  SPEND_OPTIONS,
  STEPS,
  STEP_COUNT,
} from "../_config/questionnaire";
import { getState, getStateName } from "../_config/states";
import type {
  LocationCount,
  Priority,
  Situation,
  Spend,
  V3Inputs,
} from "../_lib/types";

interface SmartFormProps {
  onChange: (input: V3Inputs) => void;
  onSubmit: (input: V3Inputs) => void;
  onStepChange?: (step: number) => void;
}

const EMPTY: V3Inputs = {
  spend: null,
  locationCount: null,
  states: [],
  priority: null,
  situation: null,
};

function isStepComplete(step: number, inputs: V3Inputs): boolean {
  switch (step) {
    case 1:
      return inputs.locationCount !== null;
    case 2:
      return inputs.states.length > 0;
    case 3:
      return inputs.spend !== null;
    case 4:
      return inputs.priority !== null;
    case 5:
      return inputs.situation !== null;
    default:
      return false;
  }
}

// Derived signal — short engine-aware read of the answer.
// Tone semantics: indigo = portfolio complexity / scale; cyan = live data
// derivation from the user's answer (market read, timing posture, etc.).
type SignalTone = "indigo" | "cyan";

interface ChipFacts {
  short: string;
  answer: string;
  signal: string;
  tone: SignalTone;
}

function chipFor(step: number, inputs: V3Inputs): ChipFacts | null {
  switch (step) {
    case 1: {
      const v = inputs.locationCount;
      if (!v) return null;
      const map: Record<LocationCount, Omit<ChipFacts, "short">> = {
        "1": { answer: "1 site", signal: "Single-site", tone: "cyan" },
        "2-10": { answer: "2–10 sites", signal: "Small portfolio", tone: "cyan" },
        "11-50": { answer: "11–50 sites", signal: "Mid portfolio · +1", tone: "indigo" },
        "50+": { answer: "50+ sites", signal: "Enterprise · +2", tone: "indigo" },
      };
      return { short: "Sites", ...map[v] };
    }
    case 2: {
      if (inputs.states.length === 0) return null;
      const entries = inputs.states
        .map(getState)
        .filter((s): s is NonNullable<typeof s> => Boolean(s));
      const dereg = entries.filter((s) => s.isDeregulated === true).length;
      const partial = entries.filter((s) => s.isPartial === true).length;
      const reg = entries.length - dereg - partial;

      let signal = "Open market";
      let tone: SignalTone = "cyan";
      if (dereg === 0 && reg + partial > 0) {
        signal = "Regulated only";
        tone = "cyan";
      } else if (dereg > 0 && (reg > 0 || partial > 0)) {
        signal = "Mixed rulebooks · +1";
        tone = "indigo";
      } else if (entries.length > 1) {
        signal = "Open market · multi-state";
        tone = "indigo";
      }

      const answer =
        inputs.states.length === 1
          ? getStateName(inputs.states[0])
          : `${inputs.states.length} states`;
      return { short: "States", answer, signal, tone };
    }
    case 3: {
      const v = inputs.spend;
      if (!v) return null;
      const map: Record<Spend, Omit<ChipFacts, "short">> = {
        under_25k: { answer: "Under $25K", signal: "Light buyer", tone: "cyan" },
        "25k_100k": { answer: "$25K–$100K", signal: "SMB scale", tone: "cyan" },
        "100k_500k": { answer: "$100K–$500K", signal: "Mid-market · +1", tone: "indigo" },
        over_500k: { answer: "Over $500K", signal: "Heavy spend · +2", tone: "indigo" },
      };
      return { short: "Spend", ...map[v] };
    }
    case 4: {
      const v = inputs.priority;
      if (!v) return null;
      const map: Record<Priority, Omit<ChipFacts, "short">> = {
        balanced_price_risk: { answer: "Balanced", signal: "Value-driven", tone: "cyan" },
        price_first: { answer: "Hands on", signal: "Cost focus", tone: "cyan" },
        budget_certainty: { answer: "Certainty", signal: "Lock & forget", tone: "cyan" },
        handled_for_me: { answer: "Little effort", signal: "Managed lean", tone: "cyan" },
      };
      return { short: "Priority", ...map[v] };
    }
    case 5: {
      const v = inputs.situation;
      if (!v) return null;
      const map: Record<Situation, Omit<ChipFacts, "short">> = {
        shopping_now: { answer: "Shopping now", signal: "Active buy", tone: "cyan" },
        renewal_soon: { answer: "Renewal soon", signal: "Window opening", tone: "cyan" },
        contract_6_plus_months: { answer: "Tracking", signal: "Watching", tone: "cyan" },
        always_in_market: { answer: "Always in market", signal: "Always live", tone: "cyan" },
      };
      return { short: "Timing", ...map[v] };
    }
    default:
      return null;
  }
}

export function SmartForm({ onChange, onSubmit, onStepChange }: SmartFormProps) {
  const [inputs, setInputs] = useState<V3Inputs>(EMPTY);
  const [step, setStep] = useState(1);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  const broadcast = useCallback(
    (next: V3Inputs) => {
      setInputs(next);
      onChange(next);
    },
    [onChange],
  );

  const setSpend = (v: Spend) => broadcast({ ...inputs, spend: v });
  const setLocation = (v: LocationCount) => broadcast({ ...inputs, locationCount: v });
  const setStates = (v: string[]) => broadcast({ ...inputs, states: v });
  const setPriority = (v: Priority) => broadcast({ ...inputs, priority: v });
  const setSituation = (v: Situation) => broadcast({ ...inputs, situation: v });

  const stepComplete = isStepComplete(step, inputs);
  const isLastStep = step === STEP_COUNT;
  const currentMeta = STEPS[step - 1];

  // Track the disabled→enabled transition on the Next button so we can
  // trigger a subtle scale pulse the moment the user completes a step.
  // The animation key flips each time stepComplete becomes true so React
  // re-applies the class.
  const prevCompleteRef = useRef(stepComplete);
  const [pulseKey, setPulseKey] = useState(0);
  useEffect(() => {
    if (stepComplete && !prevCompleteRef.current) {
      setPulseKey((k) => k + 1);
    }
    prevCompleteRef.current = stepComplete;
  }, [stepComplete]);

  function goNext() {
    if (!stepComplete) return;
    if (isLastStep) {
      onSubmit(inputs);
      return;
    }
    setStep((s) => Math.min(s + 1, STEP_COUNT));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLastStep || !stepComplete) return;
    onSubmit(inputs);
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Portfolio details"
      className="space-y-5"
    >
      <fieldset key={step} className="v3-step-rise border-0 p-0">
        <legend className="flex w-full items-baseline justify-between gap-4 text-xl font-semibold leading-snug text-slate-900 sm:text-2xl">
          <span>{currentMeta.question}</span>
          <span
            aria-hidden
            className="shrink-0 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400"
          >
            {String(step).padStart(2, "0")} / {String(STEP_COUNT).padStart(2, "0")}
          </span>
        </legend>
        {currentMeta.helper && (
          <p className="mt-1.5 text-xs leading-5 text-slate-600 sm:text-sm sm:leading-6">{currentMeta.helper}</p>
        )}

        <div className="mt-5">
          {step === 1 && (
            <div
              role="radiogroup"
              aria-label="Number of locations"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {LOCATION_OPTIONS.map((o) => (
                <SelectionCard
                  key={o.value}
                  label={o.label}
                  descriptor={o.descriptor}
                  selected={inputs.locationCount === o.value}
                  onSelect={() => setLocation(o.value)}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <StateMap value={inputs.states} onChange={setStates} />
          )}

          {step === 3 && (
            <div
              role="radiogroup"
              aria-label="Annual energy spend"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {SPEND_OPTIONS.map((o) => (
                <SelectionCard
                  key={o.value}
                  label={o.label}
                  descriptor={o.descriptor}
                  selected={inputs.spend === o.value}
                  onSelect={() => setSpend(o.value)}
                />
              ))}
            </div>
          )}

          {step === 4 && (
            <div
              role="radiogroup"
              aria-label="Top priority"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {PRIORITY_OPTIONS.map((o) => (
                <SelectionCard
                  key={o.value}
                  label={o.label}
                  descriptor={o.descriptor}
                  selected={inputs.priority === o.value}
                  onSelect={() => setPriority(o.value)}
                />
              ))}
            </div>
          )}

          {step === 5 && (
            <div
              role="radiogroup"
              aria-label="Situation"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {SITUATION_OPTIONS.map((o) => (
                <SelectionCard
                  key={o.value}
                  label={o.label}
                  descriptor={o.descriptor}
                  selected={inputs.situation === o.value}
                  onSelect={() => setSituation(o.value)}
                />
              ))}
            </div>
          )}
        </div>
      </fieldset>

      {step > 1 && (
        <ChipTrail step={step} total={STEP_COUNT} inputs={inputs} onEdit={setStep} />
      )}

      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-slate-200/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 1}
          className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-300 focus:outline-none focus-visible:underline"
        >
          <span aria-hidden>←</span>
          Back
        </button>
        <button
          key={pulseKey}
          type="button"
          onClick={goNext}
          disabled={!stepComplete}
          className={`v3-pill-primary inline-flex h-12 items-center justify-center gap-2 px-6 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2 ${stepComplete && pulseKey > 0 ? "v3-cta-enable" : ""}`}
        >
          {isLastStep ? "See my recommendation" : "Next"}
          <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}

/**
 * ChipTrail — replaces the segment-bar progress. Each answered step collapses
 * into a chip showing the answer + a short engine-aware signal (cyan). Click
 * a chip to jump back and edit that step. The current step appears as an
 * outlined slot at the end of the row so users see "where they are."
 */
function ChipTrail({
  step,
  total,
  inputs,
  onEdit,
}: {
  step: number;
  total: number;
  inputs: V3Inputs;
  onEdit: (s: number) => void;
}) {
  const chips: Array<{ index: number; facts: ChipFacts }> = [];
  for (let i = 1; i < step; i++) {
    const facts = chipFor(i, inputs);
    if (facts) chips.push({ index: i, facts });
  }

  if (chips.length === 0) return null;

  return (
    <div
      role="group"
      aria-label={`Previously answered: ${chips.length} of ${total - 1}.`}
      className="flex flex-wrap items-stretch gap-2"
    >
      {chips.map(({ index, facts }) => (
        <button
          key={index}
          type="button"
          onClick={() => onEdit(index)}
          className="v3-chip-enter group relative inline-flex items-baseline gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-left transition-all hover:border-arise-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2 motion-safe:transition-all"
          aria-label={`${facts.short}: ${facts.answer}. Edit.`}
        >
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400">
            {facts.short}
          </span>
          <span className="text-[12px] font-medium leading-tight text-slate-700">
            {facts.answer}
          </span>
          <span
            aria-hidden
            className="text-[10px] text-slate-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            ✎
          </span>
        </button>
      ))}
    </div>
  );
}
