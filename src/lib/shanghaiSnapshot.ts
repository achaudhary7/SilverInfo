/**
 * Shanghai Price Snapshot
 *
 * Local snapshot data for Shanghai-focused pages to avoid runtime API calls.
 * Update via script: npm run update:snapshot -- --comex ... --usdinr ... --usdcny ... --premium ...
 */

export interface ShanghaiSnapshotPrice {
  pricePerKgCny: number;
  pricePerGramCny: number;
  pricePerOzCny: number;
  pricePerOzUsd: number;
  pricePerGramUsd: number;
  pricePerKgUsd: number;
  pricePerGramInr: number;
  pricePerKgInr: number;
  pricePerOzInr: number;
  indiaRatePerGram: number;
  comexUsd: number;
  premiumPercent: number;
  premiumUsd: number;
  usdCny: number;
  usdInr: number;
  cnyInr: number;
  marketStatus: "open" | "closed" | "pre-market";
  marketSession: string;
  timestamp: string;
  source: "snapshot";
  change24hPercent: number;
  change24hCny: number;
  isEstimate: true;
  disclaimer: string;
  officialSgeUrl: string;
}

export const SHANGHAI_PRICE_SNAPSHOT: ShanghaiSnapshotPrice = {
  pricePerKgCny: 7215.58,
  pricePerGramCny: 7.22,
  pricePerOzCny: 224.43,
  pricePerOzUsd: 32.47,
  pricePerGramUsd: 1.04,
  pricePerKgUsd: 1040,
  pricePerGramInr: 90.25,
  pricePerKgInr: 90194.75,
  pricePerOzInr: 2805.38,
  indiaRatePerGram: 107.47,
  comexUsd: 31.2,
  premiumPercent: 4.08,
  premiumUsd: 1.27,
  usdCny: 6.912,
  usdInr: 86.4,
  cnyInr: 12.5,
  marketStatus: "open",
  marketSession: "Snapshot Session",
  timestamp: "2026-02-11T17:49:20.852Z",
  source: "snapshot",
  change24hPercent: 0,
  change24hCny: 0,
  isEstimate: true,
  disclaimer: "Snapshot estimate based on COMEX + configured Shanghai premium. For official rates, verify on SGE.",
  officialSgeUrl: "https://en.sge.com.cn/data_SilverBenchmarkPrice",
};

export function getShanghaiSnapshotPrice(): ShanghaiSnapshotPrice {
  return SHANGHAI_PRICE_SNAPSHOT;
}
