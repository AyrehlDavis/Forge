export type Priority =
  | "lowest_cost"
  | "risk_management"
  | "simplicity"
  | "sustainability";

export type Situation = "exploring" | "renewal" | "active" | "unhappy";

export type Recommendation =
  | "broker"
  | "direct"
  | "hybrid"
  | "regulated";

export interface V2Inputs {
  annualSpend: number;
  siteCount: number;
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
