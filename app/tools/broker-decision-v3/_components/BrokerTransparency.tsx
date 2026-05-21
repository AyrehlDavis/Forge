// BrokerTransparency — net-new V3.6 section sitting between SocialProof and
// FaqSection. Three rows (Value / Catch / Fix) with mono numbered kickers
// and hairline separators. Mirrors the ResultCard signal-trace pattern so
// the section feels native to the V3.5 visual identity.
// Copy is Chris's verbatim from the 2026-05-20 pass.

interface TransparencyRow {
  label: string;
  body: string;
}

const ROWS: TransparencyRow[] = [
  {
    label: "The broker value",
    body: "They leverage deep relationships across dozens of suppliers to instantly pull competitive quotes, sparing you from sitting through twenty different supplier sales pitches.",
  },
  {
    label: "The catch",
    body: "Many hide large margins inside those quotes and focus on deal velocity, they may steer you toward the supplier offering them the highest payout that closes the deal today.",
  },
  {
    label: "The fix",
    body: "A partner who is completely transparent about their process, discloses their exact fees, and ensures your goals dictate the supplier and product choice — not a commission check.",
  },
];

export function BrokerTransparency() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div className="max-w-[760px]">
          <p className="label-section">Transparency</p>
          <h2 className="mt-3 text-balance text-[30px] font-semibold leading-[1.1] tracking-[-0.018em] text-slate-900 sm:text-[34px] lg:text-[40px]">
            Is your broker working for you, the supplier, or themselves?
          </h2>
          <p className="mt-3 max-w-[560px] text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Pure transparency aligns incentives.
          </p>
        </div>

        <ol className="mt-10 divide-y divide-[#D8E6F5] border-y border-[#D8E6F5]">
          {ROWS.map((row, i) => (
            <li
              key={row.label}
              className="grid grid-cols-[40px_1fr] gap-x-4 py-5"
            >
              <span
                className="label-number"
                aria-hidden
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[15px] leading-relaxed text-slate-600 sm:text-base sm:leading-7">
                <span className="font-semibold text-slate-900">
                  {row.label}
                </span>
                <span aria-hidden> — </span>
                {row.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
