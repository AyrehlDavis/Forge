"use client";

import { useMemo, useState } from "react";
import { STATES } from "../_config/states";
import {
  STATE_CENTROIDS,
  STATE_MAP_VIEW_BOX,
  STATE_PATHS,
} from "../_config/state-paths";

interface StateMapProps {
  value: string[];
  onChange: (codes: string[]) => void;
}

// V1 parity — states too small to fit a label inside their geometry at this scale.
// Selected chips below the map are the disambiguation aid.
const TOO_SMALL_FOR_LABEL = new Set([
  "DE", "RI", "CT", "NJ", "DC", "MD", "MA", "VT", "NH",
]);

export function StateMap({ value, onChange }: StateMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const valueSet = useMemo(() => new Set(value), [value]);

  function toggle(code: string) {
    const next = new Set(valueSet);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange(Array.from(next));
  }

  function clear() {
    onChange([]);
  }

  const hoveredEntry = hovered ? STATES.find((s) => s.code === hovered) : null;

  return (
    <div className="space-y-2" role="group" aria-label="Operating states">
      <div className="relative rounded-xl border border-[var(--arise-100)] bg-white/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md">
        {/* Header bar — title + live hint always; legend chips desktop-only.
            On mobile the legend would wrap into a second row and bloat the
            header; the state fills already convey competitive vs regulated. */}
        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px]">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--v2-text-tertiary)]">
            <span className="font-medium uppercase tracking-[0.08em]">
              U.S. operating regions
            </span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <span
                className="inline-block h-2 w-2 rounded-sm border"
                style={{ backgroundColor: "var(--arise-50)", borderColor: "var(--arise-300)" }}
                aria-hidden
              />
              <span>Competitive</span>
            </span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <span
                className="inline-block h-2 w-2 rounded-sm border border-slate-400 bg-slate-100"
                aria-hidden
              />
              <span>Partial</span>
            </span>
            <span className="hidden items-center gap-1 sm:inline-flex">
              <span
                className="inline-block h-2 w-2 rounded-sm border border-slate-300 bg-white"
                aria-hidden
              />
              <span>Regulated</span>
            </span>
          </div>
          <span className="text-[11px] font-medium text-[var(--v2-text-secondary)]" aria-live="polite">
            {hoveredEntry
              ? `${hoveredEntry.name}${
                  hoveredEntry.isDeregulated
                    ? " · competitive"
                    : hoveredEntry.isPartial
                      ? " · partial"
                      : " · regulated"
                }`
              : value.length === 0
                ? "Click a state to add it"
                : `${value.length} selected`}
          </span>
        </div>
        <svg
          viewBox={STATE_MAP_VIEW_BOX}
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="United States — click a state to add it to your portfolio"
          className="block w-full h-auto"
          style={{ maxHeight: "440px" }}
        >
          <title>U.S. states</title>

          {/* Pass 1 — filled state shapes (click targets) */}
          {STATES.map((entry) => {
            const d = STATE_PATHS[entry.code];
            if (!d) return null;
            const selected = valueSet.has(entry.code);
            const isHovered = hovered === entry.code;
            const dereg = entry.isDeregulated;
            const partial = entry.isPartial;

            let fill: string;
            let stroke: string;
            let strokeWidth = 0.75;

            // Three-step saturation hierarchy so competitive ≠ selected:
            // - Regulated:  white
            // - Partial:    slate-100
            // - Competitive (unselected): arise-50 — palest teal wash
            // - Hover competitive:        arise-100 — preview
            // - Selected:   arise-200 saturated fill + bold arise-700 border
            if (selected) {
              fill = "var(--arise-200)";
              stroke = "var(--arise-700)";
              strokeWidth = 1.75;
            } else if (dereg) {
              fill = "var(--arise-50)";
              stroke = "var(--arise-300)";
              strokeWidth = 0.9;
            } else if (partial) {
              fill = "#f1f5f9"; // slate-100
              stroke = "#94a3b8"; // slate-400
              strokeWidth = 0.85;
            } else {
              fill = "#ffffff";
              stroke = "#cbd5e1"; // slate-300
              strokeWidth = 0.75;
            }

            // Hover lift — bridges the visual gap to "selected"
            if (isHovered && !selected) {
              fill = dereg
                ? "var(--arise-100)"
                : partial
                  ? "#e2e8f0"
                  : "#f1f5f9";
            }

            return (
              <path
                key={entry.code}
                d={d}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                role="checkbox"
                aria-checked={selected}
                aria-label={`${entry.name}${dereg ? ", open market" : partial ? ", partial market" : ", regulated market"}${selected ? ", selected" : ""}`}
                tabIndex={0}
                onClick={() => toggle(entry.code)}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    toggle(entry.code);
                  }
                }}
                onMouseEnter={() => setHovered(entry.code)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(entry.code)}
                onBlur={() => setHovered(null)}
                style={{
                  cursor: "pointer",
                  outline: "none",
                  transition: "fill 180ms ease-out, stroke 180ms ease-out",
                  filter: isHovered && !selected
                    ? "drop-shadow(0 2px 6px rgba(28, 138, 239,0.3))"
                    : "none",
                }}
              />
            );
          })}

          {/* Pass 2 — abbreviation labels at centroids. pointerEvents=none
              so clicks fall through to the geography underneath. */}
          {STATES.map((entry) => {
            if (TOO_SMALL_FOR_LABEL.has(entry.code)) return null;
            const c = STATE_CENTROIDS[entry.code];
            if (!c) return null;
            const selected = valueSet.has(entry.code);
            const dereg = entry.isDeregulated;
            const textFill = selected
              ? "var(--arise-800)"
              : dereg
                ? "var(--arise-800)"
                : "#334155";
            return (
              <text
                key={`${entry.code}-label`}
                x={c[0]}
                y={c[1]}
                textAnchor="middle"
                dy={3}
                style={{
                  fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
                  fontSize: 10,
                  fontWeight: 600,
                  fill: textFill,
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {entry.code}
              </text>
            );
          })}
        </svg>

      </div>

      {value.length > 0 && (
        <div className="flex items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap gap-1.5">
            {value.map((code) => {
              const s = STATES.find((x) => x.code === code);
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => toggle(code)}
                  aria-label={`Remove ${s?.name ?? code}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--arise-300)] bg-[var(--arise-50)] px-3 py-1 font-medium text-[var(--arise-800)] transition-colors hover:bg-[var(--arise-100)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--v2-accent)] focus-visible:ring-offset-1"
                >
                  {s?.name ?? code}
                  <span aria-hidden>×</span>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={clear}
            className="shrink-0 text-[var(--v2-text-tertiary)] underline-offset-2 transition-colors hover:text-[var(--v2-text-primary)] hover:underline focus:outline-none focus-visible:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
