"use client";

import { useState } from "react";
import Link from "next/link";
import {
  properties,
  formatCurrency,
  formatRate,
  getStatusBg,
  getStatusLabel,
  getExpiringCount,
  getTotalMonthlyCost,
  getEstimatedSavings,
  daysUntil,
  type Property,
} from "./data";
import AnimatedNumber from "./components/AnimatedNumber";
import ContractRing from "./components/ContractRing";
import SavingsTooltip from "./components/SavingsTooltip";

type SortKey = "name" | "state" | "cost" | "end" | "status";
type SortDir = "asc" | "desc";

function sortProperties(list: Property[], key: SortKey, dir: SortDir): Property[] {
  const sorted = [...list].sort((a, b) => {
    switch (key) {
      case "name": return a.name.localeCompare(b.name);
      case "state": return a.state.localeCompare(b.state);
      case "cost": return a.monthlyCost - b.monthlyCost;
      case "end": return new Date(a.contractEnd).getTime() - new Date(b.contractEnd).getTime();
      case "status": {
        const order = { expired: 0, expiring: 1, active: 2 };
        return order[a.status] - order[b.status];
      }
    }
  });
  return dir === "desc" ? sorted.reverse() : sorted;
}

function SortButton({ label, sortKey, currentKey, currentDir, onSort }: {
  label: string;
  sortKey: SortKey;
  currentKey: SortKey;
  currentDir: SortDir;
  onSort: (key: SortKey) => void;
}) {
  const active = currentKey === sortKey;
  return (
    <button
      className={`inline-flex items-center gap-1 hover:text-gray-700 transition-colors ${active ? "text-gray-700" : ""}`}
      onClick={() => onSort(sortKey)}
    >
      {label}
      {active && (
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path
            d={currentDir === "asc" ? "M2 6l3-3 3 3" : "M2 4l3 3 3-3"}
            stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

export default function PortfolioOverview() {
  const totalMonthly = getTotalMonthlyCost();
  const expiringCount = getExpiringCount();
  const estimatedSavings = getEstimatedSavings();
  const expiredCount = properties.filter((p) => p.status === "expired").length;

  const [sortKey, setSortKey] = useState<SortKey>("cost");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const sorted = sortProperties(properties, sortKey, sortDir);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Overview</h1>
        <p className="text-gray-500 mt-1">
          CBRE Commercial Portfolio — {properties.length} properties across{" "}
          {new Set(properties.map((p) => p.state)).size} states
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Total Monthly Spend</div>
          <div className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={totalMonthly} format={formatCurrency} />
          </div>
          <div className="text-xs text-gray-400 mt-1">{properties.length} properties</div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Properties</div>
          <div className="text-2xl font-bold text-gray-900">
            <AnimatedNumber value={properties.length} />
          </div>
          <div className="text-xs text-gray-400 mt-1">{new Set(properties.map((p) => p.state)).size} states</div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Expiring in 90 Days</div>
          <div className="text-2xl font-bold text-amber-600">
            <AnimatedNumber value={expiringCount} />
          </div>
          <div className="text-xs text-gray-400 mt-1">{expiredCount > 0 ? `${expiredCount} already expired` : "All contracts current"}</div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Savings Opportunity</div>
          <div className="text-2xl font-bold text-green-700">
            <AnimatedNumber value={estimatedSavings} format={formatCurrency} />
          </div>
          <div className="text-xs text-gray-400 mt-1">vs. current market rates</div>
        </div>
      </div>

      {/* Property List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-gray-200/40 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Properties</h2>
          <div className="flex gap-2 text-xs">
            <span className="px-2 py-1 rounded-lg bg-green-50 text-green-700 border border-green-200">
              {properties.filter((p) => p.status === "active").length} Active
            </span>
            <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
              {properties.filter((p) => p.status === "expiring").length} Expiring
            </span>
            <span className="px-2 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">
              {expiredCount} Expired
            </span>
          </div>
        </div>

        {/* Column header */}
        <div className="px-6 py-2.5 border-b border-gray-200/40 bg-white/30 text-xs text-gray-500 uppercase tracking-wider grid items-center" style={{ gridTemplateColumns: "24px 2.5fr 0.6fr 1.2fr 1.2fr 1.2fr" }}>
          <div />
          <div><SortButton label="Property" sortKey="name" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} /></div>
          <div className="text-center"><SortButton label="State" sortKey="state" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} /></div>
          <div className="text-right"><SortButton label="Cost" sortKey="cost" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} /></div>
          <div className="text-center"><SortButton label="Term" sortKey="end" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} /></div>
          <div className="text-center"><SortButton label="Status" sortKey="status" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} /></div>
        </div>

        {/* Rows */}
        <div>
          {sorted.map((property) => {
            const days = daysUntil(property.contractEnd);
            const overMarket = property.currentRate > property.marketRate;
            const isExpanded = expandedId === property.id;

            return (
              <div key={property.id} className="border-b border-gray-200/30">
                {/* Main row */}
                <div
                  className="px-6 py-3 grid items-center cursor-pointer transition-colors hover:bg-white/40 group"
                  style={{ gridTemplateColumns: "24px 2.5fr 0.6fr 1.2fr 1.2fr 1.2fr" }}
                  onClick={() => setExpandedId(isExpanded ? null : property.id)}
                >
                  {/* Chevron */}
                  <div className="flex items-center justify-center">
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`text-gray-300 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    >
                      <path d="M4 2.5l3.5 3.5-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  {/* Name */}
                  <div className="min-w-0 pr-4">
                    <div className="font-medium text-gray-900 text-sm truncate">{property.name}</div>
                    <div className="text-xs text-gray-400 truncate">{property.address}, {property.city}</div>
                  </div>

                  {/* State */}
                  <div className="text-center text-sm text-gray-500">{property.state}</div>

                  {/* Cost + rate */}
                  <div className="text-right pr-2">
                    <div className="text-sm font-medium text-gray-900 font-mono">{formatCurrency(property.monthlyCost)}</div>
                    <SavingsTooltip currentRate={property.currentRate} marketRate={property.marketRate} monthlyUsageKwh={property.monthlyUsageKwh}>
                      <div className={`text-[11px] font-mono ${overMarket ? "text-red-500 underline decoration-dotted cursor-help" : "text-gray-400"}`}>
                        {formatRate(property.currentRate)}
                      </div>
                    </SavingsTooltip>
                  </div>

                  {/* Term ring */}
                  <div className="flex items-center justify-center gap-2">
                    <ContractRing startDate={property.contractStart} endDate={property.contractEnd} size={28} />
                    <div className="text-xs text-gray-600">
                      {new Date(property.contractEnd).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center gap-3">
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${getStatusBg(property.status)}`}>
                      {getStatusLabel(property.status)}
                    </span>
                    <Link
                      href={`/dashboard/property/${property.id}`}
                      className="text-xs text-arise-700 hover:text-arise-900 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      →
                    </Link>
                  </div>
                </div>

                {/* Expanded detail */}
                <div
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ maxHeight: isExpanded ? "180px" : "0", opacity: isExpanded ? 1 : 0 }}
                >
                  <div className="px-6 pb-4 pl-12">
                    <div className="glass-panel rounded-xl p-4 grid grid-cols-3 gap-8 text-xs">
                      {/* Contract */}
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider mb-1">Contract</div>
                        <Row label="Supplier" value={property.supplier} />
                        <Row label="Type" value={property.contractType} />
                        <Row label="Volume" value={`${property.annualVolumeMwh.toLocaleString()} MWh/yr`} />
                        <Row label="Capacity" value={`${property.capacityTag.toLocaleString()} kW`} />
                      </div>

                      {/* Rate Breakdown */}
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider mb-1">Rate Breakdown</div>
                        <Row label="Supply" value={`$${(property.supplyRate * 100).toFixed(2)}`} mono />
                        <Row label="Distribution" value={`$${(property.distributionRate * 100).toFixed(2)}`} mono />
                        <Row label="Capacity" value={`$${(property.capacityRate * 100).toFixed(2)}`} mono />
                        <Row label="Transmission" value={`$${(property.transmissionRate * 100).toFixed(2)}`} mono />
                      </div>

                      {/* Cost & Market */}
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-700 text-[11px] uppercase tracking-wider mb-1">Cost & Market</div>
                        <Row label="Monthly" value={formatCurrency(property.monthlyCost)} mono />
                        <Row label="Budget" value={formatCurrency(property.budgetMonthlyCost)} mono />
                        <Row
                          label="Variance"
                          value={`${property.monthlyCost > property.budgetMonthlyCost ? "+" : ""}${formatCurrency(property.monthlyCost - property.budgetMonthlyCost)}/mo`}
                          mono
                          color={property.monthlyCost > property.budgetMonthlyCost ? "text-red-600" : "text-green-700"}
                        />
                        {overMarket && (
                          <div className="pt-1 border-t border-gray-200/50">
                            <Row
                              label="Savings opp."
                              value={`${formatCurrency((property.currentRate - property.marketRate) * property.monthlyUsageKwh * 12)}/yr`}
                              mono
                              color="text-green-700"
                              bold
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono, color, bold }: {
  label: string;
  value: string;
  mono?: boolean;
  color?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className={`truncate ${mono ? "font-mono" : ""} ${color || "text-gray-900"} ${bold ? "font-semibold" : ""}`}>
        {value}
      </span>
    </div>
  );
}
