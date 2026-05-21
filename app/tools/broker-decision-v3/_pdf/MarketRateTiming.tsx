import { PageShell } from "./PageShell";
import { RUNNING_HEADER_SLUG, SAMPLE_META } from "./sample-data";

// Page 4 — Texas market snapshot: rate + timing.
// Top half: range bar labeled "Benchmark, not quote" with EIA dot + blank
// quote slots the buyer fills on the call (Codex's honesty discipline).
// Bottom half: renewal timeline strip.

const TIMELINE_STEPS = [
  { label: "Today", caption: "Read this kit" },
  { label: "−180d", caption: "Collect invoices" },
  { label: "−90d", caption: "Open broker bid" },
  { label: "−30d", caption: "Compare all-in" },
  { label: "End", caption: "Sign + monitor" },
];

export function MarketRateTiming() {
  return (
    <PageShell
      number={4}
      total={SAMPLE_META.totalPages}
      title="Texas market snapshot: rate + timing"
      runningSlug={RUNNING_HEADER_SLUG}
    >
      <div className="flex h-full flex-col px-12 py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Market snapshot · 2 of 2
        </p>
        <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900">
          Where rates are, and when to act.
        </h2>

        {/* Range bar — NOT a line chart */}
        <section className="mt-7 rounded-[6px] border border-slate-200 bg-white p-6">
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
              Texas commercial range · benchmark, not quote
            </p>
            <p className="text-[10px] text-slate-400">$/kWh</p>
          </div>

          {/* Range bar visualization */}
          <div
            data-temp="pdf-range-bar"
            className="relative mt-8 h-[120px]"
          >
            {/* Range shaded band */}
            <div className="absolute left-[12%] right-[18%] top-[28px] h-6 rounded-sm bg-arise-50 border border-arise-200/60" />

            {/* EIA benchmark dot */}
            <div
              className="absolute top-[28px] h-6 w-[3px] bg-[#007fe8]"
              style={{ left: "44%" }}
              aria-hidden
            />
            <div
              className="absolute -translate-x-1/2"
              style={{ left: "44%", top: "0" }}
            >
              <span className="block text-[10px] font-semibold text-[#007fe8]">
                EIA 2024 avg
              </span>
              <span className="block text-[10px] tabular-nums text-slate-500">
                $0.0855
              </span>
            </div>

            {/* Blank quote slots — vertical markers buyer fills */}
            {[28, 56, 70].map((pct, i) => (
              <div
                key={pct}
                className="absolute top-[28px] h-6 w-[2px] bg-slate-300"
                style={{ left: `${pct}%` }}
                aria-hidden
              >
                <span className="absolute left-1/2 top-7 block -translate-x-1/2 whitespace-nowrap text-[9px] uppercase tracking-[0.12em] text-slate-400">
                  Quote {String.fromCharCode(65 + i)}
                </span>
                <span className="absolute left-1/2 top-12 block -translate-x-1/2 whitespace-nowrap text-[9px] tabular-nums text-slate-300">
                  $__.____
                </span>
              </div>
            ))}

            {/* Axis labels */}
            <div className="absolute bottom-0 left-[12%] text-[9px] tabular-nums text-slate-400">
              $0.068
            </div>
            <div className="absolute bottom-0 right-[18%] text-[9px] tabular-nums text-slate-400">
              $0.102
            </div>
          </div>

          <p className="mt-4 text-[11px] leading-[1.5] text-slate-600">
            The blue tick is the 2024 EIA Texas commercial average. The shaded
            band is the 12-month range. Plot incoming broker quotes on the
            three Quote slots during the call — gives you a one-glance read on
            where each offer lands.
          </p>
          <p className="mt-2 text-[10px] text-slate-400">
            Source: EIA monthly commercial average (Texas, 2024) · ERCOT
            day-ahead settlement points
          </p>
        </section>

        {/* Renewal timeline strip */}
        <section className="mt-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Renewal timeline · You said renewal soon
          </p>
          <div className="relative mt-6 pb-12">
            {/* Track */}
            <div className="absolute inset-x-2 top-[10px] h-px bg-slate-200" />
            <div
              className="absolute top-[10px] h-px bg-[#007fe8]"
              style={{ left: "0.5rem", width: "calc((100% - 1rem) * 0.20)" }}
              aria-hidden
            />

            <ol className="relative grid grid-cols-5 gap-2">
              {TIMELINE_STEPS.map((step, i) => (
                <li key={step.label} className="flex flex-col items-start">
                  <span
                    aria-hidden
                    className={`relative -ml-[6px] block h-3 w-3 rounded-full border-2 ${
                      i === 0
                        ? "border-[#007fe8] bg-[#007fe8]"
                        : i === 1
                          ? "border-[#007fe8] bg-white"
                          : "border-slate-300 bg-white"
                    }`}
                  />
                  <span
                    className={`mt-2 text-[11px] font-semibold tabular-nums leading-tight ${
                      i < 2 ? "text-slate-900" : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span
                    className={`mt-1 text-[10px] leading-[1.4] ${
                      i < 2 ? "text-slate-600" : "text-slate-400"
                    }`}
                  >
                    {step.caption}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Warning box */}
        <section className="mt-2 rounded-[6px] border border-amber-200 bg-amber-50/70 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
            Honest read
          </p>
          <p className="mt-1 text-[12px] leading-[1.55] text-amber-900">
            Market prices move daily. This snapshot is a benchmark for the call,
            not a quote — and renewal soon means compare early enough to avoid
            a rushed sign.
          </p>
        </section>
      </div>
    </PageShell>
  );
}
