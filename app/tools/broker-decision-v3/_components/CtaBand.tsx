// Bottom CTA — advisor-contact pattern per Chris's request.
// Glass-card aesthetic matching the V3 form's translucent white surface +
// backdrop blur + soft inset highlight. Composition reimagined as a single
// centered moment: eyebrow → display headline → body → filled CTA → quiet
// proof row. Headline is the visual peak; everything else falls in line
// behind it. No nested chips, no 2-col grid — the moment carries the
// weight, the glass carries the atmosphere.

const PROOF_POINTS = [
  "700+ businesses served",
  "20+ supplier relationships",
  "Real advisors, not bots",
];

export function CtaBand() {
  return (
    <section id="cta" className="px-5 py-14 sm:px-8 sm:py-20 lg:py-24">
      <div className="relative mx-auto max-w-[1184px]">
        {/* Ambient glow behind the glass — gives the blur something to work
            against so the card actually reads as frosted, not just translucent. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-1/3 top-0 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-arise-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-[200px] w-[200px] rounded-full bg-arise-100/50 blur-3xl" />
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-white/60 bg-white/55 px-7 py-14 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:px-12 sm:py-20 lg:px-20 lg:py-24">
          <div className="mx-auto max-w-[640px] text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
              Talk to an advisor
            </p>
            <h2 className="mt-4 text-balance text-[34px] font-semibold leading-[1.04] tracking-[-0.025em] text-slate-900 sm:text-[44px] lg:text-[52px]">
              Some decisions are worth a{" "}
              <span className="text-[#006bc5]">real conversation</span>.
            </h2>
            <p className="mx-auto mt-5 max-w-[520px] text-[16px] leading-[1.6] text-slate-600 sm:text-[17px]">
              Walk through your specific footprint, supplier options, and
              timing with a real person — by phone or video, whenever works.
            </p>
            <a
              href="mailto:hello@arise.com"
              className="group mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-[#006bc5] px-7 text-[15px] font-semibold text-white shadow-[0_6px_20px_-4px_rgba(0,107,197,0.45)] transition-colors hover:bg-[#0058a3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2"
            >
              Talk to an advisor
              <span
                aria-hidden
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </div>

          {/* Proof row — quiet horizontal trio. Dots as separators, no chrome,
              centered under the moment. */}
          <ul className="relative mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] text-slate-500 sm:mt-12 sm:gap-x-5">
            {PROOF_POINTS.map((point, i) => (
              <li
                key={point}
                className="flex items-center gap-3 sm:gap-5"
              >
                {i > 0 && (
                  <span
                    aria-hidden
                    className="h-1 w-1 rounded-full bg-slate-300"
                  />
                )}
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
