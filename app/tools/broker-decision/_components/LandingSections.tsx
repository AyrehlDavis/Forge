"use client";

/**
 * Landing-page wrappers around the broker-decision tool.
 * Glass aesthetic continues; arise palette throughout.
 *
 * Content is a draft — needs Warlock review on copy and stakeholder review
 * on any specific claims (years, customers, stats). Generic positioning only.
 */

import { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
 * HERO
 * ────────────────────────────────────────────────────────────────────────── */
/**
 * Hero — asymmetric layout. Left column carries positioning + CTA; right
 * column previews the three possible outcomes as floating glass chips,
 * gently animated. Stacks at <md (chips become a row above the text).
 */
export function LandingHero() {
  return (
    <header className="mb-14 sm:mb-20">
      {/* Top row — asymmetric two-column: text left, floating chips right.
          Left column slightly widened (1.4fr) so "broker?" doesn't orphan
          the question mark onto its own line. */}
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 md:gap-12 items-center">
        <div className="md:order-1 order-2 text-left">
          <p className="text-xs uppercase tracking-[0.18em] font-semibold text-arise-700">
            Forge · Decision Tool · Rapid Prototype v0.1
          </p>
          {/* text-balance lets the browser distribute lines evenly so we don't
              get a single-character orphan on the last line. The "broker?"
              span is wrapped together (with whitespace-nowrap on the inline
              block) so the highlight + "?" stay glued to "broker" — they can
              wrap as a unit but never separate. */}
          <h1 className="mt-3 text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-[1.02] tracking-tight text-balance">
            Should you use an energy{" "}
            {/* Outer span keeps "broker" + "?" as one unbreakable unit so we
                never orphan the "?" onto its own line. Inner span scopes the
                highlight to only the word "broker". */}
            <span className="whitespace-nowrap">
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="v1-highlight-sweep absolute inset-x-0 bottom-[0.08em] h-[0.32em] bg-arise-300/55 rounded-[2px]"
                />
                <span className="relative">broker</span>
              </span>
              ?
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-lg leading-relaxed">
            Five questions. One honest recommendation —{" "}
            <span className="font-semibold text-slate-800">even when it&apos;s &ldquo;skip us.&rdquo;</span>
          </p>
        </div>

        {/* Right column — floating outcome chips. Visual proof of the deliverable
            without showing the tool's mechanics yet. */}
        <div className="md:order-2 order-1 relative h-[200px] md:h-[320px]">
          <OutcomeChip
            label="Use a Broker"
            eyebrow="If your portfolio is complex"
            tone="primary"
            className="absolute left-0 top-2"
            rot={-3}
            delay={0}
          />
          <OutcomeChip
            label="Go Direct"
            eyebrow="If energy cost isn't a priority"
            tone="secondary"
            className="absolute right-0 top-[35%]"
            rot={4}
            delay={800}
          />
          <OutcomeChip
            label="Hybrid"
            eyebrow="If you're somewhere in between"
            tone="tertiary"
            className="absolute left-6 bottom-2"
            rot={-2}
            delay={1600}
          />
        </div>
      </div>

      {/* Bottom row — CTA convergence point. Both columns funnel into one
          centered button + trust line below the hero. */}
      <div className="mt-10 sm:mt-12 flex flex-col items-center gap-3">
        <a
          href="#broker-decision-tool"
          className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-base bg-gradient-to-br from-arise-500 via-arise-600 to-arise-700 text-white shadow-[0_8px_20px_-6px_rgba(28, 138, 239,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_12px_28px_-8px_rgba(28, 138, 239,0.5),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-600 after:content-['↓'] after:ml-1 after:inline-block after:transition-transform after:duration-200 group-hover:after:translate-y-0.5"
        >
          Get my answer
        </a>
        <span className="text-xs text-slate-500">Free · No signup · ~60 seconds</span>
      </div>
    </header>
  );
}

const CHIP_TONE = {
  primary: {
    bg: "from-arise-50/85 via-white/70 to-arise-100/60",
    border: "border-arise-300/60",
    eyebrow: "text-arise-700",
    label: "text-arise-900",
  },
  // Cyan — per Ayrehl, V1 outcome system is blue / cyan / purple to mirror V2.
  secondary: {
    bg: "from-cyan-50/85 via-white/70 to-cyan-100/55",
    border: "border-cyan-300/60",
    eyebrow: "text-cyan-700",
    label: "text-cyan-900",
  },
  tertiary: {
    bg: "from-violet-50/80 via-white/70 to-violet-100/55",
    border: "border-violet-300/60",
    eyebrow: "text-violet-700",
    label: "text-violet-900",
  },
} as const;

function OutcomeChip({
  label,
  eyebrow,
  tone,
  className = "",
  rot = 0,
  delay = 0,
}: {
  label: string;
  eyebrow: string;
  tone: keyof typeof CHIP_TONE;
  className?: string;
  rot?: number;
  delay?: number;
}) {
  const t = CHIP_TONE[tone];
  return (
    <div
      style={
        {
          "--rot": `${rot}deg`,
          "--delay": `${delay}ms`,
        } as React.CSSProperties
      }
      className={`v1-chip-float rounded-2xl border ${t.border} bg-gradient-to-br ${t.bg} backdrop-blur-xl backdrop-saturate-150 px-5 py-3.5 shadow-[0_10px_28px_-12px_rgba(15,23,42,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] ${className}`}
    >
      <p className={`text-[10px] font-semibold uppercase tracking-[0.15em] ${t.eyebrow}`}>
        {eyebrow}
      </p>
      <p className={`mt-1 text-lg sm:text-xl font-bold tracking-tight ${t.label}`}>
        {label}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * OUTCOMES PREVIEW — three cards showing what the user might be told
 * ────────────────────────────────────────────────────────────────────────── */
const OUTCOMES = [
  {
    badge: "Path A",
    title: "Use a broker",
    body: "Multi-site, multi-state, or complex priorities — a broker earns their fee.",
    tone: "primary" as const,
  },
  {
    badge: "Path B",
    title: "Go direct",
    body: "Single site, simple needs, low spend — a broker probably isn't worth it.",
    tone: "secondary" as const,
  },
  {
    badge: "Path C",
    title: "Hybrid approach",
    body: "Mixed portfolio — broker for the complex sites, direct for the simple ones.",
    tone: "tertiary" as const,
  },
];

const TONE_STYLES = {
  primary: "from-arise-50/80 via-white/60 to-white/50 border-arise-300/60",
  secondary: "from-cyan-50/75 via-white/60 to-white/50 border-cyan-300/60",
  tertiary: "from-violet-50/70 via-white/60 to-white/50 border-violet-300/60",
};

const BADGE_STYLES = {
  primary: "bg-arise-100/80 text-arise-800",
  secondary: "bg-cyan-100/80 text-cyan-800",
  tertiary: "bg-violet-100/80 text-violet-800",
};

export function OutcomesPreview() {
  return (
    <section aria-labelledby="outcomes-preview-heading" className="mb-14 sm:mb-20">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          What we&apos;ll tell you
        </p>
        <h2
          id="outcomes-preview-heading"
          className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
        >
          One of three paths — whichever fits your business
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {OUTCOMES.map((o, idx) => (
          <article
            key={o.badge}
            style={{ animationDelay: `${idx * 80}ms` }}
            className={`v1-card-enter relative rounded-2xl border bg-gradient-to-br ${TONE_STYLES[o.tone]} backdrop-blur-xl backdrop-saturate-150 p-6 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]`}
          >
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-[0.18em] ${BADGE_STYLES[o.tone]} rounded-full px-2.5 py-1`}
            >
              {o.badge}
            </span>
            <h3 className="mt-4 text-xl font-bold text-slate-900 tracking-tight">{o.title}</h3>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">{o.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * HOW IT WORKS — schematic flow: three glass orbs connected by a teal gradient
 * line. Each orb holds an inline SVG icon. Replaces the standard 1-2-3 cards
 * marketing pattern with a journey visualization. Stacks vertically at <md.
 * ────────────────────────────────────────────────────────────────────────── */

// Inline icon components — stroke style, no fill, currentColor. Match the
// bare-SVG check pattern established in MultiSelectGroup / SelectionGroup.

function IconList({ className }: { className?: string }) {
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
      <path d="M4 6h13M4 12h13M4 18h13" />
      <circle cx="20" cy="6" r="1" fill="currentColor" />
      <circle cx="20" cy="12" r="1" fill="currentColor" />
      <circle cx="20" cy="18" r="1" fill="currentColor" />
    </svg>
  );
}

function IconCompass({ className }: { className?: string }) {
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
      <path d="M15.5 8.5L13.5 13.5L8.5 15.5L10.5 10.5L15.5 8.5Z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function IconClipboard({ className }: { className?: string }) {
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
      <rect x="5" y="5" width="14" height="16" rx="2" />
      <path d="M9 3h6v4H9z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

const FLOW_STEPS = [
  {
    Icon: IconList,
    title: "Tell us about your business",
    body: "Five questions. Spend, sites, states, priorities, situation.",
  },
  {
    Icon: IconCompass,
    title: "See your recommendation",
    body: "Broker, direct, or hybrid — with the reasoning behind it.",
  },
  {
    Icon: IconClipboard,
    title: "Take the checklist with you",
    body: "Nine questions to ask before you sign anything.",
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="mb-14 sm:mb-20">
      <div className="text-center mb-10 sm:mb-14">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          How it works
        </p>
        <h2
          id="how-it-works-heading"
          className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
        >
          From question to answer in about a minute.
        </h2>
      </div>

      <div className="relative">
        {/* Connecting line — horizontal at md+, vertical at <md.
            SVG with a gradient stroke gives the line color depth that a plain
            border can't. Sits behind the orbs via negative z-index. */}
        <svg
          aria-hidden
          className="hidden md:block absolute left-0 right-0 top-9 w-full h-1 pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 100 1"
        >
          <defs>
            <linearGradient id="flowLineGradient" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#b3d4fa" stopOpacity="0" />
              <stop offset="15%" stopColor="#80bff7" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#007fe8" stopOpacity="1" />
              <stop offset="85%" stopColor="#80bff7" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#b3d4fa" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="url(#flowLineGradient)" strokeWidth="1.5" />
        </svg>

        {/* Vertical connecting line for mobile, sits at the left of the column */}
        <div
          aria-hidden
          className="md:hidden absolute top-12 bottom-12 left-9 w-px bg-gradient-to-b from-arise-200 via-arise-500 to-arise-200 pointer-events-none"
        />

        <ol className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {FLOW_STEPS.map((s, idx) => (
            <li
              key={s.title}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="v1-card-enter relative flex md:flex-col items-start md:items-center gap-4 md:gap-5 md:text-center"
            >
              {/* Orb — glass disc holding the icon */}
              <div className="relative flex-shrink-0 w-[72px] h-[72px] rounded-full bg-gradient-to-br from-white/85 to-arise-50/70 backdrop-blur-xl backdrop-saturate-150 border border-white/70 shadow-[0_6px_20px_-8px_rgba(28, 138, 239,0.25),inset_0_1px_0_rgba(255,255,255,0.95)] flex items-center justify-center text-arise-700">
                <s.Icon className="w-8 h-8" />
              </div>

              {/* Label + body */}
              <div className="flex-1 md:max-w-[260px]">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * FAQ — native <details>/<summary>, no JS needed
 * ────────────────────────────────────────────────────────────────────────── */
const FAQS = [
  {
    q: "Is this really free?",
    a: "Yes. No signup, no card, no fine print. If you want the printable 9 strategies emailed to you, we ask for an email — that's the only point where you'd share anything.",
  },
  {
    q: "Will you sell my email or drip-market me?",
    a: "No. One email with your checklist and your recommendation. That's it.",
  },
  {
    q: "Why is an energy supplier telling me when not to use a broker?",
    a: "We are a supplier — we make money when you sign with us. We're also part of Constellation, which is the largest competitive supplier in the U.S. Telling you the honest answer (even when it's \"go direct\") builds the kind of trust that wins business over time. Bad advice doesn't.",
  },
  {
    q: "How accurate is the recommendation?",
    a: "It's pattern-matching based on your spend, footprint, states, priorities, and current contract situation. Not personalized advice — but a useful starting point. The checklist is the part that travels with you into any sales call.",
  },
  {
    q: "What if my situation doesn't fit any of these?",
    a: "Most don't perfectly. The tool gives you a starting framework, not a final answer. If you want a real conversation, contact us — link below.",
  },
];

export function FaqSection() {
  return (
    <section aria-labelledby="faq-heading" className="mb-14 sm:mb-20">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Common questions
        </p>
        <h2
          id="faq-heading"
          className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
        >
          Before you start
        </h2>
      </div>
      <div className="rounded-2xl border border-white/60 bg-white/55 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] divide-y divide-slate-200/60">
        {FAQS.map((f, i) => (
          <FaqItem key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <details
      className="group px-5 sm:px-6 py-4"
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer list-none flex items-start justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-arise-500 focus-visible:ring-offset-2 rounded">
        <span className="text-base font-semibold text-slate-900">{q}</span>
        <span
          aria-hidden
          className={`flex-shrink-0 mt-1 w-5 h-5 inline-flex items-center justify-center rounded-full bg-arise-100/80 text-arise-700 text-sm font-bold transition-transform duration-200 ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-sm text-slate-700 leading-relaxed pr-9">{a}</p>
    </details>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * FOOTER CTA — for users who want more than a tool
 * ────────────────────────────────────────────────────────────────────────── */
export function FooterCta() {
  return (
    <section aria-labelledby="footer-cta-heading" className="mb-12">
      <div className="rounded-2xl border border-arise-300/50 bg-gradient-to-br from-arise-50/80 via-white/70 to-arise-100/60 backdrop-blur-xl backdrop-saturate-150 p-8 sm:p-10 shadow-[0_12px_36px_-12px_rgba(28, 138, 239,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] text-center">
        <h2
          id="footer-cta-heading"
          className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
        >
          Want a real conversation?
        </h2>
        <p className="mt-3 text-base text-slate-700 max-w-xl mx-auto leading-relaxed">
          The tool gives you a framework. If you want to talk to someone who actually knows the
          market in your state, we&apos;re happy to.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl font-semibold text-base bg-gradient-to-br from-arise-500 via-arise-600 to-arise-700 text-white shadow-[0_6px_16px_-6px_rgba(28, 138, 239,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] hover:shadow-[0_10px_24px_-8px_rgba(28, 138, 239,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 ease-out after:content-['→'] after:ml-1 after:inline-block after:transition-transform after:duration-200 group-hover:after:translate-x-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-600"
          >
            Talk to a real person
          </a>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-slate-700 hover:text-arise-700 underline underline-offset-4 decoration-slate-300 hover:decoration-arise-500 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-500 rounded"
          >
            See current rates
          </a>
        </div>
      </div>
    </section>
  );
}
