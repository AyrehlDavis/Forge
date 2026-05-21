import { PageShell } from "./PageShell";
import { QuestionModule } from "./QuestionModule";
import { RUNNING_HEADER_SLUG, SAMPLE_META } from "./sample-data";

// Page 5 — Broker questions 1–3: money & market reach.
// Content lifted verbatim from Warlock copy-lp1-lead-magnet-pdf.md (Track A).

export function Questions1to3() {
  return (
    <PageShell
      number={5}
      total={SAMPLE_META.totalPages}
      title="Broker questions 1–3"
      runningSlug={RUNNING_HEADER_SLUG}
    >
      <div className="flex h-full flex-col px-12 py-9">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Section 1 of 3 · Money & market reach
        </p>
        <h2 className="mt-2 text-[24px] font-semibold leading-[1.1] tracking-tight text-slate-900">
          What every broker should be able to explain.
        </h2>

        <div className="mt-4 flex-1 overflow-hidden">
          <QuestionModule
            n={1}
            category="How they get paid"
            weight={2}
            ask="How are you paid — and is your fee shown on every quote you bring me?"
            goodAnswer="A specific number, stated in cents per kWh or as a flat retainer. They tell you who pays them (you, the supplier, or both) and show that line item on every quote. They volunteer it before you ask in the second meeting."
            redFlag="“Don't worry about that — the supplier covers it.” “It's built into the rate, so it doesn't really cost you anything.” Any version of “we don't disclose that” or “it varies.”"
          />
          <QuestionModule
            n={2}
            category="What you're actually seeing"
            weight={1}
            ask="How many suppliers do you work with, and how many are typically in a bid for a portfolio my size in Texas?"
            goodAnswer="A specific number for both. “We work with 12; for a portfolio your size you'd usually see 5–7 bids.” They explain why certain suppliers aren't in the bid (credit, region, contract type) so you understand what's excluded."
            redFlag="“We work with all the major suppliers” without a count. A long list of supplier logos without saying which ones actually bid for businesses your size. Volume is in the bid stack, not the brochure."
          />
          <QuestionModule
            n={3}
            category="What your rate actually includes"
            weight={2}
            ask="Walk me through what's fixed in this quote and what isn't. Which line items can move during the contract — and how often have they moved in the last 24 months?"
            goodAnswer="They name each component of the all-in rate (supply, capacity, transmission, ancillary services, regulatory adjustments) and which are fixed vs pass-through. They volunteer recent examples where pass-throughs moved unexpectedly."
            redFlag="“It's a fixed rate, so everything is fixed.” A quote that shows one all-in cents-per-kWh number with no component breakdown."
          />
        </div>
      </div>
    </PageShell>
  );
}
