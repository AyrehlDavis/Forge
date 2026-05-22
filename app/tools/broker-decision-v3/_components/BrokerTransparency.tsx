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

        <ol className="mt-10 grid grid-cols-1 gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-[1fr_1.35fr] lg:gap-10">
          {/* Setup — Value + Catch stacked. Smaller, muted; reads as premise. */}
          <li className="lg:order-1">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-1 lg:gap-12">
              {ROWS.slice(0, 2).map((row, i) => (
                <div key={row.label} className="border-t border-[#D8E6F5] pt-4">
                  <span className="label-number block" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 text-[15px] font-semibold leading-snug text-slate-900 sm:text-base">
                    {row.label}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-6 text-slate-500 sm:text-[14px] sm:leading-6">
                    {row.body}
                  </p>
                </div>
              ))}
            </div>
          </li>

          {/* Pledge — The fix as a signed commitment, dressed in the same
              glass material as the form widget so the card reads as the
              instrument's philosophical twin. Chris's verbatim prose
              atomized into the three structural clauses it contained. */}
          <li className="lg:order-2">
            <article className="relative flex h-full flex-col rounded-[20px] border border-white/60 bg-white/55 p-6 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:p-7 lg:p-8">
              <span className="label-number block" aria-hidden>
                03
              </span>
              <h3 className="mt-3 text-[24px] font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-[26px] lg:text-[30px]">
                {ROWS[2].label}
              </h3>
              <p className="mt-4 text-[14px] leading-6 text-slate-700 sm:text-[14px] sm:leading-6">
                {ROWS[2].body}
              </p>

              {/* Domain micro-artifact — sample fee-disclosure receipt row
                  that proves the pledge in domain language. Mirrors the
                  WhyThisMatters bill-row pattern: mono label · tabular
                  value · status. Quiet but specific. */}
              <div
                aria-hidden
                className="mt-5 rounded-[10px] border border-white/60 bg-white/45 px-3.5 py-3 backdrop-blur-sm"
                data-temp="fix-card-disclosure-sample"
              >
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">
                  Sample disclosure
                </p>
                <div className="mt-1.5 flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    Broker fee
                  </span>
                  <span className="font-mono text-[12px] tabular-nums text-slate-800">
                    $0.0008 / kWh
                  </span>
                </div>
                <div className="mt-1 flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
                    In writing
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#006bc5]">
                    ✓ On every quote
                  </span>
                </div>
              </div>

            </article>
          </li>
        </ol>
      </div>
    </section>
  );
}
