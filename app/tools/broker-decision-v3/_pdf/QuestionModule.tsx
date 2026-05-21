// Shared per-question module — three zones per Ranger's spec:
// Ask · Good answer · Red flag · Notes (lined space)
// Used three-up on pages 5–7.

export interface QuestionModuleProps {
  n: number;
  category: string;
  weight: 1 | 2;
  ask: string;
  goodAnswer: string;
  redFlag: string;
}

export function QuestionModule({
  n,
  category,
  weight,
  ask,
  goodAnswer,
  redFlag,
}: QuestionModuleProps) {
  return (
    <article className="grid grid-cols-[36px_1fr] gap-x-4 border-b border-slate-100 py-5 last:border-b-0">
      <div className="flex flex-col items-center gap-1">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[12px] font-semibold text-white tabular-nums">
          {n}
        </span>
        <span
          className={`text-[9px] font-semibold uppercase tracking-[0.14em] ${weight === 2 ? "text-[#007fe8]" : "text-slate-400"}`}
        >
          wt {weight}
        </span>
      </div>

      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {category}
        </p>
        <p className="mt-1.5 text-[13px] font-semibold leading-[1.45] text-slate-900">
          {ask}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-[4px] border-l-2 border-emerald-500 bg-emerald-50/40 px-3 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Good answer sounds like
            </p>
            <p className="mt-1 text-[11px] leading-[1.55] text-slate-700">
              {goodAnswer}
            </p>
          </div>
          <div className="rounded-[4px] border-l-2 border-red-500 bg-red-50/40 px-3 py-2">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-red-700">
              Red flag
            </p>
            <p className="mt-1 text-[11px] leading-[1.55] text-slate-700">
              {redFlag}
            </p>
          </div>
        </div>

        {/* Notes — two ruled lines */}
        <div className="mt-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Notes
          </p>
          <div className="mt-1 space-y-[10px]">
            <div className="h-px bg-slate-200" />
            <div className="h-px bg-slate-200" />
          </div>
        </div>
      </div>
    </article>
  );
}
