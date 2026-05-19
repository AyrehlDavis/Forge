import type { ReactNode } from "react";

interface PathDef {
  rank: string;
  label: string;
  blurb: string;
  best: string;
  tone: "primary" | "cyan" | "indigo" | "neutral";
  Icon: (props: { className?: string }) => ReactNode;
}

const PATHS: PathDef[] = [
  {
    rank: "Path A",
    label: "Use a broker",
    blurb:
      "Multi-site, mixed-market, or risk-leaning portfolios — a broker earns its fee.",
    best: "Best when complexity is the main story.",
    tone: "primary",
    Icon: IconBroker,
  },
  {
    rank: "Path B",
    label: "Go direct",
    blurb:
      "Single site, simple needs, low spend — talk to suppliers yourself.",
    best: "Best when the math is straightforward.",
    tone: "cyan",
    Icon: IconDirect,
  },
  {
    rank: "Path C",
    label: "Arise-managed",
    blurb:
      "Send invoices or a utility login. We watch the market and act when the timing fits.",
    best: "Best when you'd rather not chase it.",
    tone: "indigo",
    Icon: IconManaged,
  },
  {
    rank: "Path D",
    label: "Regulated market",
    blurb:
      "No supplier choice in your states — the savings are in tariff and demand.",
    best: "Best when shopping isn't an option.",
    tone: "neutral",
    Icon: IconRegulated,
  },
];

const TONE_STYLES = {
  primary: {
    card: "border-arise-200/70 bg-white",
    rank: "text-arise-700",
    iconBg: "bg-arise-100/80 text-arise-700",
    label: "text-slate-900",
  },
  cyan: {
    card: "border-cyan-200/70 bg-white",
    rank: "text-[#006bc5]",
    iconBg: "bg-cyan-100/80 text-[#0e7490]",
    label: "text-slate-900",
  },
  indigo: {
    card: "border-indigo-200/70 bg-white",
    rank: "text-[#4F5CB8]",
    iconBg: "bg-indigo-100/80 text-[#4F5CB8]",
    label: "text-slate-900",
  },
  neutral: {
    card: "border-slate-200/80 bg-white",
    rank: "text-slate-600",
    iconBg: "bg-slate-100 text-slate-700",
    label: "text-slate-900",
  },
} as const;

export function OutcomePaths() {
  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="relative py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            What you might be told
          </p>
          <h2
            id="outcomes-heading"
            className="mt-3 text-[32px] font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-[40px]"
          >
            Four possible paths. One that fits your business.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            We&apos;ll pick one based on your spend, sites, states, priority, and timing — even when the answer is &ldquo;you don&apos;t need us right now.&rdquo;
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-4">
          {PATHS.map(({ rank, label, blurb, best, tone, Icon }, i) => {
            const t = TONE_STYLES[tone];
            return (
              <li
                key={label}
                style={{ animationDelay: `${i * 80}ms` }}
                className={`v1-card-enter relative flex flex-col gap-4 rounded-[16px] border p-6 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] ${t.card}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${t.iconBg}`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.18em] ${t.rank}`}>
                    {rank}
                  </span>
                </div>
                <div>
                  <h3 className={`text-lg font-semibold leading-snug ${t.label}`}>
                    {label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{blurb}</p>
                </div>
                <p className="mt-auto text-xs italic leading-5 text-slate-500">
                  {best}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function IconBroker({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M9 11h0M15 11h0" />
    </svg>
  );
}

function IconDirect({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 12h12M16 7l5 5-5 5" />
    </svg>
  );
}

function IconManaged({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2.5" />
    </svg>
  );
}

function IconRegulated({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 7h16M4 11h16M4 15h16M4 19h16M8 4l-1.5 3h11L16 4z" />
    </svg>
  );
}
