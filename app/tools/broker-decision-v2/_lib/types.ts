export type Priority =
  | "lowest_cost"
  | "risk_management"
  | "simplicity"
  | "sustainability";

export type Situation = "exploring" | "renewal" | "active" | "unhappy";

export type Spend = "under_50k" | "50k_250k" | "250k_1m" | "over_1m";

export type LocationCount = "1" | "2-10" | "11-50" | "50+";

export type Recommendation =
  | "broker"
  | "direct"
  | "hybrid"
  | "regulated";

export interface V2Inputs {
  spend: Spend | null;
  locationCount: LocationCount | null;
  states: string[];
  priority: Priority | null;
  situation: Situation | null;
}

export interface DerivedFlags {
  hasDeregulatedState: boolean;
  hasRegulatedState: boolean;
  marketMixed: boolean;
  marketAllRegulated: boolean;
  marketAllDereg: boolean;
  highSpend: boolean;
  midSpend: boolean;
  lowSpend: boolean;
  multiSite: boolean;
  manySites: boolean;
  multiState: boolean;
}

export interface V2ResultMetrics {
  estAnnualSavings: number | null;
  complexity: "low" | "medium" | "high";
  daysToAct: string;
}

export interface V2RecommendationOutput {
  recommendation: Recommendation;
  headline: string;
  why: string[];
  whatWedDo: string;
  metrics: V2ResultMetrics;
  flags: DerivedFlags;
  inputs: V2Inputs;
}
