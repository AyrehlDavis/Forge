import { PageShell } from "./PageShell";
import {
  RUNNING_HEADER_SLUG,
  SAMPLE_CHIPS,
  SAMPLE_META,
  SAMPLE_RESULT,
} from "./sample-data";

// Page 2 — At a glance: recommendation TL;DR + 3 reasons + chips + 3 next actions.
// Replaces Warlock's "How to use this checklist" page per Ranger spec (the
// Ranger order anchors the buyer in the recommendation before the snapshot pages).

export function AtAGlance() {
  // Pull the engine's three reasons. Render the first three as 3-col cards
  // with a short label per Ranger's spec (Why / Risk / Focus).
  const reasonLabels = ["Why", "Risk", "Focus"] as const;

  return (
    <PageShell
      number={2}
      total={SAMPLE_META.totalPages}
      title="At a glance"
      runningSlug={RUNNING_HEADER_SLUG}
    >
      <div className="flex h-full flex-col px-12 py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          At a glance
        </p>
        <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-tight text-slate-900">
          Your recommendation:{" "}
          <span className="text-[#007fe8]">Use a broker.</span>
        </h2>
        <p className="mt-3 max-w-[640px] text-[13px] leading-[1.6] text-slate-600">
          {SAMPLE_RESULT.headline}
        </p>

        {/* Three reason cards */}
        <div className="mt-7 grid grid-cols-3 gap-4">
          {SAMPLE_RESULT.whyBullets.slice(0, 3).map((b, i) => (
            <div
              key={b.label}
              className="rounded-[6px] border border-slate-200 bg-white p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#007fe8]">
                {reasonLabels[i] ?? "Note"}
              </p>
              <p className="mt-2 text-[12px] font-semibold leading-tight text-slate-900">
                {b.label}
              </p>
              <p className="mt-1.5 text-[11px] leading-[1.55] text-slate-600">
                {b.body}
              </p>
            </div>
          ))}
        </div>

        {/* Chip strip — restated personalization */}
        <div className="mt-7 rounded-[6px] border border-slate-200 bg-slate-50/70 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Built from your answers
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5">
            {SAMPLE_CHIPS.map((chip) => (
              <li
                key={chip.label}
                className="flex items-baseline gap-1.5 text-[11px] leading-tight"
              >
                <span className="text-slate-500">{chip.label}:</span>
                <span className="font-medium text-slate-900">{chip.value}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[12px] leading-[1.6] text-slate-700">
            Because you have 11–50 Texas sites and a renewal window opening
            soon, focus the broker conversation on supplier reach, timing plan,
            and total-cost transparency.
          </p>
        </div>

        {/* Next 3 actions */}
        <div className="mt-7">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Bring this kit to the broker call
          </p>
          <ol className="mt-3 space-y-2.5">
            {[
              "Ask the nine questions (pages 5–7).",
              "Score answers live on the call (page 8).",
              "Send quotes to Arise if you want a second read (page 9).",
            ].map((step, i) => (
              <li
                key={step}
                className="flex items-baseline gap-3 text-[13px] leading-[1.55] text-slate-800"
              >
                <span
                  aria-hidden
                  className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#007fe8] text-[10px] font-semibold text-white"
                >
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-auto border-t border-slate-100 pt-4 text-[10px] leading-relaxed text-slate-500">
          The score grid is the practical payoff (page 8). Print this kit so
          you can mark it up during the call.
        </div>
      </div>
    </PageShell>
  );
}
