// Energy artifact — bid comparison sheet styled like the real spreadsheet
// commercial buyers and brokers actually use. Each row shows the all-in
// number broken out from the headline rate so the user can see how easy it
// is to pick the wrong "winner" when only the rate is compared.
// All numbers TEMP-marked.

interface Bid {
  supplier: string;
  rate: string;
  term: string;
  structure: string;
  passThrough: string;
  allIn: string;
  tempKey: string;
  flag?: "trap" | "best";
}

const BIDS: Bid[] = [
  {
    supplier: "Supplier A",
    rate: "$0.0698",
    term: "24 mo",
    structure: "Fixed",
    passThrough: "+$0.0427",
    allIn: "$0.1125",
    tempKey: "bid-supplier-a",
    flag: "trap",
  },
  {
    supplier: "Supplier B",
    rate: "$0.0742",
    term: "36 mo",
    structure: "Fixed",
    passThrough: "+$0.0353",
    allIn: "$0.1095",
    tempKey: "bid-supplier-b",
    flag: "best",
  },
  {
    supplier: "Supplier C",
    rate: "$0.0719",
    term: "24 mo",
    structure: "Indexed",
    passThrough: "+$0.0388",
    allIn: "$0.1107",
    tempKey: "bid-supplier-c",
  },
  {
    supplier: "Supplier D",
    rate: "$0.0731",
    term: "12 mo",
    structure: "Fixed",
    passThrough: "+$0.0382",
    allIn: "$0.1113",
    tempKey: "bid-supplier-d",
  },
];

export function SupplierBidStack() {
  return (
    <article
      data-temp="supplier-bid-stack"
      className="overflow-hidden rounded-[16px] border border-slate-200/80 bg-white shadow-[0_12px_32px_-16px_rgba(15,23,42,0.12)]"
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-slate-200 px-6 py-4 sm:px-8">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Bid stack
          </span>
          <span className="text-sm font-semibold text-slate-900">
            What four suppliers actually quoted
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">sample</span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              <th scope="col" className="px-6 py-3 sm:px-8">Supplier</th>
              <th scope="col" className="px-3 py-3 text-right">Rate</th>
              <th scope="col" className="px-3 py-3">Term</th>
              <th scope="col" className="px-3 py-3">Structure</th>
              <th scope="col" className="px-3 py-3 text-right">Pass-through</th>
              <th scope="col" className="px-6 py-3 text-right sm:px-8">All-in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {BIDS.map((b) => (
              <tr
                key={b.tempKey}
                data-temp={b.tempKey}
                className={`text-slate-700 ${b.flag === "best" ? "bg-arise-50/50" : ""}`}
              >
                <td className="px-6 py-3 font-semibold text-slate-900 sm:px-8">
                  <span className="flex items-center gap-2">
                    {b.supplier}
                    {b.flag === "trap" && (
                      <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#4F5CB8]">
                        looks cheapest
                      </span>
                    )}
                    {b.flag === "best" && (
                      <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#006bc5]">
                        best all-in
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-3 py-3 text-right tabular-nums">{b.rate}</td>
                <td className="px-3 py-3 tabular-nums">{b.term}</td>
                <td className="px-3 py-3">{b.structure}</td>
                <td className="px-3 py-3 text-right tabular-nums text-slate-600">
                  {b.passThrough}
                </td>
                <td
                  className={`px-6 py-3 text-right font-semibold tabular-nums sm:px-8 ${b.flag === "best" ? "text-[#006bc5]" : "text-slate-900"}`}
                >
                  {b.allIn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-slate-100 px-6 py-3 text-xs leading-5 text-slate-500 sm:px-8">
        Supplier A wins on rate, loses on the all-in. This is the comparison
        most buyers don&apos;t run.
      </p>
    </article>
  );
}
