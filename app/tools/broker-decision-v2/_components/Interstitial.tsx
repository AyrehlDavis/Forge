"use client";

export function Interstitial() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-[var(--v2-border-default)] bg-gradient-to-br from-white/70 via-white/55 to-[rgba(212,243,243,0.4)] px-6 py-20 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.85),var(--v2-shadow-card)] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]"
            style={{ animation: "v2-dot-pulse 1.4s ease-in-out infinite" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]"
            style={{ animation: "v2-dot-pulse 1.4s ease-in-out 0.2s infinite" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[var(--v2-accent)]"
            style={{ animation: "v2-dot-pulse 1.4s ease-in-out 0.4s infinite" }}
          />
        </div>
        <div className="text-base text-[var(--v2-text-secondary)]">
          Analyzing your portfolio…
        </div>
      </div>
    </div>
  );
}
