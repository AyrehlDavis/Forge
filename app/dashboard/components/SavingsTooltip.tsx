"use client";

import { useState, useRef } from "react";
import { formatCurrency, formatRate } from "../data";

interface SavingsTooltipProps {
  currentRate: number;
  marketRate: number;
  monthlyUsageKwh: number;
  children: React.ReactNode;
}

export default function SavingsTooltip({
  currentRate,
  marketRate,
  monthlyUsageKwh,
  children,
}: SavingsTooltipProps) {
  const [show, setShow] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const overMarket = currentRate > marketRate;
  if (!overMarket) return <>{children}</>;

  const monthlySavings = (currentRate - marketRate) * monthlyUsageKwh;
  const annualSavings = monthlySavings * 12;

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        clearTimeout(timeout.current);
        setShow(true);
      }}
      onMouseLeave={() => {
        timeout.current = setTimeout(() => setShow(false), 150);
      }}
    >
      {children}
      {show && (
        <div className="absolute z-50 right-0 top-full mt-1 w-56 p-3 rounded-xl text-xs animate-[fadeIn_0.15s_ease-out]"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div className="font-medium text-gray-900 mb-2">Savings Opportunity</div>
          <div className="space-y-1.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Current rate</span>
              <span className="text-red-600 font-mono">{formatRate(currentRate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Market rate</span>
              <span className="text-gray-900 font-mono">{formatRate(marketRate)}</span>
            </div>
            <div className="border-t border-gray-200/60 pt-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly savings</span>
                <span className="text-green-700 font-medium font-mono">{formatCurrency(monthlySavings)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-gray-500">Annual savings</span>
                <span className="text-green-700 font-bold font-mono">{formatCurrency(annualSavings)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
