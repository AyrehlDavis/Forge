import { STATE_PATHS } from "../_config/state-paths";

// Texas outline — extracted from the existing state-paths.ts Albers-USA
// projection. The path coords occupy roughly x:[277-476], y:[282-477] in the
// full 800x500 US viewBox, so we crop the viewBox tight to those bounds.
// Used as a watermark inside the verdict band + as the market-snapshot icon.

interface TexasOutlineProps {
  className?: string;
  strokeWidth?: number;
  showMarketTicks?: boolean;
}

const TX_VIEW_BOX = "277 282 200 196";

export function TexasOutline({
  className,
  strokeWidth = 1.5,
  showMarketTicks = false,
}: TexasOutlineProps) {
  return (
    <svg
      viewBox={TX_VIEW_BOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <path d={STATE_PATHS.TX} />
      {showMarketTicks && (
        <g opacity="0.6">
          {/* Vertical market ticks — abstract grid suggesting ERCOT load zones */}
          {[300, 330, 360, 390, 420, 450].map((x) => (
            <line key={`v-${x}`} x1={x} y1={300} x2={x} y2={310} strokeWidth={strokeWidth} />
          ))}
          {[330, 360, 390, 420].map((y) => (
            <line key={`h-${y}`} x1={290} y1={y} x2={300} y2={y} strokeWidth={strokeWidth} />
          ))}
        </g>
      )}
    </svg>
  );
}
