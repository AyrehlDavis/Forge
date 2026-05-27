// Bottom CTA — advisor-contact pattern. Left-aligned at the page rail to
// match the rest of the section rhythm (eyebrow + H2 + sub-copy + CTA).
// Card chrome removed — the section sits on the page background like every
// other content section. SocialProof above already carries the stat band, so
// we don't repeat proof here; the section can stand on its headline.

export function CtaBand() {
  return (
    <section id="cta" className="py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div className="max-w-[720px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            Talk to an advisor
          </p>
          <h2 className="mt-3 text-balance text-[34px] font-semibold leading-[1.04] tracking-[-0.025em] text-slate-900 sm:text-[44px] lg:text-[52px]">
            Some decisions are worth a{" "}
            <span className="text-[#006bc5]">real conversation</span>.
          </h2>
          <p className="mt-4 max-w-[560px] text-[15px] leading-7 text-slate-600 sm:text-[16px] sm:leading-[1.7]">
            Walk through your specific footprint, supplier options, and timing
            with a real person — by phone or video, whenever works.
          </p>
          <a
            href="https://ariseenergy.com/get-in-touch"
            target="_blank"
            rel="noopener noreferrer"
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
      </div>
    </section>
  );
}
