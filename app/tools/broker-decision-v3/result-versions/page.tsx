import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Result card · 5 design directions | Arise V3",
  description:
    "Side-by-side exploration of five visual treatments for the V3 result card.",
  robots: { index: false, follow: false },
};

// Shared sample data — Track A · Texas · $100K-$500K · 11-50 sites · Balanced
// · Renewal soon. Locked across all 5 versions so the variable is treatment,
// not content.
const DATA = {
  trackLabel: "Use a broker",
  metadata: "TRACK A · ERCOT · RENEWAL WINDOW",
  headline:
    "For $100K–$500K across 11–50 sites in Texas, a broker earns its keep.",
  timingChip: "Urgent before your renewal window opens.",
  hours: 75,
  workingDays: 9,
  caption:
    "Broker research, supplier calls, and quote comparison you don't need to start from scratch.",
  reasons: [
    {
      label: "11–50 sites means real negotiation leverage",
      body: "A broker turns that volume into supplier competition you can't easily run yourself.",
    },
    {
      label: "Timing and contract structure matter at this spend level",
      body: "A broker tracks the curves and structures the contract so you're not exposed to bad timing.",
    },
    {
      label: "Total cost is the right comparison — not the headline rate",
      body: "Brokers who show their fee math and the all-in number are the ones worth hiring.",
    },
  ],
  presumptiveClose:
    "Given you want a fair price without buying at the wrong time, we'd start with your invoices, current contracts, and usage data. Arise can help build that picture: sites, dates, load, contract terms, market timing. Then we'd compare brokers on total cost, fee clarity, supplier reach, and monitoring plan — not just the first rate shown.",
  cta: "Compare brokers",
  meetingKit: {
    title: "9 broker questions + score grid",
    body: "A one-page call worksheet — good answers, red flags, and space to score three brokers.",
    chips: ["Texas", "Open market", "$100K–$500K", "Renewal soon", "11–50 sites", "Balanced"],
  },
  sourceStamp: "Generated from 5 inputs · Texas open market · May 20, 2026",
};

export default function ResultVersionsPage() {
  return (
    <div className="min-h-screen bg-slate-100/60 py-16">
      <div className="mx-auto max-w-[820px] px-6">
        <header className="mb-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Internal exploration · not for production
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Result card · 5 directions
          </h1>
          <p className="mt-2 max-w-[640px] text-sm leading-6 text-slate-600">
            Same data across all five. Variable is the visual treatment.
            Sample inputs: Track A · Texas · $100K–$500K · 11–50 sites ·
            Balanced · Renewal soon.
          </p>
        </header>

        <div className="space-y-16">
          <VersionLabel
            n={1}
            name="Editorial magazine"
            note="Stripe / Linear anchor. Generous whitespace, single column, typography carries the moment. Brand color as accent only."
          />
          <V1Editorial />

          <VersionLabel
            n={2}
            name="Operating document"
            note="McKinsey / Bain anchor. Hairline grid, mono on data, numbered sections, footnoted sources. Conservative."
          />
          <V2OperatingDoc />

          <VersionLabel
            n={3}
            name="SaaS dashboard"
            note="Vercel / Notion anchor. Modular cards, dense info, brand color as signature. Stat as KPI with mini-viz."
          />
          <V3SaasDashboard />

          <VersionLabel
            n={4}
            name="Conversational"
            note="Wealthfront / Robinhood anchor. Friendly framing, big numbers, soft brand washes, story over data."
          />
          <V4Conversational />

          <VersionLabel
            n={5}
            name="Receipt / artifact"
            note="Stripe receipt / DocuSign anchor. Vertical document, mono throughout, structured rows, reads as a finalized deliverable."
          />
          <V5Receipt />

          <VersionLabel
            n={6}
            name="Expert recommendation (editorial)"
            note="McKinsey one-pager / wine sommelier card / museum label anchor. Asymmetric magazine layout. Single display moment for the verdict. Numbered argument. Signed-off recommendation block. Restraint as a design choice."
          />
          <V6Editorial />

          <VersionLabel
            n={7}
            name="Arise personality"
            note="Match the live ariseenergy.com brand: sentence-case headline with key phrase highlighted in brand blue, ONE flowing card (no nested mini-cards), filled blue primary CTA, conversational direct tone. The brand's actual voice."
          />
          <V7Arise />
        </div>
      </div>
    </div>
  );
}

function VersionLabel({
  n,
  name,
  note,
}: {
  n: number;
  name: string;
  note: string;
}) {
  return (
    <div className="flex items-baseline gap-3 border-b border-slate-300 pb-3">
      <span className="font-mono text-sm font-medium text-slate-400 tabular-nums">
        V{n}
      </span>
      <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
      <p className="text-xs leading-5 text-slate-500">{note}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * V1 — Editorial magazine
 * Anchor: Stripe / Linear. The recommendation reads as an article.
 * No chrome, no nested cards. Big editorial display headline. Reasons render
 * as a numbered editorial list with hanging numerals. Brand color shows up
 * only in eyebrows + the single CTA link.
 * ═══════════════════════════════════════════════════════════════════════════ */
function V1Editorial() {
  return (
    <article className="overflow-hidden rounded-[12px] border border-slate-200 bg-white">
      <div className="px-10 py-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {DATA.metadata}
        </p>
        <h2 className="mt-6 text-[56px] font-semibold leading-[0.98] tracking-[-0.025em] text-slate-900">
          {DATA.trackLabel}.
        </h2>
        <p className="mt-6 max-w-[560px] text-[17px] leading-[1.55] text-slate-600">
          {DATA.headline}
        </p>
      </div>

      <div className="border-t border-slate-100 px-10 py-10">
        <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6">
          <div>
            <span className="text-[12px] uppercase tracking-[0.18em] text-slate-500">
              Decision time saved
            </span>
            <p className="mt-2 text-[72px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-slate-900">
              ~{DATA.hours}
              <span className="text-[28px] font-normal text-slate-400">
                {" "}
                hrs
              </span>
            </p>
          </div>
          <span className="text-[14px] text-slate-500">
            ≈ {DATA.workingDays} working days
          </span>
        </div>
        <p className="mt-4 max-w-[560px] text-[14px] leading-[1.65] text-slate-600">
          {DATA.caption}
        </p>
      </div>

      <div className="border-t border-slate-100 px-10 py-10">
        <ol className="space-y-6">
          {DATA.reasons.map((r, i) => (
            <li key={i} className="grid grid-cols-[40px_1fr] gap-x-5">
              <span className="font-mono text-[14px] tabular-nums text-slate-300">
                0{i + 1}
              </span>
              <p className="text-[16px] leading-[1.55] text-slate-700">
                <span className="font-semibold text-slate-900">
                  {r.label}.
                </span>{" "}
                {r.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-slate-100 px-10 py-10">
        <p className="text-[12px] uppercase tracking-[0.18em] text-[#006bc5]">
          What we&apos;d do
        </p>
        <p className="mt-4 max-w-[560px] text-[16px] leading-[1.65] text-slate-700">
          {DATA.presumptiveClose}
        </p>
        <a
          href="#"
          className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#006bc5] underline-offset-[6px] hover:underline"
        >
          {DATA.cta}
          <span aria-hidden>→</span>
        </a>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/60 px-10 py-8">
        <p className="text-[12px] uppercase tracking-[0.18em] text-[#006bc5]">
          Your meeting kit
        </p>
        <h3 className="mt-3 text-[20px] font-semibold leading-snug text-slate-900">
          {DATA.meetingKit.title} + Texas market snapshot
        </h3>
        <p className="mt-2 max-w-[560px] text-[14px] leading-[1.55] text-slate-600">
          {DATA.meetingKit.body}
        </p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {DATA.meetingKit.chips.map((c) => (
            <li
              key={c}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-[11px] text-slate-600"
            >
              {c}
            </li>
          ))}
        </ul>
        <form className="mt-5 flex gap-2">
          <input
            type="email"
            placeholder="name@company.com"
            className="flex-1 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-[14px] placeholder:text-slate-400"
          />
          <button className="rounded-[8px] bg-slate-900 px-4 text-[13px] font-semibold text-white">
            Send me the kit
          </button>
        </form>
      </div>

      <div className="border-t border-slate-100 px-10 py-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
          {DATA.sourceStamp}
        </p>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * V2 — Operating document
 * Anchor: McKinsey / Bain consulting deliverable. Conservative, hairline
 * grid, mono everywhere data appears, footnoted citations. Reads as a
 * print-ready brief. Restrained palette: slate + single brand accent on
 * section dividers.
 * ═══════════════════════════════════════════════════════════════════════════ */
function V2OperatingDoc() {
  return (
    <article className="overflow-hidden border border-slate-300 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      {/* Document header — like a McKinsey insight PDF */}
      <div className="border-b-2 border-slate-900 px-8 py-5">
        <div className="flex items-baseline justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-700">
            Forge · Arise Energy
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
            Decision brief · May 20, 2026
          </p>
        </div>
      </div>

      <div className="px-8 py-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
          § 1 · Recommendation
        </p>
        <h2 className="mt-3 text-[36px] font-semibold leading-[1.05] tracking-tight text-slate-900">
          {DATA.trackLabel}.
        </h2>
        <p className="mt-3 max-w-[560px] text-[14px] leading-[1.6] text-slate-700">
          {DATA.headline}
        </p>
      </div>

      <div className="border-t border-slate-200 px-8 py-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
          § 2 · Estimated saving
        </p>
        <table className="mt-3 w-full border-collapse text-[14px]">
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 text-slate-600">
                Decision time saved
              </td>
              <td className="py-2.5 text-right font-mono font-semibold tabular-nums text-slate-900">
                ~{DATA.hours} hrs
              </td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-2.5 pr-4 text-slate-600">
                Working-day equivalent
              </td>
              <td className="py-2.5 text-right font-mono tabular-nums text-slate-900">
                ≈ {DATA.workingDays} days
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 text-slate-600">Scope</td>
              <td className="py-2.5 text-right text-slate-700">
                Research, sourcing, comparison
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-200 px-8 py-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
          § 3 · Reasoning
        </p>
        <ol className="mt-3 space-y-3">
          {DATA.reasons.map((r, i) => (
            <li key={i} className="grid grid-cols-[32px_1fr] gap-x-3">
              <span className="font-mono text-[12px] font-semibold tabular-nums text-slate-900">
                3.{i + 1}
              </span>
              <p className="text-[14px] leading-[1.55] text-slate-700">
                <span className="font-semibold text-slate-900">
                  {r.label}.
                </span>{" "}
                {r.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 px-8 py-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
          § 4 · Recommended next step
        </p>
        <p className="mt-3 max-w-[560px] text-[14px] leading-[1.6] text-slate-700">
          {DATA.presumptiveClose}
        </p>
        <button className="mt-5 inline-flex items-center border border-slate-900 bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-slate-900 hover:bg-slate-900 hover:text-white">
          {DATA.cta}
          <span aria-hidden className="ml-2">
            →
          </span>
        </button>
      </div>

      <div className="border-t border-slate-200 px-8 py-7">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
          § 5 · Accompanying materials
        </p>
        <p className="mt-3 text-[14px] font-semibold text-slate-900">
          {DATA.meetingKit.title} + Texas market snapshot
        </p>
        <p className="mt-1 text-[13px] leading-[1.55] text-slate-600">
          {DATA.meetingKit.body}
        </p>
        <form className="mt-4 flex gap-2">
          <input
            type="email"
            placeholder="name@company.com"
            className="flex-1 border border-slate-300 bg-white px-3 py-2 text-[13px] font-mono placeholder:text-slate-400"
          />
          <button className="border border-slate-900 bg-slate-900 px-4 text-[12px] font-semibold uppercase tracking-[0.12em] text-white hover:bg-slate-800">
            Send
          </button>
        </form>
      </div>

      <div className="border-t-2 border-slate-900 px-8 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">
          Source: {DATA.sourceStamp} · Method: Forge V3 decision engine
        </p>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * V3 — SaaS dashboard
 * Anchor: Vercel / Notion. Modular cards in a tight grid. Brand-color as
 * the visual signature on the KPI card. Reasons as 3 mini-cards horizontally.
 * Reads as a dashboard view, not a document.
 * ═══════════════════════════════════════════════════════════════════════════ */
function V3SaasDashboard() {
  return (
    <article className="overflow-hidden rounded-[14px] border border-slate-200 bg-slate-50/50 p-3 shadow-[0_2px_8px_rgba(15,23,42,0.04)]">
      {/* Top recommendation card */}
      <div className="rounded-[10px] border border-slate-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-arise-50 px-2 py-0.5 text-[11px] font-semibold text-[#006bc5]">
                Track A
              </span>
              <span className="text-[11px] text-slate-500">
                ERCOT · Renewal window
              </span>
            </div>
            <h2 className="mt-3 text-[28px] font-semibold leading-tight tracking-tight text-slate-900">
              {DATA.trackLabel}
            </h2>
            <p className="mt-2 max-w-[480px] text-[14px] leading-relaxed text-slate-600">
              {DATA.headline}
            </p>
          </div>
          <button className="shrink-0 rounded-[8px] bg-[#006bc5] px-4 py-2 text-[13px] font-semibold text-white shadow-[0_1px_2px_rgba(0,107,197,0.3)] hover:bg-[#0058a3]">
            {DATA.cta}
          </button>
        </div>
      </div>

      {/* Stat KPI card with mini-viz */}
      <div className="mt-3 rounded-[10px] border border-[#006bc5]/20 bg-gradient-to-br from-arise-50/60 to-white p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#006bc5]">
              Decision time saved
            </p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-[44px] font-semibold leading-none tracking-tight tabular-nums text-[#006bc5]">
                ~{DATA.hours}
              </span>
              <span className="text-[16px] font-medium text-slate-500">
                hours
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">
              ≈ working days
            </p>
            <p className="mt-1 text-[28px] font-semibold leading-none tabular-nums text-slate-900">
              {DATA.workingDays}
            </p>
          </div>
        </div>
        {/* Mini sparkline-ish visualization */}
        <div className="mt-5 flex items-end gap-1 h-6">
          {[18, 24, 32, 40, 48, 56, 62, 68, 72, 75].map((h, i) => (
            <div
              key={i}
              style={{ height: `${(h / 75) * 100}%`, width: "10%" }}
              className={`rounded-sm ${i === 9 ? "bg-[#006bc5]" : "bg-[#006bc5]/30"}`}
            />
          ))}
        </div>
        <p className="mt-3 text-[12px] leading-snug text-slate-600">
          {DATA.caption}
        </p>
      </div>

      {/* 3 reasons as horizontal mini-cards */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        {DATA.reasons.map((r, i) => (
          <div
            key={i}
            className="rounded-[10px] border border-slate-200 bg-white p-4"
          >
            <span className="text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-[#006bc5]">
              0{i + 1} · Why
            </span>
            <p className="mt-2 text-[13px] font-semibold leading-snug text-slate-900">
              {r.label}.
            </p>
            <p className="mt-1.5 text-[12px] leading-[1.55] text-slate-600">
              {r.body}
            </p>
          </div>
        ))}
      </div>

      {/* Presumptive close card */}
      <div className="mt-3 rounded-[10px] border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#006bc5] text-[11px] font-bold text-white">
            A
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#006bc5]">
            What we&apos;d do
          </span>
        </div>
        <p className="mt-3 max-w-[560px] text-[14px] leading-relaxed text-slate-700">
          {DATA.presumptiveClose}
        </p>
      </div>

      {/* Meeting kit card */}
      <div className="mt-3 rounded-[10px] border border-slate-200 bg-white p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#006bc5]">
          Your meeting kit
        </p>
        <h3 className="mt-2 text-[16px] font-semibold leading-snug text-slate-900">
          {DATA.meetingKit.title} + Texas market snapshot
        </h3>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {DATA.meetingKit.chips.map((c) => (
            <li
              key={c}
              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700"
            >
              {c}
            </li>
          ))}
        </ul>
        <form className="mt-4 flex gap-2">
          <input
            type="email"
            placeholder="name@company.com"
            className="flex-1 rounded-[8px] border border-slate-200 bg-white px-3 py-2 text-[14px] placeholder:text-slate-400"
          />
          <button className="rounded-[8px] bg-[#006bc5] px-4 text-[13px] font-semibold text-white hover:bg-[#0058a3]">
            Get the kit
          </button>
        </form>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * V4 — Conversational
 * Anchor: Wealthfront. Soft, friendly, story-first. Big bold numbers paired
 * with conversational sentences. Brand color shows up in soft washes, not
 * hard chrome. Reads like a financial planning summary.
 * ═══════════════════════════════════════════════════════════════════════════ */
function V4Conversational() {
  return (
    <article className="overflow-hidden rounded-[20px] bg-gradient-to-b from-arise-50/40 via-white to-white">
      <div className="px-10 py-12">
        <p className="text-[14px] leading-relaxed text-slate-500">
          Here&apos;s what we&apos;d suggest.
        </p>
        <h2 className="mt-4 text-[64px] font-semibold leading-[0.95] tracking-[-0.025em] text-slate-900">
          {DATA.trackLabel}.
        </h2>
        <p className="mt-6 max-w-[520px] text-[18px] leading-[1.55] text-slate-600">
          You&apos;ve got 11–50 sites across Texas and a renewal window opening
          in the next 6 months. At that scale, a broker earns its keep.
        </p>
      </div>

      <div className="bg-arise-50/50 px-10 py-12">
        <p className="text-[14px] text-slate-600">
          That decision gets you back
        </p>
        <p className="mt-3 text-[88px] font-semibold leading-none tracking-[-0.03em] tabular-nums text-[#006bc5]">
          ~{DATA.hours} hours
        </p>
        <p className="mt-3 max-w-[480px] text-[16px] leading-relaxed text-slate-700">
          About {DATA.workingDays} working days of broker research, supplier
          calls, and quote comparison — we&apos;d be doing the heavy lifting
          for you.
        </p>
      </div>

      <div className="px-10 py-12">
        <p className="text-[16px] leading-relaxed text-slate-700">
          Here&apos;s why this is the right call:
        </p>
        <ol className="mt-5 space-y-5">
          {DATA.reasons.map((r, i) => (
            <li
              key={i}
              className="rounded-[14px] bg-slate-50 px-5 py-4 text-[15px] leading-[1.55] text-slate-700"
            >
              <span className="text-[13px] font-semibold text-[#006bc5]">
                Reason {i + 1}.
              </span>{" "}
              <span className="font-semibold text-slate-900">{r.label}.</span>{" "}
              {r.body}
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-slate-50 px-10 py-12">
        <p className="text-[18px] font-semibold text-slate-900">
          So — what would we actually do?
        </p>
        <p className="mt-4 max-w-[560px] text-[15px] leading-[1.65] text-slate-700">
          {DATA.presumptiveClose}
        </p>
        <button className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#006bc5] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_4px_16px_rgba(0,107,197,0.25)] hover:bg-[#0058a3]">
          {DATA.cta}
          <span aria-hidden>→</span>
        </button>
      </div>

      <div className="px-10 py-12">
        <p className="text-[14px] text-slate-500">
          We made you a worksheet.
        </p>
        <h3 className="mt-3 text-[24px] font-semibold leading-snug tracking-tight text-slate-900">
          {DATA.meetingKit.title}
        </h3>
        <p className="mt-2 max-w-[520px] text-[15px] leading-relaxed text-slate-600">
          One page, nine questions, three columns to score brokers as they
          answer. Plus a Texas market snapshot so you&apos;ve got context
          numbers in your hip pocket.
        </p>
        <form className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            placeholder="name@company.com"
            className="flex-1 rounded-[10px] border border-slate-200 bg-white px-4 py-3 text-[15px] placeholder:text-slate-400"
          />
          <button className="rounded-[10px] bg-slate-900 px-5 py-3 text-[14px] font-semibold text-white hover:bg-slate-800">
            Send it to me
          </button>
        </form>
        <p className="mt-3 text-[12px] text-slate-500">
          One email. No drip-marketing. Reply if you want help with the numbers.
        </p>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * V5 — Receipt / artifact
 * Anchor: Stripe receipt / DocuSign / Apple invoice. Mono throughout.
 * Structured rows like a finalized e-doc. Reads as an artifact you'd save
 * to your inbox or print and file. No filled buttons — terminal-style links.
 * ═══════════════════════════════════════════════════════════════════════════ */
function V5Receipt() {
  return (
    <article className="overflow-hidden rounded-[6px] border border-slate-300 bg-white font-mono">
      {/* Doc header */}
      <div className="border-b border-dashed border-slate-300 px-6 py-5">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-900">
            ARISE ENERGY · FORGE
          </p>
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
            DOC-FORGE-2026-0520
          </p>
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
          Energy decision · v1.0 · May 20, 2026
        </p>
      </div>

      {/* Inputs table */}
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Inputs
        </p>
        <table className="mt-3 w-full text-[12px]">
          <tbody className="divide-y divide-slate-100">
            {[
              ["Portfolio", "11–50 sites"],
              ["States", "Texas"],
              ["Spend tier", "$100K–$500K"],
              ["Priority", "Balanced"],
              ["Situation", "Renewal in the next 6 months"],
            ].map(([k, v]) => (
              <tr key={k}>
                <td className="py-2 pr-4 uppercase tracking-[0.12em] text-slate-500">
                  {k}
                </td>
                <td className="py-2 text-right tabular-nums text-slate-900">
                  {v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendation */}
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Recommendation
        </p>
        <div className="mt-3 flex items-baseline justify-between border-y border-slate-900 py-3">
          <p className="font-sans text-[24px] font-semibold tracking-tight text-slate-900">
            {DATA.trackLabel}
          </p>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            TRACK A
          </p>
        </div>
        <p className="mt-3 font-sans text-[13px] leading-[1.6] text-slate-700">
          {DATA.headline}
        </p>
      </div>

      {/* Time saved */}
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Decision time saved
        </p>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-[36px] font-semibold leading-none tracking-tight tabular-nums text-slate-900">
            ~{DATA.hours} hrs
          </p>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            ≈ {DATA.workingDays} working days
          </p>
        </div>
      </div>

      {/* Reasoning */}
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Reasoning
        </p>
        <ol className="mt-3 space-y-2">
          {DATA.reasons.map((r, i) => (
            <li key={i} className="grid grid-cols-[24px_1fr] gap-x-2 text-[12px]">
              <span className="tabular-nums text-slate-500">[{i + 1}]</span>
              <p className="font-sans leading-[1.55] text-slate-700">
                <span className="font-semibold text-slate-900">
                  {r.label}.
                </span>{" "}
                {r.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Next steps */}
      <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          What we&apos;d do
        </p>
        <p className="mt-3 font-sans text-[13px] leading-[1.6] text-slate-700">
          {DATA.presumptiveClose}
        </p>
        <a
          href="#"
          className="mt-4 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#006bc5] hover:underline"
        >
          → {DATA.cta}
        </a>
      </div>

      {/* Meeting kit */}
      <div className="border-b border-slate-200 px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
          Accompanying kit
        </p>
        <p className="mt-2 text-[12px] uppercase tracking-[0.12em] text-slate-900">
          {DATA.meetingKit.title.toUpperCase()}
        </p>
        <p className="mt-1 font-sans text-[12px] leading-[1.6] text-slate-600">
          {DATA.meetingKit.body}
        </p>
        <form className="mt-3 flex gap-1">
          <input
            type="email"
            placeholder="name@company.com"
            className="flex-1 border border-slate-300 bg-white px-2 py-1.5 text-[12px] placeholder:text-slate-400"
          />
          <button className="border border-slate-900 bg-white px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-900 hover:bg-slate-900 hover:text-white">
            → Send
          </button>
        </form>
      </div>

      {/* Footer */}
      <div className="border-t border-dashed border-slate-300 px-6 py-4">
        <p className="text-[9px] uppercase tracking-[0.16em] text-slate-500">
          {DATA.sourceStamp} · END OF DOCUMENT
        </p>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * V6 — Expert recommendation (editorial)
 *
 * Concept: a typographic decision artifact in the spirit of a McKinsey
 * one-pager, a wine sommelier's note, a museum exhibit label. The verdict
 * is the only display moment. Everything else is supporting evidence
 * rendered with restraint.
 *
 * Compositional logic:
 * - Slim institutional header (mono ref + metadata, like letterhead)
 * - Hero: asymmetric 2-col at lg — verdict + deck on the left (2/3), stat
 *   callout on the right (1/3) as a magazine pull-quote
 * - Numbered argument with hanging slate-300 mono numerals
 * - Recommendation as a signed-off quote block (italic attribution)
 * - One CTA button at proper weight
 * - Meeting kit as a P.S. appendix
 * - Colophon-style source stamp bottom-right
 *
 * Typographic discipline:
 * - Display: 80–96px semibold tracking-[-0.04em]
 * - Deck: 18–20px italic slate-500
 * - Body: 15–16px slate-600 leading-relaxed
 * - Mono on reference number + colophon only
 *
 * Color discipline:
 * - Three values: slate-900, slate-500, #006bc5
 * - White surface, slate-200 hairlines only
 * - No fills, no gradients, no shadows
 * ═══════════════════════════════════════════════════════════════════════════ */
function V6Editorial() {
  return (
    <article className="overflow-hidden border border-slate-200 bg-white">
      {/* Institutional letterhead */}
      <div className="flex items-baseline justify-between gap-4 border-b border-slate-200 px-10 py-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
          DOC · FORGE · 2026-0520
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
          TX · ERCOT · 11–50 sites · Renewal window
        </p>
      </div>

      {/* Hero: asymmetric — verdict left (2/3), stat callout right (1/3) */}
      <div className="px-10 pb-14 pt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1fr] lg:gap-16">
          <div>
            <span
              aria-hidden
              className="inline-block h-1 w-12 bg-[#006bc5]"
            />
            <h2 className="mt-5 text-[64px] font-semibold leading-[0.94] tracking-[-0.035em] text-slate-900 sm:text-[80px] lg:text-[96px]">
              {DATA.trackLabel}.
            </h2>
            <p className="mt-6 max-w-[440px] font-serif text-[18px] leading-[1.55] text-slate-500 lg:text-[20px]">
              <em>{DATA.headline}</em>
            </p>
          </div>

          {/* Featured stat callout — magazine pull-quote */}
          <aside className="lg:pt-3">
            <div className="border-l-2 border-slate-200 pl-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Decision time saved
              </p>
              <p className="mt-3 flex items-baseline gap-1 text-slate-900">
                <span className="text-[72px] font-semibold leading-none tracking-[-0.035em] tabular-nums">
                  ~{DATA.hours}
                </span>
                <span className="text-[16px] font-medium text-slate-500">
                  hrs
                </span>
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
                ≈ {DATA.workingDays} working days of broker research, supplier
                calls, and quote comparison.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Numbered argument */}
      <div className="border-t border-slate-200 px-10 py-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
          The argument
        </p>
        <ol className="mt-6 space-y-6">
          {DATA.reasons.map((r, i) => (
            <li
              key={i}
              className="grid grid-cols-[44px_1fr] gap-x-5 lg:grid-cols-[60px_1fr] lg:gap-x-6"
            >
              <span className="font-mono text-[14px] tabular-nums text-slate-300">
                0{i + 1}
              </span>
              <p className="text-[16px] leading-[1.55] text-slate-600">
                <span className="font-semibold text-slate-900">
                  {r.label}.
                </span>{" "}
                {r.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Recommendation — signed-off quote block */}
      <div className="border-t border-slate-200 px-10 py-10">
        <blockquote className="border-l-2 border-[#006bc5] pl-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            Recommended next move
          </p>
          <p className="mt-4 max-w-[600px] text-[16px] leading-[1.65] text-slate-700">
            {DATA.presumptiveClose}
          </p>
          <p className="mt-5 font-serif text-[14px] italic text-slate-500">
            — The Arise market team
          </p>
        </blockquote>
        <div className="mt-7">
          <button className="inline-flex items-center gap-2 rounded-[4px] bg-[#006bc5] px-6 py-3 text-[14px] font-semibold text-white hover:bg-[#0058a3]">
            {DATA.cta}
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      {/* P.S. — meeting kit appendix */}
      <div className="border-t border-slate-200 px-10 py-10">
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[80px_1fr] lg:gap-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
            P.S.
          </p>
          <div>
            <p className="text-[15px] leading-[1.6] text-slate-700">
              Take the kit to your next call:{" "}
              <span className="font-semibold text-slate-900">
                {DATA.meetingKit.title}
              </span>
              , prepared for your portfolio.
            </p>
            <form className="mt-4 flex max-w-[440px] gap-2">
              <input
                type="email"
                placeholder="name@company.com"
                className="flex-1 rounded-[4px] border border-slate-200 bg-white px-3 py-2 text-[14px] placeholder:text-slate-400 focus:border-[#006bc5] focus:outline-none"
              />
              <button className="rounded-[4px] border border-slate-900 bg-white px-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-900 hover:bg-slate-900 hover:text-white">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Colophon — bottom-right source stamp like a magazine masthead */}
      <div className="border-t border-slate-200 px-10 py-5 text-right">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-400">
          {DATA.sourceStamp}
        </p>
      </div>
    </article>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
 * V7 — Arise personality (the right vibe)
 *
 * Concept: V3's basic structure, but stripped of nested cards and rewritten
 * in Arise Energy's actual brand voice — sentence-case headlines with key
 * phrases highlighted in brand blue (per the live ariseenergy.com pattern
 * "The biggest driver of electricity costs is **when you buy**."), one
 * flowing white card, filled blue primary CTA, conversational tone.
 *
 * No nested cards. No uppercase eyebrows. No mini-cards-in-a-row.
 * Brand blue does one job: highlight key phrases + the primary CTA.
 * ═══════════════════════════════════════════════════════════════════════════ */
function V7Arise() {
  return (
    <article className="overflow-hidden rounded-[14px] border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
      <div className="px-8 py-9 sm:px-10 sm:py-10">
        {/* Hero — sentence-case headline with brand blue accent phrase */}
        <p className="text-[13px] text-slate-500">
          Your recommendation
        </p>
        <h2 className="mt-3 text-[36px] font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-[40px]">
          For 11–50 sites in Texas,{" "}
          <span className="text-[#006bc5]">use a broker</span>.
        </h2>
        <p className="mt-3 max-w-[560px] text-[16px] leading-[1.55] text-slate-600">
          At $100K–$500K across that footprint, a broker earns its keep —
          and your renewal window is opening soon.
        </p>

        {/* Stat — flowing, no card chrome. Big number + inline qualifier. */}
        <div className="mt-9 flex items-baseline gap-3">
          <span className="text-[64px] font-semibold leading-none tracking-[-0.025em] tabular-nums text-[#006bc5]">
            ~{DATA.hours}
          </span>
          <span className="text-[20px] font-medium text-slate-700">
            hours back
          </span>
        </div>
        <p className="mt-2 text-[14px] text-slate-500">
          About {DATA.workingDays} working days of broker research, supplier
          calls, and quote comparison we&apos;d do for you.
        </p>

        {/* Primary CTA — proper weight, filled blue */}
        <button className="mt-7 inline-flex items-center gap-2 rounded-[8px] bg-[#006bc5] px-6 py-3 text-[15px] font-semibold text-white shadow-[0_1px_2px_rgba(0,107,197,0.3)] hover:bg-[#0058a3]">
          {DATA.cta}
          <span aria-hidden>→</span>
        </button>
      </div>

      {/* Why — flowing numbered list, no mini-cards. Hairline above. */}
      <div className="border-t border-slate-100 px-8 py-9 sm:px-10">
        <p className="text-[13px] font-medium text-slate-700">
          Why this is the right call:
        </p>
        <ol className="mt-5 space-y-4">
          {DATA.reasons.map((r, i) => (
            <li
              key={i}
              className="grid grid-cols-[28px_1fr] gap-x-3 text-[15px] leading-[1.55] text-slate-600"
            >
              <span className="font-mono text-[13px] tabular-nums text-slate-400">
                0{i + 1}
              </span>
              <p>
                <span className="font-semibold text-slate-900">
                  {r.label}.
                </span>{" "}
                {r.body}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Presumptive close — flowing section, no boxed card */}
      <div className="border-t border-slate-100 px-8 py-9 sm:px-10">
        <p className="text-[13px] font-medium text-slate-700">
          Here&apos;s how we&apos;d help.
        </p>
        <p className="mt-3 max-w-[600px] text-[15px] leading-[1.6] text-slate-600">
          {DATA.presumptiveClose}
        </p>
        <p className="mt-4 text-[13px] italic text-slate-500">
          — the Arise market team
        </p>
      </div>

      {/* Meeting kit — flowing, no boxed card */}
      <div className="border-t border-slate-100 px-8 py-9 sm:px-10">
        <p className="text-[13px] font-medium text-slate-700">
          Take it to your next call.
        </p>
        <p className="mt-2 text-[15px] leading-[1.55] text-slate-600">
          <span className="font-semibold text-slate-900">
            {DATA.meetingKit.title}
          </span>{" "}
          + Texas market snapshot, built from your answers. We&apos;ll send
          it now and won&apos;t call you.
        </p>
        <form className="mt-4 flex max-w-[480px] flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="name@company.com"
            className="flex-1 rounded-[8px] border border-slate-200 bg-white px-4 py-2.5 text-[14px] placeholder:text-slate-400 focus:border-[#006bc5] focus:outline-none"
          />
          <button className="rounded-[8px] bg-slate-900 px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-slate-800">
            Send me the kit
          </button>
        </form>
      </div>

      {/* Footer colophon */}
      <div className="border-t border-slate-100 bg-slate-50/50 px-8 py-4 sm:px-10">
        <p className="text-[11px] text-slate-400">
          Generated from your 5 answers · Texas open market · May 20, 2026
        </p>
      </div>
    </article>
  );
}
