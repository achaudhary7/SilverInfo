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

// Force dynamic - no caching for real-time prices
export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        // Prevent browser/CDN caching for real-time data
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
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
