import { PageShell } from "./PageShell";
import { RUNNING_HEADER_SLUG, SAMPLE_META } from "./sample-data";

// Page 9 — What to send Arise + named contact + disclaimers.
// Named contact block is structural — left as a placeholder. Single-prop
// wire-up when Chris approves photo/name/email (same pattern as the
// website-block voucher). Constellation parentage is skipped per Ayrehl default.

const SEND_CHECKLIST = [
  "Recent invoice from at least one site",
  "Current contract end date (and auto-renewal terms if you have them)",
  "Quote PDFs from any brokers you're talking to",
  "Broker fee disclosure, in writing",
  "Site list with usage if you have it",
];

const ARISE_CHECKS = [
  "All-in cost — not just the headline rate",
  "Missing pass-throughs that move your bill",
  "Timing risk against your renewal window",
  "Broker fee clarity & how it shows on the quote",
];

export function ContactAndDisclaimers() {
  return (
    <PageShell
      number={9}
      total={SAMPLE_META.totalPages}
      title="Next steps + disclaimers"
      runningSlug={RUNNING_HEADER_SLUG}
    >
      <div className="flex h-full flex-col px-12 py-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Next steps
        </p>
        <h2 className="mt-3 text-[28px] font-semibold leading-[1.1] tracking-tight text-slate-900">
          If you want a second read.
        </h2>
        <p className="mt-3 max-w-[600px] text-[13px] leading-[1.6] text-slate-600">
          Run your RFP. Talk to the brokers on your list. Score them with the
          grid on page 8. When you have offers in hand, reply to the email you
          got this from with any of the items below — we&apos;ll check the
          math. Even if you don&apos;t pick us.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-6">
          {/* What helps us check the math */}
          <section className="rounded-[6px] border border-slate-200 bg-white p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#007fe8]">
              Send any of the following
            </p>
            <ul className="mt-3 space-y-2">
              {SEND_CHECKLIST.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[12px] leading-[1.55] text-slate-800"
                >
                  <span
                    aria-hidden
                    className="mt-[3px] inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border border-slate-300 text-[10px] text-slate-300"
                  >
                    ☐
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* What we'll check */}
          <section className="rounded-[6px] border border-slate-200 bg-slate-50/70 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              What we&apos;ll check
            </p>
            <ul className="mt-3 space-y-2">
              {ARISE_CHECKS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-[12px] leading-[1.55] text-slate-700"
                >
                  <span
                    aria-hidden
                    className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#007fe8]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Named-contact placeholder — left empty per Ayrehl default until Chris approves */}
        <section
          data-temp="pdf-contact-placeholder"
          className="mt-6 rounded-[6px] border border-dashed border-slate-300 bg-white px-5 py-4"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            From
          </p>
          <p className="mt-1 text-[13px] leading-[1.55] text-slate-600">
            The Arise market team ·{" "}
            <span className="font-medium text-slate-800">
              {SAMPLE_META.fromEmail}
            </span>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-slate-400">
            Named contact pending — single-prop wire-up once approved
          </p>
        </section>

        {/* Built for the buyer line — lifted from Warlock cover-footer */}
        <p className="mt-6 text-[11px] font-medium leading-[1.5] text-slate-700">
          Built for the buyer, not the seller.
        </p>

        {/* Disclaimers */}
        <div className="mt-auto space-y-1.5 border-t border-slate-100 pt-4 text-[9px] leading-[1.55] text-slate-400">
          <p>
            Rate ranges shown are illustrative, based on May 2026 EIA data.
            Supplier table on page 4 is buyer-fillable for V1; reply to the
            email for a current shortlist.
          </p>
          <p>
            This kit is not legal or financial advice. If a question here
            changes your decision, get the contract reviewed by someone whose
            job it is to do that.
          </p>
          <p>
            © 2026 Arise Energy. Standard privacy and unsubscribe details are
            in the email you received this kit from.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
