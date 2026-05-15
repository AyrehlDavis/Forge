export type Spend = "under_50k" | "50k_250k" | "250k_1m" | "over_1m";
export type LocationCount = "1" | "2-5" | "6-20" | "20+";
export type Priority = "lowest_cost" | "risk_management" | "simplicity" | "sustainability";
export type Situation = "new_contract" | "renewal" | "exploring";
export type Track = "A_use_broker" | "B_go_direct" | "C_hybrid";

export interface RecommendationInput {
  spend: Spend;
  location_count: LocationCount;
  states: string[];
  priorities: Priority[];
  situation: Situation;
}

export interface RecommendationVariables {
  locationLabel: string;
  spendLabel: string;
  stateCount: number;
  stateLabel: string;
  priorityLabel: string;
  firstStateName: string | null;
  multiState: boolean;
  manySites: boolean;
  multiSite: boolean;
  complexPriority: boolean;
  highSpend: boolean;
  lowSpend: boolean;
}

export interface RecommendationOutput {
  track: Track;
  variables: RecommendationVariables;
}

export interface QuestionnaireAnswers {
  spend: Spend | null;
  location_count: LocationCount | null;
  states: string[];
  priorities: Priority[];
  situation: Situation | null;
}
