"use client";

import { useEffect, useRef, useState } from "react";

interface StatCountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  formatter?: (n: number) => string;
}

function defaultFormatter(n: number): string {
  return Math.round(n).toLocaleString();
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function StatCountUp({
  value,
  prefix = "",
  suffix = "",
  durationMs = 600,
  formatter = defaultFormatter,
}: StatCountUpProps) {
  const reduce = prefersReducedMotion();
  const [animated, setAnimated] = useState<number>(() => (reduce ? value : 0));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) return;

    const start = performance.now();
    const from = 0;
    const to = value;

    function tick(now: number) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(from + (to - from) * eased);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, durationMs, reduce]);

  const display = reduce ? value : animated;

  return (
    <span aria-label={`${prefix}${formatter(value)}${suffix}`} className="tabular-nums">
      {prefix}
      {formatter(display)}
      {suffix}
    </span>
  );
}
