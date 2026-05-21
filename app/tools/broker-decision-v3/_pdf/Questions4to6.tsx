import { PageShell } from "./PageShell";
import { QuestionModule } from "./QuestionModule";
import { RUNNING_HEADER_SLUG, SAMPLE_META } from "./sample-data";

// Page 6 — Broker questions 4–6: timing & structure.
// Ranger-spec Q4-9 — pending Warlock voice pass.

export function Questions4to6() {
  return (
    <PageShell
      number={6}
      total={SAMPLE_META.totalPages}
      title="Broker questions 4–6"
      runningSlug={RUNNING_HEADER_SLUG}
    >
      <div className="flex h-full flex-col px-12 py-9">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Section 2 of 3 · Timing & structure
        </p>
        <h2 className="mt-2 text-[24px] font-semibold leading-[1.1] tracking-tight text-slate-900">
          When they buy — and how they split the portfolio.
        </h2>

        <div className="mt-4 flex-1 overflow-hidden">
          {/* Ranger-spec Q4-9 — pending Warlock voice pass */}
          <QuestionModule
            n={4}
            category="Timing plan"
            weight={2}
            ask="How do you decide when to buy versus when to wait — and what would push you to move now versus three months from now?"
            goodAnswer="Specific signals: forward curve shape, what news is already in the price, supplier inventory windows, your renewal window. “We&apos;d lock if the 24-month forward sits below the 12-month spot — otherwise we&apos;d wait for the next ERCOT capacity auction.” Tied to your timing, not theirs."
            redFlag="“The market is good right now.” “Lock today.” Any version of urgency without a signal. A broker whose timing logic doesn&apos;t reference your contract end date is selling generic."
          />
          {/* Ranger-spec Q4-9 — pending Warlock voice pass */}
          <QuestionModule
            n={5}
            category="Portfolio grouping"
            weight={1}
            ask="Will you bid my sites together as one portfolio, or split them by usage or renewal date — and why?"
            goodAnswer="A specific plan tied to your 11–50 sites. They explain the trade-off: larger combined load may attract bigger suppliers; splitting may match contracts to natural renewal cadence. They tell you which suppliers prefer which grouping."
            redFlag="“We always do it the same way.” A grouping logic that matches the broker&apos;s process more than your portfolio. Splitting your sites without explaining what you gain — or pooling them without explaining what you lose."
          />
          {/* Ranger-spec Q4-9 — pending Warlock voice pass */}
          <QuestionModule
            n={6}
            category="Contract-risk terms"
            weight={1}
            ask="Walk me through the contract terms — beyond the rate — that create risk for me after I sign."
            goodAnswer="They name specific clauses: minimum take, swing tolerance, capacity true-up, change-of-law pass-through, force majeure carve-outs. They tell you which terms they negotiate above standard for clients like you, and which ones they don&apos;t bother fighting."
            redFlag="“It&apos;s standard.” “Don&apos;t worry about that — nobody invokes it.” A broker who treats post-signing risk as boilerplate. The rate is one number; the contract has fifty other terms that move your bill."
          />
        </div>

        <aside className="mt-3 rounded-[6px] border border-slate-200 bg-slate-50/70 px-4 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#007fe8]">
            Balanced price & risk · Texas
          </p>
          <p className="mt-1 text-[11px] leading-[1.5] text-slate-700">
            Don&apos;t reward the lowest quote unless the timing logic and the
            contract-risk terms are clear. Renewal soon means Q4 matters more
            than the rate.
          </p>
        </aside>
      </div>
    </PageShell>
  );
}
