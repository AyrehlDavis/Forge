import { PageShell } from "./PageShell";
import {
  QUESTION_WEIGHTS,
  RUNNING_HEADER_SLUG,
  SAMPLE_META,
  SCORE_GRID_MAX,
} from "./sample-data";

// Page 8 — Score grid. Landscape per Ranger spec (renderer falls back to
// portrait if @react-pdf/renderer can't do mixed orientation).
// 0/1/2 + weights + stop-sign rules per Codex synthesis.

const SCORE_CRITERIA = [
  { n: 1, criterion: "Fee shown on every quote" },
  { n: 2, criterion: "Supplier count & exclusions explained" },
  { n: 3, criterion: "Fixed vs pass-through explained" },
  { n: 4, criterion: "Timing plan tied to renewal window" },
  { n: 5, criterion: "Portfolio / site grouping logic" },
  { n: 6, criterion: "Contract-risk terms named" },
  { n: 7, criterion: "Monitoring plan after signing" },
  { n: 8, criterion: "Reporting cadence & owner" },
  { n: 9, criterion: "Similar-customer reference" },
];

export function ScoreGrid() {
  return (
    <PageShell
      number={8}
      total={SAMPLE_META.totalPages}
      title="Broker score grid"
      orientation="landscape"
      runningSlug={RUNNING_HEADER_SLUG}
    >
      <div className="flex h-full flex-col px-14 py-8">
        <div className="flex items-baseline justify-between gap-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
              Score grid · 0 / 1 / 2 with weights
            </p>
            <h2 className="mt-2 text-[24px] font-semibold leading-[1.1] tracking-tight text-slate-900">
              Score brokers as you go.
            </h2>
            <p className="mt-1 text-[12px] leading-[1.5] text-slate-600">
              Score brokers for:{" "}
              <span className="font-medium text-slate-900">
                Texas · 11–50 sites · Renewal soon
              </span>
            </p>
          </div>
          <ScoringLegend />
        </div>

        {/* Grid table */}
        <table className="mt-5 w-full border-collapse text-[11px]">
          <thead>
            <tr className="border-y border-slate-300 bg-slate-50 text-left text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600">
              <th className="px-2 py-2 align-bottom" style={{ width: "26%" }}>
                Criterion
              </th>
              <th className="px-2 py-2 text-center align-bottom" style={{ width: "5%" }}>
                Wt
              </th>
              <ColumnHead label="Broker A" />
              <NotesHead />
              <ColumnHead label="Broker B" />
              <NotesHead />
              <ColumnHead label="Broker C" />
              <NotesHead />
            </tr>
          </thead>
          <tbody>
            {SCORE_CRITERIA.map((row, i) => {
              const weight = QUESTION_WEIGHTS[i].weight;
              const isStopSign = i === 0 || i === 2; // Q1 + Q3
              return (
                <tr
                  key={row.n}
                  className={`border-b border-slate-100 ${isStopSign ? "bg-amber-50/30" : ""}`}
                >
                  <td className="px-2 py-2.5 align-top">
                    <div className="flex items-baseline gap-2">
                      <span className="tabular-nums text-slate-400">
                        Q{row.n}
                      </span>
                      <span className="text-[11px] font-medium leading-tight text-slate-900">
                        {row.criterion}
                      </span>
                    </div>
                    {isStopSign && (
                      <p className="mt-0.5 text-[8.5px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                        Stop-sign criterion
                      </p>
                    )}
                  </td>
                  <td
                    className={`px-2 py-2.5 text-center align-top tabular-nums ${weight === 2 ? "font-semibold text-[#007fe8]" : "text-slate-500"}`}
                  >
                    ×{weight}
                  </td>
                  <ScoreCells />
                  <NotesCell />
                  <ScoreCells />
                  <NotesCell />
                  <ScoreCells />
                  <NotesCell />
                </tr>
              );
            })}
            {/* Total row */}
            <tr className="border-t-2 border-slate-300 bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-700">
              <td className="px-2 py-3" colSpan={2}>
                Weighted total / {SCORE_GRID_MAX}
              </td>
              {[0, 1, 2].map((c) => (
                <td
                  key={c}
                  className="px-2 py-3 text-center tabular-nums"
                  colSpan={2}
                >
                  <span className="inline-block min-w-[64px] border-b border-slate-400">
                    &nbsp;&nbsp;&nbsp;
                  </span>{" "}
                  / {SCORE_GRID_MAX}
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* Stop-sign rules */}
        <section className="mt-5 grid grid-cols-2 gap-5">
          <div className="rounded-[6px] border border-amber-300 bg-amber-50/70 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-800">
              ⚠ Stop-sign rule
            </p>
            <p className="mt-1.5 text-[11px] leading-[1.5] text-amber-900">
              Any{" "}
              <span className="font-semibold">0 on Q1 (fee disclosure)</span>{" "}
              or{" "}
              <span className="font-semibold">
                Q3 (fixed vs pass-through)
              </span>{" "}
              disqualifies regardless of total. Both are non-negotiable
              transparency questions — vague answers here mean the rest of the
              score is unreliable.
            </p>
          </div>
          <div className="rounded-[6px] border border-slate-200 bg-white px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              How to score
            </p>
            <p className="mt-1.5 text-[11px] leading-[1.5] text-slate-700">
              Circle 0 / 1 / 2 during each call. If they can&apos;t answer,
              score 0 and ask them to send the answer in writing. The notes
              column is for the words you&apos;ll want when you compare brokers
              an hour later.
            </p>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function ColumnHead({ label }: { label: string }) {
  return (
    <th className="px-2 py-2 align-bottom" style={{ width: "8%" }}>
      <span className="block text-[10px] font-semibold leading-tight text-slate-700">
        {label}
      </span>
      <span className="block text-[8px] font-medium uppercase tracking-[0.12em] text-slate-400">
        0 / 1 / 2
      </span>
    </th>
  );
}

function NotesHead() {
  return (
    <th
      className="px-2 py-2 align-bottom text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-500"
      style={{ width: "12%" }}
    >
      Notes
    </th>
  );
}

function ScoreCells() {
  return (
    <td className="px-2 py-2.5 text-center align-top">
      <div className="flex items-center justify-center gap-1.5">
        {[0, 1, 2].map((v) => (
          <span
            key={v}
            aria-hidden
            className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 text-[9px] tabular-nums text-slate-400"
          >
            {v}
          </span>
        ))}
      </div>
    </td>
  );
}

function NotesCell() {
  return (
    <td className="border-l border-slate-100 px-2 py-2.5 align-top">
      <div className="space-y-[6px] pt-1">
        <div className="h-px bg-slate-200" />
        <div className="h-px bg-slate-200" />
      </div>
    </td>
  );
}

function ScoringLegend() {
  return (
    <div className="flex shrink-0 gap-3 rounded-[6px] border border-slate-200 bg-slate-50/60 px-4 py-2.5 text-[10px]">
      <Legend bullet="0" label="Vague / red flag" />
      <Legend bullet="1" label="Partial" />
      <Legend bullet="2" label="Clear & specific" />
    </div>
  );
}

function Legend({ bullet, label }: { bullet: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-400 text-[9px] font-semibold tabular-nums text-slate-700">
        {bullet}
      </span>
      <span className="text-slate-600">{label}</span>
    </div>
  );
}
