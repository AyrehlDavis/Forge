import type { RecommendationInput, Track } from "../_lib/types";

export type TrackSlug = "track-a" | "track-b" | "track-c";

export interface TrackFixture {
  slug: TrackSlug;
  track: Track;
  label: string;
  description: string;
  input: RecommendationInput;
}

export const TRACK_FIXTURES: Record<TrackSlug, TrackFixture> = {
  "track-a": {
    slug: "track-a",
    track: "A_use_broker",
    label: "Track A — Use a Broker",
    description:
      "Large multi-site, multi-state portfolio with complex priorities and a renewal on deck.",
    input: {
      spend: "over_1m",
      location_count: "6-20",
      states: ["TX", "IL", "CA"],
      priorities: ["risk_management", "lowest_cost"],
      situation: "renewal",
    },
  },
  "track-b": {
    slug: "track-b",
    track: "B_go_direct",
    label: "Track B — Go Direct",
    description: "Single site, low spend, focused on lowest cost — no broker needed.",
    input: {
      spend: "under_50k",
      location_count: "1",
      states: ["CA"],
      priorities: ["lowest_cost"],
      situation: "new_contract",
    },
  },
  "track-c": {
    slug: "track-c",
    track: "C_hybrid",
    label: "Track C — Hybrid",
    description:
      "Mid-spend, 2-5 sites in one state, prioritizing simplicity — mix broker + direct.",
    input: {
      spend: "50k_250k",
      location_count: "2-5",
      states: ["TX"],
      priorities: ["simplicity"],
      situation: "exploring",
    },
  },
};

export const TRACK_SLUGS: TrackSlug[] = ["track-a", "track-b", "track-c"];
