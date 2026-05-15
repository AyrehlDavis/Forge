"use client";

import { useMemo } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { STATES } from "../_config/states";

// States too small to read a label inside their geometry at our scale.
// We hide the inline label for these — selected chips below the map are the
// disambiguation aid. (Leader lines are a v2 polish.)
const TOO_SMALL_FOR_LABEL = new Set(["DE", "RI", "CT", "NJ", "DC", "MD", "MA", "VT", "NH"]);

const GEO_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

interface UsMapPickerProps {
  value: string[];
  onChange: (states: string[]) => void;
}

interface StateMeta {
  code: string;
  name: string;
  isDeregulated: boolean;
}

export function UsMapPicker({ value, onChange }: UsMapPickerProps) {
  const selectedSet = useMemo(() => new Set(value), [value]);

  // name → state metadata (us-atlas exposes properties.name; we match on that)
  const nameLookup = useMemo(() => {
    const m = new Map<string, StateMeta>();
    for (const s of STATES) m.set(s.name, s);
    return m;
  }, []);

  const toggle = (code: string) => {
    if (selectedSet.has(code)) {
      onChange(value.filter((c) => c !== code));
    } else {
      onChange([...value, code]);
    }
  };

  return (
    <div>
      <p className="text-sm text-slate-600 mb-3">
        Click states to select.{" "}
        <span className="inline-flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-arise-500" aria-hidden="true" />
          Competitive energy markets
        </span>{" "}
        are tinted teal.
      </p>

      <div
        className="rounded-2xl border border-white/60 bg-white/55 backdrop-blur-xl backdrop-saturate-150 p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.8)]"
        role="group"
        aria-label="State selection — map"
      >
        <ComposableMap
          projection="geoAlbersUsa"
          projectionConfig={{ scale: 1000 }}
          width={800}
          height={500}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: any[] }) => (
              <>
                {/* Pass 1: filled state shapes (click targets) */}
                {geographies.map((geo) => {
                  const state = nameLookup.get(geo.properties.name);
                  if (!state) return null;
                  const selected = selectedSet.has(state.code);
                  const dereg = state.isDeregulated;

                  // Resting fill / stroke
                  let fill = "#ffffff";
                  let stroke = "#cbd5e1"; // slate-300
                  let strokeWidth = 0.75;

                  if (selected && dereg) {
                    fill = "#007fe8"; // arise-600
                    stroke = "#00549c"; // arise-800
                    strokeWidth = 1.25;
                  } else if (selected && !dereg) {
                    fill = "#475569"; // slate-700
                    stroke = "#334155";
                    strokeWidth = 1.25;
                  } else if (dereg) {
                    fill = "#d8e9fc"; // arise-100
                    stroke = "#4ea3f3"; // arise-400
                    strokeWidth = 1;
                  }

                  const hoverFill = selected
                    ? fill
                    : dereg
                      ? "#b3d4fa" // arise-200
                      : "#f1f5f9"; // slate-100

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => toggle(state.code)}
                      onKeyDown={(e: React.KeyboardEvent) => {
                        if (e.key === " " || e.key === "Enter") {
                          e.preventDefault();
                          toggle(state.code);
                        }
                      }}
                      tabIndex={0}
                      role="checkbox"
                      aria-checked={selected}
                      aria-label={`${state.name}${dereg ? " (competitive market)" : ""}${selected ? ", selected" : ""}`}
                      style={{
                        default: {
                          fill,
                          stroke,
                          strokeWidth,
                          outline: "none",
                          transition: "fill 180ms ease-out, stroke 180ms ease-out",
                        },
                        hover: {
                          fill: hoverFill,
                          stroke: selected ? stroke : "#007fe8",
                          strokeWidth: 1.5,
                          outline: "none",
                          cursor: "pointer",
                          filter: "drop-shadow(0 2px 6px rgba(28, 138, 239,0.3))",
                        },
                        pressed: {
                          fill,
                          stroke,
                          strokeWidth,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })}

                {/* Pass 2: abbreviation labels at centroids. pointerEvents=none
                    so clicks fall through to the geography underneath. */}
                {geographies.map((geo) => {
                  const state = nameLookup.get(geo.properties.name);
                  if (!state) return null;
                  if (TOO_SMALL_FOR_LABEL.has(state.code)) return null;
                  const centroid = geoCentroid(geo);
                  if (!Number.isFinite(centroid[0]) || !Number.isFinite(centroid[1])) return null;
                  const selected = selectedSet.has(state.code);
                  const dereg = state.isDeregulated;
                  // Contrast on each fill: white on solid selected, arise-800 on
                  // dereg tint, slate-700 on plain white.
                  const textFill = selected ? "#ffffff" : dereg ? "#00549c" : "#334155";

                  return (
                    <Marker key={`${geo.rsmKey}-label`} coordinates={centroid}>
                      <text
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
                        {state.code}
                      </text>
                    </Marker>
                  );
                })}
              </>
            )}
          </Geographies>
        </ComposableMap>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block w-3 h-3 rounded-sm bg-arise-100 border border-arise-400"
            />
            Competitive
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block w-3 h-3 rounded-sm bg-arise-600 border border-arise-800"
            />
            Selected (competitive)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="inline-block w-3 h-3 rounded-sm bg-slate-700 border border-slate-700"
            />
            Selected (regulated)
          </span>
        </div>
      </div>

      {/* Selected chips — quick remove + visual summary */}
      {value.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Selected states">
          {value.map((code) => {
            const s = STATES.find((x) => x.code === code);
            return (
              <button
                key={code}
                type="button"
                onClick={() => toggle(code)}
                className="inline-flex items-center gap-1.5 rounded-full bg-arise-50 border border-arise-300 text-arise-800 px-3 py-1 text-xs font-medium hover:bg-arise-100 transition-colors focus:outline-none focus:ring-2 focus:ring-arise-500 focus:ring-offset-1"
                aria-label={`Remove ${s?.name ?? code}`}
              >
                {s?.name ?? code}
                <span aria-hidden>×</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
