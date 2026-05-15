import type { Metadata } from "next";
import { BrokerDecisionTool } from "./BrokerDecisionTool";
import {
  LandingHero,
  OutcomesPreview,
  HowItWorks,
  FaqSection,
  FooterCta,
} from "./_components/LandingSections";

export const metadata: Metadata = {
  title: "Should I Use an Energy Broker? | Arise Energy",
  description:
    "Answer 5 questions, get a personalized recommendation — Use a Broker, Go Direct, or Hybrid. No form required. Full results shown free.",
};

export default function BrokerDecisionPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-arise-50 via-white to-arise-50/60">
      {/* Ambient orb — drifts slowly via v1-orb-drift keyframe */}
      <div
        aria-hidden
        className="v1-orb-drift pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-arise-300/30 blur-3xl"
      />

      {/* Site brand header — sits above the hero so the page reads as part of
          the .com surface, not a standalone tool. */}
      <header className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-8 sm:pt-10">
        <a
          href="/"
          aria-label="Arise Energy — home"
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
        </a>
      </header>

      {/* Wider container than the original max-w-3xl — landing sections need room
          to breathe (3-col outcome grid, 3-col how-it-works). Inner tool wrapper
          re-clamps to max-w-3xl below. */}
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-10 sm:pt-12 pb-12 sm:pb-20">
        <LandingHero />

        {/* OutcomesPreview is currently HIDDEN — the hero's floating outcome
            chips already preview the three paths, so rendering this section
            duplicates the same message. Kept imported + ready to restore if
            we decide to bring back the longer-form preview later. */}
        {false && <OutcomesPreview />}

        {/* Tool — re-clamped to the original max-w-3xl reading width.
            Anchor id matches the hero CTA's `#broker-decision-tool` link. */}
        <div id="broker-decision-tool" className="mx-auto max-w-3xl mb-14 sm:mb-20 scroll-mt-8">
          <BrokerDecisionTool />
        </div>

        <HowItWorks />

        <FaqSection />

        <FooterCta />
      </div>
    </main>
  );
}
