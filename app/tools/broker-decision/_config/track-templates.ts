import type { Track, RecommendationVariables } from "../_lib/types";

export interface TrackContent {
  eyebrow: string;
  headline: string;
  accent: "blue" | "cyan" | "violet";
  explanation: (v: RecommendationVariables) => string;
  whyBullets: (v: RecommendationVariables) => Array<{ label: string; body: string }>;
  actionChecklist: string[];
  redFlags: string[];
  greenFlags: string[];
  questionsHeader: string;
  questions: string[];
}

const TRACK_A: TrackContent = {
  eyebrow: "Based on your portfolio",
  headline: "A broker makes sense for your business.",
  accent: "blue",
  explanation: (v) =>
    `With ${v.locationLabel} across ${v.stateCount} ${
      v.stateCount === 1 ? "state" : "states"
    }, you've got enough moving pieces — competitive bidding, multi-state contracts, renewal timing — that bringing in a broker pays off. You can do it yourself, but it's real, ongoing work, and one missed renewal can lock you into a worse rate for years.`,
  whyBullets: (v) => [
    {
      label: `${v.locationLabel} means negotiation leverage.`,
      body: "A broker placing volume across your sites gets supplier attention a single-site buyer doesn't.",
    },
    {
      label: `${v.stateCount} ${v.stateCount === 1 ? "state" : "states"} means regulatory complexity.`,
      body: "Different markets, different rules, different pricing dynamics. A broker navigates that for you.",
    },
    {
      label: `${v.priorityLabel.charAt(0).toUpperCase() + v.priorityLabel.slice(1)} means you need strategy, not just a rate.`,
      body: "A broker helps you weigh fixed vs. index, evaluate terms, and time your contracts.",
    },
  ],
  actionChecklist: [
    "Get quotes from 2-3 brokers. Compare their approach, not just their rate.",
    "Ask each broker how many suppliers they work with. More competition = better outcome.",
    "Request a sample bid stack or market analysis. See how they present options.",
    "Ask how they're compensated. A good broker will tell you directly.",
    "Check if they monitor the market after you sign. Your needs don't end at contract execution.",
    "Ask for a reference from a business your size. Track record matters.",
  ],
  redFlags: [
    "Won't disclose their fee or how they're paid",
    "Pushes a single supplier without explaining why",
    "No follow-up plan after contract signing",
    "Can't explain the difference between fixed and index",
    "Pressures you to sign quickly",
  ],
  greenFlags: [
    "Shows you competing offers side by side",
    "Explains market timing and strategy",
    "Offers ongoing monitoring and renewal planning",
    "Transparent about fees on every quote",
    "Gives you time and answers your questions",
  ],
  questionsHeader: "Questions to ask any broker",
  questions: [
    "How many suppliers do you work with?",
    "How are you compensated — and is that visible on my quotes?",
    "Can I see competing offers side by side?",
    "What happens when my contract is up for renewal?",
    "Do you monitor the market after I sign?",
    "What do you do if there's a billing issue or rate dispute?",
    "Can I see a sample of how you present recommendations?",
  ],
};

const TRACK_B: TrackContent = {
  eyebrow: "Based on your single site",
  headline: "Going direct is the right call for your business.",
  accent: "cyan",
  explanation: (v) => {
    const stateName = v.firstStateName ?? "your state";
    return `At ${v.spendLabel} for a single location in ${stateName} and a focus on ${v.priorityLabel}, your situation is straightforward. The added cost and complexity of a broker probably isn't worth it. You can contact suppliers directly, compare a couple of offers, and sign a contract without a middleman.`;
  },
  whyBullets: (v) => [
    {
      label: "Single site means simpler procurement.",
      body: "You don't need competitive bidding across a portfolio. One or two calls can get you a competitive rate.",
    },
    {
      label: `${v.firstStateName ?? "Your state"} is a straightforward market.`,
      body: "You have access to multiple suppliers directly — no broker needed to open doors.",
    },
    {
      label: `Your priority is ${v.priorityLabel}.`,
      body: "A direct deal gets you there faster with fewer people involved.",
    },
  ],
  actionChecklist: [
    "Contact 2-3 suppliers directly and ask for their best commercial rate.",
    "Compare not just the rate — look at contract length, cancellation fees, and what's included.",
    "Check your current contract for auto-renewal clauses. Missing the window can lock you in.",
    "Ask each supplier what happens to your rate when the contract ends. Some default to much higher rates.",
    "Read the fine print on pass-through charges. Your \"fixed\" rate may not include everything.",
    "Set a calendar reminder 90 days before your contract expires. That's your shopping window.",
  ],
  redFlags: [
    "Rate that seems too low with unclear terms",
    "Long contract with steep early termination fees",
    "No explanation of what happens at renewal",
    "Pushy sales rep rushing you to sign",
    "Hidden pass-through charges not in the quoted rate",
  ],
  greenFlags: [
    "Clear breakdown of all charges — supply, delivery, fees",
    "Flexible terms that match your business timeline",
    "Transparent renewal process explained upfront",
    "Gives you a written quote and time to review",
    "Fixed rate that's truly all-inclusive, or clear disclosure of variable components",
  ],
  questionsHeader: "Questions to ask any supplier",
  questions: [
    "What's included in this rate? Is it truly fixed, or are there pass-through charges?",
    "What happens to my rate when this contract ends?",
    "Is there an auto-renewal clause? What's the opt-out window?",
    "What are the early termination fees if my situation changes?",
    "Can I see a sample bill so I know what to expect?",
    "Who do I call if there's a billing issue?",
  ],
};

const TRACK_C: TrackContent = {
  eyebrow: "Based on your mixed portfolio",
  headline: "A hybrid approach fits your business.",
  accent: "violet",
  explanation: (v) =>
    `Your situation is mixed. At ${v.spendLabel} across ${v.locationLabel} in ${v.stateLabel || "your market"} and a focus on ${v.priorityLabel}, some of your sites could benefit from a broker's competitive bidding and market expertise, while others might be simple enough to manage directly. A lot of businesses end up here — using a broker for the complex stuff and going direct where it's straightforward.`,
  whyBullets: () => [
    {
      label: "You have enough sites to benefit from a broker, but not all of them need that level of service.",
      body: "High-usage or multi-state locations get the most value from competitive bidding. Single, stable sites may not.",
    },
    {
      label: "Your priorities suggest you value both control and support.",
      body: "A hybrid approach lets you keep direct relationships where they matter and bring in expertise where it counts.",
    },
    {
      label: "This gives you a real comparison.",
      body: "You'll see firsthand how broker-managed and direct contracts perform — and you can adjust over time.",
    },
  ],
  actionChecklist: [
    "Identify which locations are most complex — multiple meters, high usage, multi-state. Those are your broker candidates.",
    "Keep your simpler sites direct — single location, stable usage, existing supplier relationship.",
    "Talk to 1-2 brokers about managing just the complex portion of your portfolio.",
    "Compare the experience and results after one contract cycle. Let the data tell you whether to expand broker coverage or pull back.",
    "Ask the broker if they'll work with a partial portfolio. Not all will — but the good ones do.",
    "Set renewal reminders for both broker-managed and direct sites. Don't let either set slip through the cracks.",
  ],
  redFlags: [
    "Broker won't work with a partial portfolio",
    "Supplier gives you a worse rate because you also use a broker elsewhere",
    "You're spending more time managing the split than you'd save",
    "No visibility into what the broker is doing vs. what you're doing directly",
  ],
  greenFlags: [
    "Broker is flexible about managing some sites, not all",
    "Supplier competes on merit regardless of your broker relationship",
    "The split is clean — broker handles the complex sites, you handle the simple ones",
    "Clear reporting from both sides so you can compare performance",
  ],
  questionsHeader: "Questions to ask when going hybrid",
  questions: [
    "(To a broker) Will you work with a partial portfolio — just my more complex sites?",
    "(To a broker) How will you report results so I can compare broker-managed vs. direct?",
    "(To a supplier) Will you quote me separately for the sites I manage directly?",
    "(To both) How do we handle renewal timing so nothing falls through the cracks?",
    "(To yourself) After one cycle — which sites performed better? Where did I spend the most time?",
  ],
};

export const TRACK_CONTENT: Record<Track, TrackContent> = {
  A_use_broker: TRACK_A,
  B_go_direct: TRACK_B,
  C_hybrid: TRACK_C,
};
