"use client";

import { useMemo } from "react";
import type { SelectionOption } from "../_config/questionnaire";

interface MultiSelectGroupProps<T extends string> {
  options: SelectionOption<T>[];
  values: T[];
  onChange: (values: T[]) => void;
  ariaLabel: string;
  columns?: 3 | 4;
}

export function MultiSelectGroup<T extends string>({
  options,
  values,
  onChange,
  ariaLabel,
  columns = 3,
}: MultiSelectGroupProps<T>) {
  const selectedSet = useMemo(() => new Set(values), [values]);
  const gridCols = columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  const toggle = (value: T) => {
    if (selectedSet.has(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-3`}
    >
      {options.map((option, idx) => {
        const selected = selectedSet.has(option.value);
        return (
          <button
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={selected}
            onClick={() => toggle(option.value)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                toggle(option.value);
              }
            }}
            style={{ animationDelay: `${idx * 60}ms` }}
            className={`
              v1-card-enter
              group relative text-left rounded-2xl border-2 p-4 min-h-[64px]
              transition-all duration-200 ease-out
              focus:outline-none
              ${
                selected
                  ? "border-arise-700 bg-arise-100 shadow-[0_8px_24px_-10px_rgba(28, 138, 239,0.3)] -translate-y-0.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-500"
                  : "border-slate-200/60 bg-white/55 backdrop-blur-md shadow-[0_1px_2px_rgba(15,23,42,0.04),inset_0_1px_0_rgba(255,255,255,0.6)] hover:bg-white/85 hover:-translate-y-0.5 hover:border-arise-300 hover:shadow-[0_8px_20px_-10px_rgba(28, 138, 239,0.22),inset_0_1px_0_rgba(255,255,255,0.85)] active:scale-[0.98] active:transition-transform active:duration-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-500"
              }
            `}
          >
            <div>
              <div className={`font-semibold ${selected ? "text-arise-900" : "text-slate-900"}`}>
                {option.label}
              </div>
              {option.descriptor && (
                <div
                  className={`text-sm mt-1 leading-snug ${
                    selected ? "text-arise-800/80" : "text-slate-600"
                  }`}
                >
                  {option.descriptor}
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
