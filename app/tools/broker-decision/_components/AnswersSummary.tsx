"use client";

import {
  LOCATION_COUNT_OPTIONS,
  PRIORITY_OPTIONS,
  SITUATION_OPTIONS,
  SPEND_OPTIONS,
} from "../_config/questionnaire";
import { getStateName } from "../_config/states";
import type { RecommendationInput } from "../_lib/types";

interface AnswersSummaryProps {
  input: RecommendationInput;
  onEdit: (step: number) => void;
  onStartOver: () => void;
}

function findLabel<T extends string>(
  options: ReadonlyArray<{ value: T; label: string }>,
  value: T,
): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

function statesLabel(states: string[]): string {
  if (states.length === 0) return "—";
  if (states.length === 1) return getStateName(states[0]);
  if (states.length === 2)
    return `${getStateName(states[0])}, ${getStateName(states[1])}`;
  return `${states.length} states`;
}

function prioritiesLabel(priorities: RecommendationInput["priorities"]): string {
  if (priorities.length === 0) return "—";
  const labels = priorities.map((p) => findLabel(PRIORITY_OPTIONS, p));
  if (labels.length <= 2) return labels.join(" + ");
  return `${labels.length} priorities`;
}

export function AnswersSummary({ input, onEdit, onStartOver }: AnswersSummaryProps) {
  const chips: Array<{ label: string; value: string; step: number }> = [
    {
      label: "Spend",
      value: findLabel(SPEND_OPTIONS, input.spend),
      step: 1,
    },
    {
      label: "Locations",
      value: findLabel(LOCATION_COUNT_OPTIONS, input.location_count),
      step: 2,
    },
    {
      label: "States",
      value: statesLabel(input.states),
      step: 3,
    },
    {
      label: "Priorities",
      value: prioritiesLabel(input.priorities),
      step: 4,
    },
    {
      label: "Situation",
      value: findLabel(SITUATION_OPTIONS, input.situation),
      step: 5,
    },
  ];

  return (
    <section
      aria-label="Your answers — click any to edit"
      className="rounded-2xl border border-white/60 bg-white/55 backdrop-blur-md p-3 sm:p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.8)]"
    >
      <div className="flex items-center justify-between gap-4 mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Your answers
        </p>
        <button
          type="button"
          onClick={onStartOver}
          className="text-xs text-slate-600 hover:text-arise-700 underline underline-offset-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-500 rounded whitespace-nowrap"
        >
          Start over
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <button
            key={chip.step}
            type="button"
            onClick={() => onEdit(chip.step)}
            aria-label={`Edit ${chip.label}: ${chip.value}`}
            className="group inline-flex items-baseline gap-1.5 rounded-md border border-slate-200/70 bg-white/40 hover:bg-white/90 hover:border-arise-300 transition-colors duration-150 px-2 py-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-arise-500"
          >
            <span className="text-[10px] uppercase tracking-wider text-slate-500">
              {chip.label}
            </span>
            <span className="text-xs font-semibold text-slate-900">{chip.value}</span>
            <span aria-hidden="true" className="text-[10px] text-slate-400 group-hover:text-arise-600">
              ✎
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
