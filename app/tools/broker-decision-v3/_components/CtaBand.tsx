export function CtaBand() {
  return (
    <section id="cta" className="px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="relative mx-auto max-w-[1184px] overflow-hidden rounded-[32px] bg-gradient-to-br from-arise-500 via-arise-600 to-arise-700 px-6 py-16 shadow-[0_30px_80px_-20px_rgba(0,127,232,0.45)] sm:px-12 sm:py-20 lg:px-16 lg:py-28">
        {/* Ambient highlight orbs for depth — keeps the slab from reading flat */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 -top-24 h-[360px] w-[360px] rounded-full bg-white/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -bottom-32 h-[420px] w-[420px] rounded-full bg-[var(--arise-electric)]/25 blur-3xl"
        />

        <div className="relative flex flex-col items-start gap-8 text-white lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-2xl">
            {/* Eyebrow dropped per V3.5 typography pass — the H2 imperative
                carries the closing slab without a label. */}
            <h2 className="text-[32px] font-semibold leading-[1.05] tracking-[-0.024em] sm:text-[40px] lg:text-[48px]">
              Let Arise watch the market for you.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
              Send an invoice from each location or a utility login. We pull the details, build your portfolio view, and tell you when it&apos;s time to act.
            </p>
          </div>
          <a
            href="mailto:hello@arise.com"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#006bc5] shadow-[0_14px_32px_-8px_rgba(10,31,31,0.25)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-[0_18px_40px_-10px_rgba(10,31,31,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#007fe8] motion-safe:transition-all"
          >
            Send your invoice
            <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
