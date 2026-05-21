"use client";

import { useCallback, useRef, useState } from "react";

// FAQ copy per Chris's 2026-05-20 verbatim pass. Constellation parentage is
// now explicitly IN (reverses the earlier SKIP default). Privacy-policy link
// renders as a placeholder href="#" with data-temp marker until the real URL
// is provided. Render content as React nodes (not strings) so the privacy
// answer can include the inline link.
interface Faq {
  q: string;
  a: React.ReactNode;
}

const FAQS: Faq[] = [
  {
    q: "Is this really free?",
    a: "The only time Arise is paid is if you choose to buy energy from a supplier where we facilitate the transaction. This is how the industry works, we monitor the market, work with suppliers to get pricing, compare the products and contracts and provide a recommendation based on your goals. If you choose to sign with a supplier, we receive a fee directly from the supplier. We will always be transparent on our fees. If a broker tells you there is no cost for the service, they are hiding the fact that they set the fee and the supplier pays them versus you the customer.",
  },
  {
    q: "Why would an energy broker tell me when not to use them?",
    a: "We're a broker we make money when you sign a contract through us. We're also part of Constellation, the largest competitive supplier in the U.S. Telling you the honest answer (even when it's \"go direct\") builds the kind of trust that wins business over time. Bad advice doesn't.",
  },
  {
    q: "How accurate is the recommendation?",
    a: "It's a pattern-match on your spend, footprint, states, priority, and timing. Not personalized advice — but a useful starting point. Happy to chat more about your options in the market and support you in your journey.",
  },
  {
    q: "What if my situation doesn't fit any of these?",
    a: "The tool is a framework for the decision, but we understand every organization is slightly different, let's chat, we are happy to share our decades of experience and point you in the right direction.",
  },
  {
    q: "Will you sell my email?",
    a: (
      <>
        No we are not in the business to share data and have a tight policy
        around this{" "}
        <a
          href="#"
          data-temp="faq-privacy-policy-link"
          className="text-[#006bc5] underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
        >
          (privacy policy)
        </a>
        .
      </>
    ),
  },
];

export function FaqSection() {
  // `allOpen` reflects the user's last bulk action. Individual rows can still
  // be toggled independently after; the button label re-syncs on next bulk action.
  const [allOpen, setAllOpen] = useState(false);
  const detailsRefs = useRef<Array<HTMLDetailsElement | null>>([]);

  const toggleAll = useCallback(() => {
    const next = !allOpen;
    detailsRefs.current.forEach((el) => {
      if (el) el.open = next;
    });
    setAllOpen(next);
  }, [allOpen]);

  return (
    <section id="faq" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div>
          <div className="flex items-end justify-between gap-4">
            <div className="max-w-[760px]">
              <p className="label-section">Common questions</p>
              <h2 className="mt-4 text-balance text-[30px] font-medium leading-[1.1] tracking-[-0.018em] text-[#0A1F1F] sm:text-[36px] lg:text-[42px]">
                Before you start.
              </h2>
            </div>
            <button
              type="button"
              onClick={toggleAll}
              aria-pressed={allOpen}
              className="shrink-0 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-[#007fe8] hover:text-[#006bc5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2 motion-safe:transition-all"
            >
              {allOpen ? "Collapse all" : "Expand all"}
            </button>
          </div>
          <div className="mt-8">
            {FAQS.map((f, i) => (
              <details
                ref={(el) => {
                  detailsRefs.current[i] = el;
                }}
                key={f.q}
                className="group border-b border-slate-200 py-5 last:border-b-0"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 rounded text-base font-semibold text-[#0A1F1F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006bc5] focus-visible:ring-offset-2">
                  <span>{f.q}</span>
                  <span
                    aria-hidden
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EBF3FD] text-base font-semibold text-[#006bc5] transition-transform duration-200 group-open:rotate-45 motion-safe:transition-transform"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-10 text-base leading-7 text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
