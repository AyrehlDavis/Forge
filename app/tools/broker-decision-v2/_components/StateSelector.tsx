"use client";

import { useMemo, useState } from "react";
import { STATES } from "../_config/states";

interface StateSelectorProps {
  value: string[];
  onChange: (codes: string[]) => void;
}

// Common deregulated states shown as quick-pick chips above the full grid.
const QUICK_PICKS = ["TX", "NY", "PA", "IL", "OH", "MA", "NJ", "MD"];

const ROWS: string[][] = [
  ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL"],
  ["GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME"],
  ["MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH"],
  ["NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI"],
  ["SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI"],
  ["WY"],
];

export function StateSelector({ value, onChange }: StateSelectorProps) {
  const [showAll, setShowAll] = useState(false);
  const valueSet = useMemo(() => new Set(value), [value]);

  function toggle(code: string) {
    const next = new Set(valueSet);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange(Array.from(next));
  }

  return (
    <div className="space-y-3" role="group" aria-label="Operating states">
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PICKS.map((code) => {
          const selected = valueSet.has(code);
          const entry = STATES.find((s) => s.code === code);
          return (
            <button
              key={code}
              type="button"
              role="checkbox"
              aria-checked={selected}
              onClick={() => toggle(code)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(code);
                }
              }}
              className={`relative rounded-md border px-3 py-1.5 font-mono text-xs font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--v2-surface-primary)] ${
                selected
                  ? "border-[var(--v2-accent)] bg-[var(--v2-accent)] text-[var(--v2-background)]"
                  : "border-[var(--v2-border-default)] bg-[var(--v2-surface-primary)] text-[var(--v2-text-primary)] hover:border-[var(--v2-text-tertiary)]"
              }`}
              aria-label={`${entry?.name ?? code}${entry?.isDeregulated ? ", open market" : entry?.isPartial ? ", partial market" : ", regulated market"}`}
            >
              {code}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="rounded-md border border-dashed border-[var(--v2-border-default)] px-3 py-1.5 text-xs font-medium text-[var(--v2-text-secondary)] transition-colors duration-150 hover:border-[var(--v2-text-tertiary)] hover:text-[var(--v2-text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--v2-surface-primary)]"
          aria-expanded={showAll}
        >
          {showAll ? "Hide full list" : "All 51 states"}
        </button>
      </div>

      {showAll && (
        <div className="rounded-lg border border-[var(--v2-border-subtle)] bg-[var(--v2-surface-subtle)] p-3">
          <div className="mb-3 flex items-center gap-3 text-[10px] uppercase tracking-wider text-[var(--v2-text-tertiary)]">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]" aria-hidden /> Open market
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--v2-text-tertiary)] opacity-50" aria-hidden /> Regulated
            </span>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {ROWS.flat().map((code) => {
              const entry = STATES.find((s) => s.code === code);
              if (!entry) return null;
              const selected = valueSet.has(code);
              const dereg = entry.isDeregulated;
              return (
                <button
                  key={code}
                  type="button"
                  role="checkbox"
                  aria-checked={selected}
                  onClick={() => toggle(code)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault();
                      toggle(code);
                    }
                  }}
                  className={`relative aspect-square rounded font-mono text-[11px] font-medium transition-colors duration-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--v2-surface-subtle)] ${
                    selected
                      ? "bg-[var(--v2-accent)] text-[var(--v2-background)]"
                      : dereg
                        ? "bg-[var(--v2-surface-primary)] text-[var(--v2-text-primary)] hover:bg-[var(--v2-surface-primary)] hover:ring-1 hover:ring-[var(--v2-text-tertiary)]"
                        : "bg-transparent text-[var(--v2-text-tertiary)] hover:bg-[var(--v2-surface-primary)] hover:text-[var(--v2-text-secondary)]"
                  }`}
                  aria-label={`${entry.name}${dereg ? ", open market" : entry.isPartial ? ", partial market" : ", regulated market"}`}
                  title={entry.name}
                >
                  {code}
                  {dereg && !selected && (
                    <span
                      className="absolute right-0.5 top-0.5 h-1 w-1 rounded-full bg-[var(--v2-accent)]"
                      aria-hidden
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
