// Stat-strip — compressed proof row that sits above the tool slice.
// All numerical values are illustrative and TEMP-marked via data-temp
// attributes so real ops data can swap in cleanly. Visual goal: a single
// confident horizontal line of evidence, not three feature cards.

interface Stat {
  value: string;
  label: string;
  tempKey: string;
}

// Real numbers per Chris's 2026-05-20 pass. "Contracts reviewed" dropped
// entirely — we have no real number for it. All four values are canonical
// (no data-temp markers); the keys here are React render keys, not temp tags.
const STATS: Stat[] = [
  { value: "700+", label: "businesses served", tempKey: "stat-businesses" },
  { value: "22", label: "active suppliers", tempKey: "stat-suppliers" },
  { value: "35", label: "markets covered", tempKey: "stat-markets" },
  { value: "20+", label: "supplier relationships", tempKey: "stat-relationships" },
];

export function StatStrip() {
  return (
    <section
      aria-label="Arise Energy proof points"
      className="relative pb-6 pt-2 sm:pb-8 sm:pt-4 lg:pb-10 lg:pt-6"
    >
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <ol className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-slate-200/70 py-5 sm:gap-x-8 sm:py-6 lg:grid-cols-4 lg:gap-x-12">
          {STATS.map((s) => (
            <li
              key={s.tempKey}
              className="flex flex-col items-start gap-1"
            >
              <span className="text-[26px] font-semibold leading-none tracking-tight tabular-nums text-slate-900 sm:text-[30px] lg:text-[34px]">
                {s.value}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:text-xs">
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
