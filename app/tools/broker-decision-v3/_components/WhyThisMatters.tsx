import { BillBreakdownCard } from "./BillBreakdownCard";
import { RenewalWindowCard } from "./RenewalWindowCard";

// WhyThisMatters — now a supporting section beneath the tool, recessed in
// type scale so HowToVet reads as the page's editorial center. The generic
// capability tiles are replaced with two real energy artifacts: a bill
// breakdown and a renewal window. Identity, not abstraction.
export function WhyThisMatters() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div className="max-w-[640px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            Why this matters
          </p>
          <h2 className="mt-3 text-[26px] font-semibold leading-[1.1] tracking-tight text-slate-900 sm:text-[30px] lg:text-[34px]">
            The lowest rate can still cost you.
          </h2>
          <p className="mt-3 max-w-[560px] text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Two things the headline number doesn&apos;t tell you — sketched
            out the way a real buyer would actually see them.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <BillBreakdownCard />
          <RenewalWindowCard />
        </div>
      </div>
    </section>
  );
}
