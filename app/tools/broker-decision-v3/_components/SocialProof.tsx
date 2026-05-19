const PILLARS = [
  {
    title: "Supplier comparison",
    body: "Side-by-side bid stacks with the all-in cost — not just the rate.",
  },
  {
    title: "Contract review",
    body: "Fees, pass-throughs, and renewal terms read out in plain language.",
  },
  {
    title: "Market watch",
    body: "Daily curves checked against your contracts — we move when the window opens.",
  },
  {
    title: "Portfolio view",
    body: "Sites, dates, and supplier details in one place. Log in anytime.",
  },
];

export function SocialProof() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#006bc5]">
            What good buyers check first
          </p>
          <h2 className="mt-4 text-[32px] font-semibold leading-[1.08] tracking-tight text-slate-900 sm:text-[40px] lg:text-[48px]">
            Look past the quote.
          </h2>
          <p className="mt-5 text-base leading-7 text-slate-600 sm:text-lg">
            The strongest energy buyers check the contract, the market window, and the plan after signing.
          </p>
        </div>
        <ul className="mx-auto mt-12 grid max-w-[840px] grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2">
          {PILLARS.map(({ title, body }, i) => (
            <li
              key={title}
              className="rounded-[16px] border border-slate-200/70 bg-white p-6 sm:p-7"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] tabular-nums text-[#006bc5]">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900 sm:text-lg">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
