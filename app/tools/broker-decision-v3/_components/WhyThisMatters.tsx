const STATS = [
  {
    headline: "Headline rates can hide 20-30%",
    body: "Pass-through charges, broker fees, and renewal terms sit outside the rate you see on the quote.",
    tone: "cyan" as const,
  },
  {
    headline: "A single bad buy day can cost years",
    body: "Locking everything on one market spike compounds across the whole contract term.",
    tone: "indigo" as const,
  },
  {
    headline: "Portfolios change the math",
    body: "Multi-site, mixed-market, or staggered renewals need a different play than a single contract.",
    tone: "primary" as const,
  },
];

const TONES = {
  cyan: { bg: "bg-[#ECFEFF]", label: "text-[#0e7490]" },
  indigo: { bg: "bg-[#EEF0FB]", label: "text-[#4F5CB8]" },
  primary: { bg: "bg-arise-50", label: "text-arise-700" },
} as const;

export function WhyThisMatters() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            Why this matters
          </p>
          <h2 className="mt-4 text-[32px] font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-[40px] lg:text-[48px]">
            The lowest rate can still cost you.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            Three things the headline number doesn&apos;t tell you — and what to do about each.
          </p>
        </div>
        <ol className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3">
          {STATS.map(({ headline, body, tone }, i) => {
            const t = TONES[tone];
            return (
              <li
                key={headline}
                className={`flex flex-col gap-3 rounded-[16px] ${t.bg} p-6 sm:p-7`}
              >
                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] tabular-nums ${t.label}`}
                >
                  0{i + 1}
                </span>
                <h3 className="text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
                  {headline}
                </h3>
                <p className="mt-auto text-sm leading-6 text-slate-700">{body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
