"use client";

import { useState } from "react";
import type { Property } from "../data";
import { formatCurrency, formatRate, daysUntil } from "../data";
import ContractRing from "./ContractRing";

interface ExpandableRowProps {
  property: Property;
}

export default function ExpandableRow({ property }: ExpandableRowProps) {
  const [expanded, setExpanded] = useState(false);
  const days = daysUntil(property.contractEnd);

  const passThroughItems = [
    { label: "Supply", value: property.supplyRate },
    { label: "Distribution", value: property.distributionRate },
    { label: "Capacity", value: property.capacityRate },
    { label: "Transmission", value: property.transmissionRate },
  ];
  const totalRate = passThroughItems.reduce((s, i) => s + i.value, 0);

  return (
    <tr
      className="border-b border-gray-200/30 cursor-pointer transition-colors hover:bg-white/40"
      onClick={() => setExpanded(!expanded)}
    >
      <td colSpan={8} className="p-0">
        <div className="px-6 py-3 flex items-center gap-4">
          {/* Expand chevron */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className={`text-gray-400 transition-transform duration-200 shrink-0 ${expanded ? "rotate-90" : ""}`}
          >
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 text-sm">{property.name}</div>
            <div className="text-xs text-gray-400">{property.address}, {property.city}</div>
          </div>
        </div>

        {/* Expanded detail panel */}
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: expanded ? "220px" : "0", opacity: expanded ? 1 : 0 }}
        >
          <div className="px-6 pb-4 pt-1">
            <div className="glass-panel rounded-xl p-4 grid grid-cols-4 gap-4 text-xs">
              {/* Contract info */}
              <div className="space-y-2">
                <div className="font-medium text-gray-700 text-[11px] uppercase tracking-wider">Contract</div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Supplier</span>
                  <span className="text-gray-900 font-medium">{property.supplier}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type</span>
                  <span className="text-gray-900">{property.contractType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Volume</span>
                  <span className="text-gray-900">{property.annualVolumeMwh.toLocaleString()} MWh/yr</span>
                </div>
              </div>

              {/* Term progress */}
              <div className="space-y-2">
                <div className="font-medium text-gray-700 text-[11px] uppercase tracking-wider">Term</div>
                <div className="flex items-center gap-3">
                  <ContractRing startDate={property.contractStart} endDate={property.contractEnd} size={44} />
                  <div>
                    <div className="text-gray-900 font-medium">
                      {new Date(property.contractStart).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
                      {" — "}
                      {new Date(property.contractEnd).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
                    </div>
                    <div className={`mt-0.5 ${days <= 0 ? "text-red-600" : days <= 90 ? "text-amber-600" : "text-gray-400"}`}>
                      {days <= 0 ? "Expired" : `${days}d remaining`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate breakdown */}
              <div className="space-y-2">
                <div className="font-medium text-gray-700 text-[11px] uppercase tracking-wider">Rate Breakdown</div>
                {passThroughItems.map((item) => (
                  <div key={item.label} className="flex justify-between">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-gray-900 font-mono">${(item.value * 100).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-gray-200/50 pt-1 font-medium">
                  <span className="text-gray-500">All-in</span>
                  <span className="text-gray-900 font-mono">${(totalRate * 100).toFixed(2)}/kWh</span>
                </div>
              </div>

              {/* Cost summary */}
              <div className="space-y-2">
                <div className="font-medium text-gray-700 text-[11px] uppercase tracking-wider">Cost</div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly</span>
                  <span className="text-gray-900 font-medium font-mono">{formatCurrency(property.monthlyCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Budget</span>
                  <span className="text-gray-900 font-mono">{formatCurrency(property.budgetMonthlyCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Variance</span>
                  {(() => {
                    const v = property.monthlyCost - property.budgetMonthlyCost;
                    return (
                      <span className={`font-mono font-medium ${v > 0 ? "text-red-600" : "text-green-700"}`}>
                        {v > 0 ? "+" : ""}{formatCurrency(v)}
                      </span>
                    );
                  })()}
                </div>
                {property.currentRate > property.marketRate && (
                  <div className="flex justify-between border-t border-gray-200/50 pt-1">
                    <span className="text-gray-400">Saving opp.</span>
                    <span className="text-green-700 font-medium font-mono">
                      {formatCurrency((property.currentRate - property.marketRate) * property.monthlyUsageKwh * 12)}/yr
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}
