import { NextResponse } from "next/server";
import { getSilverPriceWithChange } from "@/lib/metalApi";
import { updateDailyExtremes, type DailyExtremes } from "@/lib/priceStorage";

// ============================================================================
// NOTE ON EDGE RUNTIME
// ============================================================================
// Cannot use Edge Runtime because metalApi uses:
// - priceStorage.ts which requires Node.js `fs` module
// - Dynamic imports for server-side storage
// 
// To enable Edge Runtime, you would need to:
// 1. Remove file system storage (use external DB like KV/Redis instead)
// 2. OR create a separate lightweight API that only fetches fresh prices
// ============================================================================

// ISR: Cache for 60 seconds at Edge
// Data-layer caching via unstable_cache handles external API calls
// Daily extremes tracking still works on cache misses
export const revalidate = 60;

// Extended response type with daily extremes
interface PriceResponse {
  pricePerGram: number;
  pricePerKg: number;
  pricePer10Gram: number;
  pricePerTola: number;
  currency: string;
  timestamp: string;
  change24h: number;
  changePercent24h: number;
  high24h: number;
  low24h: number;
  source: string;
  usdInr?: number;
  comexUsd?: number;
  // Daily extremes - actual tracked high/low for today
  todayHigh?: number;
  todayHighTime?: string;
  todayLow?: number;
  todayLowTime?: string;
  todayOpen?: number;
}

// This route returns the current silver price with 24h change
// Called by client-side polling every 30 seconds
export async function GET() {
  try {
    const price = await getSilverPriceWithChange();
    
    // If API fails, return 503 Service Unavailable
    if (!price) {
      return NextResponse.json(
        {
          error: "Service unavailable",
          message: "Unable to fetch live price data from external sources. Please try again later.",
        },
        { status: 503 }
      );
    }
    
    // Update and get daily extremes (tracks actual high/low for today)
    let extremes: DailyExtremes | null = null;
    try {
      extremes = await updateDailyExtremes(price.pricePerGram);
    } catch (extremesError) {
      console.error("Error updating daily extremes:", extremesError);
    }
    
    // Build response with daily extremes
    const response: PriceResponse = {
      ...price,
      // Override with actual tracked values if available
      todayHigh: extremes?.high,
      todayHighTime: extremes?.highTime,
      todayLow: extremes?.low,
      todayLowTime: extremes?.lowTime,
      todayOpen: extremes?.openPrice,
    };
    
    return NextResponse.json(response, {
      headers: {
        // Cache at Edge for 60s, serve stale while revalidating for up to 120s
        // This provides near-real-time data while reducing Edge Requests by ~95%
        // Note: Daily extremes tracking still works via updateDailyExtremes() call above
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    console.error("Error fetching price:", error);
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
