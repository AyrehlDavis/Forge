import type { Track, V3Inputs } from "../../broker-decision-v3/_lib/types";

export type TrackSlug = "track-a" | "track-b" | "track-c";

export interface TrackFixture {
  slug: TrackSlug;
  track: Track;
  label: string;
  description: string;
  input: V3Inputs;
}

export const TRACK_FIXTURES: Record<TrackSlug, TrackFixture> = {
  "track-a": {
    slug: "track-a",
    track: "A_use_broker",
    label: "Track A — Use a Broker",
    description:
      "Over $500K across 11-50 sites in TX/IL/CA with a renewal window approaching and a balanced price/risk priority.",
    input: {
      spend: "over_500k",
      locationCount: "11-50",
      states: ["TX", "IL", "CA"],
      priority: "balanced_price_risk",
      situation: "renewal_soon",
    },
  },
  "track-b": {
    slug: "track-b",
    track: "B_go_direct",
    label: "Track B — Go Direct",
    description:
      "Under $25K, single site in Texas (deregulated), shopping now and focused on price first — direct to supplier.",
    input: {
      spend: "under_25k",
      locationCount: "1",
      states: ["TX"],
      priority: "price_first",
      situation: "shopping_now",
    },
  },
  "track-c": {
    slug: "track-c",
    track: "C_regulated",
    label: "Track C — Regulated Market",
    description:
      "Single site in Florida (regulated utility — no supplier choice). Savings live in tariffs, demand response, and efficiency.",
    input: {
      spend: "25k_100k",
      locationCount: "1",
      states: ["FL"],
      priority: "price_first",
      situation: "shopping_now",
    },
  },
};

export const TRACK_SLUGS: TrackSlug[] = ["track-a", "track-b", "track-c"];
