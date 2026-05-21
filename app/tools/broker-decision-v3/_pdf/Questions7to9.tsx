import { PageShell } from "./PageShell";
import { QuestionModule } from "./QuestionModule";
import { RUNNING_HEADER_SLUG, SAMPLE_META } from "./sample-data";

// Page 7 — Broker questions 7–9: support after signing.
// Ranger-spec Q4-9 — pending Warlock voice pass.

export function Questions7to9() {
  return (
    <PageShell
      number={7}
      total={SAMPLE_META.totalPages}
      title="Broker questions 7–9"
      runningSlug={RUNNING_HEADER_SLUG}
    >
      <div className="flex h-full flex-col px-12 py-9">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
          Section 3 of 3 · Support after signing
        </p>
        <h2 className="mt-2 text-[24px] font-semibold leading-[1.1] tracking-tight text-slate-900">
          What they do once the rate is locked.
        </h2>

        <div className="mt-4 flex-1 overflow-hidden">
          {/* Ranger-spec Q4-9 — pending Warlock voice pass */}
          <QuestionModule
            n={7}
            category="Monitoring plan"
            weight={1}
            ask="Once I sign, what specifically do you watch — and what triggers a call to me?"
            goodAnswer="A list of watched signals: forward curves, capacity prices, your usage variance, regulatory filings. Specific trigger thresholds. A cadence: weekly internal review, monthly client note, quarterly portfolio call. They volunteer this without you asking."
            redFlag="“We&apos;re here if you need us.” “We&apos;ll reach out when it&apos;s time to renew.” A monitoring plan that activates only when there&apos;s a contract to write. The work is in months 1–23, not just at renewal."
          />
          {/* Ranger-spec Q4-9 — pending Warlock voice pass */}
          <QuestionModule
            n={8}
            category="Reporting cadence"
            weight={1}
            ask="What reports do I get after signing, in what format, and on what cadence?"
            goodAnswer="A sample report — or two: monthly bill summary, quarterly portfolio view — and a calendared cadence. A named owner on their side who sends them. Format you can drop into your own dashboards without re-formatting."
            redFlag="“We can build something custom.” “Whatever you want.” A broker without a reporting baseline is making it up as they go. The good ones show you the format on the first call."
          />
          {/* Ranger-spec Q4-9 — pending Warlock voice pass */}
          <QuestionModule
            n={9}
            category="Reference"
            weight={1}
            ask="Can you give me one reference at a multi-site business of roughly my size — someone willing to take a 15-minute call?"
            goodAnswer="They volunteer a name, role, and company without you having to push. A reference at a portfolio shape close enough that the call doesn&apos;t need pre-translation. They&apos;ll set the introduction up by Friday."
            redFlag="“Our clients are confidential.” “We can&apos;t share that.” Confidentiality is real for identity, not for whether any reference exists. A broker who can&apos;t find one matching reference is showing you their book."
          />
        </div>

        <p className="mt-3 rounded-[6px] border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-[11px] leading-[1.5] text-slate-700">
          <span className="font-semibold text-slate-900">
            If they cannot answer in writing, score it as 0.
          </span>{" "}
          Verbal answers are signal, but the score grid only counts what
          you&apos;d show your CFO.
        </p>
      </div>
    </PageShell>
  );
}
