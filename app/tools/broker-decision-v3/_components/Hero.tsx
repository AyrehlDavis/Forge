"use client";

export function Hero() {
  return (
    <section className="relative">
      <div className="relative mx-auto grid max-w-[1184px] grid-cols-12 gap-8 px-5 pb-12 pt-12 sm:px-8 lg:gap-12 lg:pb-16 lg:pt-20">
        <div className="col-span-12 self-center lg:col-span-6">
          {/* Eyebrow dropped per V3.5 typography pass — H1 carries the
              section's identity alone. */}
          <h1
            style={{ animationDelay: "0ms" }}
            className="v3-hero-rise max-w-[600px] text-[40px] font-semibold leading-[1.04] tracking-tight text-slate-900 sm:text-[52px] lg:text-[60px]"
          >
            Should you use an energy broker?
          </h1>
          <p
            style={{ animationDelay: "160ms" }}
            className="v3-hero-rise mt-5 max-w-[540px] text-base leading-7 text-slate-600 sm:text-lg sm:leading-8"
          >
            Answer five questions. See whether to use a broker, go direct, or let Arise watch the market for you.
          </p>
          <div style={{ animationDelay: "240ms" }} className="v3-hero-rise mt-7">
            <a
              href="#broker-check"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#006bc5] transition-colors hover:text-arise-800 focus:outline-none focus-visible:underline motion-safe:transition-all"
            >
              Start the check
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6">
          <HeroArtifact />
        </div>
      </div>
    </section>
  );
}

/**
 * Hero right-column artifact — the 4-possible-paths preview card.
 * Restored per Ayrehl's "I liked the old hero" — kept as-was sans local orbs.
 */
function HeroArtifact() {
  return (
    <div
      aria-hidden
      style={{ animationDelay: "120ms" }}
      className="v3-hero-rise relative mx-auto w-full max-w-[520px] rounded-[20px] border border-white/60 bg-white/55 p-8 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:p-10"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-arise-700">
        Three possible paths
      </p>
      <h3 className="mt-2 text-xl font-semibold leading-snug text-slate-900">
        We&apos;ll route you to one — based on what fits.
      </h3>

      <div className="mt-6 flex flex-col gap-3">
        <PathOrb hint="If your portfolio is complex" label="Use a broker" tone="primary" delay={280} />
        <PathOrb hint="If energy cost isn't a priority" label="Go direct" tone="cyan" delay={360} />
        <PathOrb hint="If you're in a regulated state" label="Regulated market" tone="neutral" delay={440} />
      </div>

      <p className="mt-6 text-xs leading-5 text-slate-500">
        No upsell — you may end up at &ldquo;you don&apos;t need us right now.&rdquo;
      </p>
    </div>
  );
}

const PATH_TONES = {
  primary: {
    border: "border-arise-200",
    eyebrow: "text-arise-700",
  },
  cyan: {
    border: "border-cyan-200",
    eyebrow: "text-[#0e7490]",
  },
  neutral: {
    border: "border-slate-200",
    eyebrow: "text-slate-600",
  },
} as const;

function PathOrb({
  label,
  hint,
  tone,
  delay = 0,
}: {
  label: string;
  hint: string;
  tone: keyof typeof PATH_TONES;
  delay?: number;
}) {
  const t = PATH_TONES[tone];
  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`v3-hero-rise relative overflow-hidden rounded-[12px] border ${t.border} bg-white/65 px-4 py-3 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md`}
    >
      <p className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${t.eyebrow}`}>
        {hint}
      </p>
      <p className="mt-1 text-base font-bold tracking-tight text-slate-900 sm:text-lg">
        {label}
      </p>
    </div>
  );
}
