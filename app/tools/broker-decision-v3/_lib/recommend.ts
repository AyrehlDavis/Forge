import { getState, getStateName } from "../_config/states";
import { buildPresumptiveClose, TRACK_LABELS } from "../_config/track-templates";
import type {
  DerivedFlags,
  Situation,
  Spend,
  Track,
  V3Inputs,
  V3Metrics,
  V3Recommendation,
} from "./types";

const SPEND_LABELS: Record<Spend, string> = {
  under_25k: "Under $25K",
  "25k_100k": "$25K–$100K",
  "100k_500k": "$100K–$500K",
  over_500k: "Over $500K",
};

const SPEND_MIDPOINTS: Record<Spend, number> = {
  under_25k: 12_500,
  "25k_100k": 62_500,
  "100k_500k": 300_000,
  over_500k: 750_000,
};

const TIMING_CHIPS: Record<Situation, string> = {
  shopping_now: "Urgent now — line up suppliers and lock in pricing.",
  renewal_soon: "Urgent before your renewal window opens — identifying a broker immediately helps you capitalize on top market opportunities rather than rushing to react.",
  contract_6_plus_months: "Not urgent — use this time to watch the market.",
  always_in_market: "Always active — next move depends on which site is up first.",
};

function deriveFlags(input: V3Inputs): DerivedFlags {
  const entries = input.states
    .map(getState)
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const dereg = entries.filter((s) => s.isDeregulated === true);
  const partial = entries.filter((s) => s.isPartial === true);
  const reg = entries.filter(
    (s) => s.isDeregulated === false && !s.isPartial,
  );

  return {
    hasDeregulatedState: dereg.length > 0,
    hasRegulatedState: reg.length > 0,
    hasPartialState: partial.length > 0,
    marketMixed:
      dereg.length > 0 && (reg.length > 0 || partial.length > 0),
    marketAllRegulated:
      dereg.length === 0 && (reg.length > 0 || partial.length > 0),
    marketAllDereg: dereg.length > 0 && reg.length === 0 && partial.length === 0,
    highSpend: input.spend === "100k_500k" || input.spend === "over_500k",
    midSpend: input.spend === "25k_100k",
    lowSpend: input.spend === "under_25k",
    multiSite: input.locationCount !== null && input.locationCount !== "1",
    manySites:
      input.locationCount === "11-50" || input.locationCount === "50+",
    multiState: input.states.length > 1,
    wantsArise: input.priority === "handled_for_me",
    riskLeaning:
      input.priority === "balanced_price_risk" ||
      input.priority === "budget_certainty",
  };
}

function chooseTrack(input: V3Inputs, flags: DerivedFlags): Track {
  // No supplier choice anywhere → regulated.
  if (
    flags.marketAllRegulated &&
    !flags.hasDeregulatedState &&
    !flags.hasPartialState
  ) {
    return "C_regulated";
  }

  // Always-in-market, 6+ months out, or explicit "handle it for me" with any
  // portfolio signal → broker (was Arise-managed; A and C overlapped, collapsed).
  if (
    (input.situation === "always_in_market" ||
      input.situation === "contract_6_plus_months") &&
    !(flags.lowSpend && !flags.multiSite && !flags.multiState)
  ) {
    return "A_use_broker";
  }
  if (
    flags.wantsArise &&
    (flags.multiSite || flags.multiState || flags.highSpend)
  ) {
    return "A_use_broker";
  }

  // wantsArise but small/simple → direct (broker can still second-opinion the quote).
  if (flags.wantsArise) {
    return "B_go_direct";
  }

  // Broker territory.
  if (input.spend === "over_500k") return "A_use_broker";
  if (flags.manySites) return "A_use_broker";
  if (flags.multiState && flags.hasDeregulatedState) return "A_use_broker";
  if (
    flags.multiSite &&
    flags.hasDeregulatedState &&
    (flags.riskLeaning || input.situation === "renewal_soon")
  ) {
    return "A_use_broker";
  }
  if (flags.highSpend && flags.riskLeaning) return "A_use_broker";

  // Mixed market + multi-site → broker (was hybrid).
  if (flags.marketMixed && flags.multiSite) return "A_use_broker";

  // Direct cases — require deregulated.
  if (
    flags.hasDeregulatedState &&
    !flags.multiSite &&
    !flags.multiState &&
    flags.lowSpend
  ) {
    return "B_go_direct";
  }
  if (
    flags.hasDeregulatedState &&
    !flags.multiSite &&
    !flags.riskLeaning
  ) {
    return "B_go_direct";
  }

  // Fall through.
  return flags.hasDeregulatedState ? "A_use_broker" : "C_regulated";
}

function fmtSpend(spend: Spend | null): string {
  return spend ? SPEND_LABELS[spend] : "your spend";
}

function fmtSiteSummary(input: V3Inputs): string {
  if (input.locationCount === "1") return "a single site";
  if (input.locationCount === "2-10") return "2-10 sites";
  if (input.locationCount === "11-50") return "11-50 sites";
  if (input.locationCount === "50+") return "50+ sites";
  return "your portfolio";
}

function fmtStateMix(input: V3Inputs, flags: DerivedFlags): string {
  if (input.states.length === 0) return "your markets";
  if (input.states.length === 1) return getStateName(input.states[0]);
  if (input.states.length === 2)
    return `${getStateName(input.states[0])} and ${getStateName(input.states[1])}`;
  if (flags.marketMixed)
    return `${input.states.length} states (mixed markets)`;
  return `${input.states.length} states`;
}

function buildHeadline(
  input: V3Inputs,
  track: Track,
  flags: DerivedFlags,
): string {
  const spend = fmtSpend(input.spend);
  const sites = fmtSiteSummary(input);
  const mix = fmtStateMix(input, flags);
  switch (track) {
    case "A_use_broker":
      return `When scaling to ${sites} across ${mix} with a volume of ${spend}, navigating these markets warrants the expertise of a broker.`;
    case "B_go_direct":
      return `For ${sites} in ${mix}, you can handle this directly.`;
    case "C_regulated":
      return input.states.length === 1
        ? `${getStateName(input.states[0])} doesn't have supplier choice — here's what actually moves the needle.`
        : `Your states don't have supplier choice — here's what actually moves the needle.`;
  }
}

function buildWhy(
  input: V3Inputs,
  track: Track,
  flags: DerivedFlags,
): Array<{ label: string; body: string }> {
  const sites = fmtSiteSummary(input);
  const spend = fmtSpend(input.spend);

  switch (track) {
    case "A_use_broker":
      return [
        {
          label: `${sites} means real negotiation leverage.`,
          body:
            "A broker turns that volume into supplier competition you can't easily run yourself.",
        },
        {
          label: flags.multiState
            ? "Multiple states means multiple rulebooks."
            : "Timing and contract structure matter at this spend level.",
          body: flags.multiState
            ? "A good broker navigates the different markets without you doing the homework."
            : "A broker tracks the curves and structures the contract so you're not exposed to bad timing.",
        },
        {
          label: "Look beyond the headline rate — focus on total cost.",
          body:
            "A broker does far more than compare a stack of bids. The real value is uncovering hidden trade-offs between products, terms, and suppliers — the things that protect your bottom line.",
        },
      ];
    case "B_go_direct":
      return [
        {
          label: `${sites} keeps procurement simple.`,
          body:
            "One or two calls to suppliers can get you a competitive direct contract.",
        },
        {
          label: "A broker adds expertise, but DIY is fully manageable here.",
          body:
            "While an expert broker can handle the heavy lifting, a hands-on buyer can easily navigate this scale independently.",
        },
        {
          label: "Bring Arise in as a second set of eyes.",
          body:
            "If you want a sanity check on a direct quote — pass-throughs, renewal terms, timing — send it over. We don't need to run the deal to help you sign a better one.",
        },
      ];
    case "C_regulated":
      return [
        {
          label: "Your markets sell power through the regulated utility.",
          body:
            "There's no supplier choice for commercial buyers to shop — a broker can't help here.",
        },
        {
          label: "Your cost levers are tariff, demand, and efficiency.",
          body:
            "Time-of-use programs, demand-response, and efficiency upgrades are where the savings live.",
        },
        {
          label: "Arise can still help you find them.",
          body:
            "Tariff analysis and demand-side strategy — without the supplier-shopping that doesn't apply.",
        },
      ];
  }
}

function complexity(flags: DerivedFlags): "low" | "medium" | "high" {
  if (flags.manySites || flags.multiState || flags.marketMixed) return "high";
  if (flags.multiSite || flags.midSpend) return "medium";
  return "low";
}

function estSavings(input: V3Inputs, track: Track): number | null {
  if (!input.spend) return null;
  const supplyShare = 0.55;
  const supply = SPEND_MIDPOINTS[input.spend] * supplyShare;
  switch (track) {
    case "A_use_broker":
      return Math.round((supply * 0.07) / 100) * 100;
    case "B_go_direct":
      return Math.round((supply * 0.025) / 100) * 100;
    case "C_regulated":
      return Math.round((SPEND_MIDPOINTS[input.spend] * 0.03) / 100) * 100;
  }
}

export function recommend(input: V3Inputs): V3Recommendation {
  const flags = deriveFlags(input);
  const track = chooseTrack(input, flags);
  const headline = buildHeadline(input, track, flags);
  const whyBullets = buildWhy(input, track, flags);
  const presumptiveClose = buildPresumptiveClose(track, input.priority);
  const metrics: V3Metrics = {
    estAnnualSavings: estSavings(input, track),
    complexity: complexity(flags),
  };
  return {
    track,
    trackLabel: TRACK_LABELS[track],
    headline,
    whyBullets,
    presumptiveClose,
    metrics,
    timingChip: input.situation ? TIMING_CHIPS[input.situation] : null,
    inputs: input,
    flags,
  };
}
