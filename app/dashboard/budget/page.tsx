"use client";

import {
  Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend, ComposedChart, Line,
} from "recharts";
import { generatePortfolioBudget, formatCurrency } from "../data";

export default function BudgetVsActual() {
  const data = generatePortfolioBudget();
  const totalActual = data.filter((d) => d.actual > 0).reduce((s, d) => s + d.actual, 0);
  const totalBudgetPast = data.filter((d) => d.actual > 0).reduce((s, d) => s + d.budget, 0);
  const totalVariance = totalActual - totalBudgetPast;
  const variancePct = ((totalVariance / totalBudgetPast) * 100).toFixed(1);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Budget vs Actual</h1>
        <p className="text-gray-500 mt-1">
          Portfolio-level energy spend tracking with forecast
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">YTD Actual</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalActual)}</div>
          <div className="text-xs text-gray-400 mt-1">12 months trailing</div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">YTD Budget</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalBudgetPast)}</div>
          <div className="text-xs text-gray-400 mt-1">12 months trailing</div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Variance</div>
          <div className={`text-2xl font-bold ${totalVariance > 0 ? "text-red-600" : "text-green-600"}`}>
            {totalVariance > 0 ? "+" : ""}
            {formatCurrency(totalVariance)}
          </div>
          <div className={`text-xs mt-1 ${totalVariance > 0 ? "text-red-500" : "text-green-500"}`}>
            {totalVariance > 0 ? "+" : ""}
            {variancePct}% vs budget
          </div>
        </div>
        <div className="glass-panel rounded-2xl p-5">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Projected Annual</div>
          <div className="text-2xl font-bold text-arise-700">
            {formatCurrency(Math.round(totalActual * (15 / 12)))}
          </div>
          <div className="text-xs text-gray-400 mt-1">Based on 12mo trailing avg</div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-panel rounded-2xl p-6 mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">
          Monthly Budget vs Actual with Forecast
        </h3>
        <ResponsiveContainer width="100%" height={380}>
          <ComposedChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              tickFormatter={(v) => v.split(" ")[0].slice(0, 3)}
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
              formatter={(value: number, name: string) => {
                if (value === 0 || value === null) return [null, null];
                return [formatCurrency(value), name];
              }}
              labelStyle={{ color: "#6b7280" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar dataKey="budget" name="Budget" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="#198a8a" radius={[4, 4, 0, 0]} />
            <Line
              dataKey="forecast"
              name="Forecast"
              stroke="#0f5454"
              strokeWidth={2}
              strokeDasharray="6 3"
              dot={{ fill: "#0f5454", r: 3 }}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200/40">
          <h3 className="font-semibold text-gray-900">Monthly Detail</h3>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200/40 bg-white/30">
              <th className="text-left px-6 py-3 font-medium">Month</th>
              <th className="text-right px-6 py-3 font-medium">Budget</th>
              <th className="text-right px-6 py-3 font-medium">Actual</th>
              <th className="text-right px-6 py-3 font-medium">Variance</th>
              <th className="text-right px-6 py-3 font-medium">Variance %</th>
              <th className="text-right px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const actual = row.actual || row.forecast || 0;
              const variance = actual - row.budget;
              const variancePctRow = row.budget > 0 ? ((variance / row.budget) * 100).toFixed(1) : "—";
              const isForecast = row.forecast !== null;
              return (
                <tr key={row.month} className="border-b border-gray-200/30 hover:bg-white/40">
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {row.month}
                    {isForecast && (
                      <span className="ml-2 text-xs text-arise-600 italic">forecast</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-right text-gray-500 font-mono">
                    {formatCurrency(row.budget)}
                  </td>
                  <td className="px-6 py-3 text-sm text-right font-mono text-gray-900">
                    {isForecast ? (
                      <span className="text-arise-700">{formatCurrency(row.forecast!)}</span>
                    ) : row.actual > 0 ? (
                      formatCurrency(row.actual)
                    ) : (
                      "—"
                    )}
                  </td>
                  <td
                    className={`px-6 py-3 text-sm text-right font-mono ${
                      variance > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {variance > 0 ? "+" : ""}
                    {formatCurrency(variance)}
                  </td>
                  <td
                    className={`px-6 py-3 text-sm text-right font-mono ${
                      variance > 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {variance > 0 ? "+" : ""}
                    {variancePctRow}%
                  </td>
                  <td className="px-6 py-3 text-right">
                    {isForecast ? (
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-arise-50 text-arise-700 border border-arise-200">
                        Projected
                      </span>
                    ) : variance > 0 ? (
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-red-50 text-red-600 border border-red-200">
                        Over
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-green-50 text-green-600 border border-green-200">
                        Under
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
