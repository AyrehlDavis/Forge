// Generates a markdown audit of the v3 routing logic for Chris's review.
// Run:   node scripts/dump-routing-logic.mjs > _bmad-output/routing-logic-matrix.md

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
const PRIORITIES = [
  "price_first",
  "balanced_price_risk",
  "budget_certainty",
  "handled_for_me",
];
const SITUATIONS = [
  "shopping_now",
  "renewal_soon",
  "contract_6_plus_months",
  "always_in_market",
];

const TRACK_LABELS = {
  A_use_broker: "Use a broker",
  B_go_direct: "Go direct",
  C_regulated: "Local Utility",
};

// The 13 rules in chooseTrack, in evaluation order. Hand-extracted from
// recommend.ts so Chris can read the logic without the codebase open.
const RULES = [
  {
    id: 1,
    track: "C_regulated",
    when:
      "All states are regulated (no deregulated, no partial). Short-circuits everything else.",
    note: "If a single FL or GA buyer lands, they go here regardless of spend, sites, priority, or timing.",
  },
  {
    id: 2,
    track: "A_use_broker",
    when:
      "Situation is `always_in_market` OR `contract_6_plus_months`, AND the user has any portfolio signal (i.e. NOT all of: low spend + single site + single state).",
    note: "Time-in-market + non-trivial buyer → broker manages the watch.",
  },
  {
    id: 3,
    track: "A_use_broker",
    when:
      "Priority is `handled_for_me` AND any of: multi-site, multi-state, or high spend (`100k_500k` / `over_500k`).",
    note: "User explicitly wants this off their plate AND has the volume to justify broker overhead.",
  },
  {
    id: 4,
    track: "B_go_direct",
    when: "Priority is `handled_for_me` but the buyer is small/simple (no portfolio signal).",
    note: "Even hands-off buyers go direct when the portfolio is single-site low-spend — broker overhead doesn't pay off.",
  },
  {
    id: 5,
    track: "A_use_broker",
    when: "Spend is `over_500k` (regardless of anything else not already caught).",
    note: "Spend alone is enough to clear broker fees.",
  },
  {
    id: 6,
    track: "A_use_broker",
    when: "Many sites (`11-50` or `50+`).",
    note: "Site count alone is enough — too much portfolio to manage solo.",
  },
  {
    id: 7,
    track: "A_use_broker",
    when: "Multi-state AND at least one state is deregulated.",
    note: "Multi-state in open markets means multiple rulebooks and bidding processes — broker required.",
  },
  {
    id: 8,
    track: "A_use_broker",
    when:
      "Multi-site AND at least one deregulated state AND (risk-leaning priority OR `renewal_soon`).",
    note: "Multi-site dereg portfolios with risk concerns or active renewals.",
  },
  {
    id: 9,
    track: "A_use_broker",
    when: "High spend (`100k_500k` / `over_500k`) AND risk-leaning priority.",
    note: "Spend + risk concern → broker structures the contract.",
  },
  {
    id: 10,
    track: "A_use_broker",
    when: "Mixed market (some dereg + some regulated) AND multi-site.",
    note: "Mixed portfolios are operationally messy — broker untangles them.",
  },
  {
    id: 11,
    track: "B_go_direct",
    when:
      "Deregulated state AND single site AND single state AND low spend (`under_25k`).",
    note: "Textbook small direct deal.",
  },
  {
    id: 12,
    track: "B_go_direct",
    when:
      "Deregulated state AND single site AND NOT risk-leaning (i.e. price-first or handled-for-me).",
    note: "Simple, single-site, not worried about risk — direct works.",
  },
  {
    id: 13,
    track: "—",
    when: "Fallback: any deregulated → broker, else regulated.",
    note: "Catches anything the rules above didn't claim.",
  },
];

function spendLabel(s) {
  return { under_25k: "<$25K", "25k_100k": "$25K-$100K", "100k_500k": "$100K-$500K", over_500k: ">$500K" }[s];
}
function locLabel(l) {
  return { "1": "1 site", "2-10": "2-10 sites", "11-50": "11-50 sites", "50+": "50+ sites" }[l];
}
function prioLabel(p) {
  return { price_first: "Price first", balanced_price_risk: "Balanced", budget_certainty: "Certainty", handled_for_me: "Hands-off" }[p];
}
function sitLabel(s) {
  return { shopping_now: "Shopping now", renewal_soon: "Renewal soon", contract_6_plus_months: "6+ mo out", always_in_market: "Always in" }[s];
}

const lines = [];
const p = (s) => lines.push(s);

p("# Broker-decision routing logic — audit matrix");
p("");
p("Generated from `app/tools/broker-decision-v3/_lib/recommend.ts` on " + new Date().toISOString().split("T")[0] + ".");
p("");
p("This shows the 13 rules in `chooseTrack`, in evaluation order, plus a coverage matrix of " + (SPENDS.length * LOCS.length * STATE_GROUPS.length * PRIORITIES.length * SITUATIONS.length) + " input combinations and which track each one routes to. **Earlier rules short-circuit later ones.**");
p("");

p("## Routing rules (evaluation order)");
p("");
p("| # | → Track | Condition | Note |");
p("|---|---|---|---|");
for (const r of RULES) {
  p(`| ${r.id} | **${TRACK_LABELS[r.track] ?? r.track}** | ${r.when} | ${r.note} |`);
}
p("");

p("## Coverage matrix");
p("");
p("Every combination of (spend × locations × state-group × priority × situation). Use Ctrl+F to find a specific fixture, or group by Track column to see what routes where.");
p("");
p("| Spend | Locations | States | Priority | Situation | → Track |");
p("|---|---|---|---|---|---|");

const counts = { A_use_broker: 0, B_go_direct: 0, C_regulated: 0 };
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
          counts[r.track]++;
          p(`| ${spendLabel(spend)} | ${locLabel(loc)} | ${sg.label} | ${prioLabel(pr)} | ${sitLabel(sit)} | **${TRACK_LABELS[r.track]}** |`);
        }
      }
    }
  }
}
p("");
p("## Distribution");
p("");
const total = counts.A_use_broker + counts.B_go_direct + counts.C_regulated;
p(`- **${TRACK_LABELS.A_use_broker}**: ${counts.A_use_broker} / ${total} (${((counts.A_use_broker / total) * 100).toFixed(1)}%)`);
p(`- **${TRACK_LABELS.B_go_direct}**: ${counts.B_go_direct} / ${total} (${((counts.B_go_direct / total) * 100).toFixed(1)}%)`);
p(`- **${TRACK_LABELS.C_regulated}**: ${counts.C_regulated} / ${total} (${((counts.C_regulated / total) * 100).toFixed(1)}%)`);

process.stdout.write(lines.join("\n") + "\n");
