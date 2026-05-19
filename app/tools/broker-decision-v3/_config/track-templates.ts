import type { Priority, Track } from "../_lib/types";

export const TRACK_LABELS: Record<Track, string> = {
  A_use_broker: "Use a broker",
  B_go_direct: "Go direct",
  C_arise_managed: "Arise-managed",
  D_regulated: "Regulated market",
};

// V3 result cards use these accents. Each accent meets WCAG AA on white text.
// Per-track visual treatments for the result card.
// `headerBg` is a gradient string for the hero band. Track-specific hue, all
// pass white-text contrast at AA. `chipBg` / `chipText` are for the
// "What Arise would do next" presumptive-close card. `bodyBg` is the soft
// tint behind the rest of the result body (lavender direction per reference image).
export const TRACK_ACCENTS: Record<Track, {
  headerBg: string;
  chipBg: string;
  chipText: string;
  bodyBg: string;
}> = {
  A_use_broker: {
    headerBg: "linear-gradient(180deg, #1c8aef 0%, #006bc5 100%)",
    chipBg: "#EBF3FD",
    chipText: "#006bc5",
    bodyBg: "#F5F8FF",
  },
  B_go_direct: {
    headerBg: "linear-gradient(180deg, #06b6d4 0%, #0e7490 100%)",
    chipBg: "#ECFEFF",
    chipText: "#0e7490",
    bodyBg: "#F1FBFD",
  },
  C_arise_managed: {
    headerBg: "linear-gradient(180deg, #6173E5 0%, #4F5CB8 100%)",
    chipBg: "#EEF0FB",
    chipText: "#4F5CB8",
    bodyBg: "#F5F3FF",
  },
  D_regulated: {
    headerBg: "linear-gradient(180deg, #334155 0%, #1e293b 100%)",
    chipBg: "#F1F5F9",
    chipText: "#334155",
    bodyBg: "#F8FAFC",
  },
};

type PriorityKey = Priority;

interface CloseTemplate {
  body: string;
  cta: string;
}

// Full 4x4 priority × track matrix per Warlock V3 synthesized copy.
// Several cells share base copy via collapse rules (see warlock-v3-copy.md §3).
const CLOSES: Record<Track, Record<PriorityKey, CloseTemplate>> = {
  A_use_broker: {
    balanced_price_risk: {
      body:
        "Given you want a fair price without buying at the wrong time, we'd start with your invoices, current contracts, and usage data. Arise can help build that picture: sites, dates, load, contract terms, market timing. Then we'd compare brokers on total cost, fee clarity, supplier reach, and monitoring plan — not just the first rate shown. That view tells you which broker can manage risk across the whole term.",
      cta: "Compare brokers",
    },
    price_first: {
      body:
        "Given you want lower total cost, we wouldn't chase the lowest headline rate. We'd collect your invoice and contract details, check what's included in each rate, and ask brokers to show every fee, pass-through, and renewal term. Then we'd compare the all-in cost across offers. A low rate that leaves costs out isn't a low-cost contract.",
      cta: "Review total cost",
    },
    budget_certainty: {
      body:
        "Given you want budget certainty, we'd look for a broker who can explain fixed price, hedged buying, and timing in plain language. Send Arise an invoice from each location or a utility login — we can pull contract dates and usage. From there, compare brokers on how they reduce risk over time, not how fast they push a quote.",
      cta: "Check the risk plan",
    },
    handled_for_me: {
      body:
        "Given you want this handled, send Arise an invoice from each location or a utility login. We pull your usage, contract dates, supplier details, and location data, then pair that with market data to build a portfolio view. We have a short call about what matters to you, keep watching the market, and tell you when it's the right time to act. You can log in anytime to see your portfolio.",
      cta: "Send your invoice",
    },
  },
  B_go_direct: {
    balanced_price_risk: {
      body:
        "Given your setup looks straightforward, we'd get two or three direct supplier quotes and compare them on total cost — not just rate. Ask what's fixed, what can pass through, when the contract renews, and what happens if the market moves. If terms are clear and your usage is steady, direct can be enough. Set a reminder well before the end date so you're not pushed into a rushed renewal.",
      cta: "Ask suppliers",
    },
    price_first: {
      body:
        "Given your goal is cost, direct can work if you compare the full bill. Ask each supplier for the all-in price, contract length, pass-through rules, early-end fees, and renewal terms. A cheap headline rate becomes expensive if fees sit outside the quote. If you want a second set of eyes, send Arise the quote you're looking at — we'll run it against our market benchmarks and tell you whether to sign.",
      cta: "Compare quotes",
    },
    budget_certainty: {
      body:
        "Given you want a clear budget and your setup is straightforward, ask suppliers for fixed-price options and a plain list of anything that can still change. Don't stop at the rate. Check what happens at renewal, whether the contract auto-renews, and how early you can shop again. If the supplier can explain the tradeoff clearly, direct may be the cleanest path.",
      cta: "Check terms",
    },
    handled_for_me: {
      body:
        "Given you want less work, direct may still be simple — but Arise can take the first pass. Send one invoice or a utility login. We pull your usage, supplier, and contract details, then tell you whether this is simple enough to quote directly or worth watching longer. If direct is best, you still get the questions to ask before you sign.",
      cta: "Send your invoice",
    },
  },
  C_arise_managed: {
    balanced_price_risk: {
      body:
        "Given your answers point to a mixed path, we'd build the portfolio view first. Send invoices or a utility login for each location, and Arise pulls usage, dates, supplier details, and market data. Then we separate what should be quoted now, what should be watched, and what can stay direct. That keeps you from locking every site on one bad market day.",
      cta: "Build the view",
    },
    price_first: {
      body:
        "Given you want lower total cost across a mixed portfolio, we'd sort sites by size, contract date, and market. Some accounts need broker competition; others are simple enough to quote direct. Arise pulls the data, compares all-in costs, and shows where fees or pass-throughs change the answer. The goal isn't the lowest-looking rate. It's the best cost for the risk you're carrying.",
      cta: "Map the portfolio",
    },
    budget_certainty: {
      body:
        "Given you want budget certainty across several sites or dates, we wouldn't buy everything at once unless the data supports it. Arise pulls invoices, contracts, and location data, then combines that with market data to plan when each account should move. You get a portfolio view, a short call on priorities, and ongoing market watch until it's time to act.",
      cta: "Plan the timing",
    },
    handled_for_me: {
      body:
        "Given you want this handled, this is the strongest Arise fit. Send an invoice from each location or a utility login. We use that data, plus a letter to act on your behalf, to gather contract details and build your portfolio view. From there we have a short call, monitor the market, and move when timing and terms make sense. You can log in anytime to see status by site.",
      cta: "Send your invoice",
    },
  },
  D_regulated: {
    balanced_price_risk: {
      body:
        "Your markets sell power through the regulated utility, so there's nothing to bid out. The savings live in tariff structure, demand management, and efficiency upgrades. Arise can pull your tariff and usage, find the time-of-use or demand-response programs you qualify for, and lay out which moves pay back fastest.",
      cta: "Review your tariff",
    },
    price_first: {
      body:
        "Your states don't have supplier choice, so a lower rate isn't a thing to shop for. The cost lever is your tariff and your load profile. Send Arise a recent bill — we'll check whether you're on the right rate schedule, whether demand-response would pay, and where efficiency would shave the bill.",
      cta: "Review your tariff",
    },
    budget_certainty: {
      body:
        "In regulated markets, budget certainty comes from understanding your tariff and your demand profile, not from contract structure. Arise can pull your bills, model your year, and flag the months where demand charges spike. From there you have something to budget against — and the levers to flatten it.",
      cta: "Model your year",
    },
    handled_for_me: {
      body:
        "Send Arise your latest bills. We pull your tariff structure, model your usage, and identify whether time-of-use, demand-response, or an efficiency assessment would move the needle. You don't shop for power here — but you don't have to chase any of this either.",
      cta: "Send your invoice",
    },
  },
};

export function buildPresumptiveClose(
  track: Track,
  priority: Priority | null,
): { body: string; cta: string } {
  const fallback: Priority = "balanced_price_risk";
  const key: Priority = priority ?? fallback;
  return CLOSES[track][key];
}

// Stand-alone vet checklist surfaced in the result card and the how-to-vet section.
// Lifted from V1 with track-aware framing.
export const VET_CHECKLIST: Record<Track, { dealMakers: string[]; dealBreakers: string[] }> = {
  A_use_broker: {
    dealMakers: [
      "Shows competing offers side by side with the all-in cost.",
      "Explains fixed vs. index, and how they manage timing risk.",
      "Discloses their fee on every quote, in writing.",
      "Has a plan for after you sign — monitoring, renewal, billing issues.",
      "Will name a reference at a business your size.",
    ],
    dealBreakers: [
      "Won't disclose how they're paid.",
      "Pushes a single supplier without explaining why.",
      "Pressures you to sign quickly.",
      "Can't explain the tradeoff between cost and risk in plain terms.",
      "No follow-up plan after contract signing.",
    ],
  },
  B_go_direct: {
    dealMakers: [
      "Quote breaks out supply, delivery, and any pass-through charges.",
      "Contract length and early-end fees are clear.",
      "Renewal terms are spelled out — no auto-renewal surprises.",
      "Supplier will put answers to your questions in writing.",
      "Reasonable time to review the contract before signing.",
    ],
    dealBreakers: [
      "Rate looks too low and terms are vague.",
      "Long contract with steep early-termination fees.",
      "No explanation of what happens at renewal.",
      "Rep rushes you to sign.",
      "Pass-through charges hidden outside the quoted rate.",
    ],
  },
  C_arise_managed: {
    dealMakers: [
      "Portfolio view by site, with contract dates and usage in one place.",
      "Market watch with a clear signal for when to act.",
      "Arise team can answer questions about your specific contracts.",
      "Login lets you see status anytime.",
      "Clear terms on what Arise does on your behalf.",
    ],
    dealBreakers: [
      "Vague on what Arise actually acts on vs. what you decide.",
      "No portfolio view by site.",
      "No way to see status without calling someone.",
      "Surprise actions without your sign-off.",
    ],
  },
  D_regulated: {
    dealMakers: [
      "Tariff review names the rate schedule you should be on.",
      "Demand-response options are evaluated with your load profile.",
      "Efficiency recommendations come with a payback estimate.",
      "Tariff filings checked annually for changes.",
    ],
    dealBreakers: [
      "Generic energy-audit pitch without your bill data.",
      "Promises savings from supplier shopping that doesn't exist in your state.",
      "No tariff-schedule analysis specific to your meter.",
    ],
  },
};
