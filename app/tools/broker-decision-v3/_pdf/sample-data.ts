// Sample Track A inputs + recommendation for the static PDF preview.
// When the real send-pdf pipeline wires up, the same component tree renders
// with live V3Inputs + V3Recommendation off the engine.
//
// Inputs per Forge LP1 brief: 11–50 sites · Texas · $100K–$500K · Balanced · Renewal soon
// Engine output for these inputs: A_use_broker

import { recommend } from "../_lib/recommend";
import type { V3Inputs, V3Recommendation } from "../_lib/types";

export const SAMPLE_INPUTS: V3Inputs = {
  spend: "100k_500k",
  locationCount: "11-50",
  states: ["TX"],
  priority: "balanced_price_risk",
  situation: "renewal_soon",
};

export const SAMPLE_RESULT: V3Recommendation = recommend(SAMPLE_INPUTS);

// Stable artifact metadata for the static preview. All TEMP-marked downstream
// so the data-temp grep can find them when real generation data wires up.
export const SAMPLE_META = {
  preparedDate: "May 19, 2026",
  version: "v1.0",
  fromEmail: "forge@arise.com",
  totalPages: 9,
};

// Chip strings — same five inputs the website chip-trail surfaces, in the
// order Ranger specifies for the cover panel.
export const SAMPLE_CHIPS: ReadonlyArray<{ label: string; value: string }> = [
  { label: "Market", value: "Texas · Open market" },
  { label: "Spend tier", value: "$100K–$500K" },
  { label: "Portfolio", value: "11–50 sites" },
  { label: "Timing", value: "Renewal in the next 6 months" },
  { label: "Priority", value: "Balanced price and risk" },
];

// Abbreviated 3-chip slug for the running header (pages 2–9).
export const RUNNING_HEADER_SLUG = "TX · 11–50 sites · 2026 renewal";

// Per-question scoring weights — Ranger Track A spec (page 8 score grid table).
// Weight 2: compensation transparency (Q1), rate construction / pass-through (Q3),
// timing plan tied to renewal window (Q4). Weight 1: everything else.
export const QUESTION_WEIGHTS: ReadonlyArray<{ n: number; weight: 1 | 2 }> = [
  { n: 1, weight: 2 }, // compensation
  { n: 2, weight: 1 },
  { n: 3, weight: 2 }, // rate construction / pass-through
  { n: 4, weight: 2 }, // timing plan tied to renewal window
  { n: 5, weight: 1 },
  { n: 6, weight: 1 },
  { n: 7, weight: 1 },
  { n: 8, weight: 1 },
  { n: 9, weight: 1 },
];

// Max possible = sum of weight × 2 (top score per question). With Q1+Q3+Q4
// at weight 2: (2+1+2+2+1+1+1+1+1) × 2 = 24.
export const SCORE_GRID_MAX = QUESTION_WEIGHTS.reduce(
  (acc, q) => acc + q.weight * 2,
  0,
);
