// V2 state metadata. Re-uses the same dataset as V1 but lives separately so V2
// can evolve (e.g. tri-state regulated/partial/deregulated) without disturbing V1.
//
// Phase 0 + Phase 4 note: the pane-provided regulated/deregulated/partial list
// (2026-05-14) flags GA, MI, MT, OR, CA-CCA-only as partial. For the immediate
// V2 build, partial markets are conservatively treated as regulated for the
// "supplier choice for commercial buyers" question — the recommendation engine
// will recommend regulated-market actions, which is the safer default. A tri-state
// extension can refine this without changing the engine contract.

export interface StateEntry {
  code: string;
  name: string;
  isDeregulated: boolean;
  isPartial?: boolean;
}

export const STATES: StateEntry[] = [
  { code: "AL", name: "Alabama", isDeregulated: false },
  { code: "AK", name: "Alaska", isDeregulated: false },
  { code: "AZ", name: "Arizona", isDeregulated: false },
  { code: "AR", name: "Arkansas", isDeregulated: false },
  { code: "CA", name: "California", isDeregulated: false, isPartial: true },
  { code: "CO", name: "Colorado", isDeregulated: false },
  { code: "CT", name: "Connecticut", isDeregulated: true },
  { code: "DE", name: "Delaware", isDeregulated: true },
  { code: "DC", name: "District of Columbia", isDeregulated: true },
  { code: "FL", name: "Florida", isDeregulated: false },
  { code: "GA", name: "Georgia", isDeregulated: false, isPartial: true },
  { code: "HI", name: "Hawaii", isDeregulated: false },
  { code: "ID", name: "Idaho", isDeregulated: false },
  { code: "IL", name: "Illinois", isDeregulated: true },
  { code: "IN", name: "Indiana", isDeregulated: false },
  { code: "IA", name: "Iowa", isDeregulated: false },
  { code: "KS", name: "Kansas", isDeregulated: false },
  { code: "KY", name: "Kentucky", isDeregulated: false },
  { code: "LA", name: "Louisiana", isDeregulated: false },
  { code: "ME", name: "Maine", isDeregulated: true },
  { code: "MD", name: "Maryland", isDeregulated: true },
  { code: "MA", name: "Massachusetts", isDeregulated: true },
  { code: "MI", name: "Michigan", isDeregulated: false, isPartial: true },
  { code: "MN", name: "Minnesota", isDeregulated: false },
  { code: "MS", name: "Mississippi", isDeregulated: false },
  { code: "MO", name: "Missouri", isDeregulated: false },
  { code: "MT", name: "Montana", isDeregulated: false, isPartial: true },
  { code: "NE", name: "Nebraska", isDeregulated: false },
  { code: "NV", name: "Nevada", isDeregulated: false },
  { code: "NH", name: "New Hampshire", isDeregulated: true },
  { code: "NJ", name: "New Jersey", isDeregulated: true },
  { code: "NM", name: "New Mexico", isDeregulated: false },
  { code: "NY", name: "New York", isDeregulated: true },
  { code: "NC", name: "North Carolina", isDeregulated: false },
  { code: "ND", name: "North Dakota", isDeregulated: false },
  { code: "OH", name: "Ohio", isDeregulated: true },
  { code: "OK", name: "Oklahoma", isDeregulated: false },
  { code: "OR", name: "Oregon", isDeregulated: false, isPartial: true },
  { code: "PA", name: "Pennsylvania", isDeregulated: true },
  { code: "RI", name: "Rhode Island", isDeregulated: true },
  { code: "SC", name: "South Carolina", isDeregulated: false },
  { code: "SD", name: "South Dakota", isDeregulated: false },
  { code: "TN", name: "Tennessee", isDeregulated: false },
  { code: "TX", name: "Texas", isDeregulated: true },
  { code: "UT", name: "Utah", isDeregulated: false },
  { code: "VT", name: "Vermont", isDeregulated: false },
  { code: "VA", name: "Virginia", isDeregulated: true },
  { code: "WA", name: "Washington", isDeregulated: false },
  { code: "WV", name: "West Virginia", isDeregulated: false },
  { code: "WI", name: "Wisconsin", isDeregulated: false },
  { code: "WY", name: "Wyoming", isDeregulated: false },
];

export const STATES_BY_CODE = new Map(STATES.map((s) => [s.code, s]));

export function getState(code: string): StateEntry | undefined {
  return STATES_BY_CODE.get(code.toUpperCase());
}

export function getStateName(code: string): string {
  return getState(code)?.name ?? code;
}
