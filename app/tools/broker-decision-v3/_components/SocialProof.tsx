import { SupplierBidStack } from "./SupplierBidStack";

// SocialProof — now centered on the supplier bid stack micro-object instead
// of generic pillar tiles. Same recessed type scale as WhyThisMatters so
// HowToVet can hold the editorial center between them.
export function SocialProof() {
  return (
    <section className="py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div className="max-w-[640px]">
          <p className="label-artifact">Supplier bid stack</p>
          <h2 className="mt-3 text-balance text-[30px] font-semibold leading-[1.1] tracking-[-0.018em] text-slate-900 sm:text-[34px] lg:text-[40px]">
            Look past the quote.
          </h2>
          <p className="mt-3 max-w-[560px] text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            The strongest energy buyers don&apos;t pick the lowest rate — they
            compare the all-in number side by side.
          </p>
        </div>
        <div className="mt-10">
          <SupplierBidStack />
        </div>
      </div>
    </section>
  );
}
