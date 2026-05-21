"use client";

import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import { properties, formatCurrency, formatRate, type Property } from "../data";

type Scenario = {
  propertyId: string;
  newRate: number;
};

const renewableProperties = properties.filter(
  (p) => p.status === "expiring" || p.status === "expired"
);

const activeProperties = properties.filter((p) => p.status === "active");

export default function ScenarioPlanner() {
  // Rate adjustment scenarios per renewable property
  const [scenarios, setScenarios] = useState<Scenario[]>(
    renewableProperties.map((p) => ({ propertyId: p.id, newRate: p.marketRate }))
  );

  // Portfolio-wide rate shock (%)
  const [rateShock, setRateShock] = useState(0);

  const updateScenario = (propertyId: string, newRate: number) => {
    setScenarios((prev) =>
      prev.map((s) => (s.propertyId === propertyId ? { ...s, newRate } : s))
    );
  };

  // Calculate impacts
  const analysis = useMemo(() => {
    const currentMonthly = properties.reduce((s, p) => s + p.monthlyCost, 0);
    const currentAnnual = currentMonthly * 12;

    // Scenario monthly: renewable properties at new rates, active at current + shock
    let scenarioMonthly = 0;
    for (const p of properties) {
      const scenario = scenarios.find((s) => s.propertyId === p.id);
      if (scenario) {
        // Renewable property — use scenario rate
        const totalNonSupply = p.transmissionRate + p.distributionRate + p.capacityRate;
        const newAllIn = scenario.newRate + totalNonSupply;
        const shockMultiplier = 1 + rateShock / 100;
        scenarioMonthly += newAllIn * shockMultiplier * p.monthlyUsageKwh;
      } else {
        // Active property — apply shock only
        const shockMultiplier = 1 + rateShock / 100;
        scenarioMonthly += p.monthlyCost * shockMultiplier;
      }
    }
    const scenarioAnnual = scenarioMonthly * 12;
    const monthlySavings = currentMonthly - scenarioMonthly;
    const annualSavings = currentAnnual - scenarioAnnual;

    // Per-property comparison for chart
    const comparison = renewableProperties.map((p) => {
      const scenario = scenarios.find((s) => s.propertyId === p.id)!;
      const totalNonSupply = p.transmissionRate + p.distributionRate + p.capacityRate;
      const newAllIn = scenario.newRate + totalNonSupply;
      const shockMultiplier = 1 + rateShock / 100;
      const newMonthlyCost = newAllIn * shockMultiplier * p.monthlyUsageKwh;
      return {
        name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name,
        current: p.monthlyCost,
        scenario: Math.round(newMonthlyCost),
        savings: Math.round(p.monthlyCost - newMonthlyCost),
      };
    });

    return { currentMonthly, currentAnnual, scenarioMonthly, scenarioAnnual, monthlySavings, annualSavings, comparison };
  }, [scenarios, rateShock]);

  const savingsPositive = analysis.annualSavings > 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Scenario Planner</h1>
        <p className="text-gray-500 mt-1">
          Model contract renewals and rate changes — see the impact before you commit
        </p>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Current Annual</div>
          <div className="text-2xl font-bold text-gray-900 font-mono">{formatCurrency(Math.round(analysis.currentAnnual))}</div>
          <div className="text-xs text-gray-400 mt-1">{properties.length} properties</div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Scenario Annual</div>
          <div className="text-2xl font-bold text-arise-700 font-mono">{formatCurrency(Math.round(analysis.scenarioAnnual))}</div>
          <div className="text-xs text-gray-400 mt-1">With proposed changes</div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Annual Savings</div>
          <div className={`text-2xl font-bold font-mono ${savingsPositive ? "text-green-700" : "text-red-600"}`}>
            {savingsPositive ? "" : "+"}{formatCurrency(Math.abs(Math.round(analysis.annualSavings)))}
          </div>
          <div className={`text-xs mt-1 ${savingsPositive ? "text-green-600" : "text-red-500"}`}>
            {savingsPositive ? "Projected savings" : "Projected increase"}
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Monthly Impact</div>
          <div className={`text-2xl font-bold font-mono ${savingsPositive ? "text-green-700" : "text-red-600"}`}>
            {savingsPositive ? "" : "+"}{formatCurrency(Math.abs(Math.round(analysis.monthlySavings)))}
          </div>
          <div className="text-xs text-gray-400 mt-1">Per month difference</div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6">
        {/* Left: Controls */}
        <div className="col-span-2 space-y-6">
          {/* Portfolio Rate Shock */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-gray-900 text-sm">Market Rate Stress Test</div>
                <div className="text-xs text-gray-400 mt-0.5">What if all rates shift?</div>
              </div>
              <div className={`text-lg font-bold font-mono ${rateShock > 0 ? "text-red-600" : rateShock < 0 ? "text-green-700" : "text-gray-500"}`}>
                {rateShock > 0 ? "+" : ""}{rateShock}%
              </div>
            </div>
            <input
              type="range"
              min={-20}
              max={30}
              step={1}
              value={rateShock}
              onChange={(e) => setRateShock(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-arise-600"
              style={{ background: `linear-gradient(to right, #147070 0%, #147070 ${((rateShock + 20) / 50) * 100}%, #e5e7eb ${((rateShock + 20) / 50) * 100}%, #e5e7eb 100%)` }}
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>-20%</span>
              <span>0%</span>
              <span>+30%</span>
            </div>
          </div>

          {/* Renewal Scenarios */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="font-semibold text-gray-900 text-sm mb-1">Contract Renewal Rates</div>
            <div className="text-xs text-gray-400 mb-4">
              {renewableProperties.length} contracts expiring — adjust the supply rate for each
            </div>

            <div className="space-y-5">
              {renewableProperties.map((property) => {
                const scenario = scenarios.find((s) => s.propertyId === property.id)!;
                const minRate = Math.round(property.marketRate * 0.8 * 10000) / 10000;
                const maxRate = Math.round(property.currentRate * 1.3 * 10000) / 10000;
                const isBelow = scenario.newRate < property.currentRate;

                return (
                  <div key={property.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{property.name}</div>
                        <div className="text-[11px] text-gray-400">
                          {property.city}, {property.state} · Currently {formatRate(property.currentRate)} · Market {formatRate(property.marketRate)}
                        </div>
                      </div>
                      <div className={`text-sm font-bold font-mono ${isBelow ? "text-green-700" : "text-red-600"}`}>
                        {formatRate(scenario.newRate)}
                      </div>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min={minRate}
                        max={maxRate}
                        step={0.0001}
                        value={scenario.newRate}
                        onChange={(e) => updateScenario(property.id, Number(e.target.value))}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-arise-600"
                        style={{
                          background: `linear-gradient(to right, #147070 0%, #147070 ${((scenario.newRate - minRate) / (maxRate - minRate)) * 100}%, #e5e7eb ${((scenario.newRate - minRate) / (maxRate - minRate)) * 100}%, #e5e7eb 100%)`
                        }}
                      />
                      {/* Market rate marker */}
                      <div
                        className="absolute top-0 w-px h-1.5 bg-gray-400"
                        style={{ left: `${((property.marketRate - minRate) / (maxRate - minRate)) * 100}%` }}
                        title="Market rate"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>{formatRate(minRate)}</span>
                      <span className="text-gray-500">▲ Mkt</span>
                      <span>{formatRate(maxRate)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick presets */}
            <div className="mt-5 pt-4 border-t border-gray-200/40">
              <div className="text-xs text-gray-500 mb-2">Quick scenarios</div>
              <div className="flex gap-2">
                <button
                  className="text-xs px-3 py-1.5 rounded-lg bg-arise-50 text-arise-700 border border-arise-200 hover:bg-arise-100 transition-colors"
                  onClick={() => setScenarios(renewableProperties.map((p) => ({ propertyId: p.id, newRate: p.marketRate })))}
                >
                  All at market
                </button>
                <button
                  className="text-xs px-3 py-1.5 rounded-lg bg-arise-50 text-arise-700 border border-arise-200 hover:bg-arise-100 transition-colors"
                  onClick={() => setScenarios(renewableProperties.map((p) => ({ propertyId: p.id, newRate: p.currentRate })))}
                >
                  Keep current
                </button>
                <button
                  className="text-xs px-3 py-1.5 rounded-lg bg-arise-50 text-arise-700 border border-arise-200 hover:bg-arise-100 transition-colors"
                  onClick={() => setScenarios(renewableProperties.map((p) => ({ propertyId: p.id, newRate: p.marketRate * 0.95 })))}
                >
                  5% below market
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Visualization */}
        <div className="col-span-3 space-y-6">
          {/* Comparison Chart */}
          <div className="glass-panel rounded-2xl p-5">
            <div className="font-semibold text-gray-900 text-sm mb-1">Renewal Cost Comparison</div>
            <div className="text-xs text-gray-400 mb-4">Current vs scenario monthly cost for expiring contracts</div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analysis.comparison} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={{ stroke: "#d1d5db" }} />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} axisLine={{ stroke: "#d1d5db" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.9)",
                    borderRadius: "12px",
                    fontSize: "12px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value: number, name: string) => [formatCurrency(value), name === "current" ? "Current" : "Scenario"]}
                  labelStyle={{ color: "#6b7280" }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="current" name="Current" fill="#9ca3af" radius={[4, 4, 0, 0]} />
                <Bar dataKey="scenario" name="Scenario" radius={[4, 4, 0, 0]}>
                  {analysis.comparison.map((entry, i) => (
                    <Cell key={i} fill={entry.savings > 0 ? "#147070" : "#dc2626"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detail table */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-200/40">
              <div className="font-semibold text-gray-900 text-sm">Scenario Detail</div>
            </div>
            <div className="divide-y divide-gray-200/30">
              {renewableProperties.map((property) => {
                const scenario = scenarios.find((s) => s.propertyId === property.id)!;
                const totalNonSupply = property.transmissionRate + property.distributionRate + property.capacityRate;
                const newAllIn = scenario.newRate + totalNonSupply;
                const shockMultiplier = 1 + rateShock / 100;
                const newMonthlyCost = Math.round(newAllIn * shockMultiplier * property.monthlyUsageKwh);
                const monthlySaving = property.monthlyCost - newMonthlyCost;
                const annualSaving = monthlySaving * 12;
                const positive = monthlySaving > 0;

                return (
                  <div key={property.id} className="px-5 py-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{property.name}</div>
                      <div className="text-[11px] text-gray-400">
                        {formatRate(property.currentRate)} → {formatRate(scenario.newRate)}
                        {rateShock !== 0 && <span className="ml-1 text-gray-500">({rateShock > 0 ? "+" : ""}{rateShock}% shock)</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 font-mono">
                        {formatCurrency(property.monthlyCost)} → {formatCurrency(newMonthlyCost)}
                      </div>
                      <div className={`text-xs font-mono ${positive ? "text-green-700" : "text-red-600"}`}>
                        {positive ? "Save " : "Adds "}{formatCurrency(Math.abs(annualSaving))}/yr
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Portfolio total */}
              <div className="px-5 py-3 flex items-center justify-between bg-white/30">
                <div className="text-sm font-semibold text-gray-900">Portfolio Total Impact</div>
                <div className="text-right">
                  <div className={`text-lg font-bold font-mono ${savingsPositive ? "text-green-700" : "text-red-600"}`}>
                    {savingsPositive ? "Save " : "Adds "}{formatCurrency(Math.abs(Math.round(analysis.annualSavings)))}/yr
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatCurrency(Math.abs(Math.round(analysis.monthlySavings)))}/mo
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
