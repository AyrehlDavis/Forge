"use client";

import { useEffect, useState } from "react";

// Stat-strip — compressed proof row that sits above the tool slice.
// Real numbers per Chris's 2026-05-20 pass. Numbers count up from 0 on
// first reveal (IntersectionObserver) for a small "this is real data" moment.

interface Stat {
  value: string;
  label: string;
  tempKey: string;
}

const STATS: Stat[] = [
  { value: "700+", label: "businesses served", tempKey: "stat-businesses" },
  { value: "20+", label: "active suppliers", tempKey: "stat-suppliers" },
  { value: "35", label: "markets covered", tempKey: "stat-markets" },
];

export function StatStrip() {
  return (
    <section
      aria-label="Arise Energy proof points"
      className="relative pb-6 pt-2 sm:pb-8 sm:pt-4 lg:pb-10 lg:pt-6"
    >
      <div className="mx-auto max-w-[1184px] px-5 sm:px-8">
        <ol className="grid grid-cols-3 gap-x-6 gap-y-5 border-y border-slate-200/70 py-5 sm:gap-x-8 sm:py-6 lg:gap-x-12">
          {STATS.map((s) => (
            <li
              key={s.tempKey}
              className="flex flex-col items-start gap-1"
            >
              <CountUp display={s.value} />
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:text-xs">
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// CountUp — parses the leading integer out of a display string like "700+",
// "22", "12 yr" and animates 0 → target over ~900ms with a 200ms delay on
// mount. SSR renders the target value (so non-JS users + crawlers see the
// final number); client-side JS resets to 0 then animates up. Honors
// prefers-reduced-motion by skipping the animation entirely.
function CountUp({ display }: { display: string }) {
  const match = display.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : display;

  // SSR: target. Client mount: reset to 0 in effect, then animate up.
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (target === 0) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    setCurrent(0);

    let raf: number | undefined;
    const startDelay = 200;
    const duration = 900;
    const timeout = window.setTimeout(() => {
      const start = performance.now();
      function tick(now: number) {
        const t = Math.min(1, (now - start) / duration);
        // ease-out cubic for a confident settle
        const eased = 1 - Math.pow(1 - t, 3);
        setCurrent(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }, startDelay);

    return () => {
      window.clearTimeout(timeout);
      if (raf !== undefined) cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return (
    <span className="text-[26px] font-semibold leading-none tracking-tight tabular-nums text-slate-900 sm:text-[30px] lg:text-[34px]">
      {current}
      {suffix}
    </span>
  );
}
