"use client";

import { useCallback, useRef, useState } from "react";

const FAQS = [
  {
    q: "Is this really free?",
    a: "Yes. No signup, no card. You only share an email if you ask for the printable strategies and your market snapshot.",
  },
  {
    q: "Why would an energy supplier tell me when not to use them?",
    a: "We're a supplier — we make money when you sign with us. We're also part of Constellation, the largest competitive supplier in the U.S. Telling you the honest answer (even when it's \"go direct\") builds the kind of trust that wins business over time. Bad advice doesn't.",
  },
  {
    q: "How accurate is the recommendation?",
    a: "It's a pattern-match on your spend, footprint, states, priority, and timing. Not personalized advice — but a useful starting point. The checklist is the part that travels with you into any sales call.",
  },
  {
    q: "What if my situation doesn't fit any of these?",
    a: "Most don't perfectly. The tool gives you a framework, not a final answer. If you want a real conversation, send an invoice or use the CTA below.",
  },
  {
    q: "Will you sell my email or drip-market me?",
    a: "No. One email with your checklist and recommendation. That's it.",
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
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#006bc5]">
                Common questions
              </p>
              <h2 className="mt-4 text-[32px] font-semibold leading-[1.08] tracking-tight text-[#0A1F1F] sm:text-[40px] lg:text-[48px]">
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
