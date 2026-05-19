"use client";

export function Interstitial() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-[12px] border border-slate-200 bg-white px-6 py-16 text-center shadow-[0_18px_50px_rgba(10,31,31,0.06)]"
    >
      <div className="mx-auto flex max-w-md flex-col items-center gap-5">
        <div className="flex items-center gap-1.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#007fe8]"
            style={{ animation: "v2-dot-pulse 1.4s ease-in-out infinite" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#007fe8]"
            style={{ animation: "v2-dot-pulse 1.4s ease-in-out 0.2s infinite" }}
          />
          <span
            className="h-1.5 w-1.5 rounded-full bg-[#007fe8]"
            style={{ animation: "v2-dot-pulse 1.4s ease-in-out 0.4s infinite" }}
          />
        </div>
        <div className="text-base text-slate-600">Analyzing your portfolio…</div>
      </div>
    </div>
  );
}
