/**
 * Home Price Snapshot
 *
 * Local snapshot data used by the home page to avoid runtime API calls.
 * Update this file manually when you want to refresh visible prices.
 */

export interface SnapshotPrice {
  pricePerGram: number;
  pricePerKg: number;
  pricePer10Gram: number;
  pricePerTola: number;
  currency: "INR";
  timestamp: string;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  source: "snapshot";
  usdInr: number;
  comexUsd: number;
}

export interface SnapshotCityPrice {
  city: string;
  state: string;
  pricePerGram: number;
  pricePerKg: number;
  makingCharges: number;
  gst: number;
}

interface CityConfig {
  city: string;
  state: string;
  premiumPerGram: number;
  makingCharges: number;
  gst: number;
}

const TOLA_TO_GRAM = 11.6638;

// Update these values whenever you want to refresh homepage prices.
export const HOME_PRICE_SNAPSHOT: SnapshotPrice = {
  pricePerGram: 292.99,
  pricePerKg: 292990,
  pricePer10Gram: 2929.9,
  pricePerTola: Number((292.99 * TOLA_TO_GRAM).toFixed(2)),
  currency: "INR",
  timestamp: "2026-02-04T12:00:00.000Z",
  change24h: 22.35,
  changePercent24h: 8.26,
  high24h: 299.4,
  low24h: 268.75,
  source: "snapshot",
  usdInr: 90.14,
  comexUsd: 89.9,
};

const CITY_CONFIG: CityConfig[] = [
  { city: "Mumbai", state: "Maharashtra", premiumPerGram: 0, makingCharges: 8, gst: 3 },
  { city: "Delhi", state: "Delhi", premiumPerGram: 0.2, makingCharges: 10, gst: 3 },
  { city: "Ahmedabad", state: "Gujarat", premiumPerGram: 0.3, makingCharges: 7, gst: 3 },
  { city: "Pune", state: "Maharashtra", premiumPerGram: 0.4, makingCharges: 9, gst: 3 },
  { city: "Surat", state: "Gujarat", premiumPerGram: 0.35, makingCharges: 7, gst: 3 },
  { city: "Jaipur", state: "Rajasthan", premiumPerGram: 0.5, makingCharges: 6, gst: 3 },
  { city: "Bangalore", state: "Karnataka", premiumPerGram: 0.6, makingCharges: 10, gst: 3 },
  { city: "Hyderabad", state: "Telangana", premiumPerGram: 0.55, makingCharges: 10, gst: 3 },
  { city: "Kolkata", state: "West Bengal", premiumPerGram: 0.7, makingCharges: 8, gst: 3 },
  { city: "Chennai", state: "Tamil Nadu", premiumPerGram: 0.8, makingCharges: 12, gst: 3 },
  { city: "Lucknow", state: "Uttar Pradesh", premiumPerGram: 0.65, makingCharges: 8, gst: 3 },
  { city: "Chandigarh", state: "Punjab", premiumPerGram: 0.55, makingCharges: 9, gst: 3 },
  { city: "Indore", state: "Madhya Pradesh", premiumPerGram: 0.6, makingCharges: 8, gst: 3 },
  { city: "Bhopal", state: "Madhya Pradesh", premiumPerGram: 0.7, makingCharges: 8, gst: 3 },
  { city: "Nagpur", state: "Maharashtra", premiumPerGram: 0.5, makingCharges: 8, gst: 3 },
  { city: "Patna", state: "Bihar", premiumPerGram: 0.9, makingCharges: 9, gst: 3 },
  { city: "Visakhapatnam", state: "Andhra Pradesh", premiumPerGram: 0.85, makingCharges: 10, gst: 3 },
  { city: "Kochi", state: "Kerala", premiumPerGram: 1.2, makingCharges: 11, gst: 3 },
  { city: "Coimbatore", state: "Tamil Nadu", premiumPerGram: 1, makingCharges: 11, gst: 3 },
  { city: "Thiruvananthapuram", state: "Kerala", premiumPerGram: 1.4, makingCharges: 12, gst: 3 },
];

export function getHomePriceSnapshot(): SnapshotPrice {
  return HOME_PRICE_SNAPSHOT;
}

export function getSnapshotCityPrices(basePricePerGram: number): SnapshotCityPrice[] {
  return CITY_CONFIG.map((config) => {
    const cityPricePerGram = Number((basePricePerGram + config.premiumPerGram).toFixed(2));
    return {
      city: config.city,
      state: config.state,
      pricePerGram: cityPricePerGram,
      pricePerKg: Math.round(cityPricePerGram * 1000),
      makingCharges: config.makingCharges,
      gst: config.gst,
    };
  });
}
