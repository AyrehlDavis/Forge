export type Spend = "under_25k" | "25k_100k" | "100k_500k" | "over_500k";

export type LocationCount = "1" | "2-10" | "11-50" | "50+";

export type Priority =
  | "balanced_price_risk"
  | "price_first"
  | "budget_certainty"
  | "handled_for_me";

export type Situation =
  | "shopping_now"
  | "renewal_soon"
  | "contract_6_plus_months"
  | "always_in_market";

export type Track =
  | "A_use_broker"
  | "B_go_direct"
  | "C_regulated";

export interface V3Inputs {
  spend: Spend | null;
  locationCount: LocationCount | null;
  states: string[];
  priority: Priority | null;
  situation: Situation | null;
}

export interface DerivedFlags {
  hasDeregulatedState: boolean;
  hasRegulatedState: boolean;
  hasPartialState: boolean;
  marketMixed: boolean;
  marketAllRegulated: boolean;
  marketAllDereg: boolean;
  highSpend: boolean;
  midSpend: boolean;
  lowSpend: boolean;
  multiSite: boolean;
  manySites: boolean;
  multiState: boolean;
  wantsArise: boolean;
  riskLeaning: boolean;
}

export interface V3Metrics {
  estAnnualSavings: number | null;
  complexity: "low" | "medium" | "high";
}

export interface V3Recommendation {
  track: Track;
  trackLabel: string;
  headline: string;
  whyBullets: Array<{ label: string; body: string }>;
  presumptiveClose: {
    body: string;
    cta: string;
  };
  metrics: V3Metrics;
  timingChip: string | null;
  inputs: V3Inputs;
  flags: DerivedFlags;
}
