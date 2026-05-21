import { BillBreakdownCard } from "./BillBreakdownCard";
import { RenewalWindowCard } from "./RenewalWindowCard";

// WhyThisMatters — now a supporting section beneath the tool. V3.5 promotes
// the H2 + adds a numbered kicker per artifact so the section reads as an
// ordered argument, not two parallel cards.
export function WhyThisMatters() {
  return (
    <section className="py-10 sm:py-12 lg:py-12">
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div className="max-w-[640px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            Why this matters
          </p>
          <h2 className="mt-3 text-balance text-[34px] font-semibold leading-[1.08] tracking-[-0.022em] text-slate-900 sm:text-[40px] lg:text-[48px]">
            The lowest rate can still cost you.
          </h2>
          <p className="mt-3 max-w-[560px] text-pretty text-[15px] leading-7 text-slate-600">
            Two things the headline number doesn&apos;t tell you — sketched
            out the way a real buyer would actually see them.
          </p>
        </div>
        <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          <li>
            <span className="label-number block pb-2">01</span>
            <BillBreakdownCard />
          </li>
          <li>
            <span className="label-number block pb-2">02</span>
            <RenewalWindowCard />
          </li>
        </ol>
      </div>
    </section>
  );
}
