"use client";

interface ContractRingProps {
  startDate: string;
  endDate: string;
  size?: number;
}

export default function ContractRing({ startDate, endDate, size = 32 }: ContractRingProps) {
  const now = new Date("2026-04-30").getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const total = end - start;
  const elapsed = now - start;
  const pct = Math.max(0, Math.min(1, elapsed / total));
  const remaining = Math.max(0, 1 - pct);

  const r = (size - 4) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * remaining;

  // Color based on how much is left
  let color = "#147070"; // arise-700
  if (pct > 0.85) color = "#d97706"; // amber
  if (pct >= 1) color = "#dc2626"; // red

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={3}
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <span className="absolute text-[8px] font-medium text-gray-500">
        {Math.round(pct * 100)}%
      </span>
    </div>
  );
}
