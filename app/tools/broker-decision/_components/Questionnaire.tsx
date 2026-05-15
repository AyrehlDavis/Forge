"use client";

import { useCallback, useState } from "react";
import { ProgressBar } from "./ProgressBar";
import { SelectionGroup } from "./SelectionGroup";
import { MultiSelectGroup } from "./MultiSelectGroup";
import { StatePicker } from "./StatePicker";
import { UsMapPicker } from "./UsMapPicker";
import {
  LOCATION_COUNT_OPTIONS,
  PRIORITY_OPTIONS,
  SITUATION_OPTIONS,
  SPEND_OPTIONS,
} from "../_config/questionnaire";
import type {
  LocationCount,
  QuestionnaireAnswers,
  RecommendationInput,
  Situation,
  Spend,
} from "../_lib/types";

interface QuestionnaireProps {
  onSubmit: (input: RecommendationInput) => void;
  initialAnswers?: QuestionnaireAnswers;
  initialStep?: number;
  mode?: "fresh" | "edit";
  onCancel?: () => void;
}

const STEP_NAMES = ["Spend", "Locations", "States", "Priorities", "Situation"];

const TOTAL_STEPS = 5;

const STEP_QUESTIONS = [
  "What's your total annual energy spend?",
  "How many locations do you manage energy for?",
  "What state are your locations in?",
  "What matters to you right now?",
  "What's your current situation?",
];

const STEP_HELPER_TEXT: Record<number, string> = {
  1: "Across all locations. A rough estimate is fine — count everything you pay for power.",
  4: "Select all that apply.",
};

function emptyAnswers(): QuestionnaireAnswers {
  return {
    spend: null,
    location_count: null,
    states: [],
    priorities: [],
    situation: null,
  };
}

function isStepComplete(step: number, answers: QuestionnaireAnswers): boolean {
  switch (step) {
    case 1:
      return answers.spend !== null;
    case 2:
      return answers.location_count !== null;
    case 3:
      return answers.states.length > 0;
    case 4:
      return answers.priorities.length > 0;
    case 5:
      return answers.situation !== null;
    default:
      return false;
  }
}

function isComplete(answers: QuestionnaireAnswers): answers is QuestionnaireAnswers & RecommendationInput {
  return (
    answers.spend !== null &&
    answers.location_count !== null &&
    answers.states.length > 0 &&
    answers.priorities.length > 0 &&
    answers.situation !== null
  );
}

export function Questionnaire({
  onSubmit,
  initialAnswers,
  initialStep = 1,
  mode = "fresh",
  onCancel,
}: QuestionnaireProps) {
  const [step, setStep] = useState(initialStep);
  const [answers, setAnswers] = useState<QuestionnaireAnswers>(
    initialAnswers ?? emptyAnswers(),
  );
  const [loading, setLoading] = useState(false);

  const isEdit = mode === "edit";
  const stepComplete = isStepComplete(step, answers);
  const isLastStep = step === TOTAL_STEPS;
  const buttonLabel = loading
    ? "Building your recommendation..."
    : isEdit
      ? "Update Recommendation"
      : isLastStep
        ? "See My Recommendation"
        : "Next";

  const goNext = useCallback(() => {
    if (!stepComplete) return;
    // In fresh mode, walk forward step by step; submit only on Step 5.
    // In edit mode, every step's primary button commits immediately.
    if (!isEdit && !isLastStep) {
      setStep((s) => s + 1);
      return;
    }
    if (!isComplete(answers)) return;
    setLoading(true);
    const input: RecommendationInput = {
      spend: answers.spend as Spend,
      location_count: answers.location_count as LocationCount,
      states: answers.states,
      priorities: answers.priorities,
      situation: answers.situation as Situation,
    };
    window.setTimeout(() => {
      onSubmit(input);
      setLoading(false);
    }, 700);
  }, [stepComplete, isLastStep, isEdit, answers, onSubmit]);

  const goBack = useCallback(() => {
    if (step > 1) setStep((s) => s - 1);
  }, [step]);

  return (
    <section
      aria-label={isEdit ? `Edit answer: ${STEP_NAMES[step - 1]}` : "Broker decision questionnaire"}
      className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-xl backdrop-saturate-150 p-6 sm:p-8 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
    >
      {isEdit ? (
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Editing · {STEP_NAMES[step - 1]}
          </p>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-slate-600 hover:text-slate-900 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      ) : (
        <ProgressBar current={step} total={TOTAL_STEPS} />
      )}

      <h2
        id={`question-${step}`}
        className="mt-6 text-xl sm:text-2xl font-semibold text-slate-900"
      >
        {STEP_QUESTIONS[step - 1]}
      </h2>
      {STEP_HELPER_TEXT[step] && (
        <p className="mt-1 text-sm text-slate-600">{STEP_HELPER_TEXT[step]}</p>
      )}

      <div
        aria-live="polite"
        className="mt-6"
      >
        {step === 1 && (
          <SelectionGroup
            options={SPEND_OPTIONS}
            value={answers.spend}
            onChange={(v) => setAnswers((a) => ({ ...a, spend: v }))}
            ariaLabel="Total annual energy spend"
            columns={4}
          />
        )}
        {step === 2 && (
          <SelectionGroup
            options={LOCATION_COUNT_OPTIONS}
            value={answers.location_count}
            onChange={(v) => setAnswers((a) => ({ ...a, location_count: v }))}
            ariaLabel="Location count"
            columns={4}
          />
        )}
        {step === 3 && (
          <div className="space-y-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
                Version A · Grid
              </p>
              <StatePicker
                value={answers.states}
                onChange={(states) => setAnswers((a) => ({ ...a, states }))}
              />
            </div>
            <div className="pt-8 border-t border-slate-200/60">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
                Version B · Map
              </p>
              <UsMapPicker
                value={answers.states}
                onChange={(states) => setAnswers((a) => ({ ...a, states }))}
              />
            </div>
          </div>
        )}
        {step === 4 && (
          <MultiSelectGroup
            options={PRIORITY_OPTIONS}
            values={answers.priorities}
            onChange={(priorities) => setAnswers((a) => ({ ...a, priorities }))}
            ariaLabel="Priorities"
            columns={4}
          />
        )}
        {step === 5 && (
          <SelectionGroup
            options={SITUATION_OPTIONS}
            value={answers.situation}
            onChange={(v) => setAnswers((a) => ({ ...a, situation: v }))}
            ariaLabel="Current situation"
            columns={3}
          />
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row-reverse sm:items-center gap-3 sm:justify-between">
        <button
          type="button"
          onClick={goNext}
          disabled={!stepComplete || loading}
          aria-disabled={!stepComplete || loading}
          className={`
            group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-semibold text-base
            transition-all duration-200 ease-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-arise-600
            ${
              stepComplete && !loading
                ? "bg-gradient-to-br from-arise-500 via-arise-600 to-arise-700 text-white shadow-[0_6px_16px_-6px_rgba(28, 138, 239,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_10px_24px_-8px_rgba(28, 138, 239,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] after:content-['→'] after:ml-1 after:inline-block after:transition-transform after:duration-200 group-hover:after:translate-x-1"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          {loading && (
            <span
              aria-hidden="true"
              className="inline-block w-3 h-3 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin align-middle"
            />
          )}
          {buttonLabel}
        </button>
        {!isEdit && step > 1 && (
          <button
            type="button"
            onClick={goBack}
            disabled={loading}
            className="w-full sm:w-auto px-4 py-3 sm:py-2 text-slate-600 hover:text-slate-900 underline-offset-2 hover:underline text-base font-medium disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 rounded"
          >
            Back
          </button>
        )}
      </div>
    </section>
  );
}
