"use client";

import type { V2Inputs } from "../_lib/types";

interface ProgressDotsProps {
  inputs: V2Inputs;
}

export function ProgressDots({ inputs }: ProgressDotsProps) {
  const steps = [
    { id: "step-states", label: "States", done: inputs.states.length > 0 },
    { id: "step-priority", label: "Priority", done: inputs.priority !== null },
    { id: "step-timing", label: "Timing", done: inputs.situation !== null },
  ];
  const firstUnfilledIdx = steps.findIndex((s) => !s.done);
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <nav
      aria-label="Form progress"
      className="pointer-events-none fixed right-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col items-center lg:flex"
    >
      <div className="pointer-events-auto flex flex-col items-center gap-1">
        {steps.map((step, i) => {
          const isCurrent = !allDone && i === firstUnfilledIdx;
          const isDone = step.done;
          return (
            <div key={step.id} className="group/dot flex flex-col items-center">
              <button
                type="button"
                onClick={() => jump(step.id)}
                aria-label={`Jump to ${step.label} — ${
                  isDone ? "complete" : isCurrent ? "current step" : "upcoming"
                }`}
                aria-current={isCurrent ? "step" : undefined}
                className={`relative flex h-3 w-3 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent-warm)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--v2-background)] ${
                  isDone
                    ? "scale-100 bg-[var(--v2-accent-warm)] shadow-[0_0_12px_var(--v2-accent-warm-soft)]"
                    : isCurrent
                      ? "scale-110 border-2 border-[var(--v2-accent-warm)] bg-white"
                      : "scale-90 border border-[var(--arise-200)] bg-white"
                }`}
              >
                {isCurrent && !isDone && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-[var(--v2-accent-warm)] opacity-40"
                    style={{ animation: "v2-dot-pulse 1.4s ease-in-out infinite" }}
                  />
                )}
              </button>
              <span
                className={`pointer-events-none mt-1 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.08em] transition-all duration-200 ${
                  isDone || isCurrent
                    ? "text-[var(--v2-text-secondary)] opacity-100"
                    : "text-[var(--v2-text-tertiary)] opacity-50"
                }`}
              >
                {step.label}
              </span>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className={`my-2 h-8 w-px transition-colors duration-200 ${
                    isDone
                      ? "bg-[var(--v2-accent-warm)]"
                      : "bg-[var(--arise-200)]"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
