"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const TOO_SMALL_FOR_LABEL = new Set([
  "DE", "RI", "CT", "NJ", "DC", "MD", "MA", "VT", "NH",
]);

export function StateMap({ value, onChange }: StateMapProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const valueSet = useMemo(() => new Set(value), [value]);
  const searchRef = useRef<HTMLInputElement>(null);
  const expandBtnRef = useRef<HTMLButtonElement>(null);

  function toggle(code: string) {
    const next = new Set(valueSet);
    if (next.has(code)) next.delete(code);
    else next.add(code);
    onChange(Array.from(next));
  }

  function clear() {
    onChange([]);
  }

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setSearch("");
    requestAnimationFrame(() => expandBtnRef.current?.focus());
  }

  // Focus search input when modal opens
  useEffect(() => {
    if (modalOpen) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [modalOpen]);

  // ESC closes modal
  useEffect(() => {
    if (!modalOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeModal();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  const hoveredEntry = hovered ? STATES.find((s) => s.code === hovered) : null;

  // Filtered + grouped states for modal chip list
  const displayStates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return STATES;
    return STATES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
    );
  }, [search]);

  const competitiveStates = displayStates.filter((s) => s.isDeregulated);
  const partialStates = displayStates.filter((s) => !s.isDeregulated && s.isPartial);
  const regulatedStates = displayStates.filter((s) => !s.isDeregulated && !s.isPartial);

  return (
    <>
      {/* ── Inline map ─────────────────────────────────────── */}
      <div className="space-y-2" role="group" aria-label="Operating states">
        <div className="relative rounded-xl border border-[var(--arise-100)] bg-white/78 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md">
          <div className="mb-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[10px]">
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
            <div className="flex items-center gap-2.5">
              <span
                className="text-[11px] font-medium text-[var(--v2-text-secondary)]"
                aria-live="polite"
              >
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
              {/* Expand button — mobile only */}
              <button
                ref={expandBtnRef}
                type="button"
                onClick={openModal}
                aria-haspopup="dialog"
                className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 transition-colors hover:border-[#006bc5] hover:text-[#006bc5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-1 sm:hidden"
              >
                <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 9L9 1M9 1H4M9 1V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Expand
              </button>
            </div>
          </div>

          <svg
            viewBox={STATE_MAP_VIEW_BOX}
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="United States — click a state to add it to your portfolio"
            className="block h-auto w-full"
            style={{ maxHeight: "440px" }}
          >
            <title>U.S. states</title>
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
              if (selected) {
                fill = "var(--arise-200)";
                stroke = "var(--arise-700)";
                strokeWidth = 1.75;
              } else if (dereg) {
                fill = "var(--arise-50)";
                stroke = "var(--arise-300)";
                strokeWidth = 0.9;
              } else if (partial) {
                fill = "#f1f5f9";
                stroke = "#94a3b8";
                strokeWidth = 0.85;
              } else {
                fill = "#ffffff";
                stroke = "#cbd5e1";
                strokeWidth = 0.75;
              }
              if (isHovered && !selected) {
                fill = dereg ? "var(--arise-100)" : partial ? "#e2e8f0" : "#f1f5f9";
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
                    filter:
                      isHovered && !selected
                        ? "drop-shadow(0 2px 6px rgba(28,138,239,0.3))"
                        : "none",
                  }}
                />
              );
            })}
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

      {/* ── Expand modal ────────────────────────────────────── */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select operating states"
          className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Panel — bottom sheet on mobile, centered card on sm+ */}
          <div className="relative z-10 flex max-h-[92dvh] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-h-[80vh] sm:max-w-lg sm:rounded-2xl">
            {/* Drag handle (mobile) */}
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-slate-200 sm:hidden" />

            {/* Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Select states</h2>
                {value.length > 0 && (
                  <p className="mt-0.5 text-[12px] text-slate-500">
                    {value.length} selected
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Search */}
            <div className="shrink-0 px-5 pb-3 pt-4">
              <input
                ref={searchRef}
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search states…"
                className="w-full rounded-[10px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#006bc5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#006bc5]/20"
              />
            </div>

            {/* Chip groups — scrollable */}
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              {/* Currently selected */}
              {value.length > 0 && (
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      Selected
                    </p>
                    <button
                      type="button"
                      onClick={clear}
                      className="text-[11px] text-slate-400 underline-offset-2 hover:text-slate-600 hover:underline focus:outline-none focus-visible:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {value.map((code) => {
                      const s = STATES.find((x) => x.code === code);
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => toggle(code)}
                          aria-label={`Remove ${s?.name ?? code}`}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-[var(--arise-300)] bg-[var(--arise-100)] px-3 text-[13px] font-medium text-[var(--arise-800)] transition-colors hover:bg-[var(--arise-200)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5]"
                        >
                          {s?.name ?? code}
                          <span aria-hidden className="text-[10px]">×</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Competitive */}
              {competitiveStates.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Competitive
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {competitiveStates.map((s) => {
                      const selected = valueSet.has(s.code);
                      return (
                        <button
                          key={s.code}
                          type="button"
                          onClick={() => toggle(s.code)}
                          className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] ${
                            selected
                              ? "border-[var(--arise-300)] bg-[var(--arise-100)] text-[var(--arise-800)]"
                              : "border-slate-200 bg-white text-slate-700 hover:border-[var(--arise-300)] hover:bg-[var(--arise-50)]"
                          }`}
                        >
                          {s.name}
                          {selected && <span aria-hidden className="text-[var(--arise-700)]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Partial */}
              {partialStates.length > 0 && (
                <div className="mb-5">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Partial
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {partialStates.map((s) => {
                      const selected = valueSet.has(s.code);
                      return (
                        <button
                          key={s.code}
                          type="button"
                          onClick={() => toggle(s.code)}
                          className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] ${
                            selected
                              ? "border-[var(--arise-300)] bg-[var(--arise-100)] text-[var(--arise-800)]"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {s.name}
                          {selected && <span aria-hidden className="text-[var(--arise-700)]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Regulated */}
              {regulatedStates.length > 0 && (
                <div className="mb-4">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                    Regulated
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {regulatedStates.map((s) => {
                      const selected = valueSet.has(s.code);
                      return (
                        <button
                          key={s.code}
                          type="button"
                          onClick={() => toggle(s.code)}
                          className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] ${
                            selected
                              ? "border-[var(--arise-300)] bg-[var(--arise-100)] text-[var(--arise-800)]"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {s.name}
                          {selected && <span aria-hidden className="text-[var(--arise-700)]">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Empty search result */}
              {displayStates.length === 0 && (
                <p className="py-6 text-center text-sm text-slate-400">
                  No states match &ldquo;{search}&rdquo;
                </p>
              )}
            </div>

            {/* Done footer */}
            <div className="shrink-0 border-t border-slate-100 px-5 py-4">
              <button
                type="button"
                onClick={closeModal}
                className="inline-flex w-full items-center justify-center rounded-[10px] bg-[#006bc5] px-5 py-3 text-sm font-semibold text-white shadow-[0_2px_6px_-1px_rgba(0,107,197,0.4)] transition-colors hover:bg-[#0058a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
              >
                {value.length > 0
                  ? `Done · ${value.length} state${value.length !== 1 ? "s" : ""} selected`
                  : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
