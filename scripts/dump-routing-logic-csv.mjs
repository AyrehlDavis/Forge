// CSV companion to dump-routing-logic.mjs — same coverage matrix, Excel-friendly.
// Run:   node scripts/dump-routing-logic-csv.mjs > _bmad-output/routing-logic-matrix.csv

import { recommend } from "../app/tools/broker-decision-v3/_lib/recommend.ts";

const SPENDS = ["under_25k", "25k_100k", "100k_500k", "over_500k"];
const LOCS = ["1", "2-10", "11-50", "50+"];
const STATE_GROUPS = [
  { label: "TX (dereg)", codes: ["TX"] },
  { label: "CA (partial)", codes: ["CA"] },
  { label: "FL (regulated)", codes: ["FL"] },
  { label: "TX+IL (multi-dereg)", codes: ["TX", "IL"] },
  { label: "TX+IL+CA (mixed)", codes: ["TX", "IL", "CA"] },
  { label: "FL+GA (multi-regulated)", codes: ["FL", "GA"] },
];
const PRIORITIES = ["price_first", "balanced_price_risk", "budget_certainty", "handled_for_me"];
const SITUATIONS = ["shopping_now", "renewal_soon", "contract_6_plus_months", "always_in_market"];

const TRACK_LABELS = {
  A_use_broker: "Use a broker",
  B_go_direct: "Go direct",
  C_regulated: "Local Utility",
};

const SPEND_LABEL = { under_25k: "<$25K", "25k_100k": "$25K-$100K", "100k_500k": "$100K-$500K", over_500k: ">$500K" };
const LOC_LABEL = { "1": "1 site", "2-10": "2-10 sites", "11-50": "11-50 sites", "50+": "50+ sites" };
const PRIO_LABEL = { price_first: "Price first", balanced_price_risk: "Balanced", budget_certainty: "Certainty", handled_for_me: "Hands-off" };
const SIT_LABEL = { shopping_now: "Shopping now", renewal_soon: "Renewal soon", contract_6_plus_months: "6+ mo out", always_in_market: "Always in" };

function esc(v) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const rows = [["Spend", "Locations", "States", "Priority", "Situation", "Track", "TrackId"]];
for (const spend of SPENDS) {
  for (const loc of LOCS) {
    for (const sg of STATE_GROUPS) {
      for (const pr of PRIORITIES) {
        for (const sit of SITUATIONS) {
          const r = recommend({
            spend,
            locationCount: loc,
            states: sg.codes,
            priority: pr,
            situation: sit,
          });
          rows.push([
            SPEND_LABEL[spend],
            LOC_LABEL[loc],
            sg.label,
            PRIO_LABEL[pr],
            SIT_LABEL[sit],
            TRACK_LABELS[r.track],
            r.track,
          ]);
        }
      }
    }
  }
}
process.stdout.write(rows.map((r) => r.map(esc).join(",")).join("\n") + "\n");
