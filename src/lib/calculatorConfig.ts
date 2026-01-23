/**
 * Calculator Configuration - Admin-Editable Financial Constants
 * 
 * This file contains all configurable financial rules and constants used by
 * the calculators. These values can be updated when tax laws or regulations change.
 * 
 * ============================================================================
 * CONFIGURATION CATEGORIES
 * ============================================================================
 * 1. Tax Rules - Capital gains tax rates and holding periods
 * 2. GST & Duties - Current GST rates and import duties
 * 3. Inflation Data - Historical CPI data for real returns
 * 4. Default Assumptions - Making charges, buyback discounts, etc.
 * 
 * IMPORTANT: Update LAST_UPDATED when making changes to any configuration.
 * 
 * @lastUpdated 2026-01-23
 */

// ============================================================================
// LAST UPDATED - Update this when any config changes
// ============================================================================
export const CONFIG_LAST_UPDATED = "2026-01-23";

// ============================================================================
// TAX RULES - CAPITAL GAINS (India)
// ============================================================================
/**
 * Capital Gains Tax Rules for Physical Silver in India
 * 
 * As of Budget 2024:
 * - Physical silver (bars, coins): LTCG after 24 months
 * - Silver ETFs/Mutual Funds: LTCG after 24 months (treated as debt funds)
 * - Jewellery: Same as physical silver
 * 
 * LTCG Rate: 12.5% (without indexation) - Post July 2024
 * STCG: Added to income, taxed at slab rate
 * 
 * Reference: https://incometaxindia.gov.in
 */
export const TAX_CONFIG = {
  // Holding period for LTCG qualification (in months)
  LTCG_HOLDING_PERIOD_MONTHS: 24,
  
  // LTCG tax rate (flat rate without indexation) - Post July 2024
  LTCG_RATE: 0.125, // 12.5%
  
  // Whether indexation benefit is available (removed post July 2024)
  INDEXATION_AVAILABLE: false,
  
  // Surcharge thresholds and rates
  SURCHARGE_THRESHOLDS: [
    { above: 5000000, rate: 0.10 },   // 10% above 50L
    { above: 10000000, rate: 0.15 },  // 15% above 1Cr
    { above: 20000000, rate: 0.25 },  // 25% above 2Cr
    { above: 50000000, rate: 0.37 },  // 37% above 5Cr
  ],
  
  // Health & Education Cess
  CESS_RATE: 0.04, // 4%
  
  // Income tax slabs (New Regime FY 2024-25)
  NEW_REGIME_SLABS: [
    { upto: 300000, rate: 0 },
    { upto: 700000, rate: 0.05 },
    { upto: 1000000, rate: 0.10 },
    { upto: 1200000, rate: 0.15 },
    { upto: 1500000, rate: 0.20 },
    { above: 1500000, rate: 0.30 },
  ],
  
  // Old Regime slabs (for reference)
  OLD_REGIME_SLABS: [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.20 },
    { above: 1000000, rate: 0.30 },
  ],
  
  // Asset type configurations
  ASSET_TYPES: {
    PHYSICAL_SILVER: {
      name: "Physical Silver (Bars/Coins)",
      ltcgPeriodMonths: 24,
      indexationAllowed: false,
    },
    JEWELLERY: {
      name: "Silver Jewellery",
      ltcgPeriodMonths: 24,
      indexationAllowed: false,
    },
    SILVER_ETF: {
      name: "Silver ETF/Mutual Fund",
      ltcgPeriodMonths: 24,
      indexationAllowed: false,
    },
  },
} as const;

// ============================================================================
// GST & DUTIES
// ============================================================================
export const GST_CONFIG = {
  // GST on silver (bars, coins, jewellery)
  SILVER_GST_RATE: 0.03, // 3%
  
  // GST on making charges
  MAKING_CHARGES_GST_RATE: 0.05, // 5%
  
  // Import duty on silver
  IMPORT_DUTY_RATE: 0.06, // 6%
  
  // IGST on imported silver
  IGST_RATE: 0.03, // 3%
} as const;

// ============================================================================
// INFLATION DATA - CPI (Consumer Price Index)
// ============================================================================
/**
 * Historical CPI data for India (Base Year 2012 = 100)
 * Source: Ministry of Statistics and Programme Implementation (MOSPI)
 * 
 * This data is used for calculating inflation-adjusted (real) returns.
 * Update annually with official MOSPI data.
 */
export const CPI_DATA: Record<number, number> = {
  2012: 100.0,
  2013: 110.1,
  2014: 117.2,
  2015: 123.0,
  2016: 129.3,
  2017: 133.5,
  2018: 138.5,
  2019: 143.3,
  2020: 152.5,
  2021: 160.3,
  2022: 171.2,
  2023: 180.5,
  2024: 189.8,
  2025: 199.3, // Estimated
  2026: 209.2, // Estimated - Update when official data available
};

// Average annual inflation rate (use when exact CPI unavailable)
export const DEFAULT_INFLATION_RATE = 0.06; // 6% per annum

// ============================================================================
// DEFAULT ASSUMPTIONS FOR CALCULATORS
// ============================================================================
export const CALCULATOR_DEFAULTS = {
  // Making charges range (for jewellery)
  MAKING_CHARGES: {
    MIN: 0.06,    // 6%
    MAX: 0.15,    // 15%
    DEFAULT: 0.10, // 10%
  },
  
  // Jeweller buyback discount (typical)
  BUYBACK_DISCOUNT: {
    MIN: 0.02,    // 2%
    MAX: 0.10,    // 10%
    DEFAULT: 0.05, // 5%
  },
  
  // Hallmarking fee
  HALLMARKING_FEE: 45, // ₹45 per article
  
  // Price sanity checks
  SANITY_CHECKS: {
    // Minimum realistic silver price (₹/gram) - if below, show warning
    MIN_REALISTIC_PRICE: 50,
    // Maximum realistic price ratio (current/purchase) before warning
    MAX_PRICE_RATIO: 50,
    // Minimum holding period (days) for CAGR to be meaningful
    MIN_CAGR_DAYS: 365,
  },
  
  // Display limits
  DISPLAY_LIMITS: {
    MAX_PERCENTAGE_DISPLAY: 99999, // Cap percentage display
    MAX_ANNUALIZED_DISPLAY: 1000,  // Cap annualized return display %
  },
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get CPI value for a specific year
 */
export function getCPI(year: number): number | null {
  return CPI_DATA[year] ?? null;
}

/**
 * Calculate inflation rate between two years using CPI
 */
export function getInflationRate(startYear: number, endYear: number): number | null {
  const startCPI = getCPI(startYear);
  const endCPI = getCPI(endYear);
  
  if (!startCPI || !endCPI) return null;
  
  return (endCPI - startCPI) / startCPI;
}

/**
 * Calculate annual inflation rate between two years
 */
export function getAnnualInflationRate(startYear: number, endYear: number): number | null {
  const startCPI = getCPI(startYear);
  const endCPI = getCPI(endYear);
  
  if (!startCPI || !endCPI || startYear === endYear) return null;
  
  const years = endYear - startYear;
  return Math.pow(endCPI / startCPI, 1 / years) - 1;
}

/**
 * Determine if a holding period qualifies for LTCG
 */
export function isLTCG(holdingDays: number): boolean {
  const holdingMonths = holdingDays / 30.44; // Average days per month
  return holdingMonths >= TAX_CONFIG.LTCG_HOLDING_PERIOD_MONTHS;
}

/**
 * Calculate tax at slab rate (simplified - New Regime)
 */
export function calculateSlabTax(taxableIncome: number, totalIncome: number): number {
  // Use simplified approach - assume gain is marginal income
  // In real scenario, need full income details
  const slabs = TAX_CONFIG.NEW_REGIME_SLABS;
  
  // Find the applicable slab based on total income
  for (let i = slabs.length - 1; i >= 0; i--) {
    const slab = slabs[i];
    if ('above' in slab && totalIncome > slab.above) {
      return taxableIncome * slab.rate;
    }
    if ('upto' in slab && totalIncome <= slab.upto) {
      continue;
    }
    if ('upto' in slab && totalIncome > slab.upto) {
      return taxableIncome * slab.rate;
    }
  }
  
  return 0;
}

/**
 * Format currency in Indian format
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercent(value: number, decimals: number = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TaxCalculationResult {
  assetType: string;
  purchaseDate: string;
  saleDate: string;
  purchasePrice: number;
  salePrice: number;
  holdingDays: number;
  holdingMonths: number;
  isLTCG: boolean;
  taxType: 'LTCG' | 'STCG';
  capitalGain: number;
  indexedCost: number | null;
  taxableGain: number;
  taxRate: number;
  taxBeforeCess: number;
  cess: number;
  totalTax: number;
  netProceeds: number;
  effectiveTaxRate: number;
  disclaimer: string;
}

export interface RealReturnResult {
  nominalReturn: number;
  nominalReturnPercent: number;
  inflationRate: number;
  realReturn: number;
  realReturnPercent: number;
  inflationSource: 'CPI' | 'Default';
  holdingPeriod: string;
  warning: string | null;
}

export interface BreakEvenResult {
  purchasePrice: number;
  makingCharges: number;
  gst: number;
  otherFees: number;
  totalCost: number;
  breakEvenPrice: number;
  currentPrice: number;
  difference: number;
  differencePercent: number;
  isAboveBreakEven: boolean;
  buybackScenario: 'market' | 'jeweller';
  buybackDiscount: number;
  adjustedBreakEven: number | null;
}
