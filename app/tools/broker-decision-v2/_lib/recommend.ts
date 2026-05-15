import { getState, getStateName } from "../_config/states";
import type {
  DerivedFlags,
  Priority,
  Recommendation,
  V2Inputs,
  V2RecommendationOutput,
  V2ResultMetrics,
} from "./types";

const PRIORITY_LABELS: Record<Priority, string> = {
  lowest_cost: "lowest cost",
  risk_management: "risk management",
  simplicity: "simplicity",
  sustainability: "sustainability",
};

function deriveFlags(input: V2Inputs): DerivedFlags {
  const dereg = input.states
    .map(getState)
    .filter((s) => s?.isDeregulated === true);
  const reg = input.states
    .map(getState)
    .filter((s) => s && s.isDeregulated === false);

  const hasDereg = dereg.length > 0;
  const hasReg = reg.length > 0;

  return {
    hasDeregulatedState: hasDereg,
    hasRegulatedState: hasReg,
    marketMixed: hasDereg && hasReg,
    marketAllRegulated: !hasDereg && hasReg,
    marketAllDereg: hasDereg && !hasReg,
    highSpend: input.annualSpend >= 250_000,
    midSpend: input.annualSpend >= 50_000 && input.annualSpend < 250_000,
    lowSpend: input.annualSpend < 50_000,
    multiSite: input.siteCount > 1,
    manySites: input.siteCount >= 6,
    multiState: input.states.length > 1,
  };
}

function chooseRecommendation(
  input: V2Inputs,
  flags: DerivedFlags,
): Recommendation {
  // P0 baked in: if zero deregulated states, no supplier choice for the
  // commercial buyer in any of their states → never recommend "direct".
  if (flags.marketAllRegulated) return "regulated";

  // Mixed market with regulated component — hybrid handles the split.
  if (flags.marketMixed && flags.multiSite) return "hybrid";

  // High-leverage broker cases
  if (input.annualSpend >= 1_000_000) return "broker";
  if (flags.manySites) return "broker";
  if (flags.multiState && flags.hasDeregulatedState) return "broker";
  if (
    flags.multiSite &&
    flags.hasDeregulatedState &&
    (input.priority === "risk_management" ||
      input.situation === "renewal")
  ) {
    return "broker";
  }
  if (flags.highSpend && input.priority === "risk_management")
    return "broker";

  // Hybrid for moderate multi-site spend with simplicity / lowest_cost
  if (
    flags.multiSite &&
    flags.hasDeregulatedState &&
    (input.priority === "simplicity" || input.priority === "lowest_cost")
  ) {
    return "hybrid";
  }

  // Direct cases — only if there's at least one deregulated state.
  if (
    flags.hasDeregulatedState &&
    !flags.multiState &&
    !flags.multiSite &&
    flags.lowSpend
  ) {
    return "direct";
  }
  if (
    flags.hasDeregulatedState &&
    !flags.multiSite &&
    input.priority !== "risk_management"
  ) {
    return "direct";
  }

  // Default to hybrid for the muddle.
  return flags.hasDeregulatedState ? "hybrid" : "regulated";
}

function estSavings(input: V2Inputs, rec: Recommendation): number | null {
  // V2 surfaces a directional estimate, not a guarantee. Numbers below are
  // illustrative bands derived from broker-typical 4-8% effective negotiation
  // delta on supply spend (~50-60% of total bill). Phase 6 TEA flags this for
  // sourcing validation before production launch.
  const supplySpendShare = 0.55;
  const effectiveSupply = input.annualSpend * supplySpendShare;
  switch (rec) {
    case "broker":
      return Math.round((effectiveSupply * 0.07) / 100) * 100;
    case "hybrid":
      return Math.round((effectiveSupply * 0.045) / 100) * 100;
    case "direct":
      return Math.round((effectiveSupply * 0.025) / 100) * 100;
    case "regulated":
      // Savings in regulated markets come from tariff optimization +
      // efficiency, not supplier swap. Direction only.
      return Math.round((input.annualSpend * 0.03) / 100) * 100;
  }
}

function complexity(flags: DerivedFlags): "low" | "medium" | "high" {
  if (flags.manySites || flags.multiState || flags.marketMixed) return "high";
  if (flags.multiSite || flags.midSpend) return "medium";
  return "low";
}

function daysToAct(input: V2Inputs): string {
  if (input.situation === "renewal") return "30-60 days";
  if (input.situation === "unhappy") return "60-90 days";
  if (input.situation === "active") return "180+ days";
  return "60-90 days";
}

function fmtSpend(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function fmtSiteCount(n: number): string {
  if (n === 1) return "a single site";
  return `${n} sites`;
}

function fmtStateMix(states: string[], flags: DerivedFlags): string {
  if (states.length === 0) return "your portfolio";
  if (states.length === 1) return `in ${getStateName(states[0])}`;
  if (states.length === 2) return `across ${states[0]} + ${states[1]}`;
  if (flags.marketMixed) {
    return `across ${states.length} states (mixed markets)`;
  }
  return `across ${states.length} states`;
}

function fmtFirstStateName(states: string[]): string {
  return states[0] ? getStateName(states[0]) : "your state";
}

function buildHeadline(
  input: V2Inputs,
  rec: Recommendation,
  flags: DerivedFlags,
): string {
  const spend = fmtSpend(input.annualSpend);
  const sites = fmtSiteCount(input.siteCount);
  const mix = fmtStateMix(input.states, flags);
  switch (rec) {
    case "broker":
      return `For ${spend} across ${sites} ${mix}, a broker earns its keep.`;
    case "direct":
      return `For a ${spend} single site ${mix}, you can do this yourself.`;
    case "hybrid":
      return flags.marketMixed
        ? `Your ${sites} portfolio splits across markets — a hybrid approach moves faster.`
        : `For ${sites} ${mix}, a hybrid approach makes the most of your leverage.`;
    case "regulated":
      return input.states.length === 1
        ? `${fmtFirstStateName(input.states)} doesn't have supplier choice — here's what actually moves the needle.`
        : `Your states don't have supplier choice — here's what actually moves the needle.`;
  }
}

function buildWhy(
  input: V2Inputs,
  rec: Recommendation,
  flags: DerivedFlags,
): string[] {
  const priorityLabel = input.priority
    ? PRIORITY_LABELS[input.priority]
    : "lowest cost";
  const spend = fmtSpend(input.annualSpend);

  switch (rec) {
    case "broker":
      return [
        flags.multiSite
          ? `${input.siteCount} sites means real negotiation leverage — brokers convert that into supplier competition.`
          : `${spend} of annual spend is enough that broker fees are absorbed by what they negotiate.`,
        flags.multiState
          ? `Multiple states means multiple market rules — a broker navigates that without you doing the homework.`
          : `Market timing matters at your spend level; brokers track curves so you don't have to.`,
        `Your priority on ${priorityLabel} is exactly what a good broker is built to deliver.`,
      ];
    case "direct":
      return [
        `Single-site contracts are simple enough to negotiate yourself.`,
        `At ${spend}, broker overhead is hard to justify against the savings.`,
        `Going direct keeps your supplier relationship one conversation, not three.`,
      ];
    case "hybrid":
      return [
        flags.marketMixed
          ? `Your portfolio mixes deregulated and regulated markets — different states need different plays.`
          : `Your portfolio is multi-site but not so complex that you need a broker on every contract.`,
        `Use a broker where leverage matters; go direct where it doesn't.`,
        `Your ${priorityLabel} priority benefits from picking the right tool per market.`,
      ];
    case "regulated":
      return [
        `In ${fmtFirstStateName(input.states)}, electricity is sold through a regulated utility — you can't shop suppliers.`,
        `Your cost levers are tariff structure, demand management, and efficiency — not supplier selection.`,
        `A broker here would charge for something you don't have a market for.`,
      ];
  }
}

function buildWhatWedDo(rec: Recommendation, flags: DerivedFlags): string {
  switch (rec) {
    case "broker":
      return "Run a broker RFP across 3-5 firms in the next 30 days. Pick the one who shows their fee math and works your load profile across markets. Don't sign with the first one who answers the phone.";
    case "direct":
      return "Get quotes from 2-3 suppliers in your market. Compare the all-in rate, not just the headline number. Ask each one how renewals work before you sign anything.";
    case "hybrid":
      return flags.marketMixed
        ? "Run a broker RFP for your deregulated sites. Handle the regulated sites with utility account work in parallel. Bundle the answer for your team."
        : "Use a broker for the largest contracts where the fee earns itself. Go direct on the smaller sites. Review the split annually.";
    case "regulated":
      return "Pull your tariff schedule and demand profile. Ask the utility about time-of-use and demand-response programs. Get an energy audit if you haven't had one in three years.";
  }
}

export function recommend(input: V2Inputs): V2RecommendationOutput {
  const flags = deriveFlags(input);
  const rec = chooseRecommendation(input, flags);
  const headline = buildHeadline(input, rec, flags);
  const why = buildWhy(input, rec, flags);
  const whatWedDo = buildWhatWedDo(rec, flags);
  const metrics: V2ResultMetrics = {
    estAnnualSavings: estSavings(input, rec),
    complexity: complexity(flags),
    daysToAct: daysToAct(input),
  };
  return { recommendation: rec, headline, why, whatWedDo, metrics, flags, inputs: input };
}
