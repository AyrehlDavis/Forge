"use client";

import { properties, formatCurrency } from "../data";

const TIMELINE_START = new Date("2023-07-01");
const TIMELINE_END = new Date("2028-12-31");
const TOTAL_MONTHS =
  (TIMELINE_END.getFullYear() - TIMELINE_START.getFullYear()) * 12 +
  (TIMELINE_END.getMonth() - TIMELINE_START.getMonth());

function monthDiff(start: Date, end: Date): number {
  return (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
}

function getBarStyle(contractStart: string, contractEnd: string) {
  const start = new Date(contractStart);
  const end = new Date(contractEnd);
  const leftMonths = monthDiff(TIMELINE_START, start);
  const durationMonths = monthDiff(start, end);
  const left = (leftMonths / TOTAL_MONTHS) * 100;
  const width = (durationMonths / TOTAL_MONTHS) * 100;
  return { left: `${left}%`, width: `${Math.max(width, 0.5)}%` };
}

const yearMarkers: { year: number; left: string }[] = [];
for (let y = 2024; y <= 2028; y++) {
  const m = monthDiff(TIMELINE_START, new Date(`${y}-01-01`));
  yearMarkers.push({ year: y, left: `${(m / TOTAL_MONTHS) * 100}%` });
}

const TODAY = new Date("2026-04-30");
const todayLeft = `${(monthDiff(TIMELINE_START, TODAY) / TOTAL_MONTHS) * 100}%`;

const sorted = [...properties].sort(
  (a, b) => new Date(a.contractEnd).getTime() - new Date(b.contractEnd).getTime()
);

const barColors: Record<string, string> = {
  active: "bg-arise-600",
  expiring: "bg-amber-500",
  expired: "bg-red-400",
};

export default function ContractTimeline() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contract Timeline</h1>
        <p className="text-gray-500 mt-1">
          Visual overview of all energy contracts across the portfolio
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-6 mb-6 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-arise-600" /> Active
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500" /> Expiring Soon
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-400" /> Expired
        </div>
        <div className="flex items-center gap-2">
          <div className="w-0.5 h-3 bg-arise-800" /> Today
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        {/* Year headers */}
        <div className="relative h-8 border-b border-gray-200/40 bg-white/30">
          {yearMarkers.map((ym) => (
            <div
              key={ym.year}
              className="absolute top-0 h-full flex items-center text-xs text-gray-500 font-medium"
              style={{ left: ym.left }}
            >
              <div className="border-l border-gray-300/60 h-full" />
              <span className="pl-2">{ym.year}</span>
            </div>
          ))}
          <div className="absolute top-0 h-full" style={{ left: todayLeft }}>
            <div className="w-0.5 h-full bg-arise-800" />
          </div>
        </div>

        {/* Rows */}
        {sorted.map((property) => {
          const style = getBarStyle(property.contractStart, property.contractEnd);
          return (
            <div
              key={property.id}
              className="flex items-center border-b border-gray-200/30 hover:bg-white/40 transition-colors"
            >
              <div className="w-56 shrink-0 px-4 py-3 border-r border-gray-200/40">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {property.name}
                </div>
                <div className="text-xs text-gray-400">
                  {property.city}, {property.state} · {formatCurrency(property.monthlyCost)}/mo
                </div>
              </div>

              <div className="flex-1 relative h-14 px-2">
                {yearMarkers.map((ym) => (
                  <div
                    key={ym.year}
                    className="absolute top-0 h-full border-l border-gray-200/30"
                    style={{ left: ym.left }}
                  />
                ))}
                <div
                  className="absolute top-0 h-full w-0.5 bg-arise-800/20"
                  style={{ left: todayLeft }}
                />
                <div
                  className={`absolute top-3 h-8 ${barColors[property.status]} rounded-lg opacity-85 hover:opacity-100 transition-opacity cursor-default flex items-center justify-center`}
                  style={style}
                  title={`${property.supplier} — ${property.contractType}\n${property.contractStart} to ${property.contractEnd}`}
                >
                  <span className="text-[10px] font-medium text-white truncate px-2">
                    {property.supplier.split(" ")[0]} · {property.contractType}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {[
          {
            label: "Earliest Expiry",
            value: new Date(sorted[0].contractEnd).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            sub: sorted[0].name,
          },
          {
            label: "Latest Expiry",
            value: new Date(sorted[sorted.length - 1].contractEnd).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
            sub: sorted[sorted.length - 1].name,
          },
          {
            label: "Avg Contract Length",
            value: `${Math.round(properties.reduce((s, p) => s + monthDiff(new Date(p.contractStart), new Date(p.contractEnd)), 0) / properties.length)} months`,
            sub: `Across ${properties.length} contracts`,
          },
          {
            label: "Renewal Windows",
            value: `${properties.filter((p) => p.status === "expiring").length} upcoming`,
            sub: "Within next 90 days",
            warn: true,
          },
        ].map((card) => (
          <div key={card.label} className="glass-panel rounded-2xl p-4">
            <div className="text-xs text-gray-500 uppercase tracking-wider">{card.label}</div>
            <div className={`text-lg font-semibold mt-1 ${card.warn ? "text-amber-600" : "text-gray-900"}`}>
              {card.value}
            </div>
            <div className="text-xs text-gray-400">{card.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
