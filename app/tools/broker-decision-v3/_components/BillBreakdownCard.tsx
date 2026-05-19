// Energy artifact — illustrates the line-item structure of a real utility
// bill so the value of "the headline rate can hide 20-30%" becomes a thing
// the user can see, not just read about. All values are TEMP-marked.

interface LineItem {
  label: string;
  amount: string;
  tempKey: string;
  hidden?: boolean;
}

const LINE_ITEMS: LineItem[] = [
  { label: "Generation (the rate you saw)", amount: "$0.0742 / kWh", tempKey: "bill-generation" },
  { label: "Transmission", amount: "+$0.0118 / kWh", tempKey: "bill-transmission", hidden: true },
  { label: "Distribution", amount: "+$0.0184 / kWh", tempKey: "bill-distribution", hidden: true },
  { label: "Riders & adjustments", amount: "+$0.0061 / kWh", tempKey: "bill-riders", hidden: true },
];

export function BillBreakdownCard() {
  return (
    <article
      data-temp="bill-breakdown-card"
      className="flex h-full flex-col gap-4 rounded-[16px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-7"
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-dashed border-slate-200 pb-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Your bill, line by line
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">
          sample
        </span>
      </header>
      <ul className="flex flex-col gap-2.5">
        {LINE_ITEMS.map((li) => (
          <li
            key={li.tempKey}
            data-temp={li.tempKey}
            className="flex items-baseline justify-between gap-3 text-sm"
          >
            <span
              className={`leading-snug ${li.hidden ? "text-slate-700" : "font-semibold text-slate-900"}`}
            >
              {li.label}
              {li.hidden && (
                <span className="ml-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#4F5CB8]">
                  hidden in quote
                </span>
              )}
            </span>
            <span
              className={`shrink-0 tabular-nums leading-snug ${li.hidden ? "text-slate-700" : "font-semibold text-slate-900"}`}
            >
              {li.amount}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-baseline justify-between border-t border-slate-200 pt-3 text-sm font-semibold">
        <span className="text-slate-900">All-in</span>
        <span className="tabular-nums text-slate-900">$0.1105 / kWh</span>
      </div>
      <p className="text-xs leading-5 text-slate-500">
        The rate you compared against was the first line. The other three are
        where 20–30% of the bill lives.
      </p>
    </article>
  );
}
