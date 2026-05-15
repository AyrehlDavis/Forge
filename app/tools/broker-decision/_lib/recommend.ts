import type {
  Priority,
  RecommendationInput,
  RecommendationOutput,
  RecommendationVariables,
  Spend,
  Track,
} from "./types";
import { getStateName, joinStateNames } from "../_config/states";

const LOCATION_LABEL: Record<RecommendationInput["location_count"], string> = {
  "1": "a single location",
  "2-5": "2-5 locations",
  "6-20": "6-20 locations",
  "20+": "20+ locations",
};

const PRIORITY_LABEL: Record<Priority, string> = {
  lowest_cost: "lowest cost",
  risk_management: "risk management",
  simplicity: "simplicity",
  sustainability: "sustainability",
};

const SPEND_LABEL: Record<Spend, string> = {
  under_50k: "under $50K/year",
  "50k_250k": "$50K–$250K/year",
  "250k_1m": "$250K–$1M/year",
  over_1m: "over $1M/year",
};

interface DerivedFlags {
  multiSite: boolean;
  manySites: boolean;
  multiState: boolean;
  complexPriority: boolean;
  highSpend: boolean;
  lowSpend: boolean;
}

function deriveFlags(input: RecommendationInput): DerivedFlags {
  return {
    multiSite: input.location_count !== "1",
    manySites: input.location_count === "6-20" || input.location_count === "20+",
    multiState: input.states.length > 1,
    complexPriority: input.priorities.some(
      (p) => p === "risk_management" || p === "sustainability",
    ),
    // Spend large enough that broker fees are easily absorbed by the savings
    // a broker can negotiate. The $250K floor lines up with where most brokers
    // start engaging seriously.
    highSpend: input.spend === "250k_1m" || input.spend === "over_1m",
    // Spend low enough that broker overhead rarely pays off, even with
    // multi-site or complex-priority signals.
    lowSpend: input.spend === "under_50k",
  };
}

function chooseTrack(input: RecommendationInput, flags: DerivedFlags): Track {
  // Track A: USE A BROKER
  if (input.spend === "over_1m") return "A_use_broker";
  if (flags.manySites) return "A_use_broker";
  if (flags.multiState) return "A_use_broker";
  if (flags.multiSite && flags.complexPriority) return "A_use_broker";
  if (flags.multiSite && input.situation === "renewal") return "A_use_broker";
  if (flags.highSpend && flags.complexPriority) return "A_use_broker";

  // Track B: GO DIRECT — low spend short-circuits broker fees even with some
  // complexity, since the savings can't cover the broker overhead.
  if (flags.lowSpend && !flags.multiState && !flags.manySites) return "B_go_direct";

  // Track C: HYBRID (specific multi-site outcomes)
  if (flags.multiSite && input.priorities.includes("simplicity")) return "C_hybrid";
  if (flags.multiSite && input.priorities.includes("lowest_cost")) return "C_hybrid";
  if (flags.highSpend && flags.multiSite) return "C_hybrid";

  // Track B: GO DIRECT
  if (input.location_count === "1" && !flags.complexPriority) return "B_go_direct";
  if (input.location_count === "2-5" && !flags.multiState && !flags.complexPriority)
    return "B_go_direct";

  // Fallback
  return "C_hybrid";
}

function joinPriorityLabels(priorities: Priority[]): string {
  const labels = priorities.map((p) => PRIORITY_LABEL[p]);
  if (labels.length === 0) return "";
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")}, and ${labels[labels.length - 1]}`;
}

function buildVariables(
  input: RecommendationInput,
  flags: DerivedFlags,
): RecommendationVariables {
  return {
    locationLabel: LOCATION_LABEL[input.location_count],
    spendLabel: SPEND_LABEL[input.spend],
    stateCount: input.states.length,
    stateLabel: joinStateNames(input.states),
    priorityLabel: joinPriorityLabels(input.priorities),
    firstStateName: input.states[0] ? getStateName(input.states[0]) : null,
    multiState: flags.multiState,
    manySites: flags.manySites,
    multiSite: flags.multiSite,
    complexPriority: flags.complexPriority,
    highSpend: flags.highSpend,
    lowSpend: flags.lowSpend,
  };
}

export function recommend(input: RecommendationInput): RecommendationOutput {
  const flags = deriveFlags(input);
  const track = chooseTrack(input, flags);
  const variables = buildVariables(input, flags);
  return { track, variables };
}
