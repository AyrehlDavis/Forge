"use client";

export function Hero() {
  return (
    <section className="relative">
      <div className="relative mx-auto grid max-w-[1184px] grid-cols-12 gap-8 px-5 pb-12 pt-12 sm:px-8 lg:gap-12 lg:pb-16 lg:pt-20">
        <div className="col-span-12 self-center lg:col-span-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            Energy buying guide · Forge
          </p>
          <h1 className="mt-4 max-w-[600px] text-[40px] font-semibold leading-[1.04] tracking-tight text-slate-900 sm:text-[52px] lg:text-[60px]">
            Should you use an energy broker?
          </h1>
          <p className="mt-5 max-w-[540px] text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
            Answer five questions. See whether to use a broker, go direct, or let Arise watch the market for you.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href="#broker-check"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#006bc5] transition-colors hover:text-arise-800 focus:outline-none focus-visible:underline motion-safe:transition-all"
            >
              Start the check
              <span aria-hidden className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
            </a>
            <span className="hidden h-4 w-px bg-slate-300 sm:block" aria-hidden />
            <span className="text-sm text-slate-500">Free · No signup · ~60 seconds</span>
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
      className="relative mx-auto w-full max-w-[520px] rounded-[20px] border border-white/60 bg-white/55 p-8 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150 sm:p-10"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-arise-700">
        Four possible paths
      </p>
      <h3 className="mt-2 text-xl font-semibold leading-snug text-slate-900">
        We&apos;ll route you to one — based on what fits.
      </h3>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <PathOrb rank="A" label="Use a broker" hint="Complex portfolio" tone="primary" />
        <PathOrb rank="B" label="Go direct" hint="Simple setup" tone="cyan" />
        <PathOrb rank="C" label="Arise-managed" hint="Market watch" tone="indigo" />
        <PathOrb rank="D" label="Regulated" hint="Tariff strategy" tone="neutral" />
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
    rank: "bg-arise-600 text-white",
    label: "text-slate-900",
  },
  cyan: {
    border: "border-cyan-200",
    rank: "bg-[#0e7490] text-white",
    label: "text-slate-900",
  },
  indigo: {
    border: "border-indigo-200",
    rank: "bg-[#4F5CB8] text-white",
    label: "text-slate-900",
  },
  neutral: {
    border: "border-slate-200",
    rank: "bg-slate-600 text-white",
    label: "text-slate-900",
  },
} as const;

function PathOrb({
  rank,
  label,
  hint,
  tone,
}: {
  rank: string;
  label: string;
  hint: string;
  tone: keyof typeof PATH_TONES;
}) {
  const t = PATH_TONES[tone];
  return (
    <div
      className={`relative overflow-hidden rounded-[12px] border ${t.border} bg-white/65 p-3 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-md`}
    >
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${t.rank}`}
        >
          {rank}
        </span>
        <div className="min-w-0">
          <p className={`text-sm font-semibold leading-snug ${t.label}`}>{label}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-500">{hint}</p>
        </div>
      </div>
    </div>
  );
}
