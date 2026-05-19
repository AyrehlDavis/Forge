export function HowToVet() {
  return (
    <section id="how-to-vet" className="bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-[1184px] gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#006bc5]">
            How to vet
          </p>
          <h2 className="mt-4 text-[32px] font-semibold leading-[1.08] tracking-tight text-[#0A1F1F] sm:text-[40px] lg:text-[48px]">
            Don&apos;t sign until you ask these questions.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Don&apos;t compare brokers by rate alone. Ask how they handle fees, timing, risk, and support after you sign.
          </p>
        </div>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:col-span-8">
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
  const accent =
    tone === "ask" ? "text-emerald-700" : "text-red-700";
  const dot =
    tone === "ask" ? "bg-emerald-500" : "bg-red-500";
  return (
    <article className="rounded-[12px] border border-slate-200 bg-white p-6">
      <h3 className={`text-xs font-semibold uppercase tracking-[0.12em] ${accent}`}>
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
            <span aria-hidden className={`mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
