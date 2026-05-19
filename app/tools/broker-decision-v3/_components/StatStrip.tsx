// Stat-strip — compressed proof row that sits above the tool slice.
// All numerical values are illustrative and TEMP-marked via data-temp
// attributes so real ops data can swap in cleanly. Visual goal: a single
// confident horizontal line of evidence, not three feature cards.

interface Stat {
  value: string;
  label: string;
  tempKey: string;
}

const STATS: Stat[] = [
  {
    value: "$2.4B",
    label: "in contracts reviewed",
    tempKey: "stat-contracts-reviewed",
  },
  {
    value: "50",
    label: "states covered",
    tempKey: "stat-state-coverage",
  },
  {
    value: "12 yr",
    label: "avg supplier tenure",
    tempKey: "stat-supplier-tenure",
  },
  {
    value: "847",
    label: "brokers in our database",
    tempKey: "stat-broker-database",
  },
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
              data-temp={s.tempKey}
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
        <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-slate-400">
          Illustrative · pending production data
        </p>
      </div>
    </section>
  );
}
