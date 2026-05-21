// Mock data for Arise Energy Portfolio Dashboard
// Realistic commercial properties across TX, PA, IL, NY

export type ContractType = "Fixed" | "Index" | "Block & Index";
export type PropertyStatus = "active" | "expiring" | "expired";

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  sqft: number;
  contractType: ContractType;
  supplier: string;
  currentRate: number; // $/kWh
  marketRate: number;
  contractStart: string;
  contractEnd: string;
  monthlyUsageKwh: number;
  monthlyCost: number;
  budgetMonthlyCost: number;
  status: PropertyStatus;
  annualVolumeMwh: number;
  capacityTag: number; // kW
  transmissionRate: number;
  distributionRate: number;
  supplyRate: number;
  capacityRate: number;
}

export interface MonthlyCost {
  month: string;
  actual: number;
  budget: number;
}

export interface MonthlyPortfolioCost {
  month: string;
  actual: number;
  budget: number;
  forecast: number | null;
}

export const properties: Property[] = [
  {
    id: "prop-001",
    name: "One Liberty Place",
    address: "1650 Market St",
    city: "Philadelphia",
    state: "PA",
    sqft: 945000,
    contractType: "Fixed",
    supplier: "Constellation Energy",
    currentRate: 0.0823,
    marketRate: 0.0795,
    contractStart: "2024-07-01",
    contractEnd: "2026-06-30",
    monthlyUsageKwh: 1250000,
    monthlyCost: 102875,
    budgetMonthlyCost: 100000,
    status: "active",
    annualVolumeMwh: 15000,
    capacityTag: 3200,
    transmissionRate: 0.0089,
    distributionRate: 0.0234,
    supplyRate: 0.0823,
    capacityRate: 0.0156,
  },
  {
    id: "prop-002",
    name: "Willis Tower - Suite 4200",
    address: "233 S Wacker Dr",
    city: "Chicago",
    state: "IL",
    sqft: 78000,
    contractType: "Index",
    supplier: "NRG Business",
    currentRate: 0.0756,
    marketRate: 0.0712,
    contractStart: "2025-01-01",
    contractEnd: "2026-12-31",
    monthlyUsageKwh: 98000,
    monthlyCost: 7409,
    budgetMonthlyCost: 7200,
    status: "active",
    annualVolumeMwh: 1176,
    capacityTag: 245,
    transmissionRate: 0.0078,
    distributionRate: 0.0198,
    supplyRate: 0.0756,
    capacityRate: 0.0134,
  },
  {
    id: "prop-003",
    name: "Galleria Office Tower I",
    address: "2700 Post Oak Blvd",
    city: "Houston",
    state: "TX",
    sqft: 520000,
    contractType: "Block & Index",
    supplier: "TXU Energy",
    currentRate: 0.0689,
    marketRate: 0.0645,
    contractStart: "2024-03-01",
    contractEnd: "2026-02-28",
    monthlyUsageKwh: 780000,
    monthlyCost: 53742,
    budgetMonthlyCost: 50000,
    status: "expiring",
    annualVolumeMwh: 9360,
    capacityTag: 1950,
    transmissionRate: 0.0045,
    distributionRate: 0.0156,
    supplyRate: 0.0689,
    capacityRate: 0.0098,
  },
  {
    id: "prop-004",
    name: "One Vanderbilt Ave",
    address: "1 Vanderbilt Ave",
    city: "New York",
    state: "NY",
    sqft: 1700000,
    contractType: "Fixed",
    supplier: "Shell Energy",
    currentRate: 0.1145,
    marketRate: 0.1089,
    contractStart: "2025-04-01",
    contractEnd: "2028-03-31",
    monthlyUsageKwh: 2800000,
    monthlyCost: 320600,
    budgetMonthlyCost: 315000,
    status: "active",
    annualVolumeMwh: 33600,
    capacityTag: 6800,
    transmissionRate: 0.0134,
    distributionRate: 0.0312,
    supplyRate: 0.1145,
    capacityRate: 0.0198,
  },
  {
    id: "prop-005",
    name: "Energy Plaza",
    address: "1601 Bryan St",
    city: "Dallas",
    state: "TX",
    sqft: 410000,
    contractType: "Fixed",
    supplier: "Engie Resources",
    currentRate: 0.0634,
    marketRate: 0.0678,
    contractStart: "2025-06-01",
    contractEnd: "2027-05-31",
    monthlyUsageKwh: 615000,
    monthlyCost: 38991,
    budgetMonthlyCost: 40000,
    status: "active",
    annualVolumeMwh: 7380,
    capacityTag: 1520,
    transmissionRate: 0.0042,
    distributionRate: 0.0148,
    supplyRate: 0.0634,
    capacityRate: 0.0092,
  },
  {
    id: "prop-006",
    name: "Three Logan Square",
    address: "1717 Arch St",
    city: "Philadelphia",
    state: "PA",
    sqft: 620000,
    contractType: "Index",
    supplier: "Direct Energy",
    currentRate: 0.0867,
    marketRate: 0.0795,
    contractStart: "2024-01-01",
    contractEnd: "2025-12-31",
    monthlyUsageKwh: 820000,
    monthlyCost: 71094,
    budgetMonthlyCost: 65000,
    status: "expiring",
    annualVolumeMwh: 9840,
    capacityTag: 2100,
    transmissionRate: 0.0089,
    distributionRate: 0.0234,
    supplyRate: 0.0867,
    capacityRate: 0.0156,
  },
  {
    id: "prop-007",
    name: "JPMorgan Chase Tower",
    address: "600 Travis St",
    city: "Houston",
    state: "TX",
    sqft: 1200000,
    contractType: "Fixed",
    supplier: "Calpine Energy",
    currentRate: 0.0712,
    marketRate: 0.0645,
    contractStart: "2023-09-01",
    contractEnd: "2025-08-31",
    monthlyUsageKwh: 1800000,
    monthlyCost: 128160,
    budgetMonthlyCost: 120000,
    status: "expiring",
    annualVolumeMwh: 21600,
    capacityTag: 4500,
    transmissionRate: 0.0045,
    distributionRate: 0.0156,
    supplyRate: 0.0712,
    capacityRate: 0.0098,
  },
  {
    id: "prop-008",
    name: "Aon Center",
    address: "200 E Randolph St",
    city: "Chicago",
    state: "IL",
    sqft: 830000,
    contractType: "Block & Index",
    supplier: "NextEra Energy",
    currentRate: 0.0778,
    marketRate: 0.0712,
    contractStart: "2025-03-01",
    contractEnd: "2027-02-28",
    monthlyUsageKwh: 1100000,
    monthlyCost: 85580,
    budgetMonthlyCost: 82000,
    status: "active",
    annualVolumeMwh: 13200,
    capacityTag: 2800,
    transmissionRate: 0.0078,
    distributionRate: 0.0198,
    supplyRate: 0.0778,
    capacityRate: 0.0134,
  },
  {
    id: "prop-009",
    name: "MetLife Building",
    address: "200 Park Ave",
    city: "New York",
    state: "NY",
    sqft: 680000,
    contractType: "Fixed",
    supplier: "Constellation Energy",
    currentRate: 0.1098,
    marketRate: 0.1089,
    contractStart: "2025-01-01",
    contractEnd: "2026-12-31",
    monthlyUsageKwh: 1020000,
    monthlyCost: 111996,
    budgetMonthlyCost: 110000,
    status: "active",
    annualVolumeMwh: 12240,
    capacityTag: 2600,
    transmissionRate: 0.0134,
    distributionRate: 0.0312,
    supplyRate: 0.1098,
    capacityRate: 0.0198,
  },
  {
    id: "prop-010",
    name: "Two Commerce Square",
    address: "2001 Market St",
    city: "Philadelphia",
    state: "PA",
    sqft: 410000,
    contractType: "Fixed",
    supplier: "NRG Business",
    currentRate: 0.0845,
    marketRate: 0.0795,
    contractStart: "2024-06-01",
    contractEnd: "2025-05-31",
    monthlyUsageKwh: 540000,
    monthlyCost: 45630,
    budgetMonthlyCost: 43000,
    status: "expired",
    annualVolumeMwh: 6480,
    capacityTag: 1380,
    transmissionRate: 0.0089,
    distributionRate: 0.0234,
    supplyRate: 0.0845,
    capacityRate: 0.0156,
  },
  {
    id: "prop-011",
    name: "Bank of America Plaza",
    address: "901 Main St",
    city: "Dallas",
    state: "TX",
    sqft: 1850000,
    contractType: "Block & Index",
    supplier: "TXU Energy",
    currentRate: 0.0656,
    marketRate: 0.0678,
    contractStart: "2025-02-01",
    contractEnd: "2027-01-31",
    monthlyUsageKwh: 2600000,
    monthlyCost: 170560,
    budgetMonthlyCost: 175000,
    status: "active",
    annualVolumeMwh: 31200,
    capacityTag: 6400,
    transmissionRate: 0.0042,
    distributionRate: 0.0148,
    supplyRate: 0.0656,
    capacityRate: 0.0092,
  },
  {
    id: "prop-012",
    name: "One Penn Plaza",
    address: "250 W 34th St",
    city: "New York",
    state: "NY",
    sqft: 560000,
    contractType: "Index",
    supplier: "Engie Resources",
    currentRate: 0.1167,
    marketRate: 0.1089,
    contractStart: "2024-04-01",
    contractEnd: "2025-03-31",
    monthlyUsageKwh: 840000,
    monthlyCost: 98028,
    budgetMonthlyCost: 90000,
    status: "expired",
    annualVolumeMwh: 10080,
    capacityTag: 2150,
    transmissionRate: 0.0134,
    distributionRate: 0.0312,
    supplyRate: 0.1167,
    capacityRate: 0.0198,
  },
  {
    id: "prop-013",
    name: "Prudential Tower",
    address: "130 E Randolph St",
    city: "Chicago",
    state: "IL",
    sqft: 480000,
    contractType: "Fixed",
    supplier: "Direct Energy",
    currentRate: 0.0734,
    marketRate: 0.0712,
    contractStart: "2025-07-01",
    contractEnd: "2027-06-30",
    monthlyUsageKwh: 640000,
    monthlyCost: 46976,
    budgetMonthlyCost: 46000,
    status: "active",
    annualVolumeMwh: 7680,
    capacityTag: 1600,
    transmissionRate: 0.0078,
    distributionRate: 0.0198,
    supplyRate: 0.0734,
    capacityRate: 0.0134,
  },
  {
    id: "prop-014",
    name: "Heritage Plaza",
    address: "1111 Bagby St",
    city: "Houston",
    state: "TX",
    sqft: 340000,
    contractType: "Fixed",
    supplier: "NRG Business",
    currentRate: 0.0698,
    marketRate: 0.0645,
    contractStart: "2024-11-01",
    contractEnd: "2026-10-31",
    monthlyUsageKwh: 480000,
    monthlyCost: 33504,
    budgetMonthlyCost: 32000,
    status: "active",
    annualVolumeMwh: 5760,
    capacityTag: 1200,
    transmissionRate: 0.0045,
    distributionRate: 0.0156,
    supplyRate: 0.0698,
    capacityRate: 0.0098,
  },
];

// Generate 12 months of cost history for a property
export function generateCostHistory(property: Property): MonthlyCost[] {
  const months = [
    "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025",
    "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026",
  ];
  const base = property.monthlyCost;
  const budget = property.budgetMonthlyCost;

  return months.map((month, i) => {
    const seasonalFactor = [1.05, 1.12, 1.18, 1.15, 1.08, 1.0, 0.92, 0.88, 0.9, 0.93, 0.97, 1.02][i];
    const noise = 1 + (Math.sin(i * 2.7 + property.id.charCodeAt(5)) * 0.04);
    return {
      month,
      actual: Math.round(base * seasonalFactor * noise),
      budget: Math.round(budget * seasonalFactor),
    };
  });
}

// Generate portfolio-level monthly budget vs actual
export function generatePortfolioBudget(): MonthlyPortfolioCost[] {
  const months = [
    "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025",
    "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Apr 2026",
    "May 2026", "Jun 2026", "Jul 2026",
  ];

  const totalMonthly = properties.reduce((sum, p) => sum + p.monthlyCost, 0);
  const totalBudget = properties.reduce((sum, p) => sum + p.budgetMonthlyCost, 0);

  return months.map((month, i) => {
    const seasonalFactor = [1.05, 1.12, 1.18, 1.15, 1.08, 1.0, 0.92, 0.88, 0.9, 0.93, 0.97, 1.02, 1.05, 1.12, 1.18][i];
    const noise = 1 + (Math.sin(i * 3.1) * 0.03);
    const isPast = i < 12;
    return {
      month,
      actual: isPast ? Math.round(totalMonthly * seasonalFactor * noise) : 0,
      budget: Math.round(totalBudget * seasonalFactor),
      forecast: !isPast ? Math.round(totalMonthly * seasonalFactor * 1.02) : null,
    };
  });
}

// Utility functions
export function getStatusColor(status: PropertyStatus): string {
  switch (status) {
    case "active": return "text-green-700";
    case "expiring": return "text-amber-700";
    case "expired": return "text-red-700";
  }
}

export function getStatusBg(status: PropertyStatus): string {
  switch (status) {
    case "active": return "bg-green-50 text-green-700 border-green-200";
    case "expiring": return "bg-amber-50 text-amber-700 border-amber-200";
    case "expired": return "bg-red-50 text-red-700 border-red-200";
  }
}

export function getStatusLabel(status: PropertyStatus): string {
  switch (status) {
    case "active": return "Active";
    case "expiring": return "Expiring Soon";
    case "expired": return "Expired";
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatRate(value: number): string {
  return `$${(value * 100).toFixed(2)}/kWh`;
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date("2026-04-30");
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getExpiringCount(): number {
  return properties.filter(p => {
    const days = daysUntil(p.contractEnd);
    return days > 0 && days <= 90;
  }).length;
}

export function getTotalMonthlyCost(): number {
  return properties.reduce((sum, p) => sum + p.monthlyCost, 0);
}

export function getEstimatedSavings(): number {
  return properties.reduce((sum, p) => {
    if (p.currentRate > p.marketRate) {
      return sum + (p.currentRate - p.marketRate) * p.monthlyUsageKwh;
    }
    return sum;
  }, 0);
}
