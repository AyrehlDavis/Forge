"use client";

import Link from "next/link";
import { use } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";
import {
  properties,
  generateCostHistory,
  formatCurrency,
  formatRate,
  getStatusBg,
  getStatusLabel,
  daysUntil,
} from "../../data";

// Arise teal palette for chart segments
const COLORS = ["#0f5454", "#198a8a", "#3dbdbd", "#a3e6e6"];

export default function PropertyDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const property = properties.find((p) => p.id === id);

  if (!property) {
    return (
      <div className="p-8">
        <p className="text-gray-500">Property not found.</p>
        <Link href="/dashboard" className="text-arise-700 hover:text-arise-900 text-sm mt-2 inline-block">
          ← Back to Portfolio
        </Link>
      </div>
    );
  }

  const costHistory = generateCostHistory(property);
  const days = daysUntil(property.contractEnd);
  const isRenewalWindow = days > 0 && days <= 90;
  const isExpired = days <= 0;

  const passThroughData = [
    { name: "Supply", value: property.supplyRate, pct: 0 },
    { name: "Capacity", value: property.capacityRate, pct: 0 },
    { name: "Transmission", value: property.transmissionRate, pct: 0 },
    { name: "Distribution", value: property.distributionRate, pct: 0 },
  ];
  const totalRate = passThroughData.reduce((s, d) => s + d.value, 0);
  passThroughData.forEach((d) => (d.pct = Math.round((d.value / totalRate) * 100)));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600 mb-2 inline-block">
          ← Back to Portfolio
        </Link>
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.name}</h1>
            <p className="text-gray-500 text-sm">
              {property.address}, {property.city}, {property.state} — {property.sqft.toLocaleString()} sq ft
            </p>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-lg border ${getStatusBg(property.status)}`}>
            {getStatusLabel(property.status)}
          </span>
        </div>
      </div>

      {/* Renewal Alert */}
      {(isRenewalWindow || isExpired) && (
        <div
          className={`mb-6 p-4 rounded-2xl border ${
            isExpired
              ? "bg-red-50/80 backdrop-blur-lg border-red-200"
              : "bg-amber-50/80 backdrop-blur-lg border-amber-200"
          }`}
        >
          <div className={`font-medium text-sm ${isExpired ? "text-red-700" : "text-amber-700"}`}>
            {isExpired
              ? "Contract Expired — Operating on holdover rates"
              : `Contract expires in ${days} days — Renewal action required`}
          </div>
          <p className={`text-xs mt-1 ${isExpired ? "text-red-600/70" : "text-amber-600/70"}`}>
            {isExpired
              ? "This property's contract has expired. Holdover rates are typically 10-20% above contracted rates. Contact your broker to negotiate renewal."
              : "Begin renewal negotiations now to ensure rate continuity and avoid holdover pricing."}
          </p>
        </div>
      )}

      {/* Contract Details + Chart */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-panel rounded-2xl p-5 col-span-1">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            Contract Details
          </h3>
          <div className="space-y-3">
            {[
              ["Supplier", property.supplier],
              ["Product Type", property.contractType],
              ["Current Rate", formatRate(property.currentRate)],
              ["Market Rate", formatRate(property.marketRate)],
              ["Start Date", new Date(property.contractStart).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })],
              ["End Date", new Date(property.contractEnd).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })],
              ["Annual Volume", `${property.annualVolumeMwh.toLocaleString()} MWh`],
              ["Capacity Tag", `${property.capacityTag.toLocaleString()} kW`],
              ["Monthly Cost", formatCurrency(property.monthlyCost)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-900 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 col-span-2">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
            Cost History — Last 12 Months
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costHistory} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(v) => v.split(" ")[0]}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255,255,255,0.85)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                }}
                formatter={(value: number) => [formatCurrency(value), ""]}
                labelStyle={{ color: "#6b7280" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="actual" name="Actual" fill="#198a8a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="budget" name="Budget" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pass-through Breakdown */}
      <div className="glass-panel rounded-2xl p-5">
        <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
          Rate Component Breakdown
        </h3>
        <div className="flex items-center gap-8">
          <div className="w-52 h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={passThroughData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  dataKey="value"
                  stroke="none"
                >
                  {passThroughData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`$${(value * 100).toFixed(2)}/kWh`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {passThroughData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[i] }} />
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <span className="text-sm font-mono text-gray-900">
                      ${(item.value * 100).toFixed(2)}/kWh
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${item.pct}%`, backgroundColor: COLORS[i] }}
                    />
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{item.pct}% of total rate</div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider">All-in Rate</div>
            <div className="text-2xl font-bold text-gray-900 font-mono mt-1">
              ${(totalRate * 100).toFixed(2)}<span className="text-sm text-gray-400">/kWh</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {formatCurrency(totalRate * property.monthlyUsageKwh)}/mo estimated
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
