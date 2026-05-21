import { PageShell } from "./PageShell";
import { RUNNING_HEADER_SLUG, SAMPLE_META } from "./sample-data";

// Page 3 — Texas market snapshot: status. Left: TX outline only (no US map,
// no neighbors). Right: 4 metric tiles. Bottom: "What this means for your
// call" callout. All numerical values data-temp marked.

const METRIC_TILES = [
  {
    label: "Market status",
    value: "Open",
    sub: "Competitive retail choice",
    tempKey: "pdf-status-market",
  },
  {
    label: "Avg commercial price",
    value: "8.55¢ / kWh",
    sub: "2024 EIA average",
    tempKey: "pdf-status-price",
  },
  {
    label: "Reference market",
    value: "ERCOT",
    sub: "Most TX load zones",
    tempKey: "pdf-status-reference",
  },
  {
    label: "Renewal timing",
    value: "Start now",
    sub: "Compare before the window compresses",
    tempKey: "pdf-status-renewal",
  },
];

export function MarketStatus() {
  return (
    <PageShell
      number={3}
      total={SAMPLE_META.totalPages}
      title="Texas market snapshot: status"
      runningSlug={RUNNING_HEADER_SLUG}
    >
      <div className="flex h-full flex-col px-12 py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Market snapshot · 1 of 2
        </p>
        <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900">
          Texas market status.
        </h2>
        <p className="mt-3 max-w-[600px] text-[13px] leading-[1.6] text-slate-600">
          Texas is a deregulated retail market. You can compare suppliers for
          most commercial sites; the broker sits between you and the supplier
          bid stack.
        </p>

        <div className="mt-7 grid grid-cols-[280px_1fr] gap-8">
          {/* TX outline — Codex's TX-only discipline */}
          <div className="flex flex-col items-center justify-center rounded-[6px] border border-slate-200 bg-slate-50/60 p-6">
            <svg
              viewBox="0 0 240 240"
              fill="#007fe8"
              stroke="#007fe8"
              strokeWidth="1"
              strokeLinejoin="round"
              aria-hidden
              className="h-44 w-44"
            >
              <path
                d="M52 78 L88 70 L122 78 L148 72 L182 80 L196 92 L208 116 L214 138 L210 158 L196 178 L184 196 L166 210 L142 218 L120 220 L98 212 L74 196 L58 174 L48 152 L42 130 L46 104 Z"
                fillOpacity="0.95"
              />
            </svg>
            <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
              Texas · Open market
            </p>
          </div>

          {/* 4 metric tiles in 2×2 grid */}
          <dl className="grid grid-cols-2 gap-3">
            {METRIC_TILES.map((tile) => (
              <div
                key={tile.tempKey}
                data-temp={tile.tempKey}
                className="flex flex-col rounded-[6px] border border-slate-200 bg-white px-4 py-3.5"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {tile.label}
                </dt>
                <dd className="mt-1.5 text-[18px] font-semibold leading-tight tracking-tight text-slate-900">
                  {tile.value}
                </dd>
                <dd className="mt-1 text-[10px] leading-[1.4] text-slate-500">
                  {tile.sub}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* What this means for your call callout */}
        <section className="mt-7 rounded-[6px] border border-slate-200 bg-slate-50/70 px-5 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#007fe8]">
            What this means for your next call
          </p>
          <ul className="mt-2.5 space-y-1.5">
            {[
              "Ask the broker for an all-in cost per kWh, not just the supply rate.",
              "Ask which line items are fixed in the contract and which ride through.",
              "Ask how the broker times the bid — TX prices move with ERCOT load.",
            ].map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-[12px] leading-[1.55] text-slate-700"
              >
                <span
                  aria-hidden
                  className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#007fe8]"
                />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-auto pt-6 text-[10px] leading-relaxed text-slate-400">
          Source: EIA Table 4 (commercial average, Texas, 2024) · ERCOT market
          prices · Arise calculation date: May 19, 2026
        </p>
      </div>
    </PageShell>
  );
}
