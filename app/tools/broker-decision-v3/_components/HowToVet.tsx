// HowToVet — the page's editorial anchor. Larger headline type, more
// breathing room, asymmetric layout: the headline column spans wider than
// the checklists below so the editorial moment lands before the practical
// detail. WhyThisMatters + SocialProof carry recessed scale around this.
export function HowToVet() {
  return (
    <section id="how-to-vet" className="py-20 sm:py-28 lg:py-36">
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div className="max-w-[920px]">
          {/* Eyebrow dropped per V3.5 typography pass — H2 owns the section
              without a label. Stepped tracking + tightened leading at lg
              gives the editorial gravity. */}
          <h2 className="text-balance text-[44px] font-semibold leading-[1.02] tracking-[-0.032em] text-[#0A1F1F] sm:text-[60px] sm:leading-[0.98] lg:text-[76px] lg:tracking-[-0.04em]">
            Don&apos;t sign until you ask these questions.
          </h2>
          <p className="mt-7 max-w-[720px] text-[18px] leading-[1.7] text-slate-600 sm:text-[20px]">
            The right broker can explain how they&apos;re paid, how they pick
            suppliers, and how they&apos;ll handle the renewal you haven&apos;t
            had to think about yet. The wrong one can&apos;t. These nine
            questions separate the brokers worth your time from the ones who
            won&apos;t survive the call.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
          <ChecklistCard
            tone="ask"
            title="Ask for"
            items={[
              "The all-in cost — supply, delivery, and any pass-through charges.",
              "How they're compensated, in writing, on every quote.",
              "What happens at renewal — and how early you can shop again.",
              "Their plan for monitoring the market after you sign.",
              "A reference at a business roughly your size.",
            ]}
          />
          <ChecklistCard
            tone="watch"
            title="Watch out for"
            items={[
              "A headline rate that's quietly missing pass-through charges.",
              "Long contracts with steep early-termination fees.",
              "Pressure to sign before you can review the contract.",
              "Vague answers about how renewals work.",
              "A broker who can't explain the cost-vs-risk tradeoff in plain terms.",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

function ChecklistCard({
  tone,
  title,
  items,
}: {
  tone: "ask" | "watch";
  title: string;
  items: string[];
}) {
  const accent = tone === "ask" ? "text-emerald-700" : "text-red-700";
  const dot = tone === "ask" ? "bg-emerald-500" : "bg-red-500";
  return (
    <article className="rounded-[16px] border border-slate-200/80 bg-white p-7 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-9">
      <h3 className={`text-xs font-semibold uppercase tracking-[0.18em] ${accent}`}>
        {title}
      </h3>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[15px] leading-7 text-slate-700"
          >
            <span aria-hidden className={`mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
