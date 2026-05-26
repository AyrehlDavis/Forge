import type { Metadata } from "next";
import Link from "next/link";
import { recommend } from "../_lib/recommend";
import { ResultPreview } from "./_components/ResultPreview";
import { TRACK_FIXTURES, TRACK_SLUGS } from "./_fixtures";

export const metadata: Metadata = {
  title: "Broker Decision — All result tracks",
  description: "Side-by-side review of all three recommendation outcomes.",
  robots: { index: false, follow: false },
};

export default function ResultsReviewPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-arise-50 via-white to-arise-50/60">
      <div
        aria-hidden
        className="v1-orb-drift pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-arise-300/30 blur-3xl"
      />

      <header className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-8 sm:pt-10 flex items-center justify-between gap-4">
        <Link
          href="/tools/broker-decision"
          aria-label="Arise Energy — broker decision tool"
          className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-arise-500 rounded"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/arise-logo.svg"
            alt="Arise Energy"
            width={120}
            height={48}
            className="h-9 sm:h-10 w-auto"
          />
        </Link>
        <nav aria-label="Jump to track" className="hidden sm:flex items-center gap-3 text-xs">
          {TRACK_SLUGS.map((slug) => (
            <a
              key={slug}
              href={`#${slug}`}
              className="font-semibold uppercase tracking-[0.18em] text-arise-700 hover:text-arise-900 underline underline-offset-4"
            >
              {slug}
            </a>
          ))}
        </nav>
      </header>

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 pt-8 pb-20 space-y-16">
        <IntroBanner />
        {TRACK_SLUGS.map((slug) => {
          const fixture = TRACK_FIXTURES[slug];
          const result = recommend(fixture.input);
          return (
            <section
              key={slug}
              id={slug}
              aria-label={fixture.label}
              className="scroll-mt-8 space-y-6"
            >
              <SectionHeader fixture={fixture} />
              <ResultPreview input={fixture.input} result={result} />
            </section>
          );
        })}
      </div>
    </main>
  );
}

function IntroBanner() {
  return (
    <aside
      role="note"
      aria-label="Review preview banner"
      className="rounded-2xl border border-amber-300/70 bg-amber-50/85 backdrop-blur-md px-5 py-4 text-sm text-amber-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
        Review preview — all three tracks
      </p>
      <p className="mt-1.5 leading-relaxed">
        Each section below is a static render of one recommendation outcome with fixed
        sample inputs, so you can scroll and leave comments on any element. The live
        questionnaire still drives the production flow at{" "}
        <Link
          href="/tools/broker-decision"
          className="font-semibold text-amber-900 underline underline-offset-2"
        >
          /tools/broker-decision
        </Link>
        .
      </p>
    </aside>
  );
}

function SectionHeader({ fixture }: { fixture: (typeof TRACK_FIXTURES)[keyof typeof TRACK_FIXTURES] }) {
  return (
    <div className="border-l-4 border-arise-400 pl-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-arise-700">
        {fixture.slug}
      </p>
      <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        {fixture.label}
      </h2>
      <p className="mt-1 text-sm text-slate-600 leading-relaxed">{fixture.description}</p>
    </div>
  );
}
