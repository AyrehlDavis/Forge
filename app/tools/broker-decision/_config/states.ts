export interface StateEntry {
  code: string;
  name: string;
  isDeregulated: boolean;
}

export const STATES: StateEntry[] = [
  { code: "AL", name: "Alabama", isDeregulated: false },
  { code: "AK", name: "Alaska", isDeregulated: false },
  { code: "AZ", name: "Arizona", isDeregulated: false },
  { code: "AR", name: "Arkansas", isDeregulated: false },
  { code: "CA", name: "California", isDeregulated: true },
  { code: "CO", name: "Colorado", isDeregulated: false },
  { code: "CT", name: "Connecticut", isDeregulated: true },
  { code: "DE", name: "Delaware", isDeregulated: true },
  { code: "DC", name: "District of Columbia", isDeregulated: true },
  { code: "FL", name: "Florida", isDeregulated: false },
  { code: "GA", name: "Georgia", isDeregulated: false },
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
  { code: "MI", name: "Michigan", isDeregulated: true },
  { code: "MN", name: "Minnesota", isDeregulated: false },
  { code: "MS", name: "Mississippi", isDeregulated: false },
  { code: "MO", name: "Missouri", isDeregulated: false },
  { code: "MT", name: "Montana", isDeregulated: false },
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
  { code: "OR", name: "Oregon", isDeregulated: false },
  { code: "PA", name: "Pennsylvania", isDeregulated: true },
  { code: "RI", name: "Rhode Island", isDeregulated: true },
  { code: "SC", name: "South Carolina", isDeregulated: false },
  { code: "SD", name: "South Dakota", isDeregulated: false },
  { code: "TN", name: "Tennessee", isDeregulated: false },
  { code: "TX", name: "Texas", isDeregulated: true },
  { code: "UT", name: "Utah", isDeregulated: false },
  { code: "VT", name: "Vermont", isDeregulated: false },
  { code: "VA", name: "Virginia", isDeregulated: false },
  { code: "WA", name: "Washington", isDeregulated: false },
  { code: "WV", name: "West Virginia", isDeregulated: false },
  { code: "WI", name: "Wisconsin", isDeregulated: false },
  { code: "WY", name: "Wyoming", isDeregulated: false },
];

const STATE_BY_CODE: Record<string, StateEntry> = Object.fromEntries(
  STATES.map((s) => [s.code, s]),
);

export function getStateByCode(code: string): StateEntry | undefined {
  return STATE_BY_CODE[code];
}

export function getStateName(code: string): string {
  return STATE_BY_CODE[code]?.name ?? code;
}

export function isDeregulated(code: string): boolean {
  return STATE_BY_CODE[code]?.isDeregulated ?? false;
}

export function joinStateNames(codes: string[]): string {
  const names = codes.map(getStateName);
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
