"use client";

import { useCallback, useState } from "react";
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

export function SmartForm({ onChange, onSubmit }: SmartFormProps) {
  const [inputs, setInputs] = useState<V3Inputs>(EMPTY);
  const [step, setStep] = useState(1);

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
      className="space-y-8"
    >
      <CarouselProgress step={step} total={STEP_COUNT} />

      <fieldset className="border-0 p-0">
        <legend className="block text-lg font-semibold text-slate-900 sm:text-xl">
          {currentMeta.question}
        </legend>
        {currentMeta.helper && (
          <p className="mt-2 text-sm leading-6 text-slate-600">{currentMeta.helper}</p>
        )}

        <div className="mt-6">
          {step === 1 && (
            <div
              role="radiogroup"
              aria-label="Number of locations"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
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
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
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
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
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
              className="grid grid-cols-1 gap-3 sm:grid-cols-2"
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
          type="button"
          onClick={goNext}
          disabled={!stepComplete}
          className="v3-pill-primary inline-flex h-12 items-center justify-center gap-2 px-6 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
        >
          {isLastStep ? "See my recommendation" : "Next"}
          <span aria-hidden>→</span>
        </button>
      </div>
    </form>
  );
}

/**
 * Top-of-form carousel progress — 5 segments, fills as the user advances,
 * plus a tabular "Step N of 5" counter. V1 pattern, refreshed for V3.
 */
function CarouselProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-4">
      <ol
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Step ${step} of ${total}`}
        className="flex flex-1 items-center gap-1.5"
      >
        {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
          <li
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 motion-safe:transition-all ${
              s < step
                ? "bg-arise-600"
                : s === step
                  ? "bg-gradient-to-r from-arise-electric to-arise-600"
                  : "bg-slate-200"
            }`}
          />
        ))}
      </ol>
      <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.12em] tabular-nums text-[#006bc5]">
        Step {step} of {total}
      </span>
    </div>
  );
}
