"use client";

interface KineticIndicatorProps {
  size?: "sm" | "md";
  className?: string;
}

/**
 * Abstract energy-flow indicator. Three vertical bars with phase-offset opacity
 * pulses. Reads as "kinetic energy" without using literal energy clipart
 * (no lightning bolts, no sun/wind icons — explicit Phase 0 avoid-list item).
 */
export function KineticIndicator({ size = "md", className = "" }: KineticIndicatorProps) {
  const dims = size === "sm" ? { w: 32, h: 24, bar: 4, gap: 4 } : { w: 56, h: 40, bar: 6, gap: 6 };
  const barX = (i: number) => i * (dims.bar + dims.gap);

  return (
    <svg
      width={dims.w}
      height={dims.h}
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      role="img"
      aria-label="Energy indicator"
      className={className}
    >
      <rect
        x={barX(0)}
        y={dims.h * 0.3}
        width={dims.bar}
        height={dims.h * 0.7}
        rx={dims.bar / 2}
        fill="var(--v2-accent)"
        className="kinetic-bar kinetic-bar-1"
      />
      <rect
        x={barX(1)}
        y={dims.h * 0.1}
        width={dims.bar}
        height={dims.h * 0.9}
        rx={dims.bar / 2}
        fill="var(--v2-accent)"
        className="kinetic-bar kinetic-bar-2"
      />
      <rect
        x={barX(2)}
        y={dims.h * 0.4}
        width={dims.bar}
        height={dims.h * 0.6}
        rx={dims.bar / 2}
        fill="var(--v2-accent)"
        className="kinetic-bar kinetic-bar-3"
      />
    </svg>
  );
}
