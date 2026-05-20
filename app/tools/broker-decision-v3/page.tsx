import type { Metadata } from "next";
import { BrokerDecisionV3 } from "./BrokerDecisionV3";
import { BrokerTransparency } from "./_components/BrokerTransparency";
import { CtaBand } from "./_components/CtaBand";
import { FaqSection } from "./_components/FaqSection";
import { Footer } from "./_components/Footer";
import { Hero } from "./_components/Hero";
import { HowToVet } from "./_components/HowToVet";
import { SiteHeader } from "./_components/SiteHeader";
import { SocialProof } from "./_components/SocialProof";
import { StatStrip } from "./_components/StatStrip";
import { WhyThisMatters } from "./_components/WhyThisMatters";

export const metadata: Metadata = {
  title: "Should I use an energy broker? — V3 | Arise Energy",
  description:
    "Answer five questions. See whether to use a broker, go direct based on your footprint and goals.",
};

export default function Page() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-arise-50 via-white to-arise-50/60 text-[#0A1F1F]">
      {/* Single page-level ambient orb — blue only, V1 recipe. */}
      <div
        aria-hidden
        className="v1-orb-drift pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[640px] w-[960px] rounded-full bg-arise-300/30 blur-3xl"
      />
      <div className="relative">
        <SiteHeader />
        <main>
          <Hero />
          <StatStrip />
          <BrokerDecisionV3 />
          <WhyThisMatters />
          <HowToVet />
          <SocialProof />
          <BrokerTransparency />
          <FaqSection />
          <CtaBand />
        </main>
        <Footer />
      </div>
    </div>
  );
}
