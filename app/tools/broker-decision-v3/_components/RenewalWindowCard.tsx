// Energy artifact — horizontal renewal timeline. Illustrates that "a single
// bad buy day can cost years" by showing the real planning window:
// 6mo lead → 90-day shop → 30-day decide → contract end.
// All marker dates / labels are TEMP-marked.

interface Marker {
  pct: number;
  primary: string;
  caption: string;
  tempKey: string;
  state: "past" | "now" | "future";
}

const MARKERS: Marker[] = [
  { pct: 0, primary: "−6 mo", caption: "Start watching", tempKey: "rw-6mo", state: "past" },
  { pct: 38, primary: "−90 d", caption: "Open RFP", tempKey: "rw-90d", state: "now" },
  { pct: 72, primary: "−30 d", caption: "Decide", tempKey: "rw-30d", state: "future" },
  { pct: 100, primary: "End", caption: "Contract closes", tempKey: "rw-end", state: "future" },
];

export function RenewalWindowCard() {
  return (
    <article
      data-temp="renewal-window-card"
      className="flex h-full flex-col gap-5 rounded-[16px] border border-slate-200/80 bg-white p-6 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-7"
    >
      <header className="flex items-baseline justify-between gap-3 border-b border-dashed border-slate-200 pb-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Your renewal window
        </span>
        <span className="text-[10px] uppercase tracking-[0.14em] text-slate-400">sample</span>
      </header>

      <div className="relative pt-2">
        <div className="relative h-px w-full bg-slate-200">
          <div
            aria-hidden
            className="absolute left-0 top-0 h-px bg-[#006bc5]"
            style={{ width: "38%" }}
          />
        </div>
        <ol className="relative -mt-2 grid grid-cols-4 gap-2">
          {MARKERS.map((m) => (
            <li
              key={m.tempKey}
              data-temp={m.tempKey}
              className="flex flex-col items-start gap-1"
            >
              <span
                aria-hidden
                className={`relative h-4 w-4 rounded-full border-2 ${
                  m.state === "past"
                    ? "border-[#006bc5] bg-[#006bc5]"
                    : m.state === "now"
                      ? "border-[#006bc5] bg-white shadow-[0_0_0_4px_rgba(0,107,197,0.18)]"
                      : "border-slate-300 bg-white"
                }`}
              />
              <span
                className={`text-xs font-semibold tabular-nums leading-tight ${
                  m.state === "future" ? "text-slate-500" : "text-slate-900"
                }`}
              >
                {m.primary}
              </span>
              <span
                className={`text-[11px] leading-tight ${
                  m.state === "future" ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {m.caption}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-auto text-xs leading-5 text-slate-500">
        Signing inside the −30 day window narrows your supplier set and locks
        whatever the market is on that one day.
      </p>
    </article>
  );
}
