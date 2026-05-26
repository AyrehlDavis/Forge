import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "../../broker-decision-v3/_components/Footer";
import { SiteHeader } from "../../broker-decision-v3/_components/SiteHeader";
import { recommend } from "../../broker-decision-v3/_lib/recommend";
import { ResultPreview } from "./_components/ResultPreview";
import { TRACK_FIXTURES, TRACK_SLUGS } from "./_fixtures";

export const metadata: Metadata = {
  title: "Broker Decision — All result tracks (V3)",
  description: "Side-by-side review of all three V3 recommendation outcomes.",
  robots: { index: false, follow: false },
};

export default function ResultsReviewPage() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-arise-50 via-white to-arise-50/60 text-[#0A1F1F]">
      <div
        aria-hidden
        className="v1-orb-drift pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[640px] w-[960px] rounded-full bg-arise-300/30 blur-3xl"
      />
      <div className="relative">
        <SiteHeader />
        <main>
          <section className="relative mx-auto max-w-[1184px] px-5 sm:px-8 pt-10 pb-6">
            <IntroBanner />
            <nav
              aria-label="Jump to track"
              className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em]"
            >
              <span className="text-slate-500">Jump to:</span>
              {TRACK_SLUGS.map((slug) => (
                <a
                  key={slug}
                  href={`#${slug}`}
                  className="text-[#006bc5] hover:text-[#003a6b] underline underline-offset-4"
                >
                  {slug}
                </a>
              ))}
            </nav>
          </section>

          {TRACK_SLUGS.map((slug) => {
            const fixture = TRACK_FIXTURES[slug];
            const result = recommend(fixture.input);
            return (
              <section
                key={slug}
                id={slug}
                aria-label={fixture.label}
                className="relative mx-auto max-w-[1184px] px-5 sm:px-8 pb-16 pt-10 scroll-mt-6"
              >
                <SectionHeader fixture={fixture} />
                <div className="mt-6">
                  <ResultPreview result={result} inputs={fixture.input} />
                </div>
              </section>
            );
          })}
        </main>
        <Footer />
      </div>
    </div>
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
        Review preview — V3 layout, all three tracks
      </p>
      <p className="mt-1.5 leading-relaxed">
        Each section below is a static render of one V3 recommendation outcome with
        fixed sample inputs, so you can scroll and leave comments on any element. The
        live tool still runs at{" "}
        <Link
          href="/tools/broker-decision-v3"
          className="font-semibold text-amber-900 underline underline-offset-2"
        >
          /tools/broker-decision-v3
        </Link>
        .
      </p>
    </aside>
  );
}

function SectionHeader({
  fixture,
}: {
  fixture: (typeof TRACK_FIXTURES)[keyof typeof TRACK_FIXTURES];
}) {
  return (
    <div className="border-l-4 border-[#006bc5] pl-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
        {fixture.slug}
      </p>
      <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
        {fixture.label}
      </h2>
      <p className="mt-1 max-w-[760px] text-sm text-slate-600 leading-relaxed">
        {fixture.description}
      </p>
    </div>
  );
}
