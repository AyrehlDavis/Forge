"use client";

import { useMemo } from "react";
import { STATES, isDeregulated, joinStateNames } from "../_config/states";

interface StatePickerProps {
  value: string[];
  onChange: (states: string[]) => void;
}

export function StatePicker({ value, onChange }: StatePickerProps) {
  const selectedSet = useMemo(() => new Set(value), [value]);

  const toggle = (code: string) => {
    if (selectedSet.has(code)) {
      onChange(value.filter((c) => c !== code));
    } else {
      onChange([...value, code]);
    }
  };

  const onlyNonDeregulated =
    value.length > 0 && value.every((code) => !isDeregulated(code));

  const nonDeregNames = onlyNonDeregulated
    ? joinStateNames(value)
    : "";

  return (
    <div>
      <p className="text-sm text-slate-600 mb-3">
        Select all that apply. States with{" "}
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-arise-500" aria-hidden="true" />
          competitive energy markets
        </span>{" "}
        are highlighted.
      </p>
      <div role="group" aria-label="State selection" className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
        {STATES.map((state) => {
          const selected = selectedSet.has(state.code);
          const dereg = state.isDeregulated;
          return (
            <button
              key={state.code}
              type="button"
              role="checkbox"
              aria-checked={selected}
              aria-label={`${state.name}${dereg ? " (competitive market)" : ""}`}
              onClick={() => toggle(state.code)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(state.code);
                }
              }}
              className={`
                relative px-2 py-2 rounded-md text-sm font-medium min-h-[44px]
                border transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-offset-1
                ${
                  selected && dereg
                    ? "bg-arise-600 text-white border-arise-600 focus:ring-arise-600"
                    : selected && !dereg
                      ? "bg-slate-700 text-white border-slate-700 focus:ring-slate-500"
                      : dereg
                        ? "bg-arise-50 text-arise-800 border-arise-400 hover:bg-arise-100 focus:ring-arise-500"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 focus:ring-slate-400"
                }
              `}
            >
              <span>{state.code}</span>
              {dereg && !selected && (
                <span
                  aria-hidden="true"
                  className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-arise-500"
                />
              )}
            </button>
          );
        })}
      </div>
      {onlyNonDeregulated && (
        <div
          role="status"
          className="mt-4 rounded-md bg-slate-100 border border-slate-200 px-4 py-3 text-sm text-slate-700"
        >
          <span className="font-medium">Note:</span> Energy markets in {nonDeregNames}{" "}
          aren&apos;t deregulated — you may have fewer supplier options. A broker can still
          help identify available programs.
        </div>
      )}
    </div>
  );
}
