import type {
  LocationCount,
  Priority,
  Situation,
  Spend,
} from "../_lib/types";

export interface SelectionOption<T> {
  value: T;
  label: string;
  descriptor?: string;
}

export const SPEND_OPTIONS: SelectionOption<Spend>[] = [
  { value: "under_50k", label: "Under $50K", descriptor: "A small office, retail location, or single light-industrial site" },
  { value: "50k_250k", label: "$50K–$250K", descriptor: "A small business with a few locations, or one site with steady usage" },
  { value: "250k_1m", label: "$250K–$1M", descriptor: "A growing portfolio, or one large facility" },
  { value: "over_1m", label: "Over $1M", descriptor: "A multi-site operation, or one very large facility" },
];

export const LOCATION_COUNT_OPTIONS: SelectionOption<LocationCount>[] = [
  { value: "1", label: "Just one", descriptor: "Single site" },
  { value: "2-5", label: "2-5", descriptor: "Small portfolio" },
  { value: "6-20", label: "6-20", descriptor: "Mid-sized portfolio" },
  { value: "20+", label: "More than 20", descriptor: "Large portfolio" },
];

export const PRIORITY_OPTIONS: SelectionOption<Priority>[] = [
  {
    value: "lowest_cost",
    label: "Lowest cost",
    descriptor: "I want the best rate I can find.",
  },
  {
    value: "risk_management",
    label: "Risk management",
    descriptor: "I need predictable costs and fewer surprises.",
  },
  {
    value: "simplicity",
    label: "Simplicity",
    descriptor: "I want this handled with the least effort possible.",
  },
  {
    value: "sustainability",
    label: "Sustainability",
    descriptor: "I need to meet environmental or reporting goals.",
  },
];

export const SITUATION_OPTIONS: SelectionOption<Situation>[] = [
  {
    value: "new_contract",
    label: "New contract",
    descriptor: "I'm shopping for the first time or switching providers.",
  },
  {
    value: "renewal",
    label: "Renewal coming up",
    descriptor: "My current contract is ending in the next 12 months.",
  },
  {
    value: "exploring",
    label: "Just exploring",
    descriptor: "I'm not ready to act — just trying to understand my options.",
  },
];
