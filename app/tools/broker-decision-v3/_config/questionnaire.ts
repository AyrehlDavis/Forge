import type {
  LocationCount,
  Priority,
  Situation,
  Spend,
} from "../_lib/types";

export interface SelectionOption<T> {
  value: T;
  label: string;
  descriptor: string;
}

export const SPEND_OPTIONS: Array<SelectionOption<Spend>> = [
  {
    value: "under_25k",
    label: "Under $25K",
    descriptor: "A small office, retail location, or single light-industrial site.",
  },
  {
    value: "25k_100k",
    label: "$25K – $100K",
    descriptor: "A small business with a few locations, or one site with steady usage.",
  },
  {
    value: "100k_500k",
    label: "$100K – $500K",
    descriptor: "A growing portfolio, or one large facility.",
  },
  {
    value: "over_500k",
    label: "Over $500K",
    descriptor: "A multi-site operation, or one very large facility.",
  },
];

export const LOCATION_OPTIONS: Array<SelectionOption<LocationCount>> = [
  {
    value: "1",
    label: "1 location",
    descriptor: "A single building, facility, or storefront.",
  },
  {
    value: "2-10",
    label: "2 – 10 locations",
    descriptor: "A small footprint across a handful of sites.",
  },
  {
    value: "11-50",
    label: "11 – 50 locations",
    descriptor: "A mid-sized operation with multiple buildings.",
  },
  {
    value: "50+",
    label: "50+ locations",
    descriptor: "A large multi-site or enterprise footprint.",
  },
];

// Priority labels per Chris's 2026-05-20 pass. Engine routing keys (value
// field) preserved so recommend.ts logic doesn't need to change — only the
// user-facing label + descriptor swap. Mapping:
//   budget_certainty   → "Budget certainty"     (locked-in price)
//   handled_for_me     → "Little effort"        (hands off — broker does the work)
//   price_first        → "Willing to get hands on"  (minimize cost via effort)
//   balanced_price_risk → "Balanced"             (effort if value is clear)
export const PRIORITY_OPTIONS: Array<SelectionOption<Priority>> = [
  {
    value: "budget_certainty",
    label: "Budget certainty",
    descriptor: "Lock in a clear price — predictable budget over a clear move.",
  },
  {
    value: "handled_for_me",
    label: "Little effort",
    descriptor: "Hands off. I want Arise to watch the market and tell me when to act.",
  },
  {
    value: "price_first",
    label: "Willing to get hands on",
    descriptor: "To minimize the cost — I'll do the work if it saves real money.",
  },
  {
    value: "balanced_price_risk",
    label: "Balanced",
    descriptor:
      "Open to putting in effort if there's a clear, definable value.",
  },
];

// Situation labels per Chris's 2026-05-20 pass. Two labels are Chris's
// verbatim copy (shopping_now + contract_6_plus_months). The remaining two
// (renewal_soon + always_in_market) are kept from prior copy pending a Chris
// pass — flagged in the V3.6 report so Forge LP1 can surface the gap.
export const SITUATION_OPTIONS: Array<SelectionOption<Situation>> = [
  {
    value: "shopping_now",
    label: "Shopping now",
    descriptor: "I need a new contract or choose a supplier soon.",
  },
  {
    value: "renewal_soon",
    label: "Renewal in the next 6 months",
    descriptor: "My contract is coming up and I need to know when to buy.",
  },
  {
    value: "contract_6_plus_months",
    label: "Tracking the market",
    descriptor:
      "I'm not buying today, but I want to start tracking to ensure I don't miss a good window.",
  },
  {
    value: "always_in_market",
    label: "Always in the market",
    descriptor:
      "I manage several contracts, sites, or renewal dates through the year.",
  },
];

export const STEP_COUNT = 5;

export interface StepMeta {
  id:
    | "step-spend"
    | "step-locations"
    | "step-states"
    | "step-priority"
    | "step-situation";
  short: string;
  question: string;
  helper?: string;
}

export const STEPS: StepMeta[] = [
  {
    id: "step-locations",
    short: "Sites",
    question: "How many locations do you manage energy for?",
  },
  {
    id: "step-states",
    short: "States",
    question: "Which states are your locations in?",
    helper: "Click a state on the map. You can pick more than one.",
  },
  {
    id: "step-spend",
    short: "Spend",
    question: "What's your total annual energy spend?",
    helper:
      "Across all locations. A rough estimate is fine — count everything you pay for power.",
  },
  {
    id: "step-priority",
    short: "Priority",
    question: "What matters most right now?",
  },
  {
    id: "step-situation",
    short: "Timing",
    question: "What's your contract situation?",
  },
];
