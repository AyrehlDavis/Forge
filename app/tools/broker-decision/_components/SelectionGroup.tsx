"use client";

import { useId } from "react";
import type { SelectionOption } from "../_config/questionnaire";

interface SelectionGroupProps<T extends string> {
  options: SelectionOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  ariaLabel: string;
  columns?: 3 | 4;
}

export function SelectionGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  columns = 3,
}: SelectionGroupProps<T>) {
  const groupName = useId();
  const gridCols = columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3";

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-3`}
    >
      {options.map((option, idx) => {
        const selected = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            style={{ animationDelay: `${idx * 60}ms` }}
            role="radio"
            aria-checked={selected}
            name={groupName}
            onClick={() => onChange(option.value)}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                onChange(option.value);
              }
            }}
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
              {/* min-h-[2lh] reserves 2 lines of label height so descriptors
                  align across cards regardless of label wrap. */}
              <div
                className={`font-semibold leading-snug min-h-[2lh] ${
                  selected ? "text-arise-900" : "text-slate-900"
                }`}
              >
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
