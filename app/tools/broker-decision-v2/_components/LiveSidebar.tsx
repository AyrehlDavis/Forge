"use client";

import { useMemo } from "react";
import { getState, getStateName } from "../_config/states";
import type { V2Inputs } from "../_lib/types";

interface LiveSidebarProps {
  inputs: V2Inputs;
}

function fmtSpend(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  return `$${Math.round(n / 1_000)}K`;
}

const PRIORITY_LABELS: Record<string, string> = {
  lowest_cost: "Cost",
  risk_management: "Risk",
  simplicity: "Simple",
  sustainability: "ESG",
};

const SITUATION_LABELS: Record<string, string> = {
  exploring: "Exploring",
  renewal: "Renewing",
  active: "Active",
  unhappy: "Switching",
};

export function LiveSidebar({ inputs }: LiveSidebarProps) {
  const market = useMemo(() => {
    if (inputs.states.length === 0) return null;
    const entries = inputs.states.map(getState).filter(Boolean);
    const dereg = entries.filter((s) => s?.isDeregulated).length;
    const reg = entries.length - dereg;
    if (dereg > 0 && reg > 0) return "Mixed";
    if (dereg > 0) return "Open market";
    return "Regulated";
  }, [inputs.states]);

  return (
    <aside
      aria-label="Live portfolio summary"
      className="h-fit p-2 sm:sticky sm:top-6"
    >
      <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--v2-text-tertiary)]/70">
        Your portfolio
      </div>
      <dl className="space-y-3">
        <Row label="Spend" value={fmtSpend(inputs.annualSpend)} active />
        <Row label="Sites" value={String(inputs.siteCount)} active />
        <Row
          label="States"
          value={
            inputs.states.length === 0
              ? "Not set"
              : inputs.states.length <= 4
                ? inputs.states.join(", ")
                : `${inputs.states.slice(0, 3).join(", ")} +${inputs.states.length - 3}`
          }
          active={inputs.states.length > 0}
        />
        <Row label="Market" value={market ?? "Not set"} active={market !== null} />
        <Row
          label="Priority"
          value={inputs.priority ? PRIORITY_LABELS[inputs.priority] : "Not set"}
          active={inputs.priority !== null}
        />
        <Row
          label="Timing"
          value={inputs.situation ? SITUATION_LABELS[inputs.situation] : "Not set"}
          active={inputs.situation !== null}
        />
      </dl>

      {inputs.states.length === 1 && (
        <div className="mt-5 border-t border-[var(--v2-border-subtle)] pt-4 text-xs text-[var(--v2-text-tertiary)]">
          {getStateName(inputs.states[0])}
        </div>
      )}
    </aside>
  );
}

function Row({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <dt className="text-[var(--v2-text-tertiary)]">{label}</dt>
      <dd
        className={`text-right tabular-nums transition-colors duration-150 ${
          active
            ? "text-[var(--v2-text-primary)] font-medium"
            : "text-[var(--v2-text-tertiary)] opacity-50"
        }`}
      >
        {active ? value : "—"}
      </dd>
    </div>
  );
}
